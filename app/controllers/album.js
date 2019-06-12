const { getAlbums, getAlbumPhotos } = require('../services/album'),
  logger = require('../logger'),
  { apiError } = require('../errors');

exports.getAlbums = (req, res) =>
  getAlbums()
    .then(response => res.status(200).send(response))
    .catch(err => {
      logger.error(`Error getting albums: ${err.message}`);
      return res.status(err.statusCode).send(apiError(err.message));
    });

exports.getAlbumPhotos = (req, res) =>
  getAlbumPhotos(req.params.id)
    .then(response => res.status(200).send(response))
    .catch(err => {
      logger.error(`Error getting album photos: ${err}`);
      return res.status(err.statusCode).send(apiError(err.message));
    });
