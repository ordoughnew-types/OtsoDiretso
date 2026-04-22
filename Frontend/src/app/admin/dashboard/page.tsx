"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

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
  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/users", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data.users || data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // OPEN MODAL
  // =========================
  const openModal = () => {
    setShowModal(true);
    setSuccessMessage(""); // ✅ clear old success message
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
    setServerError("");
    setSuccessMessage(""); // ✅ clear while typing
  };

  // =========================
  // VALIDATE
  // =========================
  const validate = () => {
    const newErrors: any = {};

    if (!formData.first_name) newErrors.first_name = true;
    if (!formData.last_name) newErrors.last_name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.school_id) newErrors.school_id = true;
    if (!formData.password) newErrors.password = true;

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("User created successfully!");

        // auto remove success message
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);

        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          school_id: "",
          password: "",
          confirm_password: "",
        });

        fetchUsers();
        setShowModal(false);
      } else {
        setServerError(data.message || "Failed to create user");
      }
    } catch {
      setServerError("Server error");
    }
  };

  return (
    <div className="relative min-h-screen bg-chat-gradient p-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-1/2 p-2 rounded-lg border text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={openModal}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Create
        </button>
      </div>

      {/* USERS LIST */}
      <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 min-h-[400px]">
        {filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            No accounts available yet.
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-lg shadow"
              >
                {user.first_name} {user.last_name} - {user.email}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white p-12 rounded-xl w-full max-w-3xl">

            <h2 className="text-2xl font-bold mb-6">
              Create Account
            </h2>

            {successMessage && (
              <p className="text-green-600 text-sm mb-3">
                {successMessage}
              </p>
            )}

            {serverError && (
              <p className="text-red-500 text-sm mb-3">
                {serverError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${
                  errors.first_name ? "border-red-500" : ""
                }`}
              />

              <input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${
                  errors.last_name ? "border-red-500" : ""
                }`}
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
              />

              <input
                name="school_id"
                placeholder="School ID"
                value={formData.school_id}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${
                  errors.school_id ? "border-red-500" : ""
                }`}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${
                  errors.password ? "border-red-500" : ""
                }`}
              />

              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${
                  errors.confirm_password ? "border-red-500" : ""
                }`}
              />

              <div className="flex justify-between pt-4">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded"
                >
                  Create
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* LOG OUT BUTTON */}
      <button
        onClick={() => {
          localStorage.removeItem("admin_token");
          window.location.href = "/"; // change if your login route is different
        }}
        className="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        Log Out
      </button>

    </div>
  );
}