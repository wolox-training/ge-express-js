module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'secret', {
      type: Sequelize.STRING,
      defaultValue: 'abc123'
    }),
  down: queryInterface => queryInterface.removeColumn('user', 'secret')
};
