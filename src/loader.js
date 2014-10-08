/* global define, require, document, console  */
/*
    
    # BCD
    
    **Brix 组件定义规范**（BCD，Brix Component Definition）定义了组件的基本使用方式、公共方法和公共事件。
    
    **Brix Loader** 是组件加载器，负责管理 Brix Component 的整个生命周期，包括加载、初始化、渲染和销毁。
    
    所有支持 BCD 组件定义规范的组件，都可以被 Brix Loader 加载和管理。
    
    ## 使用方式

    使用 Brix Component 的书写格式如下：

    ```html
    <tag bx-id="moduleId" bx-options="{}" bx-type=""></tag>
    ```

    ### bx-id

    必选。

    `bx-id` 是组件模块标识符。Brix Loader 根据 `bx-id` 的值来加载组件。

    ### bx-options

    可选。

    `bx-options` 指定了组件初始化时所需的配置项。

    ### bx-type

    可选。

    `bx-type` 用于配置事件监听函数。其中，`type` 是事件类型，例如 `bx-click`、`bx-change`。

    ## 公开方法

    详见方法注释。
    
    ### Loader.boot( [ context ] [, callback ] )
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
    [
        'constant',
        'options',
        'util'
    ],
    function(
        Constant,
        Options,
        Util
    ) {

        var CACHE = {}
        var DEBUG = false

        /*
            ### Loader.boot( [ context ] [, callback ] )

            * Loader.boot()
            * Loader.boot( component )
            * Loader.boot( component, callback )
            * Loader.boot( element )
            * Loader.boot( element, callback )
            * Loader.boot( array{element|component} )
            * Loader.boot( array{element|component}, callback )
            * Loader.boot( callback )

            初始化节点 context 以及节点 context 内的所有组件，当所有组件初始化完成后回调函数 callback 被执行。

            * **context** 可选。一个 DOM 元素。默认为 document.body。
            * **callback** 可选。一个回调函数，当所有组件初始化完成后被执行。

            简：初始化所有组件。
        */
        function boot(context, callback) {
            // boot(callback)
            if (Util.isFunction(context)) {
                callback = context
                context = document.body
            } else {
                // boot( component )                    context.element
                // boot( element )                      element
                // boot( array{element|component} )
                // boot()                               document.body
                context = context && context.element ||
                    context ||
                    document.body
            }

            var deferred = Util.defer()
            var queue = Util.queue()

            // 1. 查找组件节点 [bx-id]
            var elements = function() {
                // element or [ element ]
                var contextArray = context.nodeType ? [context] : context
                var elements = []
                Util.each(contextArray, function(item /*, index*/ ) {
                    item = item.element || item
                    if (item.nodeType === 1 && item.getAttribute(Constant.ATTRS.id)) elements.push(item)
                    var descendants = item.getElementsByTagName('*')
                    Util.each(descendants, function(descendant /*, index*/ ) {
                        if (descendant.nodeType !== 1) return
                        if (descendant.getAttribute(Constant.ATTRS.id)) elements.push(descendant)
                    })
                })
                return elements
            }()

            // 2. 顺序把初始化任务放入队列
            Util.each(elements, function(element /*, index*/ ) {
                queue
                    .queue(function(next) {
                        init(element)
                            .then(undefined, function(reason) {
                                // Display the current call stack
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
            var clientId = element.clientId
            if (clientId !== undefined) {
                deferred.resolve(CACHE[clientId])
                if (callback) callback(undefined, CACHE[clientId])
                return promise
            }

            // 1. 解析配置项
            var options = Options.parse(element)
            var BrixImpl, instance

            var label = 'module ' + options.moduleId + ' ' + options.clientId
            if (DEBUG) console.group(label)
            if (DEBUG) console.time(label)
            promise.finally(function() {
                if (DEBUG) console.timeEnd(label)
                if (DEBUG) console.groupEnd(label)
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
                        instance.options = Util.extend({}, instance.options, options)
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
                    if (DEBUG) console.log(label, 'call  init')
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
                    // 5. 执行渲染（不存在怎么办？必须有！）
                    try {
                        // TODO
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
                    if (DEBUG) console.log(label, 'call  render')
                    next()
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
                    // .delay(100, queueName) // 每个组件之间的渲染间隔 100ms，方便观察
                })
                .queue(function(next) {
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
            ### Loader.destroy(component [, callback ] )
            
            * Loader.destroy( component )
            * Loader.destroy( component, callback )
            * Loader.destroy( element )
            * Loader.destroy( element, callback )
            * Loader.destroy( array )
            * Loader.destroy( array, callback )
            
            私有方法：

            * Loader.destroy( clientId )
            * Loader.destroy( clientId, callback )
            
            销毁某个组件，包括它的后代组件。

            * **component** 某个组件实例。
            * **element** 一个 DOM 元素。
            * **array** 一个含有组件实例或 DOM 元素的数组。
            * **callback** 可选。一个回调函数，当组件销毁后被执行。
        */
        function destroy(instance, callback) {
            if (!instance) {
                if (callback) callback()
                return this
            }

            // destroy( clientId )
            if (Util.isNumber(instance)) instance = CACHE[instance]

            // destroy( array )
            if (Util.isArray(instance)) {
                Util.each(instance, function(item) {
                    destroy(item)
                })
                if (callback) callback()
                return this
            }

            // destroy( element )
            if (instance.nodeType === 1) {
                instance = CACHE[
                    instance.clientId
                ]
            }

            // 如果已经被移除，则立即返回
            if (!instance) {
                if (callback) callback()
                return this
            }

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

            var label = 'module ' + instance.moduleId + ' ' + instance.clientId
            if (DEBUG) console.log(label, 'destroy')

            if (callback) callback()

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
            // 放入缓存
            CACHE[instance.clientId] = instance
            // 关联父组件
            var parent = CACHE[instance.parentClientId]
            if (parent) parent.childClientIds.push(instance.clientId)
        }

        /*
            ### Loader.query( moduleId [, context ] )
            
            * Loader.query( moduleId, context )
            * Loader.query( moduleId )
            * Loader.query( element )

            根据模块标识符 moduleId 查找组件实例。

            * **moduleId** 模块标识符。
            * **context** 限定参查找的范围，可以是 moduleId、component、element。
            * **element** 设置了属性 bx-id 的 DOM 元素。

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

            } else {
                // 1. 根据 moduleId 查找组件实例
                // query( moduleId )
                Util.each(CACHE, function(instance /*, index*/ ) {
                    if (instance.moduleId === moduleId) {
                        // 是否在 context 内
                        if (context === undefined || parents(instance, context).length) {
                            results.push(instance)
                            // 收集组件方法
                            Util.each(instance.constructor.prototype, function(value, name) {
                                if (Util.isFunction(value)) methods.push(name)
                            })
                        }
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
         */
        function parents(instance, context) {
            var results = []
            var parent = instance
            if (context === undefined) return results

            // parents(instance, component)
            // parents(instance, element)
            if (context.options && context.render || context.nodeType) {
                while ((parent = CACHE[parent.parentClientId])) {
                    if (parent.clientId === context.clientId) {
                        results.push(parent)
                    }
                }
            } else {
                // parents(instance, moduleId)    
                while ((parent = CACHE[parent.parentClientId])) {
                    if (parent.moduleId === context) {
                        results.push(parent)
                    }
                }
            }
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

        var tasks = Util.queue()
        var booting = false
        var Loader = {
            CACHE: CACHE,
            boot: function(context, callback) {
                // boot(callback)
                if (Util.isFunction(context)) {
                    callback = context
                    context = document.body
                } else {
                    // boot( component )
                    // boot( element )
                    context = context && context.element ||
                        context ||
                        document.body
                }
                tasks.queue(function(next) {
                    booting = true
                    boot(context, function( /* context */ ) {
                        booting = false
                        if (callback) callback(context)
                        next()
                    })
                })
                if (!booting) tasks.dequeue()
            },
            init: init,
            destroy: destroy,
            query: query,
            tree: tree,

            Util: Util,
            Constant: Constant,
            Options: Options
        }

        return Loader
    }
)