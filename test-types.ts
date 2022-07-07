// This file exists only so that we can run the TypeScript compiler in the CI build
// to validate our index.d.ts file.

import { init } from 'launchdarkly-cloudflare-edge-sdk';

// Mimics a namespace binding being injected by wrangler.toml
declare global {
  const TEST_NAMESPACE: KVNamespace
}

var ldClient = init(TEST_NAMESPACE, 'SDK_KEY');

ldClient.waitForInitialization().then(async () => {
  const user = { key: 'example-user-key', name: 'Sandy' }
  await ldClient.variation('my-boolean-flag', user, false)
  await ldClient.variationDetail('my-boolean-flag', user, false)
  await ldClient.allFlagsState(user)
})
