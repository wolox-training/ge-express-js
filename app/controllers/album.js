const { getAlbums, getAlbumPhotos } = require('../services/album'),
  logger = require('../logger');

exports.getAlbums = (req, res) =>
  getAlbums()
    .then(response => res.status(response.statusCode).send(response.body))
    .catch(err => {
      logger.error(`Error getting albums: ${err}`);
      return res.status(500).send(err);
    });

exports.getAlbumPhotos = (req, res) =>
  getAlbumPhotos(req.params.id)
    .then(response => res.status(response.statusCode).send(response.body))
    .catch(err => {
      logger.error(`Error getting album photos: ${err}`);
      return res.status(500).send(err);
    });
