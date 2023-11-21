import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
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
          className="max-w-[48rem] flex-row mt-2 mb-2 mr-2 ml-2 bg-blue-gray-200 text-black shadow-lg shadow-blue-gray-300 border border-blue-gray-900"
        >
          <CardHeader
            shadow={false}
            floated={false}
            className="m-1 ml-2 mt-2 mb-2 p-0 w-[25%] shrink-0 rounded-md bg-blue-gray-200"
          >
            <Image
              src={product.image}
              width={50}
              height={50}
              alt="card-image"
              className="h-[85px] rounded-md w-[85px] border-2  border-blue-gray-900"
            />
          </CardHeader>
          <CardBody className="p-2 flex flex-col">
            <Typography variant="h7" color="gray" className="mb-1 uppercase">
              {product.type}
            </Typography>
            <div className="flex">
              {Object.entries(product).map(([key, value]) => {
                if (
                  key !== "_id" &&
                  key !== "image" &&
                  key !== "__v" &&
                  key !== "type" &&
                  key !== "price" &&
                  key !== "stock"
                )
                  return (
                    <span
                      key={key}
                      className="first:text-left inline-block w-[60px] text-center"
                    >
                      {value.toString()}
                    </span>
                  );
                else return null;
              })}
            </div>

            <a href="#" className="inline-block self-end mt-2">
              <Button
                variant="text"
                className="flex items-center gap-2 p-[4px] px-2 -ml-2 text-[10px] bg-blue-gray-100"
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
            </a>
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
