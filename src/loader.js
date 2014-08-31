/*
    Brix Loader
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
        'jquery', 'underscore', 'q',
        '/src/constant.js', '/src/option.js', '/src/brix.js', '/src/event.js'
    ],
    function(
        $, _, Q,
        Constant, parseOptions, Brix, Event
    ) {

        var CACHE = {}

        /*
            boot(context)

            * boot(brixImpl)
            * boot(element)

            初始化元素 context 内的所有组件。
            初始化所有组件。
        */

        function boot(context) {
            // console.log('function', arguments.callee.name, context && context.element)
            var deferred = Q.defer()
            var queueName = 'fn_' + arguments.callee.name + '_' + Math.random
            var queue = $({})

            // 1. 查找组件节点
            var elements = $(Constant.SELECTORS.id, context && context.element || context).toArray()

            // 2. 顺序把初始化任务放入队列
            _.each(elements, function(element, index) {
                queue
                    .queue(queueName, function(next) {
                        init(element)
                            .then(undefined, function(reason) {
                                console.error(reason)
                            }).finally(function() {
                                next()
                            })
                    })
            })

            // 3. 逐个出队，执行初始化任务
            // 4. 全部任务执行完成（无论成败）
            queue
                .queue(queueName, function() {
                    deferred.resolve(context)
                })
                .dequeue(queueName) // 开始

            return deferred.promise
        }

        /*
            init(element)

            * init(element)

            初始化元素 element 关联的组件。

            初始化单个组件。
        */
        function init(element) {
            // console.log('function', arguments.callee.name, element)

            var deferred = Q.defer()
            var queueName = 'fn_' + arguments.callee.name + '_' + Math.random
            var queue = $({})

            var $element = $(element)
            if ($element.attr(Constant.ATTRS.cid)) {
                deferred.resolve()
                return deferred.promise
            }

            // 1. 解析配置项
            var options = parseOptions(element)
            var BrixImpl, instance

            console.time(options.moduleId + ' ' + options.clientId)
            deferred.promise.finally(function() {
                console.timeEnd(options.moduleId + ' ' + options.clientId)
            })

            queue
                .queue(queueName, function(next) {
                    // 2. 加载组件模板
                    load(options.moduleId)
                        .then(function(impl) {
                            BrixImpl = impl
                            next()
                        })
                })
                .queue(queueName, function(next) {
                    try {
                        // 3. 创建组件实例
                        instance = new BrixImpl(options)
                        // 设置属性 options
                        instance.options = instance.options || {} // 转换为实例属性
                        _.extend(instance.options, options)
                        // 设置其他公共属性
                        _.extend(instance, _.pick(options, Constant.OPTIONS))

                        // 拦截销毁方法
                        instance._destroy = instance.destroy
                        instance.destroy = function() {
                            Loader.destroy(instance)
                        }

                        next()
                    } catch (error) {
                        deferred.reject(error)
                    }
                })
                .queue(queueName, function(next) {
                    // 绑定测试事件
                    _.each(Constant.EVENTS, function(type) {
                        instance.on(type + Constant.NAMESPACE, function(event) {
                            event.stopPropagation()
                            console.log('event', event.type, $(event.currentTarget).attr('bx-id'), event.target /*, event*/ )
                        })
                    })
                    next()
                    // .delay(100, queueName) // 每个组件之间的渲染间隔 100ms，方便观察
                })
                .queue(queueName, function(next) {
                    // 缓存起来，关联父组件
                    cache(instance)
                    next()
                })
                .queue(queueName, function(next) {
                    // 拦截初始化 TODO
                    // 4. 执行初始化
                    if (instance.init) instance.init()
                    next()
                })
                .queue(queueName, function(next) {
                    // 拦截渲染方法
                    var _render = instance.render
                    instance.render = function() {
                        // 如果存在已经被渲染的子组件，则先销毁
                        var hasRenderedChildren
                        if (instance.childClientIds.length) {
                            hasRenderedChildren = true
                            _.each(instance.childClientIds, function(childClientId) {
                                if (CACHE[childClientId]) destroy(childClientId)
                            })
                        }
                        _render.apply(this, arguments)
                        // 再次渲染子组件
                        if (hasRenderedChildren) {
                            boot(instance)
                        }
                    }

                    // 5. 执行渲染（不存在怎么办？必须写！）
                    try {
                        instance.render()
                    } catch (error) {
                        deferred.reject(error)
                    }
                    // if (instance.render) instance.render()
                    // else throw new Error('.render() required!')
                    next()
                })
                .queue(queueName, function(next) {
                    // 6. 绑定事件
                    Event.delegateEvents(instance)
                    next()
                })
                .queue(queueName, function(next) {
                    // 没有后代组件，则不需要递归加载
                    if (!$element.has(Constant.SELECTORS.id).length) {
                        next()
                        return
                    }
                    // 7. 递归加载后代组件
                    boot(instance).then(function(context) {
                        next()
                    })
                })
                .queue(queueName, function(next) {
                    deferred.resolve()
                    // 8. 触发 ready 事件
                    // 当前组件和后代组件的渲染都完成后触发
                    instance.triggerHandler(EVENTS.ready)
                })
                .dequeue(queueName)

            return deferred.promise
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
            // destroy(clientId)
            if (_.isNumber(instance)) instance = CACHE[instance]

            // destroy(Query)
            if (instance.isQuery) {
                _.each(instance.toArray(), function(element) {
                    destroy(element)
                })
                return
            }

            // destroy(element)
            if (instance.nodeType) {
                instance = CACHE[
                    $(instance).attr(Constant.ATTRS.cid)
                ]
            }

            // 如果已经移除，则立即返回
            if (!instance) return

            // 先递归销毁后代组件
            if (instance.childClientIds.length) {
                _.each(instance.childClientIds, function(clientId) {
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
                parent.childClientIds = _.without(parent.childClientIds, instance.clientId)
            }

            // 触发 destroy 事件
            // 在移除关联的节点后，无法再继续利用浏览器事件模型来传播和触发事件，所以在移除前先触发 destroy 事件。
            instance.triggerHandler(EVENTS.destroy)

            // 从 DOM 树中移除（包括了事件！）
            $(instance.element).remove()
        }


        function load(moduleId) {
            // console.log('function', arguments.callee.name, moduleId)
            var deferred = Q.defer()
            var promise = deferred.promise
            require([moduleId], function(BrixImpl) {
                deferred.resolve(BrixImpl)
            })
            promise.then(function(BrixImpl) {
                return BrixImpl
            }, console.error)
            return promise
        }

        function cache(instance) {
            // 缓存起来
            CACHE[instance.clientId] = instance
            // 关联父组件
            var parent = CACHE[instance.parentClientId]
            if (parent) parent.childClientIds.push(instance.clientId)
        }

        /*
            CACHE {
                uuid: {
                    id: uuid
                    parentClientId: uuid,
                    instance: brix
                }
            }
        */
        function tree() {
            var result = {
                name: 'root',
                children: []
            }

            function _parseChildren(parentClientId, children) {
                _.each(CACHE, function(item) {
                    if (item.parentClientId === parentClientId) {
                        children.push({
                            name: item.moduleId,
                            children: _parseChildren(item.clientId, [])
                        })
                    }
                })
                return children
            }

            _parseChildren(-1, result.children)

            return result
        }

        return {
            CACHE: CACHE,
            boot: boot,
            init: init,
            destroy: destroy,
            tree: tree
        }
    })