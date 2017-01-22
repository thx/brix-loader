/* global require */
/* global describe, before, beforeEach, afterEach, it, expect */
/* global Loader: true, $: true, _: true, container: true */
/* global TPL_NESTED_IMPLS, TPL_TEST_IMPL_COUNT */
/* jshint multistr: true */
describe('Loader.destroy()', function() {

    this.timeout(5000)

    // 其他变量和模块的定义在文件 `./test.loader.init.js` 中。
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
        container.html(TPL_NESTED_IMPLS)
        Loader.boot(container, function(records) {
            expect(records).to.have.length(9)
            done()
        })
    })
    afterEach(function(done) {
        Loader.destroy(container, function() {
            done()
        })
    })

    it('Loader.destroy( component )', function() {
        var components, i

        components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            Loader.destroy(components[i])
            expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
            expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
        }

        components = Loader.query('test/0/1')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            Loader.destroy(true, components[i])
            expect(Loader.query('test/0/1')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
            expect($('[bx-name="test/0/1"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
        }

        components = Loader.query('test/0/2')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            Loader.destroy(false, components[i])
            expect(Loader.query('test/0/2')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
            expect($('[bx-name="test/0/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        }
    })
    it('Loader.destroy( component, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(components[i], function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                i++
            })
        }
        if (i === TPL_TEST_IMPL_COUNT) done()
    })
    it('Loader.destroy( true, component, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(true, components[i], function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                i++
            })
        }
        if (i === TPL_TEST_IMPL_COUNT) done()
    })
    it('Loader.destroy( false, component, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(false, components[i], function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
                expect($('[bx-name="test/0/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
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
            expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
            expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
        }
    })
    it('Loader.destroy( true, element )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            Loader.destroy(true, components[i].element)
            expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
            expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
        }
    })
    it('Loader.destroy( false, element )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            Loader.destroy(false, components[i].element)
            expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
            expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        }
    })
    it('Loader.destroy( element, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(components[i].element, function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                i++
            })
        }
        if (i === TPL_TEST_IMPL_COUNT) done()
    })
    it('Loader.destroy( true, element, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(true, components[i].element, function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                i++
            })
        }
        if (i === TPL_TEST_IMPL_COUNT) done()
    })
    it('Loader.destroy( false, element, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        for (var i = 0; i < TPL_TEST_IMPL_COUNT;) {
            /* jshint loopfunc:true */
            Loader.destroy(false, components[i].element, function() {
                expect(Loader.query('test/0/0')).to.have.length(TPL_TEST_IMPL_COUNT - i - 1)
                expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
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
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( true, array{component} )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, components)
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( false, array{component} )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, components)
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
    })
    it('Loader.destroy( array{component}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(components, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( true, array{component}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, components, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( false, array{component}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, components, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            done()
        })
    })

    it('Loader.destroy( array{element} )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy($('[bx-name="test/0/0"]'))
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( true, array{element} )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, $('[bx-name="test/0/0"]'))
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( false, array{element} )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, $('[bx-name="test/0/0"]'))
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
    })
    it('Loader.destroy( array{element}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy($('[bx-name="test/0/0"]'), function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( true, array{element}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, $('[bx-name="test/0/0"]'), function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( false, array{element}, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, $('[bx-name="test/0/0"]'), function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]') ).to.have.length(TPL_TEST_IMPL_COUNT)
            done()
        })
    })

    it('Loader.destroy( context )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(container)
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( true, context )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, container)
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( false, context )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, container)
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
    })
    it('Loader.destroy( context, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(container, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( true, context, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, container, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( false, context, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, container, function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            done()
        })
    })

    it('Loader.destroy( moduleId )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0')
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( true, moduleId )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/0')
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(0)
    })
    it('Loader.destroy( false, moduleId )', function() {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/0')
        expect(Loader.query('test/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
    })
    it('Loader.destroy( moduleId, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0', function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( true, moduleId, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/0', function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(0)
            done()
        })
    })
    it('Loader.destroy( false, moduleId, complete )', function(done) {
        var components = Loader.query('test/0/0')
        expect(components).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/0', function() {
            expect(Loader.query('test/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            done()
        })
    })

    it('Loader.destroy( moduleId, context )', function() {
        // Loader.destroy( moduleId, parentModuleId )
        expect(Loader.query('test/0/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0/0', 'test/0')
        expect(Loader.query('test/0/0/0')).to.have.length(0)
        expect($('[bx-name="test/0/0/0"]')).to.have.length(0)

        expect(Loader.query('test/0/0/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/0/1"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/0/1', 'test/0')
        expect(Loader.query('test/0/0/1')).to.have.length(0)
        expect($('[bx-name="test/0/0/1"]')).to.have.length(0)

        expect(Loader.query('test/0/0/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/0/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/0/2', 'test/0')
        expect(Loader.query('test/0/0/2')).to.have.length(0)
        expect($('[bx-name="test/0/0/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)

        // Loader.destroy( moduleId, parentComponent )
        expect(Loader.query('test/0/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/1/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/1/0', Loader.query('test/0')[0])
        expect(Loader.query('test/0/1/0')).to.have.length(TPL_TEST_IMPL_COUNT - 1)
        expect($('[bx-name="test/0/1/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - 1)

        expect(Loader.query('test/0/1/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/1/1"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/1/1', Loader.query('test/0')[0])
        expect(Loader.query('test/0/1/1')).to.have.length(TPL_TEST_IMPL_COUNT - 1)
        expect($('[bx-name="test/0/1/1"]')).to.have.length(TPL_TEST_IMPL_COUNT - 1)

        expect(Loader.query('test/0/1/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/1/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/1/2', Loader.query('test/0')[0])
        expect(Loader.query('test/0/1/2')).to.have.length(TPL_TEST_IMPL_COUNT - 1)
        expect($('[bx-name="test/0/1/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)

        // Loader.destroy( moduleId, parentElement )
        expect(Loader.query('test/0/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/2/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/2/0', Loader.query('test/0')[0].element)
        expect(Loader.query('test/0/2/0')).to.have.length(TPL_TEST_IMPL_COUNT - 1)
        expect($('[bx-name="test/0/2/0"]')).to.have.length(TPL_TEST_IMPL_COUNT - 1)

        expect(Loader.query('test/0/2/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/2/1"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/2/1', Loader.query('test/0')[0].element)
        expect(Loader.query('test/0/2/1')).to.have.length(TPL_TEST_IMPL_COUNT - 1)
        expect($('[bx-name="test/0/2/1"]')).to.have.length(TPL_TEST_IMPL_COUNT - 1)

        expect(Loader.query('test/0/2/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/0/2/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/2/2', Loader.query('test/0')[0].element)
        expect(Loader.query('test/0/2/2')).to.have.length(TPL_TEST_IMPL_COUNT - 1)
        expect($('[bx-name="test/0/2/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)

        // Loader.destroy( moduleId, array{parentModuleId} )
        expect(Loader.query('test/1/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/0/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/0/0', ['test/1', 'test/1/0'])
        expect(Loader.query('test/1/0/0')).to.have.length(0)
        expect($('[bx-name="test/1/0/0"]')).to.have.length(0)

        expect(Loader.query('test/1/0/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/0/1"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/1/0/1', ['test/1', 'test/1/0'])
        expect(Loader.query('test/1/0/1')).to.have.length(0)
        expect($('[bx-name="test/1/0/1"]')).to.have.length(0)

        expect(Loader.query('test/1/0/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/0/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/1/0/2', ['test/1', 'test/1/0'])
        expect(Loader.query('test/1/0/2')).to.have.length(0)
        expect($('[bx-name="test/1/0/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)

        // Loader.destroy( moduleId, array{parentComponent} )
        expect(Loader.query('test/1/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/1/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/1/0', Loader.query('test/1'))
        expect(Loader.query('test/1/1/0')).to.have.length(0)
        expect($('[bx-name="test/1/1/0"]')).to.have.length(0)

        expect(Loader.query('test/1/1/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/1/1"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/1/1/1', Loader.query('test/1'))
        expect(Loader.query('test/1/1/1')).to.have.length(0)
        expect($('[bx-name="test/1/1/1"]')).to.have.length(0)

        expect(Loader.query('test/1/1/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/1/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/1/1/2', Loader.query('test/1'))
        expect(Loader.query('test/1/1/2')).to.have.length(0)
        expect($('[bx-name="test/1/1/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)

        // Loader.destroy( moduleId, array{parentElement} )
        expect(Loader.query('test/1/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/2/0"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/2/0', $('[bx-name="test/1"]'))
        expect(Loader.query('test/1/2/0')).to.have.length(0)
        expect($('[bx-name="test/1/2/0"]')).to.have.length(0)

        expect(Loader.query('test/1/2/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/2/1"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/1/2/1', $('[bx-name="test/1"]'))
        expect(Loader.query('test/1/2/1')).to.have.length(0)
        expect($('[bx-name="test/1/2/1"]')).to.have.length(0)

        expect(Loader.query('test/1/2/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect($('[bx-name="test/1/2/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/1/2/2', $('[bx-name="test/1"]'))
        expect(Loader.query('test/1/2/2')).to.have.length(0)
        expect($('[bx-name="test/1/2/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
    })

    it('Loader.destroy( moduleId, context, complete )', function(done) {
        var count = 0

        // Loader.destroy( moduleId, parentModuleId, complete )
        expect(Loader.query('test/0/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/0/0', 'test/0', function() {
            expect(Loader.query('test/0/0/0')).to.have.length(0)
            expect($('[bx-name="test/0/0/0"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/0/0/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/0/1', 'test/0', function() {
            expect(Loader.query('test/0/0/1')).to.have.length(0)
            expect($('[bx-name="test/0/0/1"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/0/0/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/0/2', 'test/0', function() {
            expect(Loader.query('test/0/0/2')).to.have.length(0)
            expect($('[bx-name="test/0/0/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            count++
        })

        // Loader.destroy( moduleId, parentComponent, complete )
        expect(Loader.query('test/0/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/1/0', Loader.query('test/0')[0], function() {
            expect(Loader.query('test/0/1/0')).to.have.length(2)
            expect($('[bx-name="test/0/1/0"]')).to.have.length(2)
            count++
        })
        expect(Loader.query('test/0/1/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/1/1', Loader.query('test/0')[0], function() {
            expect(Loader.query('test/0/1/1')).to.have.length(2)
            expect($('[bx-name="test/0/1/1"]')).to.have.length(2)
            count++
        })
        expect(Loader.query('test/0/1/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/1/2', Loader.query('test/0')[0], function() {
            expect(Loader.query('test/0/1/2')).to.have.length(2)
            expect($('[bx-name="test/0/1/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            count++
        })

        // Loader.destroy( moduleId, parentElement, complete )
        expect(Loader.query('test/0/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/0/2/0', Loader.query('test/0')[0].element, function() {
            expect(Loader.query('test/0/2/0')).to.have.length(2)
            expect($('[bx-name="test/0/2/0"]')).to.have.length(2)
            count++
        })
        expect(Loader.query('test/0/2/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/0/2/1', Loader.query('test/0')[0].element, function() {
            expect(Loader.query('test/0/2/1')).to.have.length(2)
            expect($('[bx-name="test/0/2/1"]')).to.have.length(2)
            count++
        })
        expect(Loader.query('test/0/2/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/0/2/2', Loader.query('test/0')[0].element, function() {
            expect(Loader.query('test/0/2/2')).to.have.length(2)
            expect($('[bx-name="test/0/2/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            count++
        })

        // Loader.destroy( moduleId, array{parentModuleId}, complete )
        expect(Loader.query('test/1/0/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/0/0', ['test/1', 'test/1/0'], function() {
            expect(Loader.query('test/1/0/0')).to.have.length(0)
            expect($('[bx-name="test/1/0/0"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/1/0/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/1/0/1', ['test/1', 'test/1/0'], function() {
            expect(Loader.query('test/1/0/1')).to.have.length(0)
            expect($('[bx-name="test/1/0/1"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/1/0/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/1/0/2', ['test/1', 'test/1/0'], function() {
            expect(Loader.query('test/1/0/2')).to.have.length(0)
            expect($('[bx-name="test/1/0/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            count++
        })

        // Loader.destroy( moduleId, array{parentComponent}, complete )
        expect(Loader.query('test/1/1/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/1/0', Loader.query('test/1'), function() {
            expect(Loader.query('test/1/1/0')).to.have.length(0)
            expect($('[bx-name="test/1/1/0"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/1/1/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/1/1/1', Loader.query('test/1'), function() {
            expect(Loader.query('test/1/1/1')).to.have.length(0)
            expect($('[bx-name="test/1/1/1"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/1/1/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/1/1/2', Loader.query('test/1'), function() {
            expect(Loader.query('test/1/1/2')).to.have.length(0)
            expect($('[bx-name="test/1/1/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            count++
        })

        // Loader.destroy( moduleId, array{parentElement}, complete )
        expect(Loader.query('test/1/2/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy('test/1/2/0', $('[bx-name="test/1"]'), function() {
            expect(Loader.query('test/1/2/0')).to.have.length(0)
            expect($('[bx-name="test/1/2/0"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/1/2/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(true, 'test/1/2/1', $('[bx-name="test/1"]'), function() {
            expect(Loader.query('test/1/2/1')).to.have.length(0)
            expect($('[bx-name="test/1/2/1"]')).to.have.length(0)
            count++
        })
        expect(Loader.query('test/1/2/2')).to.have.length(TPL_TEST_IMPL_COUNT)
        Loader.destroy(false, 'test/1/2/2', $('[bx-name="test/1"]'), function() {
            expect(Loader.query('test/1/2/2')).to.have.length(0)
            expect($('[bx-name="test/1/2/2"]')).to.have.length(TPL_TEST_IMPL_COUNT)
            count++
        })

        if (count === 18) done()
    })

    it('#25 Loader.destroy( destroyedModuleId )', function(done) {
        Loader.destroy('test/destroyed/module', function() {
            done()
        })
    })

})