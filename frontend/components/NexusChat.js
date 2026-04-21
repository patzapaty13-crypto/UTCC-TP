"use client";

import { useState, useEffect, useRef } from "react";

export default function NexusChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "สวัสดีครับ! ผม Nexus AI ยินดีที่ได้พบคุณ มีอะไรให้ผมช่วยแนะนำในการใช้งานวันนี้ไหมครับ?", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const sessionIdRef = useRef("nexus-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    
    setIsTyping(true);
    
    try {
      // Connect to Nexus AI Brain in n8n (Verified Workflow: BiEg41hprG3e37wX)
      const response = await fetch("https://thanathorn123.app.n8n.cloud/webhook/ae5a5af1-c2ca-42c7-a3a4-2105adb568bb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          chatInput: userMsg,
          sessionId: sessionIdRef.current
        })
      });

      if (!response.ok) throw new Error("AI Node Connection Failed");
      
      const data = await response.json();
      
      // Senior AI Response handling
      const aiResponse = data.output || "ขออภัยครับ ระบบประมวลผลขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง";

      setMessages(prev => [...prev, { role: "assistant", content: aiResponse, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ ขออภัยครับ ผมไม่สามารถเชื่อมต่อกับสมองกลส่วนกลางได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่อ n8n ของคุณครับ", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .nexus-chat-trigger {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563EB, #7C3AED);
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 4px solid rgba(255, 255, 255, 0.3);
        }

        .nexus-chat-trigger:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 48px rgba(37, 99, 235, 0.6);
        }

        .badge-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 900;
          padding: 4px 8px;
          border-radius: 10px;
          border: 2px solid white;
        }

        .chat-window {
          position: fixed;
          bottom: 110px;
          right: 30px;
          width: 380px;
          max-width: calc(100vw - 60px);
          height: 550px;
          max-height: calc(100vh - 150px);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 30px;
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9998;
          transform-origin: bottom right;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: ${isOpen ? 1 : 0};
          transform: ${isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(100px)'};
          pointer-events: ${isOpen ? 'all' : 'none'};
        }

        .chat-header {
          padding: 24px;
          background: linear-gradient(to right, #2563EB, #7C3AED);
          color: white;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
          background: rgba(255, 255, 255, 0.4);
        }

        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
        }

        .message.assistant {
          align-self: flex-start;
          background: white;
          color: #1E293B;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .message.user {
          align-self: flex-end;
          background: #2563EB;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-time {
          font-size: 10px;
          opacity: 0.5;
          margin-top: 4px;
          display: block;
        }

        .chat-input-area {
          padding: 20px;
          background: white;
          border-top: 1px solid #f1f5f9;
        }

        .chat-input-area form {
          display: flex;
          background: #f8fafc;
          padding: 6px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }

        .chat-input-area input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 10px 15px;
          font-size: 14px;
          outline: none;
        }

        .btn-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #2563EB;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-send:hover { transform: scale(1.1); background: #1D4ED8; }

        .typing-dot {
          width: 6px; height: 6px; background: #94A3B8; border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .close-btn {
          margin-left: auto;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.4); }
      `}</style>

      {/* Floating Trigger Button */}
      <div className="nexus-chat-trigger" onClick={() => setIsOpen(!isOpen)}>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-messages-sparkles'}`} style={{ fontSize: 24 }}></i>
        {!isOpen && <span className="badge-count">1</span>}
      </div>

      {/* Chat Window */}
      <div className="chat-window shadow-xl">
        <div className="chat-header">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <p style={{ fontWeight: 900, fontSize: 16 }}>Nexus AI Assistant</p>
            <p style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>Online | AI Node 01</p>
          </div>
          <div className="close-btn" onClick={() => setIsOpen(false)}>
            <i className="fas fa-minus"></i>
          </div>
        </div>

        <div className="chat-messages" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role} animate-slide-up`}>
              {msg.content}
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant" style={{ padding: "12px 20px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="พิมพ์ข้อความที่ต้องการสอบถาม..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="btn-send" disabled={isTyping}>
              <i className="fas fa-paper-plane-top"></i>
            </button>
          </form>
          <p style={{ fontSize: 10, textAlign: "center", color: "#94A3B8", marginTop: 12 }}>
            Powered by Nexus AI Engine • UTCC TradeHub
          </p>
        </div>
      </div>
    </>
  );
}
