module.exports = (sequelize, DataTypes) => {
  const UserAlbum = sequelize.define('userAlbum', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  UserAlbum.associate = models => {
    models.userAlbum.belongsTo(models.user, { foreignKey: 'userId' });
  };
  return UserAlbum;
};
