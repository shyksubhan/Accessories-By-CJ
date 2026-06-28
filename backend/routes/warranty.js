const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("../database");
const { requireAdmin } = require("../middleware/auth");

const warrantyUploadsDir = path.join(__dirname, "../uploads/warranty");
if (!fs.existsSync(warrantyUploadsDir)) fs.mkdirSync(warrantyUploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, warrantyUploadsDir),
  filename: (_req, file, cb) =>
    cb(null, `warranty_${Date.now()}${path.extname(file.originalname)}`),
});

// Bug 4 Fix: validate BOTH file extension AND MIME type.
// The original code only checked the extension, which meant a file named
// "malware.jpg" with mimetype "application/javascript" would slip through.
const ALLOWED_EXTENSIONS = /jpeg|jpg|png|webp/;
const ALLOWED_MIMETYPES = /image\/(jpeg|jpg|png|webp)/;

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extOk = ALLOWED_EXTENSIONS.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeOk = ALLOWED_MIMETYPES.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, or WebP image files are allowed"));
    }
  },
});

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

function genClaimNumber() {
  return `WC${Math.floor(10000 + Math.random() * 90000)}`;
}

function formatClaim(c) {
  return {
    ...c,
    imageUrl: c.imagePath
      ? `${BACKEND_URL}/uploads/warranty/${path.basename(c.imagePath)}`
      : null,
  };
}

// ─── POST /api/warranty ───────────────────────────────────────────────────────
router.post("/", upload.single("image"), (req, res) => {
  try {
    const {
      fullName, phone, email, orderNumber,
      productName, category, purchaseDate, issueDesc,
    } = req.body;

    if (!fullName || !phone || !productName || !category || !purchaseDate || !issueDesc)
      return res.status(400).json({
        error: "fullName, phone, productName, category, purchaseDate, issueDesc are required",
      });

    let claimNumber;
    let attempts = 0;
    do {
      claimNumber = genClaimNumber();
      attempts++;
    } while (db.warranty.findOne((c) => c.claimNumber === claimNumber) && attempts < 10);

    const claim = db.warranty.insert({
      claimNumber,
      customer: { fullName, phone, email: email || null, orderNumber: orderNumber || null },
      product: { name: productName, category, purchaseDate },
      issueDesc,
      imagePath: req.file ? req.file.path : null,
      status: "open",
      adminNotes: null,
    });

    res.status(201).json({ success: true, claim: formatClaim(claim) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/warranty/admin ──────────────────────────────────────────────────
router.get("/admin", requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let claims = db.warranty.find();
  if (status && status !== "all") claims = claims.filter((c) => c.status === status);
  if (search) {
    const s = search.toLowerCase();
    claims = claims.filter(
      (c) =>
        c.claimNumber.toLowerCase().includes(s) ||
        c.customer.fullName.toLowerCase().includes(s) ||
        c.product.name.toLowerCase().includes(s)
    );
  }
  claims = claims.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ claims: claims.map(formatClaim) });
});

// ─── PATCH /api/warranty/admin/:id/status ────────────────────────────────────
router.patch("/admin/:id/status", requireAdmin, (req, res) => {
  const { status, adminNotes } = req.body;
  const valid = ["open", "under_review", "approved", "rejected", "resolved"];
  if (!valid.includes(status))
    return res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });

  const claim = db.warranty.findById(req.params.id);
  if (!claim) return res.status(404).json({ error: "Warranty claim not found" });

  const updated = db.warranty.updateById(req.params.id, {
    status,
    adminNotes: adminNotes || claim.adminNotes,
  });
  res.json(formatClaim(updated));
});

// ─── DELETE /api/warranty/admin/:id ──────────────────────────────────────────
router.delete("/admin/:id", requireAdmin, (req, res) => {
  const claim = db.warranty.findById(req.params.id);
  if (!claim) return res.status(404).json({ error: "Warranty claim not found" });
  if (claim.imagePath && fs.existsSync(claim.imagePath)) {
    try {
      fs.unlinkSync(claim.imagePath);
    } catch (_) {}
  }
  db.warranty.deleteById(req.params.id);
  res.json({ success: true });
});

module.exports = router;
