import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "https://ai-csv-dashboard-1.onrender.com";

export default function App() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Upload CSV
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/csv/upload`, {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    alert(text);
    setUploaded(true);
  };

  // Ask AI
  const handleAsk = async () => {
    if (!question) return;

    const q = question;
    setQuestion("");

    setMessages((prev) => [...prev, { type: "user", text: q }]);

    const res = await fetch(`${API_BASE}/api/query/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, { type: "ai", text: data.text }]);

    // Show chart only first time
    if (!showChart && Array.isArray(data.data) && data.data.length > 0) {
      setChartData(data.data);
      setShowChart(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
        color: "#e2e8f0",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "15px",
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "bold",
          borderBottom: "1px solid #334155",
        }}
      >
        AI-Powered Dashboard
      </div>

      {/* UPLOAD */}
      {!uploaded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "100px",
            gap: "15px",
          }}
        >
          <input
            type="file"
            id="fileInput"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label htmlFor="fileInput">
            <div
              style={{
                border: "2px dashed #475569",
                padding: "30px",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              📁 Upload CSV File
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                Click to select
              </div>
              {file && (
                <div style={{ color: "#22c55e", marginTop: "10px" }}>
                  {file.name}
                </div>
              )}
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={!file}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              background: file ? "#3b82f6" : "#475569",
              color: "white",
              cursor: "pointer",
            }}
          >
            Upload
          </button>
        </div>
      )}

      {/* DASHBOARD */}
      {uploaded && (
        <>
          {/* CHART */}
          {showChart && (
            <div style={{ padding: "20px" }}>
              <h3>📊 CSV Dashboard</h3>

              <div
                style={{
                  width: "100%",
                  height: "300px",
                  background: "transparent",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="product_name"
                      stroke="#94a3b8"
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="price" fill="#38bdf8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* CHAT */}
          <div style={{ padding: "20px", paddingBottom: "90px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.type === "user" ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    background:
                      msg.type === "user"
                        ? "#2563eb"
                        : "#1e293b",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              padding: "10px",
              display: "flex",
              gap: "10px",
              background: "#0f172a",
              borderTop: "1px solid #334155",
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#1e293b",
                color: "white",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />

            <button
              onClick={handleAsk}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "none",
                background: "#22c55e",
                color: "black",
              }}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}