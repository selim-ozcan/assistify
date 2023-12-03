import UserContext from "@/context/store";
import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
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

  useEffect(() => {
    socket.connect();
    function listener(data) {
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
