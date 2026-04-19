import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE =  process.env.REACT_APP_API_BASE;
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
    if (!file) return;

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

    if (!showChart && Array.isArray(data.data) && data.data.length > 0) {
      setChartData(data.data);
      setShowChart(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white" }}>

      <h2 style={{ textAlign: "center", padding: "10px" }}>
        AI Dashboard
      </h2>

      {/* Upload */}
      {!uploaded && (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br /><br />

          <button onClick={handleUpload} disabled={!file}>
            Upload CSV
          </button>
        </div>
      )}

      {/* Chart */}
      {uploaded && showChart && (
        <div style={{ height: "300px", padding: "20px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey={Object.keys(chartData[0] || {})[0]} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={Object.keys(chartData[0] || {})[1]} fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chat */}
      {uploaded && (
        <>
          <div style={{ padding: "20px" }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <b>{msg.type}:</b> {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ position: "fixed", bottom: 0, width: "100%", display: "flex" }}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              style={{ flex: 1 }}
            />
            <button onClick={handleAsk}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}