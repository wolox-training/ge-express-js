const { getAlbums, getAlbumPhotos, getAlbum, sellAlbumToUser } = require('../services/album'),
  { getUserAlbums } = require('../services/user'),
  logger = require('../logger'),
  { apiError, defaultError, duplicateAlbumError, notFoundError } = require('../errors');

exports.getAlbums = (req, res) =>
  getAlbums()
    .then(response => res.status(200).send(response))
    .catch(err => {
      logger.error(`Error getting albums: ${err.message}`);
      return apiError(err.message);
    });

exports.getAlbumPhotos = (req, res) =>
  getAlbumPhotos(req.params.id)
    .then(response => res.status(200).send(response))
    .catch(err => {
      logger.error(`Error getting album photos: ${err}`);
      return apiError(err.message);
    });

exports.buyAlbum = (req, res, next) =>
  getAlbum(req.params.id)
    .then(album => {
      if (!album) {
        return next(notFoundError('Album not found'));
      }
      return getUserAlbums(req.user.id, next).then(albums => {
        if (albums && albums.some(userAlbum => userAlbum.albumId === parseInt(req.params.id))) {
          return next(duplicateAlbumError('User already has this album'));
        }
        return sellAlbumToUser(req.params.id, req.user, next).then(() => res.status(200).send());
      });
    })
    .catch(err => {
      logger.error(`Error buying album: ${err}`);
      return next(defaultError(err));
    });
