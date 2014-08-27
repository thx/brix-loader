define(
    [
        'jquery', 'underscore',
        '/src/loader.js'
    ],
    function(
        $, _,
        Loader
    ) {

        /*
            Query( selector [, context ] )
            Query( selection )
            Query( element )
            Query( elementArray )
            Query( html [, ownerDocument ] )
            Query( html, attributes )
        */
        function Query(selector, context) {
            return new Query.prototype.init(selector, context);
        }

        Query.prototype = {
            isQuery: true,
            init: function(selector, context, rootBrix /* Internal Use Only */ ) {
                var that = this
                var elements
                var methods = []

                // Query( selection )
                if (typeof selector === "string") {
                    // #id => [bx-id="id"]
                    selector = selector.replace(/(?:#([\w-_\/]+))/g, function($0, $1) {
                        return '[bx-id="' + $1 + '"]'
                    })
                    // * => [bx-id]
                    selector = selector.replace(/(\*)/g, function($0, $1) {
                        return '[bx-id]'
                    })
                }

                // 1. 查找组件节点
                elements = $(selector, context).toArray()
                // 2. 查找组件节点关联的组件实例
                _.each(elements, function(element, index) {
                    var clientId = $(element).attr('bx-cid')
                    var instance = Loader.CACHE[clientId]
                    if (clientId === undefined) return
                    if (!instance) return
                    that.push(instance)
                    _.each(instance.constructor.prototype, function(value, name) {
                        if (_.isFunction(value)) methods.push(name)
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
                _.each(_.unique(methods, true), function(functionName, index) {
                    that[functionName] = function() {
                        var args = [].slice.call(arguments)
                        _.each(this.toArray(), function(instance) {
                            if (!instance[functionName]) return
                            instance[functionName].apply(instance, args)
                        })
                    }
                })

            },
            find: function(selector) {
                // TODO
                var results = []
                _.each(this.toArray(), function(instance) {

                })
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