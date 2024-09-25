import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'lib/index.js',
  treeshake: true,
  output: [
    {
      file: 'dist/bundle.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/bundle.mjs',
      format: 'esm'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser({
      format: {
        comments: false,
      },
      compress: {
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        side_effects: true,
        warnings: false,
      },
      mangle: true,
    }),
  ],
  external: ['express', 'fs', 'path', 'util', 'better-sqlite3', 'lodash', 'uuid', 'hbs'],
};