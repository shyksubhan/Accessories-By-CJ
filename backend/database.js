/**
 * database.js — Firebase Firestore wrapper
 * Replaces the old JSON file database.
 * All data is now stored in Firebase Firestore — permanent, no data loss on Render.
 */

const { db } = require("./firebase");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

// ─── Collection class ─────────────────────────────────────────────────────────
class Collection {
  constructor(name) {
    this.name = name;
    this.ref = db.collection(name);
  }

  // Find all records (optionally filtered in memory)
  async find(predicate = null) {
    const snap = await this.ref.orderBy("createdAt", "desc").get();
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return predicate ? all.filter(predicate) : all;
  }

  // Find one record
  async findOne(predicate) {
    const all = await this.find();
    return all.find(predicate) || null;
  }

  // Find by id
  async findById(id) {
    const doc = await this.ref.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Insert a new record
  async insert(record) {
    const id = record.id || uuidv4();
    const now = new Date().toISOString();
    const data = {
      ...record,
      id,
      createdAt: record.createdAt || now,
      updatedAt: record.updatedAt || now,
    };
    await this.ref.doc(id).set(data);
    return { ...data };
  }

  // Update a record by id
  async updateById(id, updates) {
    const now = new Date().toISOString();
    await this.ref.doc(id).update({ ...updates, updatedAt: now });
    return await this.findById(id);
  }

  // Delete a record by id
  async deleteById(id) {
    await this.ref.doc(id).delete();
    return true;
  }

  // Count records
  async count(predicate = null) {
    const all = await this.find();
    return predicate ? all.filter(predicate).length : all.length;
  }

  // Sum a field
  async sum(field, predicate = null) {
    const all = await this.find();
    const records = predicate ? all.filter(predicate) : all;
    return records.reduce((s, r) => s + (r[field] || 0), 0);
  }
}

// ─── Collections ──────────────────────────────────────────────────────────────
const database = {
  products: new Collection("products"),
  orders: new Collection("orders"),
  orderItems: new Collection("order_items"),
  contact: new Collection("contact_messages"),
  warranty: new Collection("warranty_claims"),
  admins: new Collection("admin_users"),
};

// ─── Seed products ────────────────────────────────────────────────────────────
const PRODUCTS_SEED = [
  { id: "chr-001", name: "GaN Fast Charger 65W", category: "Chargers", price: 3499, originalPrice: 4499, description: "Ultra-compact 65W GaN charger with dual USB-C ports.", features: ["65W Total Output", "GaN Technology", "Dual USB-C", "Overheat Protection", "Universal Compatibility"], image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80", badge: "Best Seller", inStock: true },
  { id: "chr-002", name: "Wireless Charging Pad", category: "Chargers", price: 2499, originalPrice: 2999, description: "Sleek 15W fast wireless charging pad with LED indicator.", features: ["15W Fast Charge", "Qi Certified", "LED Indicator", "Slim Design", "Case Friendly"], image: "https://images.unsplash.com/photo-1622021195498-b24c577c2ec1?w=600&q=80", badge: null, inStock: true },
  { id: "chr-003", name: "Car Fast Charger Duo", category: "Chargers", price: 1999, originalPrice: null, description: "Dual-port car charger with 45W USB-C PD and 18W USB-A.", features: ["45W USB-C PD", "18W USB-A", "Intelligent Chip", "LED Ambient Light", "Compact Size"], image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&q=80", badge: "New", inStock: true },
  { id: "cbl-001", name: "Braided USB-C to Lightning", category: "Cables", price: 1499, originalPrice: 1999, description: "Premium braided nylon cable with reinforced connectors.", features: ["MFi Certified", "Braided Nylon", "2 Meter Length", "Reinforced Connectors", "Fast Data Sync"], image: "https://images.unsplash.com/photo-1621018592736-23bd3d2f7f68?w=600&q=80", badge: "Popular", inStock: true },
  { id: "cbl-002", name: "USB-C to USB-C Cable 100W", category: "Cables", price: 1799, originalPrice: null, description: "High-speed 100W USB-C cable with e-marker chip.", features: ["100W Power Delivery", "E-Marker Chip", "Braided Design", "1.5 Meter", "480Mbps Data"], image: "https://images.unsplash.com/photo-1678197724056-7e61735a903c?w=600&q=80", badge: "New", inStock: true },
  { id: "cbl-003", name: "3-in-1 Magnetic Cable", category: "Cables", price: 2199, originalPrice: 2699, description: "Versatile 3-in-1 cable with magnetic tips.", features: ["3 Connectors", "Magnetic Tips", "Fast Charging", "LED Indicator", "Tangle-Free"], image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80", badge: null, inStock: true },
  { id: "pwb-001", name: "Magnetic Power Bank 10000mAh", category: "Power Banks", price: 4499, originalPrice: 5499, description: "Slim 10000mAh magnetic wireless power bank.", features: ["10000mAh Capacity", "15W Wireless", "20W USB-C", "Magnetic Snap", "LED Battery Indicator"], image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80", badge: "Best Seller", inStock: true },
  { id: "pwb-002", name: "Ultra-Slim Power Bank 5000mAh", category: "Power Banks", price: 2999, originalPrice: null, description: "Credit card-sized 5000mAh power bank.", features: ["5000mAh", "Ultra-Slim 8mm", "20W USB-C", "Pass-Through Charging", "Pocket-Friendly"], image: "https://images.unsplash.com/photo-1589496933738-f0e3cde539b5?w=600&q=80", badge: null, inStock: true },
  { id: "pwb-003", name: "20000mAh Beast Power Bank", category: "Power Banks", price: 5999, originalPrice: null, description: "Massive 20000mAh capacity with triple output.", features: ["20000mAh", "Triple Output", "65W USB-C", "Digital Display", "Airline Safe"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", badge: "Premium", inStock: true },
  { id: "ear-001", name: "AirPods Pro-Style ANC Earbuds", category: "Earbuds", price: 6999, originalPrice: 8999, description: "Premium ANC earbuds with spatial audio.", features: ["Active Noise Cancellation", "Spatial Audio", "36hr Battery", "IPX5 Water Resistant", "Touch Controls"], image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80", badge: "Best Seller", inStock: true },
  { id: "ear-002", name: "Sports Clip Earbuds", category: "Earbuds", price: 3999, originalPrice: 4999, description: "Secure-fit ear-hook earbuds built for workouts.", features: ["Ear-Hook Design", "IPX7 Waterproof", "12hr Playback", "Bass Boost", "Built-in Mic"], image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80", badge: null, inStock: true },
  { id: "ear-003", name: "Pod Mini Ultra Compact", category: "Earbuds", price: 4999, originalPrice: null, description: "The smallest true wireless earbuds with 24hr total battery.", features: ["3.8g Lightweight", "24hr Battery", "Bluetooth 5.3", "Touch Control", "Compact Case"], image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=600&q=80", badge: "New", inStock: true },
  { id: "cas-001", name: "Clear MagSafe Case", category: "Cases", price: 2499, originalPrice: 2999, description: "Crystal-clear anti-yellowing MagSafe case.", features: ["MagSafe Compatible", "Anti-Yellowing", "Military Drop Test", "Raised Edges", "Slim Profile"], image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&q=80", badge: "Popular", inStock: true },
  { id: "cas-002", name: "Leather Folio Wallet Case", category: "Cases", price: 3999, originalPrice: 4999, description: "Genuine leather folio case with card slots.", features: ["Genuine Leather", "Card Slots x3", "Built-in Stand", "Magnetic Closure", "RFID Blocking"], image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=600&q=80", badge: "Premium", inStock: true },
  { id: "cas-003", name: "Shockproof Armor Case", category: "Cases", price: 2999, originalPrice: null, description: "Heavy-duty dual-layer armor case with kickstand.", features: ["Dual-Layer Protection", "Built-in Kickstand", "Belt Holster", "Port Covers", "Textured Grip"], image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80", badge: null, inStock: true },
  { id: "cas-004", name: "Silicone Soft-Touch Case", category: "Cases", price: 1799, originalPrice: null, description: "Ultra-thin silicone case with soft-touch finish.", features: ["Soft-Touch Finish", "Ultra-Thin 1mm", "Microfiber Lining", "Precise Cutouts", "10 Colors"], image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", badge: null, inStock: true },
];

// Seed on first run
async function seedIfEmpty() {
  try {
    const count = await database.products.count();
    if (count === 0) {
      console.log("⏳ Seeding products...");
      const now = new Date().toISOString();
      for (const p of PRODUCTS_SEED) {
        await database.products.insert({ ...p, createdAt: now, updatedAt: now });
      }
      console.log(`✅ Seeded ${PRODUCTS_SEED.length} products`);
    }

    const adminCount = await database.admins.count();
    if (adminCount === 0) {
      await database.admins.insert({
        username: "admin",
        password: bcrypt.hashSync("cj@admin2024", 10),
      });
      console.log("✅ Admin user created → username: admin | password: cj@admin2024");
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}

seedIfEmpty();

module.exports = database;
