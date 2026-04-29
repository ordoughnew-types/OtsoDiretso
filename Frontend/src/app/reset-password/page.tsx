"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    let newErrors: any = {};

    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!token || !email) {
      newErrors.general = "Invalid reset link";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful!");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setErrors({
          general: data.message || "Reset failed",
        });
      }
    } catch {
      setErrors({
        general: "Server error",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-chat-gradient">

      <div className="bg-white/20 backdrop-blur-md p-10 rounded-xl w-[500px]">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h1>

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="New Password"
          className={`w-full p-3 rounded mb-2 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev: any) => ({ ...prev, password: null }));
          }}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          placeholder="Confirm Password"
          className={`w-full p-3 rounded mb-2 border ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors((prev: any) => ({
              ...prev,
              confirmPassword: null,
            }));
          }}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmPassword}
          </p>
        )}

        {/* GENERAL ERROR */}
        {errors.general && (
          <p className="text-red-500 text-center mb-2">
            {errors.general}
          </p>
        )}

        {/* SUCCESS */}
        {message && (
          <p className="text-green-600 text-center mb-2">
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white p-3 rounded mt-4"
        >
          Reset Password
        </button>
      </div>

    </div>
  );
}   