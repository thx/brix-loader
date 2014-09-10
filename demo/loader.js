// Start the main app logic.
require(
    [
        'jquery', 'underscore', 'mock',
        './base/brix.js', '/src/loader.js'
    ],
    function(
        $, _, Mock,
        Brix, Loader
    ) {
        window.Loader = Loader
        genBrixImpl(Brix, _, Mock)

        // 杂
        var elements = $('[bx-id]')
        _.each(elements, function(element, index) {
            var htmls = element.outerHTML.split('\n')
            var indent = htmls[htmls.length - 1].match(/^([\s\t]*)/)[0].length
            var beautified = _.map(htmls, function(line, index) {
                return index === 0 ? line : line.slice(indent)
            })
            beautified.unshift('<!-- HTML -->')
            $('<pre style="margin-top: 10px;">')
                .text(beautified.join('\n'))
                .insertAfter(element)
        })
        _.each($('h3'), function(h3) {
            h3 = $(h3)
            var text = h3.text()
            $('<a>').attr('name', h3.text()).insertBefore(h3)
            $('<a>').attr('href', '#' + text).text(text)
                .wrap('<li>')
                .parent()
                .appendTo('.navbar')
        })

        // 正式代码
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

    function init() {}

    function destroy() {}

    function parentFactory(id) {
        function ParentBrixImpl(options) {
            this.options = options || {}
        }
        _.extend(ParentBrixImpl.prototype, Brix.prototype, {
            init: init,
            destroy: destroy,
            render: function() {
                $(this.element).find('.panel-heading').html(
                    JSON.stringify(
                        _.pick(this, 'moduleId', 'clientId', 'parentClientId'),
                        null, 2
                    )
                )
                // console.log('module', id, 'render')
            },

        })
        return ParentBrixImpl
    }

    function childFactory(id) {
        function ChildBrixImpl(options) {
            this.options = options || {}
        }
        _.extend(ChildBrixImpl.prototype, Brix.prototype, {
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
                // console.log('module', id, 'render')
            }
        })
        return ChildBrixImpl
    }

    function descendantFactory(id) {
        function DescendantBrixImpl(options) {
            this.options = options || {}
        }
        _.extend(DescendantBrixImpl.prototype, Brix.prototype, {
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
                // console.log('module', id, 'render')
            }
        })
        return DescendantBrixImpl
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