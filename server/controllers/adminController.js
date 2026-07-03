const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

// ─────────────────────────────────────────────
// @route   GET /api/admin/getAllUsers
// @access  Private (Admin)
// ─────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/admin/getAllDoctors
// @access  Private (Admin)
// ─────────────────────────────────────────────
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/admin/getAllAppointments
// @access  Private (Admin)
// ─────────────────────────────────────────────
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Get All Appointments Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   PUT /api/admin/changeDoctorStatus
// @access  Private (Admin)
// ─────────────────────────────────────────────
const changeDoctorStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    // Update doctor status (approved / rejected)
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    // Update isDoctor flag on the linked User account
    const user = await User.findById(doctor.userId);
    if (user) {
      user.isDoctor = status === "approved";
      const notification = {
        type: "doctor-status",
        message: `Your doctor application has been ${status} by the admin.`,
        onClickPath: "/",
      };
      user.notifications.push(notification);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: `Doctor status updated to '${status}'.`,
      data: doctor,
    });
  } catch (error) {
    console.error("Change Doctor Status Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/admin/createDoctor
// @access  Private (Admin)
// Admin directly creates a doctor account (User + Doctor profile)
// ─────────────────────────────────────────────
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      specialisation,
      experience,
      fees,
      timings,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !specialisation || !fees) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, specialisation, and fees are required.",
      });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 1: Create the User account with isDoctor = true
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      isDoctor: true,
      isAdmin: false,
    });
    await newUser.save();

    // Step 2: Create the Doctor profile linked to this user
    const newDoctor = new Doctor({
      userId: newUser._id.toString(),
      fullname: name,
      email,
      phone: phone || "",
      address: address || "",
      specialisation,
      experience: experience || "0",
      fees: Number(fees),
      timings: timings || ["09:00", "17:00"],
      status: "approved", // Admin-created doctors are auto-approved
    });
    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: `Doctor account created for ${name}. They can now login with email: ${email}`,
      data: { user: newUser._id, doctor: newDoctor._id },
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   DELETE /api/admin/deleteDoctor/:id
// @access  Private (Admin)
// Deletes both the Doctor profile and the linked User account
// ─────────────────────────────────────────────
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found." });
    }
    // Also remove the linked user account
    await User.findByIdAndDelete(doctor.userId);
    return res
      .status(200)
      .json({ success: true, message: "Doctor and linked user account deleted." });
  } catch (error) {
    console.error("Delete Doctor Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   DELETE /api/admin/deleteUser/:id
// @access  Private (Admin)
// ─────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  changeDoctorStatus,
  createDoctor,
  deleteDoctor,
  deleteUser,
};
