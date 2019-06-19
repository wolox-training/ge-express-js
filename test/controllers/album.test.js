const app = require('../../app'),
  request = require('supertest'),
  rpMock = require('request-promise'),
  { user: User, userAlbum: UserAlbum } = require('../../app/models'),
  { loggedUser, authorizedUserToken, unauthorizedUserToken, sampleUser2 } = require('../mocks/user'),
  { sampleAlbum, notFoundResponse } = require('../mocks/album');
jest.mock('request-promise');

const createUsers = () =>
  Promise.all([
    User.create(loggedUser),
    User.create(sampleUser2),
    UserAlbum.create({ albumId: 1, userId: 2 })
  ]);

describe('album/:id POST (buy album)', () => {
  beforeEach(done => createUsers().then(() => done()));
  it('should sell an album to an user', done => {
    rpMock.mockResolvedValueOnce(sampleAlbum);
    return request(app)
      .post('/albums/1')
      .query({ token: authorizedUserToken })
      .expect(200)
      .end(err => {
        if (err) {
          done(err);
        }
        done();
      });
  });
  it('should not sell the same album to the same user', done => {
    rpMock.mockResolvedValueOnce(sampleAlbum).mockResolvedValueOnce(sampleAlbum);
    return request(app)
      .post('/albums/1')
      .query({ token: authorizedUserToken })
      .expect(200)
      .end(err => {
        if (err) {
          done(err);
        }
        return request(app)
          .post('/albums/1')
          .query({ token: authorizedUserToken })
          .expect(400)
          .end(err2 => {
            if (err2) {
              done(err2);
            }
            done();
          });
      });
  });
  it('should authenticate the user', done =>
    request(app)
      .post('/albums/1')
      .expect(401)
      .end(err => {
        if (err) {
          done(err);
        }
        done();
      }));
  it('should return an error if the album doesnt exist', done => {
    rpMock.mockRejectedValue(notFoundResponse);
    return request(app)
      .post('/albums/999')
      .query({ token: authorizedUserToken })
      .expect(404)
      .then(() => done());
  });
});

describe('users/:id/albums GET', () => {
  beforeEach(done => createUsers().then(() => done()));
  it('should authenticate user', done =>
    request(app)
      .get('/users/1/albums')
      .expect(401)
      .then(() => done()));
  it('should get an users albums', done => {
    rpMock.mockResolvedValueOnce(sampleAlbum);
    return request(app)
      .get('/users/2/albums')
      .query({ token: unauthorizedUserToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toEqual(sampleAlbum);
        done();
      });
  });
  it('should not let you get albums from another user when logged user is not an admin', done =>
    request(app)
      .get('/users/1/albums')
      .query({ token: unauthorizedUserToken })
      .expect(401)
      .end(err => {
        if (err) {
          done(err);
        }
        done();
      }));
  it('should let you get albums from another user when logged user is admin ', done => {
    rpMock.mockResolvedValueOnce(sampleAlbum);
    return request(app)
      .get('/users/2/albums')
      .query({ token: authorizedUserToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toEqual(sampleAlbum);
        done();
      });
  });
  it('should return an empty array when user has no albums', done =>
    request(app)
      .get('/users/1/albums')
      .query({ token: authorizedUserToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body).toEqual([]);
        done();
      }));
});
