"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Message = {
  id: number;
  text: string;
  author: "user" | "assistant";
};

interface ChatContextValue {
  messages: Message[];
  sendMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (text: string) => {
    setMessages((msgs) => [...msgs, { id: Date.now(), text, author: "user" }]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
