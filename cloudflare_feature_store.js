const CachingStoreWrapper = require('launchdarkly-node-server-sdk/caching_store_wrapper');
const noop = function () {};

const defaultCacheTTLSeconds = 15;

const kvStore = function CloudFlareKVFeatureStore(storeNameTest, options) {
  let ttl = options && options.cacheTTL;
  if (ttl === null || ttl === undefined) {
    ttl = defaultCacheTTLSeconds;
  }
  return new CachingStoreWrapper(new cfFeatureStoreInternal(storeNameTest, options), ttl);
};

function cfFeatureStoreInternal(storeName, options) {
  options = options || {};
  const store = {};

  store.getInternal = (kind, key, maybeCallback) => {
    const cb = maybeCallback || noop;
    storeName.get('featureData').then(item => {
      const parseData = JSON.parse(item);
      cb(parseData[kind.namespace][key]);
    });
  };

  store.getAllInternal = (kind, maybeCallback) => {
    const cb = maybeCallback || noop;

    storeName.get('featureData').then(item => {
      const parseData = JSON.parse(item);
      cb(parseData[kind.namespace]);
    });
  };

  store.initInternal = async (allData, cb) => {
    await insertKindAll(allData);
    cb && cb();
  };

  store.upsertInternal = (kind, item, cb) => {};

  async function insertKindAll(allData) {
    await storeName.put('featureData', JSON.stringify(allData));
  }

  store.initializedInternal = async maybeCallback => {
    const cb =
      maybeCallback ||
      noop(() => {
        cb && cb();
      })();
  };

  // KV Binding is done outside of the application logic.
  store.close = () => {};

  return store;
}

module.exports = {
  CloudFlareKVFeatureStore: kvStore,
};
