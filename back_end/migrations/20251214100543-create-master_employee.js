"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("master_employee", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // LOGIN USER (FK)
      login_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },

      // ORGANIZATION STRUCTURE
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      location_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      // EMPLOYEE INFO
      employee_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      blood_group: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      role: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      // CONTACT
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emg_mobile_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // ADDRESS
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // BANK
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // FILES
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_proof: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      degree_certificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      experience_certificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // AUDIT
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      // STATUS
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      trash: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "No",
      },

      // TIMESTAMPS
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("master_employee");
  },
};
