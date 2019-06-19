const jwt = require('jsonwebtoken'),
  {
    common: {
      session: { secret }
    }
  } = require('../../config');

exports.loggedUser = {
  name: 'santiago',
  lastName: 'sacuna',
  email: 'sacuna@santiago.net',
  password: 'eggplant247',
  admin: true
};
exports.sampleUser = {
  name: 'nicolas',
  lastName: 'L',
  email: 'freecandy@msn.net',
  password: 'abc452626'
};
exports.sampleUser2 = {
  name: 'santiago',
  lastName: 'peta',
  email: 'no@toque.eso',
  password: 'peta2009',
  admin: false
};
exports.sameEmailUser = {
  name: 'F',
  lastName: 'Perez',
  email: 'freecandy@msn.net',
  password: 'abc351515'
};
exports.invalidPasswordUser = {
  name: 'M',
  lastName: 'M',
  email: 'mm@cgt.com',
  password: '123'
};
exports.mentallyChallengedUser = {
  email: 'yes'
};

exports.authorizedUserToken = jwt.sign(
  { ...exports.loggedUser, admin: true, userId: 1, secret: 'abc123', expires: Date.now() + 600000 },
  secret
);
exports.unauthorizedUserToken = jwt.sign(
  { ...exports.sampleUser, admin: false, userId: 2, secret: 'abc123', expires: Date.now() + 600000 },
  secret
);

exports.expiredUserToken = jwt.sign(
  { ...exports.sampleUser, admin: true, userId: 1, secret: 'abc123', expires: Date.now() - 600000 },
  secret
);
