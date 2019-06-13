const {
  MISSING_NAME,
  MISSING_LAST_NAME,
  PASSWORD_TOO_SHORT,
  PASSWORD_FORMAT_INVALID,
  MISSING_PASSWORD,
  MISSING_EMAIL,
  EMAIL_FORMAT_INVALID
} = require('../errors');

exports.validateUserData = data => {
  const errors = [];
  if (!data.name) {
    errors.push(MISSING_NAME);
  }
  if (!data.lastName) {
    errors.push(MISSING_LAST_NAME);
  }
  if (data.password) {
    if (data.password.length < 8) {
      errors.push(PASSWORD_TOO_SHORT);
    }
    if (!data.password.match(/^[a-zA-Z0-9_]*$/)) {
      errors.push(PASSWORD_FORMAT_INVALID);
    }
  } else {
    errors.push(MISSING_PASSWORD);
  }
  if (!data.email) {
    errors.push(MISSING_EMAIL);
  } else if (!data.email.match(/\S+@\S+\.\S+/)) {
    errors.push(EMAIL_FORMAT_INVALID);
  }
  return errors;
};
