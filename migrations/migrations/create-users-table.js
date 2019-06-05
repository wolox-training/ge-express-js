module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }),
  down: queryInterface => queryInterface.dropTable('Users')
};
