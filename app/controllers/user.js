const logger = require('../logger'),
  { createUser } = require('../services/user'),
  { encrypt } = require('../utils/encrypt'),
  { emailExistsError, defaultError } = require('../errors');

exports.signUp = (req, res, next) =>
  encrypt(req.body.password)
    .then(encryptedPassword => createUser({ ...req.body, password: encryptedPassword }))
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
