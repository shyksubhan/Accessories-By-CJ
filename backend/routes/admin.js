const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");
const { requireAdmin, JWT_SECRET } = require("../middleware/auth");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password are required" });
    const admin = await db.admins.findOne((a) => a.username === username);
    if (!admin || !bcrypt.compareSync(password, admin.password))
      return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ success: true, token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const orders = await db.orders.find();
    const allItems = await db.orderItems.find();

    const byStatus = (s) => orders.filter((o) => o.status === s).length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + (o.pricing?.grandTotal || 0), 0);

    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayOrders = orders.filter((o) => o.createdAt?.startsWith(dateStr) && o.status !== "cancelled");
      revenueByDay.push({ date: dateStr, orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + (o.pricing?.grandTotal || 0), 0) });
    }

    const productSales = {};
    allItems.forEach((item) => {
      const order = orders.find((o) => o.id === item.orderId);
      if (!order || order.status === "cancelled") return;
      if (!productSales[item.productName]) productSales[item.productName] = { totalSold: 0, totalRevenue: 0 };
      productSales[item.productName].totalSold += item.quantity;
      productSales[item.productName].totalRevenue += item.subtotal;
    });

    const topProducts = Object.entries(productSales)
      .map(([name, s]) => ({ product_name: name, ...s }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    const recentOrders = orders.slice(0, 5).map((o) => ({
      id: o.id, orderNumber: o.orderNumber, customerName: o.customer?.fullName,
      city: o.shipping?.city, grandTotal: o.pricing?.grandTotal, status: o.status, createdAt: o.createdAt,
    }));

    const messagesAll = await db.contact.find();
    const warrantyAll = await db.warranty.find();
    const productsAll = await db.products.find();

    res.json({
      orders: { total: orders.length, pending: byStatus("pending"), confirmed: byStatus("confirmed"), shipped: byStatus("shipped"), delivered: byStatus("delivered"), cancelled: byStatus("cancelled"), byStatus: ["pending","confirmed","shipped","delivered","cancelled"].map((s) => ({ status: s, count: byStatus(s) })) },
      revenue: { total: totalRevenue, byDay: revenueByDay },
      messages: { total: messagesAll.length, unread: messagesAll.filter((m) => !m.isRead).length },
      warranty: { total: warrantyAll.length, open: warrantyAll.filter((c) => c.status === "open").length },
      products: { total: productsAll.filter((p) => p.inStock).length, totalIncludingOutOfStock: productsAll.length },
      recentOrders,
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/change-password", requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "currentPassword and newPassword are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ error: "newPassword must be at least 6 characters" });
    const admin = await db.admins.findById(req.admin.id);
    if (!bcrypt.compareSync(currentPassword, admin.password))
      return res.status(401).json({ error: "Current password is incorrect" });
    await db.admins.updateById(req.admin.id, { password: bcrypt.hashSync(newPassword, 10) });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
