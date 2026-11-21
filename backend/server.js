// Zero-dependency Node.js backend: REST API + static hosting for the React frontend.
// Run: node server.js   (PORT=3000 by default)
const http = require("http"), fs = require("fs"), path = require("path");
const PORT = process.env.PORT || 3000, DATA = path.join(__dirname, "data"), PUBLIC = path.join(__dirname, "..", "frontend", "public");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".pdf": "application/pdf", ".svg": "image/svg+xml", ".png": "image/png" };
const read = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
const send = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" }); res.end(JSON.stringify(body)); };
const hits = new Map(); // tiny per-IP rate limit: 5 messages / 10 min
const limited = (ip) => { const now = Date.now(), a = (hits.get(ip) || []).filter((t) => now - t < 6e5); a.push(now); hits.set(ip, a); return a.length > 5; };
const esc = (s) => String(s).replace(/[<>]/g, "").trim();

function contact(req, res) {
  let raw = ""; req.on("data", (c) => { raw += c; if (raw.length > 1e4) req.destroy(); });
  req.on("end", () => {
    let b; try { b = JSON.parse(raw); } catch { return send(res, 400, { error: "Invalid JSON" }); }
    if (b.website) return send(res, 201, { ok: true }); // honeypot: silently drop bots
    const name = esc(b.name || ""), email = esc(b.email || ""), message = esc(b.message || "");
    if (name.length < 2) return send(res, 422, { error: "Please enter your name." });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(res, 422, { error: "Please enter a valid email." });
    if (message.length < 10) return send(res, 422, { error: "Message is too short (min 10 characters)." });
    if (limited(req.socket.remoteAddress)) return send(res, 429, { error: "Too many messages, try again later." });
    const file = path.join(DATA, "messages.json"); let all = [];
    try { all = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
    all.push({ id: Date.now(), name, email, message, at: new Date().toISOString() });
    fs.writeFileSync(file, JSON.stringify(all, null, 2));
    console.log(`📩 New message from ${name} <${email}>`);
    send(res, 201, { ok: true, message: "Message received. Thank you!" });
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x"), p = decodeURIComponent(url.pathname);
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (p.startsWith("/api/")) {
    try {
      if (req.method === "GET" && p === "/api/health") return send(res, 200, { status: "ok", uptime: Math.round(process.uptime()), time: new Date().toISOString() });
      if (req.method === "GET" && p === "/api/profile") return send(res, 200, read("profile.json"));
      if (req.method === "GET" && p === "/api/projects") return send(res, 200, read("projects.json"));
      if (req.method === "GET" && p === "/api/certifications") return send(res, 200, read("certifications.json"));
      if (req.method === "POST" && p === "/api/contact") return contact(req, res);
    } catch (e) { return send(res, 500, { error: "Server error" }); }
    return send(res, 404, { error: "Not found" });
  }
  const file = path.normalize(path.join(PUBLIC, p === "/" ? "index.html" : p));
  if (!file.startsWith(PUBLIC)) return send(res, 403, { error: "Forbidden" });
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, { error: "Not found" });
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" }); res.end(buf);
  });
}).listen(PORT, () => console.log(`🚀 Portfolio running → http://localhost:${PORT}`));
