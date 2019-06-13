const request = require('request-promise'),
  {
    common: {
      externalApi: { apiBaseUrl }
    }
  } = require('../../config'),
  { databaseError, apiError } = require('../errors'),
  { userAlbum: UserAlbum } = require('../models'),
  logger = require('../logger');

const buildDefaultApiConfig = path => ({
  uri: `${apiBaseUrl}/${path}`,
  json: true,
  headers: { 'content-type': 'application/json' }
});

exports.getAlbums = () => request(buildDefaultApiConfig('albums'));

exports.getAlbumPhotos = id => request(buildDefaultApiConfig(`albums/${id}/photos`));

exports.getAlbum = (id, next) =>
  request(buildDefaultApiConfig(`albums/${id}`)).catch(err => {
    if (err.statusCode === 404) {
      return null;
    }
    logger.error(err);
    return next(apiError(err));
  });

exports.sellAlbumToUser = (albumId, user, next) =>
  UserAlbum.create({ albumId, userId: user.id }).catch(err => next(databaseError(err)));
