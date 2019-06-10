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

exports.getAlbums = () => request(buildDefaultApiConfig('a124lbums'));

exports.getAlbumPhotos = id => request(buildDefaultApiConfig(`albums/${id}/photos`));
