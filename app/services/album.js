const request = require('../helpers/request'),
  { apiBaseUrl } = require('../constants');

exports.getAlbums = () =>
  request(
    {
      url: `${apiBaseUrl}/albums`,
      json: true,
      headers: { 'content-type': 'application/json' }
    },
    error => new Error(error)
  );

exports.getAlbumPhotos = id =>
  request(
    {
      url: `${apiBaseUrl}/albums/${id}/photos`,
      json: true,
      headers: { 'content-type': 'application/json' }
    },
    error => new Error(error)
  );
