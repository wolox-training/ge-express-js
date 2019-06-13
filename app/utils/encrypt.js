const { DEFAULT_SALT_ROUNDS } = require('../constants');
const bcrypt = require('bcryptjs'),
  {
    common: {
      api: { saltRounds = DEFAULT_SALT_ROUNDS }
    }
  } = require('../../config');

exports.encrypt = text =>
  new Promise((resolve, reject) =>
    bcrypt.hash(text, saltRounds, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    })
  );
