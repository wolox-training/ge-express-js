const { healthCheck } = require('./controllers/healthCheck'),
  albumController = require('./controllers/album'),
  userController = require('./controllers/user');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', [], albumController.getAlbums);
  app.get('/albums/:id/photos', [], albumController.getAlbumPhotos);
  app.post('/users', [], userController.signUp);
};
