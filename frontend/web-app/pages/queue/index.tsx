import UserContext from "@/context/store";
import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import Image from "next/image";
import {
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  DialogFooter,
  Textarea,
  Radio,
} from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";

export default function Queue() {
  const { user, setUser } = useContext(UserContext);
  const [clicked, setClicked] = useState({ userId: null });
  const [queue, setQueue] = useState([]);
  const [requestType, setRequestType] = useState("quick");
  const [quickHelpDialogOpen, setQuickHelpDialogOpen] = useState(false);
  const [quickQuestionAnswer, setQuickQuestionAnswer] = useState("");
  const [lastAnsweredQuestion, setLastAnsweredQuestion] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    socket.connect();
    function listener(data) {
      if (data.product !== null && data.product !== undefined)
        setProduct(data.product);
      setQueue((prev) => [...prev, data]);
    }
    socket.on("help-requested", listener);

    return () => {
      socket.off("help-requested", listener);
    };
  }, []);

  function onHelpButtonClick(userId) {
    if (requestType === "quick") {
      onQuickHelpDialogOpen(userId);
    }
    if (requestType === "facetoface") {
      onHelpComing(userId);
    }
  }

  function onQuickHelpDialogOpen(userId) {
    setClicked({ userId });
    setQuickHelpDialogOpen((prev) => !prev);
  }

  function onHelpComing(userId) {
    setClicked({ userId });
    setTimeout(() => {
      setQueue(queue.filter((el) => el.userId !== userId));
      setClicked({ userId: null });
    }, 1000);

    socket.emit("help-coming", { employeeId: user.userId });
  }

  function onSendQuickAnswer(userId) {
    if (quickQuestionAnswer !== null && quickQuestionAnswer !== "") {
      setLastAnsweredQuestion(userId);
      socket.emit("help-coming", {
        employeeId: user.userId,
        email: user.email,
        quickAnswer: quickQuestionAnswer,
      });
      setQuickHelpDialogOpen(false);
      toast.success("Answer sent successfully");
    }
  }

  return (
    <>
      <Toaster></Toaster>
      <Card className="h-[74vh] my-2 mx-2 items-center py-4">
        <h2 className="mb-2">Awaiting Customers Will Be Listed Here</h2>

        <ButtonGroup className="normal-case">
          <Button
            className="normal-case p-2"
            onClick={() => setRequestType("quick")}
          >
            Quick Help
          </Button>
          <Button
            className="normal-case p-2"
            onClick={() => setRequestType("facetoface")}
          >
            Face to Face
          </Button>
        </ButtonGroup>

        {queue.map((el, index) => {
          const incomingRequestType =
            el.quickQuestion === "" ||
            el.quickQuestion === null ||
            el.quickQuestion === undefined
              ? "facetoface"
              : "quick";

          if (incomingRequestType === requestType)
            return (
              <button
                key={index}
                onClick={() => onHelpButtonClick(el.userId)}
                className={`$w-3/4 h-12 inline-block shadow-md shadow-blue-gray-900 ${
                  requestType === "facetoface" ? "bg-[#cbdca9]" : "bg-teal-200"
                } m-2 text-center rounded-md px-4 text-black transition-all ${
                  requestType === "facetoface"
                    ? clicked.userId === el.userId
                      ? "translate-x-8 opacity-0"
                      : ""
                    : lastAnsweredQuestion === el.userId
                    ? "translate-x-8 opacity-0"
                    : ""
                }`}
              >
                {incomingRequestType === "facetoface"
                  ? `${el.email.slice(0, 6) + "******.com"}`
                  : ""}

                {incomingRequestType === "quick" ? (
                  `Tap to see question from:
                  ${el.email.slice(0, 6) + "******.com"} `
                ) : (
                  <>
                    {" "}
                    <span>requested help</span>
                    <br />
                    <span className="">{` from shelf: ${el.shelf}`}</span>
                  </>
                )}
              </button>
            );
        })}
      </Card>
      <Dialog
        open={quickHelpDialogOpen}
        handler={() => setQuickHelpDialogOpen(null)}
      >
        <DialogHeader className="flex justify-center">
          Answer quick question
        </DialogHeader>
        <DialogBody className="flex justify-center flex-col items-center">
          <Typography variant="h6">
            {`${
              queue
                .find((q) => clicked.userId === q.userId)
                ?.email.slice(0, 6) + "******.com"
            }`}{" "}
            <span className="italic font-extralight">asks:</span>
          </Typography>

          <div className="mt-4 p-1 self-start border rounded-md border-light-green-600 w-[95%] mx-auto  shadow-md shadow-blue-gray-600">
            <Typography variant="h5" className="capitalize text-blue-gray-900">
              &rarr;{" "}
              {queue.find((q) => clicked.userId === q.userId)?.quickQuestion}
            </Typography>
          </div>
          <span className="italic font-extralight mt-2">About Product:</span>
          {product && (
            <Card
              key={product._id}
              className="w-[95%] flex-row mt-2 mb-2 mr-2 ml-2 bg-gradient-to-br from-blue-gray-100 to-blue-gray-50 text-black shadow-lg shadow-blue-gray-300 border border-blue-gray-900 justify-between"
            >
              <CardHeader
                shadow={false}
                floated={false}
                className="m-1 ml-2 mt-2 mb-2 p-0 w-[25%] shrink-0 rounded-md bg-blue-gray-0"
              >
                <Image
                  src={product.images[0]}
                  width={50}
                  height={50}
                  alt="card-image"
                  className="h-[85px] rounded-md w-[85px] border-2  border-blue-gray-900"
                />
              </CardHeader>
              <CardBody className="p-2 flex align-middle justify-between w-[70%]">
                <div className="flex flex-col">
                  <Typography
                    variant="h7"
                    color="gray"
                    className="mb-1 uppercase"
                  >
                    {product.type}
                  </Typography>
                  <div className="flex-col justify-between ">
                    {Object.entries(product).map(([key, value], index) => {
                      if (
                        key !== "_id" &&
                        key !== "images" &&
                        key !== "__v" &&
                        key !== "type" &&
                        key !== "price" &&
                        key !== "stocks" &&
                        key !== "shelf"
                      )
                        if (key === "colors") {
                          return (
                            <div
                              key={index}
                              className="flex -ml-[0.4rem] mt-1"
                              id="colorDiv"
                            >
                              {value.map((color, index) => (
                                <Radio
                                  key={index}
                                  name={color + index}
                                  color={color}
                                  defaultChecked={true}
                                  labelProps={{ className: "px-1 py-1" }}
                                  ripple={true}
                                ></Radio>
                              ))}
                            </div>
                          );
                        } else
                          return (
                            <span
                              key={key}
                              className="first:text-left inline-block w-[60px] text-center first-letter:capitalize"
                            >
                              {Array.isArray(value)
                                ? value.join(", ")
                                : value.toString()}
                            </span>
                          );
                      else return null;
                    })}
                  </div>
                </div>

                {/* <Button
                variant="text"
                className="flex items-center self-center gap-2 p-[4px] px-2 ml-2 text-[10px] border border-blue-gray-800 bg-blue-gray-100 h-12"
                onClick={() => {
                  router.push(`/products/${product._id}`);
                }}
              >
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </Button> */}
              </CardBody>
            </Card>
          )}

          <span className="self-start ml-2 mt-6">Your answer:</span>
          <div className="w-[95%]  mt-1 mb-2">
            <Textarea
              onChange={(e) => setQuickQuestionAnswer(e.target.value)}
              label="Write here"
            ></Textarea>
          </div>

          <Button
            className={`mb-4 ${quickQuestionAnswer === "" ? "disabled" : ""}`}
            onClick={() =>
              onSendQuickAnswer(
                queue.find((q) => clicked.userId === q.userId)?.userId
              )
            }
          >
            Send Answer
          </Button>
        </DialogBody>
        {/* <DialogFooter className="flex justify-center">
         
        </DialogFooter> */}
      </Dialog>
    </>
  );
}
