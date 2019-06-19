const { databaseError, apiError } = require('../errors'),
  { userAlbum: UserAlbum } = require('../models'),
  logger = require('../logger'),
  request = require('../utils/request');

exports.getAlbums = () => request('albums');

exports.getAlbumPhotos = id => request(`albums/${id}/photos`);

exports.getAlbum = id =>
  request(`albums/${id}`).catch(err => {
    if (err.statusCode === 404) {
      return null;
    }
    logger.error(err);
    return apiError(err);
  });

exports.sellAlbumToUser = (albumId, user) =>
  UserAlbum.create({ albumId, userId: user.id }).catch(err => databaseError(err));

exports.getAlbums = () => request('albums').catch(err => apiError(err));

exports.getAlbumPhotos = id => request(`albums/${id}/photos`).catch(err => apiError(err));
