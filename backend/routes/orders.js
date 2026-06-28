const express = require("express");
const router = express.Router();
const db = require("../database");
const { requireAdmin } = require("../middleware/auth");

// Bug 5 Fix: throw a proper error if all 10 attempts produce collisions
// instead of silently inserting a duplicate orderNumber.
function genOrderNumber() {
  return `CJ${Math.floor(10000 + Math.random() * 90000)}`;
}

function uniqueOrderNumber() {
  const MAX_ATTEMPTS = 10;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const candidate = genOrderNumber();
    if (!db.orders.findOne((o) => o.orderNumber === candidate)) {
      return candidate;
    }
  }
  throw new Error(
    "Could not generate a unique order number after 10 attempts. " +
    "This is extremely unlikely — please retry."
  );
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────
router.post("/", (req, res) => {
  try {
    const { fullName, phone, email, address, city, postalCode, notes, items } = req.body;
    if (!fullName || !phone || !address || !city)
      return res.status(400).json({ error: "fullName, phone, address, city are required" });
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: "items array is required" });

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 3000 ? 0 : 250;
    const grandTotal = subtotal + shipping;

    // Bug 5 Fix: use the throwing helper instead of the silent loop
    const orderNumber = uniqueOrderNumber();

    const order = db.orders.insert({
      orderNumber,
      customer: { fullName, phone, email: email || null },
      shipping: { address, city, postalCode: postalCode || null, notes: notes || null },
      pricing: { subtotal, shipping, grandTotal },
      status: "pending",
      paymentMethod: "cod",
    });

    items.forEach((item) => {
      db.orderItems.insert({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      });
    });

    const orderItems = db.orderItems.find((i) => i.orderId === order.id);
    res.status(201).json({ success: true, order: { ...order, items: orderItems } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/orders/admin ────────────────────────────────────────────────────
router.get("/admin", requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let orders = db.orders.find();

  if (status && status !== "all") orders = orders.filter((o) => o.status === status);
  if (search) {
    const s = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customer.fullName.toLowerCase().includes(s) ||
        o.customer.phone.includes(s)
    );
  }

  orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const result = orders.map((o) => ({
    ...o,
    items: db.orderItems.find((i) => i.orderId === o.id),
  }));

  res.json({ orders: result, total: result.length });
});

// ─── GET /api/orders/admin/:id ────────────────────────────────────────────────
router.get("/admin/:id", requireAdmin, (req, res) => {
  const order = db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  const items = db.orderItems.find((i) => i.orderId === order.id);
  res.json({ ...order, items });
});

// ─── PATCH /api/orders/admin/:id/status ──────────────────────────────────────
router.patch("/admin/:id/status", requireAdmin, (req, res) => {
  const { status } = req.body;
  const valid = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!valid.includes(status))
    return res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });

  const order = db.orders.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  const updated = db.orders.updateById(req.params.id, { status });
  const items = db.orderItems.find((i) => i.orderId === req.params.id);
  res.json({ ...updated, items });
});

module.exports = router;
