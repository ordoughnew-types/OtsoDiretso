"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
  if (!email || !password) {
    setError("Email and password are required!");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      setError("");
      router.push("/chatbot");
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    setError("Cannot connect to server");
  }
};

  /**
   * TODO:
   * Add background effect (Parallax)
   * Polish
   */
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-chat-gradient">
      <main className="flex w-full max-w-3xl h-[600px] flex-col bg-white/20 backdrop-blur-md rounded-xl p-10">
        <h1 className="text-right text-black">
        Continue as{' '}
        <Link href="/chatbot" className="underline text-blue-600 hover:text-blue-800">
          Guest
        </Link>
        !
      </h1>
        <img 
          src="/tempAvatarIcon.png" 
          alt="Avatar" 
          className="w-24 h-24 rounded-full mb-6 self-center" 
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full gap-3">
          <label className="text-3xl font-montserrat leading-10 tracking-tight text-black dark:text-zinc-50 pl-9">
            Email
          </label>
          <input
            type="email"
            placeholder="🖂"
            className="w-[600px] rounded-lg p-3 border border-gray-300 outline-none ml-9 text-black font-montserrat"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-3xl font-montserrat leading-10 tracking-tight text-black dark:text-zinc-50 pl-9">
            Password
          </label>

          <input
            type="password"
            placeholder="🔒︎"
            className="w-[600px] rounded-lg p-3 border border-gray-300 outline-none ml-9 text-black font-montserrat"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <button
            onClick={handleLogin}
            className="flex h-12 w-64 mx-auto items-center justify-center rounded-full border border-solid border-black/[.90] px-5 transition-colors hover:border-transparent hover:bg-blue/[.04] dark:border-blue/[.145] dark:hover:bg-white text-[#112a50] mt-4"
          >
            Log In
          </button>
        </div>
      </main>
    </div>
  );
}