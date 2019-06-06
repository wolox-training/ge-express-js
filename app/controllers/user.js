const logger = require('../logger'),
  { createUser } = require('../services/user'),
  { validateUserData } = require('../utils/user'),
  { encrypt } = require('../utils/encrypt');

exports.signUp = (req, res) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return res.status(400).send(validationErrors);
  }
  return encrypt(req.body.password)
    .then(encryptedPassword => createUser({ ...req.body, password: encryptedPassword }))
    .then(result => res.status(201).send(result))
    .catch(err => {
      logger.error(`Error creating user: ${err}`);
      res.status(500).send(err);
    });
};
