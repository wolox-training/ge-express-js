const logger = require('../logger'),
  { createUser, getUserByEmail, getUsers } = require('../services/user'),
  { encrypt, compareEncryptedData } = require('../utils/encrypt'),
  {
    defaultError,
    emailExistsError,
    emailNotFoundError,
    databaseError,
    authenticationError
  } = require('../errors'),
  { getUserSessionToken } = require('../services/token');

exports.signUp = (req, res, next) =>
  encrypt(req.body.password)
    .then(encryptedPassword =>
      createUser({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: encryptedPassword
      }).catch(err => next(databaseError(err)))
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

exports.signIn = (req, res, next) =>
  getUserByEmail(req.body.email)
    .catch(err => next(databaseError(err)))
    .then(user => {
      if (!user) {
        return next(emailNotFoundError('Email not found'));
      }
      return compareEncryptedData(req.body.password, user.password).then(isValid => {
        if (isValid) {
          const token = getUserSessionToken({ userId: user.id, admin: true });
          return res.send(token);
        }
        return next(authenticationError('Unauthorized'));
      });
    })
    .catch(err => {
      logger.error(`Error signin in: ${err}`);
      return next(defaultError(err));
    });

exports.getUsers = (req, res, next) =>
  getUsers({ page: req.body.page }, next)
    .then(users => res.status(200).send(users))
    .catch(err => {
      logger.error(`Error getting users: ${err}`);
      return next(defaultError(err));
    });
