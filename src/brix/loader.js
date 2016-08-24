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
    [
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
        var DEBUG = ~location.search.indexOf('brix.loader.debug')

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
                    if (item.nodeType !== 1) return
                    if (item.getAttribute(Constant.ATTRS.id)) elements.push(item)
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
                            if (error) console.error(error.stack || error)
                            if (notify) notify(error, instance, index, elements.length)

                            if (error && Loader.onerror) {
                                error.moduleId = element.getAttribute(Constant.ATTRS.id)
                                Loader.onerror(error) // 运行时异常收集
                            }

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
            // var queue = Util.queue() // #20

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

            __loadModule()

            function __loadModule(next) {
                next = next || __createInstance

                // 2. 加载组件模块
                // load module file
                /* jshint unused:false */
                // try {
                //     // 尝试快速获取已经加载过的模块
                //     BrixImpl = require(options.moduleId)
                //     setTimeout(next, 4)
                //     return
                // } catch (error) {}

                require([options.moduleId], function __loadModuleComplete(module) {
                    BrixImpl = module
                    next()
                }, function(error) {
                    // http://requirejs.org/docs/api.html#errbacks
                    if (callback) callback(new Error(error.message), instance)
                    else console.error(error.stack || error)

                    if (Loader.onerror) {
                        error.moduleId = options.moduleId
                        Loader.onerror(error) // 运行时异常收集
                    }
                })
            }

            function __createInstance(next) {
                next = next || __interceptInstanceDestroy

                try {
                    // 在组件模块上附加标记 __x_created_with，指示负责初始化的是 Brix Loader
                    // Add a mark to component module, indicating the Brix Loader is response for the initializing.
                    var __x_created_with = BrixImpl.__x_created_with
                    BrixImpl.__x_created_with = 'Brix Loader'

                    // 3. 创建组件实例（按需传入参数 options）
                    // Create a new module instance
                    instance = BrixImpl.length ? new BrixImpl(options) : new BrixImpl()

                    // 恢复标记
                    // Recovery the mark
                    BrixImpl.__x_created_with = __x_created_with

                    // 设置实例属性 options
                    instance.options = Util.extend(true, {}, instance.options, options)

                    // 设置其他公共属性
                    Util.extend(instance, Util.pick(options, Constant.OPTIONS))

                    next()
                } catch (error) {
                    if (callback) callback(error, instance)
                    else console.error(error.stack || error)

                    if (Loader.onerror) {
                        error.moduleId = options.moduleId
                        Loader.onerror(error) // 运行时异常收集
                    }
                }
            }

            function __interceptInstanceDestroy(next) {
                next = next || __cacheInstance

                // 拦截销毁方法
                // intercept destroy method of the module instance
                instance._destroy = instance.destroy
                instance.destroy = function() {
                    destroy(false, instance)
                }
                next()
            }

            function __cacheInstance(next) {
                next = next || __callInstanceInitialization

                // 缓存起来，关联父组件
                // cache the module instance
                cache(instance)
                next()
            }

            function __callInstanceInitialization(next) {
                next = next || __interceptInstanceRender

                // 4. 执行初始化
                // exec module instance initialize
                if (!instance.init) {
                    next()
                    return
                }

                try {
                    if (DEBUG) console.time(label + ' call  init')
                    var result = instance.init()
                    if (DEBUG) console.timeEnd(label + ' call  init')

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

                    if (Loader.onerror) {
                        error.moduleId = options.moduleId
                        Loader.onerror(error) // 运行时异常收集
                    }
                }
            }

            function __interceptInstanceRender(next) {
                next = next || __callInstanceRender

                // 拦截渲染方法
                // intercept render method of the module instance
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
                    var result
                    if (instance._render) result = instance._render.apply(instance, arguments)
                    else console.warn(instance.clientId, instance.moduleId, 'render() is not defined')

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
                        var relatedElement = instance.relatedElement || instance.$relatedElement
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
            }

            function __callInstanceRender(next) {
                next = next || __bindLifecycleEvent

                // 5. 执行渲染（不存在怎么办？必须有！）
                // exec render method of the module instance
                try {
                    if (DEBUG) console.time(label + ' call  render')
                    var result = instance.render(function(error /*, instance*/ ) {
                        if (error) {}
                    })
                    if (DEBUG) console.timeEnd(label + ' call  render')

                    // deferred
                    if (result && result.then) {
                        result.then(function() {
                            next()
                        }, function(error) {
                            if (callback) callback(error, instance)
                            else console.error(error.stack || error)

                            if (Loader.onerror) {
                                error.moduleId = options.moduleId
                                Loader.onerror(error) // 运行时异常收集
                            }
                        })
                    } else {
                        next()
                    }
                } catch (error) {
                    // TODO 渲染时发生错误的组件是否应该自动销毁？
                    if (callback) callback(error, instance)
                    else console.error(error.stack || error)

                    if (Loader.onerror) {
                        error.moduleId = options.moduleId
                        Loader.onerror(error) // 运行时异常收集
                    }
                }
            }

            function __bindLifecycleEvent(next) {
                next = next || __inspectDescendants

                // 绑定测试事件
                // bind lifecycle event of the module instance
                if (DEBUG && instance.on) {
                    Util.each(Constant.EVENTS, function(type) {
                        instance.on(type + Constant.LOADER_NAMESPACE, function(event) {
                            console.log(label, 'event', event.type)
                        })
                    })
                }
                next()
                    // .delay(100) // 每个组件之间的渲染间隔 100ms，方便观察
            }

            function __inspectDescendants(next) {
                next = next || __triggerReadyEvent

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
                // boot descendants recursively
                if (hasBrixElement) {
                    boot(instance, function() {
                        next()
                    })
                } else {
                    // 如果没有后代组件，那么此时当前组件已经就绪。
                    next()
                }
            }

            function __triggerReadyEvent( /*next*/ ) {
                // 8. 当前组件和后代组件的渲染都完成后，触发 ready 事件
                // trigger ready event after current module instance and it's descendants are rendered
                if (instance.triggerHandler) {
                    instance.triggerHandler(Constant.EVENTS.ready)
                }
                if (callback) callback(undefined, instance)
            }
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
        function destroy(remove /* Internal Use Only */ , moduleId, context, complete) {
            var instance

            // destroy( moduleId, context, complete )
            if (!Util.isBoolean(remove)) {
                complete = context
                context = moduleId
                moduleId = remove
                remove = true
            }

            // destroy( remove, moduleId, complete )
            if (Util.isFunction(context)) {
                complete = context
                context = undefined
            }

            // ~~Loader.destroy()~~
            if (moduleId === undefined) {
                if (complete) complete()
                return this
            }

            // destroy( remove, moduleId, context, complete )
            if (Util.isString(moduleId)) {
                instance = query(moduleId, context)
                if (!instance) {
                    if (complete) complete()
                    return this
                }
            }

            // destroy( !component )
            // destroy( !clientId )
            // destroy( !element )
            // destroy( !array )
            if (
                (moduleId.clientId === undefined) &&
                !Util.isNumber(moduleId) &&
                !moduleId.nodeType &&
                !moduleId.length
            ) {
                if (complete) complete()
                return this
            }

            // destroy( remove, component, complete )
            if (moduleId.clientId) {
                instance = moduleId
            }

            // destroy( remove, clientId )
            if (Util.isNumber(moduleId)) {
                instance = CACHE[moduleId]
                if (!instance) {
                    if (complete) complete()
                    return this
                }
            }

            // destroy( remove, array )
            if (!Util.isString(moduleId) && !Util.isNumber(moduleId) &&
                !moduleId.nodeType && moduleId.length) {
                Util.each(moduleId, function(item) {
                    destroy(remove, item, context)
                })
                if (complete) complete()
                return this
            }

            // destroy( remove, element )
            if (moduleId.nodeType === 1) {
                // destroy( context )
                if (moduleId.clientId === undefined) {
                    var descendants = moduleId.getElementsByTagName('*')
                        // 倒序遍历，以避免某个元素被移除后，漏掉相邻的元素
                    for (var i = descendants.length - 1, descendant; i >= 0; i--) {
                        descendant = descendants[i]
                        if (!descendant) continue
                        if (descendant.nodeType !== 1) continue
                        if (descendant.getAttribute(Constant.ATTRS.id)) destroy(remove, descendant)
                    }
                    if (complete) complete()
                    return this
                } else {
                    // destroy( element )
                    instance = CACHE[
                        moduleId.clientId
                    ]
                }
            }

            // 如果已经被移除，则立即返回
            if (!instance) {
                if (complete) complete()
                return this
            }

            if (Util.isArray(instance) && instance.length) {
                Util.each(instance, function(item) {
                    destroy(remove, item, context)
                })
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
                    destroy(remove, clientId)
                })
            }

            // 调用自定义销毁行为
            if (instance._destroy) {
                try {
                    instance._destroy()
                } catch (error) {
                    if (complete) complete(error)
                    else console.error(error.stack || error)

                    if (Loader.onerror) {
                        error.moduleId = instance.moduleId
                        Loader.onerror(error) // 运行时异常收集
                    }
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

            // 从 DOM 树中移除当前组件关联的元素。
            if (instance.element) {
                instance.element.clientId = undefined
                if (remove && instance.element.parentNode) {
                    instance.element.parentNode.removeChild(instance.element)
                }
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
                if (moduleId.clientId !== undefined && CACHE[moduleId.clientId]) {
                    results.push(CACHE[moduleId.clientId])
                }

            } else if (moduleId.length && !Util.isString(moduleId)) {
                // 1. 根据 elementArray 逐个查找组件实例
                // query( elementArray )
                Util.each(moduleId, function(element /*, index*/ ) {
                    if (element.clientId !== undefined && CACHE[element.clientId]) {
                        results.push(CACHE[element.clientId])
                    }
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
                        }
                    }
                })
            }

            // 收集组件方法
            Util.each(results, function(instance /*, index*/ ) {
                if (!instance) return // 容错
                Util.each(instance.constructor.prototype, function(value, name) {
                    if (Util.isFunction(value) && (name[0] !== '_')) methods.push(name)
                })
            })

            // 2. 绑定组件方法至 query() 返回的对象上
            Util.each(Util.unique(methods), function(name /*, index*/ ) {
                results[name] = function() {
                    var args = [].slice.call(arguments)
                    var result
                    var hasNewResults = false
                    var tmpNewResults = []
                    Util.each(this, function(instance /*, index*/ ) {
                        if (!instance[name]) return
                        result = instance[name].apply(instance, args)
                        if (result !== undefined && result !== instance) {
                            hasNewResults = true
                            tmpNewResults.push(result)
                        }
                    })
                    if (hasNewResults) return tmpNewResults
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
        var Loader = {
            CACHE: CACHE,
            tasks: tasks,
            booting: false,
            boot: function(force /* Internal Use Only */ , context, callback, progress) {
                // boot( context, callback, progress )
                if (!Util.isBoolean(force)) {
                    progress = callback
                    callback = context
                    context = force
                    force = false
                }

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

                if (DEBUG) console.log('call boot', context)

                var caller = arguments.callee.caller
                tasks.queue(function(next) {
                    var label = 'queue boot'
                    if (DEBUG) {
                        console.group(label)
                        console.time(label)
                        console.log('context:', context)
                        console.log('tasks.list:', tasks.list.length)
                    }

                    Loader.booting = caller
                    boot(context, function(records) {
                        if (callback) {
                            try {
                                callback(records)
                            } catch (error) {
                                console.error(error.stack || error)

                                if (Loader.onerror) Loader.onerror(error) // 运行时异常收集
                            }
                        }

                        Loader.booting = false

                        if (DEBUG) {
                            console.log(records.length, records)
                            console.timeEnd(label)
                            console.groupEnd(label)
                        }

                        next()
                    }, null, progress)
                })
                if (!Loader.booting || force) tasks.dequeue()
                return this
            },
            destroy: function() {
                try {
                    destroy.apply(this, arguments)
                } catch (error) {
                    console.error(error.stack || error)

                    if (Loader.onerror) Loader.onerror(error) // 运行时异常收集
                }
                return this
            },
            query: query,
            tree: tree,

            load: function(force /* Internal Use Only */ , element, moduleId, options, complete) {
                // boot( element, moduleId, options, complete )
                if (!Util.isBoolean(force)) {
                    complete = options
                    options = moduleId
                    moduleId = element
                    element = force
                    force = false
                }

                // load( element, moduleId, complete )
                if (Util.isFunction(options)) {
                    complete = options
                    options = undefined
                }

                var caller = arguments.callee.caller
                tasks.queue(function(next) {
                    Loader.booting = caller
                    load(element, moduleId, options, function(records) {
                        Loader.booting = false

                        if (complete) {
                            try {
                                complete(records)
                            } catch (error) {
                                console.error(error.stack || error)
                            }
                        }

                        next()
                    })
                })
                if (!Loader.booting || force) tasks.dequeue()
                return this
            },
            unload: unload,

            Util: Util,
            Constant: Constant,
            Options: Options
        }

        return Loader
    }
)