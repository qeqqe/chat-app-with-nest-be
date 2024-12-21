"use client";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-800">
      <Card className="w-[90%] max-w-[800px] p-4 shadow-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800">
        <CardHeader className="flex flex-col gap-2 items-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Welcome To The Chat App
          </h1>
          <p className="text-zinc-400 text-center mt-2">
            Connect with friends and family in real-time
          </p>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-4">
          <div className="flex gap-4 mt-4">
            <Link href="/register">
              <Button
                color="primary"
                variant="shadow"
                size="lg"
                className="font-semibold"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                color="secondary"
                variant="bordered"
                size="lg"
                className="font-semibold"
              >
                Sign in
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="https://youtu.be/dQw4w9WgXcQ?feature=shared"
              size="sm"
              className="text-zinc-400 hover:text-zinc-300"
            >
              Learn more about our features →
            </Link>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
