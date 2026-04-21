import { GoogleGenerativeAI } from "@google/generative-ai";

// Direct Gemini integration — no n8n dependency, no CORS, no webhook ID changes
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
    console.error("[Nexus AI] API Key is missing or default placeholder.");
    return Response.json(
      { output: "⚙️ กรุณาใส่ API Key จริงใน .env.local ครับ" },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const { chatInput, sessionId, userRole } = body;
    console.log("[Nexus AI] Input:", chatInput, "| Role:", userRole);

    if (!chatInput) return Response.json({ output: "Input missing" });

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Back to original model that works with this API key
      systemInstruction: SYSTEM_PROMPT + (userRole ? `\n\nCurrent user role: ${userRole}` : ""),
    });

    const sid = sessionId || "default";
    if (!sessions.has(sid)) sessions.set(sid, []);
    const history = sessions.get(sid);

    const chat = model.startChat({ history: history.slice(-10) });
    
    console.log("[Nexus AI] Sending to Gemini...");
    const result = await chat.sendMessage(chatInput);
    const responseText = result.response.text();
    console.log("[Nexus AI] Gemini Response received.");

    history.push({ role: "user", parts: [{ text: chatInput }] });
    history.push({ role: "model", parts: [{ text: responseText }] });

    return Response.json({ output: responseText });
  } catch (err) {
    console.error("[Nexus AI] SDK Error:", err.message);
    
    // Better error handling for quota exceeded
    if (err.message.includes("quota") || err.message.includes("429")) {
      return Response.json({
        output: `⏳ **ขออภัยครับ Quota ของ AI หมดแล้ว**\n\n` +
                `API Key นี้ใช้ได้ 20 requests ต่อวันสำหรับ Free Tier\n\n` +
                `**วิธีแก้:**\n` +
                `1. รอให้ quota reset (พรุ่งนี้)\n` +
                `2. หรือสร้าง API key ใหม่ที่: https://aistudio.google.com/apikey\n\n` +
                `ขอบคุณที่ใช้งาน Nexus AI ครับ 🙏`
      });
    }
    
    // Better error handling for model not found
    if (err.message.includes("404") || err.message.includes("not found")) {
      return Response.json({
        output: `⚠️ **Model ไม่รองรับ**\n\n` +
                `API Key นี้ใช้ได้เฉพาะ model: gemini-2.5-flash\n\n` +
                `กรุณาตรวจสอบ API Key หรือติดต่อผู้ดูแลระบบครับ`
      });
    }
    
    return Response.json({
      output: `⚠️ เกิดข้อผิดพลาด: ${err.message}`
    });
  }
}
