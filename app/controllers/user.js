const logger = require('../logger'),
  { createUser } = require('../services/user'),
  { validateUserData } = require('../utils/user'),
  { encrypt } = require('../utils/encrypt'),
  { emailExistsError, defaultError, invalidUserError } = require('../errors');

exports.signUp = (req, res, next) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return next(invalidUserError(validationErrors));
  }
  return encrypt(req.body.password)
    .then(encryptedPassword =>
      createUser({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: encryptedPassword
      })
    )
    .then(([user, created]) => {
      if (created) {
        return res.status(201).send(user);
      }
      return next(emailExistsError('Email already in use'));
    })
    .catch(err => {
      logger.error(`Error creating user: ${err}`);
      return next(defaultError(err));
    });
};
