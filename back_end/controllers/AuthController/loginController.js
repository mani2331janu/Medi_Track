import User from "../../models/users.js";
import EmployeeTemp from "../../models/master_employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signUp = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const exstingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (exstingUser) {
      return res.status(400).json({
        message: "Email Alredy Exists",
      });
    }

    const user = await User.create({
      name: `${req.body.first_name} ${req.body.last_name}`,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword,
      created_by: req.body.auth ?? 1,
    });

    const user_id = user.id;

    const employee = await EmployeeTemp.create({
      emp_name: `${req.body.first_name} ${req.body.last_name}`,
      email: req.body.email,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: user_id,
    });

    return res.status(200).json({
      message: "Data Saved",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SignUp Failed" });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Login Failed"
    });
  }
};
