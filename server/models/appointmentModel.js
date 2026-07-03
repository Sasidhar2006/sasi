const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Foreign key referencing Users collection (patient)
    userId: {
      type: String,
      required: true,
    },
    // Foreign key referencing Doctors collection
    doctorId: {
      type: String,
      required: true,
    },
    // Snapshot of doctor info at booking time
    doctorInfo: {
      type: Object,
      required: true,
    },
    // Snapshot of user info at booking time
    userInfo: {
      type: Object,
      required: true,
    },
    // Appointment date (e.g., "2024-12-25")
    date: {
      type: String,
      required: [true, "Appointment date is required"],
    },
    // Appointment time (e.g., "10:30")
    time: {
      type: String,
      required: [true, "Appointment time is required"],
    },
    // Uploaded document file path
    document: {
      type: String,
      default: "",
    },
    // status: pending | approved | rejected | completed
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected", "completed"],
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
