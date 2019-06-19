const jwt = require('jsonwebtoken'),
  { secret } = require('../../config').common.session;

exports.getUserSessionToken = user => jwt.sign(user, secret);
