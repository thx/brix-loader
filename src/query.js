/* global define */

define(
    [
        'jquery',
        '/src/util.js',
        '/src/loader.js'
    ],
    function(
        jQuery,
        Util,
        Loader
    ) {

        /*
            Query( selector [, context ] )
            接收一个 CSS 选择器表达式，用于匹配一组 DOM 元素，然后返回这些 DOM 元素所关联的 Brix 组件。
            该方法的返回值是一个“伪数组”，包含了一组 Brix 组件，“伪数组”上含有所有 Brix 组件的方法。

            查询 CSS 选择器表达式 selector 匹配的 DOM 元素所关联的 Brix 组件


            * Query( selector [, context ] )
            * Query( selection )
            * Query( element )
            * Query( elementArray )
            * Query( html [, ownerDocument ] )
            * Query( html, attributes )
        */
        function Query(selector, context) {
            return new Query.prototype.init(selector, context);
        }

        Query.prototype = {
            isQuery: true,
            init: function(selector, context) {
                var that = this
                var elements
                var methods = []

                // Query( selection )
                if (typeof selector === "string") {
                    // #id => [bx-id="id"]
                    selector = selector.replace(/(?:#([\w-_\/]+))/g, function() {
                        return '[bx-id="' + arguments[1] + '"]'
                    })
                    // * => [bx-id]
                    selector = selector.replace(/(\*)/g, function() {
                        return '[bx-id]'
                    })
                }

                // 1. 查找组件节点
                elements = jQuery(selector, context).toArray()
                // 2. 查找组件节点关联的组件实例
                Util.each(elements, function(element /*, index*/ ) {
                    var clientId = element.getAttribute('bx-cid')
                    var instance = Loader.CACHE[clientId]
                    if (clientId === undefined) return
                    if (!instance) return
                    that.push(instance)
                    // 收集组件方法
                    Util.each(instance.constructor.prototype, function(value, name) {
                        if (Util.isFunction(value)) methods.push(name)
                    })
                })
                // 3. 绑定组件方法至 Query() 返回的对象上
                /*
                    最佳实践：
                        #id > 真的是 CSS3 Selector 
                        TODO
                    用 #id 限制组件的类型
                    getBrick/getBricks
                        返回值的类型可能是实例 or 伪数组
                */
                Util.each(Util.unique(methods, true), function(functionName /*, index*/ ) {
                    that[functionName] = function() {
                        var args = [].slice.call(arguments)
                        Util.each(this.toArray(), function(instance) {
                            if (!instance[functionName]) return
                            instance[functionName].apply(instance, args)
                        })
                    }
                })

            },
            // TODO
            find: function( /*selector*/ ) {
                var results = []
                Util.each(this.toArray(), function( /*instance*/ ) {})
                return results
            },
            // 伪数组
            length: 0,
            push: [].push,
            sort: [].sort,
            splice: [].splice,
            toArray: function() {
                return [].slice.call(this)
            }
        }

        Query.prototype.init.prototype = Query.prototype

        return Query
    })