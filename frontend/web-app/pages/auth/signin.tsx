import UserContext from "@/context/store";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

export default function SignIn() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = useCallback(
    async function login() {
      const response = await fetch("/api/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((user) => {
          setUser(user);
          if (user.role === "customer") router.push("/products/scanner");
          if (user.role === "employee") router.push("/queue");
          if (user.role === "manager") router.push("/employee-stats");
        });
    },
    [email, password, router, setUser]
  );

  useEffect(() => {
    const cb = function (e) {
      if (e.key === "Enter") {
        login();
      }
    };

    document.addEventListener("keyup", cb);

    return () => {
      document.removeEventListener("keyup", cb);
    };
  }, [login]);

  return (
    <Card className="w-[90%] mx-auto mt-16 mb-16">
      <CardHeader
        variant="gradient"
        className="mb-4 grid h-28 place-items-center bg-[hsl(72,13%,84%)] "
      >
        <Typography variant="h3" className="text-gray-800">
          Sign In
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Input
          type="email"
          label="Email"
          size="lg"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Input
          type="password"
          label="Password"
          size="lg"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {/* <div className="-ml-2.5">
          <Checkbox label="Remember Me" />
        </div> */}
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          onClick={() => {
            login();
          }}
          variant="gradient"
          fullWidth
        >
          Sign In
        </Button>
        <Typography variant="small" className="mt-6 flex justify-center">
          Don&apos;t have an account?
          <Typography
            as="a"
            href="#signup"
            variant="small"
            color="blue-gray"
            className="ml-1 font-bold"
          >
            Sign up
          </Typography>
        </Typography>
      </CardFooter>
    </Card>
  );
}
