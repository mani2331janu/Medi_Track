import User from "../../models/users.js";
import EmployeeTemp from "../../models/master_employee.js";
import bcrypt from "bcryptjs";
export const signUp = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const exstingUser = User.findOne({
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
