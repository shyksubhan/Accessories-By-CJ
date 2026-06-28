# Acc-by-CJ — Deploy Guide

## Tumhe 3 accounts chahiye:
1. GitHub (code upload)
2. Firebase (database)
3. Render (backend)
4. Vercel (frontend)

---

## STEP 1 — Firebase Setup
1. firebase.google.com pe jao → New Project banao
2. Firestore Database enable karo
3. Settings → Service Accounts → Generate new private key → JSON download karo
4. Us JSON se ye 3 values note karo:
   - project_id
   - client_email
   - private_key

---

## STEP 2 — GitHub pe Code Upload
1. github.com pe new repository banao
2. Ye commands chalaao:
```
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/TERA_USERNAME/TERI_REPO.git
git push -u origin main
```

---

## STEP 3 — Render pe Backend Deploy
1. render.com → New → Web Service
2. GitHub repo connect karo
3. Settings:
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: node server.js
4. Environment Variables daalo:
   - FIREBASE_PROJECT_ID = (apna)
   - FIREBASE_CLIENT_EMAIL = (apna)
   - FIREBASE_PRIVATE_KEY = (apna)
   - JWT_SECRET = koi bhi random string
5. Deploy karo → URL note karo (jaise: https://teri-site.onrender.com)

---

## STEP 4 — Vercel pe Frontend Deploy
1. vercel.com → New Project → GitHub repo select karo
2. Environment Variables mein daalo:
   - VITE_API_BASE = https://teri-render-url.onrender.com/api
3. Deploy karo → URL note karo

---

## STEP 5 — CORS Fix
Render → Environment → ALLOWED_ORIGINS = https://teri-vercel-url.vercel.app
Phir Manual Deploy karo

---

## Admin Panel
- URL: https://teri-vercel-url.vercel.app/admin
- Username: admin
- Password: jo tumne Firebase mein set kiya

