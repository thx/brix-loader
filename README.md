Brix Loader
===========

[![Build Status](http://img.shields.io/travis/thx/brix-loader.svg?style=flat)](http://travis-ci.org/thx/brix-loader)
[![Coverage Status](https://img.shields.io/coveralls/thx/brix-loader.svg?style=flat)](https://coveralls.io/r/thx/brix-loader?branch=master)
[![Dependency Status](http://img.shields.io/gemnasium/thx/brix-loader.svg?style=flat)](https://gemnasium.com/thx/brix-loader)

<!-- [![Bower version](https://badge.fury.io/bo/brix-loader.svg)](http://badge.fury.io/bo/brix-loader) -->


组件加载器，负责管理组件的整个生命周期，包括加载、初始化、渲染、销毁。

### 安装 <small>Install</small>

```sh
$ bower install --save brix-loader
$ npm install --save brix-loader
```

### 用法 <small>Usage</small>

```js
// 配置 Loader 路径
require.config({
    paths: {
        'brix/loader': 'bower_components/brix-loader/dist/loader'
    }
})
// 加载 Loader
require(['brix/loader'], function(Loader){
    // 加载组件
    Loader.boot('body', function(){
        // 查找组件
        var instances = Loader.query('components/dropdown')
        instance.toggle()
    })
})
```

### 方法 <small>Methods</small>

共计 5 个公开方法：

1. Loader.boot( context, complete, notify )
2. Loader.destroy( component, complete )
3. Loader.query( moduleId, context )
4. Loader.load( element, moduleId, options, complete )
5. Loader.unload( element, complete )

#### Loader.boot( [ context ] [, complete( records ) ] [, notify( error, instance, index, count ) ] )

**初始化节点 `context` 以及节点 `context` 内的所有组件。**当所有组件初始化完成后回调函数 `complete` 被执行，当每个组件初始化完成后回调函数 `notify` 被执行。

* **Loader.boot( complete, notify )**
    * Loader.boot()
    * Loader.boot( complete )
    * Loader.boot( complete, notify )
* **Loader.boot( element, complete, notify )**
    * Loader.boot( element )
    * Loader.boot( element, complete )
    * Loader.boot( element, complete, notify )
* **Loader.boot( array{element}, complete, notify )**
    * Loader.boot( array )
    * Loader.boot( array, complete )
    * Loader.boot( array, complete, notify )

**参数的含义和默认值**如下：

* `context` 可选。一个 DOM 元素，或一组 DOM 元素。默认为 `document.body`。
* `complete( records )` 可选。一个回调函数，当所有组件初始化完成后被执行。
    * `records` 二维数组，记录了组件在初始化过程中的相关信息，包括：异常 `error`、组件实例 `instance`、在初始化队列中的下标 `index`、初始化队列的长度 `count`。数据结构为：
        
        ```js
        [
            [error, instance, index, count],
            [error, instance, index, count],
            ...
        ]
        ```

        详见下一个参数 `notify`。

* `notify( error, instance, index, count )` 可选。一个回调函数，当每个组件初始化完成后被执行。
    * `error` 初始化过程中可能抛出的 `Error` 对象。如果没有发生任何错误，则为 `undefined`。
    * `instance` 当前组件的实例。
    * `index` 当前组件在初始化队列中的下标，即初始化的顺序。
    * `count` 初始化队列的长度。


#### Loader.destroy( component [, complete() ] )

销毁某个组件，包括它的后代组件。

* **Loader.destroy( component, complete )**
    * Loader.destroy( component )
    * Loader.destroy( component, complete )
* **Loader.destroy( element, complete )**
    * Loader.destroy( element )
    * Loader.destroy( element, complete )
* **Loader.destroy( array{element|component}, complete )**
    * Loader.destroy( array )
    * Loader.destroy( array, complete )
* **Loader.destroy( context, complete )**
    * Loader.destroy( context )
    * Loader.destroy( context, complete )

**参数的含义和默认值**如下：

* `component` 某个组件实例。
* `element` 一个关联了某个组件的 DOM 元素。
* `array{element|component}` 一个含有组件实例或 DOM 元素的数组。
* `context` 一个 DOM 元素。
* `complete()` 可选。一个回调函数，当组件销毁后被执行。


#### Loader.destroy( moduleId [, context] [, complete() ] )

* **Loader.destroy( moduleId, complete )**
    * Loader.destroy( moduleId )
    * Loader.destroy( moduleId, complete )
* **Loader.destroy( moduleId, context, complete )**
    * Loader.destroy( moduleId, context )
        * Loader.destroy( moduleId, parentModuleId )
        * Loader.destroy( moduleId, parentComponent )
        * Loader.destroy( moduleId, parentElement )
        * Loader.destroy( moduleId, array{parentModuleId} )
        * Loader.destroy( moduleId, array{parentComponent} )
        * Loader.destroy( moduleId, array{parentElement} )
    * Loader.destroy( moduleId, context, complete )

**参数的含义和默认值**如下：

* `moduleId` 模块标识符。
* `context` 限定销毁的范围。可以是父（祖先）模块标识符 `parentModuleId`、父（祖先）组件实例 `parentComponent`、父（祖先）节点 `parentElement` 或数组 `array{parentModuleId|parentComponent|parentElement}`。
* `complete()` 可选。一个回调函数，当组件销毁后被执行。


#### Loader.query( moduleId [, context ] )

根据模块标识符 `moduleId` 查找组件实例。

* Loader.query( moduleId, context )
    * Loader.query( moduleId )
    * Loader.query( moduleId, parentModuleId )
    * Loader.query( moduleId, parentComponent )
    * Loader.query( moduleId, parentElement )
    * Loader.query( moduleId, array{parentModuleId} )
    * Loader.query( moduleId, array{parentComponent} )
    * Loader.query( moduleId, array{parentElement} )
* Loader.query( element )
    * Loader.query( element )
    * Loader.query( array{element} )

**参数的含义和默认值**如下：

* `moduleId` 模块标识符。
* `context` 限定查找的范围。可以是父（祖先）模块标识符 `parentModuleId`、父（祖先）组件实例 `parentComponent`、父（祖先）节点 `parentElement` 或数组 `array{parentModuleId|parentComponent|parentElement}`。
* `element` 设置了属性 `bx-name` 的节点或节点数组。

> 该方法的返回值是一个数组，包含了一组 Brix 组件实例，并且，数组上含有所有 Brix 组件实例的方法。


#### Loader.load( element, moduleId [, options ] [, complete( records ) ] )

加载组件 `moduleId` 到指定的节点 `element` 中。

* Loader.load( element, moduleId, options, complete )
    * Loader.load( element, moduleId )
    * Loader.load( element, moduleId, options )
    * Loader.load( element, moduleId, complete )
    * Loader.load( element, moduleId, options, complete )
* Loader.load( array{element}, moduleId, options, complete )
    * Loader.load( array{element}, moduleId)
    * Loader.load( array{element}, moduleId, options)
    * Loader.load( array{element}, moduleId, options, complete)

**参数的含义和默认值**如下：

* `moduleId` 必选。模块标识符。
* `element` 必选。目标节点。
* `array` 必选。目标节点数组。
* `complete( records )` 可选。一个回调函数，当组件加载完成后被执行。
    * * `records` 二维数组，记录了组件在初始化过程中的相关信息，包括：异常、实例、在初始化队列中的下标、初始化队列的长度。

> 因为每个组件的行为不可以预测（例如，`table` 是增强，`dropdwon` 是替换，`pagination` 是插入），导致销毁和再次加载的行为也不可预测，所以不能直接在节点 `element` 上加载，而是在其内新建一个容器元素 `<div>`，在这个容器元素上加载组件 `moduleId`。


#### Loader.unload( element [, complete ] )

卸载节点 `element` 中加载的组件。

* Loader.unload( element, complete )
    * Loader.unload( element )
    * Loader.unload( element, complete )
* Loader.unload( array{element}, complete )
    * Loader.unload( array{element} )
    * Loader.unload( array{element}, complete )

**参数的含义和默认值**如下：

* `element` 必选。目标节点。
* `array` 必选。目标节点数组。
* `complete` 可选。一个回调函数，当组件卸载完成后被执行。


### 文件结构 <small>Structure</small>

```shell
brew install tree
tree . -I 'node_modules|bower_components'
```

### 贡献者 <small>Contributors</small>

```shell
brew install git-extras
git summary
```

### 许可 <small>License</small>

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