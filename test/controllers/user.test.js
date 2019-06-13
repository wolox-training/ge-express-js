const app = require('../../app'),
  request = require('supertest'),
  { user: User } = require('../../app/models'),
  { EMAIL_EXISTS_ERROR, INVALID_USER_ERROR } = require('../../app/errors'),
  {
    authorizedUserToken,
    unauthorizedUserToken,
    sampleUser,
    sameEmailUser,
    invalidPasswordUser,
    mentallyChallengedUser,
    loggedUser
  } = require('../mocks/user');

const createUsers = () => User.create(loggedUser);

describe('users POST', () => {
  beforeEach(done => createUsers().then(() => done()));
  it('should create an user', done =>
    request(app)
      .post('/users')
      .send(sampleUser)
      .expect(201)
      .end(err => {
        if (err) {
          return done(err);
        }
        return User.findOne({ where: { email: sampleUser.email } }).then(user => {
          if (!user) {
            return done('User not found');
          }
          expect(user.name).toEqual(sampleUser.name);
          expect(user.lastName).toEqual(sampleUser.lastName);
          expect(user.email).toEqual(sampleUser.email);
          return done();
        });
      }));
  it('should validate that emails are unique', done =>
    request(app)
      .post('/users')
      .send(sampleUser)
      .expect(201)
      .end(err => {
        if (err) {
          return done(err);
        }
        return request(app)
          .post('/users')
          .send(sameEmailUser)
          .expect(409)
          .end((err2, res2) => {
            if (err2) {
              return done(err2);
            }
            expect(res2.body.internal_code).toEqual(EMAIL_EXISTS_ERROR);
            return done();
          });
      }));
  it('should validate password requirements', done =>
    request(app)
      .post('/users')
      .send(invalidPasswordUser)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.internal_code).toEqual(INVALID_USER_ERROR);
        return done();
      }));
  it('should validate minimum fields required', done =>
    request(app)
      .post('/users')
      .send(mentallyChallengedUser)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.internal_code).toEqual(INVALID_USER_ERROR);
        expect(res.body.message.length).toBeGreaterThan(3);
        return done();
      }));
});

describe('admin users creation', () => {
  beforeEach(done => createUsers().then(() => done()));
  it('should create an admin user', done =>
    request(app)
      .post('/admin/users')
      .query({ token: authorizedUserToken })
      .send(sampleUser)
      .expect(200)
      .end(err => {
        if (err) {
          return done(err);
        }
        return User.find({ where: { email: sampleUser.email } }).then(user => {
          expect(user.admin).toBeTruthy();
          return done();
        });
      }));
  it('should update an existing nonadmin user', done =>
    User.create(sampleUser).then(() =>
      request(app)
        .post('/admin/users')
        .query({ token: authorizedUserToken })
        .send(sampleUser)
        .expect(200)
        .then(() =>
          User.find({ where: { email: sampleUser.email } }).then(user => {
            expect(user.admin).toBeTruthy();
            return done();
          })
        )
    ));
  it('should not allow nonauthorized users to create admin users', done =>
    request(app)
      .post('/admin/users')
      .query({ token: unauthorizedUserToken })
      .send(sampleUser)
      .expect(401)
      .end(err => {
        if (err) {
          return done(err);
        }
        return User.find({ where: { email: sampleUser.email } }).then(user => {
          expect(user).toBeNull();
          return done();
        });
      }));
});
