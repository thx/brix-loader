/* global define  */

define(
    [
        'constant',
        'util'
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
        function parseOptions(element) {
            var options
            var parent, moduleId, clientId, parentClientId


            // 如果没有模块标识符，则无需（也无法）加载，立即返回
            moduleId = element.getAttribute(Constant.ATTRS.id)
            if (!moduleId) return

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

            options.events = parseBxEvents(element)

            return options
        }

        /**
         * 解析 bx-type 风格的事件配置
         * @param  {element} 一个 DOM 元素
         * @param  {boolean} 是否进行深度查找
         * @return {array}
         *      [
         *        {
         *          target:
         *          type:
         *          handler:
         *          fn:
         *          params:
         *        },
         *      ]
         */
        function parseBxEvents(element, deep) {
            // 数组 or 伪数组
            if (!element.nodeType && element.length) element = element[0]
            var elements = deep ? element.getElementsByTagName('*') : [element]
            var events = []
            Util.each(elements, function(item /*, index*/ ) {
                Util.each(item.attributes, function(attribute) {
                    Constant.RE_EVENT.exec('') // rest lastIndex
                    var ma = Constant.RE_EVENT.exec(attribute.name)
                    if (!ma) return
                    var handleObj = {
                        target: item,
                        type: ma[1],
                        handler: attribute.value
                    }
                    Util.extend(handleObj, parseFnAndParams(attribute.value))
                    events.push(handleObj)
                })
            })
            return events
        }

        /**
         * 解析 bx-type 风格的事件类型
         * @param  {element} 一个 DOM 元素
         * @param  {boolean} 是否进行深度查找
         * @return {array}
         *      [ 'click', 'change', ... ]
         */
        function parseBxTypes(element, deep) {
            return Util.unique(
                Util.map(
                    // [ { target type handler fn params }, ... ]
                    parseBxEvents(element, deep),
                    function(item) {
                        return item.type
                    }
                )
            )
        }

        /**
         * 解析函数名称和参数值
         * @param  {string} 表达式。
         * @return {object}
         *      {
         *          fn:
         *          params:
         *      }
         */
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
            parseBxTypes: parseBxTypes,
            parseFnAndParams: parseFnAndParams
        }

    })