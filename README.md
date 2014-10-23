Brix Loader
===========

[![Build Status](http://img.shields.io/travis/thx/brix-loader.svg?style=flat)](http://travis-ci.org/thx/brix-loader)
[![Coverage Status](https://img.shields.io/coveralls/thx/brix-loader.svg?style=flat)](https://coveralls.io/r/thx/brix-loader?branch=master)
[![Dependency Status](http://img.shields.io/gemnasium/thx/brix-loader.svg?style=flat)](https://gemnasium.com/thx/brix-loader)

<!-- [![Bower version](https://badge.fury.io/bo/brix-loader.svg)](http://badge.fury.io/bo/brix-loader) -->


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

### Loader.boot( [ context ] [, callback ] )

* Loader.boot()
* Loader.boot( component )
* Loader.boot( element )
* Loader.boot( callback )

初始化节点 context 以及节点 context 内的所有组件，当所有组件初始化完成后回调函数 callback 被执行。

* **context** 可选。一个 DOM 元素。默认为 document.body。
* **callback** 可选。一个回调函数，当所有组件初始化完成后被执行。

### Loader.destroy(component [, callback ] )

* Loader.destroy( component )
* Loader.destroy( component, callback )
* Loader.destroy( element )
* Loader.destroy( element, callback )
* Loader.destroy( array )
* Loader.destroy( array, callback )

销毁某个组件，包括它的后代组件。

* **component** 某个组件实例。
* **element** 一个 DOM 元素。
* **array** 一个含有组件实例或 DOM 元素的数组。
* **callback** 可选。一个回调函数，当组件销毁后被执行。

### Loader.query( moduleId [, context ] )

* Loader.query( moduleId, context )
* Loader.query( moduleId )
* Loader.query( element )

根据模块标识符 moduleId 查找组件实例。

* **moduleId** 模块标识符。
* **context** 限定参查找的范围，可以是 moduleId、component、element。
* **element** 设置了属性 bx-name 的 DOM 元素。

> 该方法的返回值是一个数组，包含了一组 Brix 组件实例，并且，数组上含有所有 Brix 组件实例的方法。

## 文件结构 Structure

```shell
brew install tree
tree . -I 'node_modules|bower_components'
```

## 贡献者 Contributors

```shell
brew install git-extras
git summary
```

## License

MIT

<!-- 
https://github.com/totorojs/totoro

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
 
 http://localhost:4244/test/test.loader.html
 -->