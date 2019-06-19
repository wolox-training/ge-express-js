const { validateUserData } = require('../validations/user'),
  { authenticationError, invalidUserError } = require('../errors'),
  jwt = require('jsonwebtoken'),
  { secret } = require('../../config').common.session;

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
      req.user = payload;
      next();
    } else {
      next(authenticationError('Unauthorized'));
    }
  });
};

exports.authenticateAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  return next(authenticationError('Unauthorized'));
};
