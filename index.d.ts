// Type definitions for launchdarkly-cloudflare-edge-sdk

/**
 * This is the API reference for the LaunchDarkly Edge SDK for Cloudflare.
 */

declare module 'launchdarkly-cloudflare-edge-sdk' {
  import { LDEvaluationDetail, LDFeatureStore, LDFlagsState, LDFlagsStateOptions, LDFlagValue, LDLogger, LDOptions, LDUser } from 'launchdarkly-node-server-sdk';

  /**
   * Creates an instance of the LaunchDarkly client.
   *
   * Applications should instantiate a single instance for the lifetime of the worker.
   * The client will read in flags and related data from the provided kvNamespace. To
   * determine when it is ready to use, call [[LDClient.waitForInitialization]], or register an
   * event listener for the `"ready"` event using [[LDClient.on]].
   *
   * @param kvNamespace
   *   KV store namespace binding
   * @param sdkKey
   *   The client-side SDK key for the environment
   * @param options
   *   Optional configuration settings.
   * @return
   *   The new client instance.
   */
  export function init(
    kvNamespace: KVNamespace,
    sdkKey: string,
    options?: LDCFWorkerOptions,
  ): LDClient;

  export interface LDClient {
    /**
     * Returns a Promise that tracks the client's initialization state.
     *
     * The Promise will be resolved if the client successfully initializes, or rejected if client
     * initialization has failed unrecoverably (for instance, if it detects that the SDK key is invalid).
     * Keep in mind that unhandled Promise rejections can be fatal in Node, so if you call this method,
     * be sure to attach a rejection handler to it (or, if using `async`/`await`, a catch block).
     *
     * Note that you can also use event listeners ([[on]]) for the same purpose: the event `"ready"`
     * indicates success, and `"failed"` indicates failure.
     *
     * There is no built-in timeout for this method. If you want your code to stop waiting on the
     * Promise after some amount of time, you could use
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race|`Promise.race()`}
     * or one of the several NPM helper packages that provides a standard mechanism for this. Regardless
     * of whether you continue to wait, the SDK will still retry all connection failures indefinitely
     * unless it gets an unrecoverable error as described above.
     *
     * @returns
     *   A Promise that will be resolved if the client initializes successfully, or rejected if it
     *   fails. If successful, the result is the same client object.
     *
     * @example
     * This example shows use of Promise chaining methods for specifying handlers:
     * ```javascript
     *   client.waitForInitialization().then(() => {
     *     // do whatever is appropriate if initialization has succeeded
     *   }).catch(err => {
     *     // do whatever is appropriate if initialization has failed
     *   })
     * ```
     *
     * @example
     * This example shows use of `async`/`await` syntax for specifying handlers:
     * ```javascript
     *   try {
     *     await client.waitForInitialization();
     *     // do whatever is appropriate if initialization has succeeded
     *   } catch (err) {
     *     // do whatever is appropriate if initialization has failed
     *   }
     * ```
     */
    waitForInitialization(): Promise<LDClient>;

    /**
     * Determines the variation of a feature flag for a user.
     *
     * @param key
     *   The unique key of the feature flag.
     * @param user
     *   The end user requesting the flag. The client will generate an analytics event to register
     *   this user with LaunchDarkly if the user does not already exist.
     * @param defaultValue
     *   The default value of the flag, to be used if the value is not available from the KV store.
     * @param callback
     *   A Node-style callback to receive the result value. If omitted, you will receive a Promise instead.
     * @returns
     *   If you provided a callback, then nothing. Otherwise, a Promise which will be resolved
     *   with the result value.
     */
    variation(
      key: string,
      user: LDUser,
      defaultValue: LDFlagValue,
      callback?: (err: any, res: LDFlagValue) => void
    ): Promise<LDFlagValue>;

    /**
     * Determines the variation of a feature flag for a user, along with information about how it was
     * calculated.
     *
     * The `reason` property of the result will also be included in analytics events, if you are
     * capturing detailed event data for this flag.
     *
     * For more information, see the [SDK reference guide](https://docs.launchdarkly.com/sdk/features/evaluation-reasons#nodejs-server-side).
     *
     * @param key
     *   The unique key of the feature flag.
     * @param user
     *   The end user requesting the flag. The client will generate an analytics event to register
     *   this user with LaunchDarkly if the user does not already exist.
     * @param defaultValue
     *   The default value of the flag, to be used if the value is not available from the KV store.
     * @param callback
     *   A Node-style callback to receive the result (as an [[LDEvaluationDetail]]). If omitted, you
     *   will receive a Promise instead.
     * @returns
     *   If you provided a callback, then nothing. Otherwise, a Promise which will be resolved
     *   with the result (as an [[LDEvaluationDetail]]).
     */
    variationDetail(
      key: string,
      user: LDUser,
      defaultValue: LDFlagValue,
      callback?: (err: any, res: LDEvaluationDetail) => void
    ): Promise<LDEvaluationDetail>;

    /**
     * Builds an object that encapsulates the state of all feature flags for a given user.
     * This includes the flag values and also metadata that can be used on the front end. This
     * method does not send analytics events back to LaunchDarkly.
     *
     * The most common use case for this method is to bootstrap a set of client-side
     * feature flags from a back-end service. Call the `toJSON()` method of the returned object
     * to convert it to the data structure used by the client-side SDK.
     *
     * @param user
     *   The end user requesting the feature flags.
     * @param options
     *   Optional [[LDFlagsStateOptions]] to determine how the state is computed.
     * @param callback
     *   A Node-style callback to receive the result (as an [[LDFlagsState]]). If omitted, you
     *   will receive a Promise instead.
     * @returns
     *   If you provided a callback, then nothing. Otherwise, a Promise which will be resolved
     *   with the result as an [[LDFlagsState]].
     */
    allFlagsState(
      user: LDUser,
      options?: LDFlagsStateOptions,
      callback?: (err: Error, res: LDFlagsState) => void
    ): Promise<LDFlagsState>;
  }

  export interface LDCFWorkerOptions {
    /**
     * Configures a logger for warnings and errors generated by the SDK.
     *
     * The logger can be any object that conforms to the [[LDLogger]] interface.
     * For a simple implementation that lets you filter by log level, see
     * [[basicLogger]].
     *
     * If you do not set this property, the SDK uses [[basicLogger]] with a
     * minimum level of `info`.
     */
    logger?: LDLogger | object

    /**
     * A component that stores feature flags and related data received from LaunchDarkly.
     *
     * In Cloudflare, this is returned by the function CloudFlareFeatureStore
     */
    featureStore?: LDFeatureStore | ((options: LDOptions) => LDFeatureStore);
  }
}
