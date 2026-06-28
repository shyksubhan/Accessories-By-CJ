const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../database");
const { requireAdmin } = require("../middleware/auth");

// ─── POST /api/contact ────────────────────────────────────────────────────────
router.post("/", (req, res) => {
  try {
    const { fullName, phone, email, subject, message } = req.body;
    if (!fullName || !phone || !subject || !message)
      return res.status(400).json({ error: "fullName, phone, subject, message are required" });

    db.contact.insert({ fullName, phone, email: email || null, subject, message, isRead: false });
    res.status(201).json({ success: true, message: "Your message has been received. We will contact you shortly." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/contact/admin ───────────────────────────────────────────────────
router.get("/admin", requireAdmin, (req, res) => {
  const { unread, search } = req.query;
  let messages = db.contact.find();
  if (unread === "true") messages = messages.filter((m) => !m.isRead);
  if (search) {
    const s = search.toLowerCase();
    messages = messages.filter((m) =>
      m.fullName.toLowerCase().includes(s) ||
      m.subject.toLowerCase().includes(s) ||
      m.message.toLowerCase().includes(s)
    );
  }
  messages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unreadCount = db.contact.count((m) => !m.isRead);
  res.json({ messages, unreadCount });
});

// ─── PATCH /api/contact/admin/:id/read ───────────────────────────────────────
router.patch("/admin/:id/read", requireAdmin, (req, res) => {
  const msg = db.contact.findById(req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });
  db.contact.updateById(req.params.id, { isRead: true });
  res.json({ success: true });
});

// ─── DELETE /api/contact/admin/:id ───────────────────────────────────────────
router.delete("/admin/:id", requireAdmin, (req, res) => {
  if (!db.contact.findById(req.params.id)) return res.status(404).json({ error: "Message not found" });
  db.contact.deleteById(req.params.id);
  res.json({ success: true });
});

module.exports = router;
