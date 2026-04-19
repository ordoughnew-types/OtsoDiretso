/**
 * Chatbot page
 */
"use client";

import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";

export default function ChatbotPage() {
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const [messages, setMessages] = useState<{ text: string; sender: "bot" | "user" }[]>([
    { text: "Hi User! How can I help?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = input;

  // 1. show user message immediately
  setMessages((prev) => [
    ...prev,
    { text: userMessage, sender: "user" },
  ]);

  setInput("");

  try {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

    const res = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    const data = await res.json();

    // 2. show bot reply
    setMessages((prev) => [
      ...prev,
      { text: data.reply || "No response from server", sender: "bot" },
    ]);

  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      { text: "Error connecting to server", sender: "bot" },
    ]);
  }
};

  return (
    <div className="relative flex flex-col h-screen bg-chat-gradient overflow-hidden">
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
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              I Agree
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center flex-shrink-0 py-4">
        <img
          src="/tempAvatarIcon.png"
          alt="Avatar"
          className="mb-2 h-24 w-24 rounded-full"
        />
        <p className="text-sm text-gray-700">How can we help you today?</p>
        <hr className="mt-4 w-full border-gray-300" />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2">
        <ChatWindow messages={messages} />
      </div>

      <div className="flex flex-shrink-0 border-t border-gray-300 p-2">
        <input
          type="text"
          placeholder="Share your thoughts or feelings here..."
          className="flex-1 rounded-full border border-gray-300 bg-white p-3 text-black outline-none disabled:bg-gray-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!acceptedDisclaimer}
        />
        <button
          onClick={sendMessage}
          disabled={!acceptedDisclaimer}
          className="ml-2 rounded-full bg-blue-600 p-3 text-white disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}