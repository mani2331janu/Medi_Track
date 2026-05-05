import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  role: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  user_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  employee_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  username: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  password_changed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  remember_token: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  otp_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  permission: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

  trash: {
    type: DataTypes.ENUM("NO", "YES"),
    defaultValue: "NO",
  },

}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default User;