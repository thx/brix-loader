/* global define  */

define(
    [
        './constant.js', './util.js'
    ],
    function(
        Constant, Util
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
            else parentClientId = -1

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

    })