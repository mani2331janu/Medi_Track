export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    created_by: Sequelize.INTEGER,
    updated_by: Sequelize.INTEGER,
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Users");
}