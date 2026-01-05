const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    login_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    employee_id: { type: String, default: null, unique: true },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    gender: { type: String, default: null },
    blood_group: { type: String, default: null },
    dob: { type: Date, default: null },
    role: {
      type: [String],
      default: [],
    },

    // Contact Info
    email: { type: String, default: null },
    mobile_no: { type: String, default: null },
    emg_mobile_no: { type: String, default: null },

    // Address Info
    address: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },

    // Bank Details
    bank_name: { type: String, default: null },
    account_number: { type: String, default: null },
    ifsc_code: { type: String, default: null },

    // Optional File Uploads
    profile_image: { type: String, default: null },
    id_proof: { type: String, default: null },
    degree_certificate: { type: String, default: null },
    experience_certificate: { type: String, default: null },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    trash: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("master_employees", employeeSchema);
