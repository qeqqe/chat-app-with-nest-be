"use client";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { useState } from "react";
import { register } from "@/service/auth";
import { useRouter } from "next/navigation";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const response = await register({ username, email, password });
    if (!response) return alert("An error occurred");
    router.push("/login");
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <Card className="w-[90%] max-w-[400px] p-4 shadow-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800">
        <CardHeader className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-zinc-400 text-center text-sm">
            Join our community today
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              type="text"
              label="Username"
              placeholder="Enter Username"
              variant="bordered"
              labelPlacement="outside"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              labelPlacement="outside"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
              variant="bordered"
              labelPlacement="outside"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              color="primary"
              variant="shadow"
              size="lg"
              className="w-full mt-2"
            >
              Register
            </Button>
          </form>
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-zinc-400">Already have an account?</span>
            <Link href="/login" className="text-primary">
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    </main>
  );
};

export default Register;
