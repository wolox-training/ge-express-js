const { databaseError, apiError } = require('../errors'),
  { userAlbum: UserAlbum } = require('../models'),
  logger = require('../logger'),
  request = require('../utils/request');

exports.getAlbums = () => request('albums');

exports.getAlbumPhotos = id => request(`albums/${id}/photos`);

exports.getAlbum = (id, next) =>
  request(`albums/${id}`).catch(err => {
    if (err.statusCode === 404) {
      return null;
    }
    logger.error(err);
    return next(apiError(err));
  });

exports.sellAlbumToUser = (albumId, user, next) =>
  UserAlbum.create({ albumId, userId: user.id }).catch(err => next(databaseError(err)));
