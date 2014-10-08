/* global define */
define(function() {
    var VERSION = '0.0.1'
    var EXPANDO = (Math.random() + '').replace(/\D/g, '')
    return {
        VERSION: VERSION,
        // Loader
        ROOT_CLIENT_ID: -1,
        ATTRS: {
            id: 'bx-id',
            cid: 'bx-cid',
            options: 'bx-options'
        },
        DATA_ATTRS: { // data-*
            id: 'data-module',
            cid: 'data-cid',
            options: /data-(.+)/
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
        /*
            以下属性会被自动从 options 复制到组件实例上。
            其他预设但是不会自动复制的选项有：
            * css 组件关联的 CSS 文件
         */
        OPTIONS: [ // 以下属性会被自动复制到组件实例上
            'element', // 组件关联的节点
            'relatedElement', // 组件真正的节点
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
        RE_EVENT: /bx\-(?!id|options)(.+)/,
        FN_ARGS: /([^()]+)(?:\((.*?)\))?/,
        LOADER_NAMESPACE: '._loader',
        COMPONENT_NAMESPACE: '._component',
        PREFIX: 'bx-'
    }
})