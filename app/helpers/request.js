const request = require('request');

module.exports = (options, handleError) =>
  new Promise((resolve, reject) => {
    request.get(options, (error, response) => {
      if (error) {
        reject(handleError(error));
      } else {
        resolve(response);
      }
    });
  });
