/* global require */
/* global describe, before, after, it, expect */
/* global Loader: true, $: true, _: true, container: true */
/* global TPL_NESTED_IMPLS, TPL_TEST_IMPL_COUNT */
/* jshint multistr: true */
describe('Loader.query()', function() {

    this.timeout(5000)

    before(function(done) {
        require(['brix/loader', 'jquery', 'underscore'], function() {
            Loader = arguments[0]
            $ = arguments[1]
            _ = arguments[2]
            container = $('#container')

            container.append(TPL_NESTED_IMPLS)
            Loader.boot(container, function() {
                done()
            })
        })
    })

    after(function(done) {
        Loader.destroy(container, done)
    })

    it('Loader.query( moduleId )', function() {
        expect(Loader.query('test/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect(Loader.query('test/1')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect(Loader.query('test/2')).to.have.length(TPL_TEST_IMPL_COUNT)

        for (var i = 0; i < 3; i++) {
            expect(
                Loader.query(
                    ['test', i].join('/')
                )
            ).to.have.length(TPL_TEST_IMPL_COUNT)
            for (var ii = 0; ii < 3; ii++) {
                expect(
                    Loader.query(
                        ['test', i, ii].join('/')
                    )
                ).to.have.length(TPL_TEST_IMPL_COUNT)
                for (var iii = 0; iii < 3; iii++) {
                    expect(
                        Loader.query(
                            ['test', i, ii, iii].join('/')
                        )
                    ).to.have.length(TPL_TEST_IMPL_COUNT)
                }
            }
        }
    })

    it('Loader.query( moduleId, parentModuleId )', function() {
        expect(Loader.query('test/0/0', 'test/0')).to.have.length(TPL_TEST_IMPL_COUNT)
        expect(Loader.query('test/0/0/0', 'test/0')).to.have.length(TPL_TEST_IMPL_COUNT)

        for (var i = 0; i < 3; i++) {
            expect(
                Loader.query(
                    ['test', i].join('/')
                )
            ).to.have.length(TPL_TEST_IMPL_COUNT)
            for (var ii = 0; ii < 3; ii++) {
                expect(
                    Loader.query(
                        ['test', i, ii].join('/'), ['test', i].join('/')
                    )
                ).to.have.length(TPL_TEST_IMPL_COUNT)
                for (var iii = 0; iii < 3; iii++) {
                    expect(
                        Loader.query(
                            ['test', i, ii, iii].join('/'), ['test', i].join('/')
                        )
                    ).to.have.length(TPL_TEST_IMPL_COUNT)
                    expect(
                        Loader.query(
                            ['test', i, ii, iii].join('/'), ['test', i, ii].join('/')
                        )
                    ).to.have.length(TPL_TEST_IMPL_COUNT)
                }
            }
        }
    })

    it('Loader.query( moduleId, parentComponent )', function() {
        expect(Loader.query('test/0/0', Loader.query('test/0')[0])).to.have.length(1)
        expect(Loader.query('test/0/0', Loader.query('test/0')[1])).to.have.length(1)
        expect(Loader.query('test/0/0', Loader.query('test/0')[2])).to.have.length(1)
        expect(Loader.query('test/0/0/0', Loader.query('test/0')[0])).to.have.length(1)
        expect(Loader.query('test/0/0/0', Loader.query('test/0')[1])).to.have.length(1)
        expect(Loader.query('test/0/0/0', Loader.query('test/0')[2])).to.have.length(1)
        expect(Loader.query('test/0/0/0', Loader.query('test/0/0')[0])).to.have.length(1)
        expect(Loader.query('test/0/0/0', Loader.query('test/0/0')[1])).to.have.length(1)
        expect(Loader.query('test/0/0/0', Loader.query('test/0/0')[2])).to.have.length(1)

        for (var i = 0; i < TPL_TEST_IMPL_COUNT; i++) {
            expect(
                Loader.query(
                    ['test', i].join('/')
                )
            ).to.have.length(TPL_TEST_IMPL_COUNT)
            for (var ii = 0; ii < TPL_TEST_IMPL_COUNT; ii++) {
                expect(
                    Loader.query(
                        ['test', i, ii].join('/'),
                        Loader.query(['test', i].join('/'))[i]
                    )
                ).to.have.length(1)
                for (var iii = 0; iii < TPL_TEST_IMPL_COUNT; iii++) {
                    expect(
                        Loader.query(
                            ['test', i, ii, iii].join('/'),
                            Loader.query(['test', i].join('/'))[i]
                        )
                    ).to.have.length(1)
                    expect(
                        Loader.query(
                            ['test', i, ii, iii].join('/'),
                            Loader.query(['test', i, ii].join('/'))[ii]
                        )
                    ).to.have.length(1)
                }
            }
        }
    })

    it('Loader.query( moduleId, parentElement )', function() {
        for (var i = 0; i < 3; i++) {
            expect(
                Loader.query(
                    ['test', i].join('/'), container[0]
                )
            ).to.have.length(TPL_TEST_IMPL_COUNT)
            for (var ii = 0; ii < 3; ii++) {
                expect(
                    Loader.query(
                        ['test', i, ii].join('/'), container[0]
                    )
                ).to.have.length(TPL_TEST_IMPL_COUNT)
                for (var iii = 0; iii < 3; iii++) {
                    expect(
                        Loader.query(
                            ['test', i, ii, iii].join('/'), container[0]
                        )
                    ).to.have.length(TPL_TEST_IMPL_COUNT)
                }
            }
        }
    })

    it('Loader.query( moduleId, array{parentModuleId} )', function() {
        expect(Loader.query('test/0/0', ['test/0'])).to.have.length(TPL_TEST_IMPL_COUNT)
        expect(Loader.query('test/0/0', ['test/0', 'test/0', 'test/0'])).to.have.length(TPL_TEST_IMPL_COUNT)
    })

    it('Loader.query( moduleId, array{parentComponent} )', function() {
        var parentComponents = Loader.query('test/0')
        expect(Loader.query('test/0/0', parentComponents)).to.have.length(TPL_TEST_IMPL_COUNT)
    })

    it('Loader.query( moduleId, array{parentElement} )', function() {
        for (var i = 0; i < 3; i++) {
            expect(
                Loader.query(
                    ['test', i].join('/'), container
                )
            ).to.have.length(TPL_TEST_IMPL_COUNT)
            for (var ii = 0; ii < 3; ii++) {
                expect(
                    Loader.query(
                        ['test', i, ii].join('/'), container
                    )
                ).to.have.length(TPL_TEST_IMPL_COUNT)
                for (var iii = 0; iii < 3; iii++) {
                    expect(
                        Loader.query(
                            ['test', i, ii, iii].join('/'), container
                        )
                    ).to.have.length(TPL_TEST_IMPL_COUNT)
                }
            }
        }
    })


})