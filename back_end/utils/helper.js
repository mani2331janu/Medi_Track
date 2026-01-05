// utils/helper.js
const User = require("../models/Auth/User.js");
const Employee = require("../models/Administration/Employee.js")

const normalizePath = (p) => (p ? p.replace(/\\/g, "/") : p);

const getUserRoleId = async (role) => {
    try {
        const users = await User.find({ role: { $in: [role] } }).select("_id");
        return users.map((u) => u._id.toString());
    } catch (error) {
        console.error("❌ Error fetching users by role:", error);
        return [];
    }
};

const getUserLoginId = async (id) => {
    try {
        const data = await Employee.findById(id).select("login_id"); 
        return data ? data.login_id : null; 
    } catch (err) {
        console.error("Error fetching login_id:", err);
        return null;
    }
};

module.exports = {
    normalizePath,
    getUserRoleId,
    getUserLoginId
};
