export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    first_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },

    last_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    role: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    user_type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "1 => employee, 2=> Contractor",
    },

    employee_id: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },

    username: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },

    email_verified_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    password_changed_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    remember_token: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },

    otp: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    otp_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    permission: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    created_by: {
      type: Sequelize.INTEGER,
      allowNull: false, // NOT NULL
    },

    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },

    trash: {
      type: Sequelize.ENUM("NO", "YES"),
      defaultValue: "NO",
    },

    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}