"use client";

import ChatBubble from "./ChatBubble";

// New type: array of objects
interface ChatWindowProps {
  messages: { text: string; sender: "bot" | "user" }[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
      {messages.map((msg, idx) => (
        <ChatBubble key={idx} message={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
}
