const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../database");
const { requireAdmin } = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    const { fullName, phone, email, subject, message } = req.body;
    if (!fullName || !phone || !subject || !message)
      return res.status(400).json({ error: "fullName, phone, subject, message are required" });
    await db.contact.insert({ fullName, phone, email: email || null, subject, message, isRead: false });
    res.status(201).json({ success: true, message: "Your message has been received." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const { unread, search } = req.query;
    let messages = await db.contact.find();
    if (unread === "true") messages = messages.filter((m) => !m.isRead);
    if (search) {
      const s = search.toLowerCase();
      messages = messages.filter((m) => m.fullName?.toLowerCase().includes(s) || m.subject?.toLowerCase().includes(s) || m.message?.toLowerCase().includes(s));
    }
    const unreadCount = messages.filter((m) => !m.isRead).length;
    res.json({ messages, unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/admin/:id/read", requireAdmin, async (req, res) => {
  try {
    const msg = await db.contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    await db.contact.updateById(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/admin/:id", requireAdmin, async (req, res) => {
  try {
    if (!await db.contact.findById(req.params.id)) return res.status(404).json({ error: "Message not found" });
    await db.contact.deleteById(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
