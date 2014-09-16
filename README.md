Brix Loader
===========

[![Build Status](https://api.travis-ci.org/thx/brix-loader.svg)](http://travis-ci.org/thx/brix-loader)
[![Coverage Status](https://img.shields.io/coveralls/thx/brix-loader.svg)](https://coveralls.io/r/thx/brix-loader?branch=master)
[![Bower version](https://badge.fury.io/bo/brix-loader.svg)](http://badge.fury.io/bo/brix-loader)
[![Dependency Status](https://gemnasium.com/thx/brix-loader.svg)](https://gemnasium.com/thx/brix-loader)

组件加载器，负责管理组件的整个生命周期，包括加载、初始化、渲染、销毁。

## 安装 Install

```sh
$ bower install --save-dev brix-loader
```

## 用法 Usage


```js

require.config({
    paths: {
        'loader': 'bower_components/brix-loader/dist/'
    }
})

require(['loader'], function(Loader){
	Loader.boot('body', function(){
		var instances = Loader.query('brix/gallery/dropdown')
		instance.toggle()
	})
})
```

## 公开方法 API

### Loader.boot( context [, callback] )

初始化节点 context 以及节点 context 内的所有组件。

* **context** 一个 DOM 元素。
* **callback** 一个函数，当所有组件初始化完成后被执行。

### Loader.destroy( instance )

销毁某个组件，包括它的后代组件。

* **instance** 某个组件实例。

### Loader.query( moduleId )

根据模块标识符 moduleId 查找组件实例。

* **moduleId** 模块标识符。

> 该方法的返回值是一个数组，包含了一组组件实例，并且，数组上含有所有 Brix 组件实例的方法。

## License

MIT

<!-- 

https://github.com/pahen/madge
	sudo npm -g install madge
	sudo brew install graphviz
	madge --format amd ./src/
	madge --format amd --image ./doc/dependencies.png ./src/
		blue = has dependencies
		green = has no dependencies
		red = has circular dependencies

.editorconfig
	https://github.com/search?o=desc&q=gulp+boilerplate&ref=searchresults&s=stars&type=Repositories&utf8=%E2%9C%93
    https://github.com/sindresorhus/gulp-plugin-boilerplate/

r.js
    sudo npm install -g requirejs
    r.js -o build.js
    https://github.com/jrburke/r.js/blob/master/build/example.build.js
 
 -->