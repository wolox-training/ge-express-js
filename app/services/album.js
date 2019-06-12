const request = require('request-promise'),
  {
    common: {
      externalApi: { apiBaseUrl }
    }
  } = require('../../config'),
  { databaseError } = require('../errors'),
  { album: Album, user: User } = require('../models');

const buildDefaultApiConfig = path => ({
  uri: `${apiBaseUrl}/${path}`,
  json: true,
  headers: { 'content-type': 'application/json' }
});

exports.getAlbums = () => request(buildDefaultApiConfig('albums'));

exports.getAlbumPhotos = id => request(buildDefaultApiConfig(`albums/${id}/photos`));

exports.getAlbum = id => request(buildDefaultApiConfig(`albums/${id}`));

exports.findOrCreateAlbum = (album, next) =>
  Album.findOrCreate({ where: { id: album.id }, defaults: album }).catch(err => next(databaseError(err)));

exports.sellAlbumToUser = (album, user, next) =>
  User.findOne({ where: { id: user.id } })
    .then(registeredUser => registeredUser.addAlbum(album))
    .catch(err => next(databaseError(err)));
