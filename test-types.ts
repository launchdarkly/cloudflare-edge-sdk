// This file exists only so that we can run the TypeScript compiler in the CI build
// to validate our index.d.ts file.

import { CloudflareFeatureStore } from 'launchdarkly-cloudflare-edge-sdk/feature_store';

// Mimics a namespace binding being injected by wrangler.toml
declare global {
  const TEST_NAMESPACE: KVNamespace
}

var opts = {
  cacheTTL: 300,
};
var cloudflareStore = CloudflareFeatureStore(TEST_NAMESPACE, 'SDK_KEY', opts);
