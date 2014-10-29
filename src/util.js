/* global define        */
/* global setTimeout, setInterval, clearInterval */

/*
    Brix Loader Utility Functions
    
    http://underscorejs.org/
*/
define(function() {

    var _ = {}

    var slice = Array.prototype.slice
    var concat = Array.prototype.concat
    var toString = Object.prototype.toString
    var hasOwnProperty = Object.prototype.hasOwnProperty

    // Collection Functions

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    _.each = function(obj, iterator, context) {
        if (obj === null || obj === undefined) return obj
        if (obj.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                iterator.call(context, obj[i], i, obj)
            }
        } else {
            for (var prop in obj) {
                iterator.call(context, obj[prop], prop, obj)
            }
        }
        return obj
    }

    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = function(obj, iterator, context) {
        var results = []
        if (obj === null || obj === undefined) return results;
        if (obj.map === Array.prototype.map) return obj.map(iterator, context)
        _.each(obj, function(value, index, list) {
            results.push(iterator.call(context, value, index, list))
        })
        return results
    };


    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
        var results = []
        var args = slice.call(arguments, 1)
        _.each(array, function(item /*, index*/ ) {
            var contains = false
            _.each(args, function(arg /*, index*/ ) {
                if (!contains && (arg === item)) contains = true
            })
            if (!contains) results.push(item)
        })
        return results
    }

    // Produce a duplicate-free version of the array. 
    _.unique = function(array) {
        var results = []
        _.each(array.sort(), function(item, index) {
            if (index === 0 || item !== array[index - 1])
                results.push(item)
        })
        return results
    }

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
        var copy = {};
        var keys = concat.apply([], slice.call(arguments, 1))
        _.each(keys, function(key) {
            if (key in obj) copy[key] = obj[key]
        })
        return copy
    }

    // Object Functions

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
        _.each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop]
                }
            }
        })
        return obj
    }

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function(obj) {
        if (!_.isObject(obj)) return []
        if (Object.keys) return Object.keys(obj)
        var keys = []
        for (var key in obj)
            if (_.has(obj, key)) keys.push(key)
        return keys
    };

    // Retrieve the values of an object's properties.
    _.values = function(obj) {
        var keys = keys(obj)
        var length = keys.length
        var values = new Array(length)
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]]
        }
        return values
    }

    // Is a given value a DOM element?
    _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1)
    }

    // Add some isType methods
    // isBoolean isNumber isString isFunction isArray isDate isRegExp isObject isError
    _.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']'
        }
    })

    // Is a given object a finite number?
    _.isFinite = function(obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    }

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
        return _.isNumber(obj) && obj != +obj
    }

    // Is a given value a boolean?
    _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]'
    }

    // Is a given value equal to null?
    _.isNull = function(obj) {
        return obj === null
    }

    // Is a given variable undefined?
    _.isUndefined = function(obj) {
        return obj === void 0
    }

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    /* 非 Underscore 方法 */

    // 解析参数为 object
    _.unparam = function(param) {
        if (!param) return {}

        var re = {};
        for (var i = 0, arr = param.split('&'), kv;
            (kv = arr[i]); i++) {
            kv = kv.split('=');
            re[kv[0]] = kv[1];
        }
        return re;
    }

    // 去掉 HTML 的缩进
    _.trimHTML = function(element) {
        var htmls = element.outerHTML.split('\n')
        var indent = htmls[htmls.length - 1].match(/^([\s\t]*)/)[0].length
        return _.map(htmls, function(line, index) {
            return index === 0 ? line : line.slice(indent)
        }).join('\n')
    }

    // 去掉 <pre><code></code></pre> 的缩进
    _.trimPredefined = function(element) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        var text = element.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        var lines = text.split('\n')
        var indent
        _.each(lines, function(line /*, index*/ ) {
            if (!line) return
            if (indent !== undefined) return
            indent = line.match(/^([\s\t]*)/)[0].length
        })
        lines = _.map(lines, function(line /*, index*/ ) {
            return line.slice(indent)
        })
        return lines.join('\n').replace(rtrim, '')
    }

    // Queue 实现

    function Queue() {
        this.list = []
    }
    Queue.prototype = {
        queue: function(fn) {
            this.list.push(fn)
            return this
        },
        dequeue: function() {
            var that = this
            var fn = this.list.shift()
            if (fn) fn(next)

            function next() {
                that.dequeue();
            }
            return this
        },
        delay: function(time) {
            return this.queue(function(next) {
                setTimeout(next, time)
            })
        },
        clear: function() {
            this.list = []
            return this
        }
    }

    _.queue = function() {
        return new Queue()
    }

    // Promise 实现

    function Deferred() {
        var that = this
        this.state = 'pending' // resolved rejected
        this.resolvedList = []
        this.resolvedListIndex = 0
        this.rejectedList = []
        this.rejectedListIndex = 0
        this.progressedList = []
        this.progressedListIndex = 0
        this.promise = {
            then: function() {
                that.then.apply(that, arguments)
                return this
            },
            finally: function() {
                that.finally.apply(that, arguments)
                return this
            }
        }
    }
    Deferred.prototype = {
        then: function(resolved, rejected, progressed) {
            if (resolved) {
                if (resolved.finally) this.resolvedList.push(resolved)
                else this.resolvedList.splice(this.resolvedListIndex++, 0, resolved)
            }
            if (rejected) {
                if (rejected.finally) this.rejectedList.push(rejected)
                else this.rejectedList.splice(this.rejectedListIndex++, 0, rejected)
            }
            if (progressed) this.progressedList.push(progressed)

            if (this.state === 'resolved' && resolved) resolved(this.args)
            if (this.state === 'rejected' && rejected) rejected(this.args)
            return this
        },
        resolve: function(value) {
            this.args = value

            if (this.state !== 'pending') return this

            this.state = 'resolved'
            for (var i = 0; i < this.resolvedList.length; i++) {
                this.resolvedList[i](value)
            }
            return this
        },
        reject: function(reason) {
            this.args = reason

            if (this.state !== 'pending') return this

            this.state = 'rejected'
            for (var i = 0; i < this.rejectedList.length; i++) {
                this.rejectedList[i](reason)
            }
            return this
        },
        notify: function(progress) {
            for (var i = 0; i < this.progressedList.length; i++) {
                this.progressedList[i](progress)
            }
            return this
        },
        finally: function(callback) {
            callback.finally = true
            return this.then(callback, callback)
        }
    }

    _.defer = function() {
        return new Deferred()
    }

    // Deferred helper
    _.when = function( /* subordinate, ..., subordinateN */ ) {
        // TODO
    }

    /*
        定时器辅助工具，可以把多个 setInterval 合并成一个。
        来自 Countdown 组件。
     */
    var Timer = {
        push: function(task, interval) {
            this.timers = this.timers || {}
            this.timers[interval] = this.timers[interval] || []
            this.timers[interval].push(task)
            this.run()
        },
        pop: function(task, interval) {
            var timers = this.timers
            if (!timers || !timers[interval]) return
            for (var i = 0; i < timers[interval].length; i++) {
                if (timers[interval] === task) timers[interval].splice(i--, 1)
            }
        },
        run: function() {
            _.each(this.timers, function(item, interval) {
                if (!item.length) {
                    clearInterval(item.timer)
                    return
                }
                if (!item.timer) {
                    item.timer = setInterval(function() {
                        _.each(item, function(fn /*, index*/ ) {
                            fn()
                        })
                    }, interval)
                }
            })
        }
    }
    _.Timer = Timer

    return _
})