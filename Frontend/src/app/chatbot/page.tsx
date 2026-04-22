"use client";

import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import { useRouter } from "next/navigation";

export default function ChatbotPage() {
  const router = useRouter();

  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [messages, setMessages] = useState([
    { text: "Hi User! How can I help?", sender: "bot" as const },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { text: userMessage, sender: "user" },
    ]);

    setInput("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.reply || "No response from server", sender: "bot" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to server", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-chat-gradient overflow-hidden">

      {/* SIDEBAR */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 overflow-hidden
        ${menuOpen ? "w-64" : "w-0"}`}
      >
        {menuOpen && (
          <div className="p-5 flex flex-col gap-4 h-full">

            <h2 className="text-lg font-bold mb-2">Menu</h2>

            <button
              onClick={() => router.push("/hotlines")}
              className="text-left hover:underline"
            >
              Emergency Hotlines
            </button>

            <button
              onClick={() => router.push("/about")}
              className="text-left hover:underline"
            >
              About Us
            </button>

            <button
              onClick={() => router.push("/history")}
              className="text-left hover:underline"
            >
              Chat History
            </button>

            {/* LOG OUT (INSIDE DASHBOARD) */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="text-left text-red-600 hover:underline mt-auto"
            >
              Log Out
            </button>

          </div>
        )}
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 transition-all duration-300">

        {/* TOP BAR (BUTTON MOVES WITH LAYOUT) */}
        <div className="flex items-center p-4">

          {acceptedDisclaimer && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl font-bold text-black"
            >
              ☰
            </button>
          )}

        </div>

        {/* DISCLAIMER (UNCHANGED) */}
        {!acceptedDisclaimer && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-300 bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-black">Disclaimer</h2>

              <p className="mt-3 text-sm leading-6 text-gray-800">
              This chatbot is intended to provide comfort, emotional support, and general
                encouragement for students. It is not a replacement for a licensed therapist,
                counselor, psychologist, psychiatrist, or any other mental health professional.
                It does not provide diagnosis, treatment, crisis intervention, or medical advice.
                If you are in distress, experiencing a mental health emergency, or need professional
                support, please contact a licensed mental health provider or appropriate emergency
                services. By clicking “I Agree” or “Continue,” you acknowledge and accept these terms.
              </p>

              <button
                onClick={() => setAcceptedDisclaimer(true)}
                className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-white"
              >
                I Agree
              </button>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col items-center flex-shrink-0 py-4">
          <img
            src="/tempAvatarIcon.png"
            className="h-24 w-24 rounded-full mb-2"
          />
          <p className="text-sm text-gray-700">
            How can we help you today?
          </p>
          <hr className="mt-4 w-full border-gray-300" />
        </div>

        {/* CHAT */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2">
          <ChatWindow messages={messages} />
        </div>

        {/* INPUT */}
        <div className="flex border-t p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!acceptedDisclaimer}
            className="flex-1 rounded-full border p-3 text-black"
            placeholder="Share your thoughts..."
          />

          <button
            onClick={sendMessage}
            disabled={!acceptedDisclaimer}
            className="ml-2 rounded-full bg-blue-600 px-4 text-white"
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}