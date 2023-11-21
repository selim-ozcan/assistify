import UserContext from "@/context/store";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const ctx = useContext(UserContext);

  useEffect(() => {
    if (!ctx.user) router.push("auth/signin");
  }, [router, ctx.user]);

  return <h1 className="text-3xl text-center my-52">Assistify</h1>;
}
