const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");
const { requireAdmin, JWT_SECRET } = require("../middleware/auth");

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password are required" });

  const admin = db.admins.findOne((a) => a.username === username);
  if (!admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
  res.json({ success: true, token, admin: { id: admin.id, username: admin.username } });
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get("/stats", requireAdmin, (_req, res) => {
  const orders = db.orders.find();
  const allItems = db.orderItems.find();

  const byStatus = (s) => orders.filter((o) => o.status === s).length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + (o.pricing?.grandTotal || 0), 0);

  // Revenue by day (last 7 days)
  const revenueByDay = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayOrders = orders.filter(
      (o) => o.createdAt?.startsWith(dateStr) && o.status !== "cancelled"
    );
    revenueByDay.push({
      date: dateStr,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + (o.pricing?.grandTotal || 0), 0),
    });
  }

  // Top products
  const productSales = {};
  allItems.forEach((item) => {
    const order = db.orders.findById(item.orderId);
    if (!order || order.status === "cancelled") return;
    if (!productSales[item.productName])
      productSales[item.productName] = { totalSold: 0, totalRevenue: 0 };
    productSales[item.productName].totalSold += item.quantity;
    productSales[item.productName].totalRevenue += item.subtotal;
  });
  const topProducts = Object.entries(productSales)
    .map(([name, s]) => ({ product_name: name, ...s }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  // Recent 5 orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer?.fullName,
      city: o.shipping?.city,
      grandTotal: o.pricing?.grandTotal,
      status: o.status,
      createdAt: o.createdAt,
    }));

  res.json({
    orders: {
      total: orders.length,
      pending: byStatus("pending"),
      confirmed: byStatus("confirmed"),
      shipped: byStatus("shipped"),
      delivered: byStatus("delivered"),
      cancelled: byStatus("cancelled"),
      byStatus: ["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => ({
        status: s,
        count: byStatus(s),
      })),
    },
    revenue: { total: totalRevenue, byDay: revenueByDay },
    messages: {
      total: db.contact.count(),
      unread: db.contact.count((m) => !m.isRead),
    },
    warranty: {
      total: db.warranty.count(),
      open: db.warranty.count((c) => c.status === "open"),
    },
    // Bug 9 Fix: count only in-stock products so the dashboard number matches
    // what customers can actually see and buy on the storefront.
    products: {
      total: db.products.count((p) => p.inStock),
      totalIncludingOutOfStock: db.products.count(),
    },
    recentOrders,
    topProducts,
  });
});

// ─── POST /api/admin/change-password ─────────────────────────────────────────
router.post("/change-password", requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res
      .status(400)
      .json({ error: "currentPassword and newPassword are required" });
  if (newPassword.length < 6)
    return res
      .status(400)
      .json({ error: "newPassword must be at least 6 characters" });

  const admin = db.admins.findById(req.admin.id);
  if (!bcrypt.compareSync(currentPassword, admin.password))
    return res.status(401).json({ error: "Current password is incorrect" });

  db.admins.updateById(req.admin.id, {
    password: bcrypt.hashSync(newPassword, 10),
  });
  res.json({ success: true, message: "Password updated successfully" });
});

module.exports = router;
