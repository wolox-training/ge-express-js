const { user: User } = require('../models'),
  { databaseError } = require('../errors'),
  { DEFAULT_PAGE_LIMIT } = require('../constants');

exports.createUser = ({ email, ...otherUserData }) =>
  User.findOrCreate({ where: { email }, defaults: otherUserData });

exports.getUserByEmail = email => User.findOne({ where: { email } });

exports.getUsers = ({ page }, next) =>
  User.findAll({ limit: DEFAULT_PAGE_LIMIT, offset: page ? (page - 1) * DEFAULT_PAGE_LIMIT : 0 }).catch(err =>
    next(databaseError(err))
  );
exports.getUserByEmail = email => User.findOne({ where: { email } });
