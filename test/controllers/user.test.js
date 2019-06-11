const app = require('../../app'),
  request = require('supertest'),
  { user: User } = require('../../app/models'),
  { EMAIL_EXISTS_ERROR, INVALID_USER_ERROR } = require('../../app/errors');

const sampleUser = { name: 'nicolas', lastName: 'L', email: 'freecandy@msn.net', password: 'abc452626' };
const sameEmailUser = {
  name: 'F',
  lastName: 'Perez',
  email: 'freecandy@msn.net',
  password: 'abc351515'
};
const invalidPasswordUser = {
  name: 'M',
  lastName: 'M',
  email: 'mm@cgt.com',
  password: '123'
};
const mentallyChallengedUser = {
  email: 'yes'
};

describe('users POST', () => {
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
