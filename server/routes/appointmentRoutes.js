const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

// ── Multer setup for document uploads ──────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images and documents (PDF, DOC) are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
// ──────────────────────────────────────────────────────────

// POST /api/appointment/bookAppointment
router.post(
  "/bookAppointment",
  authMiddleware,
  upload.single("document"),
  bookAppointment
);

// GET  /api/appointment/getUserAppointments
router.get("/getUserAppointments", authMiddleware, getUserAppointments);

// DELETE /api/appointment/cancelAppointment/:id
router.delete("/cancelAppointment/:id", authMiddleware, cancelAppointment);

module.exports = router;
