const configuration = require('../configuration');
const messages = require('../messages');

describe('configuration', () => {
  function emptyConfigWithMockLogger() {
    const logger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };

    const sdkKey = '12345';

    const fakeKv = {
      get: () => {},
    };
    return { sdkKey, fakeKv, logger };
  }

  const configIn = emptyConfigWithMockLogger();

  it('throws without namespace', () => {
    expect(() => {
      configuration.validate(null, configIn.sdkKey, configIn.logger);
    }).toThrow(messages.missingNamespace());
  });

  it('throws with wrong object passed in for namespace, missing get function', () => {
    expect(() => {
      configuration.validate({}, configIn.sdkKey, configIn.logger);
    }).toThrow(messages.missingNamespace());
  });

  it('throws without SDK key', () => {
    expect(() => {
      configuration.validate(configIn.fakeKv, null, configIn.logger);
    }).toThrow(messages.missingKey());
  });

  it('throws on unsupported options: unsupportedOptionTestKey', () => {
    expect(() => {
      configuration.validate(configIn.fakeKv, configIn.sdkKey, { unsupportedOptionTestKey: false });
    }).toThrow('Configuration option: unsupportedOptionTestKey not supported');
  });
});
