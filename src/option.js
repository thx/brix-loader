define(
    [
        '/src/constant.js'
    ],
    function(
        Constant
    ) {
        /*
            解析配置项 bx-options
        */
        function parseOptions(element) {
            var options
            var $element, $parent, moduleId, clientId, parentClientId

            // 复用 $element
            $element = $(element)

            // 如果没有模块标识符，则无需（也无法）加载，立即返回
            moduleId = $element.attr(Constant.ATTRS.id)
            if (!moduleId) return

            // 为组件关联的 DOM 节点分配唯一标识
            clientId = Constant.UUID++
            if (!$element.attr(Constant.ATTRS.cid)) $element.attr(Constant.ATTRS.cid, clientId)

            // 查找父节点
            $parent = $element.parents(Constant.SELECTORS.cid + ':eq(0)')
            parentClientId = $parent.length ? +$parent.attr(Constant.ATTRS.cid) : -1

            // 配置项集合
            options = $element.attr(Constant.ATTRS.options)
            try { /*jshint -W054 */
                options = options ? (new Function("return " + options))() : {}
            } catch (exception) {
                options = {}
            }
            options.element = element
            options.moduleId = moduleId
            options.clientId = clientId
            options.parentClientId = parentClientId
            options.childClientIds = []

            return options
        }

        return parseOptions

    })