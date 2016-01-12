/* global window */
/* global define, require */
/* global describe, before, beforeEach, it, expect */
/* global Loader: true, $: true, _: true, container: true */
/* jshint multistr: true */
describe('Loader.boot( force )', function() {

    this.timeout(5000)

    // 其他变量和模块的定义在文件 `./test.loader.init.js` 中。
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

    var forced = 0
    define('outer', ['brix/loader', 'jquery'], function(Loader, $) {
        function outer() {}
        outer.prototype.render = function() {
            this.element.innerHTML = 'outer <div bx-name="inner"></div>'

            var defer = $.Deferred()
            Loader.boot(true, this.element, function(records) {
                forced++
                expectRecords(records, 2)
                defer.resolve()
            })

            return defer.promise()
        }
        return outer
    })
    define('inner', ['brix/loader', 'jquery'], function(Loader, $) {
        function inner() {}
        inner.prototype.render = function() {
            this.element.innerHTML = 'inner'

            var defer = $.Deferred()
            Loader.boot(true, this.element, function(records) {
                forced++
                expectRecords(records, 1)
                defer.resolve()
            })

            return defer.promise()
        }
        return inner
    })

    beforeEach(function(done) {
        forced = 0
        done()
    })

    // Go go go

    it('Loader.boot( true )', function(done) {
        container.append('<div bx-name="outer"></hello>')
        Loader.boot(function(records) {
            expect(forced).to.equal(2)
            expectRecords(records, 1)
            Loader.destroy(container, done)
        })
    })
})