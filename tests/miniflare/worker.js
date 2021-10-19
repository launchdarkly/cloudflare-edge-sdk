/* global FeatureStore, Response, addEventListener */

const { init } = require('../../');

const CLIENT_ID = 'deadbeefdeadbeefdeadbeef';

let client;

const handleRequest = async () => {
  if (!client) {
    client = init(FeatureStore, CLIENT_ID);
    await client.waitForInitialization();
  }
  const user = {
    key: 'testuser',
    custom: {
      teamId: 'foo',
    },
  };
  const result = await client.variationDetail('foo-barrymore', user, true);

  return new Response(result.value);
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest());
});
