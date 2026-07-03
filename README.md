# 🏥 Book a Doctor — Full-Stack Healthcare Booking Platform

A complete healthcare booking application with **React** frontend and **Express.js + MongoDB** backend following the **MVC architectural pattern**.

---

## 📁 Project Structure

```
sasi/
├── client/          ← React 18 + Vite frontend
│   ├── .env         ← VITE_API_BASE_URL
│   └── src/
│       ├── api/axiosInstance.js   ← Reads API URL from .env
│       ├── components/
│       ├── pages/ (Home, Login, Register, user/, doctor/, admin/)
│       └── redux/ (store, userSlice, alertSlice)
└── server/          ← Express.js + MongoDB backend (MVC)
    ├── .env         ← MONGO_URI, JWT_SECRET, admin credentials
    ├── server.js    ← Entry point
    ├── config/      ← DB connection
    ├── models/      ← Mongoose schemas (Model layer)
    ├── controllers/ ← Business logic (Controller layer)
    ├── routes/      ← API endpoints (View/Routing layer)
    ├── middlewares/ ← JWT auth + admin guard
    └── uploads/     ← Uploaded medical documents
```

---

## ⚙️ Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookadoctor
JWT_SECRET=BookADoctor_SuperSecretKey_2024_!@#$%
ADMIN_EMAIL=admin@bookadoctor.com
ADMIN_PASSWORD=Admin@1234
JWT_EXPIRES_IN=7d
```

### client/.env
```
VITE_API_BASE_URL=http://backend-lk8k.onrender.com/api
```

---

## 🚀 Running the App

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend  
cd client && npm run dev
```

Then visit http://localhost:3000
