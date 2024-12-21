"use client";
import { login } from "@/service/auth";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const response = await login({ email, password });
      console.log("Login response:", response);

      if (!response || !response.access_token) {
        setError("Invalid response from server");
        return;
      }

      localStorage.setItem("token", `Bearer ${response.access_token}`);
      localStorage.setItem("user", JSON.stringify(response.user));

      window.location.href = "/dashboard";
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <Card className="w-[90%] max-w-[400px] p-4 shadow-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        <CardHeader className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Sign in
          </h1>
          <p className="text-zinc-400 text-center text-sm">Welcome back</p>
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
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-zinc-400">Don't have an account?</span>
            <Link href="/register" className="text-primary">
              Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    </main>
  );
};

export default Login;
