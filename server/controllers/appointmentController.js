const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const moment = require("moment");

// ─────────────────────────────────────────────
// @route   POST /api/appointment/bookAppointment
// @access  Private (Patient)
// ─────────────────────────────────────────────
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, doctorInfo, userInfo } = req.body;

    // Check if slot already taken
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ["pending", "approved"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another.",
      });
    }

    // Resolve document path if file uploaded
    const documentPath = req.file ? req.file.path : "";

    const newAppointment = new Appointment({
      userId: req.userId,
      doctorId,
      date: moment(date, "DD-MM-YYYY").format("DD-MM-YYYY"),
      time,
      doctorInfo,
      userInfo,
      document: documentPath,
      status: "pending",
    });

    await newAppointment.save();

    // Notify the doctor about new appointment
    const doctorUser = await User.findById(doctorInfo.userId);
    if (doctorUser) {
      const notification = {
        type: "new-appointment",
        message: `New appointment request from ${userInfo.name} on ${date} at ${time}.`,
        onClickPath: "/doctor/appointments",
      };
      doctorUser.notifications.push(notification);
      await doctorUser.save();
    }

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully! Awaiting doctor confirmation.",
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   GET /api/appointment/getUserAppointments
// @access  Private (Patient)
// ─────────────────────────────────────────────
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Get User Appointments Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// @route   DELETE /api/appointment/cancelAppointment/:id
// @access  Private (Patient)
// ─────────────────────────────────────────────
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    // Only allow the owning patient to cancel
    if (appointment.userId !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action." });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully." });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { bookAppointment, getUserAppointments, cancelAppointment };
