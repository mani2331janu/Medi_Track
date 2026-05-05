import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EmployeeTemp = sequelize.define(
  "EmployeeTemp",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    emp_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    emp_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    nationality: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    user_role: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    id_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    id_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    joining_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    mobile_no: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    company: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    trash: {
      type: DataTypes.ENUM("YES", "NO"),
      defaultValue: "NO",
    },
  },
  {
    tableName: "master_employee",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default EmployeeTemp;
