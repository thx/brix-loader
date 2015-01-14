
/* global define */
/*
    
    代码风格：
    https://github.com/thx/brix-loader/issues/1

    使用 Brix 组件时，需要指定必需的『模块 ID』和可选的『组件配置』，现在的纠结之处在于它们的代码风格：

    ### 模块 ID
    
    1. <div bx-id="component/hello">
    2. <div data-id="component/hello">
    3. <div data-module="component/hello">
    4. <div bx-name="component/hello">
    5. <div data-name="component/hello">

    ## 组件配置
    
    1. <div bx-options="{ msg: 'world' }">
    2. <div bx-msg="world">
    3. <div data-msg="world">
    
    你期望用上哪种风格？求投票。

    ## 结论

    基于投票结果，确定 Brix Loader 支持的写法如下：

    ### 模块 ID

    * `<div bx-name="component/hello">`

    ### 组件配置

    同时支持：

    * `<div bx-options="{ msg: 'world' }">`
    * `<div data-msg="world">`

 */
define('brix/loader/constant',[],function() {
    var VERSION = '0.0.x'
    var EXPANDO = (Math.random() + '').replace(/\D/g, '')
    return {
        VERSION: VERSION,
        // Loader
        ROOT_CLIENT_ID: -1,
        ATTRS: {
            id: 'bx-name',
            options: 'bx-options'
        },
        SELECTORS: {
            id: '[bx-name]',
            options: '[bx-options]'
        },
        EVENTS: {
            ready: 'ready',
            destroy: 'destroy'
        },
        /*
            以下属性会被自动从 options 复制到组件实例上。
            其他预设但是不会自动复制的选项有：
            * `css` 组件关联的 CSS 文件
            * `data`  组件关联的数据
            * `template` 组件关联的 HTML 模板
         */
        OPTIONS: [ // 以下属性会被自动复制到组件实例上
            'element', // 组件关联的节点
            'relatedElement', // 组件真正的节点
            'moduleId', // 组件的模块标识符
            'clientId', // 组件实例的标识符
            'parentClientId', // 父组件实例的标识符
            'childClientIds' // 父组件实例的标识符数组
        ],
        EXPANDO: 'Brix' + VERSION + EXPANDO,
        UUID: 0,
        // Event
        RE_EVENT: /bx\-(?!name|options)(.+)/,
        FN_ARGS: /([^()]+)(?:\((.*?)\))?/,
        LOADER_NAMESPACE: '._loader',
        COMPONENT_NAMESPACE: '._component',
        PREFIX: 'bx-'
    }
});
/* global define */
/* global location, setTimeout, setInterval, clearInterval */

/*
    Brix Loader Utility Functions
    
    http://underscorejs.org/
*/
define('brix/loader/util',[],function() {

    var _ = {}

    var slice = Array.prototype.slice
    var concat = Array.prototype.concat
    var toString = Object.prototype.toString
    var hasOwnProperty = Object.prototype.hasOwnProperty

    // Collection Functions

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    _.each = function(obj, iterator, context) {
        if (obj === null || obj === undefined) return obj
        if (obj.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                iterator.call(context, obj[i], i, obj)
            }
        } else {
            for (var prop in obj) {
                iterator.call(context, obj[prop], prop, obj)
            }
        }
        return obj
    }

    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = function(obj, iterator, context) {
        var results = []
        if (obj === null || obj === undefined) return results;
        if (obj.map === Array.prototype.map) return obj.map(iterator, context)
        _.each(obj, function(value, index, list) {
            results.push(iterator.call(context, value, index, list))
        })
        return results
    };


    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
        var results = []
        var args = slice.call(arguments, 1)
        _.each(array, function(item /*, index*/ ) {
            var contains = false
            _.each(args, function(arg /*, index*/ ) {
                if (!contains && (arg === item)) contains = true
            })
            if (!contains) results.push(item)
        })
        return results
    }

    // Produce a duplicate-free version of the array. 
    _.unique = function(array) {
        var results = []
        _.each(array.sort(), function(item, index) {
            if (index === 0 || item !== array[index - 1])
                results.push(item)
        })
        return results
    }

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
        var copy = {};
        var keys = concat.apply([], slice.call(arguments, 1))
        _.each(keys, function(key) {
            if (key in obj) copy[key] = obj[key]
        })
        return copy
    }

    // Object Functions

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
        _.each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop]
                }
            }
        })
        return obj
    }

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function(obj) {
        if (!_.isObject(obj)) return []
        if (Object.keys) return Object.keys(obj)
        var keys = []
        for (var key in obj)
            if (_.has(obj, key)) keys.push(key)
        return keys
    };

    // Retrieve the values of an object's properties.
    _.values = function(obj) {
        var keys = keys(obj)
        var length = keys.length
        var values = new Array(length)
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]]
        }
        return values
    }

    // Is a given value a DOM element?
    _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1)
    }

    // Add some isType methods
    // isBoolean isNumber isString isFunction isArray isDate isRegExp isObject isError
    _.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']'
        }
    })

    // Is a given object a finite number?
    _.isFinite = function(obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    }

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
        return _.isNumber(obj) && obj != +obj
    }

    // Is a given value a boolean?
    _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]'
    }

    // Is a given value equal to null?
    _.isNull = function(obj) {
        return obj === null
    }

    // Is a given variable undefined?
    _.isUndefined = function(obj) {
        return obj === void 0
    }

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    /* 非 Underscore 方法 */

    // 解析 hash
    _.parse = function(fragment) {
        fragment = fragment || location.hash
        var rhash = /#?!?([^?]*)\??(.*)?/
        var parts = rhash.exec(fragment)
        return {
            path: parts[1],
            params: this.unparam(parts[2])
        }
    }

    // 解析参数为 string
    _.param = function(params) {
        if (!params) return ''
        var r20 = /%20/g
        var re = [];
        _.each(params, function(value, key) {
            if (value === '') return
            re.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
        })
        return re.join("&").replace(r20, "+")
    }

    // 解析参数为 object
    _.unparam = function(param) {
        if (!param) return {}

        var re = {};
        for (var i = 0, arr = param.split('&'), kv;
            (kv = arr[i]); i++) {
            kv = kv.split('=');
            re[kv[0]] = kv[1];
        }
        return re;
    }

    // 去掉 HTML 的缩进
    _.trimHTML = function(element) {
        var htmls = element.outerHTML.split('\n')
        var indent = htmls[htmls.length - 1].match(/^([\s\t]*)/)[0].length
        return _.map(htmls, function(line, index) {
            return index === 0 ? line : line.slice(indent)
        }).join('\n')
    }

    // 去掉 <pre><code></code></pre> 的缩进
    _.trimPredefined = function(element) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        var text = element.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        var lines = text.split('\n')
        var indent
        _.each(lines, function(line /*, index*/ ) {
            if (!line) return
            if (indent !== undefined) return
            indent = line.match(/^([\s\t]*)/)[0].length
        })
        lines = _.map(lines, function(line /*, index*/ ) {
            return line.slice(indent)
        })
        return lines.join('\n').replace(rtrim, '')
    }

    // Queue 实现

    function Queue() {
        this.list = []
    }
    Queue.prototype = {
        queue: function(fn) {
            this.list.push(fn)
            return this
        },
        dequeue: function() {
            var that = this
            var fn = this.list.shift()
            if (fn) fn(next)

            function next() {
                that.dequeue();
            }
            return this
        },
        delay: function(time) {
            return this.queue(function(next) {
                setTimeout(next, time)
            })
        },
        clear: function() {
            this.list = []
            return this
        }
    }

    _.queue = function() {
        return new Queue()
    }

    // Promise 实现

    function Deferred() {
        var that = this
        this.state = 'pending' // resolved rejected
        this.resolvedList = []
        this.resolvedListIndex = 0
        this.rejectedList = []
        this.rejectedListIndex = 0
        this.progressedList = []
        this.progressedListIndex = 0
        this.promise = {
            then: function() {
                that.then.apply(that, arguments)
                return this
            },
            finally: function() {
                that.finally.apply(that, arguments)
                return this
            }
        }
    }
    Deferred.prototype = {
        then: function(resolved, rejected, progressed) {
            if (resolved) {
                if (resolved.finally) this.resolvedList.push(resolved)
                else this.resolvedList.splice(this.resolvedListIndex++, 0, resolved)
            }
            if (rejected) {
                if (rejected.finally) this.rejectedList.push(rejected)
                else this.rejectedList.splice(this.rejectedListIndex++, 0, rejected)
            }
            if (progressed) this.progressedList.push(progressed)

            if (this.state === 'resolved' && resolved) resolved(this.args)
            if (this.state === 'rejected' && rejected) rejected(this.args)
            return this
        },
        resolve: function(value) {
            this.args = value

            if (this.state !== 'pending') return this

            this.state = 'resolved'
            for (var i = 0; i < this.resolvedList.length; i++) {
                this.resolvedList[i](value)
            }
            return this
        },
        reject: function(reason) {
            this.args = reason

            if (this.state !== 'pending') return this

            this.state = 'rejected'
            for (var i = 0; i < this.rejectedList.length; i++) {
                this.rejectedList[i](reason)
            }
            return this
        },
        notify: function(progress) {
            for (var i = 0; i < this.progressedList.length; i++) {
                this.progressedList[i](progress)
            }
            return this
        },
        finally: function(callback) {
            callback.finally = true
            return this.then(callback, callback)
        }
    }

    _.defer = function() {
        return new Deferred()
    }

    // Deferred helper
    _.when = function( /* subordinate, ..., subordinateN */ ) {
        // TODO
    }

    /*
        定时器辅助工具，可以把多个 setInterval 合并成一个。
        来自 Countdown 组件。
     */
    var Timer = {
        push: function(task, interval) {
            this.timers = this.timers || {}
            this.timers[interval] = this.timers[interval] || []
            this.timers[interval].push(task)
            this.run()
        },
        pop: function(task, interval) {
            var timers = this.timers
            if (!timers || !timers[interval]) return
            for (var i = 0; i < timers[interval].length; i++) {
                if (timers[interval] === task) timers[interval].splice(i--, 1)
            }
        },
        run: function() {
            _.each(this.timers, function(item, interval) {
                if (!item.length) {
                    clearInterval(item.timer)
                    return
                }
                if (!item.timer) {
                    item.timer = setInterval(function() {
                        _.each(item, function(fn /*, index*/ ) {
                            fn()
                        })
                    }, interval)
                }
            })
        }
    }
    _.Timer = Timer

    return _
});
/* global define */
define(
    'brix/loader/options',[
        './constant',
        './util'
    ],
    function(
        Constant,
        Util
    ) {
        /**
         * 解析配置项 bx-options
         * @param  {element} 一个 DOM 元素
         * @return {object}
         *      {
         *        element:
         *        moduleId:
         *        clientId:
         *        parentClientId:
         *        childClientIds:
         *        events:
         *      }
         */
        function parse(element) {
            var options
            var parent, moduleId, clientId, parentClientId

            // 如果没有模块标识符，则无需（也无法）加载，立即返回
            moduleId = element.getAttribute(Constant.ATTRS.id)
            if (!moduleId) return {}

            // 为组件关联的 DOM 节点分配唯一标识
            clientId = Constant.UUID++
            if (element.clientId === undefined) element.clientId = clientId

            // 查找父节点
            parent = element
            do {
                parent = parent.parentNode
            } while (
                parent &&
                (parent.nodeType !== 9) && // Document 9
                (parent.nodeType !== 11) && // DocumentFragment 11
                parent.clientId === undefined
            )
            if (parent && parent.nodeType === 1) parentClientId = +parent.clientId
            else parentClientId = Constant.ROOT_CLIENT_ID

            // 配置项集合
            options = element.getAttribute(Constant.ATTRS.options)
            try {
                /* jshint evil:true */
                options = options ? (new Function("return " + options))() : {}
            } catch (exception) {
                options = {}
            }
            options.element = element
            options.moduleId = moduleId
            options.clientId = clientId
            options.parentClientId = parentClientId
            options.childClientIds = []

            // 解析 HTML5 data-* 中的配置项
            Util.extend(
                options,
                data(element)
            )

            return options
        }

        /*
            解析 HTML5 data-* 中的配置项，优先级比 bx-options 中的更高。
         */
        function data(element) {
            var options = {}
            Util.each(element.attributes, function(attribute) {
                var ma = /data-(.+)/.exec(attribute.name)
                if (!ma) return

                var value = attribute.value
                try {
                    /* jshint evil:true */
                    options[ma[1]] = /^\s*[\[{]/.test(value) ?
                        eval('(function(){ return [].splice.call(arguments, 0 )[0] })(' + value + ')') :
                        value
                } catch (error) {
                    options[ma[1]] = value
                }

                if (options[ma[1]] === 'true') options[ma[1]] = true
                if (options[ma[1]] === 'false') options[ma[1]] = false
            })
            return options
        }

        return {
            parse: parse
        }

    });
/* global define, require, document, location, console  */
/*
    # BCD
    
    **Brix 组件定义规范**（BCD，Brix Component Definition）定义了组件的基本使用方式、公共方法和公共事件。
    
    **Brix Loader** 是组件加载器，负责管理 Brix Component 的整个生命周期，包括加载、初始化、渲染和销毁。
    
    所有支持 BCD 组件定义规范的组件，都可以被 Brix Loader 加载和管理。
    
    ## 使用方式

    使用 Brix Component 的书写格式如下：

    ```html
    <tag bx-name="moduleId" bx-options="{}" bx-type=""></tag>
    ```

    ### bx-name

    必选。

    `bx-name` 是组件模块标识符。Brix Loader 根据 `bx-name` 的值来加载组件。

    ### bx-options

    可选。

    `bx-options` 指定了组件初始化时所需的配置项。

    ### bx-type

    可选。

    `bx-type` 用于配置事件监听函数。其中，`type` 是事件类型，例如 `bx-click`、`bx-change`。

    ## 公开方法

    详见方法注释。
    
    ### Loader.boot( [ context ] [, callback ]  [, progress ] )
    ### Loader.destroy( component [, callback ] )
    ### Loader.query( moduleId [, context ] )

    ## 公共事件

    ### ready

    当前组件完全渲染完成后触发，包括子组件的渲染。

    ### destroyed

    当前组件销毁后触发，包括子组件的销毁。

    ## 组件

    *建议*组件实现以下方法：

    * .init()
        
        可选。

        组件初始化方法。如果存在，会由 Brix Loader 自动调用。

    * .render()

        必选。

        组件渲染方法。会由 Brix Loader 自动调用。

    * .destroy()

        可选。

        组件销毁方法。如果存在，会由 Brix Loader 自动调用。

    * .on( types, selector, data, fn )

        可选。

        在当前组件（关联的元素）上，为一个或多个事件类型绑定一个事件监听函数。

    * .off( types, selector, fn )

        可选。

        在当前组件（关联的元素）上，移除绑定的一个或多个类型的监听函数。

    * .trigger( type, data )

        可选。

        在当前组件（关联的元素）上，执行所有绑定的事件监听函数和默认行为，并模拟冒泡过程。

    * .triggerHandler( type, data )

        可选。

        在当前组件（关联的元素）上，执行所有绑定的事件监听函数， 但不模拟冒泡过程，也不触发默认行为。

    ===

    # Why Brix?

    像使用原生元素一样使用组件。

    备忘
        组件的组成
            从用户角度：方法、属性、事件
            从实现角度：数据、模板（展现 HTML）、行为（JavaScript（事件））、样式（CSS）
        历史
            http://etaoux.github.io/brix/
            https://github.com/etaoux/brix/issues
            http://etaoux.github.io/brix/duck/#!/api/Brix.Gallery.Dropdown
        规范
            http://gitlab.alibaba-inc.com/limu/brix-central/wikis/BCD
*/
define(
    'brix/loader',[
        './loader/constant',
        './loader/options',
        './loader/util'
    ],
    function(
        Constant,
        Options,
        Util
    ) {

        var CACHE = {}
        var DEBUG = ~location.search.indexOf('debug')

        /*
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

            私有方法：

            * **Loader.boot( component, complete, notify )**
                * Loader.boot( component )
                * Loader.boot( component, complete )
                * Loader.boot( component, complete, notify )
            * **Loader.boot( array{component}, complete, notify )**
                * Loader.boot( array )
                * Loader.boot( array, complete )
                * Loader.boot( array, complete, notify )

            简：初始化所有组件。
        */
        function boot(context, complete, extraOptions /* Internal Use Only */ , notify) {
            // boot( component )                    context.element
            // boot( element )                      element
            // boot( array{element|component} )     array
            context = context.element || context

            // 初始化任务队列
            var queue = Util.queue()
            var completeArgs = []

            // 1. 查找组件节点 [bx-name]
            var elements = function() {
                // element or [ element|component ]
                var contextArray = context.nodeType ? [context] : context
                var elements = []
                Util.each(contextArray, function(item /*, index*/ ) {
                    // component or element
                    item = item.element || item
                    if (item.nodeType === 1 && item.getAttribute(Constant.ATTRS.id)) elements.push(item)
                    var descendants = item.getElementsByTagName('*')
                    Util.each(descendants, function(descendant /*, index*/ ) {
                        if (/pre|code/i.test(descendant.parentNode.nodeName)) return
                        if (descendant.nodeType !== 1) return
                        if (descendant.getAttribute(Constant.ATTRS.id)) elements.push(descendant)
                    })
                })
                return elements
            }()

            // 2. 顺序把初始化任务放入队列
            Util.each(elements, function(element, index) {
                queue
                    .queue(function(next) {
                        init(element, function(error, instance) {
                            completeArgs.push([error, instance, index, elements.length])
                            if (error) console.error(error.stack)
                            if (notify) notify(error, instance, index, elements.length)
                            next()
                        }, extraOptions)
                    })
            })

            // 3. 逐个出队，执行初始化任务
            // 4. 全部任务执行完成（无论成败）
            queue
                .queue(function() {
                    if (complete) complete(completeArgs)
                })
                .dequeue() // 开始出队执行

        }

        /*
            init(element)

            * init(element [, callback( error, instance )])

            初始化元素 element 关联的组件。
            简：初始化单个组件。
        */
        function init(element, callback, extraOptions /* Internal Use Only */ ) {
            // 初始化任务队列
            var queue = Util.queue()

            // 如果已经被初始化，则立即返回
            var clientId = element.clientId
            if (clientId !== undefined) {
                if (callback) callback(undefined, CACHE[clientId])
                return
            }

            // 如果没有模块标识符，则不需要初始化
            if (!element.getAttribute(Constant.ATTRS.id)) {
                if (callback) callback(undefined, undefined)
                return
            }

            // 1. 解析配置项
            var options = Options.parse(element)
            if (extraOptions) Util.extend(options, extraOptions)

            var BrixImpl, instance

            var label = 'module ' + options.moduleId + ' ' + options.clientId
            if (DEBUG) {
                console.group(label)
                console.time(label)
                var _callback = callback
                callback = function(error, instance) {
                    console.timeEnd(label)
                    console.groupEnd(label)
                    if (_callback) _callback(error, instance)
                }
            }

            queue
                .queue(function(next) {
                    // 2. 加载组件模块
                    /* jshint unused:false */
                    require([options.moduleId], function(module) {
                        BrixImpl = module
                        next()
                    }, function(error) {
                        // http://requirejs.org/docs/api.html#errbacks
                        if (callback) callback(error, instance)
                        else console.error(error)
                    })
                })
                .queue(function(next) {
                    try {
                        // 3. 创建组件实例
                        instance = new BrixImpl(options)
                            // 设置属性 options
                        instance.options = Util.extend({}, instance.options, options)
                            // 设置其他公共属性
                        Util.extend(instance, Util.pick(options, Constant.OPTIONS))
                        next()
                    } catch (error) {
                        if (callback) callback(error, instance)
                        else console.error(error)
                    }
                })
                .queue(function(next) {
                    // 拦截销毁方法
                    instance._destroy = instance.destroy
                    instance.destroy = function() {
                        destroy(instance)
                    }
                    next()
                })
                .queue(function(next) {
                    // 缓存起来，关联父组件
                    cache(instance)
                    next()
                })
                .queue(function(next) {
                    // 4. 执行初始化
                    if (!instance.init) {
                        next()
                        return
                    }

                    try {
                        var result = instance.init()
                        if (DEBUG) console.log(label, 'call  init')

                        // 如果返回了 Promise，则依赖 Promise 的状态
                        if (result && result.then) {
                            result.then(function() {
                                next()
                            }, function(error) {
                                throw error
                            })
                        } else {
                            next()
                        }
                    } catch (error) {
                        if (callback) callback(error, instance)
                        else console.error(error)
                    }
                })
                .queue(function(next) {
                    // 拦截渲染方法
                    if (instance._render) {
                        next()
                        return
                    }

                    instance._render = instance.render
                    instance.render = function() {
                        var deferred = Util.defer()
                        var promise = deferred.promise

                        // 如果存在已经被渲染的子组件，则先销毁
                        var hasRenderedChildren
                        if (instance.childClientIds.length) {
                            hasRenderedChildren = true
                            Util.each(instance.childClientIds, function(childClientId) {
                                if (CACHE[childClientId]) destroy(childClientId)
                            })
                        }
                        // 调用组件的 .render()
                        var result = instance._render.apply(instance, arguments)

                        // 如果返回了 Promise，则依赖 Promise 的状态
                        if (result && result.then) {
                            result.then(function() {
                                renderChildren()
                                syncClientId()
                            }, function(error) {
                                throw error
                            })
                        } else {
                            renderChildren()
                            syncClientId()
                        }

                        return promise

                        // 再次初始化子组件
                        function renderChildren() {
                            if (hasRenderedChildren) {
                                boot(instance.element, function( /* context */ ) {
                                    deferred.resolve()
                                })
                            } else {
                                deferred.resolve()
                            }
                        }

                        // 同步 clientId
                        function syncClientId() {
                            var relatedElement = instance.relatedElement
                            if (relatedElement) {
                                // element
                                if (relatedElement.nodeType && (relatedElement.clientId === undefined)) {
                                    relatedElement.clientId = options.clientId
                                } else if (relatedElement.length) {
                                    // [ element ]
                                    Util.each(relatedElement, function(item /*, index*/ ) {
                                        if (item.nodeType && (item.clientId === undefined)) {
                                            item.clientId = options.clientId
                                        }
                                    })
                                }
                            }
                        }

                    }
                    next()
                })
                .queue(function(next) {
                    // 5. 执行渲染（不存在怎么办？必须有！）
                    try {
                        var result = instance.render(function(error /*, instance*/ ) {
                            if (error) {}
                        })
                        if (DEBUG) console.log(label, 'call  render')

                        // deferred
                        if (result && result.then) {
                            result.then(function() {
                                next()
                            }, function(error) {
                                if (callback) callback(error, instance)
                                else console.error(error)
                            })
                        } else {
                            next()
                        }
                    } catch (error) {
                        // TODO 渲染时发生错误的组件是否应该自动销毁？
                        if (callback) callback(error, instance)
                        else console.error(error)
                    }
                })
                .queue(function(next) {
                    // 绑定测试事件
                    Util.each(Constant.EVENTS, function(type) {
                        if (instance.on) {
                            instance.on(type + Constant.LOADER_NAMESPACE, function(event) {
                                if (DEBUG) console.log(label, 'event', event.type)
                            })
                        }
                    })
                    next()
                        // .delay(100) // 每个组件之间的渲染间隔 100ms，方便观察
                })
                .queue(function(next) {
                    next()
                    return

                    // 暂停支持
                    // 6. 绑定事件
                    // 从初始的关联元素上解析事件配置项 bx-type，然后逐个绑定到最终的关联元素上。
                    // 以 Dropdown 为例，初试的关联元素是 <select>，最终的关联元素却是 <div class="dropdown">
                    // 这是用户关注的事件。
                    if (instance.on && options.events) {
                        Util.each(options.events, function(item /*, index*/ ) {
                            // item: { target type handler fn params }
                            instance.on(item.type + Constant.LOADER_NAMESPACE, function(event, extraParameters) {
                                if (item.fn in instance) {
                                    instance[item.fn].apply(
                                        instance, (extraParameters ? [extraParameters] : [event]).concat(item.params)
                                    )
                                } else {
                                    /* jshint evil:true */
                                    eval(item.handler)
                                }
                            })
                        })
                    }
                    // 从最终的关联元素上解析事件配置项 bx-type，然后逐个绑定。
                    if (instance.delegateBxTypeEvents) {
                        if (instance.element) {
                            instance.undelegateBxTypeEvents(instance.element)
                            instance.delegateBxTypeEvents(instance.element)
                        }
                        if (instance.relatedElement) {
                            instance.undelegateBxTypeEvents(instance.relatedElement)
                            instance.delegateBxTypeEvents(instance.relatedElement)
                        }
                    }
                    next()
                })
                .queue(function(next) {
                    // 检测是否有后代组件
                    var descendants = element.getElementsByTagName('*')
                    var hasBrixElement = false
                    Util.each(descendants, function(descendant /*, index*/ ) {
                        if (descendant.nodeType !== 1) return
                        if (!hasBrixElement &&
                            descendant.getAttribute(Constant.ATTRS.id)) {
                            hasBrixElement = true
                        }
                    })

                    // 7. 如果有后代组件，则递归加载
                    if (hasBrixElement) {
                        boot(instance, function() {
                            next()
                        })
                    } else {
                        // 如果没有后代组件，那么此时当前组件已经就绪。
                        next()
                    }
                })
                .queue(function( /*next*/ ) {
                    // 8. 当前组件和后代组件的渲染都完成后，触发 ready 事件
                    if (instance.triggerHandler) {
                        instance.triggerHandler(Constant.EVENTS.ready)
                    }
                    if (callback) callback(undefined, instance)
                })
                .dequeue() // 开始出队执行

        }

        /*
            #### Loader.destroy( component [, complete() ] )

            销毁某个组件，包括它的后代组件。

            * **Loader.destroy( component, complete )**
                * Loader.destroy( component )
                * Loader.destroy( component, complete )
            * **Loader.destroy( element, complete )**
                * Loader.destroy( element )
                * Loader.destroy( element, complete )
            * **Loader.destroy( array{element|component}, complete )**
                * Loader.destroy( array{component} )
                * Loader.destroy( array{element} )
                * Loader.destroy( array{component}, complete )
                * Loader.destroy( array{element}, complete )
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
            
            私有方法：
            
            * ~~**Loader.destroy()**~~
            * Loader.destroy( clientId )
            * Loader.destroy( clientId, complete )
            
        */
        function destroy(instance, complete) {
            // ~~Loader.destroy()~~
            if (instance === undefined) {
                if (complete) complete()
                return this
            }

            // destroy( moduleId, context, complete )
            if (Util.isString(instance)) {
                switch (arguments.length) {
                    case 1:
                        // destroy( moduleId )
                        instance = query(instance)
                        break
                    case 2:
                        // destroy( moduleId, complete )
                        if (Util.isFunction(complete)) {
                            instance = query(instance)
                        } else {
                            // destroy( moduleId, context )
                            instance = query(instance, complete)
                            complete = undefined
                        }
                        break
                    case 3:
                        // destroy( moduleId, context, complete )
                        instance = query(instance, complete)
                        complete = arguments[2]
                        break
                }
            }

            // destroy( !component )
            // destroy( !clientId )
            // destroy( !element )
            // destroy( !array )
            if (
                (instance.clientId === undefined) &&
                !Util.isNumber(instance) &&
                !instance.nodeType &&
                !instance.length
            ) {
                if (complete) complete()
                return this
            }

            // destroy( clientId )
            if (Util.isNumber(instance)) {
                instance = CACHE[instance]
                if (!instance) {
                    if (complete) complete()
                    return this
                }
            }

            // destroy( array )
            if (!instance.nodeType && instance.length) {
                Util.each(instance, function(item) {
                    destroy(item)
                })
                if (complete) complete()
                return this
            }

            // destroy( element )
            if (instance.nodeType === 1) {
                // destroy( context )
                if (instance.clientId === undefined) {
                    var descendants = instance.getElementsByTagName('*')
                        // 倒序遍历，以避免某个元素被移除后，漏掉相邻的元素
                    for (var i = descendants.length - 1, descendant; i >= 0; i--) {
                        descendant = descendants[i]
                        if (!descendant) return
                        if (descendant.nodeType !== 1) return
                        if (descendant.getAttribute(Constant.ATTRS.id)) destroy(descendant)
                    }
                    if (complete) complete()
                    return this
                } else {
                    // destroy( element )
                    instance = CACHE[
                        instance.clientId
                    ]
                }
            }

            // 如果已经被移除，则立即返回
            if (!instance) {
                if (complete) complete()
                return this
            }

            var label = 'module ' + instance.moduleId + ' ' + instance.clientId
            if (DEBUG) {
                console.group(label)
                console.time(label)
                var _complete = complete
                complete = function(error, instance) {
                    console.timeEnd(label)
                    console.groupEnd(label)
                    if (_complete) _complete(error, instance)
                }
            }

            // 先递归销毁后代组件
            if (instance.childClientIds.length) {
                Util.each(instance.childClientIds, function(clientId) {
                    destroy(clientId)
                })
            }

            // 调用自定义销毁行为
            if (instance._destroy) {
                try {
                    /*if (instance.delegateBxTypeEvents) {
                        if (instance.element) {
                            instance.undelegateBxTypeEvents(instance.element)
                        }
                        if (instance.relatedElement) {
                            instance.undelegateBxTypeEvents(instance.relatedElement)
                        }
                    }*/
                    instance._destroy()
                } catch (error) {
                    if (complete) complete(error)
                    else console.error(error)
                }

            }

            // 从缓存中移除
            delete CACHE[instance.clientId]

            // 取消与父组件的关联
            var parent = CACHE[instance.parentClientId]
            if (parent) {
                parent.childClientIds = Util.without(parent.childClientIds, instance.clientId)
            }

            // 触发 destroy 事件
            // 在移除关联的节点后，无法再继续利用浏览器事件模型来传播和触发事件，所以在移除前先触发 destroy 事件。
            if (instance.triggerHandler) instance.triggerHandler(Constant.EVENTS.destroy)

            // 在当前组件关联的元素上，移除所有由 Loader 绑定的事件监听函数。
            if (instance.off) {
                Util.each(instance.options.events, function(item /*, index*/ ) {
                    instance.off(item.type + Constant.LOADER_NAMESPACE)
                })
            }
            // 从 DOM 树中移除当前组件关联的元素。
            if (instance.element.parentNode) {
                instance.element.parentNode.removeChild(instance.element)
            }

            if (DEBUG) console.log(label, 'destroy')

            if (complete) complete()

            return this
        }

        // 缓存组件
        function cache(instance) {
            // 放入缓存
            CACHE[instance.clientId] = instance

            // 关联父组件
            var parent = CACHE[instance.parentClientId]
            if (parent) parent.childClientIds.push(instance.clientId)
        }

        /*
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
         */
        function query(moduleId, context) {
            var results = []
            var methods = []

            // 1. 根据 element 查找组件实例
            // query( element )
            if (moduleId.nodeType) {
                results.push(
                    CACHE[
                        moduleId.clientId
                    ]
                )

            } else if (moduleId.length && !Util.isString(moduleId)) {
                // 1. 根据 elementArray 逐个查找组件实例
                // query( elementArray )
                Util.each(moduleId, function(element /*, index*/ ) {
                    results.push(
                        CACHE[
                            element.clientId
                        ]
                    )
                })
            } else {
                // 1. 根据 moduleId 查找组件实例
                // query( moduleId )
                Util.each(CACHE, function(instance /*, index*/ ) {
                    // 从右向左查找，免去了去重步骤
                    if (instance.moduleId === moduleId) {
                        // 是否在 context 内
                        if (context === undefined || parents(instance, context).length) {
                            results.push(instance)
                                // 收集组件方法
                            Util.each(instance.constructor.prototype, function(value, name) {
                                if (Util.isFunction(value) && (name[0] !== '_')) methods.push(name)
                            })
                        }
                    }
                })
            }

            // 2. 绑定组件方法至 query() 返回的对象上
            Util.each(Util.unique(methods), function(name /*, index*/ ) {
                results[name] = function() {
                    var that = this
                    var args = [].slice.call(arguments)
                    var result
                    Util.each(this, function(instance /*, index*/ ) {
                        if (!instance[name]) return
                        result = instance[name].apply(instance, args)
                        if (result !== undefined) that[index] = result
                    })
                    return this
                }
            })

            return results
        }

        /*
            查找父组件
            context
                moduleId  
                component options render
                element   nodeType
                array
         */
        function parents(instance, context) {
            var results = []
            var parent
            if (context === undefined) return results

            // parents(instance, array)
            if (!Util.isString(context) && !context.nodeType && context.length) {
                Util.each(context, function(item /*, index*/ ) {
                    results = results.concat(parents(instance, item))
                })
                return results
            }

            // 从当前组件 instance 开始，逐层向上遍历

            // parents(instance, component)
            if (context.options && context.render) {
                parent = instance

                // 在 instance 的祖先元素中，查找与 context.clientId 匹配的元素
                while ((parent = CACHE[parent.parentClientId])) {
                    if (parent.clientId === context.clientId) {
                        results.push(parent)
                        break
                    }
                }

            } else if (context.nodeType) {
                // parents(instance, element)
                parent = instance.element

                // 在 instance 的祖先元素中，查找与 context 相等的元素
                while ((parent = parent.parentNode)) {
                    if (parent === context) {
                        results.push(parent)
                        break
                    }
                }

            } else {
                // parents(instance, moduleId)    
                parent = instance

                // 在 instance 的祖先元素中，查找与 context 匹配的元素
                while ((parent = CACHE[parent.parentClientId])) {
                    if (parent.moduleId === context) {
                        results.push(parent)
                    }
                }
            }

            return results
        }

        /*
            
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

            #### Examples
            
            ```js
            var target = $('<div>').insertBefore(document.body.firstChild)
            Loader.load(target, 'components/hello', {message: 'load' })
            Loader.unload(target)
            ```
         */
        function load(element, moduleId, options, complete) {
            // load(element, moduleId, options, complete)
            if (element.nodeType) element = [element]

            // Loader.load( element, moduleId, complete )
            if (Util.isFunction(options)) {
                complete = options
                options = undefined
            }

            // 如果 element 上设置了 bx-name，则先移除掉
            // 因为在 load() 模式下，element 仅仅当做容器元素使用，否则会和 boot() 模式冲突。
            // Util.each(element, function(item, index) {
            //     if (item.getAttribute(Constant.ATTRS.id)) {
            //         delete item.clientId
            //         item.removeAttribute(Constant.ATTRS.id)
            //     }
            // })

            // 1. 销毁已有组件
            destroy(element)

            // load(elementArray, moduleId, options, complete)
            Util.each(element, function(item /*, index*/ ) {
                // item.setAttribute(Constant.ATTRS.id, moduleId)
                // 2. 为组件 moduleId 新建一个容器元素
                item.innerHTML = '<div bx-name="' + moduleId + '"></div>'
            })

            // 3. 初始化组件 moduleId
            boot(element, complete, options)
            return this
        }

        /*
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
         */
        function unload(element, callback) {
            destroy(element, callback)
            return this
        }

        /*
            CACHE {
                uuid: {
                    clientId: uuid
                    parentClientId: uuid,
                    instance: brix
                }
            }
            return {
                name: root,
                children: [
                    {
                        name: moduleId + ',' + clientId,
                        children: [
                            {
                                name
                                children
                            }
                        ]
                    }
                ]
            }
        */
        function tree() {
            var result = {
                name: 'root',
                children: []
            }

            function _parseChildren(parentClientId, children) {
                Util.each(CACHE, function(item) {
                    if (item.parentClientId === parentClientId) {
                        children.push({
                            name: item.moduleId + ',' + item.clientId,
                            module: item,
                            children: _parseChildren(item.clientId, [])
                        })
                    }
                })
                return children
            }

            _parseChildren(Constant.ROOT_CLIENT_ID, result.children)

            return result
        }

        var tasks = Util.queue()
        var booting = false
        var Loader = {
            CACHE: CACHE,
            boot: function(context, callback, progress) {
                // boot( callback, progress )
                if (Util.isFunction(context)) {
                    progress = callback
                    callback = context
                    context = document.body
                } else {
                    // boot( component )
                    // boot( element )
                    // boot()
                    context = context ? context.element || context : document.body
                }

                tasks.queue(function(next) {
                    booting = true
                    boot(context, function(records) {
                        booting = false
                        if (callback) callback(records)
                        next()
                    }, null, progress)
                })
                if (!booting) tasks.dequeue()
                return this
            },
            destroy: destroy,
            query: query,
            tree: tree,

            load: function(element, moduleId, options, complete) {
                // load( element, moduleId, complete )
                if (Util.isFunction(options)) {
                    complete = options
                    options = undefined
                }

                tasks.queue(function(next) {
                    booting = true
                    load(element, moduleId, options, function(records) {
                        booting = false
                        if (complete) complete(records)
                        next()
                    })
                })
                if (!booting) tasks.dequeue()
                return this
            },
            unload: unload,

            Util: Util,
            Constant: Constant,
            Options: Options
        }

        return Loader
    }
);