const { healthCheck } = require('./controllers/healthCheck'),
  albumController = require('./controllers/album'),
  userController = require('./controllers/user'),
  { validateUserSignUpData, authenticate, authenticateAdmin } = require('./middlewares/user');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAlbums);
  app.get('/albums/:id/photos', albumController.getAlbumPhotos);
  app.post('/users', [validateUserSignUpData], userController.signUp);
  app.post('/users/session', userController.signIn);
  app.get('/users', [authenticate], userController.getUsers);
  app.post('/admin/users', [authenticate, authenticateAdmin], userController.createAdminUser);
  app.post('/users/session', userController.signIn);
};
