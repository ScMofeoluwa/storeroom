module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Stores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
          len: {
            args: [5, 20],
            msg: "name must be between 5 and 20 characters",
          },
        },
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: "NGN",
        values: ["NGN", "GBP", "USD", "EUR"],
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Stores");
  },
};
