const logger = require('../logger'),
  { setConfigVariable } = require('../services/config'),
  { SESSION_EXPIRE_TIME_KEY } = require('../constants');

exports.setExpireTime = (req, res, next) =>
  setConfigVariable(SESSION_EXPIRE_TIME_KEY, req.body.time)
    .then(() => res.send())
    .catch(err => {
      logger.error(`Error setting expire time: ${err}`);
      return next(err);
    });
