const {
    getAlbums,
    getAlbumPhotos,
    getAlbum,
    findOrCreateAlbum,
    sellAlbumToUser
  } = require('../services/album'),
  { getUserAlbums } = require('../services/user'),
  logger = require('../logger'),
  { apiError, defaultError, duplicateAlbumError } = require('../errors');

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
  getUserAlbums(req.user.id)
    .then(albums => {
      console.log(albums[0].id, req.params.id);
      if (albums && albums.some(album => album.id === parseInt(req.params.id))) {
        return next(duplicateAlbumError('User already has this album'));
      }
      return getAlbum(req.params.id).then(album =>
        findOrCreateAlbum(album, next).then(([registeredAlbum]) =>
          sellAlbumToUser(registeredAlbum, req.user, next).then(() => res.status(200).send())
        )
      );
    })
    .catch(err => {
      logger.error(`Error buying album: ${err}`);
      return next(defaultError(err));
    });
