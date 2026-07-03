const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");

// ─────────────────────────────────────────────
// @route   GET /api/user/getUserInfo
// @access  Private (Patient)
// ─────────────────────────────────────────────
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get User Info Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/user/applyDoctor
// @access  Private (Patient)
// ─────────────────────────────────────────────
const applyDoctor = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      address,
      specialisation,
      experience,
      fees,
      timings,
    } = req.body;

    // Check if doctor application already exists for this user
    const existingDoctor = await Doctor.findOne({ userId: req.userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor application already submitted.",
      });
    }

    const newDoctor = new Doctor({
      userId: req.userId,
      fullname,
      email,
      phone,
      address,
      specialisation,
      experience,
      fees,
      timings,
      status: "pending",
    });

    await newDoctor.save();

    // Notify admin about new doctor application
    const adminUser = await User.findOne({ isAdmin: true });
    if (adminUser) {
      const notification = {
        type: "apply-doctor-request",
        message: `${fullname} has applied for a Doctor account.`,
        onClickPath: "/admin/doctors",
      };
      adminUser.notifications.push(notification);
      await adminUser.save();
    }

    return res.status(201).json({
      success: true,
      message: "Doctor application submitted. Await admin approval.",
    });
  } catch (error) {
    console.error("Apply Doctor Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/user/getAllDoctors
// @access  Private (Patient)
// ─────────────────────────────────────────────
const getAllApprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/user/getNotifications
// @access  Private
// ─────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({
      success: true,
      data: {
        notifications: user.notifications,
        seenNotifications: user.seenNotifications,
      },
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/user/markAllRead
// @access  Private
// ─────────────────────────────────────────────
const markAllNotificationsRead = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Move all unread notifications to seen
    user.seenNotifications.push(...user.notifications);
    user.notifications = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      data: user,
    });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   DELETE /api/user/deleteAllNotifications
// @access  Private
// ─────────────────────────────────────────────
const deleteAllNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    user.notifications = [];
    user.seenNotifications = [];
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "All notifications deleted.", data: user });
  } catch (error) {
    console.error("Delete Notifications Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getUserInfo,
  applyDoctor,
  getAllApprovedDoctors,
  getNotifications,
  markAllNotificationsRead,
  deleteAllNotifications,
};
