import UserContext from "@/context/store";
import { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import { Input, Button, Card } from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";
import PieChart from "@/components/ui/PieChart";

const TABLE_HEAD = ["Name", "Help Count", "Avg. Rate", ""];

export default function ProductAnalysis() {
  const [productId, setProductId] = useState("");
  const onChange = ({ target }) => setProductId(target.value);
  const [statistics, setStatistics] = useState({ sale: 0, scan: 0 });
  const [chosenProducts, setChosenProducts] = useState([]);
  const [chartConfig, setChartConfig] = useState({
    type: "bar",
    height: 240,
    series: [
      {
        name: "Sales",
        data: [],
      },
      {
        name: "Scans",
        data: [],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617", "#616161"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  });

  function searchProduct() {
    let productStats = { numOfSales: null, numOfScans: null, productId: null };
    console.log(productId);
    fetch(`http://localhost:3005/statistics/scan/${productId}`, {
      credentials: "include",
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        productStats = { ...productStats, numOfScans: data.length };
      })
      .then(() => {
        fetch(`http://localhost:3005/statistics/sale/${productId}`, {
          credentials: "include",
          method: "GET",
        })
          .then((data) => data.json())
          .then((data) => {
            productStats = {
              ...productStats,
              numOfSales: data.length,
              productId,
            };
            return productStats;
          })
          .then((productStats) => {
            console.log(productStats);
            setChosenProducts((prev) => [...prev, productStats]);
            setChartConfig((prev) => {
              const toReturn = { ...prev };
              toReturn.series[0].data.push(productStats.numOfSales);
              toReturn.series[1].data.push(productStats.numOfScans);
              toReturn.options.xaxis.categories.push(
                productStats.productId.slice(0, 6) + "..."
              );

              return toReturn;
            });
          });
      });
  }
  return (
    <>
      <Card className="mx-1 my-1 h-full">
        <div className="relative flex w-[90%] mx-auto max-w-[24rem] mt-4 mb-8">
          <Input
            type="string"
            label="Product Id"
            value={productId}
            onChange={onChange}
            className="pr-20"
            containerProps={{
              className: "min-w-0",
            }}
          />
          <Button
            size="sm"
            color={productId ? "gray" : "blue-gray"}
            disabled={!productId}
            className="!absolute right-1 top-1 rounded"
            onClick={() => searchProduct()}
          >
            Search
          </Button>
        </div>

        <PieChart
          key={chosenProducts.length}
          chartConfig={chartConfig}
        ></PieChart>
      </Card>
      <Toaster></Toaster>
    </>
  );
}
