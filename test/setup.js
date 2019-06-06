'use strict';

beforeEach(done => {
  const models = require('../app/models');

  const tables = Object.values(models.sequelize.models);

  const truncateTable = model =>
    model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });

  const truncateDatabase = () => Promise.all(tables.map(truncateTable));

  truncateDatabase().then(() => done());
});

// including all test files
// const normalizedPath = path.join(__dirname, '.');

// const requireAllTestFiles = pathToSearch => {
//   fs.readdirSync(pathToSearch).forEach(file => {
//     if (fs.lstatSync(`${pathToSearch}/${file}`).isDirectory()) {
//       requireAllTestFiles(`${pathToSearch}/${file}`);
//     } else {
//       require(`${pathToSearch}/${file}`);
//     }
//   });
// };

// requireAllTestFiles(normalizedPath);
