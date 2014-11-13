/* global window */
/* global define, require */
/* global describe, chai, before, it */
/* jshint multistr: true */
describe('Loader.load()', function() {

    this.timeout(5000)

    var expect = chai.expect
        // var assert = chai.assert

    var Loader, $, _, container, targets
    before(function(done) {
        require(['loader', 'jquery', 'underscore'], function() {
            window.Loader = Loader = arguments[0]
            $ = arguments[1]
            _ = arguments[2]
            container = $('#container').append('<div class="target"></div>')
                .append('<div class="target"></div>')
                .append('<div class="target"></div>')
            targets = container.find('div.target')
            done()
        })
    })

    var TPL_CONTENT = '<pre>{ moduleId: <%= moduleId %>, clientId: <%= clientId %>, parentClientId: <%= parentClientId %> }</pre>'
    var TPL_CHILDREN = '<ul>\
                            <li bx-name="<%= moduleId %>/0"></li>\
                            <li bx-name="<%= moduleId %>/1"></li>\
                            <li bx-name="<%= moduleId %>/2"></li>\
                        </ul>'

    function genParentBrixImpl() {
        function ParentBrixImpl() {}
        _.extend(ParentBrixImpl.prototype, {
            render: function() {
                this.element.innerHTML =
                    _.template(TPL_CONTENT)(this) +
                    _.template(TPL_CHILDREN)(this)
            }
        })
        return ParentBrixImpl
    }

    function genChildBrixImpl() {
        function ChildBrixImpl() {}
        _.extend(ChildBrixImpl.prototype, {
            render: function() {
                this.element.innerHTML =
                    _.template(TPL_CONTENT)(this) +
                    _.template(TPL_CHILDREN)(this)
            }
        })
        return ChildBrixImpl
    }

    function genDescendantBrixImpl() {
        function DescendantBrixImpl() {}
        _.extend(DescendantBrixImpl.prototype, {
            render: function() {
                this.element.innerHTML =
                    _.template(TPL_CONTENT)(this)
            }
        })
        return DescendantBrixImpl
    }

    (function() {
        var moduleId
        for (var i = 0; i < 3; i++) {
            moduleId = ['test', i].join('/')
            define(moduleId, genParentBrixImpl)
            for (var ii = 0; ii < 3; ii++) {
                moduleId = ['test', i, ii].join('/')
                define(moduleId, genChildBrixImpl)
                for (var iii = 0; iii < 3; iii++) {
                    moduleId = ['test', i, ii, iii].join('/')
                    define(moduleId, genDescendantBrixImpl)
                }
            }
        }
    })()

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