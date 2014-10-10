describe('Loader', function() {
    var Loader
    before(function(done) {
        require(['loader'], function(moduel) {
            Loader = moduel
            genBrixImpl(Loader.Util)
            done()
        })
    })

    describe('boot()', function() {
        it('should boot without error', function(done) {
            Loader.boot(done)
        })
    })

    describe('init()', function() {
        it('should init without error', function(done) {
            Loader.init(document.body, done)
        })
    })

    describe('query()', function() {
        it('should query without error', function(done) {
            if (Loader.query('0').length) done()
        })
    })

    describe('destroy()', function() {
        it('should destroy without error', function(done) {
            for (var clientId in Loader.CACHE) {
                Loader.destroy(+clientId)
            }
            done()
        })
    })

})

function genBrixImpl(_) {
    var id
    for (var i = 0; i < 3; i++) {
        id = i + ''
        define(id, parentFactory(id))
        for (var ii = 0; ii < 3; ii++) {
            id = i + '/' + ii
            define(id, childFactory(id))
            for (var iii = 0; iii < 3; iii++) {
                id = i + '/' + ii + '/' + iii
                define(id, descendantFactory(id))
            }
        }
    }

    function parentFactory() {
        function ParentBrixImpl() {}
        _.extend(ParentBrixImpl.prototype, {
            render: function() {
                this.element.innerHTML =
                    content(this) +
                    '<ul>' +
                    ('<li bx-id="' + this.moduleId + '/0"></li>') +
                    ('<li bx-id="' + this.moduleId + '/1"></li>') +
                    ('<li bx-id="' + this.moduleId + '/2"></li>') +
                    '</ul>'
            }
        })
        return function() {
            return ParentBrixImpl
        }
    }

    function childFactory() {
        function ChildBrixImpl() {}
        _.extend(ChildBrixImpl.prototype, {
            render: function() {
                this.element.innerHTML =
                    content(this) +
                    '<ul>' +
                    ('<li bx-id="' + this.moduleId + '/0"></li>') +
                    ('<li bx-id="' + this.moduleId + '/1"></li>') +
                    ('<li bx-id="' + this.moduleId + '/2"></li>')
                '</ul>'
            }
        })
        return function() {
            return ChildBrixImpl
        }
    }

    function descendantFactory() {
        function DescendantBrixImpl() {}
        _.extend(DescendantBrixImpl.prototype, {
            render: function() {
                this.element.innerHTML =
                    content(this)
            }
        })
        return function() {
            return DescendantBrixImpl
        }
    }

    function content(component) {
        return '<pre>{ ' +
            'moduleId: ' + component.moduleId + ', ' +
            'clientId: ' + component.clientId + ', ' +
            'parentClientId: ' + component.parentClientId +
            ' }</pre>'
    }
}