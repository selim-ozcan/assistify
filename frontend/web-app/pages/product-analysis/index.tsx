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
  const [products, setProducts] = useState([]);
  const [statistics, setStatistics] = useState({
    sale: 0,
    scan: 0,
    question: 0,
  });
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
      {
        name: "Questions",
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
      colors: ["#020617", "#616161", "#314194"],
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

  useEffect(() => {
    fetch(`http://localhost:3000/products`, {
      credentials: "include",
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => setProducts(data));
  }, []);

  async function searchProduct(productId?: string) {
    let productStats = {
      numOfSales: null,
      numOfScans: null,
      numOfQuestions: null,
      productId: null,
    };

    const scanData = await fetch(
      `http://localhost:3005/statistics/scan/${productId}`,
      {
        credentials: "include",
        method: "GET",
      }
    )
      .then((data) => data.json())
      .catch((e) => console.log(e.message));

    productStats = { ...productStats, numOfScans: scanData.length };

    const saleData = await fetch(
      `http://localhost:3005/statistics/sale/${productId}`,
      {
        credentials: "include",
        method: "GET",
      }
    ).then((data) => data.json());

    productStats = {
      ...productStats,
      numOfSales: saleData.length,
    };

    const questionData = await fetch(
      `http://localhost:3005/statistics/question/${productId}`,
      {
        credentials: "include",
        method: "GET",
      }
    ).then((data) => data.json());

    productStats = {
      ...productStats,
      numOfQuestions: questionData.length,
      productId,
    };

    setChosenProducts((prev) => [...prev, productStats]);
    setChartConfig((prev) => {
      const toReturn = { ...prev };
      toReturn.series[0].data.push(productStats.numOfSales);
      toReturn.series[1].data.push(productStats.numOfScans);
      toReturn.series[2].data.push(productStats.numOfQuestions);
      toReturn.options.xaxis.categories.push(
        productStats.productId.slice(0, 6) + "..."
      );

      return toReturn;
    });
  }
  return (
    <>
      <Card className="mx-1 my-1 h-full">
        <div className="relative flex w-[90%] mx-auto max-w-[24rem] mt-4 mb-2">
          <Input
            type="string"
            label="Enter Product Id"
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
            onClick={async () => {
              await searchProduct();
            }}
          >
            Search
          </Button>
        </div>
        <h2 className="text-center">or, choose from the list below</h2>
        <div className="w-[90%] overflow-scroll mx-auto h-48 border border-black rounded-md">
          {products.map((product) => (
            <button
              className={`bg-opacity-50 my-1 border p-1 border-black rounded-md ml-1 h-10 w-[98%] overflow-scroll ${
                chosenProducts.findIndex((p) => p.productId === product._id) !==
                -1
                  ? "bg-light-blue-200"
                  : "bg-light-green-100"
              }`}
              key={product._id}
              onClick={async () => {
                setProductId(product._id);
                await searchProduct(product._id);
              }}
            >
              <span className="italic">
                {product._id.slice(0, 7).concat("....")}
              </span>
              <span className="mx-1 font-bold capitalize text-sm">
                {product.type}
              </span>
              {product.colors.map((color) => (
                <span
                  className=" mr-1 last:mr-0 text-sm"
                  key={color}
                >{`${color}, `}</span>
              ))}
              <span className="font-bold text-sm">{product.price}$</span>
            </button>
          ))}
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
