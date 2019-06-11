const { user: User } = require('../models'),
  { databaseError } = require('../errors'),
  { DEFAULT_PAGE_LIMIT } = require('../constants');

exports.createUser = ({ email, ...otherUserData }, next) =>
  User.findOrCreate({ where: { email }, defaults: otherUserData }).catch(err => next(databaseError(err)));

exports.getUserByEmail = (email, next) =>
  User.findOne({ where: { email } }).catch(err => next(databaseError(err)));

exports.getUsers = ({ page }, next) =>
  User.findAll({ limit: DEFAULT_PAGE_LIMIT, offset: page ? (page - 1) * DEFAULT_PAGE_LIMIT : 0 }).catch(err =>
    next(databaseError(err))
  );
