const logger = require('../logger'),
  {
    createUser,
    getUserByEmail,
    getUsers,
    createOrUpdateToAdminUser,
    getUserAlbums
  } = require('../services/user'),
  { encrypt, compareEncryptedData } = require('../utils/encrypt'),
  { emailExistsError, emailNotFoundError, authenticationError } = require('../errors'),
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
      return compareEncryptedData(req.body.password, user.password).then(isValid => {
        if (isValid) {
          const token = getUserSessionToken({ userId: user.id, admin: user.admin });
          return res.send(token);
        }
        return next(authenticationError('Unauthorized'));
      });
    })
    .catch(err => {
      logger.error(err);
      return next(err);
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
