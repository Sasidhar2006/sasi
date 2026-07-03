const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const colors = require("colors");
const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

// ── Load environment variables from .env ────────────────────
dotenv.config();

// ── Connect to MongoDB and seed admin ─────────────────────
connectDB().then(() => {
  seedAdmin();
});

const app = express();

// ── Global Middlewares ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Serve uploaded documents statically ────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── API Routes (MVC View/Routing Layer) ────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/appointment", require("./routes/appointmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ── Health Check ───────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Book a Doctor API is running 🚀",
    version: "1.0.0",
  });
});

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).json({ success: false, message: err.message || "Server error." });
});

// ── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `\n  🏥 Book a Doctor Server running on PORT ${PORT} in ${process.env.NODE_ENV} mode`
      .yellow.bold
  );
});
