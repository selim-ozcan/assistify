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
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import StarRating from "@/components/ui/StarRating";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import toast, { Toaster } from "react-hot-toast";
import { createHook } from "async_hooks";

type ProductProps = {
  product: Product;
};

const quickQuestions = [
  "asdfa asdfas sfafasf asdfasfa?",
  "adfa asdfa sf asdfa asdf?",
  "qaf asasfasdf asdfas ads?",
  "sadfadf asdfasf afd?",
  "asfa asdfas adf sdff?",
];

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
  const [openPopover, setOpenPopover] = useState(false);
  const [openQuickHelpPopover, setOpenQuickHelpPopover] = useState(false);
  const router = useRouter();
  const [chosenQuickQuestion, setChosenQuickQuestion] = useState(null);
  const [textQuickQuestion, setTextQuickQuestion] = useState("");
  const [quickAnswerSeen, setQuickAnswerSeen] = useState(false);
  const [quickAnswerArrived, setQuickAnswerArrived] = useState(false);
  const [showQuickAnswer, setShowQuickAnswer] = useState(false);
  const [quickAnswer, setQuickAnswer] = useState(null);

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };

  const { seconds, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      if (!helpComing) {
        setHelpRequested(false);
        setHelpComing(false);
      }
    },
  });

  useEffect(() => {
    function listener(data) {
      setHelpingEmployeeId(data.employeeId);
      setVisible(false);
      setHelpComing(true);
      if (
        data.quickAnswer !== null &&
        data.quickAnswer !== undefined &&
        data.quickAnswer !== ""
      ) {
        toast.success(
          `${
            data.email.slice(0, 6) + "******.com"
          } has answered your question!`,
          { duration: 4000 }
        );
        setQuickAnswerArrived(true);
        setQuickAnswerSeen(false);
        setQuickAnswer(data.quickAnswer);
      }
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
      toast.success(`Thanks for rating!`);
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

  function sendQuickQuestion() {
    let question;
    if (textQuickQuestion !== "") {
      question = textQuickQuestion;
    } else if (chosenQuickQuestion !== null) {
      question = quickQuestions[chosenQuickQuestion];
    }

    setHelpRequested((prev) => !prev);

    socket.emit("help-requested", {
      userId: user.userId,
      shelf: product.shelf,
      email: user.email,
      quickQuestion: question,
    });

    const time = new Date();
    time.setSeconds(time.getSeconds() + 15);
    restart(time);

    setOpenPopover(false);
    setOpenQuickHelpPopover(false);
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
          <Popover open={openPopover} handler={setOpenPopover}>
            <PopoverHandler {...triggers}>
              <Button
                disabled={helpRequested || helpComing}
                ripple={false}
                fullWidth={true}
                className={` text-black bg-blue-gray-200 mx-auto w-2/3 shadow-none  hover:shadow-none  focus:shadow-none active:scale-100
                ${
                  helpRequested
                    ? helpComing
                      ? "bg-blue-400"
                      : seconds > 0 && seconds <= 5
                      ? "bg-red-400"
                      : "bg-green-500"
                    : "bg-blue-gray-200"
                } ${
                  openPopover
                    ? "bg-blue-gray-50 border-blue-gray-800 border"
                    : ""
                }
                ${visible ? "" : "hidden"}`}
              >
                {helpRequested
                  ? `Help Requested: ${seconds} s`
                  : "Request Help"}
              </Button>
            </PopoverHandler>
            <PopoverContent
              {...triggers}
              className="z-[80] w-[22rem] bg-gradient-to-br from-light-green-400 to-teal-400 shadow-lg shadow-blue-gray-700 border border-green-900 py-3"
            >
              <div className="mb-0 mt-0 py-0 flex items-center justify-between gap-4">
                <Button
                  className={`border border-green-900 bg-blue-gray-50 text-black mx-auto w-2/5  active:scale-100 normal-case  `}
                  onClick={() => {
                    setOpenPopover(false);
                    requestHelp();
                  }}
                >
                  Face to Face
                </Button>
                <Popover>
                  <PopoverHandler
                    onClick={() => {
                      setOpenQuickHelpPopover(true);
                    }}
                  >
                    <Button
                      className={`border border-green-900 bg-blue-gray-50 text-black mx-auto w-2/5  normal-case active:scale-100 
                   `}
                    >
                      Quick Help
                    </Button>
                  </PopoverHandler>
                  <PopoverContent className="z-[150] w-[20rem] -mx-10 -my-4 bg-light-green-600 shadow-lg text-center shadow-blue-gray-700 border border-green-900 bg-gradient-to-br from-light-green-600 to-teal-600">
                    <h2 className="text-blue-gray-50 ">
                      Select a question from the list below
                    </h2>
                    <div className="max-h-40 overflow-scroll  border border-black rounded-md mt-2 mb-2 px-1">
                      {quickQuestions.map((question, index) => (
                        <Button
                          onClick={() => setChosenQuickQuestion(index)}
                          key={index}
                          className={`mt-2 inline-block w-full normal-case first-letter:uppercase bg-blue-gray-900 last:mb-2 ${
                            index === chosenQuickQuestion
                              ? "bg-gradient-to-br from-light-green-400 to-light-green-700 border  border-white"
                              : ""
                          }`}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                    <h4 className="text-blue-gray-50 mb-1">Or,</h4>

                    <Textarea
                      onChange={(e) => setTextQuickQuestion(e.target.value)}
                      label={"Write your own question"}
                      className="!bg-blue-gray-50 max-h-20"
                    ></Textarea>
                    <Button
                      onClick={() => sendQuickQuestion()}
                      className={`bg-blue-gray-900 ${
                        chosenQuickQuestion === null && textQuickQuestion === ""
                          ? "disabled"
                          : ""
                      }`}
                    >
                      Send
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            ripple={false}
            fullWidth={true}
            className={` text-black mx-auto w-2/3  shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 ${
              rate ? "hidden" : ""
            } ${"bg-orange-300"} ${helpComing ? "" : "hidden"} ${
              quickAnswerArrived && !quickAnswerSeen ? "bg-teal-200" : ""
            }`}
            onClick={() => {
              if (quickAnswerArrived && !quickAnswerSeen) {
                setShowQuickAnswer(true);
              } else if (quickAnswerArrived && quickAnswerSeen) {
                setShowRating(true);
              } else if (!quickAnswerArrived) {
                setShowRating(true);
              }
            }}
          >
            {quickAnswerArrived && !quickAnswerSeen ? "See Quick Response" : ""}
            {quickAnswerArrived && quickAnswerSeen
              ? "Rate your experience"
              : ""}
            {!quickAnswerArrived ? "Rate your experience" : ""}
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
      <Dialog
        open={showQuickAnswer}
        handler={() => {
          setQuickAnswerSeen(true);
          setShowQuickAnswer(false);
        }}
      >
        <DialogHeader className="flex justify-center">
          Your question is replied!
        </DialogHeader>
        <DialogBody className="flex justify-center flex-col items-center">
          <span className="italic font-extralight">Your question:</span>
          <div className="mt-4 p-1 self-start border rounded-md border-light-green-600 w-[95%] mx-auto  shadow-md shadow-blue-gray-600 mb-4">
            <Typography variant="h5" className="capitalize text-blue-gray-900">
              &rarr;{" "}
              {chosenQuickQuestion !== null
                ? quickQuestions[chosenQuickQuestion]
                : textQuickQuestion}
            </Typography>
          </div>
          <span className="italic font-extralight">And the answer is:</span>
          <div className="mt-4 p-1 self-start border rounded-md border-light-green-600 w-[95%] mx-auto  shadow-md shadow-blue-gray-600">
            <Typography variant="h5" className="capitalize text-blue-gray-900">
              &rarr; {quickAnswer}
            </Typography>
          </div>
          <Button
            onClick={() => {
              setQuickAnswerSeen(true);
              setShowQuickAnswer(false);
            }}
            className="mt-8 mb-4 normal-case"
          >
            Got It 👍🏻
          </Button>
        </DialogBody>
      </Dialog>
      <div
        className={`absolute top-0 left-0 w-screen h-screen bg-blue-gray-50 z-[70] opacity-50 ${
          openPopover ? "" : "hidden"
        }`}
      ></div>
    </div>
  );
}