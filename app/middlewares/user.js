const { validateUserData } = require('../utils/user');

exports.validateUserSignUpData = (req, res, next) => {
  const validationErrors = validateUserData(req.body);
  if (validationErrors.length) {
    return res.status(400).send(validationErrors);
  }
  return next();
};
