const ld = require('launchdarkly-node-server-sdk');
const configuration = require('./configuration');

const newClient = function (kvNamespace, sdkKey, originalConfig) {
  const config = configuration.validate(kvNamespace, sdkKey, originalConfig);
  const ldClient = ld.init('none', config);

  return ldClient;
};

module.exports = {
  init: newClient,
};
