import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";

export default function HelpElement({
  el,
  clicked,
  lastAnsweredQuestion,
  requestType,
  onHelpButtonClick,
  queue,
  userId,
  shelf,
  setQueue,
  setQuickHelpDialogOpen,
}) {
  const { seconds, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      setQuickHelpDialogOpen(false);
      setQueue(
        queue.filter((el) => !(el.userId === userId && el.shelf === shelf))
      );
    },
  });
  useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 60);
    restart(time);
  }, [restart]);

  const incomingRequestType =
    el.quickQuestion === "" ||
    el.quickQuestion === null ||
    el.quickQuestion === undefined
      ? "facetoface"
      : "quick";

  if (incomingRequestType === requestType)
    return (
      <button
        onClick={() => onHelpButtonClick(el.userId, el.shelf)}
        className={`$w-3/4 h-12 inline-block shadow-md shadow-blue-gray-900 ${
          seconds > 0 && seconds <= 5 ? "!bg-red-400" : ""
        } ${
          requestType === "facetoface" ? "bg-[#cbdca9]" : "bg-teal-200"
        } m-2 text-center rounded-md px-4 text-black transition-all ${
          requestType === "facetoface"
            ? clicked.userId === el.userId && clicked.shelf === el.shelf
              ? "translate-x-8 opacity-0"
              : ""
            : lastAnsweredQuestion.userId === el.userId &&
              lastAnsweredQuestion.shelf === el.shelf
            ? "translate-x-8 opacity-0"
            : ""
        }`}
      >
        {incomingRequestType === "facetoface"
          ? `${el.email.slice(0, 6) + "*****.com"}`
          : ""}

        {incomingRequestType === "quick" ? (
          `Tap to see question of
                  ${el.email.slice(0, 6) + "*****.com"} (${seconds} s)`
        ) : (
          <>
            {" "}
            <span>requested help</span>
            <br />
            <span className="">{` from shelf: ${el.shelf} (${seconds} s)`}</span>
          </>
        )}
      </button>
    );
}
