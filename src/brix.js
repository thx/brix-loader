define(['jquery', 'underscore'], function(jQuery, _) {
    
    /*
        Brix(options)

    */
    function Brix(options) {
        this.options = options || {}
    }

    _.extend(Brix, {
        isBrix: true,
        init: function() {},
        render: function() {
            return this
        },
        destroy: function() {
            return this
        },
        on: function(types, selector, data, fn) {
            jQuery(this.element).on(types, selector, data, fn)
            return this
        },
        one: function(types, selector, data, fn) {
            jQuery(this.element).one(types, selector, data, fn)
            return this
        },
        off: function(types, selector, fn) {
            jQuery(this.element).off(types, selector, fn)
            return this
        },
        trigger: function(type, data) {
            jQuery(this.element).trigger(type, data)
            return this
        },
        triggerHandler: function(type, data) {
            jQuery(this.element).triggerHandler(type, data)
            return this
        }
    })

    return Brix
})