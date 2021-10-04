const CachingStoreWrapper = require('launchdarkly-node-server-sdk/caching_store_wrapper');
const noop = function () {};

const defaultCacheTTLSeconds = 60;

//TODO Use logger where applicable
const kvStore = function CloudflareFeatureStore(kvNamespace, sdkKey, options, logger) {
  let ttl = options && options.cacheTTL;
  if (ttl === null || ttl === undefined) {
    ttl = defaultCacheTTLSeconds;
  }

  return config =>
    new CachingStoreWrapper(cfFeatureStoreInternal(kvNamespace, sdkKey, logger || config.logger), ttl, 'Cloudflare');
};

function cfFeatureStoreInternal(kvNamespace, sdkKey) {
  const key = `LD-Env-${sdkKey}`;
  const store = {};

  store.getInternal = (kind, key, maybeCallback) => {
    const cb = maybeCallback || noop;
    kvNamespace.get(key, { type: 'json' }).then(item => {
      const kindKey = kind.namespace === 'features' ? 'flags' : 'segments';
      cb(item[kindKey][key]);
    });
  };

  store.getAllInternal = (kind, maybeCallback) => {
    const cb = maybeCallback || noop;
    kvNamespace.get(key, { type: 'json' }).then(item => {
      const kindKey = kind.namespace === 'features' ? 'flags' : 'segments';
      cb(item[kindKey]);
    });
  };

  store.initInternal = (allData, cb) => {
    cb && cb();
  };

  store.upsertInternal = noop;

  store.initializedInternal = maybeCallback => {
    const cb = maybeCallback || noop;
    kvNamespace.get(key).then(item => cb(Boolean(item === null)));
  };

  // KV Binding is done outside of the application logic.
  store.close = noop;

  return store;
}

module.exports = {
  CloudflareFeatureStore: kvStore,
};
