import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
	input: 'src/GraphEditor.ts',
	output: [
	  	{
			file: 'dist/index.esm.js',
			sourcemap: true,
			format: 'esm',
	  	},
		{
			file: 'dist/index.esm.min.js',
			format: 'esm',
			plugins: [terser()]
		},
	  	{
			file: 'dist/index.js',
			sourcemap: true,
			format: 'umd',
			name: 'GraphEditor',
			amd: {
				id: 'GraphEditor'
			}
		},
		{
			file: 'dist/index.min.js',
			format: 'umd',
			name: 'GraphEditor',
			amd: {
				id: 'GraphEditor'
			},
			plugins: [terser()]
	  	},
	  	{
			file: 'dist/index.sys.js',
			sourcemap: true,
			format: 'system'
		},
	  	{
			file: 'dist/index.sys.min.js',
			format: 'system',
			plugins: [terser()]
	  	}
	],
	external: [
	 	...Object.keys(pkg.dependencies || {}),
	 	...Object.keys(pkg.peerDependencies || {}),
	],
	plugins: [
	  	typescript({
			typescript: require('typescript'),
		}),
		resolve()
	],
}
