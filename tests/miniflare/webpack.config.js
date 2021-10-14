module.exports = {
  entry: './worker.js',
  target: 'webworker',
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty',
  },
};
