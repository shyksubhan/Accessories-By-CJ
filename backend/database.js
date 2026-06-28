/**
 * database.js — Pure-JS JSON file database
 * Works on Windows without Python or C++ build tools.
 * Data is persisted in backend/data/*.json files.
 *
 * Bug 6 Fix: _save() is now debounced (10 ms) and uses writeFile (async).
 * This prevents:
 *   - Blocking the Node.js event loop on every mutation
 *   - Race conditions where two simultaneous requests overwrite each other
 *     because the synchronous write of request A would interleave with B.
 * All in-memory reads remain instant; only disk I/O is deferred.
 */

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── Collection class ─────────────────────────────────────────────────────────
class Collection {
  constructor(name) {
    this.name = name;
    this.file = path.join(DATA_DIR, `${name}.json`);
    this._data = this._load();
    this._saveTimer = null; // debounce handle
  }

  _load() {
    try {
      if (fs.existsSync(this.file)) {
        return JSON.parse(fs.readFileSync(this.file, "utf8"));
      }
    } catch (_) {}
    return [];
  }

  // Bug 6 Fix: debounced async save — coalesces rapid back-to-back mutations
  // into a single disk write, eliminating the race condition and the event-loop
  // block that synchronous writeFileSync caused.
  _save() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      const snapshot = JSON.stringify(this._data, null, 2);
      fs.writeFile(this.file, snapshot, "utf8", (err) => {
        if (err) console.error(`[DB] Failed to save ${this.name}:`, err);
      });
      this._saveTimer = null;
    }, 10); // 10 ms debounce — effectively instant for sequential requests
  }

  // Return all records (optionally filtered)
  find(predicate = null) {
    if (!predicate) return [...this._data];
    return this._data.filter(predicate);
  }

  // Return first matching record
  findOne(predicate) {
    return this._data.find(predicate) || null;
  }

  // Find by id
  findById(id) {
    return this._data.find((r) => r.id === id) || null;
  }

  // Insert a new record
  insert(record) {
    if (!record.id) record.id = uuidv4();
    if (!record.createdAt) record.createdAt = new Date().toISOString();
    if (!record.updatedAt) record.updatedAt = record.createdAt;
    this._data.push(record);
    this._save();
    return { ...record };
  }

  // Update a record by id
  updateById(id, updates) {
    const idx = this._data.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this._data[idx] = { ...this._data[idx], ...updates, updatedAt: new Date().toISOString() };
    this._save();
    return { ...this._data[idx] };
  }

  // Delete a record by id
  deleteById(id) {
    const idx = this._data.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this._data.splice(idx, 1);
    this._save();
    return true;
  }

  // Count records
  count(predicate = null) {
    return predicate ? this._data.filter(predicate).length : this._data.length;
  }

  // Aggregate sum
  sum(field, predicate = null) {
    const records = predicate ? this._data.filter(predicate) : this._data;
    return records.reduce((s, r) => s + (r[field] || 0), 0);
  }
}

// ─── Collections ──────────────────────────────────────────────────────────────
const db = {
  products: new Collection("products"),
  orders: new Collection("orders"),
  orderItems: new Collection("order_items"),
  contact: new Collection("contact_messages"),
  warranty: new Collection("warranty_claims"),
  admins: new Collection("admin_users"),
};

// ─── Seed products ────────────────────────────────────────────────────────────
const PRODUCTS_SEED = [
  { id: "chr-001", name: "GaN Fast Charger 65W", category: "Chargers", price: 3499, originalPrice: 4499, description: "Ultra-compact 65W GaN charger with dual USB-C ports. Charges your MacBook, iPhone, and iPad simultaneously at full speed.", features: ["65W Total Output", "GaN Technology", "Dual USB-C", "Overheat Protection", "Universal Compatibility"], image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80", badge: "Best Seller", inStock: true },
  { id: "chr-002", name: "Wireless Charging Pad", category: "Chargers", price: 2499, originalPrice: 2999, description: "Sleek 15W fast wireless charging pad with LED indicator. Compatible with all Qi-enabled devices.", features: ["15W Fast Charge", "Qi Certified", "LED Indicator", "Slim Design", "Case Friendly"], image: "https://images.unsplash.com/photo-1622021195498-b24c577c2ec1?w=600&q=80", badge: null, inStock: true },
  { id: "chr-003", name: "Car Fast Charger Duo", category: "Chargers", price: 1999, originalPrice: null, description: "Dual-port car charger with 45W USB-C PD and 18W USB-A.", features: ["45W USB-C PD", "18W USB-A", "Intelligent Chip", "LED Ambient Light", "Compact Size"], image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&q=80", badge: "New", inStock: true },
  { id: "cbl-001", name: "Braided USB-C to Lightning", category: "Cables", price: 1499, originalPrice: 1999, description: "Premium braided nylon cable with reinforced connectors. MFi certified for reliable iPhone charging and data sync.", features: ["MFi Certified", "Braided Nylon", "2 Meter Length", "Reinforced Connectors", "Fast Data Sync"], image: "https://images.unsplash.com/photo-1621018592736-23bd3d2f7f68?w=600&q=80", badge: "Popular", inStock: true },
  { id: "cbl-002", name: "USB-C to USB-C Cable 100W", category: "Cables", price: 1799, originalPrice: null, description: "High-speed 100W USB-C cable with e-marker chip.", features: ["100W Power Delivery", "E-Marker Chip", "Braided Design", "1.5 Meter", "480Mbps Data"], image: "https://images.unsplash.com/photo-1678197724056-7e61735a903c?w=600&q=80", badge: "New", inStock: true },
  { id: "cbl-003", name: "3-in-1 Magnetic Cable", category: "Cables", price: 2199, originalPrice: 2699, description: "Versatile 3-in-1 cable with magnetic tips for USB-C, Lightning, and Micro-USB.", features: ["3 Connectors", "Magnetic Tips", "Fast Charging", "LED Indicator", "Tangle-Free"], image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80", badge: null, inStock: true },
  { id: "pwb-001", name: "Magnetic Power Bank 10000mAh", category: "Power Banks", price: 4499, originalPrice: 5499, description: "Slim 10000mAh magnetic wireless power bank with 20W wired output.", features: ["10000mAh Capacity", "15W Wireless", "20W USB-C", "Magnetic Snap", "LED Battery Indicator"], image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80", badge: "Best Seller", inStock: true },
  { id: "pwb-002", name: "Ultra-Slim Power Bank 5000mAh", category: "Power Banks", price: 2999, originalPrice: null, description: "Credit card-sized 5000mAh power bank.", features: ["5000mAh", "Ultra-Slim 8mm", "20W USB-C", "Pass-Through Charging", "Pocket-Friendly"], image: "https://images.unsplash.com/photo-1589496933738-f0e3cde539b5?w=600&q=80", badge: null, inStock: true },
  { id: "pwb-003", name: "20000mAh Beast Power Bank", category: "Power Banks", price: 5999, originalPrice: null, description: "Massive 20000mAh capacity with triple output.", features: ["20000mAh", "Triple Output", "65W USB-C", "Digital Display", "Airline Safe"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", badge: "Premium", inStock: true },
  { id: "ear-001", name: "AirPods Pro-Style ANC Earbuds", category: "Earbuds", price: 6999, originalPrice: 8999, description: "Premium ANC earbuds with spatial audio and transparency mode.", features: ["Active Noise Cancellation", "Spatial Audio", "36hr Battery", "IPX5 Water Resistant", "Touch Controls"], image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80", badge: "Best Seller", inStock: true },
  { id: "ear-002", name: "Sports Clip Earbuds", category: "Earbuds", price: 3999, originalPrice: 4999, description: "Secure-fit ear-hook earbuds built for workouts.", features: ["Ear-Hook Design", "IPX7 Waterproof", "12hr Playback", "Bass Boost", "Built-in Mic"], image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80", badge: null, inStock: true },
  { id: "ear-003", name: "Pod Mini Ultra Compact", category: "Earbuds", price: 4999, originalPrice: null, description: "The smallest true wireless earbuds with 24hr total battery.", features: ["3.8g Lightweight", "24hr Battery", "Bluetooth 5.3", "Touch Control", "Compact Case"], image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&q=80", badge: "New", inStock: true },
  { id: "cas-001", name: "Clear MagSafe Case", category: "Cases", price: 2499, originalPrice: 2999, description: "Crystal-clear anti-yellowing MagSafe case with military-grade drop protection.", features: ["MagSafe Compatible", "Anti-Yellowing", "Military Drop Test", "Raised Edges", "Slim Profile"], image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&q=80", badge: "Popular", inStock: true },
  { id: "cas-002", name: "Leather Folio Wallet Case", category: "Cases", price: 3999, originalPrice: 4999, description: "Genuine leather folio case with card slots and a built-in stand.", features: ["Genuine Leather", "Card Slots x3", "Built-in Stand", "Magnetic Closure", "RFID Blocking"], image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=600&q=80", badge: "Premium", inStock: true },
  { id: "cas-003", name: "Shockproof Armor Case", category: "Cases", price: 2999, originalPrice: null, description: "Heavy-duty dual-layer armor case with kickstand and belt holster.", features: ["Dual-Layer Protection", "Built-in Kickstand", "Belt Holster", "Port Covers", "Textured Grip"], image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80", badge: null, inStock: true },
  { id: "cas-004", name: "Silicone Soft-Touch Case", category: "Cases", price: 1799, originalPrice: null, description: "Ultra-thin silicone case with a velvety soft-touch finish.", features: ["Soft-Touch Finish", "Ultra-Thin 1mm", "Microfiber Lining", "Precise Cutouts", "10 Colors"], image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", badge: null, inStock: true },
];

if (db.products.count() === 0) {
  const now = new Date().toISOString();
  PRODUCTS_SEED.forEach((p) => {
    db.products.insert({ ...p, createdAt: now, updatedAt: now });
  });
  console.log(`✅ Seeded ${PRODUCTS_SEED.length} products`);
}

if (db.admins.count() === 0) {
  db.admins.insert({
    username: "admin",
    password: bcrypt.hashSync("cj@admin2024", 10),
  });
  console.log("✅ Admin user created  →  username: admin  |  password: cj@admin2024");
}

module.exports = db;
