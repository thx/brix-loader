/* global require */
/* global describe, before, it, expect */
/* global Loader: true, $: true, _: true, container: true */
/* jshint multistr: true */
describe('Loader.unload()', function() {

    this.timeout(5000)

    // 其他变量和模块的定义在文件 `./test.loader.init.js` 中。
    var targets
    before(function(done) {
        require(['brix/loader', 'jquery', 'underscore'], function() {
            Loader = arguments[0]
            $ = arguments[1]
            _ = arguments[2]
            container = $('#container').append('<div class="target"></div>')
                .append('<div class="target"></div>')
                .append('<div class="target"></div>')
            targets = container.find('div.target')
            done()
        })
    })

    it('Loader.unload( element, complete )', function(done) {
        Loader.load(targets[0], 'test/0', function() {
            Loader.unload(targets[0], function() {
                expect(Loader.query('test/0')).to.have.length(0)
                done()
            })
        })
    })

    it('Loader.unload( array{element}, complete )', function(done) {
        Loader.load(targets, 'test/0', function() {
            Loader.unload(targets, function() {
                expect(Loader.query('test/0')).to.have.length(0)
                done()
            })
        })
    })

})