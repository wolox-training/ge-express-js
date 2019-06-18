const { healthCheck } = require('./controllers/healthCheck'),
  albumController = require('./controllers/album'),
  userController = require('./controllers/user'),
  configController = require('./controllers/config'),
  { validateUserSignUpData, authenticate, authenticateAdmin } = require('./middlewares/user');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albumController.getAlbums);
  app.get('/albums/:id/photos', [authenticate], albumController.getAlbumPhotos);
  app.post('/users', [validateUserSignUpData], userController.signUp);
  app.post('/users/session', userController.signIn);
  app.get('/users', [authenticate, authenticateAdmin], userController.getUsers);
  app.post('/admin/users', [authenticate, authenticateAdmin], userController.createAdminUser);
  app.post('/albums/:id', [authenticate], albumController.buyAlbum);
  app.get('/users/:id/albums', [authenticate], userController.getUserAlbums);
  app.get('/users/albums/:id/photos', [authenticate], userController.getUserAlbumPhotos);
  app.post('/users/sessions/invalidate_all', [authenticate], userController.invalidateSession);
  app.post(
    '/admin/set_session_expire_time',
    [authenticate, authenticateAdmin],
    configController.setExpireTime
  );
};
