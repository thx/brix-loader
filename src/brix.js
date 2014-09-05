/* global define */

define(
    [
        '/src/util.js', '/src/event.js'
    ],
    function(
        Util, Event
    ) {

        /*
            ## Brix

            * Brix(options)

            Brix Component Base，Brix 组件基类，Brix Component Definition 的最简实现。
            在编写 Brix Component Implement 时，建议从继承该实现开始。
        */
        function Brix() {}

        // http://backbonejs.org
        Brix.extend = function(protoProps, staticProps) {
            var parent = this
            var child

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && Util.has(protoProps, 'constructor')) {
                child = protoProps.constructor
            } else {
                child = function() {
                    return parent.apply(this, arguments)
                }
            }

            // Add static properties to the constructor function, if supplied.
            Util.extend(child, parent, staticProps)

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function() {
                this.constructor = child
            }
            Surrogate.prototype = parent.prototype
            child.prototype = new Surrogate()

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) Util.extend(child.prototype, protoProps)

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype

            return child
        }

        Brix.prototype = {
            // 是否 Brix 组件
            isBrix: true,
            /*
                ## .init()
                初始化组件。
            */
            init: function() {},
            /*
                ## .render()
                渲染组件。
            */
            render: function() {},
            /*
                ## .destroy
                销毁组件。
            */
            destroy: function() {}
        }
        Util.extend(Brix.prototype, Event)

        return Brix
    }
)