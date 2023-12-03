import UserContext from "@/context/store";
import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { Star } from "@/components/ui/StarRating";

const TABLE_HEAD = ["Name", "Help Count", "Avg. Rate", ""];

export default function EmployeeStats() {
  const { user, setUser } = useContext(UserContext);
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [reviewOfUser, setReviewOfUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/rating`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      });

    fetch(`http://localhost:3001/users/all`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  function calculateStats(employeeId) {
    const employeeStats = stats.filter(
      (stat) => stat.employeeId === employeeId
    );
    const totalRatingsForTheEmployee = employeeStats.reduce(
      (prev, curr) => +prev + +curr.rate,
      0
    );
    const averageRatingOfTheEmployee =
      totalRatingsForTheEmployee / employeeStats.length;

    return averageRatingOfTheEmployee.toFixed(2);
  }

  function calculateNumberOfHelped(employeeId) {
    return stats.filter((stat) => stat.employeeId === employeeId).length;
  }

  function onShowReview(id) {
    setReviewOfUser(id);
    setShowReview(true);
  }

  const handleOpen = (id) => {
    if (id) setReviewOfUser(id);
    setShowReview((prev) => !prev);
  };

  return (
    <>
      <Card className="h-[74vh] my-2 mx-2 py-4 w-full overflow-scroll">
        <h2 className="mb-4 text-center">Employee Review Statistics</h2>
        <table className="w-[90%] min-w-max table-auto text-left overflow-scroll mx-2">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 text-center"
                >
                  <Typography
                    variant="small"
                    color="black"
                    className="font-normal leading-none opacity-70 text-sm"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const isLast = index === users.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              if (user.role === "employee") {
                return (
                  <tr key={user._id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold text-center text-xs"
                      >
                        {user.email}
                      </Typography>
                    </td>
                    <td className={`${classes} bg-blue-gray-50/50`}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal text-center text-xs"
                      >
                        {calculateNumberOfHelped(user._id)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal text-center text-xs"
                      >
                        {calculateStats(user._id)}
                      </Typography>
                    </td>
                    <td className={`${classes} bg-blue-gray-50/50`}>
                      <Typography
                        as="a"
                        href="#"
                        variant="small"
                        color="blue-gray"
                        className="font-extrabold text-sm text-center active:text-blue-600"
                        onClick={() => handleOpen(user._id)}
                      >
                        Reviews
                      </Typography>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </Card>
      <Dialog open={showReview} handler={handleOpen} className="relative">
        <DialogBody className="h-[38rem] rounded-md flex flex-col items-center overflow-scroll bg-blue-gray-50">
          <h2 className="font-extrabold">Reviews</h2>
          {stats
            .filter((stat) => stat.employeeId === reviewOfUser)
            .map((review) => (
              <Card
                key={review._id}
                className="mt-4 w-[100%] shadow-md shadow-blue-gray-900 "
              >
                <CardBody>
                  <div className="flex justify-between mt-0">
                    <div>
                      {Array.from({ length: review.rate }, (_, i) => i + 1).map(
                        (star, index) => (
                          <span
                            key={index}
                            style={{
                              width: `24px`,
                              height: `24px`,
                              display: "inline-block",
                              cursor: "pointer",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill={"#fcc419"}
                              stroke={"#fcc419"}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </span>
                        )
                      )}
                    </div>

                    <Typography variant="h6" color="blue-gray" className="mb-2">
                      {new Date(
                        Date.parse(review.created_at)
                      ).toLocaleDateString("tr-TR")}
                    </Typography>
                  </div>
                  <Typography className={"text-black"}>
                    {review.review}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          <Button
            className={"mt-8 shadow-lg shadow-blue-gray-400"}
            ripple={true}
            color="red"
            onClick={handleOpen}
          >
            Close
          </Button>
        </DialogBody>
      </Dialog>
    </>
  );
}
