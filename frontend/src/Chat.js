import React, { useState, useEffect,useRef } from "react";
import { socket } from "./socket";

function Chat() {
  const chatRef = useRef();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("waiting", () => {
      setStatus("searching");
    });

    socket.on("matched", () => {
      setStatus("connected");
      setMessages([]);
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, { text: msg, sender: "stranger" }]);
    });

    socket.on("partner_disconnected", () => {
      setStatus("disconnected");
    });

    return () => {
      socket.off();
    };
  }, []);


 useEffect(() => {
  chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);


  const startSearch = () => {
    socket.emit("start_search");
  };

  const sendMessage = () => {
    if (!message) return;

    socket.emit("send_message", message);

    setMessages((prev) => [...prev, { text: message, sender: "me" }]);
    setMessage("");
  };

  const skip = () => {
    socket.emit("skip");
    setMessages([]);
    setStatus("searching");
  };

return (
  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh",
    background: "#f5f5f5"
  }}>
    <div 
    style={{
      width: "400px",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      
      <h2 style={{ 
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        marginBottom: "15px"
        }}>
        💬 Anonymous Chat
      </h2>

      <p>
        <b>Status:</b>{" "}
        {status === "connected" && <span style={{ color: "green" }}>🟢 Connected</span>}
        {status === "searching" && <span style={{ color: "orange" }}>🟡 Searching...</span>}
        {status === "disconnected" && <span style={{ color: "red" }}>🔴 Disconnected</span>}
        {status === "idle" && <span>⚪ Idle</span>}
      </p>

      {status === "idle" && (
        <button onClick={startSearch} style={{ width: "100%" }}>
          Start Chat
        </button>
      )}

      {status === "searching" && <p>🔍 Searching for partner...</p>}

      {status === "connected" && (
        <>
          <div 
          ref={chatRef}
          style={{
            border: "1px solid #ddd",
            height: "300px",
            overflowY: "scroll",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px"
          }}>
           {messages.map((msg, i) => (
            <div
                key={i}
                style={{
                display: "flex",
                justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
                marginBottom: "8px"
                }}
            >
                <div
                style={{
                    background: msg.sender === "me" ? "#d1e7ff" : "#e2e2e2",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    fontSize: "14px",
                    wordBreak: "break-word"
                }}
                >
                {" "}
                {msg.text}
                </div>
            </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            <input
              style={{ flex: 1, padding: "10px" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />

            <button onClick={sendMessage}>Send</button>
          </div>

          <button 
            onClick={skip} 
            style={{ marginTop: "10px", width: "100%" }}
          >
            Skip / Rematch
          </button>
        </>
      )}

      {status === "disconnected" && (
        <>
          <p>⚠️ Partner disconnected</p>
          <button onClick={startSearch} style={{ width: "100%" }}>
            Find New Chat
          </button>
        </>
      )}
    </div>
  </div>
);
}

export default Chat;