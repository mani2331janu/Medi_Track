const Employee = require("../../models/Administration/Employee");
const Counter = require("../../models/Counter/Counter");
const User = require("../../models/Auth/User");
const agenda = require("../../config/agenda");
const models = { Employee };
const fs = require("fs");
const {
  normalizePath,
  getUserRoleId,
  getUserLoginId,
} = require("../../utils/helper");
const path = require("path");
const mongoose = require("mongoose");
const { updateNextSequence } = require("../../utils/counterHelper");
const Notification = require("../../models/Administration/Notification");
const { NotificationType, ROLE } = require("../../config/constant");
// const { sendFcmNotificationToUsers } = require("../../utils/notifyUser");

const list = async (req, res) => {
  try {
    const data = await Employee.find({ trash: "No" })
      .populate({
        path: "created_by",
        select: "first_name",
      })
      .sort({ _id: -1 });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const Store = async (req, res) => {
  try {
    const io = req.app.get("io");
    const user_id = req.user?.id || null;
    const nextSeq = await updateNextSequence("employee");
    const employeeId = `EMP-${String(nextSeq).padStart(5, "0")}`;

    const roles = req.body.role ? JSON.parse(req.body.role) : [];

    const namePart = req.body.first_name
      ? req.body.first_name.substring(0, 4)
      : "User";
    const tempPassword = `User@${namePart}${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: tempPassword,
      role: roles,
    });

    const profile_image = req.files?.profile_image
      ? `/uploads/employee/${req.files.profile_image[0].filename}`
      : null;

    const id_proof = req.files?.id_proof
      ? `/uploads/employee/${req.files.id_proof[0].filename}`
      : null;

    const degree_certificate = req.files?.degree_certificate
      ? `/uploads/employee/${req.files.degree_certificate[0].filename}`
      : null;

    const experience_certificate = req.files?.experience_certificate
      ? `/uploads/employee/${req.files.experience_certificate[0].filename}`
      : null;

    const employee = await Employee.create({
      login_id: user._id,
      employee_id: employeeId,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      blood_group: req.body.blood_group,
      email: req.body.email,
      mobile_no: req.body.mobile_no,
      emg_mobile_no: req.body.emg_mobile_no,
      address: req.body.address,
      city: req.body.city,
      pincode: req.body.pincode,
      bank_name: req.body.bank_name,
      account_number: req.body.account_number,
      ifsc_code: req.body.ifsc_code,
      profile_image,
      id_proof,
      degree_certificate,
      experience_certificate,
      created_by: user_id,
      role: roles,
      dob: req.body.dob,
    });

    const superAdminIds = await getUserRoleId(ROLE.SUPER_ADMIN);

    const assignedUsers = new Set(superAdminIds);
    // assignedUsers.add(user_id);

    const notifications = [...assignedUsers].map((receiverId) => ({
      notification_type: NotificationType.EMPLOYEE_MANAGEMENT,
      message: `New Employee created: ${req.body.first_name} ${req.body.last_name}`,
      web_link: `administration/employee/view/${employee._id}`,
      assigned_user: receiverId,
      status: "unread",
      created_by: user_id,
    }));

    await Notification.insertMany(notifications);

    notifications.forEach((notif) => {
      io.emit("new-notification", notif);
    });

    // Send email
    await agenda.now("sendEmployeeEmail", {
      email: req.body.email,
      subject: "Your Employee Login Credentials",
      html: `<h3>Welcome</h3> ...`,
    });

    res.status(200).json({
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    console.error("❌ Error saving employee:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const Edit = async (req, res) => {
  try {
    const base_url = `${req.protocol}://${req.get("host")}`;

    const { id } = req.params;
    const data = await Employee.findById({ _id: id });

    if (data.profile_image) {
      data.profile_image = `${base_url}${data.profile_image}`;
    }

    if (data.id_proof) {
      data.id_proof = `${base_url}${data.id_proof}`;
    }
    if (data.degree_certificate) {
      data.degree_certificate = `${base_url}${data.degree_certificate}`;
    }
    if (data.experience_certificate) {
      data.experience_certificate = `${base_url}${data.experience_certificate}`;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error saving employee:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const Update = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id || null;
    const getLoginId = await getUserLoginId(id);

    // Parse normal fields
    const {
      first_name,
      last_name,
      email,
      mobile_no,
      gender,
      blood_group,
      address,
      bank_name,
      ifsc_code,
      account_number,
      city,
      pincode,
      emg_mobile_no,
      dob,
    } = req.body;

    // ✅ Parse Roles (from FormData JSON string)
    const role = req.body.role ? JSON.parse(req.body.role) : [];

    // Find employee
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Uploaded files
    const uploadedFiles = req.importedFiles || {};

    // Delete old files if replaced
    const deleteOldFile = (filePath) => {
      if (!filePath) return;
      const absolutePath = path.join(
        process.cwd(),
        filePath.replace(/^\//, "")
      );
      if (fs.existsSync(absolutePath)) {
        try {
          fs.unlinkSync(absolutePath);
        } catch (err) {
          console.warn("Failed to delete old file:", err);
        }
      }
    };

    if (uploadedFiles.profile_image) deleteOldFile(employee.profile_image);
    if (uploadedFiles.id_proof) deleteOldFile(employee.id_proof);
    if (uploadedFiles.degree_certificate)
      deleteOldFile(employee.degree_certificate);
    if (uploadedFiles.experience_certificate)
      deleteOldFile(employee.experience_certificate);

    // UPDATE EMPLOYEE RECORD
    const updatedData = await Employee.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        email,
        mobile_no,
        gender,
        blood_group,
        address,
        bank_name,
        ifsc_code,
        account_number,
        city,
        pincode,
        emg_mobile_no,
        dob,

        // ✅ Save MULTIPLE ROLES here
        role: role,

        profile_image: normalizePath(
          uploadedFiles.profile_image || employee.profile_image
        ),

        id_proof: normalizePath(uploadedFiles.id_proof || employee.id_proof),

        degree_certificate: normalizePath(
          uploadedFiles.degree_certificate || employee.degree_certificate
        ),

        experience_certificate: normalizePath(
          uploadedFiles.experience_certificate ||
            employee.experience_certificate
        ),

        updated_by: user_id,
        updatedAt: new Date(),
      },
      { new: true }
    );
    const userData = await User.findByIdAndUpdate(
      getLoginId,
      { role: role },
      { new: true }
    );

    return res.status(200).json({
      message: "Employee updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Employee update error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const View = async (req, res) => {
  try {
    const base_url = `${req.protocol}://${req.host}`;
    const { id } = req.params;

    const data = await Employee.findById({ _id: id })
      .populate({
        path: "created_by",
        name: "first_name",
      })
      .populate({
        path: "updated_by",
        name: "first_name",
      });

    if (data.profile_image) {
      data.profile_image = `${base_url}${data.profile_image}`;
    }

    if (data.id_proof) {
      data.id_proof = `${base_url}${data.id_proof}`;
    }
    if (data.degree_certificate) {
      data.degree_certificate = `${base_url}${data.degree_certificate}`;
    }
    if (data.experience_certificate) {
      data.experience_certificate = `${base_url}${data.experience_certificate}`;
    }

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getPreviewEmployeeId = async (req, res) => {
  try {
    const counter = await Counter.findById("employee");

    const seq = counter ? counter.seq + 1 : 1;
    const employeeId = `EMP-${String(seq).padStart(5, "0")}`;

    res.status(200).json({ employee_id: employeeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating preview ID" });
  }
};

const StatusChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await Employee.updateOne({ _id: id }, { $set: { status } });

    if (data.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Employee  Status Changed Successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Medical not found or status already set",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const employeeDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Employee.updateOne(
      { _id: id },
      { $set: { status: 0, trash: "Yes" } }
    );

    if (data) {
      return res
        .status(200)
        .json({ success: true, message: "Employee Data Delete Successfully" });
    } else {
      return res.status(404).json({
        success: false,
        message: "Employee not found or status already set",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const filterData = async (req, res) => {
  try {
    const { emp_id } = req.body;
    const data = await Employee.findById({ _id: emp_id }).populate({
      path: "created_by",
      name: "first_name",
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const checkEmailUnique = async (req, res) => {
  try {
    const { model, field, value, id } = req.body;

    if (!model || !field || !value) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const Model = models[model];
    if (!Model) {
      return res.status(400).json({ message: "Invalid model" });
    }

    let query = { [field]: value };

    if (id) {
      query._id = { $ne: id };
    }

    const exists = await Model.exists(query);
    res.json({ exists: !!exists });
  } catch (err) {
    console.error("Unique check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfileData = async (req, res) => {
  try {
    const base_url = `${req.protocol}://${req.host}`;

    const user_id = req.user.id;
    const data = await Employee.findOne({ login_id: user_id });
    if (data.profile_image) {
      data.profile_image = `${base_url}${data.profile_image}`;
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const user_id = req.user.id;
    const employee = await Employee.findOne({ login_id: user_id });
    const newImage = req.importedFiles?.profile_image;

    if (!newImage) {
      return res.status(400).json({ message: "No Image Upload" });
    }

    // Delete old image if exists
    if (employee?.profile_image) {
      const old_path = employee.profile_image.replace(/^\//, "");
      const old_file_path = path.join(process.cwd(), old_path);

      if (fs.existsSync(old_file_path)) {
        fs.unlinkSync(old_file_path);
      }
    }

    // Update new image in DB
    const updateData = {
      profile_image: newImage, // e.g. "/uploads/employee/xxxx.png"
      updated_at: new Date()
    };

    const result = await Employee.updateOne(
      { login_id: user_id },   // ← filter condition
      { $set: updateData }     // ← data to update
    );

    return res.status(200).json({
      message: "Profile image updated successfully",
      updated: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  list,
  Store,
  Edit,
  getPreviewEmployeeId,
  checkEmailUnique,
  Update,
  View,
  StatusChange,
  employeeDelete,
  filterData,
  getProfileData,
  updateProfileImage,
};
