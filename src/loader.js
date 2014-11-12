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
        var DEBUG = ~location.search.indexOf('debug')

        /*
            ### Loader.boot( [ context ] [, callback( records ) ] [, progress(error, instance, index, count) ] )

            * Loader.boot()
            * Loader.boot( component )
            * Loader.boot( component, callback )
            * Loader.boot( component, callback, progress )
            * Loader.boot( element )
            * Loader.boot( element, callback )
            * Loader.boot( element, callback, progress )
            * Loader.boot( array{element|component} )
            * Loader.boot( array{element|component}, callback )
            * Loader.boot( array{element|component}, callback, progress )
            * Loader.boot( callback )
            * Loader.boot( callback, progress )

            初始化节点 context 以及节点 context 内的所有组件，当所有组件初始化完成后回调函数 callback 被执行。

            * **context** 可选。一个 DOM 元素，或一组 DOM 元素。默认为 document.body。
            * **callback( records )** 可选。一个回调函数，当所有组件初始化完成后被执行。
                * records 二维数组，记录了组件在初始化过程中的相关信息，包括：异常、实例、在初始化队列中的下标、初始化队列长度。详见参数 progress。
            * **progress(error, instance, index, count)** 可选。一个回调函数，当每个组件初始化完成后被执行。
                * error 初始化过程中可能抛出的 Error 对象。如果没有发生任何错误，这为 undefined。
                * instance 当前组件的实例。
                * index 当前组件在初始化队列中的下标，即初始化的顺序。
                * count 初始化队列的长度。

            简：初始化所有组件。
        */
        function boot(context, callback, extraOptions /* Internal Use Only */ , progress /* Internal Use Only */ ) {
            // boot( component )                    context.element
            // boot( element )                      element
            // boot( array{element|component} )     array
            context = context.element || context

            // 初始化任务队列
            var queue = Util.queue()
            var callbackArgs = []

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
                            callbackArgs.push([error, instance, index, elements.length])
                            if (error) console.error(error.stack)
                            if (progress) progress(error, instance, index, elements.length)
                            next()
                        }, extraOptions)
                    })
            })

            // 3. 逐个出队，执行初始化任务
            // 4. 全部任务执行完成（无论成败）
            queue
                .queue(function() {
                    if (callback) callback(callbackArgs)
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
                    if (instance._wrapper) next()

                    instance._wrapper = function() {
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
                        var result = instance.render.apply(instance, arguments)

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
                        var result = instance._wrapper(function(error /*, instance*/ ) {
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
            ### Loader.destroy(component [, callback ] )
            
            * Loader.destroy( component )
            * Loader.destroy( component, callback )
            * Loader.destroy( element )
            * Loader.destroy( element, callback )
            * Loader.destroy( array )
            * Loader.destroy( array, callback )
            * Loader.destroy( context )
            * Loader.destroy( context, callback )
            
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
            if (instance === undefined) {
                if (callback) callback()
                return this
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
                if (callback) callback()
                return this
            }

            // destroy( clientId )
            if (Util.isNumber(instance)) {
                instance = CACHE[instance]
                if (!instance) {
                    if (callback) callback()
                    return this
                }
            }

            // destroy( array )
            if (!instance.nodeType && instance.length) {
                Util.each(instance, function(item) {
                    destroy(item)
                })
                if (callback) callback()
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
                    if (callback) callback()
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
                if (callback) callback()
                return this
            }

            var label = 'module ' + instance.moduleId + ' ' + instance.clientId
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

            // 先递归销毁后代组件
            if (instance.childClientIds.length) {
                Util.each(instance.childClientIds, function(clientId) {
                    destroy(clientId)
                })
            }

            // 调用自定义销毁行为
            if (instance._destroy) {
                try {
                    instance._destroy()
                } catch (error) {
                    if (callback) callback(error)
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

            if (callback) callback()

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
            ### Loader.query( moduleId [, context ] )
            
            * Loader.query( moduleId, context )
            * Loader.query( moduleId )
            * Loader.query( element )
            * Loader.query( elementArray )
            
            // * Loader.query( array{element} )

            根据模块标识符 moduleId 查找组件实例。

            * **moduleId** 模块标识符。
            * **context** 限定参查找的范围，可以是 moduleId、component、element。
            * **element** 设置了属性 bx-name 的 DOM 元素。

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
                    // var that = this
                    var args = [].slice.call(arguments)
                    Util.each(this, function(instance, index) {
                        if (!instance[name]) return
                            // that[index] = 
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

            // 从当前组件 instance 开始，逐层向上遍历

            // parents(instance, component)
            // parents(instance, element)
            if (context.options && context.render || context.nodeType) {
                // 在 instance 的祖先元素中，查找与 context.clientId 匹配的元素
                while ((parent = CACHE[parent.parentClientId])) {
                    if (parent.clientId === context.clientId) {
                        results.push(parent)
                    }
                }
            } else {
                // parents(instance, moduleId)    
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
            
            ### Loader.load( element, moduleId, options [, callback ] )
            
            * Loader.load( element, moduleId, options [, callback ] )
            * Loader.load( elementArray, moduleId, options [, callback ] )

            加载组件 moduleId 到指定的节点 element 中。

            * **moduleId** 必选。模块标识符。
            * **element** 必选。目标元素。
            * **elementArray** 必选。目标元素数组。
            * **callback** 可选。一个回调函数，当组件加载完成后被执行。
            
            > 因为每个组件的行为不可以预测（例如，table 是增强，dropdwon 是替换，pagination 是插入），导致销毁和再次加载的行为也不可预测，所以不能直接在节点 element 上加载，而是在其内新建一个容器元素 `<div>`，在这个容器元素上加载组件 moduleId。

            #### Examples
            
            ```js
            var target = $('<div>').insertBefore(document.body.firstChild)
            Loader.load(target, 'components/hello', {message: 'load' })
            Loader.unload(target)
            ```
         */
        function load(element, moduleId, options, callback) {
            // load(element, moduleId, options, callback)
            if (element.nodeType) element = [element]

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

            // load(elementArray, moduleId, options, callback)
            Util.each(element, function(item /*, index*/ ) {
                // item.setAttribute(Constant.ATTRS.id, moduleId)
                // 2. 为组件 moduleId 新建一个容器元素
                item.innerHTML = '<div bx-name="' + moduleId + '"></div>'
            })

            // 3. 初始化组件 moduleId
            boot(element, callback, options)
            return this
        }

        /*
            ### Loader.unload( element [, callback ] )
            
            * Loader.unload( element [, callback ] )

            卸载节点 element 中加载的组件。

            * **element** 必选。目标元素。
            * **callback** 可选。一个回调函数，当组件卸载完成后被执行。
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

            load: load,
            unload: unload,

            Util: Util,
            Constant: Constant,
            Options: Options
        }

        return Loader
    }
)