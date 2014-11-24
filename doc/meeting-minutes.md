# 会议纪要

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