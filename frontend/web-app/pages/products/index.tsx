import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Radio,
} from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hello({ products }) {
  const router = useRouter();
  return (
    <>
      {products.map((product) => (
        <Card
          key={product._id}
          className="max-w-[48rem] flex-row mt-2 mb-2 mr-2 ml-2 bg-gradient-to-br from-blue-gray-100 to-blue-gray-50 text-black shadow-lg shadow-blue-gray-300 border border-blue-gray-900"
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
              <Typography variant="h7" color="gray" className="mb-1 uppercase">
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

            <Button
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
            </Button>
          </CardBody>
        </Card>
      ))}
    </>
  );
}

export async function getServerSideProps(context) {
  const query = new URLSearchParams(context.query);

  const res = await fetch(`http://localhost:3000/products?${query}`, {
    credentials: "include",
  });

  const products = await res.json();

  return { props: { products } };
}
