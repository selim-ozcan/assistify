import UserContext from "@/context/store";
import { socket } from "@/socket";
import { Product } from "@/types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import StarRating from "@/components/ui/StarRating";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import toast, { Toaster } from "react-hot-toast";

type ProductProps = {
  product: Product;
};

export default function Product() {
  const params = useParams();
  const { user, setUser } = useContext(UserContext);
  const [product, setProduct] = useState<Product>();
  const [helpRequested, setHelpRequested] = useState(false);
  const [helpComing, setHelpComing] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rate, setRate] = useState(null);
  const [helpingEmployeeId, setHelpingEmployeeId] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [review, setReview] = useState("");
  const router = useRouter();

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      if (!helpComing) {
        setHelpRequested(false);
        setHelpComing(false);
        console.log("asdasd");
      }
    },
  });

  useEffect(() => {
    function listener(data) {
      setHelpingEmployeeId(data.employeeId);
      setVisible(false);
      setHelpComing(true);
    }

    socket.on("help-coming", listener);

    return () => {
      socket.off("help-coming", listener);
    };
  }, []);

  function requestHelp() {
    setHelpRequested((prev) => !prev);

    socket.emit("help-requested", {
      userId: user.userId,
      shelf: product.shelf,
      email: user.email,
    });

    const time = new Date();
    time.setSeconds(time.getSeconds() + 15);
    restart(time);
  }

  useEffect(() => {
    if (params)
      fetch(`http://localhost:3000/products/${params?.id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setProduct(data));
  }, [params?.id, params]);

  function onRate(rating) {
    setShowRating(false);
    setRate(rating);
    console.log({
      customerId: user.userId,
      employeeId: helpingEmployeeId,
      rate: rating,
    });
    fetch(`http://localhost:3000/rating`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: user.userId,
        employeeId: helpingEmployeeId,
        rate: rating,
        review: review,
      }),
    }).then(() => {
      toast(`Thanks for rating!`);
    });
  }

  function searchSimilarProducts() {
    const query = new URLSearchParams(
      selectedProperties.reduce((acc, curr) => {
        return Object.assign(acc, curr);
      }, {})
    );

    router.push("/products?" + query);
  }

  if (!product) return <h1>loading...</h1>;

  return (
    <div className="relative">
      <Button
        ripple={false}
        fullWidth={true}
        className={` text-black mx-auto w-3/5 border-light-green-500 hover:scale-105 focus:scale-105 transition-all duration-300 bg-opacity-50 shadow-xl shadow-gray-900 ${
          selectedProperties.length > 0
            ? "bg-opacity-50"
            : "opacity-0 invisible"
        } absolute left-[50%] -translate-x-[50%] top-8 z-50 bg-gradient-to-r  from-teal-300 to-teal-200`}
        onClick={() => searchSimilarProducts()}
      >
        {"See similar products"}
      </Button>
      <Card className="h-[75vh] md:w-auto lg:w-6/12 mt-1 mx-1 overflow-scroll">
        <Image
          height={300}
          width={300}
          src={product.image}
          alt="card-image"
          className="mx-auto my-4 rounded-md"
        />

        <CardBody>
          <div className="mb-2 flex items-center justify-between mx-4">
            <Typography
              color="blue-gray"
              className="font-bold capitalize text-lg"
            >
              {product.type}
            </Typography>
            <Typography
              color="blue-gray"
              className="font-extrabold text-lg bg-yellow-200 rounded-full p-2"
            >
              {product.price + " $"}
            </Typography>
          </div>
          <div className="flex flex-col mt-8">
            <div className="px-8 py-2 mb-2 mx-4 border border-teal-200 text-gray-900 rounded-md p-2 flex items-center justify-between bg-gradient-to-r from-light-green-300 to-light-green-200 shadow-md">
              <span>Stock:</span>
              <span className="capitalize">{product.stock}</span>
            </div>
            <div
              className={`px-8 py-2 mb-2 mx-4 border border-teal-200 text-gray-900 rounded-md p-2 flex items-center justify-between shadow-md bg-gradient-to-r transition-all duration-300 ${
                selectedProperties.findIndex((attr) =>
                  attr.hasOwnProperty("size")
                ) !== -1
                  ? "from-teal-300 to-teal-200 scale-105"
                  : "from-light-green-300 to-light-green-200"
              }`}
              onClick={() => {
                setSelectedProperties((prev) => {
                  if (prev.find((attr) => attr.hasOwnProperty("size"))) {
                    return prev.filter((attr) => !attr.hasOwnProperty("size"));
                  } else {
                    return [...prev, { size: product.size }];
                  }
                });
              }}
            >
              <span>Size:</span>
              <span className="capitalize">{product.size}</span>
            </div>
            <div
              className={`px-8 py-2 mb-2 mx-4 border border-teal-200 text-gray-900 rounded-md p-2 flex items-center justify-between shadow-md bg-gradient-to-r from-light-green-300 to-light-green-200 transition-all duration-300 ${
                selectedProperties.findIndex((attr) =>
                  attr.hasOwnProperty("color")
                ) !== -1
                  ? "from-teal-300 to-teal-200 scale-105"
                  : "from-light-green-300 to-light-green-200"
              }`}
              onClick={() => {
                setSelectedProperties((prev) => {
                  if (prev.find((attr) => attr.hasOwnProperty("color"))) {
                    return prev.filter((attr) => !attr.hasOwnProperty("color"));
                  } else {
                    return [...prev, { color: product.color }];
                  }
                });
              }}
            >
              <span>Color:</span>
              <span className="capitalize">{product.color}</span>
            </div>
            <div
              className={`px-8 py-2 mb-2 mx-4 border border-teal-200 text-gray-900 rounded-md p-2 flex items-center justify-between shadow-md bg-gradient-to-r transition-all duration-300 ${
                selectedProperties.findIndex((attr) =>
                  attr.hasOwnProperty("material")
                ) !== -1
                  ? "from-teal-300 to-teal-200 scale-105"
                  : "from-light-green-300 to-light-green-200"
              }`}
              onClick={() => {
                setSelectedProperties((prev) => {
                  if (prev.find((attr) => attr.hasOwnProperty("material"))) {
                    return prev.filter(
                      (attr) => !attr.hasOwnProperty("material")
                    );
                  } else {
                    return [...prev, { material: product.material }];
                  }
                });
              }}
            >
              <span>Material:</span>
              <span className="capitalize">{product.material}</span>
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            disabled={helpRequested || helpComing}
            ripple={false}
            fullWidth={true}
            className={` text-black mx-auto w-2/3 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 ${
              visible ? "" : "hidden"
            } ${
              helpRequested
                ? helpComing
                  ? "bg-blue-400"
                  : seconds > 0 && seconds <= 5
                  ? "bg-red-400"
                  : "bg-green-500"
                : "bg-blue-gray-200"
            }`}
            onClick={() => requestHelp()}
          >
            {helpRequested ? `Help Requested: ${seconds} s` : "Request Help"}
          </Button>
          <Button
            ripple={false}
            fullWidth={true}
            className={` text-black mx-auto w-2/3  shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 ${
              rate ? "hidden" : ""
            } ${"bg-orange-300"} ${helpComing ? "" : "hidden"}`}
            onClick={() => {
              setShowRating(true);
            }}
          >
            Rate your experience
          </Button>
          <Toaster></Toaster>
        </CardFooter>
      </Card>
      <Dialog open={showRating} handler={onRate}>
        <DialogHeader className="flex justify-center">
          Rate our service
        </DialogHeader>
        <DialogBody className="flex justify-center flex-col items-center">
          <StarRating size={36} onSetRating={onRate}></StarRating>
          <br></br>
          <Textarea
            onChange={(e) => setReview(e.target.value)}
            label="Share your review?"
          ></Textarea>
        </DialogBody>
        <DialogFooter className="flex justify-center">
          {/* <Button variant="gradient" color="green" onClick={onRate}>
            <span>Confirm</span>
          </Button> */}
        </DialogFooter>
      </Dialog>
    </div>
  );
}
