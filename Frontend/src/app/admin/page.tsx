"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAdminLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Admin login failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-chat-gradient">
      <main className="flex w-full max-w-3xl h-[600px] flex-col bg-white/20 backdrop-blur-md rounded-xl p-10">

        <img
          src="/tempAvatarIcon.png"
          alt="Admin Avatar"
          className="w-24 h-24 rounded-full mb-6 self-center"
        />

        <div className="flex flex-col items-center gap-6 w-full">
          
          <label className="text-3xl font-montserrat text-black pl-9">
            Email
          </label>
          <input
            type="email"
            className="w-[600px] rounded-lg p-3 border border-gray-300 ml-9 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-3xl font-montserrat text-black pl-9">
            Password
          </label>
          <input
            type="password"
            className="w-[600px] rounded-lg p-3 border border-gray-300 ml-9 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <button
            onClick={handleAdminLogin}
            className="flex h-12 w-64 mx-auto items-center justify-center rounded-full border border-black px-5 mt-4 hover:bg-gray-100"
          >
            Admin Log In
          </button>

        </div>
      </main>
    </div>
  );
}