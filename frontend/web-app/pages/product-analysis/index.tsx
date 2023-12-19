import UserContext from "@/context/store";
import { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import { Input, Button, Card } from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";

const TABLE_HEAD = ["Name", "Help Count", "Avg. Rate", ""];

export default function ProductAnalysis() {
  const { user, setUser } = useContext(UserContext);
  const [productId, setProductId] = useState("");
  const onChange = ({ target }) => setProductId(target.value);
  const [statistics, setStatistics] = useState({ sale: 0, scan: 0 });

  function searchProduct() {
    Promise.all([
      fetch(`http://localhost:3005/statistics/scan/${productId}`, {
        credentials: "include",
        method: "GET",
      })
        .then((data) => data.json())
        .then((data) => console.log(data)),
      fetch(`http://localhost:3005/statistics/sale/${productId}`, {
        credentials: "include",
        method: "GET",
      })
        .then((data) => data.json())
        .then((data) => console.log(data)),
      ,
    ]).then(() => toast.success("Retrieved Product Analysis!"));
  }

  return (
    <>
      <Card className="mx-1 my-1 h-full">
        <div className="relative flex w-[90%] mx-auto max-w-[24rem] mt-4 mb-4">
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
      </Card>
      <Toaster></Toaster>
    </>
  );
}
