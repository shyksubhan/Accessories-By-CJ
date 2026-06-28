const jwt = require("jsonwebtoken");

// ─── Bug 1 Fix: Never fall back to a hardcoded secret.
// If JWT_SECRET is not set in the environment, crash early so the issue is
// impossible to miss in development and impossible to silently bypass in prod.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "FATAL: JWT_SECRET environment variable is not set. " +
    "Create a .env file in the backend folder and add:\n" +
    "  JWT_SECRET=<some long random string>\n" +
    "You can generate one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
  );
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}

module.exports = { requireAdmin, JWT_SECRET };
