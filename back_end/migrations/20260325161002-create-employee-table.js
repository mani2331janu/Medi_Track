export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("master_employee", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    emp_id: { type: Sequelize.STRING(50), allowNull: true },
    emp_name: { type: Sequelize.STRING(100), allowNull: true },
    gender: { type: Sequelize.STRING(10), allowNull: true },
    nationality: { type: Sequelize.STRING(50), allowNull: true },
    user_role: { type: Sequelize.STRING(100), allowNull: true },
    id_type: { type: Sequelize.STRING(100), allowNull: true },
    id_number: { type: Sequelize.STRING(100), allowNull: true },
    joining_date: { type: Sequelize.DATE, allowNull: true },
    mobile_no: { type: Sequelize.STRING(15), allowNull: true },
    company: { type: Sequelize.STRING(50), allowNull: true },
    email: { type: Sequelize.STRING(50), allowNull: true },
    status: { type: Sequelize.STRING(10), allowNull: true },

    created_at: { type: Sequelize.DATE, allowNull: true },
    updated_at: { type: Sequelize.DATE, allowNull: true },

    trash: {
      type: Sequelize.ENUM("YES", "NO"),
      defaultValue: "NO",
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("master_employee");
}