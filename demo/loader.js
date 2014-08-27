// Start the main app logic.
require(
    [
        'jquery', 'underscore', 'backbone', 'mock',
        '/src/brix.js', '/src/loader.js', '/src/query.js'
    ],
    function(
        $, _, Backbone, Mock,
        Brix, Loader, Query
    ) {
        window.Loader = Loader
        window.Query = Query
        genBrixImpl(Brix, _, Mock)

        var elements = $('[bx-id]')
        _.each(elements, function(element, index) {
            $('<pre style="margin-top: 10px;">').text(element.outerHTML).insertAfter(element)
        })

        Loader.boot()
            .then(function() {
                Tree.updateWrapper(Loader.tree())
            })
    }
)

function genBrixImpl(Brix, _, Mock) {

    var tpl = Mock.heredoc(function() {
        /*!
        <div class="panel panel-default">
            <div class="panel-heading code"></div>
            <div class="panel-body row"></div>
        </div>
        */
    })

    function init() {
        // console.log('model', this.options.moduleId, 'init')
    }

    function destroy() {
        // console.log('model', this.options.moduleId, 'destroy')
    }

    function parentFactory(id) {
        function BrixImpl(options) {
            this.options = options || {}
        }
        _.extend(BrixImpl.prototype, Brix, {
            init: init,
            destroy: destroy,
            render: function() {
                $(this.element).find('.panel-heading').html(
                    JSON.stringify(
                        _.pick(this, 'moduleId', 'clientId', 'parentClientId'),
                        null, 2
                    )
                )
                // console.log('model', id, 'render')
            },

        })
        return BrixImpl
    }

    function childFactory(id) {
        function BrixImpl(options) {
            this.options = options || {}
        }
        _.extend(BrixImpl.prototype, Brix, {
            init: init,
            destroy: destroy,
            render: function() {
                var $element = $(this.element).html(tpl)
                $element.find('.panel-heading')
                    .html(
                        JSON.stringify(
                            _.pick(this, 'moduleId', 'clientId', 'parentClientId'),
                            null, 2
                        )
                )
                $element.find('.panel-body')
                    .append('<div bx-id="' + this.moduleId + '/0" class="col-xs-4"></div>')
                    .append('<div bx-id="' + this.moduleId + '/1" class="col-xs-4"></div>')
                    .append('<div bx-id="' + this.moduleId + '/2" class="col-xs-4"></div>')
            }
        })
        return BrixImpl
    }

    function descendantFactory(id) {
        function BrixImpl(options) {
            this.options = options || {}
        }
        _.extend(BrixImpl.prototype, Brix, {
            init: init,
            destroy: destroy,
            render: function() {
                $(this.options.element).html(
                    '<pre>' +
                    JSON.stringify(
                        _.pick(this.options, 'moduleId', 'clientId', 'parentClientId'),
                        null, 2
                    ) +
                    '</pre>'
                )
                // console.log('model', id, 'render')
            }
        })
        return BrixImpl
    }

    for (var i = 0; i < 3; i++) {
        (function(id) {
            define(id, function() {
                return parentFactory(id)
            })
        })(i + '')
        for (var ii = 0; ii < 3; ii++) {
            (function(id) {
                define(id, function() {
                    return childFactory(id)
                })
            })(i + '/' + ii)
            for (var iii = 0; iii < 3; iii++) {
                (function(id) {
                    define(id, function() {
                        return descendantFactory(id)
                    })
                })(i + '/' + ii + '/' + iii)
            }
        }
    }
}