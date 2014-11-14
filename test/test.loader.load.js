/* global window */
/* global define, require */
/* global describe, chai, before, it */
/* jshint multistr: true */
describe('Loader.load()', function() {

    this.timeout(5000)

    var targets
    before(function(done) {
        require(['loader', 'jquery', 'underscore'], function() {
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

    it('Loader.load( element, moduleId, complete )', function(done) {
        Loader.load(targets[0], 'test/0', function(records) {
            expect(records).to.have.length(1)
            expect(Loader.query('test/0')).to.have.length(1)
            expect(Loader.query('test/0/0')).to.have.length(1)
            expect(Loader.query('test/0/1')).to.have.length(1)
            expect(Loader.query('test/0/2')).to.have.length(1)
            Loader.unload(targets[0], done)
        })
    })

    it('Loader.load( array{element}, moduleId, complete)', function(done) {
        Loader.load(targets, 'test/0', function(records) {
            expect(records).to.have.length(3)
            expect(Loader.query('test/0')).to.have.length(3)
            expect(Loader.query('test/0/0')).to.have.length(3)
            expect(Loader.query('test/0/1')).to.have.length(3)
            expect(Loader.query('test/0/2')).to.have.length(3)
            Loader.unload(targets, done)
        })
    })

})