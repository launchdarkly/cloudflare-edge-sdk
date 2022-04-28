import require$$0$2 from 'launchdarkly-node-server-sdk';
import require$$0$1 from 'launchdarkly-node-server-sdk/loggers';
import require$$0 from 'launchdarkly-node-server-sdk/caching_store_wrapper';

const CachingStoreWrapper = require$$0;
const noop = function () {};

const defaultCacheTTLSeconds = 60;

const kvStore = function CloudflareFeatureStore(kvNamespace, sdkKey, options, logger) {
  let ttl = options && options.cacheTTL;
  if (ttl === null || ttl === undefined) {
    ttl = defaultCacheTTLSeconds;
  }

  return config =>
    new CachingStoreWrapper(cfFeatureStoreInternal(kvNamespace, sdkKey, logger || config.logger), ttl, 'Cloudflare');
};

function cfFeatureStoreInternal(kvNamespace, sdkKey, logger) {
  const key = `LD-Env-${sdkKey}`;
  const store = {};

  store.getInternal = (kind, flagKey, maybeCallback) => {
    logger.debug(`Requesting key: ${flagKey} from KV.`);
    const cb = maybeCallback || noop;
    kvNamespace
      .get(key, { type: 'json' })
      .then(item => {
        if (item === null) {
          logger.error('Feature data not found in KV.');
        }
        const kindKey = kind.namespace === 'features' ? 'flags' : kind.namespace;
        cb(item[kindKey][flagKey]);
      })
      .catch(err => {
        logger.error(err);
      });
  };

  store.getAllInternal = (kind, maybeCallback) => {
    const cb = maybeCallback || noop;
    const kindKey = kind.namespace === 'features' ? 'flags' : kind.namespace;
    logger.debug(`Requesting all ${kindKey} data from KV.`);
    kvNamespace
      .get(key, { type: 'json' })
      .then(item => {
        if (item === null) {
          logger.error('Feature data not found in KV.');
        }
        cb(item[kindKey]);
      })
      .catch(err => {
        logger.error(err);
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

var cloudflare_feature_store = {
  CloudflareFeatureStore: kvStore,
};

var messages$1 = {};

messages$1.missingKey = () => 'You must configure the client with a client key';

messages$1.missingNamespace = () => 'You must configure the client with a Cloudflare KV Store namespace binding';

messages$1.unsupportedOption = key => `Configuration option: ${key} not supported`;

var name = "launchdarkly-cloudflare-edge-sdk";
var version = "0.1.0";
var main = "index.mjs";
var module = "index.mjs";
var scripts = {
	"check-typescript": "node_modules/typescript/bin/tsc",
	lint: "eslint --format 'node_modules/eslint-formatter-pretty' --ignore-path .eslintignore .",
	test: "npx jest --testPathIgnorePatterns=tests/integration",
	"test:integration": "npx jest tests/integration",
	ts: "npx tsc"
};
var types = "./index.d.ts";
var license = "Apache-2.0";
var repository = {
	type: "git",
	url: "https://github.com/launchdarkly/cloudflare-edge-sdk.git"
};
var keywords = [
	"launchdarkly",
	"cloudflare",
	"edge"
];
var bugs = {
	url: "https://github.com/launchdarkly/cloudflare-edge-sdk/issues"
};
var homepage = "https://github.com/launchdarkly/cloudflare-edge-sdk";
var dependencies = {
	"@rollup/plugin-commonjs": "^22.0.0",
	"@rollup/plugin-json": "^4.1.0",
	"launchdarkly-node-server-sdk": "^6.2.0",
	rollup: "^2.70.2"
};
var devDependencies = {
	"@cloudflare/workers-types": "^3.0.0",
	eslint: "7.32.0",
	"eslint-config-prettier": "8.3.0",
	"eslint-formatter-pretty": "4.1.0",
	"eslint-plugin-jest": "^25.0.5",
	"eslint-plugin-prettier": "3.4.0",
	jest: "^27.2.5",
	"jest-junit": "^13.0.0",
	miniflare: "^1.4.1",
	prettier: "2.3.2",
	"rollup-plugin-node-polyfills": "^0.2.1",
	typescript: "^4.4.3"
};
var jest = {
	rootDir: ".",
	testEnvironment: "node",
	testMatch: [
		"**/*-test.js"
	],
	testResultsProcessor: "jest-junit"
};
var require$$3 = {
	name: name,
	version: version,
	main: main,
	module: module,
	scripts: scripts,
	types: types,
	license: license,
	repository: repository,
	keywords: keywords,
	bugs: bugs,
	homepage: homepage,
	dependencies: dependencies,
	devDependencies: devDependencies,
	jest: jest
};

const Ldlogger = require$$0$1;
const cf = cloudflare_feature_store;
const messages = messages$1;
const PACKAGE_JSON = require$$3;

var configuration$1 = (function () {
  const defaults = function () {
    return {
      stream: false,
      sendEvents: false,
      offline: false,
      useLdd: true,
      allAttributesPrivate: false,
      privateAttributeNames: [],
      inlineUsersInEvents: false,
      userKeysCapacity: 1000,
      userKeysFlushInterval: 300,
      diagnosticOptOut: true,
      diagnosticRecordingInterval: 900,
      wrapperName: 'cloudflare',
      wrapperVersion: PACKAGE_JSON.version,
    };
  };

  const allowedOptions = ['logger', 'featureStore'];

  const validate = function (kvNamespace, sdkKey, options) {
    if (!sdkKey) {
      throw new Error(messages.missingKey());
    }

    if (!kvNamespace || typeof kvNamespace !== 'object' || !!kvNamespace.get === false) {
      throw new Error(messages.missingNamespace());
    }

    Object.entries(options).forEach(([key]) => {
      if (!allowedOptions.includes(key)) {
        throw new Error(messages.unsupportedOption(key));
      }
    });

    const config = Object.assign({}, options || {});

    const fallbackLogger = Ldlogger.basicLogger({ level: 'info' });
    config.logger = config.logger ? Ldlogger.safeLogger(config.logger, fallbackLogger) : fallbackLogger;

    if (!config.featureStore) {
      config.featureStore = cf.CloudflareFeatureStore(kvNamespace, sdkKey, {}, config.logger);
    }

    const defaultConfig = defaults();

    const retConfig = applyDefaults(config, defaultConfig);
    config.logger.debug(`Using Configuration: ${JSON.stringify(retConfig)}`);

    return retConfig;
  };

  function applyDefaults(config, defaults) {
    // This works differently from Object.assign() in that it will *not* override a default value
    // if the provided value is explicitly set to null.
    const ret = Object.assign({}, config);
    Object.keys(defaults).forEach(name => {
      if (ret[name] === undefined || ret[name] === null) {
        ret[name] = defaults[name];
      }
    });
    return ret;
  }

  return {
    validate: validate,
    defaults: defaults,
  };
})();

const ld = require$$0$2;
const configuration = configuration$1;

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

var cloudflareEdgeSdk = {
  init: newClient,
};

export { cloudflareEdgeSdk as default };
