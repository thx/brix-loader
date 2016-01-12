/* global require */
/* global describe, before, it, expect */
/* jshint multistr: true */
describe('Util _', function() {
    this.timeout(100)

    var Util
    before(function(done) {
        require(['brix/loader'], function(Loader) {
            Util = Loader.Util
            done()
        })
    })

    // BUG
    it('_.extend( target, source ) - Reproduce BUG', function(done) {
        var options = {
            foo: {
                bar: Math.random()
            }
        }
        var options1 = Util.extend({}, options) // shallow copy
        options1.foo.bar = Math.random()
        expect(options1.foo.bar).to.equal(options.foo.bar)

        var options2 = Util.extend(true, {}, options) // deep copy
        options2.foo.bar = Math.random()
        expect(options2.foo.bar).to.not.equal(options.foo.bar)

        this.test.title += ' : ' + JSON.stringify(options1.foo.bar)
        this.test.title += ' VS ' + JSON.stringify(options2.foo.bar)
        
        done()
    })

    it('_.extend( target, source )', function(done) {
        var target = {}
        var source = {
            foo: 1
        }
        this.test.title += ' : ' + JSON.stringify(target)
        Util.extend(target, source)
        this.test.title += ' => ' + JSON.stringify(target)

        expect(target).to.deep.equal({
            foo: 1
        })
        done()
    })
    it('_.extend( target, source1, source2, source3 )', function(done) {
        var target = {}
        var source1 = {
            foo: 1
        }
        var source2 = {
            bar: 2
        }
        var source3 = {
            faz: 3
        }
        this.test.title += ' : ' + JSON.stringify(target)
        Util.extend(target, source1, source2, source3)
        this.test.title += ' => ' + JSON.stringify(target)

        expect(target).to.deep.equal({
            foo: 1,
            bar: 2,
            faz: 3
        })
        done()
    })
    it('_.extend( target, source) - Nested', function(done) {
        var target = {}
        var source = {
            foo: {
                bar: {
                    faz: {

                    }
                }
            }
        }
        this.test.title += ' : ' + JSON.stringify(target)
        Util.extend(target, source)
        this.test.title += ' => ' + JSON.stringify(target)

        expect(target).to.not.equal(source)
        expect(target.foo).to.equal(source.foo)
        expect(target.foo.bar).to.equal(source.foo.bar)
        expect(target.foo.bar.faz).to.equal(source.foo.bar.faz)
        done()
    })

    function check(target, source) {
        expect(target).to.not.equal(source)
        expect(target).to.deep.equal(source)
    }

    it('_.extend( true, target, source ) - Object', function(done) {
        var target = {}
        var source = {
            foo: {
                bar: {
                    faz: {}
                }
            }
        }
        this.test.title += ' : ' + JSON.stringify(target)
        Util.extend(true, target, source)
        this.test.title += ' => ' + JSON.stringify(target)

        check(target, source)
        check(target.foo, source.foo)
        check(target.foo.bar, source.foo.bar)
        check(target.foo.bar.faz, source.foo.bar.faz)
        done()
    })

    it('_.extend( true, target, source ) - Array', function(done) {
        var target = {}
        var source = {
            foo: {
                bar: {
                    faz: [1, 2, 3]
                }
            }
        }
        this.test.title += ' : ' + JSON.stringify(target)
        Util.extend(true, target, source)
        this.test.title += ' => ' + JSON.stringify(target)

        check(target, source)
        check(target.foo, source.foo)
        check(target.foo.bar, source.foo.bar)
        check(target.foo.bar.faz, source.foo.bar.faz)
        done()
    })

    it('_.extend( true, target, source ) - Array', function(done) {
        var target = {
            foo: {
                bar: {}
            }
        }
        var source = {
            foo: {
                bar: {
                    faz: [1, 2, 3]
                }
            }
        }
        this.test.title += ' : ' + JSON.stringify(target)
        Util.extend(true, target, source)
        this.test.title += ' => ' + JSON.stringify(target)

        check(target, source)
        check(target.foo, source.foo)
        check(target.foo.bar, source.foo.bar)
        check(target.foo.bar.faz, source.foo.bar.faz)
        done()
    })

    it('_.extend( true, target, source ) - Array', function(done) {
        var target = {
            foo: {
                bar: {
                    faz: [1, , 3]
                }
            }
        }
        var source = {
            foo: {
                bar: {
                    faz: [1, 2, 3]
                }
            }
        }
        this.test.title += ' : ' + JSON.stringify(target)
        Util.extend(true, target, source)
        this.test.title += ' => ' + JSON.stringify(target)

        check(target, source)
        check(target.foo, source.foo)
        check(target.foo.bar, source.foo.bar)
        check(target.foo.bar.faz, source.foo.bar.faz)
        done()
    })

})