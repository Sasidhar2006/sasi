const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getUserInfo,
  applyDoctor,
  getAllApprovedDoctors,
  getNotifications,
  markAllNotificationsRead,
  deleteAllNotifications,
} = require("../controllers/userController");

// GET  /api/user/getUserInfo
router.get("/getUserInfo", authMiddleware, getUserInfo);

// POST /api/user/applyDoctor
router.post("/applyDoctor", authMiddleware, applyDoctor);

// GET  /api/user/getAllDoctors
router.get("/getAllDoctors", authMiddleware, getAllApprovedDoctors);

// GET  /api/user/getNotifications
router.get("/getNotifications", authMiddleware, getNotifications);

// POST /api/user/markAllRead
router.post("/markAllRead", authMiddleware, markAllNotificationsRead);

// DELETE /api/user/deleteAllNotifications
router.delete("/deleteAllNotifications", authMiddleware, deleteAllNotifications);

module.exports = router;
