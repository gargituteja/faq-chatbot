import { useState, useRef, useEffect } from "react";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user's message
    const userMsg = { text: question, from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      // ✅ Fetch answer from backend
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const botMsg = { text: data.reply, from: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Frontend fetch error:", error);
      const errorMsg = {
        text: "❌ Error: Unable to connect to backend.",
        from: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "30px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>🤖 AI FAQ Chatbot</h2>

      <div
        style={{
          border: "2px solid #007bff",
          borderRadius: "10px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: msg.from === "user" ? "#007bff" : "#e5e5e5",
                color: msg.from === "user" ? "#fff" : "#000",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "75%",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div style={{ display: "flex", marginTop: "15px" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={handleAsk}
          style={{
            marginLeft: "8px",
            padding: "10px 18px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
