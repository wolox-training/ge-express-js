const logger = require('../logger'),
  {
    createUser,
    getUserByEmail,
    getUsers,
    createOrUpdateToAdminUser,
    getUserAlbums,
    generateNewUserSecret
  } = require('../services/user'),
  { getConfigValue } = require('../services/config'),
  { encrypt, compareEncryptedData } = require('../utils/encrypt'),
  { emailExistsError, authenticationError, emailNotFoundError } = require('../errors'),
  { SESSION_EXPIRE_TIME_KEY } = require('../constants'),
  { getUserSessionToken } = require('../services/token');

exports.signUp = (req, res, next) =>
  encrypt(req.body.password)
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
      logger.error(err);
      return next(err);
    });

exports.signIn = (req, res, next) =>
  getUserByEmail(req.body.email)
    .then(user => {
      if (!user) {
        return next(emailNotFoundError('Email not found'));
      }
      return compareEncryptedData(req.body.password, user.password).then(isValid =>
        getConfigValue(SESSION_EXPIRE_TIME_KEY).then(expireTime => {
          if (isValid) {
            const token = getUserSessionToken({
              userId: user.id,
              admin: user.admin,
              secret: user.secret,
              expires: Date.now() + parseInt(expireTime.value)
            });
            return res.send(token);
          }
          return next(authenticationError('Unauthorized'));
        })
      );
    })
    .catch(err => {
      logger.error(err);
      return err;
    });

exports.getUsers = (req, res, next) =>
  getUsers({ page: req.query.page })
    .then(users => res.send(users))
    .catch(err => {
      logger.error(err);
      return next(err);
    });

exports.createAdminUser = (req, res, next) =>
  encrypt(req.body.password).then(encryptedPassword =>
    createOrUpdateToAdminUser({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptedPassword
    })
      .then(() => res.send())
      .catch(err => {
        logger.error(`Error creating admin user: ${err}`);
        next(err);
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
