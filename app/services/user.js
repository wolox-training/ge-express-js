const { user: User } = require('../models');

exports.createUser = ({ email, ...otherUserData }) =>
  User.findOrCreate({ where: { email }, default: otherUserData });
