# 会议纪要

## 2014.12.15
1. 事件类型的解析独立出来
2. Brix Event 接受事件类型数组，再代理（绑定）
3. Loader 不处理 Brix Event，在组件的 render 里显式调用
    不处理：保险
    处理：方便
4. √ new EventManager( prefix )
5. boilerplate
            render: function() {
                this.data = this.data || _.extend({}, this.options)
                var html = _.template(template)(this.data)

                this.manager = new EventMan....
                $(this.element).append(html)
                var types = [];
                var types = manager.parseTypes() // Magix
                this.manager.delegate( this.element, types, owner )
            },
            destroy: function(){
                this.manager.undelegate()
            }

## 2014.11.27

1. Event => EventManager
	* delegateBxTypeEvents => delegate
	* undelegateBxTypeEvents => undelegate
2. components/module => brix/module
3. brix-event 过滤 mx-frame mx-view
4. 文档

## 2014.11.21

左莫 行列 墨智

1. 版本号 4.0.0
2. Event.setup 避免干扰
3. bx-target-type 都执行，不再限制从事件触发元素
4. .on .off 移入 brix-base
5. 约定发布命名空间
    thx
    brix
        loader.js
        event.js
        base.js
        ...
    magix
    require('brix/')
    require('magix/')

## 2014.11.12

李牧 左莫 行列 墨智

1. event
2. reactive
3. render promise
4. modle
5. requirejs + config.js

## 2014.9.1

李牧 左莫 行列 逸才 胡伯 古西风 墨智

1. Loader 需要更精简、更纯粹
2. 不处理局部刷新
3. render 可能是异步的，用 promise 包裹起来