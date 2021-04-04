import sourceMap from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';

import pj  from './package.json';

export default {
	input: 'dist/index.js',
	output: [
    {
      file: pj.main,
      format: 'cjs',
			name: 'MyEasyForm',
      exports: 'named',
      sourcemap: true,
			globals: {
				react: 'React',
			}
    },
    {
      file: pj.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
	plugins: [
		sourceMap(),
		typescript({
      rollupCommonJSResolveHack: false,
      clean: true,
    }),
    uglify(),
	]
}