/* global define */

define(function() {

    var VERSION = '0.0.1'
    var EXPANDO = (Math.random() + '').replace(/\D/g, '')
    return {
        VERSION: VERSION,
        // Loader
        ATTRS: {
            id: 'bx-id',
            cid: 'bx-cid',
            options: 'bx-options'
        },
        SELECTORS: {
            id: '[bx-id]',
            cid: '[bx-cid]',
            options: '[bx-options]'
        },
        EVENTS: {
            ready: 'ready',
            destroy: 'destroy'
        },
        OPTIONS: [
            'element', // 组件关联的节点
            'moduleId', // 组件的模块标识符
            'clientId', // 组件实例的标识符
            'parentClientId', // 父组件实例的标识符
            'childClientIds', // 父组件实例的标识符数组
            'data', // 组件关联的数据
            'template' // 组件关联的 HTML 模板
        ],
        EXPANDO: 'Brix' + VERSION + EXPANDO,
        UUID: 0,
        // Event
        RE_EVENT: /bx\-(?!id|cid|options)(.+)/,
        FN_ARGS: /([^()]+)(?:\((.*?)\))?/,
        NAMESPACE: '.bx_event_' + EXPANDO,
        PREFIX: 'bx-'
    }
})