
/* global define */
define('constant',[],function() {
    var VERSION = '0.0.1'
    var EXPANDO = (Math.random() + '').replace(/\D/g, '')
    return {
        VERSION: VERSION,
        // Loader
        ROOT_CLIENT_ID: -1,
        ATTRS: {
            id: 'bx-id',
            cid: 'bx-cid',
            options: 'bx-options'
        },
        SELECTORS: {
            id: '[bx-id]',
            cid: '[bx-cid]',
            options: '[bx-options]'
        },
        EVENTS: {
            ready: 'ready',
            destroy: 'destroy'
        },
        OPTIONS: [
            'element', // 组件关联的节点
            'moduleId', // 组件的模块标识符
            'clientId', // 组件实例的标识符
            'parentClientId', // 父组件实例的标识符
            'childClientIds', // 父组件实例的标识符数组
            'data', // 组件关联的数据
            'template' // 组件关联的 HTML 模板
        ],
        EXPANDO: 'Brix' + VERSION + EXPANDO,
        UUID: 0,
        // Event
        RE_EVENT: /bx\-(?!id|cid|options)(.+)/,
        FN_ARGS: /([^()]+)(?:\((.*?)\))?/,
        LOADER_NAMESPACE: '._loader',
        COMPONENT_NAMESPACE: '._component',
        PREFIX: 'bx-'
    }
});
/* global define        */
/* global setTimeout    */

/*
    Brix Loader Utility Functions
    
    http://underscorejs.org/
*/
define('util',[],function() {

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

    return _
});
/* global define  */

define(
    'option',[
        'constant',
        'util'
    ],
    function(
        Constant,
        Util
    ) {
        /*
            解析配置项 bx-options
        */
        function parseOptions(element) {
            var options
            var parent, moduleId, clientId, parentClientId


            // 如果没有模块标识符，则无需（也无法）加载，立即返回
            moduleId = element.getAttribute(Constant.ATTRS.id)
            if (!moduleId) return

            // 为组件关联的 DOM 节点分配唯一标识
            clientId = Constant.UUID++
            if (!element.getAttribute(Constant.ATTRS.cid)) element.setAttribute(Constant.ATTRS.cid, clientId)

            // 查找父节点
            parent = element
            do {
                parent = parent.parentNode
            } while (
                parent &&
                (parent.nodeType !== 9) && // Document 9
                (parent.nodeType !== 11) && // DocumentFragment 11
                !parent.getAttribute(Constant.ATTRS.cid)
            )
            if (parent && parent.nodeType === 1) parentClientId = +parent.getAttribute(Constant.ATTRS.cid)
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
            options.events = parseBxEvents(element)

            return options
        }

        function parseBxEvents(element, deep) {
            if (!element.nodeType && element.length) element = element[0]
            var elements = deep ? element.getElementsByTagName('*') : [element]
            var events = []
            Util.each(elements, function(element) {
                Util.each(element.attributes, function(attribute) {
                    var ma = Constant.RE_EVENT.exec(attribute.name)
                    if (ma) {
                        var item = {
                            target: element,
                            type: ma[1],
                            handler: attribute.value
                        }
                        Util.extend(item, parseFnAndParams(attribute.value))
                        events.push(item)
                    }
                })
            })
            return events
        }

        function parsetBxTypes(element, deep) {
            return Util.unique(
                Util.map(parseBxEvents(element, deep), function(item) {
                    return item.type
                })
            )
        }

        function parseFnAndParams(handler) {
            var parts = Constant.FN_ARGS.exec(handler)
            var fn
            var params
            if (parts && parts[1]) {
                fn = parts[1]
                params = parts[2] || ''
                try {
                    // 1. 尝试保持参数的类型 
                    /* jshint -W061 */
                    params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
                } catch (error) {
                    // 2. 如果失败，只能解析为字符串
                    params = parts[2].split(/,\s*/)
                }
                return {
                    fn: fn,
                    params: params
                }
            }
            return {}
        }

        return {
            parseOptions: parseOptions,
            parseBxEvents: parseBxEvents,
            parsetBxTypes: parsetBxTypes,
            parseFnAndParams: parseFnAndParams
        }

    });
/* global define        */
/* global require       */
/* global document      */
/* global console       */
/*
    ## Brix Loader
    
    组件加载器，负责管理 Brix Component 的整个生命周期，包括加载、初始化、渲染、销毁。


    解析组件配置、解析组件树、加载组件
    初始化组件、缓存组件、初始化事件
    
    方法、属性、事件
    数据、模板（展现 HTML）、行为（JavaScript（事件））、样式（CSS）

    Q.js
        https://github.com/kriskowal/q
        http://documentup.com/kriskowal/q/#getting-started
        https://github.com/kriskowal/q/wiki/API-Reference#qdefer
        https://github.com/bellbind/using-promise-q/

    http://gitlab.alibaba-inc.com/river/spec/blob/master/JSON-Schema.md
    http://gitlab.alibaba-inc.com/limu/brix-central/wikis/BCD
    
    http://etaoux.github.io/brix/
    https://github.com/etaoux/brix/issues
    http://etaoux.github.io/brix/duck/#!/api/Brix.Gallery.Dropdown
*/
define(
    'loader',[
        'constant',
        'option',
        'util'
    ],
    function(
        Constant,
        Options,
        Util
    ) {

        var CACHE = {}

        /*
            boot( context, callback )
            
            * boot()
            * boot(brixImpl)
            * boot(element)

            初始化节点 context 以及节点 context 内的所有组件。
            简：初始化所有组件。
        */
        function boot(context, callback) {
            // console.log('function', arguments.callee.name, context && context.element)
            context = context && context.element || context || document

            var deferred = Util.defer()
            var queue = Util.queue()

            // 1. 查找组件节点 [bx-id]
            var elements = function() {
                var elements = []
                if (context.nodeType === 1 && context.getAttribute(Constant.ATTRS.id)) elements.push(context)
                var descendants = context.getElementsByTagName('*')
                Util.each(descendants, function(descendant /*, index*/ ) {
                    if (descendant.nodeType !== 1) return
                    if (descendant.getAttribute(Constant.ATTRS.id)) elements.push(descendant)
                })
                return elements
            }()

            // 2. 顺序把初始化任务放入队列
            Util.each(elements, function(element /*, index*/ ) {
                queue
                    .queue(function(next) {
                        init(element)
                            .then(undefined, function(reason) {
                                console.error(reason.stack)
                            }).finally(function() {
                                next()
                            })
                    })
            })

            // 3. 逐个出队，执行初始化任务
            // 4. 全部任务执行完成（无论成败）
            queue
                .queue(function() {
                    deferred.resolve(context)
                    if (callback) callback(context)
                })
                .dequeue() // 开始

            return deferred.promise
        }

        /*
            init(element)

            * init(element [, callback( error, instance )])

            初始化元素 element 关联的组件。
            简：初始化单个组件。
        */
        function init(element, callback) {
            // console.log('function', arguments.callee.name, element)

            var deferred = Util.defer()
            var promise = deferred.promise
            var queue = Util.queue()

            // 如果已经被初始化，则立即返回
            var clientId = element.getAttribute(Constant.ATTRS.cid)
            if (clientId) {
                deferred.resolve(CACHE[clientId])
                if (callback) callback(undefined, CACHE[clientId])
                return promise
            }

            // 1. 解析配置项
            var options = Options.parseOptions(element)
            var BrixImpl, instance

            var label = 'module ' + options.moduleId + ' ' + options.clientId
            console.group(label)
            console.time(label)
            promise.finally(function() {
                console.timeEnd(label)
                console.groupEnd(label)
            })

            queue
                .queue(function(next) {
                    // 2. 加载组件模块
                    load(options.moduleId)
                        .then(function(impl) {
                            BrixImpl = impl
                            next()
                        })
                })
                .queue(function(next) {
                    try {
                        // 3. 创建组件实例
                        instance = new BrixImpl(options)
                        // 设置属性 options
                        instance.options = instance.options || {} // 转换为实例属性
                        Util.extend(instance.options, options)
                        // 设置其他公共属性
                        Util.extend(instance, Util.pick(options, Constant.OPTIONS))
                        next()
                    } catch (error) {
                        deferred.reject(error)
                        if (callback) callback(error, instance)
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
                    if (instance.init) instance.init()
                    console.log(label, 'init')
                    next()
                })
                .queue(function(next) {
                    // 拦截渲染方法
                    if (!instance._render) {
                        instance._render = instance.render
                        instance.render = function() {
                            // 如果存在已经被渲染的子组件，则先销毁
                            var hasRenderedChildren
                            if (instance.childClientIds.length) {
                                hasRenderedChildren = true
                                Util.each(instance.childClientIds, function(childClientId) {
                                    if (CACHE[childClientId]) destroy(childClientId)
                                })
                            }
                            // 调用组件的 .render()
                            instance._render.apply(this, arguments)
                            // 再次渲染子组件
                            if (hasRenderedChildren) {
                                boot(instance.element)
                            }
                            // 同步 clientId
                            var newElement = instance.element
                            if (newElement.nodeType && !newElement.getAttribute(Constant.ATTRS.cid)) {
                                newElement.setAttribute(Constant.ATTRS.cid, options.clientId)
                            } else if (newElement.length) {
                                Util.each(newElement, function(item /*, index*/ ) {
                                    if (item.nodeType && !item.getAttribute(Constant.ATTRS.cid)) {
                                        item.setAttribute(Constant.ATTRS.cid, options.clientId)
                                    }
                                })
                            }
                        }
                    }
                    // 5. 执行渲染（不存在怎么办？必须有！）
                    try {
                        instance.render(function(error, instance) {
                            // 异步待处理 TODO
                            if (error) {
                                deferred.reject(error)
                                if (callback) callback(error, instance)
                            }
                            // next()
                        })
                    } catch (error) {
                        deferred.reject(error)
                        if (callback) callback(error, instance)
                    }
                    console.log(label, 'render')
                    next()
                })
                .queue(function(next) {
                    // 绑定测试事件
                    Util.each(Constant.EVENTS, function(type) {
                        if (instance.on) {
                            instance.on(type + Constant.LOADER_NAMESPACE, function(event) {
                                console.log(label, event.type)
                            })
                        }
                    })
                    next()
                    // .delay(100, queueName) // 每个组件之间的渲染间隔 100ms，方便观察
                })
                .queue(function(next) {
                    // 6. 绑定事件
                    // 从初始的关联元素上解析事件配置项 bx-type，然后逐个绑定到最终的关联元素上。
                    // 以 Dropdown 为例，初试的关联元素是 <select>，最终的关联元素却是 <div class="dropdown">
                    // 这是用户关注的事件。
                    if (instance.on) {
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
                    // if (instance.delegateBxTypeEvents) instance.delegateBxTypeEvents()
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
                        boot(instance).then(function() {
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
                    deferred.resolve(instance)
                    if (callback) callback(undefined, instance)
                })
                .dequeue()

            return promise
        }

        /*
            ## destroy(instance)
            
            * destroy(Query)
            * destroy(brix)
            * destroy(element)
            * destroy(clientId)

            销毁某个组件，包括它的后代组件。
        */
        function destroy(instance) {
            if (!instance) return this

            // destroy(clientId)
            if (Util.isNumber(instance)) instance = CACHE[instance]

            // destroy( Loader.Query() )
            if (instance.isQuery) {
                Util.each(instance.toArray(), function(element) {
                    destroy(element)
                })
                return
            }

            // destroy(element)
            if (instance.nodeType === 1) {
                instance = CACHE[
                    instance.getAttribute(Constant.ATTRS.cid)
                ]
            }

            // 如果已经被移除，则立即返回
            if (!instance) return this

            // 先递归销毁后代组件
            if (instance.childClientIds.length) {
                Util.each(instance.childClientIds, function(clientId) {
                    destroy(clientId)
                })
            }

            // 调用自定义销毁行为
            if (instance._destroy) instance._destroy()

            // 从缓存中移除
            delete CACHE[instance.clientId]

            // 取消与父组件的关联
            var parent = CACHE[instance.parentClientId]
            if (parent) {
                parent.childClientIds = Util.without(parent.childClientIds, instance.clientId)
            }

            // 触发 destroy 事件
            // 在移除关联的节点后，无法再继续利用浏览器事件模型来传播和触发事件，所以在移除前先触发 destroy 事件。
            instance.triggerHandler(Constant.EVENTS.destroy)

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

            console.log('module', instance.moduleId, instance.clientId, 'destroy')

            return this
        }

        // 加载模块
        /*
            load(moduleId [, callback( error, BrixImpl )])
        */
        function load(moduleId, callback) {
            // console.log('function', arguments.callee.name, moduleId)
            var deferred = Util.defer()
            var promise = deferred.promise
            require([moduleId], function(BrixImpl) {
                // setTimeout(function() {
                deferred.resolve(BrixImpl)
                if (callback) callback(undefined, BrixImpl)
                    // }, 0)
            })
            promise.then(undefined, console.error)
            return promise
        }

        // 缓存组件
        function cache(instance) {
            // 缓存起来
            CACHE[instance.clientId] = instance
            // 关联父组件
            var parent = CACHE[instance.parentClientId]
            if (parent) parent.childClientIds.push(instance.clientId)
        }

        /*
            * query(element)
            * query(moduleId)

            根据模块标识符 moduleId 查找组件实例。
            该方法的返回值是一个数组，包含了一组 Brix 组件实例，并且，数组上含有所有 Brix 组件实例的方法。
         */
        function query(moduleId) {
            var results = []
            var methods = []

            // 1. 根据 element 查找组件实例
            // query(element)
            if (moduleId.nodeType) {
                results.push(
                    CACHE[
                        moduleId.getAttribute(Constant.ATTRS.cid)
                    ]
                )
            }

            // 1. 根据 moduleId 查找组件实例
            // query(moduleId)
            if (Util.isNumber(moduleId)) {
                Util.each(CACHE, function(instance /*, index*/ ) {
                    if (instance.moduleId === moduleId) {
                        results.push(instance)
                        // 收集组件方法
                        Util.each(instance.constructor.prototype, function(value, name) {
                            if (Util.isFunction(value)) methods.push(name)
                        })
                    }
                })
            }


            // 2. 绑定组件方法至 query() 返回的对象上
            Util.each(Util.unique(methods), function(name /*, index*/ ) {
                results[name] = function() {
                    var args = [].slice.call(arguments)
                    Util.each(this, function(instance) {
                        if (!instance[name]) return
                        instance[name].apply(instance, args)
                    })
                }
            })

            return results
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

        return {
            CACHE: CACHE,
            boot: boot,
            init: init,
            destroy: destroy,
            query: query,
            tree: tree,

            Util: Util,
            Constant: Constant,
            Options: Options
        }
    }
);