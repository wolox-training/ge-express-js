const request = require('request-promise'),
  {
    common: {
      externalApi: { apiBaseUrl }
    }
  } = require('../../config');

const buildDefaultApiConfig = path => ({
  uri: `${apiBaseUrl}/${path}`,
  json: true,
  headers: { 'content-type': 'application/json' }
});

module.exports = url => request(buildDefaultApiConfig(url));
