"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function NexusChatPage() {
  const [messages, setMessages] = useState([
    { role: "model", text: "สวัสดีครับ! ผม Nexus AI ผู้ช่วยส่วนตัวของคุณ มีอะไรให้ผมช่วยแนะนำเกี่ยวกับทริปหรือการฝึกงานในวันนี้ไหมครับ?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const u = await api.getMe();
        setUser(u);
      } catch (e) {}
    };
    init();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      // Direct call to our server-side API proxy
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: userMsg,
          sessionId: "nexus-session-" + (user?.id || "guest"),
          userRole: user?.roles?.[0] || "STUDENT"
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "model", text: data.output }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", text: "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง" }]);
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = [
    "แนะนำที่ฝึกงานสาย IT หน่อยครับ",
    "ต้องทำรายงานยังไงบ้าง?",
    "ตรวจสอบสถานะใบสมัครของผม",
    "แนะนำวิธีการทำ Resume ให้น่าสนใจ"
  ];

  return (
    <div className="nexus-chat-container">
      <style jsx>{`
        .nexus-chat-container {
          height: calc(100vh - 100px);
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .chat-header {
          padding: 20px 24px;
          background: linear-gradient(135deg, #2563EB, #7C3AED);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header h1 {
          font-size: 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
        }

        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #F8FAFC;
        }

        .message-row {
          display: flex;
          gap: 12px;
          max-width: 85%;
        }

        .message-row.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .avatar.model {
          background: linear-gradient(135deg, #2563EB, #7C3AED);
          color: white;
        }

        .avatar.user {
          background: #E2E8F0;
          color: #475569;
        }

        .bubble {
          padding: 12px 18px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .bubble.model {
          background: white;
          color: #0F172A;
          border-bottom-left-radius: 4px;
        }

        .bubble.user {
          background: #2563EB;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-footer {
          padding: 20px 24px;
          background: white;
          border-top: 1px solid #E2E8F0;
        }

        .presets-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 16px;
          scrollbar-width: none;
        }

        .presets-bar::-webkit-scrollbar { display: none; }

        .btn-preset {
          padding: 8px 16px;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-preset:hover {
          background: #EFF6FF;
          border-color: #2563EB;
          color: #2563EB;
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
        }

        .chat-input {
          flex: 1;
          height: 50px;
          background: #F1F5F9;
          border: 2px solid transparent;
          border-radius: 14px;
          padding: 0 20px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .chat-input:focus {
          outline: none;
          background: white;
          border-color: #2563EB;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
        }

        .btn-send {
          width: 50px;
          height: 50px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .btn-send:hover {
          background: #1D4ED8;
          transform: scale(1.05);
        }

        .btn-send:disabled {
          background: #94A3B8;
          cursor: not-allowed;
          transform: none;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px 8px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #CBD5E1;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="chat-header">
        <h1>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fas fa-robot"></i>
          </div>
          Nexus AI Assistant
        </h1>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
          <i className="fas fa-times"></i> ปิด
        </Link>
      </div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role === "user" ? "user" : "model"}`}>
            <div className={`avatar ${m.role}`}>
              {m.role === "user" ? <i className="fas fa-user"></i> : <i className="fas fa-sparkles"></i>}
            </div>
            <div className={`bubble ${m.role}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-row model">
            <div className="avatar model"><i className="fas fa-sparkles"></i></div>
            <div className="bubble model">
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        <div className="presets-bar">
          {PRESETS.map((p, i) => (
            <button key={i} className="btn-preset" onClick={() => { setInput(p); }}>{p}</button>
          ))}
        </div>
        <form onSubmit={handleSend} className="input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="พิมพ์ข้อความคุยกับ Nexus AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn-send" disabled={loading || !input.trim()}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
