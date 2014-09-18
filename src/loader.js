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
    [
        'loader/constant',
        'loader/option',
        'loader/util'
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
)