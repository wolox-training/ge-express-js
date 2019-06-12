const { user: User } = require('../models'),
  { databaseError } = require('../errors'),
  { DEFAULT_PAGE_LIMIT } = require('../constants'),
  { album: Album } = require('../models');

exports.createUser = ({ email, ...otherUserData }, next) =>
  User.findOrCreate({ where: { email }, defaults: otherUserData }).catch(err => next(databaseError(err)));

exports.getUserByEmail = (email, next) =>
  User.findOne({ where: { email } }).catch(err => next(databaseError(err)));

exports.getUsers = ({ page }, next) =>
  User.findAll({ limit: DEFAULT_PAGE_LIMIT, offset: page ? (page - 1) * DEFAULT_PAGE_LIMIT : 0 }).catch(err =>
    next(databaseError(err))
  );

exports.createOrUpdateToAdminUser = ({ email, ...otherUserData }, next) =>
  User.findOrCreate({ where: { email }, defaults: { ...otherUserData, admin: true } })
    .then(([user, created]) => {
      if (!created && !user.admin) {
        return user.update({ admin: true });
      }
      return user;
    })
    .catch(err => next(databaseError(err)));

exports.getUser = id => User.findOne({ where: { id } });

exports.getUserAlbums = id =>
  User.findOne({ where: { id }, include: [{ model: Album, where: { userId: id } }] }).then(
    user => user.albums
  );
