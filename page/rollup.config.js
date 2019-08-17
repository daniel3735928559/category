import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/main.js',
    output: {
	globals: {
	    'vue': 'Vue',
	    'vue-router':'VueRouter',
	    'vuex':'Vuex'
	},
	format: 'iife',
	file: 'dist/static/js/cafe.js'
    },
    plugins: [
	commonjs(),
	vue({
	    template: {
		production: true,
		compilerOptions: { preserveWhitespace: false }
	    },
	    css: true
	})
    ]
}
