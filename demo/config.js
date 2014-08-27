require.config({
	map: {
		'*': {
			'css': '/bower_components/require-css/css.js',
			'less': '/bower_components/require-less/less.js'
		}
	},
	paths: {
		// 插件
		text: "/bower_components/requirejs-text/text",
		// 运行依赖库
		jquery: '/bower_components/jquery/dist/jquery',
		underscore: '/bower_components/underscore/underscore',
		q: '/bower_components/q/q',
		watch: '/bower_components/watch/src/watch',
		// 开发依赖库
		mock: '/bower_components/mockjs/dist/mock',
		backbone: '/bower_components/backbone/backbone',
		d3: '/bower_components/d3/d3',
		// 组件
		'gallery/hello': '/demo/gallery/hello/hello',
		'gallery/dropdown': '/demo/gallery/dropdown/dropdown',
		'gallery/pagination': '/demo/gallery/pagination/pagination',
		'gallery/pure-pagination': '/demo/gallery/pagination/pure-pagination',
		'gallery/colorpicker': '/demo/gallery/colorpicker/colorpicker'
	}
})