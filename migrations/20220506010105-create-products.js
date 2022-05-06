module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          len: {
            args: [3, 20],
            msg: "name must be between 3 and 20 characters",
          },
        },
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "minimum price must be 0",
          },
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "minimum price must be 0",
          },
        },
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "store ID cannot be empty",
          },
        },
        references: {
          model: "Stores",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
