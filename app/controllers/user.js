const logger = require('../logger'),
  { createUser, getUserByEmail } = require('../services/user'),
  { encrypt, compareEncryptedData } = require('../utils/encrypt'),
  { defaultError, emailExistsError, emailNotFoundError } = require('../errors'),
  { getUserSessionToken } = require('../services/token');

exports.signUp = (req, res, next) =>
  encrypt(req.body.password)
    .then(encryptedPassword =>
      createUser(
        {
          name: req.body.name,
          lastName: req.body.lastName,
          email: req.body.email,
          password: encryptedPassword
        },
        next
      )
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
  getUserByEmail(req.body.email, next)
    .then(user => {
      if (!user) {
        return next(emailNotFoundError('Email not found'));
      }
      return compareEncryptedData(req.body.password, user.password).then(isValid => {
        if (isValid) {
          const token = getUserSessionToken({ userId: user.id });
          return res.status(200).send(token);
        }
        return res.status(401).send('Unauthorized');
      });
    })
    .catch(err => {
      logger.error(`Error signin in: ${err}`);
      return defaultError(err);
    });
