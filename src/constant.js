/* global define */
/*
    
    代码风格：
    https://github.com/thx/brix-loader/issues/1

    使用 Brix 组件时，需要指定必需的『模块 ID』和可选的『组件配置』，现在的纠结之处在于它们的代码风格：

    ### 模块 ID
    
    1. <div bx-id="component/hello">
    2. <div data-id="component/hello">
    3. <div data-module="component/hello">
    4. <div bx-name="component/hello">
    5. <div data-name="component/hello">

    ## 组件配置
    
    1. <div bx-options="{ msg: 'world' }">
    2. <div bx-msg="world">
    3. <div data-msg="world">
    
    你期望用上哪种风格？求投票。

    ## 结论

    基于投票结果，确定 Brix Loader 支持的写法如下：

    ### 模块 ID

    * `<div bx-name="component/hello">`

    ### 组件配置

    同时支持：

    * `<div bx-options="{ msg: 'world' }">`
    * `<div data-msg="world">`

 */
define(function() {
    var VERSION = '0.0.1'
    var EXPANDO = (Math.random() + '').replace(/\D/g, '')
    return {
        VERSION: VERSION,
        // Loader
        ROOT_CLIENT_ID: -1,
        ATTRS: {
            id: 'bx-name',
            options: 'bx-options',
            cid: 'data-cid'
        },
        SELECTORS: {
            id: '[bx-name]',
            options: '[bx-options]',
            cid: '[data-cid]',
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
        RE_EVENT: /bx\-(?!name|options)(.+)/,
        FN_ARGS: /([^()]+)(?:\((.*?)\))?/,
        LOADER_NAMESPACE: '._loader',
        COMPONENT_NAMESPACE: '._component',
        PREFIX: 'bx-'
    }
})