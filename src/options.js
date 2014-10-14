/* global define */
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
        function parse(element) {
            var options
            var parent, moduleId, clientId, parentClientId


            // 如果没有模块标识符，则无需（也无法）加载，立即返回
            moduleId = element.getAttribute(Constant.ATTRS.id)
            if (!moduleId) return {}

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

            // 解析 HTML5 data-* 中的配置项
            Util.extend(
                options,
                data(element)
            )

            return options
        }

        /*
            解析 HTML5 data-* 中的配置项，优先级比 bx-options 中的更高。
         */
        function data(element) {
            var options = {}
            Util.each(element.attributes, function(attribute) {
                var ma = /data-(.+)/.exec(attribute.name)
                if (!ma) return

                var value = attribute.value
                try {
                    /* jshint evil:true */
                    options[ma[1]] = /^\s*[\[{]/.test(value) ?
                        eval('(function(){ return [].splice.call(arguments, 0 )[0] })(' + value + ')') :
                        value
                } catch (error) {
                    options[ma[1]] = value
                }
            })
            return options
        }

        return {
            parse: parse
        }

    })