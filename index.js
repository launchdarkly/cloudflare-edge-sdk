require('setimmediate');

const ld = require('launchdarkly-node-server-sdk');
const configuration = require('./configuration');

const newClient = function (kvNamespace, sdkKey, originalConfig = {}) {
  const config = configuration.validate(kvNamespace, sdkKey, originalConfig);
  const ldClient = ld.init('none', config);
  const client = {};

  client.variation = function (key, user, defaultValue, callback) {
    return ldClient.variation(key, user, defaultValue, callback);
  };

  client.variationDetail = function (key, user, defaultValue, callback) {
    return ldClient.variationDetail(key, user, defaultValue, callback);
  };

  client.allFlagsState = function (user, options, callback) {
    return ldClient.allFlagsState(user, options, callback);
  };

  client.waitForInitialization = function () {
    return ldClient.waitForInitialization();
  };

  return client;
};

module.exports = {
  init: newClient,
};
