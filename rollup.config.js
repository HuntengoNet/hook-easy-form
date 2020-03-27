import sourceMap from 'rollup-plugin-sourcemaps';

import pj  from './package.json';

export default {
	input: 'dist/index.js',
	output: {
		file: pj.main,
		format: 'umd',
		name: 'MyEasyForm',
		sourcemap: true,
		globals: {
			react: 'React',
		}
	},
	plugins: [
		sourceMap(),
	]
}