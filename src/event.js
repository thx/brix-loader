define(['jquery', 'underscore'], function($, _) {

    var RE_EVENT = /bx\-(?!id|cid|options)(.+)/
    var FN_ARGS = /([^()]+)(?:\((.*?)\))?/
    var EXPANDO = ('' + Math.random()).replace(/\D/g, '')
    var NAMESPACE = '.bx_event_' + EXPANDO
    var PREFIX = 'bx-';

    function parseEvents(container) {
        var elements = $(container).add('*', container).toArray()
        var events = []
        _.each(elements, function(element) {
            _.each(element.attributes, function(attribute) {
                var ma = RE_EVENT.exec(attribute.name)
                if (ma) {
                    events.push({
                        type: ma[1],
                        handler: attribute.value,
                        target: element
                    })
                }
            })
        })
        return events
    }

    function parsetTypes(events) {
        return _.union(
            _.map(events, function(event) {
                return event.type
            })
        ).sort()
    }

    function delegateEvents(instance) {
        var types = parsetTypes(
            parseEvents(instance.element)
        )
        _.each(types, function(type, index) {
            var name = PREFIX + type
            var selector = '[' + name + ']'
            var triggered = false
            instance
                .on(type, selector, function(event, extraParameters) {
                    if ($(event.target).closest('.disabled').length) return
                    event.preventDefault()
                    if (!triggered) {
                        triggered = true
                        setTimeout(function() {
                            $(event.target).trigger(type + NAMESPACE, event)
                            // event.type = type + NAMESPACE
                            // $(event.target).triggerHandler(event, true)
                        }, 0)
                    }
                })
                .on(type + NAMESPACE, selector, function(event, extraParameters) {
                    if (extraParameters) {
                        // 依然使用原来的事件对象。
                        // 因为手动触发的事件会缺少很多属性，例如 $.event.keyHooks/mouseHooks.props，以及更重要的 originalEvent。
                        extraParameters.currentTarget = event.currentTarget

                        var handler = $(event.currentTarget).attr(name)
                        var parts = parseFnAndParams(handler)
                        if (parts) {
                            if (parts.fn in instance) {
                                instance[parts.fn].apply(
                                    instance, [extraParameters].concat(parts.params)
                                )
                            } else {
                                eval(handler)
                            }
                        }
                    }
                    triggered = false
                    return false
                })
        })
    }

    function parseFnAndParams(handler) {
        var parts = FN_ARGS.exec(handler)
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

    function undelegateEvents(container, types) {
        var types = parsetTypes(
            parseEvents(container)
        )
        _.each(types, function(type, index) {
            var name = PREFIX + type
            var selector = '[' + name + ']'
            $(container).off(type + NAMESPACE, selector)
        })
    }

    return {
        delegateEvents: delegateEvents,
        undelegateEvents: undelegateEvents
    }

})