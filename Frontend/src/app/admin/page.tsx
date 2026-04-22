"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccount() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    school_id: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required.";

    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.school_id.trim()) {
      newErrors.school_id = "School ID is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.confirm_password !== formData.password) {
      newErrors.confirm_password = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch("http://127.0.0.1:8000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          school_id: formData.school_id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("User successfully created in database!");
        router.push("/admin");
      } else {
        setServerError(data.message || "Failed to create user.");
      }
    } catch (error) {
      console.error(error);
      setServerError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chat-gradient font-sans">

      <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Create User (Admin)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border text-black"
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border text-black"
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email (login credential)"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border text-black"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="text"
            name="school_id"
            placeholder="School ID (e.g. 2232690)"
            value={formData.school_id}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border text-black"
          />
          {errors.school_id && (
            <p className="text-red-500 text-sm">{errors.school_id}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border text-black"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            type="password"
            name="confirm_password"
            placeholder="Retype Password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border text-black"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">{errors.confirm_password}</p>
          )}

          {serverError && (
            <p className="text-red-600 text-sm text-center">{serverError}</p>
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-full border border-black text-black hover:bg-white/30 transition"
          >
            Save to Users Table
          </button>

        </form>
      </div>
    </div>
  );
}