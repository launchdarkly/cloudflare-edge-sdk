import nodePolyfills from 'rollup-plugin-node-polyfills';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'index.js',
  output: {
    file: 'index.mjs',
    format: 'es'
  },
  plugins: [commonjs(), json(), nodePolyfills()]
};
