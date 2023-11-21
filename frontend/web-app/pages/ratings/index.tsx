import { useRouter } from "next/router";
import React from "react";

export default function Index() {
  const router = useRouter();

  console.log(router);

  return <div>index</div>;
}
