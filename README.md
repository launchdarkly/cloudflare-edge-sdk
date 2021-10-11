# LaunchDarkly Cloudflare Edge SDK

[![CircleCI](https://circleci.com/gh/launchdarkly/cloudflare-edge-sdk.svg?style=svg)](https://circleci.com/gh/launchdarkly/cloudflare-edge-sdk)

This library provides a Cloudflare KV persistence mechanism (feature store) for the [LaunchDarkly Node.js SDK](https://github.com/launchdarkly/node-server-sdk), replacing the default in-memory feature store.

The minimum version of the LaunchDarkly Server-Side SDK for Node for use with this library is 6.2.0.

For more information, see the [SDK features guide](https://docs.launchdarkly.com/sdk/features/database-integrations).

TypeScript API documentation is [here](https://launchdarkly.github.io/cloudflare-edge-sdk).

## Quick setup

This assumes that you have already installed the LaunchDarkly Node.js SDK.

1. Install this package with `npm`:
   ```
   npm install launchdarkly-cloudflare-edge-sdk --save
   ```

2. Require the package:
   ```javascript
   const { CloudflareFeatureStore } = require('launchdarkly-cloudflare-edge-sdk');
    ```

3. When configuring your SDK client, add the Redis feature store:
   ```javascript
   const store = CloudflareFeatureStore(NAMESPACE, 'YOUR CLIENT-SIDE SDK KEY');
   const config = { featureStore: store };
   const client = LaunchDarkly.init('YOUR CLIENT-SIDE SDK KEY', config);
   ```

## Caching behavior

To reduce Cloudflare KV reads, there is an optional in-memory cache that retains the last known data for a configurable amount of time. This is on by default; to turn it off (and guarantee that the latest feature flag data will always be retrieved from Cloudflare KV for every flag evaluation), configure the store as follows:

```javascript
const store = CloudflareFeatureStore(NAMESPACE, 'YOUR CLIENT-SIDE SDK KEY', { cacheTTL: 0 });
```

## About LaunchDarkly

* LaunchDarkly is a continuous delivery platform that provides feature flags as a service and allows developers to iterate quickly and safely. We allow you to easily flag your features and manage them from the LaunchDarkly dashboard.  With LaunchDarkly, you can:
    * Roll out a new feature to a subset of your users (like a group of users who opt-in to a beta tester group), gathering feedback and bug reports from real-world use cases.
    * Gradually roll out a feature to an increasing percentage of users, and track the effect that the feature has on key metrics (for instance, how likely is a user to complete a purchase if they have feature A versus feature B?).
    * Turn off a feature that you realize is causing performance problems in production, without needing to re-deploy, or even restart the application with a changed configuration file.
    * Grant access to certain features based on user attributes, like payment plan (eg: users on the ‘gold’ plan get access to more features than users in the ‘silver’ plan). Disable parts of your application to facilitate maintenance, without taking everything offline.
* LaunchDarkly provides feature flag SDKs for a wide variety of languages and technologies. Check out [our documentation](https://docs.launchdarkly.com/docs) for a complete list.
* Explore LaunchDarkly
    * [launchdarkly.com](https://www.launchdarkly.com/ "LaunchDarkly Main Website") for more information
    * [docs.launchdarkly.com](https://docs.launchdarkly.com/  "LaunchDarkly Documentation") for our documentation and SDK reference guides
    * [apidocs.launchdarkly.com](https://apidocs.launchdarkly.com/  "LaunchDarkly API Documentation") for our API documentation
    * [blog.launchdarkly.com](https://blog.launchdarkly.com/  "LaunchDarkly Blog Documentation") for the latest product updates
