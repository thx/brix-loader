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
                expect(options.foo).to.equal('faz')
                expect(options.bar).to.equal(undefined)
            }
            BrixImpl.prototype = {
                options: {
                    foo: 'foo',
                    bar: 'bar'
                },
                init: function() {
                    expect(this.options.foo).to.equal('faz')
                    expect(this.options.bar).to.equal('bar')
                    done()
                },
                render: function() {}
            }
            return BrixImpl
        })

        var html = '<div bx-name="test/options/impl" data-foo="faz"></div>'
        var container = $('#container').empty().append(html)
        Loader.boot(container)
    })

})