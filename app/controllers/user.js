const logger = require('../logger'),
  {
    createUser,
    getUserByEmail,
    getUsers,
    createOrUpdateToAdminUser,
    getUserAlbums,
    generateNewUserSecret
  } = require('../services/user'),
  { encrypt, compareEncryptedData } = require('../utils/encrypt'),
  { defaultError, emailExistsError, authenticationError } = require('../errors'),
  {
    common: {
      session: { secret }
    }
  } = require('../../config'),
  jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) =>
  encrypt(req.body.password)
    .then(encryptedPassword => createUser({ ...req.body, password: encryptedPassword }, next))
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
        return res.status(400).send(['Email not found']);
      }
      return compareEncryptedData(req.body.password, user.password).then(isValid => {
        if (isValid) {
          const token = jwt.sign({ userId: user.id, admin: user.admin, secret: user.secret }, secret);
          return res.status(200).send(token);
        }
        return res.status(401).send('Unauthorized');
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

exports.createAdminUser = (req, res, next) =>
  encrypt(req.body.password).then(encryptedPassword =>
    createOrUpdateToAdminUser(
      {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: encryptedPassword
      },
      next
    )
      .then(() => res.status(200).send())
      .catch(err => {
        logger.error(`Error creating admin user: ${err}`);
        next();
      })
  );

exports.getUserAlbums = (req, res, next) => {
  if (req.user.id !== parseInt(req.params.id) && !req.user.admin) {
    return next(authenticationError('Unauthorized'));
  }
  return getUserAlbums(req.params.id)
    .then(albums => res.send(albums))
    .catch(next);
};

exports.invalidateSession = (req, res, next) =>
  generateNewUserSecret(req.user.id)
    .then(() => res.send())
    .catch(err => {
      logger.error(`Error invalidating session: ${err}`);
      return next(err);
    });
