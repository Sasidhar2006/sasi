const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");

// ─────────────────────────────────────────────
// @route   GET /api/doctor/getDoctorInfo/:userId
// @access  Private
// ─────────────────────────────────────────────
const getDoctorInfo = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error("Get Doctor Info Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/doctor/updateProfile
// @access  Private (Doctor)
// ─────────────────────────────────────────────
const updateDoctorProfile = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      address,
      specialisation,
      experience,
      fees,
      timings,
    } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.userId },
      { fullname, phone, address, specialisation, experience, fees, timings },
      { new: true }
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully.", data: doctor });
  } catch (error) {
    console.error("Update Doctor Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/doctor/getDoctorAppointments
// @access  Private (Doctor)
// ─────────────────────────────────────────────
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   POST /api/doctor/updateAppointmentStatus
// @access  Private (Doctor)
// ─────────────────────────────────────────────
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    // Notify the patient about status change
    const patient = await User.findById(appointment.userId);
    if (patient) {
      const notification = {
        type: "appointment-status",
        message: `Your appointment with Dr. ${appointment.doctorInfo.fullname} has been ${status}.`,
        onClickPath: "/appointments",
      };
      patient.notifications.push(notification);
      await patient.save();
    }

    return res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully.`,
      data: appointment,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getDoctorInfo,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
};
