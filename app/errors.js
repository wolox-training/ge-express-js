const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.API_ERROR = 'api_error';
exports.apiError = message => internalError(message, exports.API_ERROR);

exports.AUTHENTICATION_ERROR = 'authentication_error';
exports.authenticationError = message => internalError(message, exports.AUTHENTICATION_ERROR);

exports.EMAIL_EXISTS_ERROR = 'email_exists_error';
exports.emailExistsError = message => internalError(message, exports.EMAIL_EXISTS_ERROR);

exports.INVALID_USER_ERROR = 'invalid_user_error';
exports.invalidUserError = message => internalError(message, exports.INVALID_USER_ERROR);

exports.MISSING_NAME = 'missing_name';
exports.MISSING_LAST_NAME = 'missing_last_name';
exports.PASSWORD_TOO_SHORT = 'password_too_short';
exports.PASSWORD_FORMAT_INVALID = 'password_format_invalid';
exports.MISSING_PASSWORD = 'missing_password';
exports.MISSING_EMAIL = 'missing_email';
exports.EMAIL_FORMAT_INVALID = 'email_format_invalid';

exports.DUPLICATE_ALBUM_ERROR = 'duplicate_album_error';
exports.duplicateAlbumError = message => internalError(message, exports.DUPLICATE_ALBUM_ERROR);
