# micro-app-substrate

一个 `micro-app` 基座，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

`micro-app` 和 `qiankun` 的区别在于，`micro-app` 是通过 `web component` 接入微应用，而 `qiankun` 是基于 `single-spa` 通过区分 `url` 加载不同的应用资源。`micro-app` 核心是将应用变成自定义元素，插入到基座中。

分 3 个部分：

- `micro-app` 使用
- `web componet` 创建组件
- `micro-app` 原理

## `micro-app` 使用

包含：

- `react-project` [[查看](https://github.com/cgfeel/micro-app-react-project)] 子应用
- `substrate` [[查看](https://github.com/cgfeel/micro-app-substrate)] 基座主应用
- `vue-project` [[查看](https://github.com/cgfeel/micro-app-vue-project)] 子应用

### 搭建基座主应用

- 目录：`substrate` [[查看](https://github.com/cgfeel/micro-app-substrate)]，当前仓库
- 搭建方式：`create-react-app`
- 路由：`react-router`

流程：

- 入口文件 `index.tsx` [[查看](https://github.com/cgfeel/micro-app-substrate/blob/main/src/index.tsx)] 引入 `micro-app` 并启动，注 ①
- 添加路由 `App.tsx` [[查看](https://github.com/cgfeel/micro-app-substrate/blob/main/src/App.tsx)]
- 在每个组件中添加组件 `micro-app` [[查看](https://github.com/cgfeel/micro-app-substrate/tree/main/src/page)]

> 注 ①：当前 `micro-app` 路由默认模式是 `search`，这里手动调整为 `native`

### 配置 `React` 子应用

- 目录：`react-project` [[查看](https://github.com/cgfeel/micro-app-react-project)]
- 搭建方式：`create-react-app`
- 路由：`react-router`

流程：

- 添加全局类型 `global.d.ts` [[查看](https://github.com/cgfeel/micro-app-react-project/blob/main/src/globals.d.ts)]
- 添加运行时动态 `publicPath`，`public-path.ts` [[查看](https://github.com/cgfeel/micro-app-react-project/blob/main/src/public-path.ts)]，并引入入口文件 `index.tsx` 头部 [[查看](https://github.com/cgfeel/micro-app-react-project/blob/main/src/index.tsx)]
- 设置端口 `.env` [[查看](https://github.com/cgfeel/micro-app-react-project/blob/main/.env)]

### 配置 `Vue` 子应用

- 目录：`vue-project` [[查看](https://github.com/cgfeel/micro-app-vue-project)]
- 搭建方式：`vue-cli`
- 路由：`vue-router`

流程：

- 添加全局类型 `global.d.ts` [[查看](https://github.com/cgfeel/micro-app-vue-project/blob/main/src/globals.d.ts)]
- 添加运行时动态 `publicPath`，`public-path.ts` [[查看](https://github.com/cgfeel/micro-app-vue-project/blob/main/src/public-path.ts)]
- 入口文件 `main.tsx` [[查看](https://github.com/cgfeel/micro-app-vue-project/blob/main/src/main.ts)]，引入 `public-path.ts` 和 `vue-router`
- 修改路由 `baseurl`，`index.ts` [[查看](https://github.com/cgfeel/micro-app-vue-project/blob/main/src/router/index.ts)]
- 修改工程配置文件 `vue.config.js` [[查看](https://github.com/cgfeel/micro-app-vue-project/blob/main/vue.config.js)]，添加 `cors`

### 配置对比

- 整体和 `qiankun` 差不多，都需要：设置端口号、`cors`、`publicPath`、`baseurl`
- 比 `qiankun` 省略的有：入口接入协议、`umd` 打包方式，注 ②

> 注 ②：这样无论是开发环境还是生产环境，既可以使用 `webpack`，也可以使用 `vite`

**优缺点：**

仅从配置接入应用进行比较

- 优点 1：基于 `web component` 和 `shadowm`，简单、隔离性好
- 优点 2：由于接入侵入性少点，所以使用的范围更广也更方便一点，比如接入 `NextJS` 应用
- 缺点：兼容性，注 ③

> 注 ③：`qinkun` 的沙箱采用的是 `proxy`，同样存在兼容问题；如果需要兼容就要降级沙箱，但这样就要牺牲性能修改模式。而 `micro-app` 是没有降级方案的。

---- 分割线 ----

## `web componet` 创建组件

详细见项目中的文件代码

- 项目：`static-project` [[查看](https://github.com/cgfeel/micro-app-static-project)]
- 文件：`web-component.html`
- 运行方式：直接点开浏览器预览

特点：

1. `custom element`: 允许使用非浏览器默认标签名去创建一个自定义元素
2. `shadowDom`：样式隔离是 `web component` 的一部分
3. 支持组件的特点：`template` 模板，`slot` 插槽，生命周期、属性

`web componet` 分为 3 个部分：

- 自定义元素，演示中为：`<my-button></my-button>`
- 模板文件：`template`
- 继承自 `HTMLElement` 组件类 `MyButton`

`MyButton` 实现过程：

- 定义元素的模式为 `shadowDom`：`this.attachShadow`
- 通过 `connectedCallback` 进行挂载
- 先获取 `template` 的内容将其转换成 `Dom`
- 将拷贝的 `Dom`和样式一并添加到 `shadowDom` 中
- 通过 `window.customElements.define` 将自定义标签和组件类关联

实例分别演示了：

- `slot` 插槽
- 观察自定义属性
- 样式隔离
- 事件触发

---- 分割线 ----

## `micro-app` 原理

由于后面总结会很长，所以我将整个流程总结精简放在前面：

1. `microApp.start` 配置项
2. `MicroAppElement` 解析 `web-component` 组件
3. `CreateApp` 创建应用
4. `HTMLLoader` 获取资源，将其放到 `web-component` 中
5. `extractSourceDom` 解析资源，将 `css` 通过作用域隔离
6. 开启沙箱 `IframeSandbox` 或 `WithSandBox`，通过 `proxy` 作为 `JS` 沙箱
7. 资源处理完毕回调 `onLoad` 触发 `mount`
8. `execScripts` 在沙箱中执行脚本，`umd` 模式还需记录 `unmount`、触发子应用的 `mount`（和 `qiankun` 一样）
9. 完成挂载触发 `afterMounted` 挂载完毕事件和通知

`micro-app` 是基于 `web component`，在上面演示了 `web component` 特性。所以大致可以想到 `micro-app` 启动流程如下：

- 去掉注册信息，无需关心接入协议
- 使用配置文件启动 `start`
- 在组件渲染过程中解析 `web component`
- 将取到的配置文件在 `web component` 生命周期内进行处理，如：添加沙箱等

和 `qiankun` 解读一样，为了便于阅读全部以当前官方版本 `c177d77ea7f8986719854bfc9445353d91473f0d` [[查看](https://github.com/micro-zoe/micro-app/tree/c177d77ea7f8986719854bfc9445353d91473f0d)] 为准

> 这一章节链接指向官方仓库，由于内容比较长，每一条信息我都暴露了关键的对象名，可以打开链接复制关键的对象名，查看上下文对照理解。有一点需要说明的是，`micro-app` 更新速度比 `qinkun` 要快，可能你在查阅的时候最新的源码已做了调整

### `microApp.start` 启动应用

直接从 `start` 方法开始

目录：`micro_app.ts` - `MicroApp` - `start` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app.ts#L284)]

参数：

- `options`：`OptionsType` 类型，直接看官方文档 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/api?id=start)]

准备工作，判断和设置环境：

- 运行环境必须支持 `window` 和 `web component`：`isBrowser || !window.customElements`
- 保证一个基座只启动 1 次 `hasInit`，通过即设置为 `true` 避免重复 `start`
- 判断自定义 `tagName`
- `initGlobalEnv`：将当前环境下的 `global` 做一份备份，注 ④
- 确保真实 `window` 是否中还没有创建自定义的 `tagName`

> 注 ④ `global_env.ts` - `initGlobalEnv` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/libs/global_env.ts#L65)]：
>
> - 将 `window`、`document`、`Document` 上的属性和方法拷贝到 `globalEnv` 中
> - 创建一个 `supportModuleScript` 用于判断是否支持 `Module Scripts`，加载应用资源时会用到
> - 创建一个 `Image` 的 `proxy` 对象，用于在创建时使用微应用的名称添加一个属性 `__MICRO_APP_NAME__`
> - 给 `window` 注入一个全局属性 `__MICRO_APP_BASE_APPLICATION__`
> - 通过 `rejectMicroAppStyle` 创建一个 `style` 标签，将所有 `tagName` 和 `micro-app-body` 作为块级元素，隐藏 `micro-app-head`
> - `micro-app` 会将子应用的 `head` 转换为 `micro-app-head`，将 `body` 转换为 `micro-app-body`，后面会提到

定义配置文件：

- 将整个 `options` 赋值给 `this.options`
- `disable-scopecss` 定义全局禁用样式隔离，默认为 `false`
- `disable-sandbox` 定义全局禁用沙箱，默认为 `false`
- `preFetch` 利用浏览器空闲时间预加载 `app` 资源，注 ⑤
- `getGlobalAssets` 利用浏览器空闲时间设置全局静态资源，注 ⑥
- 修正子应用插件的 `key`，注 ⑦
- 定义配置之后开始创建自定义组件：`defineElement(this.tagName)`

> 注 ⑤：关于预加载通过文档了解 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/prefetch)]
>
> 目录：`prefetch.ts` - `preFetch` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/prefetch.ts#L62)]
>
> 原理：
>
> - `preFetch` 在 `requestIdleCallback` 中起一个微任务
> - 通过 `preFetchInSerial` 拍平并通过 `preFetchAction` 微任务队列加载：
> - `preFetchAction` 返回一个 `promise`，在 `promise` 中通过 `requestIdleCallback` 空闲时间预加载每一个应用
> - 在每一个微任务中通过 `CreateApp` 创建微任务，这是一个内部的类，外部不可以导入使用
> - `CreateApp` 构造函数中会用每个应用名，映射一张 `map` 表：`appInstanceMap`（后面会提到）
>
> `micro-app` 和 `qiankun` 都支持预加载，不同的是：
>
> - `qiankun` 默认在第一个应用加载完成后开始预加载，可以通过 `prefetch: 'all'` 优先加载全部应用
> - `micro-app` 没有自定义加载策略，只能通过 `delay` 统一延迟加载时间
> - `micro-app` 可以设置加载等级：加载、执行、渲染，`qiankun` 并不支持，同样不支持的还有 `iframe` 沙箱
> - 除此之外 `micro-app` 预加载还支持隔离、渲染等配置，而 `qiankun` 中需要通过手动加载 `loadMicroApp` 来实现，但手动加载并非预加载
>
> 注 ⑥：
>
> 目录：`prefetch.ts` - `getGlobalAssets` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/prefetch.ts#L158)]
>
> 原理：
>
> - 空闲时间分别利用 `fetchGlobalResources` 加载全局资源
> - 在函数中通过 `fetchSource` 直接 `fetchSource` 资源后通过 `promiseStream` 迭代数据流分别处理
> - 将拿到的资源按照 `js` 和 `css` 分类分别通过 `sourceHandler.setInfo` 记录
> - 在 `sourceHandler` 中将收到的数据记录为一个 `map` 对象
>
> `fetchSource` 原理：
>
> - 清空当前运行时的应用名
> - 如果 `start` 提供了 `fetch` 优先使用，否则使用 `window.fetch`
>
> 注 ⑦：
>
> - 只修正子应用 `plugins.modules`，不修正 `plugins.global`
> - 将不符合驼峰规范的 `key` 转换后，重新赋值并删除之前的 `key`

### `defineElement` 自定义组件

原理和上面 `web component` 特性一样，在函数内部定义了一个类 `MicroAppElement`，并通过 `globalEnv.rawWindow.customElements.define` 创建自定义组件

目录：`micro_app_element.ts` - `defineElement` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app_element.ts)]

参数：

- `tagName`：应用名称

这里按照珠峰的课程只罗列提到的几个方法

在当前版本的 `micro-app` 做了调整：

- 在 `MicroAppElement` 中是有两个静态方法 `static get data` 和 `static set data`，不再提供给自定义组件 `<micro-app />` 使用
- 而是作为 `MicroAppElement` 修改 `this.data` 值时触发，而只有 `setAttribute` 这一处，这是对外提供的
- 而只有当 `setAttribute` 设置的 `key` 是 `data` 的时候，才会遍历 `value` 更新 `this.data`，从而触发 `microApp.setDat`
- 去除了 `MicroAppElement` 构造函数，给 `property` 打补丁也修改为 `patchElementAndDocument`，并挪动到沙箱中使用

> 修正 `property` 补丁：
>
> - `patchElementAndDocument` 在沙箱启动时 `start` 调用，详细见 `patch.ts` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/patch.ts#L346)]

下面罗列的方法都在 `MicroAppElement` 类中，复制关键词查阅

#### 1.1 `connectedCallback` 挂载组件：

- 自增 `this.connectedCount`
- 设置一个状态 `map`：`this.connectStateMap.set(cacheCount, true)`

`defer` 添加一个微任务：

- `dispatchLifecyclesEvent` 创建并执行 `create` 事件，注 ⑧
- 如果提供了应用名和连接，执行首次挂载 `handleConnected`，稍后总结

> 注 ⑧：使用当前元素、应用名、`created` 来创建事件
>
> - 先定位到元素的根元素上：`getRootContainer`
> - 删除作用域中其他应用
> - 将信息合并创建自定义 `created` 事件，并通过 `formatEventInfo` 捆绑事件对象元素
> - 如果 `start` 时提供了 `created` 优先触发
> - 然后触发自定义事件 `created`

#### 1.2 `disconnectedCallback` 卸载组件：

- 在映射表 `this.connectStateMap` 将当前应用设置为 `false`
- 执行卸载操作 `handleDisconnected`

#### 2.1 `attributeChangedCallback` 观察属性修改：

只观察 2 个属性：`name`、`url`，提供的值一个非空的字符，且和老的值不一样才会执行

如果当前修改的是 `url` 或 `name`，且值为空或者当前元素已卸载：

- 如果是 `url`，格式化 `formatAppURL` 并更新值
- 如果是 `name`，在格式化并更新值之前，要先更新：应用信息、元素信息、属性
- 无论是更新 `url` 还是 `name`，只要当前元素已挂载，就会再次执行一遍挂载操作 `handleInitialNameAndUrl`
- `handleInitialNameAndUrl` 中会根据应用启动状态，执行首次加载 `handleConnected`，稍后总结
- 如果以上都不是且状态不是 `isWaiting`，创建一个微任务 `handleAttributeUpdate`
- 否则不做任何操作

`handleAttributeUpdate` 更新已赋值且挂载的应用：

- 进入微任务先取消 `isWaiting` 状态
- 查看当前元素上 `url` 和 `name` 都是有效值：`this.getAttribute`
- 通过 `appInstanceMap` 将应用取出来
- 如果修改的是 `name`，应用没有卸载、没有隐藏、不是预加载，更新之后返回一个错误警告
- 否则进行修改应用信息

修改应用信息：

- 如果修改 `url`，卸载应用后再启动：`unmount` - `actionsForAttributeChange`
- 否则看是否在线应用，断开连接后再启动：`actionsForAttributeChange` - `actionsForAttributeChange`
- 其他情况参考第一条，区别在于不会在卸载时清除缓存

如果当前元素上 `name` 或 `url` 是空值，且 `name` 发生了变动：

- 不去管应用状态，直接修改 `this.setAttribute`

有了以上流程之后再来看挂载应用

#### 3.1 `handleConnected` 首次加载

称作首次加载来自与备注：`first mount of this app`，其实会分别在这些场合触发：

- `handleInitialNameAndUrl`：修改属性后，包括首次赋值
- `connectedCallback`：已挂载组件时
- `reload`：重新加载应用

> 在珠峰课程里 `initialMount` 就是 `handleConnected`，只是版本不一样叫法不一样

现在可以带入场景来看了，假定有一个初始化的 `web-component`，首次加载如下：

- `attributeChangedCallback`：观察变化的属性
- 设置 `name` 和 `url`，且 `this` 没有值，更新后发起挂载 `handleInitialNameAndUrl`
- 由于应用并没有完成挂载 `this.connectStateMap` 导致无效
- 生命周期来到已挂载：`connectedCallback`，记录 `this.connectStateMap`
- 在微任务中检查到 `name` 和 `url`，发起首次挂载
- 如果属性缺失则等待组件属性更新，重新从 `attributeChangedCallback` 开始执行，执行过程上面已总结
- 而 `connectedCallback`，除了重新挂载以外，例如：`adopt`，在后续过程中不再执行

`handleConnected` 执行流程：

- 应用名和连接都存在才会执行
- 检查是否开启 `shadowDom`，在环境允许的情况下开启，模式为 `open`，允许外部访问
- 在 `ssr` 环境下更新应用连接，注 ⑨
- 通过 `appInstanceMap` 将应用取出来，如果提取不出来创建实例 `handleCreateApp`
- 根据情况修改实例，创建和修改都在下面总结

> 注 ⑨：更新 `url`
>
> - `getDisposeResult` 检查是否开启 `ssr`，没有责将 `ssrUrl` 设为空，否则往下看
> - 判断是否开启虚拟路由系统：`disable-memory-router`
> - 如果是虚拟路由，`CompletionPath` 将真实路由的 `pathname` + `search` 和 应用连接，组合成为 `ssrUrl`
> - 否则将从现有的浏览器连接中获取路由
>
> 从浏览器提取路由：
>
> - `getNoHashMicroPathFromURL` 使用应用的 `name` 和 `url` 从浏览器地址中提取路由
> - 如果提取失败，`getDefaultPage` 拿默认渲染的页面
> - 将默认渲染的页面和应用 `url` 创建 `ssrUrl`
>
> 在当前版本中 `ssrUrl` 优先级高于 `url`，但是在 `keep-alive` 下比对连接，不用考虑 `ssrUrl`

`handleCreateApp` 创建实例，先根据应用名获取实例，3 个情况：

- 实例存在且是预加载 `isPrerender`，当前对象中直接注销应用：`unmount`，之后再创建应用 `createAppInstance`
- 实例存在不是预加载，彻底销毁应用 `actionsForCompletelyDestroy`，之后再创建应用 `createAppInstance`
- 实例不存在，直接创建应用 `createAppInstance`

在 `CreateApp` 中会重新设置实例 `appInstanceMap`

修改实例前会先拿到应用信息，和当前的信息进行比对：

- 如果应用已隐藏，且修改的应用 `url` 一样，重新连接应用：`handleShowKeepAliveApp`
- 如果 `url` 都一样，当前应用已卸载，或是预加载应用且核心一致，注 ⑩，直接挂载：`this.handleMount(oldApp)`
- 否则如果应用是预加载或者已卸载，重新创建一个代替原来的应用：`handleCreateApp`
- 以上情况都不是直接报错

> 注 10：核心信息包括：`scopecss`、`useSandbox`、`iframe`

再次带入场景，修改一个已挂载的应用 `attributeChangedCallback`，会有两种情况：

1. 修改的是 `url` 或 `name`，并且这个使用应用没有挂载，注 ⑩
2. 还是修改同样的属性，但应用肯定是挂载了或预加载了

> 注 ⑩：因为判断条件是，要么修改的属性值为 `false`，要么应用没加载 `connectStateMap`，这两个任意条件满足都不会挂载

得出下面结论：

- 没挂载的情况执行 `handleConnected`
- 挂载了执行 `handleAttributeUpdate`，不会执行 `handleConnected` 流程上面描述了
- 这样无论是应用新增，还是非挂载应用挂载、还是重新加载，都保证能够顺利通过 `handleConnected`

#### 3.2 `handleDisconnected` 卸载操作

- `appInstanceMap` 先拿到应用信息，确保应用存在、没有被卸载、不是隐藏
- 如果是 `keep-alive` 仅下线应用，保活
- 否则卸载应用 `this.unmount(destroy, callback)`

至此整个 `MicroAppElement` 基本说完，大致分了 3 个步骤：

1. 挂载和卸载：`connectedCallback`、`disconnectedCallback`
2. 监听属性变化：`attributeChangedCallback`
3. 首次执行加载和执行卸载：`handleConnected`、`handleDisconnected`

---- 分割线 ----

### `CreateApp` 创建应用类

在 `MicroAppElement` 中都会统一使用 `CreateApp` 这个类来创建应用。这个类不对外开放，不支持通过 `CreateApp` 手动创建应用，而是通过 `<micro-app />` 来创建。

目录：`create_app.ts` - `CreateApp` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L59)]

参数：

- `options`：`CreateAppParam` 类型

`CreateApp` 的主要作用是：

- 理由拿到的信息加载资源
- 启动沙箱
- 创建应用

设置的信息包含：

- 将自身对象添加到映射表中：`appInstanceMap`
- 加载的信息建议直接读源码 [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L99)]
- 加载资源前先设置一个对象 `this.source`
- 之后分别开始加载资源 `loadSourceCode`、创建沙箱 `createSandbox`

其中 `this.source` 增加了 `html` 为一个字符串，`css` 和 `js` 也由 `map` 改为了 `set`

#### 1.1. `loadSourceCode` 加载资源

目录：`create_app.ts` - `loadSourceCode` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L127)]

- 设置应用状态 `setAppState`
- `HTMLLoader` 加载资源

#### 1.2. `HTMLLoader` 加载资源：

目录：`html.ts` - `HTMLLoader` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/loader/html.ts#L10)]

- `getInstance` 返回单例
- `run`：执行加载和格式化的逻辑

加载的本质还是 `fetch`：

- 拿到应用 `name` 和 `url`
- `isTargetExtension` 判断加载的资源是不是 `js`
- 如果是 `js` 资源，将其包裹成一个子应用，否则通过 `fetchSource` 加载资源，见注 ⑥
- 如果加载遇到了问题，向应用抛出加载错误：`app.onLoadError(e)`
- 如果获取不到内容，向应用抛出错误：`app.onerror(new Error(msg))`
- 否则将拿到的资源、链接、应用名，通过 `formatHTML` 格式化
- 将格式化后的数据通过传过来的回调函数进行处理，这里是：`extractSourceDom`

**`formatHTML` 格式化：**

- 将拿到的链接、资源、应用名、插件传给 `processHtml` 处理并返回资源，注 ⑪
- 替换 `html` 资源中的 `head` 为 `micro-app-head`
- 替换 `html` 资源中的 `body` 为 `micro-app-body`

关于加载有一点需要强调，`HTMLLoader` 将所有的连接都当做一个微应用来加载 `html`，当加载的是 `js` 资源也会将其包裹成子应用进行加载

> 注 ⑪：
>
> - `processHtml` 会提取所有全局的 `plugin`，和当前指定的 `plugin`
> - 然后通过 `reduce` 遍历 `plugin` 集合
> - 如果 `pllugin` 是一个对象，且包含了 `processHtml` 方法
> - 将获取的资源传入进去处理

在启动应用中会有 2 处用到 `HTMLLoader`：

- 启动时预加载
- 创建应用加载资源

带入场景来看吧，预加载应用后加载应用：

- `start` 时 `preFetch` 发起预加载微任务，详细流程见 `microApp.start` 总结
- 流程：`preFetchInSerial` - `preFetchInSerial` - `preFetchAction` - `promiseRequestIdle`

再加载应用，先从属性修改开始：

- 详细流程见 `defineElement` 总结
- 流程：`attributeChangedCallback` - `connectedCallback` - `handleConnected`
- 拿到预加载的应用，`url` 没变，核心配置没变，又是预加载：`isPrefetch`
- 直接发起挂载应用：`this.handleMount(oldApp)`
- 设置应用状态 `appStates.BEFORE_MOUNT` 后，发起挂载 `this.mount(app))`
- 通过 `CreateApp` 的 `mount` 挂载应用
- 从而略过再次加载资源、启动沙箱

> 这里还有个逻辑问题，当子模块名不规范的时候，`preFetch` 又优先于模块名称转换，这个时候加载的资源是匹配不到模块的。

#### 1.3. `extractSourceDom` 成功加载资源回调：

回到 `CreateApp.loadSourceCode`，加载资源时提供一个资源加载成功后的回调 `extractSourceDom`，用于提取 `link` 和 `script`，并绑定 `style` 的 `scope`

目录：`index.ts` - `extractSourceDom` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/index.ts#L82)]

- 先通过 `(new DOMParser()).parseFromString` 解析加载的 `html` 资源，注 ⑫
- 查找 `micro-app-head` 和 `micro-app-body`，如果都不存在报错返回
- 创建一个 `fiberStyleTasks` 用于收集加载的样式队列，注 ⑬
- 使用 `flatChildren` 递归处理每一个子集元素，注 ⑭
- 使用 `serialExecFiberTasks` 将 `flatChildren` 队列执行，过程见下方注解
- 如果应用加载过程中获取到 `css` 资源，通过 `fetchLinksFromHtml` 挨个获取，注 ⑮
- 如果应用加载过程中获取到 `js` 资源，通过 `fetchScriptsFromHtml` 挨个获取
- 加载完资源最终会触发 `app.onLoad`

在 `app.onLoad` 中只判断资源是否加载完毕，加载完毕执行 `mount`

> 注 ⑫：优先使用沙箱 `this.sandBox.proxyWindow.DOMParser`
>
> 注 ⑬：`fiberStyleTasks` 添加要求要么预加载 `isPrefetch`、要么 `fiber`
>
> - 假定不预加载，在 `CreateApp` 找 `fiber` 有两处
> - 第一处初始化 `false`，第二处 `mount` 更新
> - 这样如果应用不是预加载将不会使用队列 `fiberStyleTasks` 来收集 `inner style`
> - 而是立即执行每一个 `scopedCSS`
> - 这种情况 `serialExecFiberTasks` 返回的 `fiberStyleResult` 也是 `null`
>
> 注 ⑭：`flatChildren`
>
> - 通过获取的资源 `wrapElement`，应用 `app`，头部 `microAppHead`，集合 `fiberStyleTasks`
> - 想获取每次递归资源的子集转换成数组：`Array.from(parent.children)`
> - 遍历 `children` 迭代递归 `flatChildren`
> - 拆分每一个 `children` 的 `dom`，分 4 类处理：`link`、`style`、`script`、`image`
>
> 关于：
>
> 处理 `link`：
>
> - 如果元素包含 `exclude` 属性，或者使用 `pllugin` 的 `excludeChecker` 排除，注释掉
> - 如果元素没有包含 `ignore` 属性，或者没有使用 `pllugin` 的 `ignoreChecker` 排除
> - 这种情况的 `link` 包含 `stylesheet` 属性，通过 `extractLinkFromHtml` 替换成注释，不包含责跳过下面操作
> - 并汇总信息到 `linkInfo`，同时将连接添加到 `app.source.links.add()` 用于后续队列加载
> - 否则就修正元素的 `href` 属性为子应用对应的链接 `CompletionPath`
>
> 处理 `style`:
>
> - 如果默认的样式隔离，且没有 `ignore` 属性，通过 `injectFiberTask` 队列调用 `scopedCSS` 将修改作用域的样式添加到 `fiberStyleTasks`
> - 如果元素包含 `exclude` 替换成注释，其他情况不做考虑
>
> 处理 `script`：可以按照下面思路来解读
>
> - 只看 `replaceComment` 有 5 条，无论哪种结果都是用注释代替 `script`
> - 对于带有链接的 `script` 会 `remote`，将获取的信息最终汇总到 `sourceCenter`
> - 同时将连接添加到 `app.source.scripts.add()` 用于后续队列加载
> - 对于 `inner script` 将信息直接汇总到 `sourceCenter`
> - 同时添加一个随机字符到 `app.source.scripts.add()`
>
> 处理 `image`：
>
> - 修正元素的 `href` 属性为子应用对应的链接 `CompletionPath`
>
> 额外说下 `fiberStyleTasks`，用途是将修改 `css` 作用域的方法，封装在一个微任务队列中：
>
> - 先通过 `injectFiberTask` 将队列 `fiberStyleTasks` 传过去
> - 一同传过去的还有修改 `css` 作用域的方法 `scopedCSS`
> - 返回的类型是 `() => promise<void>`，方便在后面迭代队列依次执行
>
> 执行 `injectFiberTask` 流程如下：
>
> - 拿到 `() => promise<void>`，执行 `promise`
> - `promise` 中通过 `requestIdleCallback` 将 `resolve` 传给 `callback` 并执行
> - `callback` 中先修改 `css` 的作用域 `scopedCSS`
> - 然后通过 `resolve(void)` 返回最初函数中的 `promise`，以便后续队列执行
>
> 注 ⑮：`fetchLinksFromHtml`
>
> 目录：`links.ts` - `fetchLinksFromHtml` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/links.ts#L124C17-L124C35)]
>
> - 转换资源 `app.source.links` 为数组
> - 通过 `fetchLinkPromise` 将加载作为一个队列，队列加载中如果资源没有内容，使用 `fetchSource` 直接请求获取
> - 根据 `fiberStyleResult` 决定是队列，还是立即执行
> - 执行 `promiseStream` 队列，这里假定都是成功的
> - 通过 `injectFiberTask` 将 `fetchLinkSuccess` 放入空闲时间执行
> - 立即执行没有 `fiberStyleResult` 直接触发 `app.onLoad`
> - 否则将 `app.onLoad` 添加到 `fiberLinkTasks` 队列最后，通过 `serialExecFiberTasks` 依次执行
>
> 说说 `fetchLinkSuccess`：
>
> 目录：`links.ts` - `fetchLinkSuccess` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/links.ts#L177)]
>
> 用途：
>
> - 微应用初始化时，将链接的占位符替换为实际的样式标签。通过确保在正确的时机和条件下执行，优化了微应用的资源加载和样式处理。
> - 简单来说这里将 `link` 转换为 `style`，直接替换或插入应用中
>
> 流程：
>
> - 获取链接信息：从 `sourceCenter` 中获取 `linkInfo` 对象，并将源代码赋值给 `linkInfo.code`
> - 获取应用的 `appSpaceData` 和 `placeholder`
> - 如果 `placeholder` 存在，创建一个新的 `style` 元素 `convertStyle`
> - `handleConvertStyle` 转换样式
> - 如果 `placeholder` 存在父节点，则用新的 `style` 标签替换 `placeholder`。否则，将 `style` 标签添加到 `microAppHead`。

#### 2.1. `createSandbox` 创建沙箱

目录：`create_app.ts` - `createSandbox` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L757)]

- 默认开启 `sandbox`，且还未初始化沙箱
- 根据选择决定初始化 `iframe` 沙箱还是默认沙箱

#### 2.2. `IframeSandbox` 沙箱

目录：`index.ts` - `IframeSandbox` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/sandbox/iframe/index.ts#L60)]

静态属性和实例属性：

```
static activeCount = 0; // 活跃的沙盒数量
private active = false; // 沙盒是否处于活跃状态
private windowEffect!: CommonEffectHook; // window effect
private documentEffect!: CommonEffectHook; // document effect
private removeHistoryListener!: CallableFunction; // unique listener of popstate event for child app
public escapeProperties: PropertyKey[] = []; // 可以逃逸到外部的全局变量集合，见 start 配置中的 escapeProperties
public escapeKeys = new Set<PropertyKey>(); // 在卸载时清除的逃逸属性
public deleteIframeElement: () => void; // 删除 iframe 元素的函数
public iframe!: HTMLIFrameElement | null; // iframe 元素
public sandboxReady!: Promise<void>; // 标记沙盒是否初始化完成的 Promise
public proxyWindow: WindowProxy & microAppWindowType; // 代理 window
public microAppWindow: microAppWindowType; // 微应用 window 对象
public proxyLocation!: MicroLocation; // 子应用的代理Location对象
public baseElement!: HTMLBaseElement; // 基本元素
public microHead!: HTMLHeadElement; // 微应用 header
public microBody!: HTMLBodyElement; // 微应用 body
public appName: string; // 应用名称
public url: string; // 应用 URL
```

`constructor` 构造函数：

- 创建一个新的 `iframe`，并对 `iframe` 中的 `window`，`document`，`location` 等对象进行了“污染清理”，以阻止它们访问和修改宿主应用的相关对象
- 同时对 `micro-app` `window` 的一些静态变量进行了初始化

`createIframeElement` 创建 `iframe` 元素：

- 根据应用名和浏览器路径创建并返回一个 `iframe` 元素
- 并返回函数用于移除创建的 `iframe`
- 之后拿到 `ifrrame` 的 `window` 对象作为 `microAppWindow`
- 复制 `microAppWindow` 你会看到 `patchIframe` 整个都在为 `microAppWindow` 打补丁

`patchIframe` 打补丁：

- `createIframeTemplate`：为 `iframe` 创建一个空的 `html` 模板
- `getSpecialProperties`：将 `start` 时提供的 `plugins.escapeProperties` 逃逸的变量在沙箱中共享
- `patchRouter`：根据应用信息，修正沙箱的 `location` 和子应用的 `history`
- `patchWindow`：补充 `window` 属性 `patchWindowProperty`，`createProxyWindow` 创建一个 `proxy` 对象代理沙箱环境下的 `window`，`patchWindowEffect` 代理 `addEventListener`、`removeEventListener` 子应用和基座相同事件冲突
- `patchDocument`：修正 `document` 的 `property`、`prototype`、`eventListener`
- `patchElement`：修正 `iframe` 的 `Node`、以及 `Node` 相关的 `attribute`
- `initStaticGlobalKeys`：为微应用注入全局属性

打补丁额外说明：

- 构造函数只挂载了方法，`patchIframe` 返回一个 `promise` 会在 `mount` 挂载应用前执行
- `iframe` 沙箱的 `document` 会在 `iframe` 初始化后重建

`start` 启动沙箱：

- 设置路由状态，添加历史记录监听器
- 创建并应用 `base` 元素，以及对 `HTML` 元素和 `document` 进行补丁处理等逻辑

`stop` 停止沙箱：

- 撤销 `window`，`document` 的补丁，恢复路由状态，移除历史记录监听器
- 移除 `iframe` 以及清理一些微应用的全局变量等操作。

`createIframeTemplate` 创建 `iframe` 模板：

- 清空 `iframe` 重塑内容

`initStaticGlobalKeys` 注入方法到沙箱的 `window` 上：

- 除了注入了全局对象外，通过 `EventCenterForMicroApp` 重新定义了相关的事件

**总结：**

`IframeSandbox` 类通过创建和管理 `iframe` 元素，隔离微应用的执行环境，提供了灵活且安全的沙盒机制。它包括：

- 初始化和配置 `iframe` 元素。
- 代理和修补窗口、文档、路由等。
- 管理全局状态和事件。
- 提供启动和停止沙盒的方法。

#### 2.3. `WithSandBox` 默认沙箱

目录：`index.ts` - `WithSandBox` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/sandbox/with/index.ts#L93)]

`WithSandBox` 基于 `BaseSandbox`，属性：

- `rawWindowScopeKeyList`：只能分配给原始 `window` 的属性列表。
- `staticEscapeProperties`：可以逃逸到原始 `window` 的属性列表。
- `staticScopeProperties`：在子应用中作用域内的属性列表。
- `scopeProperties`：在 `microAppWindow` 中作用域内的属性。
- `escapeProperties`：可以逃逸到原始 `window` 的属性。
- `injectedKeys`：新添加到 `microAppWindow` 的属性集合。
- `escapeKeys`：逃逸到原始 `window` 属性集合，在卸载时清除。
- `sandboxReady`：表示沙箱是否初始化的 `Promise`。

`injectReactHMRProperty` 方法：

- 构建函数唯一做的一件事，根据环境添加 `React` 热模块替换 (`HMR`) 属性
- 需要特别处理的全局变量，比如 `__REACT_ERROR_OVERLAY_GLOBAL_HOOK__` 等

`WithSandBox` 类属性：

- `activeCount`：活跃沙箱的数量。
- `active`：指示沙箱是否活跃。
- `windowEffect`：`window effect`
- `documentEffect`：`document effect`
- `removeHistoryListener`：unique listener of popstate event for child app
- `proxyWindow`：`window` 对象的代理。
- `microAppWindow`：`micro-app window` 的代理目标。

`constructor` 构造函数：

- 初始化沙箱，修补必要的属性，并设置 `micro-app` 的环境。
- 调用父类 `BaseSandbox` 的构造函数。
- 使用 `patchWith` 方法修补环境，设置特殊属性、内存路由器、`window effect` 和 `document effect`，并初始化全局键。

`patchWith` 和 `ifram` 沙箱一样是打补丁：

- `getSpecialProperties`：将 `start` 时提供的 `plugins.escapeProperties` 逃逸的变量在沙箱中共享
- `patchRouter`：根据应用信息，修正沙箱的 `location` 和子应用的 `history`
- `patchWindow`：补充 `window` 属性 `patchWindowProperty`，`createProxyWindow` 创建一个 `proxy` 对象代理沙箱环境下的 `window`，`patchWindowEffect` 代理 `addEventListener`、`removeEventListener` 子应用和基座相同事件冲突
- `patchDocument`：修正 `document` 的 `property`、`prototype`、`eventListener`
- `setMappingPropertiesWithRawDescriptor`：在 `microAppWindow` 对象上设置一些映射属性
- `initStaticGlobalKeys`：为微应用注入全局属性

> `setMappingPropertiesWithRawDescriptor` 生命 2 个对象 `topValue`、`parentValue`，如果 `iframe` 中分别表示 `top` 和 `parent`，否则统一等于 `window` 对象，然后将获取到的对象，为应用代理的 `microAppWindow` 赋值 `top` 和 `parent` 两个属性。最后遍历 `GLOBAL_KEY_TO_WINDOW` 数组中的每个键（`window`、`self`、`globalThis`），并在 `microAppWindow` 上定义这些属性。每个属性都通过 `createDescriptorForMicroAppWindow` 方法创建，并映射到 `this.proxyWindow`。

打补丁额外说明：

- 构造函数只挂载了方法，`patchIframe` 返回一个 `promise` 会在 `mount` 挂载应用前执行

`start` 启动：

- 激活沙箱并执行初始操作，如设置内存路由器和全局键。
- 初始化路由状态，附加事件监听器，并修补全局键。

`stop` 停止：

- 停止沙箱，释放全局效果并清理资源。
- 清除路由状态，并在需要时移除注入的键和事件监听器。

`effect` 管理：

- `recordAndReleaseEffect`：管理全局 `effect` 的记录和释放（事件、超时、数据监听器），以确保沙箱可以重置或恢复其状态。
- `resetEffectSnapshot`：重置 `effect` 为干净状态，重置效果快照数据。
- `recordEffectSnapshot`：捕获当前的全局 `effect` 状态、快照。
- `rebuildEffectSnapshot`：恢复先前捕获的 `effect`，重建全局 `effect` 的快照。

路由器和全局属性管理：

- `initRouteState`：初始化路由状态。
- `patchRouter`：设置子应用的自定义路由，设置内存路由器的 `location` 和 `history`。
- `setHijackProperty`：设置 `micro-app window` 上的属性以确保隔离，确保某些属性（例如 `eval`，`Image`）在沙箱内受到控制。
- `patchRequestApi`：重写 `fetch`、`XMLHttpRequest` 和 `EventSource` 以确保隔离，为 `micro-app` 隔离网络请求 API。
- `clearRouteState`：清除路由状态。

其他方法：

- `initStaticGlobalKeys`：向 `micro-app window` 注入全局属性。
- `releaseGlobalEffect`：清除全局事件、超时和数据监听器。
- `getSpecialProperties`：从 `plugin` 中获取作用域和逃逸属性。
- `setScopeProperties`：初始化 `micro-app window` 上的作用域属性。
- `patchStaticElement`：在初始化时格式化所有 `HTML` 元素。
- `actionBeforeExecScripts`：在执行脚本之前修补静态元素。
- `setStaticAppState`：设置静态应用状态。

**总结：**

- `BaseSandbox` 和 `WithSandBox` 类为运行微前端提供了一个隔离环境。
- 它们管理全局属性、事件、网络请求和路由，确保每个 `micro-app` 独立运行，不干扰全局环境或其他 `micro-app`。
- 这种设置对于维护主应用的完整性和安全性，同时允许多个 `micro-app` 共存和正确运行非常重要。

**额外补充：**

- 无论 `IframeSandbox` 还是 `WithSandBox` 都是由 `CreateApp` 创建，并不对外提供
- 不同的沙箱虽然特性有差异，但是最为沙箱公共特性的这部分居然没有统一的 `implements`
- 作为使用者，可以不用逐行阅读沙箱源码，建议查看上方对提供的方法总结，只关注输入的参数和输出的类型

#### 3.1. `mount` 挂载应用

`app.onLoad` 加载完成后调用，一个对外公开的方法，做了 3 件事：

- 资源没完成加载完成，触发事件并修改状态
- 创建沙箱、更新状态
- 挂载应用

**`loadSourceLevel` 资源没完成加载完成：**

主要用于外部调用，比如预加载应用时：

- 设置容器 `container`，可能是一个用于挂载应用的 `DOM` 元素。
- 禁用预渲染功能 `this.isPrerender`，这可能是因为代码正在尝试在资源加载完毕之前就开始挂载应用，这种情况下可能无法进行预渲染。
- 之后 `dispatchCustomEventToMicroApp` 触发一个自定义事件 `statechange`，并将应用的状态 `appState` 修改为 `LOADING`

**创建沙箱、更新状态：**

- `createSandbox` 上面已总结过了，构建时会尽可能创建沙箱，并存储在 `sandBox`，后续根据这个对象判断是否创建
- `this.setAppState` 之后将应用的状态 `appState` 修改为 `BEFORE_MOUNT`

**`nextAction` 挂载应用：**

如果启用了沙箱 `this.sandBox`，会等沙箱完成启动后并且未卸载状态下挂载应用

**特殊场景：**

代码首先列出了一些特殊场景：

1. 挂载发生在 `prerender` 执行挂载之前（加载资源）。
2. 挂载发生在预渲染 `JavaScript` 执行期间。
3. 挂载发生在预渲染 `JavaScript` 执行结束后。
4. 挂载发生在 `prerender` 卸载后。

**判断预渲染状态：**

检查当前容器是否处于预渲染状态 `this.isPrerender`，并且是否是一个带有 `prerender` 属性的 `<div>` 元素。如果满足条件，执行以下操作：

- `cloneContainer` 替换容器：当前容器为 `<div prerender='true'>`，将其替换为 `<micro-app>` 元素。
- 注意：必须在 `this.sandBox.rebuildEffectSnapshot` 和 `this.preRenderEvents?.forEach((cb) => cb())` 执行之前进行替换。
- `rebuildEffectSnapshot` 重建全局 `effect`：重建 `window`、`document` 和 `data center` 的 `effect` 事件。
- 恢复之前记录的预渲染事件 `this.preRenderEvents?.forEach`。
- 重置预渲染状态 `isPrerender`、`preRenderEvents`
- 将路由信息附加到浏览器 URL `router.attachToURL`
- 设置沙箱的预渲染状态 `this.sandBox?.setPreRenderState(false)`

**常规挂载流程：**

如果不处于预渲染状态，执行以下操作：

- 设置容器、内联模式状态、纤程模式和路由模式：`container`、`inline`、`fiber`、`routerMode`
- 创建并派发 `BEFOREMOUNT` 生命周期事件，如果是预渲染将事件插入 `preRenderEvents` 不执行
- 将应用状态设置为 `MOUNTING`。
- 向微应用派发 `statechange` 事件，通知应用状态变化。
- 根据 `umdMode` 决定是深度克隆还是浅克隆容器
- 启动沙箱 `this.sandBox?.start`，详细见上方沙箱总结
- 根据 `umdMode` 执行脚本

**不是 `umdMode`：**

- 更新 `HTML` 元素信息，并在沙箱内执行脚本 `execScripts`
- 在所有脚本执行完毕后，如果是 `UMD` 模式，获取并调用挂载钩子函数；否则，处理常规挂载完成。

**`umdMode` 模式：**

- 重建全局 `effect` 的快照：`this.sandBox?.rebuildEffectSnapshot`
- 调用 `UMD` 模式下的挂载钩子函数：`handleMounted`
- 处理挂载完成逻辑，如果出现错误，记录错误日志。

**沙箱执行脚本补充：**

- 无论是不是 `umd` 模式，最终都会执行 `handleMounted`
- 不同的是 `isFinished` 下不用等待 `umdHookMount` 这个 `prmose` 结束在执行
- 不是 `umd` 模式，需要从代理的 `window` 对象上获取 `mount` 和 `unmount`
- 以便在处理 `handleMounted` 前完成挂载

**补充 `umdMode`：**

- `CreateApp` 中的属性 `public`，默认是 `false`
- 这就意味着创建应用的时候默认就“不是 `umdMode`”模式
- `umdMode` 在外部没有做更新
- 在内部也只有在 `execScripts` 内部挂载应用的时候更新为 `true`

**补充 `execScripts`：**

`execScripts` 只是一个队列方法，沙箱执行 `script` 还得看放入 `fiberScriptTasks` 的 `runScript`

目录：`scripts.ts` - `execScripts` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/scripts.ts#L396)]

参数：

- `app`：`CreateApp` 实例
- `initHook`：回调函数，带有两个属性 `moduleCount`、`errorCount`，用于判断是否完成加载的依据，作为参数回传给 `initHook`

流程：

- 先看结果，无论哪种结果都会执行 `initHook`
- 遍历 `app.source.scripts`，有延迟塞入队列 `deferScriptPromise` 稍后加载
- 没有延迟，知己通过 `injectFiberTask` 将沙箱执行放入队列 `fiberScriptTasks`
- `deferScriptPromise` 存在队列，依次加载后将沙箱执行放入队列 `fiberScriptTasks`
- 至此对于上面两种情况只要 `fiberScriptTasks` 存在队列，就会通过 `serialExecFiberTasks` 执行
- 也就会在沙箱中执行 `script`
- 但是对于上两种情况都没有拿到 `fiberScriptTasks` 的情况就只能回调执行 `initHook`

**补充 `runScript`：**

在沙箱内执行脚本的方法

目录：`scripts.ts` - `runScript` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/scripts.ts#L481)]

参数：

- `address`：脚本链接
- `app`：微前端应用实例
- `scriptInfo`：脚本源信息，包含脚本内容和其他元数据。
- `callback`：回调函数
- `replaceElement`：可选的 `HTMLScriptElement`，用于替换现有脚本元素。

流程：

- `actionsBeforeRunScript`：为 `window` 对象注入 `__MICRO_APP_PROXY_WINDOW__` 为当前活跃沙箱的 `proxyWindow`
- 获取 `script` 信息 `appSpaceData`，以及沙箱类型 `sandboxType`
- 根据获取的信息，在 `parsedCode` 不存在时通过 `bindScope` 补全，注 ⑯
- 内联脚本通过 `runCode2InlineScript` 处理，注 ⑰
- 非内联脚本通过 `runParsedFunction` 处理，注 ⑱

> 注 ⑯：`bindScope` 只做一件事
>
> - 将提供的 `script` 脚本内容用 `function` 包裹成模块
> - 用沙箱提供的 `proxyWindow` 作为参数，作为模块的 `window` 等对象
>
> 注 ⑰：`runCode2InlineScript`
>
> - 如果是内联 `script` 设置内容，否则设置 `src`
> - 添加 `onload` 事件 `onloadHandler`
> - 为 `script` 元素添加属性 `setConvertScriptAttr`
>
> 注 ⑱：`runParsedFunction`
>
> - 如果 `scriptInfo` 不存在对应的方法，通过 `getParsedFunction` 生成
> - `getParsedFunction` 会优先查找 `scriptInfo.appSpace` 将其返回
> - 如果没有则通过 `code2Function` 使用 `new Function` 生成执行函数
> - 最终生成的函数通过 `getEffectWindow` 根据情况，传递 `window` 过去执行

**补充 `handleMounted`：**

目录：`create_app.ts` - `handleMounted` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L371)]

- 挂载应用最后无论是不是 `umd` 格式都会执行这个方法
- 最终都要执行 `dispatchAction`，不同的是预加载只是将方法放入队列 `preRenderEvents`，不会立即执行
- 除此之外预加载应用还会通过 `recordAndReleaseEffect` 去记录沙箱快照、并清理沙箱 `window effect`、`document effect` 等

`dispatchAction`：

- 无论什么情况都会执行 `nextAction` 去调用 `actionsAfterMounted`
- 如果有提供挂载的 `promise`，会等处理挂载之后再执行

**补充 `actionsAfterMounted`：**

应用挂载完毕后触发已挂载事件

目录：`create_app.ts` - `actionsAfterMounted` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L397)]

- 只接受未卸载的应用触发
- 设置状态为 `MOUNTED`
- `execMicroAppGlobalHook` 执行子应用的 `window.onmount` 钩子函数，通知子应用已经挂载。
- `dispatchCustomEventToMicroApp` 向微应用派发 `statechange` 事件，通知其状态已变为 `MOUNTED`。
- `dispatchCustomEventToMicroApp` 向微应用派发 `mounted` 事件，通知其已经挂载。
- `dispatchLifecyclesEvent` 向父应用派发 `MOUNTED` 生命周期事件。
- 如果应用是隐藏的（`Keep-alive` 模式），则记录并释放所有全局事件 `recordAndReleaseEffect`，确保其后台运行的特性。
