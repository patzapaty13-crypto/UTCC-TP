// Nexus AI — Google Gemini (via @google/generative-ai SDK)
// Primary: gemini-1.5-flash (fast, free tier). Override with GEMINI_MODEL if desired.
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// In-memory conversation history per session (resets on server restart)
const sessions = new Map();

const SYSTEM_PROMPT = `You are Nexus AI, the Advanced Executive Assistant for the UTCC-TP Internship & Trip Platform.

Your expertise:
- Internship search and application guidance (guide to /internships)
- Application tracking (guide to /applications)
- Resume and profile management (guide to /profile)
- Trip scheduling and management
- Report submission (guide to /reports)
- Platform navigation

Role-based guidelines (respond based on context clues from the user):
- STUDENT: Focus on job search, applications, resume tips. Guide to /internships and /applications.
- ADVISOR/STAFF: Help with student tracking (/advisor/students), report review (/advisor/reports), trip management.
- ADMIN: System configuration (/admin/settings), user management, analytics (/analytics).

Rules:
1. Always respond in the same language as the user
2. Be professional, concise, and supportive
3. Never reveal admin features to students
4. Provide actionable guidance with specific platform menu directions
5. If asked about resume, give practical tips: clear contact info, strong summary, highlight skills, quantify achievements, clean layout
6. Keep responses under 200 words unless the user asks for detail`;

export async function POST(request) {
  console.log("[Nexus AI] Incoming request...");

  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    console.error("[Nexus AI] GEMINI_API_KEY is missing.");
    return Response.json(
      { output: "⚙️ กรุณาตั้งค่า `GEMINI_API_KEY` ใน .env.local ครับ (ขอฟรีที่ https://aistudio.google.com/app/apikey)" },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const { chatInput, sessionId, userRole } = body;
    console.log("[Nexus AI] Input:", chatInput, "| Role:", userRole);

    if (!chatInput) return Response.json({ output: "Input missing" });

    const sid = sessionId || "default";
    if (!sessions.has(sid)) sessions.set(sid, []);
    const history = sessions.get(sid);

    const systemInstruction = SYSTEM_PROMPT + (userRole ? `\n\nCurrent user role: ${userRole}` : "");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1024,
      },
    });

    console.log("[Nexus AI] Calling Gemini model:", GEMINI_MODEL);
    const chat = model.startChat({
      history: history.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(chatInput);
    const responseText = result?.response?.text?.()?.trim() || "";

    if (!responseText) {
      console.warn("[Nexus AI] Empty response payload");
      return Response.json({ output: "ระบบตอบกลับว่างเปล่า กรุณาลองถามอีกครั้งครับ" });
    }

    history.push({ role: "user", content: chatInput });
    history.push({ role: "assistant", content: responseText });

    console.log("[Nexus AI] Gemini response received, length:", responseText.length);
    return Response.json({ output: responseText });
  } catch (err) {
    const msg = err?.message || String(err) || "ไม่ทราบสาเหตุ";
    console.error("[Nexus AI] Server Error:", msg);

    // Handle common Gemini error patterns
    if (/API key/i.test(msg) || /API_KEY_INVALID/i.test(msg)) {
      return Response.json({
        output: "🔐 API Key ไม่ถูกต้อง กรุณาตรวจสอบ `GEMINI_API_KEY` ใน .env.local",
      });
    }
    if (/quota|rate limit|429/i.test(msg)) {
      return Response.json({
        output: "⏳ ขออภัย Gemini โดน rate limit ชั่วคราว กรุณาลองใหม่ใน 30 วินาทีครับ",
      });
    }
    return Response.json({
      output: `⚠️ เกิดข้อผิดพลาดจาก Gemini: ${msg.slice(0, 200)}`,
    });
  }
}
