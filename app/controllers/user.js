const logger = require('../logger'),
  { createUser } = require('../services/user'),
  { encrypt } = require('../utils/encrypt');

exports.signUp = (req, res) =>
  encrypt(req.body.password)
    .then(encryptedPassword => createUser({ ...req.body, password: encryptedPassword }))
    .then(([user, created]) =>
      res.status(created ? 201 : 409).send(created ? user : ['Email already registered'])
    )
    .catch(err => {
      logger.error(`Error creating user: ${err}`);
      res.status(500).send(err);
    });
