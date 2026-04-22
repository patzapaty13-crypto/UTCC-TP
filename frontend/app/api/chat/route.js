// Nexus AI — n8n Agent Workflow (Preferred)
// Falls back to Gemini SDK if N8N_CHAT_WEBHOOK_URL is missing or fails.

import { GoogleGenerativeAI } from "@google/generative-ai";

const N8N_CHAT_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || "https://thanathorn123.app.n8n.cloud/webhook/df19905c-458b-4c58-8194-b7b1bb49d899";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// In-memory conversation history for Gemini fallback
const sessions = new Map();

const SYSTEM_PROMPT = `You are Nexus AI, the Advanced Executive Assistant for the UTCC-TP Internship & Trip Platform.
Your expertise includes platform navigation, internship guidance (/internships), application tracking (/applications), and resume tips.`;

export async function POST(request) {
  console.log("[Nexus AI] Incoming request...");

  try {
    const body = await request.json();
    const { chatInput, sessionId, userRole } = body;
    console.log("[Nexus AI] Input:", chatInput, "| Role:", userRole);

    if (!chatInput) return Response.json({ output: "Input missing" });

    // --- 1. Primary: Try n8n Webhook ---
    if (N8N_CHAT_WEBHOOK_URL) {
      console.log("[Nexus AI] Calling n8n workflow...");
      try {
        const n8nResponse = await fetch(N8N_CHAT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatInput,
            sessionId: sessionId || "default",
            userRole: userRole || "GUEST",
            metadata: {
              source: "frontend-chat-api",
              timestamp: new Date().toISOString()
            }
          }),
        });

        if (n8nResponse.ok) {
          const data = await n8nResponse.json();
          // n8n Chat Trigger with Agent usually returns { output: "..." }
          const output = data.output || data.response || (typeof data === 'string' ? data : null);
          
          if (output) {
            console.log("[Nexus AI] n8n response received");
            return Response.json({ output });
          }
        }
        console.warn("[Nexus AI] n8n call failed or returned empty, falling back...");
      } catch (n8nErr) {
        console.error("[Nexus AI] n8n Error:", n8nErr.message);
      }
    }

    // --- 2. Fallback: Direct Gemini SDK ---
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      return Response.json(
        { output: "⚙️ ระบบ n8n ไม่ตอบสนอง และไม่ได้ตั้งค่า `GEMINI_API_KEY` ใน .env.local ครับ" },
        { status: 200 }
      );
    }

    console.log("[Nexus AI] Falling back to Gemini SDK...");
    const sid = sessionId || "default";
    if (!sessions.has(sid)) sessions.set(sid, []);
    const history = sessions.get(sid);

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT + (userRole ? `\n\nCurrent user role: ${userRole}` : ""),
    });

    const chat = model.startChat({
      history: history.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(chatInput);
    const responseText = result?.response?.text?.()?.trim() || "";

    if (responseText) {
      history.push({ role: "user", content: chatInput });
      history.push({ role: "assistant", content: responseText });
      return Response.json({ output: responseText });
    }

    return Response.json({ output: "ขออภัยครับ ระบบขัดข้องชั่วคราว" });

  } catch (err) {
    console.error("[Nexus AI] Fatal Error:", err.message);
    return Response.json({ output: "⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ AI" });
  }
}

