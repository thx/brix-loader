/* global require */
/* global describe, before, beforeEach, afterEach, it, expect */
/* global Loader: true, $: true, _: true, container: true */
/* global TPL_NESTED_IMPLS, TPL_TEST_IMPL_COUNT */
/* jshint multistr: true */
describe('Loader.destroy()', function() {

    this.timeout(5000)

    before(function(done) {
        require(['brix/loader', 'jquery', 'underscore'], function() {
            Loader = arguments[0]
            $ = arguments[1]
            _ = arguments[2]
            container = $('#container')
            done()
        })
    })

    beforeEach(function(done) {
        container.append(TPL_NESTED_IMPLS)
        Loader.boot(container, function() {
            done()
        })
    })
    afterEach(function(done) {
        Loader.destroy(container, function() {
            done()
        })
    })

    it('Loader.destroy( component )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            Loader.destroy(components[i])
            expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - 1 - i)
        }
    })
    it('Loader.destroy( component, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(components[i], function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - 1 - i)
                i++
            })
        }
        if (i === TPL_TEST_IMPL_COUNT) done()
    })

    it('Loader.destroy( element )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            Loader.destroy(components[i].element)
            expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - 1 - i)
        }
    })
    it('Loader.destroy( element, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(components[i].element, function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - 1 - i)
                i++
            })
        }
        if (i === TPL_TEST_IMPL_COUNT) done()
    })

    it('Loader.destroy( array{component} )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(components)
        expect(Loader.query('test/0/0')).to.have.length(0)
    })
    it('Loader.destroy( array{component}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(components, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            done()
        })
    })

    it('Loader.destroy( array{element} )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy($('[bx-name="test/0/0"]'))
        expect(Loader.query('test/0/0')).to.have.length(0)
    })
    it('Loader.destroy( array{element}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy($('[bx-name="test/0/0"]'), function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            done()
        })
    })

    it('Loader.destroy( context )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(container)
        expect(Loader.query('test/0/0')).to.have.length(0)
    })
    it('Loader.destroy( context, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(container, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            done()
        })
    })

    it('Loader.destroy( moduleId )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0')
        expect(Loader.query('test/0/0')).to.have.length(0)
    })
    it('Loader.destroy( moduleId, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0', function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            done()
        })
    })

    it('Loader.destroy( moduleId, context )', function() {
        // Loader.destroy( moduleId, parentModuleId )
        expect(Loader.query('test/0/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0/0', 'test/0')
        expect(Loader.query('test/0/0/0')).to.have.length(0)

        // Loader.destroy( moduleId, parentComponent )
        expect(Loader.query('test/0/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/1/0', Loader.query('test/0')[0])
        expect(Loader.query('test/0/1/0')).to.have.length(2)

        // Loader.destroy( moduleId, parentElement )
        expect(Loader.query('test/0/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/2/0', Loader.query('test/0')[0].element)
        expect(Loader.query('test/0/2/0')).to.have.length(2)

        // Loader.destroy( moduleId, array{parentModuleId} )
        expect(Loader.query('test/1/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/0/0', ['test/1', 'test/1/0'])
        expect(Loader.query('test/1/0/0')).to.have.length(0)

        // Loader.destroy( moduleId, array{parentComponent} )
        expect(Loader.query('test/1/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/1/0', Loader.query('test/1'))
        expect(Loader.query('test/1/1/0')).to.have.length(0)

        // Loader.destroy( moduleId, array{parentElement} )
        expect(Loader.query('test/1/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/2/0', $('[bx-name="test/1"]'))
        expect(Loader.query('test/1/2/0')).to.have.length(0)
    })

    it('Loader.destroy( moduleId, context, complete )', function(done) {
        var count = 0

        // Loader.destroy( moduleId, parentModuleId, complete )
        expect(Loader.query('test/0/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0/0', 'test/0', function() {
            expect(Loader.query('test/0/0/0')).to.have.length(0)
            count++
        })

        // Loader.destroy( moduleId, parentComponent, complete )
        expect(Loader.query('test/0/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/1/0', Loader.query('test/0')[0], function() {
            expect(Loader.query('test/0/1/0')).to.have.length(2)
            count++
        })

        // Loader.destroy( moduleId, parentElement, complete )
        expect(Loader.query('test/0/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/2/0', Loader.query('test/0')[0].element, function() {
            expect(Loader.query('test/0/2/0')).to.have.length(2)
            count++
        })

        // Loader.destroy( moduleId, array{parentModuleId}, complete )
        expect(Loader.query('test/1/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/0/0', ['test/1', 'test/1/0'], function() {
            expect(Loader.query('test/1/0/0')).to.have.length(0)
            count++
        })

        // Loader.destroy( moduleId, array{parentComponent}, complete )
        expect(Loader.query('test/1/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/1/0', Loader.query('test/1'), function() {
            expect(Loader.query('test/1/1/0')).to.have.length(0)
            count++
        })

        // Loader.destroy( moduleId, array{parentElement}, complete )
        expect(Loader.query('test/1/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/2/0', $('[bx-name="test/1"]'), function() {
            expect(Loader.query('test/1/2/0')).to.have.length(0)
            count++
        })

        if (count === 6) done()
    })


})