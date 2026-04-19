// app/chatbot/layout.tsx
"use client";
import { ReactNode } from "react";

export default function ChatbotLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col bg-chat-gradient overflow-hidden">
      <header className="bg-chatbotAccent text-white p-4">Emergency Hotline</header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
