exports.validateUserData = data => {
  const errors = [];
  if (!data.name) {
    errors.push('Missing name');
  }
  if (!data.lastName) {
    errors.push('Missing last name');
  }
  if (data.password) {
    if (data.password.length < 8) {
      errors.push('Password too short');
    }
    if (!data.password.match(/^[a-zA-Z0-9_]*$/)) {
      errors.push('Password format invalid');
    }
  } else {
    errors.push('Missing password');
  }
  if (!data.email) {
    errors.push('Missing email');
  } else if (!data.email.match(/\S+@\S+\.\S+/)) {
    errors.push('Email format invalid');
  }
  return errors;
};
