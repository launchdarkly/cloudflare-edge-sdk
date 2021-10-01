// Type definitions for launchdarkly-cloudflare-edge-sdk

/**
 * This is the API reference for the LaunchDarkly Cloudflare Edge SDK.
 */

declare module 'launchdarkly-cloudflare-edge-sdk/feature_store' {
  import { LDFeatureStore, LDLogger, LDOptions } from 'launchdarkly-node-server-sdk';

  /**
   * Configures a feature store backed by cloudflare KV
   *
   * For more details about how and why you can use a persistent feature store, see
   * the [SDK features guide](https://docs.launchdarkly.com/sdk/features/database-integrations).
   *
   * @param kvNamespace
   *   KV store namespace binding
   * @param sdkKey
   *   The client-side SDK key for the environment
   * @param options
   *   Configurations parameters for the feature store
   * @param logger
   *   A custom logger for warnings and errors. If not specified, it will use whatever the
   *   SDK's logging configuration is.
   *
   * @returns
   *   A factory function that the SDK will use to create the data store. Put this value into the
   *   `featureStore` property of [[LDOptions]].
   */
  export function CloudflareFeatureStore(
    kvNamespace: KVNamespace,
    sdkKey: string,
    options?: LDCloudflareOptions,
    logger?: LDLogger | object,
  ): (config: LDOptions) => LDFeatureStore;

  /**
   * The standard options supported for the LaunchDarkly Redis integration.
   */
   export interface LDCloudflareOptions {
    /**
     * The amount of time, in seconds, that recently read or updated items should remain in an
     * in-memory cache. If it is zero, there will be no in-memory caching.
     * The default value is 60 seconds.
     */
    cacheTTL?: number;
  }
}
