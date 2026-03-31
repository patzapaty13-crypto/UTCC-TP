/**
 * UTCC-TP Application Configuration
 *
 * DEPLOYMENT:
 *   - For local development: keep apiBase as "" (same-origin).
 *   - For Vercel + Render deployment:
 *     Set apiBase to your Render backend URL, e.g.:
 *       apiBase: "https://utcc-tp.onrender.com"
 *   - Ensure the Render service has these env vars:
 *       SPRING_PROFILES_ACTIVE=postgres
 *       DB_URL=jdbc:postgresql://host:5432/utcctp
 *       DB_USER=<user>
 *       DB_PASSWORD=<password>
 *       AI_PROVIDER=openai  (or "mock" for testing)
 *       OPENAI_API_KEY=<key>
 */
window.__APP_CONFIG__ = {
  apiBase: "",
  googleMapsApiKey: "YOUR_API_KEY_HERE"
};
