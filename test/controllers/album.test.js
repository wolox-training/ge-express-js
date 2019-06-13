const app = require('../../app'),
  request = require('supertest'),
  rpMock = require('request-promise'),
  { user: User } = require('../../app/models'),
  { loggedUser, authorizedUserToken } = require('../mocks/user'),
  { sampleAlbum, notFoundResponse } = require('../mocks/album');
jest.mock('request-promise');

const createUsers = () => User.create(loggedUser);

describe('album/:id POST (buy album)', () => {
  beforeEach(done => createUsers().then(() => done()));
  rpMock.mockResolvedValueOnce(sampleAlbum);
  it('should sell an album to an user', done =>
    request(app)
      .post('/albums/1')
      .query({ token: authorizedUserToken })
      .expect(200)
      .end(err => {
        if (err) {
          done(err);
        }
        done();
      }));
  rpMock.mockResolvedValueOnce(sampleAlbum);
  it('should not sell the same album to the same user', done =>
    request(app)
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
      }));
  rpMock.mockResolvedValueOnce(sampleAlbum);
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
  rpMock.mockRejectedValue(notFoundResponse);
  it('should return an error if the album doesnt exist', done =>
    request(app)
      .post('/albums/999')
      .query({ token: authorizedUserToken })
      .expect(404)
      .end(err => {
        if (err) {
          done(err);
        }
        done();
      }));
});
