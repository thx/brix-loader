/* global window, setTimeout */
/* global define, require */
/* global describe, before, it, expect */
/* global Loader: true, $: true, _: true, container: true */
/* global TPL_TEST_IMPL, TPL_CONTENT, FN_CONTENT, TPL_TEST_IMPL_COUNT, repeat */
/* jshint multistr: true */
describe('Loader.boot()', function() {

    this.timeout(5000)
    
    before(function(done) {
        require(['brix/loader', 'jquery', 'underscore'], function() {
            window.Loader = Loader = arguments[0]
            $ = arguments[1]
            _ = arguments[2]
            container = $('#container')
            done()
        })
    })

    // record [ error, instance, index, count ]
    function expectRecord(record, recordIndex, recordCount) {
        expect(record).to.have.length(4)
        expect(record[0]).to.equal(undefined)
        expect(record[1]).to.have.property('render')
        expect(record[2]).to.equal(recordIndex)
        expect(record[3]).to.equal(recordCount)
    }

    function expectRecords(records, length) {
        expect(records).to.have.length(length)
        _.each(records, function(record, recordIndex) {
            expectRecord(record, recordIndex, records.length)
        })
    }

    // Go go go

    it('Loader.boot()', function(done) {
        container.append(TPL_TEST_IMPL)
        Loader.boot()
        setTimeout(function() {
            expect(Loader.query('test/impl')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        }, 100)
    })
    it('Loader.boot( complete )', function(done) {
        container.append(TPL_TEST_IMPL)
        Loader.boot(function(records) {
            expectRecords(records, TPL_TEST_IMPL_COUNT)
            expect(Loader.query('test/impl')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        })
    })
    it('Loader.boot( complete, notify )', function(done) {
        container.append(TPL_TEST_IMPL)
        var expectedIndex = 0
        Loader.boot(function(records) {
            expectRecords(records, TPL_TEST_IMPL_COUNT)
            expect(Loader.query('test/impl')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        }, function( /*error, instance, index, count*/ ) {
            expectRecord(arguments, expectedIndex++, TPL_TEST_IMPL_COUNT)
        })
    })
    it('Loader.boot( element )', function(done) {
        container.append(TPL_TEST_IMPL)
        Loader.boot(container[0])
        setTimeout(function() {
            expect(Loader.query('test/impl', container)).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        }, 100)
    })
    it('Loader.boot( element, complete )', function(done) {
        container.append(TPL_TEST_IMPL)
        Loader.boot(container[0], function(records) {
            expectRecords(records, TPL_TEST_IMPL_COUNT)
            expect(Loader.query('test/impl')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        })
    })
    it('Loader.boot( element, complete, notify )', function(done) {
        container.append(TPL_TEST_IMPL)
        var expectedIndex = 0
        Loader.boot(container[0], function(records) {
            expectRecords(records, TPL_TEST_IMPL_COUNT)
            expect(Loader.query('test/impl')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        }, function( /*error, instance, index, count*/ ) {
            expectRecord(arguments, expectedIndex++, TPL_TEST_IMPL_COUNT)
        })
    })
    it('Loader.boot( array{element} )', function(done) {
        container.append(TPL_TEST_IMPL)
        Loader.boot(container)
        setTimeout(function() {
            expect(Loader.query('test/impl', container)).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        }, 100)
    })
    it('Loader.boot( array{element}, complete )', function(done) {
        container.append(TPL_TEST_IMPL)
        Loader.boot(container, function(records) {
            expectRecords(records, TPL_TEST_IMPL_COUNT)
            expect(Loader.query('test/impl')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        })
    })
    it('Loader.boot( array{element}, complete, notify )', function(done) {
        container.append(TPL_TEST_IMPL)
        var expectedIndex = 0
        Loader.boot(container, function(records) {
            expectRecords(records, TPL_TEST_IMPL_COUNT)
            expect(Loader.query('test/impl')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        }, function( /*error, instance, index, count*/ ) {
            expectRecord(arguments, expectedIndex++, TPL_TEST_IMPL_COUNT)
        })
    })

    it('has not .init() and .destroy()', function(done) {
        define('test/has_not_init_and_destroy', function() {
            function Impl() {}
            _.extend(Impl.prototype, {
                render: FN_CONTENT
            })
            return Impl
        })
        container.append(repeat('<div bx-name="test/has_not_init_and_destroy"></div>', TPL_TEST_IMPL_COUNT))
        Loader.boot(container, function(records) {
            expectRecords(records, TPL_TEST_IMPL_COUNT)
            expect(Loader.query('test/has_not_init_and_destroy')).to.have.length(TPL_TEST_IMPL_COUNT)
            Loader.destroy(container, done)
        })
    })

    // PhantomJS 环境下不执行该测试用例
    if (!window.mochaPhantomJS) {
        it('has not .render()', function(done) {
            define('test/has_not_render', function() {
                return function() {}
            })
            container.append(repeat('<div bx-name="test/has_not_render"></div>', TPL_TEST_IMPL_COUNT))
            Loader.boot(container, function(records) {
                expect(records).to.have.length(TPL_TEST_IMPL_COUNT)
                _.each(records, function(record, recordIndex) {
                    expect(record).to.have.length(4)
                    expect(record[0]).to.not.equal(undefined)
                    expect(record[0].name).to.equal('TypeError')
                    expect(record[0].message).to.equal('Cannot read property \'apply\' of undefined')
                    expect(record[1]).to.not.have.property('render')
                    expect(record[2]).to.equal(recordIndex)
                    expect(record[3]).to.equal(TPL_TEST_IMPL_COUNT)
                })
                expect(Loader.query('test/has_not_render')).to.have.length(TPL_TEST_IMPL_COUNT)
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
                    }, Math.random() * 100)
                    return deferred.promise()
                },
                render: FN_CONTENT
            })
            return Impl
        })
        container.append('<div bx-name="test/async_init"></div><div bx-name="test/async_init"></div><div bx-name="test/async_init"></div>')
        Loader.boot(container, function(records) {
            expectRecords(records, 3)
            var components = Loader.query('test/async_init')
            expect(components).to.have.length(records.length)
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
                    }, Math.random() * 100)
                    return deferred.promise()
                }
            })
            return Impl
        })
        container.append('<div bx-name="test/async_render"></div><div bx-name="test/async_render"></div><div bx-name="test/async_render"></div>')
        Loader.boot(container, function(records) {
            expectRecords(records, 3)
            var components = Loader.query('test/async_render')
            expect(components).to.have.length(3)
            Loader.destroy(container, done)
        })
    })

    it('nested components', function(done) {
        container.append('<div bx-name="test/0"></div><div bx-name="test/1"></div><div bx-name="test/2"></div>')
        Loader.boot(container, function(records) {
            expectRecords(records, 3)
            var moduleId
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