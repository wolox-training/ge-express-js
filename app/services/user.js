const { user: User } = require('../models'),
  { databaseError } = require('../errors');

exports.createUser = ({ email, ...otherUserData }, next) =>
  User.findOrCreate({ where: { email }, defaults: otherUserData }).catch(err => next(databaseError(err)));

exports.getUserByEmail = (email, next) =>
  User.findOne({ where: { email } }).catch(err => next(databaseError(err)));
