"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Toggle chat window
  const toggleChat = () => setIsOpen(!isOpen);

  // Send user message
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    try {
      const res = await fetch("/get_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      // Add bot response
      setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
      
      // Scroll to bottom
      chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
    } catch (err) {
      console.error("Error fetching response:", err);
    }
  };

  // Optional: clear chat memory on mount
  useEffect(() => {
    fetch("/reset", { method: "POST", credentials: "same-origin" });
  }, []);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        Chat
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 300,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            onClick={toggleChat}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: 10,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            ChatBot (Click to close)
          </div>

          {/* Messages */}
          <div
            ref={chatBoxRef}
            style={{ height: 300, overflowY: "scroll", padding: 10 }}
          >
            {messages.map((m, i) => (
              <p
                key={i}
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                  color: m.role === "user" ? "blue" : "green",
                }}
              >
                {m.role === "user" ? "You: " : "Assistant: "}
                {m.text}
              </p>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{ flex: 1, padding: 10, border: "none" }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: 10,
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
