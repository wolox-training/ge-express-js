const { healthCheck } = require('./controllers/healthCheck'),
  albumController = require('./controllers/album');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', [], albumController.getAlbums);
  app.get('/albums/:id/photos', [], albumController.getAlbumPhotos);
};
