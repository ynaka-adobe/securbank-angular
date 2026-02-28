const BASIC_AUTH = 'Basic ' + Buffer.from('securbank:eyJhbGciOiJS').toString('base64');

const securbankProxy = {
  target: 'https://author-p18253-e46622.adobeaemcloud.com',
  secure: true,
  changeOrigin: true,
  headers: {
    Authorization: BASIC_AUTH
  }
};

module.exports = {
  '/graphql': securbankProxy,
  '/adobe': securbankProxy
};
