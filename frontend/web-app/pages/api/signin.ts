import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(process.env.authServiceUrl! + "/login", {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  res.setHeader("Set-Cookie", response.headers.getSetCookie()[0]);
  res.send(data);
}
