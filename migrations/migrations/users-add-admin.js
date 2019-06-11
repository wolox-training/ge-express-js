module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }),
  down: queryInterface => queryInterface.removeColumn('user', 'admin')
};
