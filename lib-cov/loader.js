
// instrument by jscoverage, do not modifly this file
(function (file, lines, conds, source) {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (BASE._$jscoverage) {
    BASE._$jscmd(file, 'init', lines, conds, source);
    return;
  }
  var cov = {};
  /**
   * jsc(file, 'init', lines, condtions)
   * jsc(file, 'line', lineNum)
   * jsc(file, 'cond', lineNum, expr, start, offset)
   */
  function jscmd(file, type, line, express, start, offset) {
    var storage;
    switch (type) {
      case 'init':
        if(cov[file]){
          storage = cov[file];
        } else {
          storage = [];
          for (var i = 0; i < line.length; i ++) {
            storage[line[i]] = 0;
          }
          var condition = express;
          var source = start;
          storage.condition = condition;
          storage.source = source;
        }
        cov[file] = storage;
        break;
      case 'line':
        storage = cov[file];
        storage[line] ++;
        break;
      case 'cond':
        storage = cov[file];
        storage.condition[line] ++;
        return express;
    }
  }

  BASE._$jscoverage = cov;
  BASE._$jscmd = jscmd;
  jscmd(file, 'init', lines, conds, source);
})('dist/loader.js', [3,51,322,467,4,5,6,53,55,56,57,58,65,83,95,109,119,131,144,154,165,170,177,182,187,192,197,203,212,238,264,314,318,78,68,71,75,84,87,90,88,96,97,98,105,99,100,110,111,115,120,121,122,125,132,139,135,147,150,155,156,157,161,159,166,171,172,178,183,188,193,198,204,210,214,215,218,219,225,223,228,229,233,234,239,245,246,247,248,249,250,251,252,253,255,256,259,260,278,281,285,289,287,292,296,300,298,306,304,309,310,315,430,335,336,340,344,348,361,368,369,370,371,372,373,375,350,364,366,380,381,382,396,383,384,386,391,392,400,402,408,409,410,427,412,413,422,417,420,479,929,493,495,496,499,511,525,532,500,502,503,507,512,514,516,518,527,546,547,548,551,559,560,562,563,564,565,570,729,553,555,566,567,573,575,576,582,584,585,587,588,590,596,597,600,598,604,605,610,611,659,660,616,617,619,627,633,621,622,630,635,637,639,647,650,656,664,671,666,667,696,680,682,684,689,700,701,702,706,711,712,716,724,722,777,780,787,800,802,750,753,751,758,768,769,782,791,792,797,811,812,813,819,820,815,826,828,840,841,869,879,846,856,858,860,870,871,872,874,906,924,926,912,921,914], {"5_19_13":0,"33_17_16":0,"33_36_7":0,"33_26_7":0,"66_12_12":0,"66_28_17":0,"66_12_3":0,"66_28_3":0,"66_36_9":0,"69_19_10":0,"69_34_11":0,"70_49_1":0,"70_53_6":0,"85_12_12":0,"85_28_17":0,"85_12_3":0,"85_28_3":0,"85_36_9":0,"86_12_7":0,"86_24_19":0,"101_20_9":0,"101_33_14":0,"101_34_3":0,"101_42_4":0,"112_16_11":0,"112_31_25":0,"112_16_5":0,"112_31_4":0,"112_40_16":0,"112_46_5":0,"123_16_3":0,"123_23_3":0,"158_24_1":0,"158_28_6":0,"166_18_3":0,"166_25_18":0,"166_25_12":0,"171_17_4":0,"172_19_18":0,"172_41_23":0,"172_41_17":0,"172_54_4":0,"178_15_13":0,"178_32_23":0,"183_15_15":0,"183_34_11":0,"183_34_3":0,"183_41_4":0,"188_15_29":0,"188_48_40":0,"188_15_12":0,"188_31_13":0,"188_15_3":0,"188_31_3":0,"188_48_18":0,"193_15_3":0,"198_15_3":0,"198_23_6":0,"276_16_25":0,"276_45_8":0,"276_16_10":0,"277_16_25":0,"277_45_8":0,"277_16_10":0,"283_16_10":0,"286_28_1":0,"286_32_24":0,"294_16_10":0,"297_28_1":0,"297_32_24":0,"303_28_1":0,"303_32_26":0,"352_16_107":0,"355_16_40":0,"352_16_49":0,"354_16_24":0,"352_16_6":0,"353_16_23":0,"353_17_15":0,"354_17_15":0,"357_16_6":0,"357_26_21":0,"357_26_15":0,"364_36_37":0,"364_76_2":0,"364_62_7":0,"379_16_17":0,"379_37_14":0,"380_34_33":0,"380_70_9":0,"411_16_5":0,"411_25_8":0,"413_25_8":0,"417_34_64":0,"417_92_6":0,"493_22_37":0,"493_63_8":0,"493_22_26":0,"493_52_7":0,"493_22_7":0,"493_33_15":0,"501_20_22":0,"501_46_39":0,"501_20_16":0,"504_24_19":0,"562_24_34":0,"562_61_16":0,"562_24_28":0,"562_36_16":0,"584_43_16":0,"584_63_2":0,"634_32_19":0,"634_55_44":0,"638_40_13":0,"638_57_38":0,"666_40_4":0,"666_47_25":0,"682_40_9":0,"682_52_25":0,"683_36_7":0,"683_47_8":0,"685_69_17":0,"685_89_7":0,"703_28_19":0,"704_28_15":0,"705_28_42":0,"757_16_17":0,"792_33_9":0,"792_45_25":0,"857_24_17":0,"857_46_8":0,"913_24_19":0,"913_48_14":0,"915_34_19":0,"915_56_13":0,"915_34_13":0}, ["","/* global define */","define('constant',[],function() {","    var VERSION = '0.0.1'","    var EXPANDO = (Math.random() + '').replace(/\\D/g, '')","    return {","        VERSION: VERSION,","        // Loader","        ROOT_CLIENT_ID: -1,","        ATTRS: {","            id: 'bx-id',","            cid: 'bx-cid',","            options: 'bx-options'","        },","        SELECTORS: {","            id: '[bx-id]',","            cid: '[bx-cid]',","            options: '[bx-options]'","        },","        EVENTS: {","            ready: 'ready',","            destroy: 'destroy'","        },","        OPTIONS: [","            'element', // 组件关联的节点","            'moduleId', // 组件的模块标识符","            'clientId', // 组件实例的标识符","            'parentClientId', // 父组件实例的标识符","            'childClientIds', // 父组件实例的标识符数组","            'data', // 组件关联的数据","            'template' // 组件关联的 HTML 模板","        ],","        EXPANDO: 'Brix' + VERSION + EXPANDO,","        UUID: 0,","        // Event","        RE_EVENT: /bx\\-(?!id|cid|options)(.+)/,","        FN_ARGS: /([^()]+)(?:\\((.*?)\\))?/,","        LOADER_NAMESPACE: '._loader',","        COMPONENT_NAMESPACE: '._component',","        PREFIX: 'bx-'","    }","});","/* global define        */","/* global setTimeout    */","","/*","    Brix Loader Utility Functions","    ","    http://underscorejs.org/","*/","define('util',[],function() {","","    var _ = {}","","    var slice = Array.prototype.slice","    var concat = Array.prototype.concat","    var toString = Object.prototype.toString","    var hasOwnProperty = Object.prototype.hasOwnProperty","","    // Collection Functions","","    // The cornerstone, an `each` implementation, aka `forEach`.","    // Handles objects with the built-in `forEach`, arrays, and raw objects.","    // Delegates to **ECMAScript 5**'s native `forEach` if available.","    _.each = function(obj, iterator, context) {","        if (obj === null || obj === undefined) return obj","        if (obj.forEach) {","            obj.forEach(iterator, context);","        } else if (obj.length === +obj.length) {","            for (var i = 0, length = obj.length; i < length; i++) {","                iterator.call(context, obj[i], i, obj)","            }","        } else {","            for (var prop in obj) {","                iterator.call(context, obj[prop], prop, obj)","            }","        }","        return obj","    }","","    // Return the results of applying the iterator to each element.","    // Delegates to **ECMAScript 5**'s native `map` if available.","    _.map = function(obj, iterator, context) {","        var results = []","        if (obj === null || obj === undefined) return results;","        if (obj.map === Array.prototype.map) return obj.map(iterator, context)","        _.each(obj, function(value, index, list) {","            results.push(iterator.call(context, value, index, list))","        })","        return results","    };","","","    // Return a version of the array that does not contain the specified value(s).","    _.without = function(array) {","        var results = []","        var args = slice.call(arguments, 1)","        _.each(array, function(item /*, index*/ ) {","            var contains = false","            _.each(args, function(arg /*, index*/ ) {","                if (!contains && (arg === item)) contains = true","            })","            if (!contains) results.push(item)","        })","        return results","    }","","    // Produce a duplicate-free version of the array. ","    _.unique = function(array) {","        var results = []","        _.each(array.sort(), function(item, index) {","            if (index === 0 || item !== array[index - 1])","                results.push(item)","        })","        return results","    }","","    // Return a copy of the object only containing the whitelisted properties.","    _.pick = function(obj) {","        var copy = {};","        var keys = concat.apply([], slice.call(arguments, 1))","        _.each(keys, function(key) {","            if (key in obj) copy[key] = obj[key]","        })","        return copy","    }","","    // Object Functions","","    // Extend a given object with all the properties in passed-in object(s).","    _.extend = function(obj) {","        _.each(slice.call(arguments, 1), function(source) {","            if (source) {","                for (var prop in source) {","                    obj[prop] = source[prop]","                }","            }","        })","        return obj","    }","","    // Retrieve the names of an object's properties.","    // Delegates to **ECMAScript 5**'s native `Object.keys`","    _.keys = function(obj) {","        if (!_.isObject(obj)) return []","        if (Object.keys) return Object.keys(obj)","        var keys = []","        for (var key in obj)","            if (_.has(obj, key)) keys.push(key)","        return keys","    };","","    // Retrieve the values of an object's properties.","    _.values = function(obj) {","        var keys = keys(obj)","        var length = keys.length","        var values = new Array(length)","        for (var i = 0; i < length; i++) {","            values[i] = obj[keys[i]]","        }","        return values","    }","","    // Is a given value a DOM element?","    _.isElement = function(obj) {","        return !!(obj && obj.nodeType === 1)","    }","","    // Add some isType methods","    _.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(name) {","        _['is' + name] = function(obj) {","            return toString.call(obj) == '[object ' + name + ']'","        }","    })","","    // Is a given object a finite number?","    _.isFinite = function(obj) {","        return isFinite(obj) && !isNaN(parseFloat(obj));","    }","","    // Is the given value `NaN`? (NaN is the only number which does not equal itself).","    _.isNaN = function(obj) {","        return _.isNumber(obj) && obj != +obj","    }","","    // Is a given value a boolean?","    _.isBoolean = function(obj) {","        return obj === true || obj === false || toString.call(obj) == '[object Boolean]'","    }","","    // Is a given value equal to null?","    _.isNull = function(obj) {","        return obj === null","    }","","    // Is a given variable undefined?","    _.isUndefined = function(obj) {","        return obj === void 0","    }","","    // Shortcut function for checking if an object has a given property directly","    // on itself (in other words, not on a prototype).","    _.has = function(obj, key) {","        return hasOwnProperty.call(obj, key)","    }","","    // Queue 实现","","    function Queue() {","        this.list = []","    }","    Queue.prototype = {","        queue: function(fn) {","            this.list.push(fn)","            return this","        },","        dequeue: function() {","            var that = this","            var fn = this.list.shift()","            if (fn) fn(next)","","            function next() {","                that.dequeue();","            }","            return this","        },","        delay: function(time) {","            return this.queue(function(next) {","                setTimeout(next, time)","            })","        },","        clear: function() {","            this.list = []","            return this","        }","    }","","    _.queue = function() {","        return new Queue()","    }","","    // Promise 实现","","    function Deferred() {","        var that = this","        this.state = 'pending' // resolved rejected","        this.resolvedList = []","        this.resolvedListIndex = 0","        this.rejectedList = []","        this.rejectedListIndex = 0","        this.progressedList = []","        this.progressedListIndex = 0","        this.promise = {","            then: function() {","                that.then.apply(that, arguments)","                return this","            },","            finally: function() {","                that.finally.apply(that, arguments)","                return this","            }","        }","    }","    Deferred.prototype = {","        then: function(resolved, rejected, progressed) {","            if (resolved) {","                if (resolved.finally) this.resolvedList.push(resolved)","                else this.resolvedList.splice(this.resolvedListIndex++, 0, resolved)","            }","            if (rejected) {","                if (rejected.finally) this.rejectedList.push(rejected)","                else this.rejectedList.splice(this.rejectedListIndex++, 0, rejected)","            }","            if (progressed) this.progressedList.push(progressed)","","            if (this.state === 'resolved' && resolved) resolved(this.args)","            if (this.state === 'rejected' && rejected) rejected(this.args)","            return this","        },","        resolve: function(value) {","            this.args = value","","            if (this.state !== 'pending') return this","","            this.state = 'resolved'","            for (var i = 0; i < this.resolvedList.length; i++) {","                this.resolvedList[i](value)","            }","            return this","        },","        reject: function(reason) {","            this.args = reason","","            if (this.state !== 'pending') return this","","            this.state = 'rejected'","            for (var i = 0; i < this.rejectedList.length; i++) {","                this.rejectedList[i](reason)","            }","            return this","        },","        notify: function(progress) {","            for (var i = 0; i < this.progressedList.length; i++) {","                this.progressedList[i](progress)","            }","            return this","        },","        finally: function(callback) {","            callback.finally = true","            return this.then(callback, callback)","        }","    }","","    _.defer = function() {","        return new Deferred()","    }","","    return _","});","/* global define  */","","define(","    'option',[","        'constant',","        'util'","    ],","    function(","        Constant,","        Util","    ) {","        /*","            解析配置项 bx-options","        */","        function parseOptions(element) {","            var options","            var parent, moduleId, clientId, parentClientId","","","            // 如果没有模块标识符，则无需（也无法）加载，立即返回","            moduleId = element.getAttribute(Constant.ATTRS.id)","            if (!moduleId) return","","            // 为组件关联的 DOM 节点分配唯一标识","            clientId = Constant.UUID++","            if (!element.getAttribute(Constant.ATTRS.cid)) element.setAttribute(Constant.ATTRS.cid, clientId)","","            // 查找父节点","            parent = element","            do {","                parent = parent.parentNode","            } while (","                parent &&","                (parent.nodeType !== 9) && // Document 9","                (parent.nodeType !== 11) && // DocumentFragment 11","                !parent.getAttribute(Constant.ATTRS.cid)","            )","            if (parent && parent.nodeType === 1) parentClientId = +parent.getAttribute(Constant.ATTRS.cid)","            else parentClientId = Constant.ROOT_CLIENT_ID","","            // 配置项集合","            options = element.getAttribute(Constant.ATTRS.options)","            try {","                /* jshint evil:true */","                options = options ? (new Function(\"return \" + options))() : {}","            } catch (exception) {","                options = {}","            }","            options.element = element","            options.moduleId = moduleId","            options.clientId = clientId","            options.parentClientId = parentClientId","            options.childClientIds = []","            options.events = parseBxEvents(element)","","            return options","        }","","        function parseBxEvents(element, deep) {","            if (!element.nodeType && element.length) element = element[0]","            var elements = deep ? element.getElementsByTagName('*') : [element]","            var events = []","            Util.each(elements, function(element) {","                Util.each(element.attributes, function(attribute) {","                    var ma = Constant.RE_EVENT.exec(attribute.name)","                    if (ma) {","                        var item = {","                            target: element,","                            type: ma[1],","                            handler: attribute.value","                        }","                        Util.extend(item, parseFnAndParams(attribute.value))","                        events.push(item)","                    }","                })","            })","            return events","        }","","        function parsetBxTypes(element, deep) {","            return Util.unique(","                Util.map(parseBxEvents(element, deep), function(item) {","                    return item.type","                })","            )","        }","","        function parseFnAndParams(handler) {","            var parts = Constant.FN_ARGS.exec(handler)","            var fn","            var params","            if (parts && parts[1]) {","                fn = parts[1]","                params = parts[2] || ''","                try {","                    // 1. 尝试保持参数的类型 ","                    /* jshint -W061 */","                    params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')","                } catch (error) {","                    // 2. 如果失败，只能解析为字符串","                    params = parts[2].split(/,\\s*/)","                }","                return {","                    fn: fn,","                    params: params","                }","            }","            return {}","        }","","        return {","            parseOptions: parseOptions,","            parseBxEvents: parseBxEvents,","            parsetBxTypes: parsetBxTypes,","            parseFnAndParams: parseFnAndParams","        }","","    });","/* global define        */","/* global require       */","/* global document      */","/* global console       */","/*","    ## Brix Loader","    ","    组件加载器，负责管理 Brix Component 的整个生命周期，包括加载、初始化、渲染、销毁。","","","    解析组件配置、解析组件树、加载组件","    初始化组件、缓存组件、初始化事件","    ","    方法、属性、事件","    数据、模板（展现 HTML）、行为（JavaScript（事件））、样式（CSS）","","    Q.js","        https://github.com/kriskowal/q","        http://documentup.com/kriskowal/q/#getting-started","        https://github.com/kriskowal/q/wiki/API-Reference#qdefer","        https://github.com/bellbind/using-promise-q/","","    http://gitlab.alibaba-inc.com/river/spec/blob/master/JSON-Schema.md","    http://gitlab.alibaba-inc.com/limu/brix-central/wikis/BCD","    ","    http://etaoux.github.io/brix/","    https://github.com/etaoux/brix/issues","    http://etaoux.github.io/brix/duck/#!/api/Brix.Gallery.Dropdown","*/","define(","    'loader',[","        'constant',","        'option',","        'util'","    ],","    function(","        Constant,","        Options,","        Util","    ) {","","        var CACHE = {}","","        /*","            boot( context, callback )","            ","            * boot()","            * boot(brixImpl)","            * boot(element)","","            初始化节点 context 以及节点 context 内的所有组件。","            简：初始化所有组件。","        */","        function boot(context, callback) {","            // console.log('function', arguments.callee.name, context && context.element)","            context = context && context.element || context || document","","            var deferred = Util.defer()","            var queue = Util.queue()","","            // 1. 查找组件节点 [bx-id]","            var elements = function() {","                var elements = []","                if (context.nodeType === 1 && context.getAttribute(Constant.ATTRS.id)) elements.push(context)","                var descendants = context.getElementsByTagName('*')","                Util.each(descendants, function(descendant /*, index*/ ) {","                    if (descendant.nodeType !== 1) return","                    if (descendant.getAttribute(Constant.ATTRS.id)) elements.push(descendant)","                })","                return elements","            }()","","            // 2. 顺序把初始化任务放入队列","            Util.each(elements, function(element /*, index*/ ) {","                queue","                    .queue(function(next) {","                        init(element)","                            .then(undefined, function(reason) {","                                console.error(reason.stack)","                            }).finally(function() {","                                next()","                            })","                    })","            })","","            // 3. 逐个出队，执行初始化任务","            // 4. 全部任务执行完成（无论成败）","            queue","                .queue(function() {","                    deferred.resolve(context)","                    if (callback) callback(context)","                })","                .dequeue() // 开始","","            return deferred.promise","        }","","        /*","            init(element)","","            * init(element [, callback( error, instance )])","","            初始化元素 element 关联的组件。","            简：初始化单个组件。","        */","        function init(element, callback) {","            // console.log('function', arguments.callee.name, element)","","            var deferred = Util.defer()","            var promise = deferred.promise","            var queue = Util.queue()","","            // 如果已经被初始化，则立即返回","            var clientId = element.getAttribute(Constant.ATTRS.cid)","            if (clientId) {","                deferred.resolve(CACHE[clientId])","                if (callback) callback(undefined, CACHE[clientId])","                return promise","            }","","            // 1. 解析配置项","            var options = Options.parseOptions(element)","            var BrixImpl, instance","","            var label = 'module ' + options.moduleId + ' ' + options.clientId","            console.group(label)","            console.time(label)","            promise.finally(function() {","                console.timeEnd(label)","                console.groupEnd(label)","            })","","            queue","                .queue(function(next) {","                    // 2. 加载组件模块","                    load(options.moduleId)","                        .then(function(impl) {","                            BrixImpl = impl","                            next()","                        })","                })","                .queue(function(next) {","                    try {","                        // 3. 创建组件实例","                        instance = new BrixImpl(options)","                        // 设置属性 options","                        instance.options = instance.options || {} // 转换为实例属性","                        Util.extend(instance.options, options)","                        // 设置其他公共属性","                        Util.extend(instance, Util.pick(options, Constant.OPTIONS))","                        next()","                    } catch (error) {","                        deferred.reject(error)","                        if (callback) callback(error, instance)","                    }","                })","                .queue(function(next) {","                    // 拦截销毁方法","                    instance._destroy = instance.destroy","                    instance.destroy = function() {","                        destroy(instance)","                    }","                    next()","                })","                .queue(function(next) {","                    // 缓存起来，关联父组件","                    cache(instance)","                    next()","                })","                .queue(function(next) {","                    // 4. 执行初始化","                    if (instance.init) instance.init()","                    console.log(label, 'init')","                    next()","                })","                .queue(function(next) {","                    // 拦截渲染方法","                    if (!instance._render) {","                        instance._render = instance.render","                        instance.render = function() {","                            // 如果存在已经被渲染的子组件，则先销毁","                            var hasRenderedChildren","                            if (instance.childClientIds.length) {","                                hasRenderedChildren = true","                                Util.each(instance.childClientIds, function(childClientId) {","                                    if (CACHE[childClientId]) destroy(childClientId)","                                })","                            }","                            // 调用组件的 .render()","                            instance._render.apply(this, arguments)","                            // 再次渲染子组件","                            if (hasRenderedChildren) {","                                boot(instance.element)","                            }","                            // 同步 clientId","                            var newElement = instance.element","                            if (newElement.nodeType && !newElement.getAttribute(Constant.ATTRS.cid)) {","                                newElement.setAttribute(Constant.ATTRS.cid, options.clientId)","                            } else if (newElement.length) {","                                Util.each(newElement, function(item /*, index*/ ) {","                                    if (item.nodeType && !item.getAttribute(Constant.ATTRS.cid)) {","                                        item.setAttribute(Constant.ATTRS.cid, options.clientId)","                                    }","                                })","                            }","                        }","                    }","                    // 5. 执行渲染（不存在怎么办？必须有！）","                    try {","                        instance.render(function(error, instance) {","                            // 异步待处理 TODO","                            if (error) {","                                deferred.reject(error)","                                if (callback) callback(error, instance)","                            }","                            // next()","                        })","                    } catch (error) {","                        deferred.reject(error)","                        if (callback) callback(error, instance)","                    }","                    console.log(label, 'render')","                    next()","                })","                .queue(function(next) {","                    // 绑定测试事件","                    Util.each(Constant.EVENTS, function(type) {","                        if (instance.on) {","                            instance.on(type + Constant.LOADER_NAMESPACE, function(event) {","                                console.log(label, event.type)","                            })","                        }","                    })","                    next()","                    // .delay(100, queueName) // 每个组件之间的渲染间隔 100ms，方便观察","                })","                .queue(function(next) {","                    // 6. 绑定事件","                    // 从初始的关联元素上解析事件配置项 bx-type，然后逐个绑定到最终的关联元素上。","                    // 以 Dropdown 为例，初试的关联元素是 <select>，最终的关联元素却是 <div class=\"dropdown\">","                    // 这是用户关注的事件。","                    if (instance.on) {","                        Util.each(options.events, function(item /*, index*/ ) {","                            // item: { target type handler fn params }","                            instance.on(item.type + Constant.LOADER_NAMESPACE, function(event, extraParameters) {","                                if (item.fn in instance) {","                                    instance[item.fn].apply(","                                        instance, (extraParameters ? [extraParameters] : [event]).concat(item.params)","                                    )","                                } else {","                                    /* jshint evil:true */","                                    eval(item.handler)","                                }","                            })","                        })","                    }","                    // 从最终的关联元素上解析事件配置项 bx-type，然后逐个绑定。","                    // if (instance.delegateBxTypeEvents) instance.delegateBxTypeEvents()","                    next()","                })","                .queue(function(next) {","                    // 检测是否有后代组件","                    var descendants = element.getElementsByTagName('*')","                    var hasBrixElement = false","                    Util.each(descendants, function(descendant /*, index*/ ) {","                        if (descendant.nodeType !== 1) return","                        if (!hasBrixElement &&","                            descendant.getAttribute(Constant.ATTRS.id)) {","                            hasBrixElement = true","                        }","                    })","                    // 7. 如果有后代组件，则递归加载","                    if (hasBrixElement) {","                        boot(instance).then(function() {","                            next()","                        })","                    } else {","                        // 如果没有后代组件，那么此时当前组件已经就绪。","                        next()","                    }","                })","                .queue(function( /*next*/ ) {","                    // 8. 当前组件和后代组件的渲染都完成后，触发 ready 事件","                    if (instance.triggerHandler) {","                        instance.triggerHandler(Constant.EVENTS.ready)","                    }","                    deferred.resolve(instance)","                    if (callback) callback(undefined, instance)","                })","                .dequeue()","","            return promise","        }","","        /*","            ## destroy(instance)","            ","            * destroy(Query)","            * destroy(brix)","            * destroy(element)","            * destroy(clientId)","","            销毁某个组件，包括它的后代组件。","        */","        function destroy(instance) {","            if (!instance) return this","","            // destroy(clientId)","            if (Util.isNumber(instance)) instance = CACHE[instance]","","            // destroy( Loader.Query() )","            if (instance.isQuery) {","                Util.each(instance.toArray(), function(element) {","                    destroy(element)","                })","                return","            }","","            // destroy(element)","            if (instance.nodeType === 1) {","                instance = CACHE[","                    instance.getAttribute(Constant.ATTRS.cid)","                ]","            }","","            // 如果已经被移除，则立即返回","            if (!instance) return this","","            // 先递归销毁后代组件","            if (instance.childClientIds.length) {","                Util.each(instance.childClientIds, function(clientId) {","                    destroy(clientId)","                })","            }","","            // 调用自定义销毁行为","            if (instance._destroy) instance._destroy()","","            // 从缓存中移除","            delete CACHE[instance.clientId]","","            // 取消与父组件的关联","            var parent = CACHE[instance.parentClientId]","            if (parent) {","                parent.childClientIds = Util.without(parent.childClientIds, instance.clientId)","            }","","            // 触发 destroy 事件","            // 在移除关联的节点后，无法再继续利用浏览器事件模型来传播和触发事件，所以在移除前先触发 destroy 事件。","            instance.triggerHandler(Constant.EVENTS.destroy)","","            // 在当前组件关联的元素上，移除所有由 Loader 绑定的事件监听函数。","            if (instance.off) {","                Util.each(instance.options.events, function(item /*, index*/ ) {","                    instance.off(item.type + Constant.LOADER_NAMESPACE)","                })","            }","            // 从 DOM 树中移除当前组件关联的元素。","            if (instance.element.parentNode) {","                instance.element.parentNode.removeChild(instance.element)","            }","","            console.log('module', instance.moduleId, instance.clientId, 'destroy')","","            return this","        }","","        // 加载模块","        /*","            load(moduleId [, callback( error, BrixImpl )])","        */","        function load(moduleId, callback) {","            // console.log('function', arguments.callee.name, moduleId)","            var deferred = Util.defer()","            var promise = deferred.promise","            require([moduleId], function(BrixImpl) {","                // setTimeout(function() {","                deferred.resolve(BrixImpl)","                if (callback) callback(undefined, BrixImpl)","                    // }, 0)","            })","            promise.then(undefined, console.error)","            return promise","        }","","        // 缓存组件","        function cache(instance) {","            // 缓存起来","            CACHE[instance.clientId] = instance","            // 关联父组件","            var parent = CACHE[instance.parentClientId]","            if (parent) parent.childClientIds.push(instance.clientId)","        }","","        /*","            * query(element)","            * query(moduleId)","","            根据模块标识符 moduleId 查找组件实例。","            该方法的返回值是一个数组，包含了一组 Brix 组件实例，并且，数组上含有所有 Brix 组件实例的方法。","         */","        function query(moduleId) {","            var results = []","            var methods = []","","            // 1. 根据 element 查找组件实例","            // query(element)","            if (moduleId.nodeType) {","                results.push(","                    CACHE[","                        moduleId.getAttribute(Constant.ATTRS.cid)","                    ]","                )","            }","","            // 1. 根据 moduleId 查找组件实例","            // query(moduleId)","            if (Util.isNumber(moduleId)) {","                Util.each(CACHE, function(instance /*, index*/ ) {","                    if (instance.moduleId === moduleId) {","                        results.push(instance)","                        // 收集组件方法","                        Util.each(instance.constructor.prototype, function(value, name) {","                            if (Util.isFunction(value)) methods.push(name)","                        })","                    }","                })","            }","","","            // 2. 绑定组件方法至 query() 返回的对象上","            Util.each(Util.unique(methods), function(name /*, index*/ ) {","                results[name] = function() {","                    var args = [].slice.call(arguments)","                    Util.each(this, function(instance) {","                        if (!instance[name]) return","                        instance[name].apply(instance, args)","                    })","                }","            })","","            return results","        }","","        /*","            CACHE {","                uuid: {","                    clientId: uuid","                    parentClientId: uuid,","                    instance: brix","                }","            }","            return {","                name: root,","                children: [","                    {","                        name: moduleId + ',' + clientId,","                        children: [","                            {","                                name","                                children","                            }","                        ]","                    }","                ]","            }","        */","        function tree() {","            var result = {","                name: 'root',","                children: []","            }","","            function _parseChildren(parentClientId, children) {","                Util.each(CACHE, function(item) {","                    if (item.parentClientId === parentClientId) {","                        children.push({","                            name: item.moduleId + ',' + item.clientId,","                            module: item,","                            children: _parseChildren(item.clientId, [])","                        })","                    }","                })","                return children","            }","","            _parseChildren(Constant.ROOT_CLIENT_ID, result.children)","","            return result","        }","","        return {","            CACHE: CACHE,","            boot: boot,","            init: init,","            destroy: destroy,","            query: query,","            tree: tree,","","            Util: Util,","            Constant: Constant,","            Options: Options","        }","    }",");"]);
/* global define */
_$jscmd("dist/loader.js", "line", 3);

define("constant", [], function() {
    _$jscmd("dist/loader.js", "line", 4);
    var VERSION = "0.0.1";
    _$jscmd("dist/loader.js", "line", 5);
    var EXPANDO = (_$jscmd("dist/loader.js", "cond", "5_19_13", Math.random()) + "").replace(/\D/g, "");
    _$jscmd("dist/loader.js", "line", 6);
    return {
        VERSION: VERSION,
        // Loader
        ROOT_CLIENT_ID: -1,
        ATTRS: {
            id: "bx-id",
            cid: "bx-cid",
            options: "bx-options"
        },
        SELECTORS: {
            id: "[bx-id]",
            cid: "[bx-cid]",
            options: "[bx-options]"
        },
        EVENTS: {
            ready: "ready",
            destroy: "destroy"
        },
        OPTIONS: [ "element", // 组件关联的节点
        "moduleId", // 组件的模块标识符
        "clientId", // 组件实例的标识符
        "parentClientId", // 父组件实例的标识符
        "childClientIds", // 父组件实例的标识符数组
        "data", // 组件关联的数据
        "template" ],
        EXPANDO: _$jscmd("dist/loader.js", "cond", "33_17_16", "Brix" + _$jscmd("dist/loader.js", "cond", "33_26_7", VERSION)) + _$jscmd("dist/loader.js", "cond", "33_36_7", EXPANDO),
        UUID: 0,
        // Event
        RE_EVENT: /bx\-(?!id|cid|options)(.+)/,
        FN_ARGS: /([^()]+)(?:\((.*?)\))?/,
        LOADER_NAMESPACE: "._loader",
        COMPONENT_NAMESPACE: "._component",
        PREFIX: "bx-"
    };
});

_$jscmd("dist/loader.js", "line", 51);

/* global define        */
/* global setTimeout    */
/*
    Brix Loader Utility Functions
    
    http://underscorejs.org/
*/
define("util", [], function() {
    _$jscmd("dist/loader.js", "line", 53);
    var _ = {};
    _$jscmd("dist/loader.js", "line", 55);
    var slice = Array.prototype.slice;
    _$jscmd("dist/loader.js", "line", 56);
    var concat = Array.prototype.concat;
    _$jscmd("dist/loader.js", "line", 57);
    var toString = Object.prototype.toString;
    _$jscmd("dist/loader.js", "line", 58);
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    _$jscmd("dist/loader.js", "line", 65);
    // Collection Functions
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    _.each = function(obj, iterator, context) {
        if (_$jscmd("dist/loader.js", "cond", "66_12_12", _$jscmd("dist/loader.js", "cond", "66_12_3", obj) === null) || _$jscmd("dist/loader.js", "cond", "66_28_17", _$jscmd("dist/loader.js", "cond", "66_28_3", obj) === _$jscmd("dist/loader.js", "cond", "66_36_9", undefined))) return obj;
        if (obj.forEach) {
            _$jscmd("dist/loader.js", "line", 68);
            obj.forEach(iterator, context);
        } else if (_$jscmd("dist/loader.js", "cond", "69_19_10", obj.length) === _$jscmd("dist/loader.js", "cond", "69_34_11", +obj.length)) {
            for (var i = 0, length = obj.length; _$jscmd("dist/loader.js", "cond", "70_49_1", i) < _$jscmd("dist/loader.js", "cond", "70_53_6", length); i++) {
                _$jscmd("dist/loader.js", "line", 71);
                iterator.call(context, obj[i], i, obj);
            }
        } else {
            for (var prop in obj) {
                _$jscmd("dist/loader.js", "line", 75);
                iterator.call(context, obj[prop], prop, obj);
            }
        }
        _$jscmd("dist/loader.js", "line", 78);
        return obj;
    };
    _$jscmd("dist/loader.js", "line", 83);
    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = function(obj, iterator, context) {
        _$jscmd("dist/loader.js", "line", 84);
        var results = [];
        if (_$jscmd("dist/loader.js", "cond", "85_12_12", _$jscmd("dist/loader.js", "cond", "85_12_3", obj) === null) || _$jscmd("dist/loader.js", "cond", "85_28_17", _$jscmd("dist/loader.js", "cond", "85_28_3", obj) === _$jscmd("dist/loader.js", "cond", "85_36_9", undefined))) return results;
        if (_$jscmd("dist/loader.js", "cond", "86_12_7", obj.map) === _$jscmd("dist/loader.js", "cond", "86_24_19", Array.prototype.map)) return obj.map(iterator, context);
        _$jscmd("dist/loader.js", "line", 87);
        _.each(obj, function(value, index, list) {
            _$jscmd("dist/loader.js", "line", 88);
            results.push(iterator.call(context, value, index, list));
        });
        _$jscmd("dist/loader.js", "line", 90);
        return results;
    };
    _$jscmd("dist/loader.js", "line", 95);
    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
        _$jscmd("dist/loader.js", "line", 96);
        var results = [];
        _$jscmd("dist/loader.js", "line", 97);
        var args = slice.call(arguments, 1);
        _$jscmd("dist/loader.js", "line", 98);
        _.each(array, function(item) {
            _$jscmd("dist/loader.js", "line", 99);
            var contains = false;
            _$jscmd("dist/loader.js", "line", 100);
            _.each(args, function(arg) {
                if (_$jscmd("dist/loader.js", "cond", "101_20_9", !contains) && _$jscmd("dist/loader.js", "cond", "101_33_14", _$jscmd("dist/loader.js", "cond", "101_34_3", arg) === _$jscmd("dist/loader.js", "cond", "101_42_4", item))) contains = true;
            });
            if (!contains) results.push(item);
        });
        _$jscmd("dist/loader.js", "line", 105);
        return results;
    };
    _$jscmd("dist/loader.js", "line", 109);
    // Produce a duplicate-free version of the array. 
    _.unique = function(array) {
        _$jscmd("dist/loader.js", "line", 110);
        var results = [];
        _$jscmd("dist/loader.js", "line", 111);
        _.each(array.sort(), function(item, index) {
            if (_$jscmd("dist/loader.js", "cond", "112_16_11", _$jscmd("dist/loader.js", "cond", "112_16_5", index) === 0) || _$jscmd("dist/loader.js", "cond", "112_31_25", _$jscmd("dist/loader.js", "cond", "112_31_4", item) !== _$jscmd("dist/loader.js", "cond", "112_40_16", array[_$jscmd("dist/loader.js", "cond", "112_46_5", index) - 1]))) results.push(item);
        });
        _$jscmd("dist/loader.js", "line", 115);
        return results;
    };
    _$jscmd("dist/loader.js", "line", 119);
    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
        _$jscmd("dist/loader.js", "line", 120);
        var copy = {};
        _$jscmd("dist/loader.js", "line", 121);
        var keys = concat.apply([], slice.call(arguments, 1));
        _$jscmd("dist/loader.js", "line", 122);
        _.each(keys, function(key) {
            if (_$jscmd("dist/loader.js", "cond", "123_16_3", key) in _$jscmd("dist/loader.js", "cond", "123_23_3", obj)) copy[key] = obj[key];
        });
        _$jscmd("dist/loader.js", "line", 125);
        return copy;
    };
    _$jscmd("dist/loader.js", "line", 131);
    // Object Functions
    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
        _$jscmd("dist/loader.js", "line", 132);
        _.each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    _$jscmd("dist/loader.js", "line", 135);
                    obj[prop] = source[prop];
                }
            }
        });
        _$jscmd("dist/loader.js", "line", 139);
        return obj;
    };
    _$jscmd("dist/loader.js", "line", 144);
    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (Object.keys) return Object.keys(obj);
        _$jscmd("dist/loader.js", "line", 147);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        _$jscmd("dist/loader.js", "line", 150);
        return keys;
    };
    _$jscmd("dist/loader.js", "line", 154);
    // Retrieve the values of an object's properties.
    _.values = function(obj) {
        _$jscmd("dist/loader.js", "line", 155);
        var keys = keys(obj);
        _$jscmd("dist/loader.js", "line", 156);
        var length = keys.length;
        _$jscmd("dist/loader.js", "line", 157);
        var values = new Array(length);
        for (var i = 0; _$jscmd("dist/loader.js", "cond", "158_24_1", i) < _$jscmd("dist/loader.js", "cond", "158_28_6", length); i++) {
            _$jscmd("dist/loader.js", "line", 159);
            values[i] = obj[keys[i]];
        }
        _$jscmd("dist/loader.js", "line", 161);
        return values;
    };
    _$jscmd("dist/loader.js", "line", 165);
    // Is a given value a DOM element?
    _.isElement = function(obj) {
        _$jscmd("dist/loader.js", "line", 166);
        return !!(_$jscmd("dist/loader.js", "cond", "166_18_3", obj) && _$jscmd("dist/loader.js", "cond", "166_25_18", _$jscmd("dist/loader.js", "cond", "166_25_12", obj.nodeType) === 1));
    };
    _$jscmd("dist/loader.js", "line", 170);
    // Add some isType methods
    _.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(name) {
        _$jscmd("dist/loader.js", "line", 171);
        _["is" + _$jscmd("dist/loader.js", "cond", "171_17_4", name)] = function(obj) {
            _$jscmd("dist/loader.js", "line", 172);
            return _$jscmd("dist/loader.js", "cond", "172_19_18", toString.call(obj)) == _$jscmd("dist/loader.js", "cond", "172_41_23", _$jscmd("dist/loader.js", "cond", "172_41_17", "[object " + _$jscmd("dist/loader.js", "cond", "172_54_4", name)) + "]");
        };
    });
    _$jscmd("dist/loader.js", "line", 177);
    // Is a given object a finite number?
    _.isFinite = function(obj) {
        _$jscmd("dist/loader.js", "line", 178);
        return _$jscmd("dist/loader.js", "cond", "178_15_13", isFinite(obj)) && _$jscmd("dist/loader.js", "cond", "178_32_23", !isNaN(parseFloat(obj)));
    };
    _$jscmd("dist/loader.js", "line", 182);
    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
        _$jscmd("dist/loader.js", "line", 183);
        return _$jscmd("dist/loader.js", "cond", "183_15_15", _.isNumber(obj)) && _$jscmd("dist/loader.js", "cond", "183_34_11", _$jscmd("dist/loader.js", "cond", "183_34_3", obj) != _$jscmd("dist/loader.js", "cond", "183_41_4", +obj));
    };
    _$jscmd("dist/loader.js", "line", 187);
    // Is a given value a boolean?
    _.isBoolean = function(obj) {
        _$jscmd("dist/loader.js", "line", 188);
        return _$jscmd("dist/loader.js", "cond", "188_15_29", _$jscmd("dist/loader.js", "cond", "188_15_12", _$jscmd("dist/loader.js", "cond", "188_15_3", obj) === true) || _$jscmd("dist/loader.js", "cond", "188_31_13", _$jscmd("dist/loader.js", "cond", "188_31_3", obj) === false)) || _$jscmd("dist/loader.js", "cond", "188_48_40", _$jscmd("dist/loader.js", "cond", "188_48_18", toString.call(obj)) == "[object Boolean]");
    };
    _$jscmd("dist/loader.js", "line", 192);
    // Is a given value equal to null?
    _.isNull = function(obj) {
        _$jscmd("dist/loader.js", "line", 193);
        return _$jscmd("dist/loader.js", "cond", "193_15_3", obj) === null;
    };
    _$jscmd("dist/loader.js", "line", 197);
    // Is a given variable undefined?
    _.isUndefined = function(obj) {
        _$jscmd("dist/loader.js", "line", 198);
        return _$jscmd("dist/loader.js", "cond", "198_15_3", obj) === _$jscmd("dist/loader.js", "cond", "198_23_6", void 0);
    };
    _$jscmd("dist/loader.js", "line", 203);
    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
        _$jscmd("dist/loader.js", "line", 204);
        return hasOwnProperty.call(obj, key);
    };
    // Queue 实现
    function Queue() {
        _$jscmd("dist/loader.js", "line", 210);
        this.list = [];
    }
    _$jscmd("dist/loader.js", "line", 212);
    Queue.prototype = {
        queue: function(fn) {
            _$jscmd("dist/loader.js", "line", 214);
            this.list.push(fn);
            _$jscmd("dist/loader.js", "line", 215);
            return this;
        },
        dequeue: function() {
            _$jscmd("dist/loader.js", "line", 218);
            var that = this;
            _$jscmd("dist/loader.js", "line", 219);
            var fn = this.list.shift();
            if (fn) fn(next);
            function next() {
                _$jscmd("dist/loader.js", "line", 223);
                that.dequeue();
            }
            _$jscmd("dist/loader.js", "line", 225);
            return this;
        },
        delay: function(time) {
            _$jscmd("dist/loader.js", "line", 228);
            return this.queue(function(next) {
                _$jscmd("dist/loader.js", "line", 229);
                setTimeout(next, time);
            });
        },
        clear: function() {
            _$jscmd("dist/loader.js", "line", 233);
            this.list = [];
            _$jscmd("dist/loader.js", "line", 234);
            return this;
        }
    };
    _$jscmd("dist/loader.js", "line", 238);
    _.queue = function() {
        _$jscmd("dist/loader.js", "line", 239);
        return new Queue();
    };
    // Promise 实现
    function Deferred() {
        _$jscmd("dist/loader.js", "line", 245);
        var that = this;
        _$jscmd("dist/loader.js", "line", 246);
        this.state = "pending";
        _$jscmd("dist/loader.js", "line", 247);
        // resolved rejected
        this.resolvedList = [];
        _$jscmd("dist/loader.js", "line", 248);
        this.resolvedListIndex = 0;
        _$jscmd("dist/loader.js", "line", 249);
        this.rejectedList = [];
        _$jscmd("dist/loader.js", "line", 250);
        this.rejectedListIndex = 0;
        _$jscmd("dist/loader.js", "line", 251);
        this.progressedList = [];
        _$jscmd("dist/loader.js", "line", 252);
        this.progressedListIndex = 0;
        _$jscmd("dist/loader.js", "line", 253);
        this.promise = {
            then: function() {
                _$jscmd("dist/loader.js", "line", 255);
                that.then.apply(that, arguments);
                _$jscmd("dist/loader.js", "line", 256);
                return this;
            },
            "finally": function() {
                _$jscmd("dist/loader.js", "line", 259);
                that.finally.apply(that, arguments);
                _$jscmd("dist/loader.js", "line", 260);
                return this;
            }
        };
    }
    _$jscmd("dist/loader.js", "line", 264);
    Deferred.prototype = {
        then: function(resolved, rejected, progressed) {
            if (resolved) {
                if (resolved.finally) this.resolvedList.push(resolved); else this.resolvedList.splice(this.resolvedListIndex++, 0, resolved);
            }
            if (rejected) {
                if (rejected.finally) this.rejectedList.push(rejected); else this.rejectedList.splice(this.rejectedListIndex++, 0, rejected);
            }
            if (progressed) this.progressedList.push(progressed);
            if (_$jscmd("dist/loader.js", "cond", "276_16_25", _$jscmd("dist/loader.js", "cond", "276_16_10", this.state) === "resolved") && _$jscmd("dist/loader.js", "cond", "276_45_8", resolved)) resolved(this.args);
            if (_$jscmd("dist/loader.js", "cond", "277_16_25", _$jscmd("dist/loader.js", "cond", "277_16_10", this.state) === "rejected") && _$jscmd("dist/loader.js", "cond", "277_45_8", rejected)) rejected(this.args);
            _$jscmd("dist/loader.js", "line", 278);
            return this;
        },
        resolve: function(value) {
            _$jscmd("dist/loader.js", "line", 281);
            this.args = value;
            if (_$jscmd("dist/loader.js", "cond", "283_16_10", this.state) !== "pending") return this;
            _$jscmd("dist/loader.js", "line", 285);
            this.state = "resolved";
            for (var i = 0; _$jscmd("dist/loader.js", "cond", "286_28_1", i) < _$jscmd("dist/loader.js", "cond", "286_32_24", this.resolvedList.length); i++) {
                _$jscmd("dist/loader.js", "line", 287);
                this.resolvedList[i](value);
            }
            _$jscmd("dist/loader.js", "line", 289);
            return this;
        },
        reject: function(reason) {
            _$jscmd("dist/loader.js", "line", 292);
            this.args = reason;
            if (_$jscmd("dist/loader.js", "cond", "294_16_10", this.state) !== "pending") return this;
            _$jscmd("dist/loader.js", "line", 296);
            this.state = "rejected";
            for (var i = 0; _$jscmd("dist/loader.js", "cond", "297_28_1", i) < _$jscmd("dist/loader.js", "cond", "297_32_24", this.rejectedList.length); i++) {
                _$jscmd("dist/loader.js", "line", 298);
                this.rejectedList[i](reason);
            }
            _$jscmd("dist/loader.js", "line", 300);
            return this;
        },
        notify: function(progress) {
            for (var i = 0; _$jscmd("dist/loader.js", "cond", "303_28_1", i) < _$jscmd("dist/loader.js", "cond", "303_32_26", this.progressedList.length); i++) {
                _$jscmd("dist/loader.js", "line", 304);
                this.progressedList[i](progress);
            }
            _$jscmd("dist/loader.js", "line", 306);
            return this;
        },
        "finally": function(callback) {
            _$jscmd("dist/loader.js", "line", 309);
            callback.finally = true;
            _$jscmd("dist/loader.js", "line", 310);
            return this.then(callback, callback);
        }
    };
    _$jscmd("dist/loader.js", "line", 314);
    _.defer = function() {
        _$jscmd("dist/loader.js", "line", 315);
        return new Deferred();
    };
    _$jscmd("dist/loader.js", "line", 318);
    return _;
});

_$jscmd("dist/loader.js", "line", 322);

/* global define  */
define("option", [ "constant", "util" ], function(Constant, Util) {
    /*
            解析配置项 bx-options
        */
    function parseOptions(element) {
        _$jscmd("dist/loader.js", "line", 335);
        var options;
        _$jscmd("dist/loader.js", "line", 336);
        var parent, moduleId, clientId, parentClientId;
        _$jscmd("dist/loader.js", "line", 340);
        // 如果没有模块标识符，则无需（也无法）加载，立即返回
        moduleId = element.getAttribute(Constant.ATTRS.id);
        if (!moduleId) return;
        _$jscmd("dist/loader.js", "line", 344);
        // 为组件关联的 DOM 节点分配唯一标识
        clientId = Constant.UUID++;
        if (!element.getAttribute(Constant.ATTRS.cid)) element.setAttribute(Constant.ATTRS.cid, clientId);
        _$jscmd("dist/loader.js", "line", 348);
        // 查找父节点
        parent = element;
        do {
            _$jscmd("dist/loader.js", "line", 350);
            parent = parent.parentNode;
        } while (_$jscmd("dist/loader.js", "cond", "352_16_107", _$jscmd("dist/loader.js", "cond", "352_16_49", _$jscmd("dist/loader.js", "cond", "352_16_6", parent) && _$jscmd("dist/loader.js", "cond", "353_16_23", _$jscmd("dist/loader.js", "cond", "353_17_15", parent.nodeType) !== 9)) && _$jscmd("dist/loader.js", "cond", "354_16_24", // Document 9
        _$jscmd("dist/loader.js", "cond", "354_17_15", parent.nodeType) !== 11)) && _$jscmd("dist/loader.js", "cond", "355_16_40", // DocumentFragment 11
        !parent.getAttribute(Constant.ATTRS.cid)));
        if (_$jscmd("dist/loader.js", "cond", "357_16_6", parent) && _$jscmd("dist/loader.js", "cond", "357_26_21", _$jscmd("dist/loader.js", "cond", "357_26_15", parent.nodeType) === 1)) parentClientId = +parent.getAttribute(Constant.ATTRS.cid); else parentClientId = Constant.ROOT_CLIENT_ID;
        _$jscmd("dist/loader.js", "line", 361);
        // 配置项集合
        options = element.getAttribute(Constant.ATTRS.options);
        try {
            _$jscmd("dist/loader.js", "line", 364);
            /* jshint evil:true */
            options = options ? _$jscmd("dist/loader.js", "cond", "364_36_37", new Function("return " + _$jscmd("dist/loader.js", "cond", "364_62_7", options))()) : _$jscmd("dist/loader.js", "cond", "364_76_2", {});
        } catch (exception) {
            _$jscmd("dist/loader.js", "line", 366);
            options = {};
        }
        _$jscmd("dist/loader.js", "line", 368);
        options.element = element;
        _$jscmd("dist/loader.js", "line", 369);
        options.moduleId = moduleId;
        _$jscmd("dist/loader.js", "line", 370);
        options.clientId = clientId;
        _$jscmd("dist/loader.js", "line", 371);
        options.parentClientId = parentClientId;
        _$jscmd("dist/loader.js", "line", 372);
        options.childClientIds = [];
        _$jscmd("dist/loader.js", "line", 373);
        options.events = parseBxEvents(element);
        _$jscmd("dist/loader.js", "line", 375);
        return options;
    }
    function parseBxEvents(element, deep) {
        if (_$jscmd("dist/loader.js", "cond", "379_16_17", !element.nodeType) && _$jscmd("dist/loader.js", "cond", "379_37_14", element.length)) element = element[0];
        _$jscmd("dist/loader.js", "line", 380);
        var elements = deep ? _$jscmd("dist/loader.js", "cond", "380_34_33", element.getElementsByTagName("*")) : _$jscmd("dist/loader.js", "cond", "380_70_9", [ element ]);
        _$jscmd("dist/loader.js", "line", 381);
        var events = [];
        _$jscmd("dist/loader.js", "line", 382);
        Util.each(elements, function(element) {
            _$jscmd("dist/loader.js", "line", 383);
            Util.each(element.attributes, function(attribute) {
                _$jscmd("dist/loader.js", "line", 384);
                var ma = Constant.RE_EVENT.exec(attribute.name);
                if (ma) {
                    _$jscmd("dist/loader.js", "line", 386);
                    var item = {
                        target: element,
                        type: ma[1],
                        handler: attribute.value
                    };
                    _$jscmd("dist/loader.js", "line", 391);
                    Util.extend(item, parseFnAndParams(attribute.value));
                    _$jscmd("dist/loader.js", "line", 392);
                    events.push(item);
                }
            });
        });
        _$jscmd("dist/loader.js", "line", 396);
        return events;
    }
    function parsetBxTypes(element, deep) {
        _$jscmd("dist/loader.js", "line", 400);
        return Util.unique(Util.map(parseBxEvents(element, deep), function(item) {
            _$jscmd("dist/loader.js", "line", 402);
            return item.type;
        }));
    }
    function parseFnAndParams(handler) {
        _$jscmd("dist/loader.js", "line", 408);
        var parts = Constant.FN_ARGS.exec(handler);
        _$jscmd("dist/loader.js", "line", 409);
        var fn;
        _$jscmd("dist/loader.js", "line", 410);
        var params;
        if (_$jscmd("dist/loader.js", "cond", "411_16_5", parts) && _$jscmd("dist/loader.js", "cond", "411_25_8", parts[1])) {
            _$jscmd("dist/loader.js", "line", 412);
            fn = parts[1];
            _$jscmd("dist/loader.js", "line", 413);
            params = _$jscmd("dist/loader.js", "cond", "413_25_8", parts[2]) || "";
            try {
                _$jscmd("dist/loader.js", "line", 417);
                // 1. 尝试保持参数的类型 
                /* jshint -W061 */
                params = eval(_$jscmd("dist/loader.js", "cond", "417_34_64", "(function(){ return [].splice.call(arguments, 0 ) })(" + _$jscmd("dist/loader.js", "cond", "417_92_6", params)) + ")");
            } catch (error) {
                _$jscmd("dist/loader.js", "line", 420);
                // 2. 如果失败，只能解析为字符串
                params = parts[2].split(/,\s*/);
            }
            _$jscmd("dist/loader.js", "line", 422);
            return {
                fn: fn,
                params: params
            };
        }
        _$jscmd("dist/loader.js", "line", 427);
        return {};
    }
    _$jscmd("dist/loader.js", "line", 430);
    return {
        parseOptions: parseOptions,
        parseBxEvents: parseBxEvents,
        parsetBxTypes: parsetBxTypes,
        parseFnAndParams: parseFnAndParams
    };
});

_$jscmd("dist/loader.js", "line", 467);

/* global define        */
/* global require       */
/* global document      */
/* global console       */
/*
    ## Brix Loader
    
    组件加载器，负责管理 Brix Component 的整个生命周期，包括加载、初始化、渲染、销毁。


    解析组件配置、解析组件树、加载组件
    初始化组件、缓存组件、初始化事件
    
    方法、属性、事件
    数据、模板（展现 HTML）、行为（JavaScript（事件））、样式（CSS）

    Q.js
        https://github.com/kriskowal/q
        http://documentup.com/kriskowal/q/#getting-started
        https://github.com/kriskowal/q/wiki/API-Reference#qdefer
        https://github.com/bellbind/using-promise-q/

    http://gitlab.alibaba-inc.com/river/spec/blob/master/JSON-Schema.md
    http://gitlab.alibaba-inc.com/limu/brix-central/wikis/BCD
    
    http://etaoux.github.io/brix/
    https://github.com/etaoux/brix/issues
    http://etaoux.github.io/brix/duck/#!/api/Brix.Gallery.Dropdown
*/
define("loader", [ "constant", "option", "util" ], function(Constant, Options, Util) {
    _$jscmd("dist/loader.js", "line", 479);
    var CACHE = {};
    /*
            boot( context, callback )
            
            * boot()
            * boot(brixImpl)
            * boot(element)

            初始化节点 context 以及节点 context 内的所有组件。
            简：初始化所有组件。
        */
    function boot(context, callback) {
        _$jscmd("dist/loader.js", "line", 493);
        // console.log('function', arguments.callee.name, context && context.element)
        context = _$jscmd("dist/loader.js", "cond", "493_22_37", _$jscmd("dist/loader.js", "cond", "493_22_26", _$jscmd("dist/loader.js", "cond", "493_22_7", context) && _$jscmd("dist/loader.js", "cond", "493_33_15", context.element)) || _$jscmd("dist/loader.js", "cond", "493_52_7", context)) || _$jscmd("dist/loader.js", "cond", "493_63_8", document);
        _$jscmd("dist/loader.js", "line", 495);
        var deferred = Util.defer();
        _$jscmd("dist/loader.js", "line", 496);
        var queue = Util.queue();
        _$jscmd("dist/loader.js", "line", 499);
        // 1. 查找组件节点 [bx-id]
        var elements = function() {
            _$jscmd("dist/loader.js", "line", 500);
            var elements = [];
            if (_$jscmd("dist/loader.js", "cond", "501_20_22", _$jscmd("dist/loader.js", "cond", "501_20_16", context.nodeType) === 1) && _$jscmd("dist/loader.js", "cond", "501_46_39", context.getAttribute(Constant.ATTRS.id))) elements.push(context);
            _$jscmd("dist/loader.js", "line", 502);
            var descendants = context.getElementsByTagName("*");
            _$jscmd("dist/loader.js", "line", 503);
            Util.each(descendants, function(descendant) {
                if (_$jscmd("dist/loader.js", "cond", "504_24_19", descendant.nodeType) !== 1) return;
                if (descendant.getAttribute(Constant.ATTRS.id)) elements.push(descendant);
            });
            _$jscmd("dist/loader.js", "line", 507);
            return elements;
        }();
        _$jscmd("dist/loader.js", "line", 511);
        // 2. 顺序把初始化任务放入队列
        Util.each(elements, function(element) {
            _$jscmd("dist/loader.js", "line", 512);
            queue.queue(function(next) {
                _$jscmd("dist/loader.js", "line", 514);
                init(element).then(undefined, function(reason) {
                    _$jscmd("dist/loader.js", "line", 516);
                    console.error(reason.stack);
                }).finally(function() {
                    _$jscmd("dist/loader.js", "line", 518);
                    next();
                });
            });
        });
        _$jscmd("dist/loader.js", "line", 525);
        // 3. 逐个出队，执行初始化任务
        // 4. 全部任务执行完成（无论成败）
        queue.queue(function() {
            _$jscmd("dist/loader.js", "line", 527);
            deferred.resolve(context);
            if (callback) callback(context);
        }).dequeue();
        _$jscmd("dist/loader.js", "line", 532);
        // 开始
        return deferred.promise;
    }
    /*
            init(element)

            * init(element [, callback( error, instance )])

            初始化元素 element 关联的组件。
            简：初始化单个组件。
        */
    function init(element, callback) {
        _$jscmd("dist/loader.js", "line", 546);
        // console.log('function', arguments.callee.name, element)
        var deferred = Util.defer();
        _$jscmd("dist/loader.js", "line", 547);
        var promise = deferred.promise;
        _$jscmd("dist/loader.js", "line", 548);
        var queue = Util.queue();
        _$jscmd("dist/loader.js", "line", 551);
        // 如果已经被初始化，则立即返回
        var clientId = element.getAttribute(Constant.ATTRS.cid);
        if (clientId) {
            _$jscmd("dist/loader.js", "line", 553);
            deferred.resolve(CACHE[clientId]);
            if (callback) callback(undefined, CACHE[clientId]);
            _$jscmd("dist/loader.js", "line", 555);
            return promise;
        }
        _$jscmd("dist/loader.js", "line", 559);
        // 1. 解析配置项
        var options = Options.parseOptions(element);
        _$jscmd("dist/loader.js", "line", 560);
        var BrixImpl, instance;
        _$jscmd("dist/loader.js", "line", 562);
        var label = _$jscmd("dist/loader.js", "cond", "562_24_34", _$jscmd("dist/loader.js", "cond", "562_24_28", "module " + _$jscmd("dist/loader.js", "cond", "562_36_16", options.moduleId)) + " ") + _$jscmd("dist/loader.js", "cond", "562_61_16", options.clientId);
        _$jscmd("dist/loader.js", "line", 563);
        console.group(label);
        _$jscmd("dist/loader.js", "line", 564);
        console.time(label);
        _$jscmd("dist/loader.js", "line", 565);
        promise.finally(function() {
            _$jscmd("dist/loader.js", "line", 566);
            console.timeEnd(label);
            _$jscmd("dist/loader.js", "line", 567);
            console.groupEnd(label);
        });
        _$jscmd("dist/loader.js", "line", 570);
        queue.queue(function(next) {
            _$jscmd("dist/loader.js", "line", 573);
            // 2. 加载组件模块
            load(options.moduleId).then(function(impl) {
                _$jscmd("dist/loader.js", "line", 575);
                BrixImpl = impl;
                _$jscmd("dist/loader.js", "line", 576);
                next();
            });
        }).queue(function(next) {
            try {
                _$jscmd("dist/loader.js", "line", 582);
                // 3. 创建组件实例
                instance = new BrixImpl(options);
                _$jscmd("dist/loader.js", "line", 584);
                // 设置属性 options
                instance.options = _$jscmd("dist/loader.js", "cond", "584_43_16", instance.options) || _$jscmd("dist/loader.js", "cond", "584_63_2", {});
                _$jscmd("dist/loader.js", "line", 585);
                // 转换为实例属性
                Util.extend(instance.options, options);
                _$jscmd("dist/loader.js", "line", 587);
                // 设置其他公共属性
                Util.extend(instance, Util.pick(options, Constant.OPTIONS));
                _$jscmd("dist/loader.js", "line", 588);
                next();
            } catch (error) {
                _$jscmd("dist/loader.js", "line", 590);
                deferred.reject(error);
                if (callback) callback(error, instance);
            }
        }).queue(function(next) {
            _$jscmd("dist/loader.js", "line", 596);
            // 拦截销毁方法
            instance._destroy = instance.destroy;
            _$jscmd("dist/loader.js", "line", 597);
            instance.destroy = function() {
                _$jscmd("dist/loader.js", "line", 598);
                destroy(instance);
            };
            _$jscmd("dist/loader.js", "line", 600);
            next();
        }).queue(function(next) {
            _$jscmd("dist/loader.js", "line", 604);
            // 缓存起来，关联父组件
            cache(instance);
            _$jscmd("dist/loader.js", "line", 605);
            next();
        }).queue(function(next) {
            // 4. 执行初始化
            if (instance.init) instance.init();
            _$jscmd("dist/loader.js", "line", 610);
            console.log(label, "init");
            _$jscmd("dist/loader.js", "line", 611);
            next();
        }).queue(function(next) {
            // 拦截渲染方法
            if (!instance._render) {
                _$jscmd("dist/loader.js", "line", 616);
                instance._render = instance.render;
                _$jscmd("dist/loader.js", "line", 617);
                instance.render = function() {
                    _$jscmd("dist/loader.js", "line", 619);
                    // 如果存在已经被渲染的子组件，则先销毁
                    var hasRenderedChildren;
                    if (instance.childClientIds.length) {
                        _$jscmd("dist/loader.js", "line", 621);
                        hasRenderedChildren = true;
                        _$jscmd("dist/loader.js", "line", 622);
                        Util.each(instance.childClientIds, function(childClientId) {
                            if (CACHE[childClientId]) destroy(childClientId);
                        });
                    }
                    _$jscmd("dist/loader.js", "line", 627);
                    // 调用组件的 .render()
                    instance._render.apply(this, arguments);
                    // 再次渲染子组件
                    if (hasRenderedChildren) {
                        _$jscmd("dist/loader.js", "line", 630);
                        boot(instance.element);
                    }
                    _$jscmd("dist/loader.js", "line", 633);
                    // 同步 clientId
                    var newElement = instance.element;
                    if (_$jscmd("dist/loader.js", "cond", "634_32_19", newElement.nodeType) && _$jscmd("dist/loader.js", "cond", "634_55_44", !newElement.getAttribute(Constant.ATTRS.cid))) {
                        _$jscmd("dist/loader.js", "line", 635);
                        newElement.setAttribute(Constant.ATTRS.cid, options.clientId);
                    } else if (newElement.length) {
                        _$jscmd("dist/loader.js", "line", 637);
                        Util.each(newElement, function(item) {
                            if (_$jscmd("dist/loader.js", "cond", "638_40_13", item.nodeType) && _$jscmd("dist/loader.js", "cond", "638_57_38", !item.getAttribute(Constant.ATTRS.cid))) {
                                _$jscmd("dist/loader.js", "line", 639);
                                item.setAttribute(Constant.ATTRS.cid, options.clientId);
                            }
                        });
                    }
                };
            }
            // 5. 执行渲染（不存在怎么办？必须有！）
            try {
                _$jscmd("dist/loader.js", "line", 647);
                instance.render(function(error, instance) {
                    // 异步待处理 TODO
                    if (error) {
                        _$jscmd("dist/loader.js", "line", 650);
                        deferred.reject(error);
                        if (callback) callback(error, instance);
                    }
                });
            } catch (error) {
                _$jscmd("dist/loader.js", "line", 656);
                deferred.reject(error);
                if (callback) callback(error, instance);
            }
            _$jscmd("dist/loader.js", "line", 659);
            console.log(label, "render");
            _$jscmd("dist/loader.js", "line", 660);
            next();
        }).queue(function(next) {
            _$jscmd("dist/loader.js", "line", 664);
            // 绑定测试事件
            Util.each(Constant.EVENTS, function(type) {
                if (instance.on) {
                    _$jscmd("dist/loader.js", "line", 666);
                    instance.on(_$jscmd("dist/loader.js", "cond", "666_40_4", type) + _$jscmd("dist/loader.js", "cond", "666_47_25", Constant.LOADER_NAMESPACE), function(event) {
                        _$jscmd("dist/loader.js", "line", 667);
                        console.log(label, event.type);
                    });
                }
            });
            _$jscmd("dist/loader.js", "line", 671);
            next();
        }).queue(function(next) {
            // 6. 绑定事件
            // 从初始的关联元素上解析事件配置项 bx-type，然后逐个绑定到最终的关联元素上。
            // 以 Dropdown 为例，初试的关联元素是 <select>，最终的关联元素却是 <div class="dropdown">
            // 这是用户关注的事件。
            if (instance.on) {
                _$jscmd("dist/loader.js", "line", 680);
                Util.each(options.events, function(item) {
                    _$jscmd("dist/loader.js", "line", 682);
                    // item: { target type handler fn params }
                    instance.on(_$jscmd("dist/loader.js", "cond", "682_40_9", item.type) + _$jscmd("dist/loader.js", "cond", "682_52_25", Constant.LOADER_NAMESPACE), function(event, extraParameters) {
                        if (_$jscmd("dist/loader.js", "cond", "683_36_7", item.fn) in _$jscmd("dist/loader.js", "cond", "683_47_8", instance)) {
                            _$jscmd("dist/loader.js", "line", 684);
                            instance[item.fn].apply(instance, (extraParameters ? _$jscmd("dist/loader.js", "cond", "685_69_17", [ extraParameters ]) : _$jscmd("dist/loader.js", "cond", "685_89_7", [ event ])).concat(item.params));
                        } else {
                            _$jscmd("dist/loader.js", "line", 689);
                            /* jshint evil:true */
                            eval(item.handler);
                        }
                    });
                });
            }
            _$jscmd("dist/loader.js", "line", 696);
            // 从最终的关联元素上解析事件配置项 bx-type，然后逐个绑定。
            // if (instance.delegateBxTypeEvents) instance.delegateBxTypeEvents()
            next();
        }).queue(function(next) {
            _$jscmd("dist/loader.js", "line", 700);
            // 检测是否有后代组件
            var descendants = element.getElementsByTagName("*");
            _$jscmd("dist/loader.js", "line", 701);
            var hasBrixElement = false;
            _$jscmd("dist/loader.js", "line", 702);
            Util.each(descendants, function(descendant) {
                if (_$jscmd("dist/loader.js", "cond", "703_28_19", descendant.nodeType) !== 1) return;
                if (_$jscmd("dist/loader.js", "cond", "704_28_15", !hasBrixElement) && _$jscmd("dist/loader.js", "cond", "705_28_42", descendant.getAttribute(Constant.ATTRS.id))) {
                    _$jscmd("dist/loader.js", "line", 706);
                    hasBrixElement = true;
                }
            });
            // 7. 如果有后代组件，则递归加载
            if (hasBrixElement) {
                _$jscmd("dist/loader.js", "line", 711);
                boot(instance).then(function() {
                    _$jscmd("dist/loader.js", "line", 712);
                    next();
                });
            } else {
                _$jscmd("dist/loader.js", "line", 716);
                // 如果没有后代组件，那么此时当前组件已经就绪。
                next();
            }
        }).queue(function() {
            // 8. 当前组件和后代组件的渲染都完成后，触发 ready 事件
            if (instance.triggerHandler) {
                _$jscmd("dist/loader.js", "line", 722);
                instance.triggerHandler(Constant.EVENTS.ready);
            }
            _$jscmd("dist/loader.js", "line", 724);
            deferred.resolve(instance);
            if (callback) callback(undefined, instance);
        }).dequeue();
        _$jscmd("dist/loader.js", "line", 729);
        return promise;
    }
    /*
            ## destroy(instance)
            
            * destroy(Query)
            * destroy(brix)
            * destroy(element)
            * destroy(clientId)

            销毁某个组件，包括它的后代组件。
        */
    function destroy(instance) {
        if (!instance) return this;
        // destroy(clientId)
        if (Util.isNumber(instance)) instance = CACHE[instance];
        // destroy( Loader.Query() )
        if (instance.isQuery) {
            _$jscmd("dist/loader.js", "line", 750);
            Util.each(instance.toArray(), function(element) {
                _$jscmd("dist/loader.js", "line", 751);
                destroy(element);
            });
            _$jscmd("dist/loader.js", "line", 753);
            return;
        }
        // destroy(element)
        if (_$jscmd("dist/loader.js", "cond", "757_16_17", instance.nodeType) === 1) {
            _$jscmd("dist/loader.js", "line", 758);
            instance = CACHE[instance.getAttribute(Constant.ATTRS.cid)];
        }
        // 如果已经被移除，则立即返回
        if (!instance) return this;
        // 先递归销毁后代组件
        if (instance.childClientIds.length) {
            _$jscmd("dist/loader.js", "line", 768);
            Util.each(instance.childClientIds, function(clientId) {
                _$jscmd("dist/loader.js", "line", 769);
                destroy(clientId);
            });
        }
        // 调用自定义销毁行为
        if (instance._destroy) instance._destroy();
        _$jscmd("dist/loader.js", "line", 777);
        // 从缓存中移除
        delete CACHE[instance.clientId];
        _$jscmd("dist/loader.js", "line", 780);
        // 取消与父组件的关联
        var parent = CACHE[instance.parentClientId];
        if (parent) {
            _$jscmd("dist/loader.js", "line", 782);
            parent.childClientIds = Util.without(parent.childClientIds, instance.clientId);
        }
        _$jscmd("dist/loader.js", "line", 787);
        // 触发 destroy 事件
        // 在移除关联的节点后，无法再继续利用浏览器事件模型来传播和触发事件，所以在移除前先触发 destroy 事件。
        instance.triggerHandler(Constant.EVENTS.destroy);
        // 在当前组件关联的元素上，移除所有由 Loader 绑定的事件监听函数。
        if (instance.off) {
            _$jscmd("dist/loader.js", "line", 791);
            Util.each(instance.options.events, function(item) {
                _$jscmd("dist/loader.js", "line", 792);
                instance.off(_$jscmd("dist/loader.js", "cond", "792_33_9", item.type) + _$jscmd("dist/loader.js", "cond", "792_45_25", Constant.LOADER_NAMESPACE));
            });
        }
        // 从 DOM 树中移除当前组件关联的元素。
        if (instance.element.parentNode) {
            _$jscmd("dist/loader.js", "line", 797);
            instance.element.parentNode.removeChild(instance.element);
        }
        _$jscmd("dist/loader.js", "line", 800);
        console.log("module", instance.moduleId, instance.clientId, "destroy");
        _$jscmd("dist/loader.js", "line", 802);
        return this;
    }
    // 加载模块
    /*
            load(moduleId [, callback( error, BrixImpl )])
        */
    function load(moduleId, callback) {
        _$jscmd("dist/loader.js", "line", 811);
        // console.log('function', arguments.callee.name, moduleId)
        var deferred = Util.defer();
        _$jscmd("dist/loader.js", "line", 812);
        var promise = deferred.promise;
        _$jscmd("dist/loader.js", "line", 813);
        require([ moduleId ], function(BrixImpl) {
            _$jscmd("dist/loader.js", "line", 815);
            // setTimeout(function() {
            deferred.resolve(BrixImpl);
            if (callback) callback(undefined, BrixImpl);
        });
        _$jscmd("dist/loader.js", "line", 819);
        promise.then(undefined, console.error);
        _$jscmd("dist/loader.js", "line", 820);
        return promise;
    }
    // 缓存组件
    function cache(instance) {
        _$jscmd("dist/loader.js", "line", 826);
        // 缓存起来
        CACHE[instance.clientId] = instance;
        _$jscmd("dist/loader.js", "line", 828);
        // 关联父组件
        var parent = CACHE[instance.parentClientId];
        if (parent) parent.childClientIds.push(instance.clientId);
    }
    /*
            * query(element)
            * query(moduleId)

            根据模块标识符 moduleId 查找组件实例。
            该方法的返回值是一个数组，包含了一组 Brix 组件实例，并且，数组上含有所有 Brix 组件实例的方法。
         */
    function query(moduleId) {
        _$jscmd("dist/loader.js", "line", 840);
        var results = [];
        _$jscmd("dist/loader.js", "line", 841);
        var methods = [];
        // 1. 根据 element 查找组件实例
        // query(element)
        if (moduleId.nodeType) {
            _$jscmd("dist/loader.js", "line", 846);
            results.push(CACHE[moduleId.getAttribute(Constant.ATTRS.cid)]);
        }
        // 1. 根据 moduleId 查找组件实例
        // query(moduleId)
        if (Util.isNumber(moduleId)) {
            _$jscmd("dist/loader.js", "line", 856);
            Util.each(CACHE, function(instance) {
                if (_$jscmd("dist/loader.js", "cond", "857_24_17", instance.moduleId) === _$jscmd("dist/loader.js", "cond", "857_46_8", moduleId)) {
                    _$jscmd("dist/loader.js", "line", 858);
                    results.push(instance);
                    _$jscmd("dist/loader.js", "line", 860);
                    // 收集组件方法
                    Util.each(instance.constructor.prototype, function(value, name) {
                        if (Util.isFunction(value)) methods.push(name);
                    });
                }
            });
        }
        _$jscmd("dist/loader.js", "line", 869);
        // 2. 绑定组件方法至 query() 返回的对象上
        Util.each(Util.unique(methods), function(name) {
            _$jscmd("dist/loader.js", "line", 870);
            results[name] = function() {
                _$jscmd("dist/loader.js", "line", 871);
                var args = [].slice.call(arguments);
                _$jscmd("dist/loader.js", "line", 872);
                Util.each(this, function(instance) {
                    if (!instance[name]) return;
                    _$jscmd("dist/loader.js", "line", 874);
                    instance[name].apply(instance, args);
                });
            };
        });
        _$jscmd("dist/loader.js", "line", 879);
        return results;
    }
    /*
            CACHE {
                uuid: {
                    clientId: uuid
                    parentClientId: uuid,
                    instance: brix
                }
            }
            return {
                name: root,
                children: [
                    {
                        name: moduleId + ',' + clientId,
                        children: [
                            {
                                name
                                children
                            }
                        ]
                    }
                ]
            }
        */
    function tree() {
        _$jscmd("dist/loader.js", "line", 906);
        var result = {
            name: "root",
            children: []
        };
        function _parseChildren(parentClientId, children) {
            _$jscmd("dist/loader.js", "line", 912);
            Util.each(CACHE, function(item) {
                if (_$jscmd("dist/loader.js", "cond", "913_24_19", item.parentClientId) === _$jscmd("dist/loader.js", "cond", "913_48_14", parentClientId)) {
                    _$jscmd("dist/loader.js", "line", 914);
                    children.push({
                        name: _$jscmd("dist/loader.js", "cond", "915_34_19", _$jscmd("dist/loader.js", "cond", "915_34_13", item.moduleId) + ",") + _$jscmd("dist/loader.js", "cond", "915_56_13", item.clientId),
                        module: item,
                        children: _parseChildren(item.clientId, [])
                    });
                }
            });
            _$jscmd("dist/loader.js", "line", 921);
            return children;
        }
        _$jscmd("dist/loader.js", "line", 924);
        _parseChildren(Constant.ROOT_CLIENT_ID, result.children);
        _$jscmd("dist/loader.js", "line", 926);
        return result;
    }
    _$jscmd("dist/loader.js", "line", 929);
    return {
        CACHE: CACHE,
        boot: boot,
        init: init,
        destroy: destroy,
        query: query,
        tree: tree,
        Util: Util,
        Constant: Constant,
        Options: Options
    };
});