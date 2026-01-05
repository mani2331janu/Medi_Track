import User from "../../models/Auth/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { updateNextSequence } from "../../utils/counterHelper.js";
import Employee from "../../models/Administration/Employee.js";

export const signup = async (req, res) => {
  try {
    console.log(1);
    

    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ first_name, last_name, email, password });

    const nextSeq = await updateNextSequence("employee");
    const employeeId = `EMP-${String(nextSeq).padStart(5, "0")}`;


    console.log(newUser, nextSeq, employeeId);

    const employee = await Employee.create({
      login_id: newUser._id,
      employee_id: employeeId,
      first_name: first_name || "User",
      last_name: last_name || "",
      email: email,
      mobile_no: req.body.mobile_no || "",
      emg_mobile_no: req.body.emg_mobile_no || "",
      address: req.body.address || "",
      city: req.body.city || "",
      pincode: req.body.pincode || "",
      bank_name: req.body.bank_name || "",
      account_number: req.body.account_number || "",
      ifsc_code: req.body.ifsc_code || "",
      created_by: newUser._id,
      status: 1,
    });


    res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.first_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login Successfully",
      token,
      user: { id: user._id, name: user.first_name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
