/* global require, define */
/* global describe, before, it, expect */
/* jshint multistr: true */
describe('Options', function() {
    this.timeout(100)

    var Loader, $
    before(function(done) {
        require(['brix/loader', 'jquery'], function() {
            Loader = arguments[0]
            $ = arguments[1]
            done()
        })
    })

    // BUG #8 https://github.com/thx/brix-loader/issues/8
    it('Reproduce BUG', function(done) {

        define('test/options/impl', function() {
            function BrixImpl(options) {
                expect(options.foo).to.equal(undefined)
                expect(options.bar).to.equal(undefined)
                done()
            }
            BrixImpl.prototype = {
                options: {
                    foo: 'foo',
                    bar: 'bar'
                },
                init: function() {},
                render: function() {}
            }
            return BrixImpl
        })

        var html = '<div bx-name="test/options/impl"></div>'
        var container = $('#container').empty().append(html)
        Loader.boot(container)
    })

})