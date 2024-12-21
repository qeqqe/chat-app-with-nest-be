"use client";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

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

interface Message {
  id: string;
  message: string;
  userId: string;
  receiverId: string;
  createdAt: string;
  sender: {
    username: string;
  };
}

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<any>(null);
  const router = useRouter();
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;
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

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current || !userData?.id) return;

    socketRef.current.on(`message:${userData.id}`, (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.off(`message:${userData.id}`);
    };
  }, [userData?.id]);

  useEffect(() => {
    if (selectedUser && socketRef.current) {
      socketRef.current.emit(
        "getMessages",
        {
          userId: userData?.id,
          receiverId: selectedUser.id,
        },
        (response: Message[]) => {
          setMessages(response);
        }
      );
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !userData) return;

    const messageData = {
      message: newMessage,
      userId: userData.id,
      receiverId: selectedUser.id,
    };

    socketRef.current.emit("newMessage", messageData);
    setNewMessage("");
  };

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
      {/* Contacts Sidebar */}
      <div className="w-[300px] h-[96vh] bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 flex flex-col gap-4">
        {/* User Profile Header */}
        <div className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-zinc-100 font-medium">
              {username.charAt(0).toUpperCase() + username.slice(1)}
            </p>
            <p className="text-zinc-400 text-sm">Online</p>
          </div>
        </div>

        <Divider className="my-2" />

        {/* Search Bar */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search contacts..."
            className="w-full"
            size="sm"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-zinc-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            }
          />
        </div>

        {/* Contacts List */}
        <ScrollShadow className="h-full">
          <div className="flex flex-col gap-2">
            {allUsers && allUsers.length > 0 ? (
              allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    selectedUser?.id === user.id
                      ? "bg-primary/20 text-primary-foreground"
                      : "hover:bg-zinc-700/50 text-zinc-100"
                  }`}
                >
                  <div className="h-9 w-9 rounded-full bg-zinc-700/50 flex items-center justify-center font-medium">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium truncate">{user.username}</p>
                    <p className="text-xs text-zinc-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
                <p>No users found</p>
              </div>
            )}
          </div>
        </ScrollShadow>
      </div>

      {/* chat area */}
      {selectedUser ? (
        <div className="flex-1 h-[96vh] bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 flex flex-col">
          {/* chat header */}
          <div className="flex items-center gap-4 p-2 border-b border-zinc-700">
            <div className="">{selectedUser.username[0].toUpperCase()}</div>
            <div>
              <p className="text-zinc-100">{selectedUser.username}</p>
              <p className="text-zinc-400 text-xs">Online</p>
            </div>
          </div>

          {/* msg area */}
          <ScrollShadow className="flex-1 py-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.userId === userData?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.userId === userData?.id
                        ? "bg-primary/20 text-primary-foreground"
                        : "bg-zinc-700/50 text-zinc-100"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollShadow>

          {/* msg input */}
          <div className="flex gap-2 mt-4">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1"
              size="lg"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button color="primary" onClick={sendMessage}>
              Send
            </Button>
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
