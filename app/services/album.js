const request = require('../helpers/request'),
  { apiBaseUrl } = require('../constants');

const buildDefaultApiConfig = path => ({
  url: `${apiBaseUrl}/${path}`,
  json: true,
  headers: { 'content-type': 'application/json' }
});

exports.getAlbums = () => request(buildDefaultApiConfig('albums'), error => new Error(error));

exports.getAlbumPhotos = id =>
  request(buildDefaultApiConfig(`albums/${id}/photos`), error => new Error(error));
