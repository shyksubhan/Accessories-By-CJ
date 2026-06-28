const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const db = require("../database");
const { requireAdmin } = require("../middleware/auth");

// ─── Multer setup ─────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `product_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase()) &&
               /jpeg|jpg|png|webp/.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Only image files are allowed"));
  },
});

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

function productImage(p) {
  if (p.imagePath) return `${BACKEND_URL}/uploads/products/${path.basename(p.imagePath)}`;
  return p.image;
}

// ─── GET /api/products ───────────────────────────────────────────────────────
router.get("/", (req, res) => {
  const { category } = req.query;
  const all = db.products.find((p) =>
    p.inStock && (!category || p.category === category)
  );
  res.json(all.map((p) => ({ ...p, image: productImage(p) })));
});

// ─── GET /api/products/admin/all ─────────────────────────────────────────────
// NOTE: this must come before /:id to avoid route conflict
router.get("/admin/all", requireAdmin, (_req, res) => {
  const all = db.products.find().sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(all.map((p) => ({ ...p, image: productImage(p) })));
});

// ─── GET /api/products/:id ───────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const p = db.products.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found" });
  res.json({ ...p, image: productImage(p) });
});

// ─── POST /api/products/admin/create ─────────────────────────────────────────
router.post("/admin/create", requireAdmin, upload.single("image"), (req, res) => {
  try {
    const { name, category, price, originalPrice, description, features, badge } = req.body;
    if (!name || !category || !price || !description)
      return res.status(400).json({ error: "name, category, price, description are required" });

    const featuresArr = features
      ? (typeof features === "string" ? JSON.parse(features) : features)
      : [];

    const product = db.products.insert({
      id: `${category.slice(0, 3).toLowerCase()}-${Date.now()}`,
      name, category,
      price: parseInt(price),
      originalPrice: originalPrice ? parseInt(originalPrice) : null,
      description,
      features: featuresArr,
      image: null,
      imagePath: req.file ? req.file.path : null,
      badge: badge || null,
      inStock: true,
    });

    res.status(201).json({ ...product, image: productImage(product) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/products/admin/:id ─────────────────────────────────────────────
router.put("/admin/:id", requireAdmin, upload.single("image"), (req, res) => {
  try {
    const existing = db.products.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Product not found" });

    const { name, category, price, originalPrice, description, features, badge, inStock } = req.body;
    const featuresArr = features
      ? (typeof features === "string" ? JSON.parse(features) : features)
      : existing.features;

    if (req.file && existing.imagePath && fs.existsSync(existing.imagePath)) {
      try { fs.unlinkSync(existing.imagePath); } catch (_) {}
    }

    const updated = db.products.updateById(req.params.id, {
      name: name || existing.name,
      category: category || existing.category,
      price: price ? parseInt(price) : existing.price,
      originalPrice: originalPrice !== undefined
        ? (originalPrice ? parseInt(originalPrice) : null)
        : existing.originalPrice,
      description: description || existing.description,
      features: featuresArr,
      imagePath: req.file ? req.file.path : existing.imagePath,
      image: req.file ? null : existing.image,
      badge: badge !== undefined ? (badge || null) : existing.badge,
      inStock: inStock !== undefined
        ? (inStock === "true" || inStock === true)
        : existing.inStock,
    });

    res.json({ ...updated, image: productImage(updated) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/products/admin/:id ──────────────────────────────────────────
router.delete("/admin/:id", requireAdmin, (req, res) => {
  const existing = db.products.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Product not found" });

  if (existing.imagePath && fs.existsSync(existing.imagePath)) {
    try { fs.unlinkSync(existing.imagePath); } catch (_) {}
  }
  db.products.deleteById(req.params.id);
  res.json({ success: true });
});

module.exports = router;
