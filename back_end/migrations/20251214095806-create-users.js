"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      role: {
        type: Sequelize.JSON, // ex: ["ADMIN", "EMPLOYEE"]
        allowNull: true,
      },

      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: "1=Active, 0=Inactive",
      },

      trash: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "No",
        comment: "Yes = Soft Deleted",
      },

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
    await queryInterface.dropTable("users");
  },
};
  