'use strict';

beforeEach(done => {
  const models = require('../app/models');
  const tables = Object.values(models.sequelize.models);
  const truncateTable = model =>
    model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });
  const truncateDatabase = () => Promise.all(tables.map(truncateTable));
  truncateDatabase().then(() => done());
});
