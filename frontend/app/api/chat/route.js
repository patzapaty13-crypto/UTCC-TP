// Server-side proxy to n8n webhook — bypasses CORS completely
const N8N_WEBHOOK_URL =
  "https://thanathorn123.app.n8n.cloud/webhook/da94c05d-206c-4d04-9de0-1b4284c0d8bd/chat";

export async function POST(request) {
  try {
    const body = await request.json();

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      console.error("[chat proxy] n8n error:", n8nResponse.status, errText);
      return Response.json(
        { error: "n8n returned " + n8nResponse.status },
        { status: n8nResponse.statusCode || 502 }
      );
    }

    const data = await n8nResponse.json();
    return Response.json(data);
  } catch (err) {
    console.error("[chat proxy] Fetch failed:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
