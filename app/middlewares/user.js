const { validateUserData } = require('../utils/user'),
  jwt = require('jsonwebtoken'),
  {
    common: {
      session: { secret }
    }
  } = require('../../config'),
  { authenticationError } = require('../errors');

exports.validateUserSignUpData = (req, res, next) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return res.status(400).send(validationErrors);
  }
  return next();
};

exports.authenticate = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, secret, (err, payload) => {
    if (payload && payload.admin) {
      next();
    } else {
      next(authenticationError('Unauthorized'));
    }
  });
};
