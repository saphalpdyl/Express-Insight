import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'lib/index.js',
  output: [
    {
      file: 'dist/bundle.cjs',
      format: 'cjs'
    },
    {
      file: 'dist/bundle.mjs',
      format: 'esm'
    }
  ],
  plugins: [
    resolve(),
    commonjs()
  ],
  external: ['express', 'fs', 'path', 'util'],
};