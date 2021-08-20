const CachingStoreWrapper = require('launchdarkly-node-server-sdk/caching_store_wrapper')
const NodeCache = require('node-cache')
const noop = function() {}

var defaultCacheTTLSeconds = 15

const kvStore = function CloudFlareKVFeatureStore(storeNameTest, options) {
  var ttl = options && options.cacheTTL
  if (ttl === null || ttl === undefined) {
    ttl = defaultCacheTTLSeconds
  }
  return new CachingStoreWrapper(
    new cfFeatureStoreInternal(storeNameTest, options),
    ttl,
  )
}

function cfFeatureStoreInternal(storeName, options) {
  const cache = new NodeCache({ stdTTL: 30 })
  options = options || {}
  const store = {}
  const prefix = options.prefix || ''
  const fullPrefix = kind => {
    return prefix ? `${prefix}:${kind}:` : `${kind}:`
  }

  store.getInternal = (kind, key, maybeCallback) => {
    const cb = maybeCallback || noop
    const findKey = key
    const kindData = cache.get(kind.namespace)
    if (kindData == undefined) {
      storeName.get('featureData').then(item => {
        const parseData = JSON.parse(item)
        cache.set('features', parseData['features'])
        cache.set('segments', parseData['segments'])
        cb(parseData[kind.namespace][key])
      })
    } else {
      console.log(`data: ${kindData[key]}`)
      cb(kindData[key])
    }
  }

  store.getAllInternal = (kind, maybeCallback) => {
    const cb = maybeCallback || noop
    const kindData = cache.get(kind.namespace)

    if (kindData == undefined) {
      storeName.get('featureData').then(item => {
        const parseData = JSON.parse(item)
        cache.set('features', parseData['features'])
        cache.set('segments', parseData['segments'])
        cb(parseData[kind.namespace])
      })
    } else {
      cb(kindData)
    }
  }

  store.initInternal = async (allData, cb) => {
    await insertKindAll(allData)
    cb && cb()
  }

  store.upsertInternal = (kind, item, cb) => {}

  async function insertKindAll(allData) {
    await storeName.put('featureData', JSON.stringify(allData))
  }

  store.initializedInternal = async (maybeCallback) => {
    const cb = maybeCallback || noop
    (function() { cb && cb(); })();
  }

  // KV Binding is done outside of the application logic.
  store.close = () => {}

  return store
}

module.exports = {
  CloudFlareKVFeatureStore: kvStore,
}