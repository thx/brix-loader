define(['jquery', 'underscore'], function(jQuery, _) {
    
    /*
        ## Brix

        Brix(options)

        所有 Brix 组件的基类。

    */
    function Brix(options) {
        this.options = options || {}
    }

    _.extend(Brix, {
        isBrix: true,
        /*
            ## .init()

            初始化组件。
        */
        init: function() {
            return this
        },
        /*
            ## .render()
            渲染组件。
        */
        render: function() {
            return this
        },
        destroy: function() {
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
    })

    return Brix
})