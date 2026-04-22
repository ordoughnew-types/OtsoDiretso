"use client";

import { ReactNode } from "react";

export default function ChatbotLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col bg-chat-gradient overflow-hidden">
      
      {/* ❌ HEADER REMOVED COMPLETELY */}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

    </div>
  );
}