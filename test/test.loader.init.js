/* global define, chai */
/* jshint unused:false */

var expect = chai.expect
	// var assert = chai.assert

var Loader, $, _, container

var TPL_CONTENT = '<pre>{ moduleId: <%= moduleId %>, clientId: <%= clientId %>, parentClientId: <%= parentClientId %> }</pre>'
var FN_CONTENT = function() {
	this.element.innerHTML = _.template(TPL_CONTENT)(this)
}

var TPL_TEST_IMPL_COUNT = 3
var TPL_TEST_IMPL = repeat('<div bx-name="test/impl"></div>', TPL_TEST_IMPL_COUNT)
var TPL_NESTED_IMPLS =
	repeat('<div bx-name="test/0"></div>', TPL_TEST_IMPL_COUNT) +
	repeat('<div bx-name="test/1"></div>', TPL_TEST_IMPL_COUNT) +
	repeat('<div bx-name="test/2"></div>', TPL_TEST_IMPL_COUNT)
var TPL_CHILDREN = '<ul>\
                        <li bx-name="<%= moduleId %>/0"></li>\
                        <li bx-name="<%= moduleId %>/1"></li>\
                        <li bx-name="<%= moduleId %>/2"></li>\
                    </ul>'

function repeat(str, count) {
	var result = ''
	for (var i = 0; i < count; i++) result += str
	return result
}

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

define('test/impl', function() {
	function Impl() {}
	_.extend(Impl.prototype, {
		render: FN_CONTENT
	})
	return Impl
})

;
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