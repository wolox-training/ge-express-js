const { getAlbums, getAlbumPhotos, getAlbum, sellAlbumToUser } = require('../services/album'),
  { getUserAlbums } = require('../services/user'),
  logger = require('../logger'),
  { duplicateAlbumError, notFoundError } = require('../errors');

exports.getAlbums = (req, res, next) =>
  getAlbums()
    .then(response => res.send(response))
    .catch(err => {
      logger.error(`Error getting albums: ${err.message}`);
      return next(err);
    });

exports.getAlbumPhotos = (req, res, next) =>
  getAlbumPhotos(req.params.id)
    .then(response => res.send(response))
    .catch(err => {
      logger.error(`Error getting album photos: ${err}`);
      return next(err);
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
        return sellAlbumToUser(req.params.id, req.user).then(() => res.send());
      });
    })
    .catch(err => {
      logger.error(`Error buying album: ${err}`);
      return next(err);
    });
