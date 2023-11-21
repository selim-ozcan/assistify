import { useRouter } from "next/router";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

export default function Scanner(props: any) {
  const [data, setData] = useState("No result");
  const router = useRouter();

  return (
    <div className="h-[65vh]">
      <h2 className="font-bold italic mt-16 text-center text-blue-gray-700">
        scan QR code of product
      </h2>
      <div className="w-4/5 h-[20%] mt-4 mx-auto">
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.getText());
              router.push(`/products/${result}`);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          videoStyle={{ border: "1px solid rgb(84 110 122)", padding: "10px" }}
          constraints={{ facingMode: "environment" }}
        />
      </div>
    </div>
  );
}
