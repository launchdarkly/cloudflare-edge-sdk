# LaunchDarkly Edge SDK for Cloudflare

[![CircleCI](https://circleci.com/gh/launchdarkly/cloudflare-edge-sdk.svg?style=svg)](https://circleci.com/gh/launchdarkly/cloudflare-edge-sdk)

This library supports using Cloudflare [Workers KV](https://developers.cloudflare.com/workers/learning/how-kv-works) to replace the default in-memory feature store of the [LaunchDarkly Node.js SDK](https://github.com/launchdarkly/node-server-sdk).

For more information, see the [SDK features guide](https://docs.launchdarkly.com/sdk/features/storing-data).

## 👋 Here be Dragons 🐉 This is a hard fork ☢️

``` bash
git clone git@github.com:candy-digital/cloudflare-edge-sdk
cd cloudflare-edge-sdk
git checkout skunkworks/esm
npm install # or yarn

# Monkey punch the world
cp vendor/rollup-plugin-node-polyfills/dist/index.* node_modules/rollup-plugin-node-polyfills/dist/  

# Hope and then hope some more
npx rollup --c rollup.config.js

# 🚀☢️🐉👈
npm link
```

n.b. [`sendEvents`](https://launchdarkly.github.io/js-client-sdk/interfaces/_launchdarkly_js_client_sdk_.ldoptions.html#sendevents) **MUST BE** set to `false` as the monkey punch hack is to `null` the Node.js HTTP stack (i.e. any instance of:

``` js
require('http')
require('https')

import http from 'http'
import https from 'https'
```

## Quick setup

1. Install this package with `npm`:
   ```
   npm install launchdarkly-cloudflare-edge-sdk --save
   ```

2. Require the package:
   ```javascript
   const { init } = require('launchdarkly-cloudflare-edge-sdk');
    ```

3. When configuring your SDK client, initialize with the [Cloudflare KV namespace](https://developers.cloudflare.com/workers/runtime-apis/kv#kv-bindings):
   ```javascript
   const client = init(KV_NAMESPACE, 'YOUR CLIENT-SIDE SDK KEY');
   ```

## About LaunchDarkly

* LaunchDarkly is a continuous delivery platform that provides feature flags as a service and allows developers to iterate quickly and safely. We allow you to easily flag your features and manage them from the LaunchDarkly dashboard.  With LaunchDarkly, you can:
    * Roll out a new feature to a subset of your users (like a group of users who opt-in to a beta tester group), gathering feedback and bug reports from real-world use cases.
    * Gradually roll out a feature to an increasing percentage of users, and track the effect that the feature has on key metrics (for instance, how likely is a user to complete a purchase if they have feature A versus feature B?).
    * Turn off a feature that you realize is causing performance problems in production, without needing to re-deploy, or even restart the application with a changed configuration file.
    * Grant access to certain features based on user attributes, like payment plan (eg: users on the ‘gold’ plan get access to more features than users in the ‘silver’ plan). Disable parts of your application to facilitate maintenance, without taking everything offline.
* LaunchDarkly provides feature flag SDKs for a wide variety of languages and technologies. Read [our documentation](https://docs.launchdarkly.com/sdk) for a complete list.
* Explore LaunchDarkly
    * [launchdarkly.com](https://www.launchdarkly.com/ "LaunchDarkly Main Website") for more information
    * [docs.launchdarkly.com](https://docs.launchdarkly.com/  "LaunchDarkly Documentation") for our documentation and SDK reference guides
    * [apidocs.launchdarkly.com](https://apidocs.launchdarkly.com/  "LaunchDarkly API Documentation") for our API documentation
    * [blog.launchdarkly.com](https://blog.launchdarkly.com/  "LaunchDarkly Blog Documentation") for the latest product updates
