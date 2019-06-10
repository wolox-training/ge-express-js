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

exports.getAlbums = () => request(buildDefaultApiConfig('albums'));

exports.getAlbumPhotos = id => request(buildDefaultApiConfig(`albums/${id}/photos`));
