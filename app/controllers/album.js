const { getAlbums, getAlbumPhotos } = require('../services/album'),
  logger = require('../logger');

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
