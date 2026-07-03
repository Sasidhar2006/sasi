const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  changeDoctorStatus,
  createDoctor,
  deleteDoctor,
  deleteUser,
} = require("../controllers/adminController");

// All admin routes are protected by both auth + admin middleware

// GET  /api/admin/getAllUsers
router.get("/getAllUsers", authMiddleware, adminMiddleware, getAllUsers);

// GET  /api/admin/getAllDoctors
router.get("/getAllDoctors", authMiddleware, adminMiddleware, getAllDoctors);

// GET  /api/admin/getAllAppointments
router.get(
  "/getAllAppointments",
  authMiddleware,
  adminMiddleware,
  getAllAppointments
);

// PUT  /api/admin/changeDoctorStatus
router.put(
  "/changeDoctorStatus",
  authMiddleware,
  adminMiddleware,
  changeDoctorStatus
);

// POST /api/admin/createDoctor  ← Admin creates doctor with login credentials
router.post("/createDoctor", authMiddleware, adminMiddleware, createDoctor);

// DELETE /api/admin/deleteDoctor/:id  ← Removes doctor profile + linked user
router.delete("/deleteDoctor/:id", authMiddleware, adminMiddleware, deleteDoctor);

// DELETE /api/admin/deleteUser/:id
router.delete("/deleteUser/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
