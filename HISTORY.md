# History

## Brix Loader 0.0.1

**2014-09-01** Review 实现

与会人员：李牧 左莫 逸才 行列 胡伯 墨智

1. 期望的是一个纯粹的组件加载器。
2. 只负责第一次渲染和完整的重新渲染，局部更新由组件选型和维护。
2. 只负责组件暴漏的自定义事件（站在用户的角度），不负责组件为了实现功能而绑定的事件（站在组件开发者的角度，由开发者选型和维护）
4. .render() 需要包裹为 Promise

**2014-09-05** 重构代码

1. 移除对 Q.js、Underscore.js、jQuery Queue 的依赖，改为在 `src/util.js` 里重新实现，剩余的依赖有：jQuery Selector、jQuery Event。
2. 支持事件配置项，并且只处理初试配置的事件，不处理组件模板上的事件（由组件自己绑定）

**2014-09-16** 基本完成

1. Loader 去掉了所有依赖。
2. 把原先耦合在一起的代码拆分成了 4 个仓库，通过 bower 管理依赖：

	* https://github.com/thx/brix-loader
	* https://github.com/nuysoft/brix-base
	* https://github.com/nuysoft/brix-gallery
	* https://github.com/nuysoft/brix-demo

3. 演示从 https://github.com/nuysoft/brix-demo 开始。

<!-- 
错误信息不友好
 -->