/* eslint-disable react/no-unescaped-entities */
import CartContext from "@/context/cartContext";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import {
  Button,
  Select,
  Textarea,
  Option,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { profile } from "console";

export default function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const router = useRouter();
  const [quantities, setQuantities] = useState(
    Array.from({ length: cart.length }, () => 1)
  );
  const [address, setAddress] = useState("");
  return (
    <div>
      <h1 className="text-black text-center text-3xl mt-6 mb-10">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="flex flex-col align-center">
          <h2 className="text-gray-600 text-center mt-16">
            You don't have any items in your chart
          </h2>
          <Button
            className="normal-case self-center mt-8"
            onClick={() => router.push("/products/scanner")}
          >
            {" "}
            Click to Scan{" "}
          </Button>
        </div>
      ) : null}
      {cart.length !== 0
        ? cart.map((product, index) => (
            <>
              <div key={index} className="flex w-[90%] mx-auto mt-4">
                <Image
                  src={product.image}
                  width={50}
                  height={50}
                  alt="card-image"
                  className="h-[140px] rounded-md w-[140px] border border-blue-gray-300"
                  onClick={() => router.push(`/products/${product._id}`)}
                />
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between">
                    <h2 className="text-black text-xl capitalize">
                      {product.colors[product.color]}{" "}
                      <span className="capitalize">{product.type}</span>
                    </h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 text-gray-600"
                      onClick={() =>
                        setCart((prev) =>
                          prev.filter((item) => item._id !== product._id)
                        )
                      }
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>

                  <div className="flex justify-between mt-3">
                    <h2 className="text-sm text-gray-600 capitalize">
                      {product.material}
                    </h2>
                    <span className="text-sm text-gray-600">|</span>
                    <h2 className="text-sm text-gray-600">
                      Size: {product.sizes[product.size]}
                    </h2>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <label
                        className="text-black mr-2"
                        htmlFor={`${product._id}`}
                      >
                        Quantity:
                      </label>
                      <select
                        className="bg-green-400 rounded-md p-1 px-2"
                        name="Quantity"
                        id={`${product._id}`}
                        onChange={(event) =>
                          setQuantities((prev) => {
                            console.log(prev);
                            const newArray = [...prev];
                            newArray[index] = +event.target.value;
                            return newArray;
                          })
                        }
                      >
                        {Array.from({ length: 50 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-black text-3xl">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
              <hr className="h-[2px] mx-4 my-5 bg-gray-300 border-1 dark:bg-gray-700" />
            </>
          ))
        : null}

      {cart.length !== 0 ? (
        <Card className="p-2 w-[90%] mx-auto">
          <CardBody className={"flex  flex-col justify-center"}>
            <h1 className="text-black text-lg mb-4">Order Summary</h1>
            {cart.map((product, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <div className="text-gray-500 text-sm">
                    <span className="capitalize">
                      {product.colors[product.color]}{" "}
                    </span>
                    <span className="capitalize mr-2">{product.type}</span>x
                    <span className="ml-1">{quantities[index]}</span>
                  </div>
                  <span>${product.price * quantities[index]}</span>
                </div>
                <hr className="h-[2px] my-3 bg-gray-300 border-1 dark:bg-gray-400" />
              </div>
            ))}
            <div className="flex justify-between mt-6 mb-6">
              <span className="text-black text-xl font-bold">Total</span>
              <span className="text-black text-xl font-bold">
                $
                {cart.reduce(
                  (acc, product, index) =>
                    acc + product.price * quantities[index],
                  0
                )}
              </span>
            </div>
            <Textarea
              label={"Write your shipping address"}
              onChange={(e) => setAddress(e.target.value)}
            ></Textarea>
            <Button
              disabled={address === ""}
              className="mt-4 w-[90%] self-center"
              onClick={() => {
                let error = false;
                cart.forEach((product, index) => {
                  if (
                    product.stocks[product.size][product.color] <
                    quantities[index]
                  ) {
                    error = true;
                    toast.error(
                      `Insufficient stock for ${
                        product.colors[product.color]
                      } ${product.type} Current stock is ${
                        product.stocks[product.size][product.color]
                      }`
                    );
                  }
                });
                if (!error) {
                  Promise.all(
                    cart.map((product, index) => {
                      const newStocks = [...product.stocks];
                      newStocks[product.size][product.color] -=
                        quantities[index];

                      console.log(JSON.stringify({ stocks: newStocks }));
                      return fetch(
                        `http://localhost:3000/products/${product._id}`,
                        {
                          credentials: "include",
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            stocks: newStocks,
                          }),
                        }
                      ).then();
                    })
                  )
                    .then((e) => {
                      console.log(e);
                      setCart([]);
                      toast.success("Checkout Successfull!");
                    })
                    .catch((e) => console.log(e));
                }
              }}
            >
              Checkout
            </Button>
          </CardBody>
        </Card>
      ) : null}

      <Toaster></Toaster>
    </div>
  );
}
