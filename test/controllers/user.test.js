const app = require('../../app'),
  request = require('supertest');

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

describe('users api', () => {
  it('should create an user', done =>
    request(app)
      .post('/users')
      .send(sampleUser)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.name).toEqual(sampleUser.name);
        expect(res.body.lastName).toEqual(sampleUser.lastName);
        expect(res.body.email).toEqual(sampleUser.email);
        return done();
      }));
  it('should validate that emails are unique', done =>
    request(app)
      .post('/users')
      .send(sampleUser)
      .set('Accept', 'application/json')
      .expect(201)
      .end(err => {
        if (err) {
          return done(err);
        }
        return request(app)
          .post('/users')
          .send(sameEmailUser)
          .set('Accept', 'application/json')
          .expect(409)
          .end((err2, res2) => {
            if (err2) {
              return done(err2);
            }
            expect(res2.body[0]).toBeDefined();
            return done();
          });
      }));
  it('should validate password requirements', done =>
    request(app)
      .post('/users')
      .send(invalidPasswordUser)
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body[0]).toBeDefined();
        return done();
      }));
  it('should validate minimum fields required', done =>
    request(app)
      .post('/users')
      .send(mentallyChallengedUser)
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body[0].length).toBeGreaterThan(3);
        return done();
      }));
});
