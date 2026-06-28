const express = require("express");
const router = express.Router();
const db = require("../database");
const { requireAdmin } = require("../middleware/auth");

function genOrderNumber() {
  return `CJ${Math.floor(10000 + Math.random() * 90000)}`;
}

async function uniqueOrderNumber() {
  for (let i = 0; i < 10; i++) {
    const candidate = genOrderNumber();
    const existing = await db.orders.findOne((o) => o.orderNumber === candidate);
    if (!existing) return candidate;
  }
  throw new Error("Could not generate unique order number, please retry.");
}

router.post("/", async (req, res) => {
  try {
    const { fullName, phone, email, address, city, postalCode, notes, items } = req.body;
    if (!fullName || !phone || !address || !city)
      return res.status(400).json({ error: "fullName, phone, address, city are required" });
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: "items array is required" });

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 3000 ? 0 : 250;
    const grandTotal = subtotal + shipping;
    const orderNumber = await uniqueOrderNumber();

    const order = await db.orders.insert({
      orderNumber,
      customer: { fullName, phone, email: email || null },
      shipping: { address, city, postalCode: postalCode || null, notes: notes || null },
      pricing: { subtotal, shipping, grandTotal },
      status: "pending",
      paymentMethod: "cod",
    });

    for (const item of items) {
      await db.orderItems.insert({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      });
    }

    const orderItems = await db.orderItems.find((i) => i.orderId === order.id);
    res.status(201).json({ success: true, order: { ...order, items: orderItems } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let orders = await db.orders.find();
    if (status && status !== "all") orders = orders.filter((o) => o.status === status);
    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(
        (o) => o.orderNumber?.toLowerCase().includes(s) ||
               o.customer?.fullName?.toLowerCase().includes(s) ||
               o.customer?.phone?.includes(s)
      );
    }
    const result = await Promise.all(
      orders.map(async (o) => ({ ...o, items: await db.orderItems.find((i) => i.orderId === o.id) }))
    );
    res.json({ orders: result, total: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/:id", requireAdmin, async (req, res) => {
  try {
    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const items = await db.orderItems.find((i) => i.orderId === order.id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/admin/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!valid.includes(status))
      return res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });
    const order = await db.orders.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const updated = await db.orders.updateById(req.params.id, { status });
    const items = await db.orderItems.find((i) => i.orderId === req.params.id);
    res.json({ ...updated, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
