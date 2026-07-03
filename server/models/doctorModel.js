const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // Foreign key referencing Users collection
    userId: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    specialisation: {
      type: String,
      required: [true, "Specialisation is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    fees: {
      type: Number,
      required: [true, "Consultation fees are required"],
    },
    // Availability timings: e.g. ["09:00", "17:00"]
    timings: {
      type: Object,
      required: [true, "Timings are required"],
    },
    // status: pending | approved | rejected
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
