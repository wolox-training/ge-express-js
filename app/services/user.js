const { user: User } = require('../models'),
  { databaseError } = require('../errors'),
  { DEFAULT_PAGE_LIMIT } = require('../constants'),
  { userAlbum: UserAlbum } = require('../models'),
  request = require('../utils/request'),
  { generateHash } = require('random-hash'),
  logger = require('../logger');

exports.createUser = ({ email, ...otherUserData }) =>
  User.findOrCreate({ where: { email }, defaults: { ...otherUserData, secret: generateHash() } }).catch(
    err => {
      logger.error(err);
      return databaseError(err);
    }
  );

exports.getUserByEmail = email =>
  User.findOne({ where: { email } }).catch(err => {
    logger.error(err);
    return databaseError(err);
  });

exports.getUsers = ({ page }) =>
  User.findAll({
    limit: DEFAULT_PAGE_LIMIT,
    offset: page ? (parseInt(page) - 1) * DEFAULT_PAGE_LIMIT : 0
  }).catch(err => {
    logger.error(err);
    return databaseError(err);
  });

exports.createOrUpdateToAdminUser = ({ email, ...otherUserData }) =>
  User.findOrCreate({ where: { email }, defaults: { ...otherUserData, admin: true } })
    .then(([user, created]) => {
      if (!created && !user.admin) {
        return user.update({ admin: true });
      }
      return user;
    })
    .catch(err => {
      logger.error(err);
      return databaseError(err);
    });

exports.getUser = id => User.findOne({ where: { id } });

exports.getUserAlbumIds = id =>
  User.findOne({ where: { id }, include: [{ model: UserAlbum }] }).then(user => user.userAlbums);

exports.getUserAlbums = id =>
  exports
    .getUserAlbumIds(id)
    .then(ids => Promise.all(ids.map(albumId => request(`albums/${albumId.albumId}`))));

exports.generateNewUserSecret = id => User.update({ secret: generateHash() }, { where: { id } });
