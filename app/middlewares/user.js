const { validateUserData } = require('../utils/user'),
  jwt = require('jsonwebtoken'),
  {
    common: {
      session: { secret }
    }
  } = require('../../config'),
  { authenticationError, invalidUserError } = require('../errors'),
  { getUser } = require('../services/user');

exports.validateUserSignUpData = (req, res, next) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return next(invalidUserError(validationErrors));
  }
  return next();
};

exports.authenticate = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, secret, (err, payload) => {
    if (payload && payload.userId) {
      return getUser(payload.userId).then(user => {
        req.user = user.dataValues;
        return next();
      });
    }
    return next(authenticationError('Unauthorized'));
  });
};

exports.authenticateAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  return next(authenticationError('Unauthorized'));
};
