module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'secret', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'abc123'
    }),
  down: queryInterface => queryInterface.removeColumn('user', 'secret')
};
