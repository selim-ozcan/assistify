import UserContext from "@/context/store";
import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import { Card, CardBody, CardHeader } from "@material-tailwind/react";

export default function Queue() {
  const { user, setUser } = useContext(UserContext);
  const [clicked, setClicked] = useState({ userId: null });
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    socket.connect();
    function listener(data) {
      console.log(data);
      setQueue((prev) => [...prev, data]);
    }
    socket.on("help-requested", listener);

    return () => {
      socket.off("help-requested", listener);
    };
  }, []);

  function onHelpComing(userId) {
    setClicked({ userId });
    setTimeout(() => {
      setQueue(queue.filter((el) => el.userId !== userId));
      setClicked({ userId: null });
    }, 1000);

    socket.emit("help-coming", { employeeId: user.userId });
  }

  return (
    <Card className="h-[74vh] my-2 mx-2 items-center py-4">
      Awaiting Customers Will Be Listed Here
      {queue.map((el, index) => {
        console.log(el);
        return (
          <button
            key={index}
            onClick={() => onHelpComing(el.userId)}
            className={`$w-3/4 h-12 inline-block bg-[#cbdca9] m-2 text-center rounded-md px-4 text-black transition-all ${
              clicked.userId === el.userId ? "translate-x-8 opacity-0" : ""
            }`}
          >
            {`${el.email.slice(0, 6) + "******.com"} `}
            <br />
            {`requested help to shelf: ${el.shelf}`}
          </button>
        );
      })}
    </Card>
  );
}
