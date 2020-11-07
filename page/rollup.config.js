import vue from 'rollup-plugin-vue';
import builtins from 'rollup-plugin-node-builtins';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/main.js',
    output: {
	globals: {
	    // 'vue': 'Vue',
	    // 'vue-router':'VueRouter',
	    // 'vuex':'Vuex'
	    // 'graphology':'graphology',
	    // 'graphology-layout-forceatlas2/worker':'FA2Layout',
	    // 'sigma/renderers/webgl':'WebGLRenderer'
	},
	format: 'iife',
	file: 'dist/static/js/cafe.js'
    },
    plugins: [
	postcss({
	    plugins: []
	}),
	builtins(),
	commonjs({
	    include: ['node_modules/**'],
	    extensions: ['.js', '.glsl']
	    //exclude:['node_modules/sigma/renderers/webgl/programs/**']
	}),
	resolve(),
	replace({
	    'process.env.NODE_ENV': JSON.stringify( 'production' )
	}),
	vue({
	    template: {
		production: true,
		compilerOptions: { preserveWhitespace: false }
	    },
	    css: true
	})
    ]
}
