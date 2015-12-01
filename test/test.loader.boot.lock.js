/* global window, console */
/* global define, require */
/* global describe, before, after, afterEach, it, expect */
/* global Loader: true, $: true, _: true, container: true */
/* jshint multistr: true */

/*
    http://jsfiddle.net/nuysoft/en49of7a/
 */
describe('Loader.boot() lock', function() {

    // this.timeout(5000)

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

    afterEach(function(done) {
        Loader.destroy(container, function() {
            done()
        })
    })

    after(function(done) {
        Loader.destroy(container, function() {
            done()
        })
    })

    define('hello', ['brix/loader', 'jquery'], function(Loader, $) {
        function Hello() {}
        Hello.prototype.render = function() {
            this.element.innerText = 'hello'

            var defer = $.Deferred()
            Loader.boot(this.element, function() {
                defer.resolve()
            })

            return defer.promise()
        }
        return Hello
    })

    it('Loader.boot() x3', function(done) {
        container.append('<div bx-name="hello"><div bx-name="hello"><div bx-name="hello"></hello></hello></hello>')
        Loader.boot(container, function(records) {
            console.log('done x1')
            expect(records.length).to.equal(3)
            expect(records[0][1]).to.not.equal(undefined)
            done()
        })
        Loader.boot(container, function(records) {
            console.log('done x2')
            expect(records.length).to.equal(3)
            expect(records[0][1]).to.equal(undefined)
            // done()
        })
        Loader.boot(container, function(records) {
            console.log('done x3')
            expect(records.length).to.equal(3)
            expect(records[0][1]).to.equal(undefined)
            // done()
        })
    })

    it('Loader.boot()', function(done) {
        container.append('<div bx-name="hello"></hello>')
        Loader.boot(function() {
            done()
        })

    })
})