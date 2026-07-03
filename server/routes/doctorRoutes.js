const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getDoctorInfo,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require("../controllers/doctorController");

// GET  /api/doctor/getDoctorInfo/:userId
router.get("/getDoctorInfo/:userId", authMiddleware, getDoctorInfo);

// POST /api/doctor/updateProfile
router.post("/updateProfile", authMiddleware, updateDoctorProfile);

// GET  /api/doctor/getDoctorAppointments
router.get("/getDoctorAppointments", authMiddleware, getDoctorAppointments);

// POST /api/doctor/updateAppointmentStatus
router.post("/updateAppointmentStatus", authMiddleware, updateAppointmentStatus);

module.exports = router;
