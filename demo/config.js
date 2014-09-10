require.config({
	map: {
		// 插件
		'*': {
			css: '/demo/bower_components/require-css/css.js',
			less: '/demo/bower_components/require-less/less.js',
			text: '/demo/bower_components/requirejs-text/text.js'
		}
	},
	paths: {
		bx: '/src/',
		// loader: '/src/loader',
		// DEMO 运行依赖库
		jquery: '/demo/bower_components/jquery/dist/jquery',
		underscore: '/demo/bower_components/underscore/underscore',
		mock: '/demo/bower_components/mockjs/dist/mock',
		d3: '/demo/bower_components/d3/d3',
		// 组件
		'gallery/hello': '/demo/gallery/hello/hello',
		'gallery/dropdown': '/demo/gallery/dropdown/dropdown',
		'gallery/pagination': '/demo/gallery/pagination/pagination',
		'gallery/pure-pagination': '/demo/gallery/pagination/pure-pagination',
		'gallery/colorpicker': '/demo/gallery/colorpicker/colorpicker'
	}
})