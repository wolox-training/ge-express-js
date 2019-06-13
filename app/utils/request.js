const request = require('request-promise'),
  {
    common: {
      externalApi: { apiBaseUrl }
    }
  } = require('../../config'),
  mockedRequest = require('../../test/mockedRequest');

const buildDefaultApiConfig = path => ({
  uri: `${apiBaseUrl}/${path}`,
  json: true,
  headers: { 'content-type': 'application/json' }
});

if (process.env.NODE_ENV === 'testing') {
  module.exports = url => mockedRequest(url);
} else {
  module.exports = url => request(buildDefaultApiConfig(url));
}
