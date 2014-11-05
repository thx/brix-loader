describe('Loader', function() {

    var expect = chai.expect
    var assert = chai.assert

    var Loader, $, _, container
    var TPL_CONTENT = '<pre>{ moduleId: <%= moduleId %>, clientId: <%= clientId %>, parentClientId: <%= parentClientId %> }</pre>'

    before(function(done) {
        require(['loader', 'jquery', 'underscore'], function(moduel1, moduel2) {
            Loader = arguments[0]
            $ = arguments[1]
            _ = arguments[2]
            container = $('#container')
            done()
        })
    })

    describe('boot()', function() {
        it('Loader.boot()', function(done) {
            define('test/impl', function() {
                function Impl() {}
                _.extend(Impl.prototype, {
                    render: function() {
                        this.element.innerHTML = _.template(TPL_CONTENT)(this)
                    }
                })
                return Impl
            })
            container.html('<div bx-name="test/impl"></div><div bx-name="test/impl"></div><div bx-name="test/impl"></div>')
            Loader.boot(function(records) {
                var components = Loader.query('test/impl')
                expect(components).to.have.length(3)
                Loader.destroy(container, done)
            })
        })

        it('has not .init() and .destroy()', function(done) {
            define('test/has_not_init_and_destroy', function() {
                function Impl() {}
                _.extend(Impl.prototype, {
                    render: function() {
                        this.element.innerHTML = _.template(TPL_CONTENT)(this)
                    }
                })
                return Impl
            })
            container.html('<div bx-name="test/has_not_init_and_destroy"></div><div bx-name="test/has_not_init_and_destroy"></div>')
            Loader.boot(container, function(records) {
                var components = Loader.query('test/has_not_init_and_destroy')
                expect(components).to.have.length(2)
                Loader.destroy(container, done)
            })
        })
        // PhantomJS 环境下不执行该测试用例
        if (!window.mochaPhantomJS) {
            it('has not .render()', function(done) {
                define('test/has_not_render', function() {
                    function Impl() {}
                    _.extend(Impl.prototype, {})
                    return Impl
                })
                container.html('<div bx-name="test/has_not_render"></div><div bx-name="test/has_not_render"></div><div bx-name="test/has_not_render"></div>')
                Loader.boot(container, function(records) {
                    var components = Loader.query('test/has_not_render')
                    expect(components).to.have.length(3)
                    var errors = _.map(records, function(item, index) {
                        return item[0]
                    })
                    expect(errors).to.have.length(3)
                    _.each(errors, function(item) {
                        expect(item.name).to.equal('TypeError')
                        expect(item.message).to.equal('Cannot read property \'apply\' of undefined')
                    })
                    Loader.destroy(container, done)
                })
            })
        }
        it('async .init()', function(done) {
            define('test/async_init', function() {
                function Impl() {}
                _.extend(Impl.prototype, {
                    init: function() {
                        var deferred = $.Deferred()
                        setTimeout(function() {
                            deferred.resolve()
                        }, 100)
                        return deferred.promise()
                    },
                    render: function() {
                        this.element.innerHTML = _.template(TPL_CONTENT)(this)
                    }
                })
                return Impl
            })
            container.html('<div bx-name="test/async_init"></div><div bx-name="test/async_init"></div><div bx-name="test/async_init"></div>')
            Loader.boot(container, function(records) {
                var components = Loader.query('test/async_init')
                expect(components).to.have.length(3)
                Loader.destroy(container, done)
            })
        })
        it('async .render()', function(done) {
            define('test/async_render', function() {
                function Impl() {}
                _.extend(Impl.prototype, {
                    render: function() {
                        var that = this
                        var deferred = $.Deferred()
                        setTimeout(function() {
                            that.element.innerHTML = _.template(TPL_CONTENT)(that)
                            deferred.resolve()
                        }, 100)
                        return deferred.promise()
                    }
                })
                return Impl
            })
            container.html('<div bx-name="test/async_render"></div><div bx-name="test/async_render"></div><div bx-name="test/async_render"></div>')
            Loader.boot(container, function(records) {
                var components = Loader.query('test/async_render')
                expect(components).to.have.length(3)
                Loader.destroy(container, done)
            })
        })
        it('nested components', function(done) {
            var moduleId
            var TPL_CHILDREN = '<ul>\
                                    <li bx-name="<%= moduleId %>/0"></li>\
                                    <li bx-name="<%= moduleId %>/1"></li>\
                                    <li bx-name="<%= moduleId %>/2"></li>\
                                </ul>'
            for (var i = 0; i < 3; i++) {
                moduleId = ['test', i].join('/')
                define(moduleId, function() {
                    function ParentBrixImpl() {}
                    _.extend(ParentBrixImpl.prototype, {
                        render: function() {
                            this.element.innerHTML =
                                _.template(TPL_CONTENT)(this) +
                                _.template(TPL_CHILDREN)(this)
                        }
                    })
                    return ParentBrixImpl
                })
                for (var ii = 0; ii < 3; ii++) {
                    moduleId = ['test', i, ii].join('/')
                    define(moduleId, function() {
                        function ChildBrixImpl() {}
                        _.extend(ChildBrixImpl.prototype, {
                            render: function() {
                                this.element.innerHTML =
                                    _.template(TPL_CONTENT)(this) +
                                    _.template(TPL_CHILDREN)(this)
                            }
                        })
                        return ChildBrixImpl
                    })
                    for (var iii = 0; iii < 3; iii++) {
                        moduleId = ['test', i, ii, iii].join('/')
                        define(moduleId, function() {
                            function DescendantBrixImpl() {}
                            _.extend(DescendantBrixImpl.prototype, {
                                render: function() {
                                    this.element.innerHTML =
                                        _.template(TPL_CONTENT)(this)
                                }
                            })
                            return DescendantBrixImpl
                        })
                    }
                }
            }
            container.html('<div bx-name="test/0"></div><div bx-name="test/1"></div><div bx-name="test/2"></div>')
            Loader.boot(container, function(records) {
                for (var i = 0; i < 3; i++) {
                    moduleId = ['test', i].join('/')
                    expect(Loader.query(moduleId)).to.have.length(1)
                    for (var ii = 0; ii < 3; ii++) {
                        moduleId = ['test', i, ii].join('/')
                        expect(Loader.query(moduleId)).to.have.length(1)
                        for (var iii = 0; iii < 3; iii++) {
                            moduleId = ['test', i, ii, iii].join('/')
                            expect(Loader.query(moduleId)).to.have.length(1)
                        }
                    }
                }
                Loader.destroy(Loader.query('test/0'))
                Loader.destroy(Loader.query('test/1'))
                Loader.destroy(Loader.query('test/2'))
                Loader.destroy(container, done)
            })
        })
    })

})