module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'config',
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { freezeTableName: true }
  );
