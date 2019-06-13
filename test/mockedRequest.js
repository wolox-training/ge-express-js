const getMockedResponse = url => {
  switch (url) {
    case 'albums/1':
      return { id: 1, title: 'asdas' };
    default:
      return null;
  }
};

module.exports = url => new Promise(resolve => resolve(getMockedResponse(url)));
