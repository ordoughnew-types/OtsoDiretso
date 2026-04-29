"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // FORM STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ERROR STATE
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleLogin = async () => {
    let newErrors: typeof errors = {};

    // FRONTEND VALIDATION
    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setErrors({});
        router.push("/admin/dashboard");
      } else {
        // 🔥 HANDLE BACKEND ERROR TYPES
        if (data.error_type === "email") {
          setErrors({ email: data.message });
        } else if (data.error_type === "password") {
          setErrors({ password: data.message });
        } else {
          setErrors({
            general: data.message || "Login failed",
          });
        }
      }
    } catch (err) {
      setErrors({
        general: "Cannot connect to server",
      });
    }
  };

  // FORGOT PASSWORD
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleForgotPassword = async () => {
    setForgotMessage("");
    setForgotError("");

    if (!forgotEmail) {
      setForgotError("Email is required");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setForgotMessage("Password reset link sent to your email.");
        setForgotEmail("");
      } else {
        setForgotError(data.message || "Email not found");
      }
    } catch {
      setForgotError("Server error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-chat-gradient">
      
      {/* MAIN CARD */}
      <main className="flex w-full max-w-3xl h-[600px] flex-col bg-white/20 backdrop-blur-md rounded-xl p-10">

        <img
          src="/adminSwitch.png"
          alt="Avatar"
          className="w-24 h-24 rounded-full mb-6 self-center"
        />

        <div className="flex flex-col items-center sm:items-start w-full gap-3">
          
          {/* EMAIL */}
          <label className="text-3xl font-montserrat text-black pl-9">
            Email
          </label>

          <input
            type="email"
            placeholder="🖂"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={`w-[600px] rounded-lg p-3 border outline-none ml-9 text-black font-montserrat ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.email && (
            <p className="text-red-500 ml-9 text-sm">{errors.email}</p>
          )}

          {/* PASSWORD */}
          <label className="text-3xl font-montserrat text-black pl-9">
            Password
          </label>

          <input
            type="password"
            placeholder="🔒︎"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className={`w-[600px] rounded-lg p-3 border outline-none ml-9 text-black font-montserrat ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.password && (
            <p className="text-red-500 ml-9 text-sm">{errors.password}</p>
          )}

          {/* GENERAL ERROR */}
          {errors.general && (
            <p className="text-red-500 text-center w-full mt-2">
              {errors.general}
            </p>
          )}

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="flex h-12 w-64 mx-auto items-center justify-center rounded-full border border-black/[.90] px-5 transition-colors hover:border-transparent hover:bg-blue/[.04] text-[#112a50] mt-4"
          >
            Log In
          </button>

          <button
            onClick={() => setShowForgot(true)}
            className="text-sm text-blue-600 mt-2 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </main>

      {/* BACK BUTTON */}
          <button
            onClick={() => router.push("/")}
            className="fixed bottom-4 right-4 w-12 h-12 rounded-full overflow-hidden border border-gray-400 shadow-md hover:scale-105 transition"
          >
            <img
              src="/chatSwitch.png"
              alt="Back"
              className="w-full h-full object-cover"
            />
          </button> 

          {showForgot && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

              <div className="bg-white p-6 rounded-xl w-full max-w-md">

                <h2 className="text-xl font-bold mb-4">
                  Forgot Password
                </h2>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-3 border rounded mb-3"
                />

                {forgotError && (
                  <p className="text-red-500 text-sm mb-2">{forgotError}</p>
                )}

                {forgotMessage && (
                  <p className="text-green-600 text-sm mb-2">{forgotMessage}</p>
                )}

                <div className="flex justify-between">

                  <button
                    onClick={() => {
                      setShowForgot(false);
                      setForgotEmail("");
                      setForgotError("");
                      setForgotMessage("");
                    }}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleForgotPassword}
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    Send Link
                  </button>

                </div>

              </div>

            </div>
          )}
    </div>
  );
}