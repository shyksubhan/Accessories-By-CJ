const admin = require("firebase-admin");

// Initialize Firebase Admin SDK using environment variables
// No JSON file needed — all values come from Render environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Render stores \n as literal \\n — this replaces them back
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
