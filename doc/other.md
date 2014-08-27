# 结构
组件      	brix.js
加载 & 销毁	loader.js
查找        	query.js
事件        	event.js
选项			options.js

期望：
1. 默默的加载，默默的销毁（不可能！）
	Loader.boot()
	app.boot()
	<select>
		<option></option>
	</select>
	有条件滴。。。
2. 完全集中管理？不可能！
	只能保证第一次渲染
3. 查找，然后调用
	
4. 拦截所有的销毁事件
	// 
	brix.destory() // 子组件
		// destory() 父组件、后代组件
	destructor() // 
		自定义

--------------------------

## 推理

### 角色
1. Loader
2. BrixImpl

### BrixImpl 关注点
1. 组件：解析、加载、初始化、渲染、销毁、嵌套
2. 属性：解析、初始化、改变
3. 事件：初始化、响应、销毁、嵌套

### Loader 关注点
1. 首次渲染
	* 组件：解析、加载、初始化、渲染、销毁、嵌套
2. 局部刷新
	放弃
3. 再次渲染
	

重新渲染后
	子组件嵌套渲染
	子组件事件


