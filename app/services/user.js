const { user: User } = require('../models'),
  { databaseError } = require('../errors'),
  { DEFAULT_PAGE_LIMIT } = require('../constants'),
  logger = require('../logger');

exports.createUser = ({ email, ...otherUserData }) =>
  User.findOrCreate({ where: { email }, defaults: otherUserData }).catch(err => {
    logger.error(err);
    return databaseError(err);
  });

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

exports.getUserByEmail = email =>
  User.findOne({ where: { email } }).catch(err => {
    logger.error(err);
    return databaseError(err);
  });
