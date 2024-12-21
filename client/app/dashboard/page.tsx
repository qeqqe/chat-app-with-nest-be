"use client";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiError {
  message: string;
  statusCode: number;
}

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();
  const user = localStorage.getItem("user");
  const username = user ? JSON.parse(user).username : "";
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchAllUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3001/user", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            router.replace("/login");
            throw new Error("Session expired");
          }
          throw {
            message: data.message || "Failed to fetch users",
            statusCode: response.status,
          } as ApiError;
        }

        setAllUsers(() => {
          return data.filter((user: User) => user.username !== username);
        });
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || "An unexpected error occurred");
        if (apiError.statusCode === 401) {
          router.replace("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-zinc-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md w-full mx-4">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-row justify-between min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-4 gap-4">
      {/* contacts */}
      <div className="w-[300px] h-[96vh] bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4 p-2">
          <div className="">{username[0].toUpperCase()}</div>
          <div>
            <p className="text-zinc-100 font-medium">
              {username.charAt(0).toUpperCase() + username.slice(1)}
            </p>
            <p className="text-zinc-400 text-sm">Online</p>
          </div>
        </div>
        <Divider />
        <Input
          type="search"
          placeholder="Search contacts..."
          className="max-w-full"
          size="sm"
        />
        <ScrollShadow className="h-full">
          <div className="flex flex-col gap-2">
            {allUsers && allUsers.length > 0 ? (
              allUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-zinc-700/50"
                >
                  <div className="">{username[0].toUpperCase()}</div>

                  <div>
                    <p className="text-zinc-100">{user.username}</p>
                    <p className="text-zinc-400 text-xs">{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-400">No users found</p>
            )}
          </div>
        </ScrollShadow>
      </div>

      {/* chat area */}
      {selectedUser ? (
        <div className="flex-1 h-[96vh] bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 flex flex-col">
          {/* chat header */}
          <div className="flex items-center gap-4 p-2 border-b border-zinc-700">
            <Avatar src="https://i.pravatar.cc/150?u=1" size="sm" />
            <div>
              <p className="text-zinc-100">Contact 1</p>
              <p className="text-zinc-400 text-xs">Online</p>
            </div>
          </div>

          {/* msg area */}
          <ScrollShadow className="flex-1 py-4">
            <div className="flex flex-col gap-4"></div>
          </ScrollShadow>

          {/* msg input */}
          <div className="flex gap-2 mt-4">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1"
              size="lg"
            />
            <Button color="primary">Send</Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 h-[96vh] bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 flex flex-col items-center justify-center">
          <p className="text-zinc-400">Select a user to start chatting</p>
        </div>
      )}
    </main>
  );
};
export default Dashboard;
