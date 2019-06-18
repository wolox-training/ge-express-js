const { user: User } = require('../models');

exports.createUser = ({ email, ...otherUserData }) =>
  User.findOrCreate({ where: { email }, defaults: otherUserData });

exports.getUserByEmail = email => User.findOne({ where: { email } });
