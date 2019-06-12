module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('album', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Album.associate = models => {
    models.album.belongsToMany(models.user, { through: 'userAlbum' });
  };
  return Album;
};
