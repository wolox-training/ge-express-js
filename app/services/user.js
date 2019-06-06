const { user: User } = require('../models');

exports.createUser = userData =>
  User.create(userData).catch(err => {
    throw err.errors.reduce((acc, error) => {
      acc.push(error.message);
      return acc;
    }, []);
  });
