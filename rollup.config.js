import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from '@candy-digital/rollup-plugin-node-polyfills';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'index.js',
  output: {
    file: 'index.mjs',
    format: 'es',
  },
  plugins: [
    alias({
      entries: [{ find: 'crypto', replacement: 'crypto-browserify' }],
    }),
    commonjs(),
    json(),
    nodePolyfills(),
    nodeResolve(),
  ],
};
