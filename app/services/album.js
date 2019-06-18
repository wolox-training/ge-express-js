const request = require('request-promise'),
  {
    common: {
      externalApi: { apiBaseUrl }
    }
  } = require('../../config'),
  { apiError } = '../error';

const buildDefaultApiConfig = path => ({
  uri: `${apiBaseUrl}/${path}`,
  json: true,
  headers: { 'content-type': 'application/json' }
});

exports.getAlbums = () => request(buildDefaultApiConfig('albums')).catch(err => apiError(err));

exports.getAlbumPhotos = id =>
  request(buildDefaultApiConfig(`albums/${id}/photos`)).catch(err => apiError(err));
