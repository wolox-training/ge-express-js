module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('config', {
      key: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('config')
};
