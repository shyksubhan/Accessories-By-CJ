require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Initialize DB (runs schema + seed)
require("./database");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ────────────────────────────────────────────────────────────────────
// Bug 7 Fix: Read allowed origins from the environment so the server works
// in production without code changes. In development the localhost origins
// are always included as a safe fallback.
//
// In your .env file add (comma-separated, no spaces):
//   ALLOWED_ORIGINS=https://your-store.com,https://www.your-store.com
//
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "https://accessories-by-cj.onrender.com",
];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Serve uploaded files statically ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/warranty", require("./routes/warranty"));
app.use("/api/admin", require("./routes/admin"));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Acc-by-CJ API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── Serve React frontend build ──────────────────────────────────────────────
const frontendDist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Acc-by-CJ Backend running at http://localhost:${PORT}`);
  console.log(`📊 Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
  console.log(`📦 Orders:   http://localhost:${PORT}/api/orders`);
  console.log(`💬 Contact:  http://localhost:${PORT}/api/contact`);
  console.log(`🛡️  Warranty: http://localhost:${PORT}/api/warranty`);
  console.log(`\n🌐 Allowed CORS origins: ${allowedOrigins.join(", ")}\n`);
});

module.exports = app;
