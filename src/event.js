/* global define */
/* global setTimeout */

define(
    [
        'jquery',
        '/src/constant.js', '/src/util.js', '/src/option.js'
    ],
    function(
        jQuery,
        Constant, Util, Options
    ) {
        /*
            Util.extend(Brix.prototype, Event)
        */
        return {
            delegateBxTypeEvents: function() {
                delegateBxTypeEvents(this, false)
                delegateBxTypeEvents(this, true)
                return this
            },
            undelegateBxTypeEvents: function() {
                undelegateBxTypeEvents(this)
                return this
            },
            /*
                在当前组件（关联的元素）上，为一个或多个事件类型绑定一个事件监听函数。
                在内部，Brix 上的事件方法通过调用第三方库（例如 jQuery、KISSY 等）的事件绑定方法来实现。
            */
            on: function(types, selector, data, fn) {
                jQuery(this.element).on(types, selector, data, fn)
                return this
            },
            /*
            在当前组件（关联的元素）上，为一个或多个事件类型绑定一个事件监听函数，这个监听函数最多执行一次。
            */
            one: function(types, selector, data, fn) {
                jQuery(this.element).one(types, selector, data, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，移除绑定的一个或多个类型的监听函数。
            */
            off: function(types, selector, fn) {
                jQuery(this.element).off(types, selector, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，执行所有绑定的事件监听函数和默认行为，并模拟冒泡过程。
            */
            trigger: function(type, data) {
                jQuery(this.element).trigger(type, data)
                return this
            },
            /*
                在当前组件（关联的元素）上，执行所有绑定的事件监听函数，并模拟冒泡过程，但不触发默认行为。
            */
            triggerHandler: function(type, data) {
                jQuery(this.element).triggerHandler(type, data)
                return this
            }
        }

        /*
            ## Event.delegateBxTypeEvents(instance)

            在当前组件（关联的元素）上，代理 bx-type 风格的事件监听函数。

            只处理关联元素上的事件，不处理内部的事件！
        */
        function delegateBxTypeEvents(instance, deep) {
            var types = Options.parsetBxTypes(instance.element, deep)
            Util.each(types, function(type /*, index*/ ) {
                var name = Constant.PREFIX + type
                var selector = '[' + name + ']'
                var triggered = false

                if (deep) {
                    instance
                        .on(type, selector, appetizer)
                        .on(type + Constant.NAMESPACE, selector, entrees)
                } else {
                    instance
                        .on(type, appetizer)
                        .on(type + Constant.NAMESPACE, entrees)
                }

                function appetizer(event) {
                    if (jQuery(event.target).closest('.disabled').length) return
                    event.preventDefault()
                    if (!triggered) {
                        triggered = true
                        setTimeout(function() {
                            jQuery(event.target).trigger(type + Constant.NAMESPACE, event)
                        }, 0)
                    }
                }

                function entrees(event, extraParameters) {
                    if (extraParameters) {
                        // 依然使用原来的事件对象。
                        // 因为手动触发的事件会缺少很多属性，例如 jQuery.event.keyHooks/mouseHooks.props，以及更重要的 originalEvent。
                        extraParameters.currentTarget = event.currentTarget

                        var handler = jQuery(event.currentTarget).attr(name)
                        var parts = Options.parseFnAndParams(handler)
                        if (parts) {
                            if (parts.fn in instance) {
                                instance[parts.fn].apply(
                                    instance, [extraParameters].concat(parts.params)
                                )
                            } else {
                                /* jshint evil:true */
                                eval(handler)
                            }
                        }
                    }
                    triggered = false
                    return false
                }

            })
        }

        /*
            ## Event.undelegateBxTypeEvents(instance)

            在当前组件（关联的元素）上，移除 bx-type 风格的事件监听函数。
        */
        function undelegateBxTypeEvents(instance, deep) {
            var types = Options.parsetBxTypes(instance.element, deep)
            Util.each(types, function(type /*, index*/ ) {
                var name = Constant.PREFIX + type
                var selector = '[' + name + ']'
                if (deep) jQuery(instance.element).off(type + Constant.NAMESPACE, selector)
                else jQuery(instance.element).off(type + Constant.NAMESPACE)
            })
        }

    }
)