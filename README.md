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

由于总结会很长，所以我将整个流程总结精简放在前面：

1. `microApp.start` 配置项
2. `MicroAppElement` 解析 `web-component` 组件
3. `CreateApp` 创建应用
4. `HTMLLoader` 获取资源，将其放到 `web-component` 中
5. `extractSourceDom` 解析资源，将 `css` 通过作用域隔离
6. 开启沙箱 `IframeSandbox` 或 `WithSandBox`，通过 `proxy` 作为 `JS` 沙箱
7. 资源处理完毕回调 `onLoad` 触发 `mount`
8. `execScripts` 在沙箱中加载、执行脚本，支持普通挂载，也支持 `umd` 模式挂载，注 ⑲
9. 完成挂载触发 `afterMounted` 挂载完毕事件和通知

> 阅读建议，如果你做好准备阅读以下内容，这样可以提高效率：
>
> - “查看”指向源码链接，记录罗列了关键代码，复制查找定位
> - 下面的流程中包含了挂载，也包含了卸载，为了更高效的阅读，阅读挂载的时候可以忽略卸载的内容，阅读卸载的时候可以忽略挂载内容
> - 除了挂载和卸载的流程，在最后补充了 `keep-alive` 模式

`micro-app` 是基于 `web component`，在上面演示了 `web component` 特性。所以大致可以想到 `micro-app` 启动流程如下：

- 去掉注册信息，无需关心接入协议
- 使用配置文件启动 `start`
- 在组件渲染过程中解析 `web component`
- 将取到的配置文件在 `web component` 生命周期内进行处理，如：添加沙箱等

和 `qiankun` 解读一样，为了便于阅读全部以当前官方版本 `c177d77ea7f8986719854bfc9445353d91473f0d` [[查看](https://github.com/micro-zoe/micro-app/tree/c177d77ea7f8986719854bfc9445353d91473f0d)] 为准

> 这一章节链接指向官方仓库，由于内容比较长，每一条信息我都暴露了关键的对象名，可以打开链接复制关键的对象名，查看上下文对照理解。有一点需要说明的是，`micro-app` 更新速度比 `qinkun` 要快，可能你在查阅的时候最新的源码已做了调整

### `microApp.start` 启动应用

从 `start` 方法开始

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
>
> 这样能将 `window` 最原始的方法做一个保留，不被污染

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
> 注 ⑥：`getGlobalAssets`
>
> 和 `systemjs` 导入资源一样 `systemjs-importmap`，可以作为加载子应用前将必要的依赖提前加载
>
> 目录：`prefetch.ts` - `getGlobalAssets` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/prefetch.ts#L158)]
>
> 原理：
>
> - 空闲时间分别利用 `fetchGlobalResources` 加载全局资源
> - 在函数中通过 `fetchSource` 直接 `fetchSource` 资源后通过 `promiseStream` 迭代数据流分别处理
> - 将拿到的资源按照 `js` 和 `css` 分类分别通过 `sourceCenter` 记录
> - 在 `sourceCenter` 中将收到的数据记录为一个 `map` 对象
>
> `sourceCenter` 收集资源信息的对象，在后面加载应用资源也会提到
>
> 目录：`source_center.ts` - `createSourceCenter` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/source_center.ts#L31)]
>
> - 包含 2 个属性：`link` 记录 `css` 资源信息，`script` 收集脚本信息
> - 每个属性包含 4 个方法：`setInfo` 设置信息，`getInfo` 获取信息，`hasInfo` 判断信息存在，`deleteInfo` 删除信息
> - 每个方法都接受一个参数：`address` 资源路径，除此之外 `setInfo` 还需要提供资源信息 `info`
> - 根据资源不同 `info` 的类型也有两个：`LinkSourceInfo`、`ScriptSourceInfo`，详细查看 `ts` 类型 [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/typings/global.d.ts#L112)]
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

配置信息通过 `microApp.start` 设置，`microApp` 是 `MicroApp` 的唯一实例，`MicroApp` 类是不对外公开的，而 `microApp` 对象公开。所以如果要获取配置信息，可以直接从 `microApp.options` 上获取。

### `defineElement` 自定义组件 `MicroAppElement`

原理和上面 `web component` 特性一样，在函数内部定义了一个类 `MicroAppElement`，并通过 `globalEnv.rawWindow.customElements.define` 创建自定义组件

目录：`micro_app_element.ts` - `defineElement` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app_element.ts#L45)]

参数：

- `tagName`：应用名称

按照珠峰的课程罗列的 `MicroAppElement` 几个方法

在当前版本的 `micro-app` 做了调整：

- 在 `MicroAppElement` 中是有两个静态方法 `static get data` 和 `static set data`，不再提供给自定义组件 `<micro-app />` 直接通过组件属性使用 `<micro-app data={customData} />`
- 而是作为 `MicroAppElement` 修改 `this.data` 值时触发，而只有 `setAttribute` 这一处，这个方法是对外提供的
- 而只有当 `setAttribute` 设置的 `key` 是 `data` 的时候，才会遍历 `value` 更新 `this.data`，从而触发 `microApp.setData`
- 去除了 `MicroAppElement` 构造函数，给 `property` 打补丁也修改为 `patchElementAndDocument`，并挪动到沙箱中使用

> 修正 `property` 补丁：
>
> - `patchElementAndDocument` 在沙箱启动时 `start` 调用，详细见 `patch.ts` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/patch.ts#L346)]

下面罗列的方法都在 `MicroAppElement` 类中，复制关键词查阅

#### 1.1 `attributeChangedCallback` 观察属性修改：

只观察 2 个属性：`name`、`url`，提供的值一个非空的字符，且和老的值不一样才会执行

参数：

- `attr`：`ObservedAttrName` 一个包含 `name` 和 `url` 的枚举
- `_oldVal`：`string`，这里是有问题的，初始化的时候一定是 `null`
- `newVal`: `string`，这里也是有问题的，不提供属性时应该是 `null`

如果当前修改的是 `url` 或 `name`，且值为空或者当前元素已卸载：

- 如果是 `url`，格式化 `formatAppURL` 并更新值
- 如果是 `name`，格式化 `formatAppName` 后同时更新：应用信息、元素信息、属性
- 无论是更新 `url` 还是 `name`，执行完就会再次执行一遍挂载操作 `handleInitialNameAndUrl`
- `handleInitialNameAndUrl` 中会根据应用启动状态，执行首次加载 `handleConnected`，见 3.1 首次加载 [[查看](#31-handleconnected-首次加载)]
- 如果以上都不是且状态不是 `isWaiting`，创建一个微任务 `handleAttributeUpdate`
- 否则不做任何操作

> 这里是有一个问题的，以初始化一个组件作为场景：
>
> - 初始化组件观察属性修改 `attributeChangedCallback`
> - 假定提供了 `name` 和 `url` 这两个属性
> - 这里会拿 `connectedCount` 去判断当前应用是否挂载，由于当前应用还没有挂载，所以 `connectedCount` 是上一个组件的编号
> - 因为同时还拿了 `this.name` 和 `this.url` 去判断，初始化时这两个值还是空值
> - 然后触发 `handleInitialNameAndUrl`，这里会再次拿上次组件的 `connectedCount` 去执行一遍 `handleConnected`
> - 会引起重复创建的逻辑问题，开发人员也在 144 行备注：`TODO: 这里的逻辑可否再优化一下`

`handleAttributeUpdate` 更新已赋值且挂载的应用：

- 进入微任务前想设置 `this.isWaiting = true`，避免重复操作
- 进入微任务后取消 `isWaiting` 状态
- 查看当前元素上 `url` 和 `name` 都是有效值：`formatAppName(this.getAttribute("name"|"url"))`
- 通过 `appInstanceMap` 将应用取出来在决定如何修改

修改的是 `name`，且此前已创建了应用实例：

- 应用实例没有卸载、没有隐藏、不是预加载，直接更新 `name` 后返回一个错误警告

否则修改的 `name` 或 `url` 不同，开始修改应用信息：

- 如果修改 `url`，卸载应用后再启动：`unmount` - `actionsForAttributeChange`
- 否则看是否为 `keep-alive` 模式，断开连接后再启动：`handleHiddenKeepAliveApp` - `actionsForAttributeChange`
- 其他情况参考第一条，区别在于不会在卸载时清除缓存

如果当前元素上 `name` 或 `url` 是空值，且 `name` 发生了变动：

- 不去管应用状态，直接修改 `this.setAttribute('name', this.appName)`

在 `web component` 组件类中，会先执行 `attributeChangedCallback` 然后挂载组件 `connectedCallback`

#### 2.1 `connectedCallback` 挂载组件：

- 自增 `this.connectedCount` 用于给每个自定义组件配置唯一的编号
- 设置一个 `map` 映射表：`this.connectStateMap.set(cacheCount, true)`，用于记录自定义组件销毁和挂载状态

`defer` 添加一个微任务：

- `dispatchLifecyclesEvent` 创建并执行 `create` 事件，注 ⑧
- 如果提供了应用名和连接，执行首次挂载 `handleConnected`，见 3.1 首次加载 [[查看](#31-handleconnected-首次加载)]

> 注 ⑧：使用当前元素、应用名、来创建 `created` 事件
>
> - 先定位到元素的根元素上：`getRootContainer`
> - 删除作用域中其他应用
> - 将信息合并创建自定义 `created` 事件，并通过 `formatEventInfo` 捆绑事件对象元素
> - 如果 `start` 时提供了 `created` 优先触发
> - 然后触发自定义事件 `created`

关于源码中备注执行两次的问题：

- 并非是因为 `name` 和 `url` 分别设置导致执行两次的问题，而是上面所说的
- 当挂载一个自定义的 `web component` 的时候，会先响应属性的变化 `attributeChangedCallback`
- 这个时候去拿 `connectedCount` 只能拿到上一个自定义元素，然后通过 `handleInitialNameAndUrl` 执行了第一次挂载
- 之后挂载后在 `connectedCallback` 执行了第二次挂载

#### 2.2 `disconnectedCallback` 卸载组件：

- 在映射表 `this.connectStateMap` 将当前应用设置为 `false`
- 执行卸载操作 `handleDisconnected`，见 3.2 卸载操作 [[查看](#32-handledisconnected-执行卸载)]

#### 3.1 `handleConnected` 首次加载

接 2.1 挂载组件 [[查看](#21-connectedcallback-挂载组件)]，称作首次加载来自与备注：`first mount of this app`，其实会分别在这些场合触发：

- `handleInitialNameAndUrl`：修改属性后，包括首次赋值
- `connectedCallback`：已挂载组件时
- `reload`：重新加载应用

> 在珠峰课程里 `initialMount` 就是 `handleConnected`，只是版本不一样叫法不一样

`handleConnected` 执行流程：

- 应用名和连接都存在才会执行
- 检查是否开启 `shadowDom`，在环境允许的情况下开启，模式为 `open`，默认是不开启的
- 在 `ssr` 环境下更新应用连接，注 ⑨
- 通过 `appInstanceMap` 将应用取出来，如果提取应用根据情况修改实例
- 如果提取不出来创建实例 `handleCreateApp`

> 关于 `shadowDom` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app_element.ts#L194)]
>
> - 先看配置条件 `this.shadowRoot`，这个值是没有初始定义，也没有赋值的，所以可以把它看作 `false`，总会执行
> - 再看启动 `start` 配置文档 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/api?id=start)] 已注释，但目前源码中还是在的
> - 所以这样只要关心 `this.getDisposeResult('shadowDOM')`，假定浏览器支持的情况
>
> `getDisposeResult`：
>
> - 要求 `web component` 有属性 `shadowDOM`，或 `start` 配置 `shadowDOM` 为 `true`
> - 并且属性值不能为 `false`，这两点合起来看其实逻辑判断是错的
>
> 得到的结果：
>
> - 默认不启用 `shadDom`，要启动 `shadDOM` 需要配置 `<micro-app shadowDOM />` 属性
> - 如果通过 `start` 启动 `shadowDOM`，还是要配置组件属性，这就是逻辑错误的地方，当然也不排除开发人员就不想让你开启
> - 开启 `shadowDOM` 模式只能是 `open`，对外可以访问
> - 也就是说，默认情况 `micro-app` 不会通过 `shadDom` 做隔离
> - 而是直接通过 `web component` 去加载应用资源并替换应用里的标签
> - `css` 默认通过修改作用域进行隔离，例如样式名 `body` 修改为 `micro-app[name={project-name}] micro-app-body`
> - `js` 默认使用 `WithSondbox` 作为沙箱，通过 `proxy` 的方式进行隔离（`iframe` 沙箱也一样通过 `proxy` 做隔离）
>
> 注 ⑨：更新 `url`
>
> - `getDisposeResult` 检查是否开启 `ssr`，没有则将 `ssrUrl` 设为空，否则往下看
> - 判断是否开启虚拟路由系统：`disable-memory-router`
> - 如果是虚拟路由，`CompletionPath` 将真实路由的 `pathname` + `search` 和 应用连接，组合成为 `ssrUrl`
> - 否则将从现有的浏览器连接中获取路由
>
> 从浏览器提取路由：
>
> - `getNoHashMicroPathFromURL` 使用应用的 `name` 和 `url` 从浏览器地址中提取路由
> - 如果提取失败，`getDefaultPage` 拿默认渲染的页面，将默认渲染的页面和应用 `url` 作为 `ssrUrl`
> - 如果提取成功，直接拿 `getNoHashMicroPathFromURL` 返回的连接作为 `ssrUrl`
>
> 在当前版本中 `ssrUrl` 优先级高于 `url`，但是在 `keep-alive` 下比对连接，不用考虑 `ssrUrl`

先说创建，`handleCreateApp` 创建实例，先根据应用名获取实例，3 个情况：

- 实例存在且是预加载 `isPrerender`，当前对象中直接注销应用：`unmount`，之后再创建应用 `createAppInstance`
- 实例存在不是预加载，彻底销毁应用 `actionsForCompletelyDestroy`，之后再创建应用 `createAppInstance`
- 实例不存在，直接创建应用 `createAppInstance`

> 在 `CreateApp` 构造中会重新设置实例 `appInstanceMap`，作为所有应用实例的映射表
>
> 调用 `handleCreateApp` 有 2 个情况：
>
> - `handleConnected` 首次挂载应用，包含：挂载预加载、已卸载、未加载的应用
> - 调整挂载组件属性：`attributeChangedCallback` - `handleAttributeUpdate` - `unmount`

再说更新，修改实例前会先拿到应用信息，和当前的信息进行比对：

- 如果应用已隐藏，且修改的应用 `url` 一样，重新连接应用：`handleShowKeepAliveApp`
- 否则如果 `url` 都一样，当前应用已卸载，或是预加载应用且核心一致，注 ⑩，直接挂载：`this.handleMount(oldApp)`
- 否则如果应用是预加载或者已卸载，重新创建一个代替原来的应用：`handleCreateApp`
- 以上情况都不是，而实例又存在的情况直接报错

> 注 10：核心信息包括：`scopecss` 样式隔离、`useSandbox` 使用沙箱、`iframe` 使用 `iframe` 沙箱，全部是 `boolean` 类型

带入场景，修改已挂载的组件 `<micro-app />`， `attributeChangedCallback` 会有两种情况：

1. 修改的是 `url` 或 `name`，这个组件在此之前因为缺失属性没有挂载应用
2. 修改组件属性，组件已挂载或已完成预加载

> 挂载组件并创建应用的前提是 `url` 和 `name` 这两个值都有效，缺少一个只能挂载组件不会创建应用

得出下面结论：

- 没挂载的情况执行 `handleInitialNameAndUrl`
- 挂载了执行 `handleAttributeUpdate`
- 这样无论是新增，还是修改组件属性、还是重载，都能保证通过 `handleConnected` 创建或挂载应用

#### 3.2 `handleDisconnected` 执行卸载

接 2.2 卸载组件 [[查看](#22-disconnectedcallback-卸载组件)]：

- `appInstanceMap` 先拿到应用实例，确保应用存在、没有被卸载、不是隐藏
- 如果是 `keep-alive` 模式仅断开应用：`app.hiddenKeepAliveApp`
- 否则卸载应用 `this.unmount(destroy, callback)`

**`unmount` 卸载应用**

先看调用场景有 5 处：

1. 组件卸载：`disconnectedCallback` - `handleDisconnected` - `unmount`
2. 断开 `keep-alive` 模式的应用，且应用 `level` 不是 2：解析静态资源成可执行代码
3. 命令行组件重载：`reload` - `handleDisconnected` - `unmount`
4. 调整已挂载组件的 `name` 或者 `url`：`attributeChangedCallback` - `handleAttributeUpdate` - `unmount`
5. 预渲染的应用重建：`handleCreateApp` - `unmount`

> - 断开 `keep-alive` 流程见：1.1. 断开应用 - 销毁组件 [[查看](#11-断开应用---销毁组件)]
> - 组件重载：最后回调挂载应用 `handleConnected`
> - 调整已挂载组件：最后回调挂载创建或挂载应用 `actionsForAttributeChange`
> - 预渲染的应用重建：最后回调创建应用 `createAppInstance`，`handleCreateApp` 调用场景见：3.1 首次加载 [[查看](#31-handleconnected-首次加载)] `handleCreateApp` 相关内容
>
> 以上所有场景除了 1 和 2 其它都会在 `mount` 之后回调挂载或重新创建应用

流程：

- 获取应用实例 `appInstanceMap`，判断应用没有卸载 `!app.isUnmounted()`
- 执行卸载 `app.unmount`

至此整个 `MicroAppElement` 基本说完，大致分了 3 个步骤：

1. 监听属性变化：`attributeChangedCallback`
2. 挂载和卸载：`connectedCallback`、`disconnectedCallback`
3. 首次执行加载和执行卸载：`handleConnected`、`handleDisconnected`

---- 分割线 ----

### `CreateApp` 创建应用类

在 `MicroAppElement` 中都会统一使用 `CreateApp` 这个类来创建应用。这个类不对外开放，不支持通过 `CreateApp` 手动创建应用，而是通过 `MicroAppElement.handleCreateApp` 来创建

目录：`create_app.ts` - `CreateApp` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L59)]

参数：

- `options`：`CreateAppParam` 类型 [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L45)]

`CreateApp` 的主要作用是：

- 利用拿到的信息加载资源
- 启动沙箱，`iframe` 或者 `WithSandBox`（默认）
- 创建应用 `mount`

设置的信息包含：

- 将自身对象添加到映射表中：`appInstanceMap`
- 加载的信息，注 ⑩
- 加载资源前先设置一个对象 `this.source`
- 之后分别开始加载资源 `loadSourceCode`、创建沙箱 `createSandbox`

其中 `this.source` 增加了 `html` 为一个字符串，`css` 和 `js` 也由 `map` 改为了 `set`

> 注 ⑩：加载信息包含
>
> - 应用名称和链接：`name`、`url`
> - 启用沙箱和样式作用域：`useSandbox`、`scopecss`
> - 执行方式：`iframe` 沙箱、`inline` 内联执行 `srcipt`
> - 路由模式：`routerMode`
> - 容器 `container` 和 `ssrUrl`
> - `isPrefetch` 预加载、`isPrerender` 与渲染、`prefetchLevel` 预加载等级

#### 1.1. `loadSourceCode` 加载资源

目录：`create_app.ts` - `loadSourceCode` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L127)]

- 设置应用状态为 `LOADING`
- `HTMLLoader` 加载资源

#### 1.2. `HTMLLoader` 加载资源：

目录：`html.ts` - `HTMLLoader` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/loader/html.ts#L10)]

暴露两个方法：

- `getInstance` 静态方法，返回单例
- `run`：执行加载和格式化的逻辑

加载的本质还是 `fetch`，`run` 方法：

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
> - `processHtml` 会提取所有全局的 `plugin`，和当前应用指定的 `plugin`
> - 然后通过 `reduce` 遍历 `plugin` 集合
> - 如果 `plugin` 是一个对象，且包含了 `processHtml` 方法
> - 将获取的资源传入进去处理

加载微应用中只有 1 处用到了 `HTMLLoader`

- `CreateApp` - `loadSourceCode`

而使用 `CreateApp` 创建应用只有 2 处：

- `start` 时预加载：`preFetchAction` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/prefetch.ts#L104)]
- 自定义组件 `MicroAppElement` 挂载应用：`handleCreateApp` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app_element.ts#L350)]

带入场景来看吧，预加载应用：

- `start` 时 `preFetch` 发起预加载微任务，详细见 `microApp.start` 总结 [[查看](#microappstart-启动应用)]
- 流程：`preFetch` - `preFetchInSerial` - `preFetchAction` - `promiseRequestIdle`
- 在 `promiseRequestIdle` 中会声明应用实例 `new CreateApp()`
- 在 `CreateApp` 构造函数中加载资源 `loadSourceCode`，创建沙箱 `createSandbox`

再首次加载应用，从属性修改开始：

- 详细流程见 `defineElement` 总结 [[查看](#defineelement-自定义组件-microappelement)]
- 流程：`attributeChangedCallback` - `handleConnected` - `connectedCallback` - `handleConnected`
- 首次加载应用，`this.appUrl`、`this.appName` 自然是空值，这里假定 `url` 和 `name` 都提供的情况下
- 从 `handleConnected` 开始，拿到预加载的应用，`url` 没变，核心配置没变，又是预加载：`isPrefetch`
- 直接发起挂载应用：`this.handleMount(oldApp)`
- 设置应用状态 `BEFORE_MOUNT` 后，发起挂载 `this.mount(app))`
- 通过 `CreateApp` 的 `mount` 挂载应用，详细见挂载流程 [[查看](#32-mount-挂载应用)]
- 从而略过 `CreateApp` 构造函数，避免再次加载资源、启动沙箱

#### 1.3. `extractSourceDom` 成功加载资源回调：

回到 `CreateApp.loadSourceCode`，加载资源时提供一个资源加载成功后的回调 `extractSourceDom`，用于提取 `link` 和 `script`，并绑定 `style` 的 `scope`

目录：`index.ts` - `extractSourceDom` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/index.ts#L82)]

- 先通过 `app.parseHtmlString` 将加载的 `html` 字符转换成 `HTMLElement`，记录在 `wrapElement`，注 ⑫
- 查找 `micro-app-head` 和 `micro-app-body`，如果都不存在报错返回
- 创建一个 `fiberStyleTasks` 用于收集加载的样式队列，注 ⑬
- 使用 `flatChildren` 递归处理每一个子集元素，注 ⑭
- 使用 `serialExecFiberTasks` 将 `flatChildren` 队列执行，过程见下方注解
- 如果应用加载过程中获取到 `css` 资源，通过 `fetchLinksFromHtml` 挨个获取，注 ⑮
- 如果应用加载过程中获取到 `js` 资源，通过 `fetchScriptsFromHtml` 挨个获取
- 加载完资源最终会调用 `app.onLoad`，将最开始拿到的 `wrapElement` 作为参数属性 `html` 传过去

在 `app.onLoad` 中只判断资源是否加载完毕，加载完毕执行 `mount`

> 注 ⑫：`parseHtmlString`
>
> - 优先使用沙箱解析 `this.sandBox.proxyWindow.DOMParser`，否则从当前 `window` 对象解析
> - 将 `html` 字符解析成 `dom` 返回 `body`：`(new DOMParser()).parseFromString().body`
>
> 注 ⑬：`fiberStyleTasks` 添加要求要么预加载 `isPrefetch`、要么 `fiber`
>
> - 假定不预加载，在 `CreateApp` 找 `fiber` 有两处
> - 第一处初始化 `false`，第二处 `mount` 更新
> - 而 `mount` 更新受两处影响，见：3.1. `onLoad` 加载完毕 [[查看](#31-onload-加载完毕)]
> - 第一处是 `onLoad` 中 `this.isPrefetch && this.isPrerender`
> - 第二处是 `!this.isPrefetch` 时，根据 `web component` 属性是否设置了 `fiber` 来决定
> - 这样就把范围大致缩小到 3 个：预加载、预渲染、`web component` 属性设置
>
> 如果 `fiberStyleTasks` 是 `null` 会发生什么：
>
> - 不会使用队列 `fiberStyleTasks` 来收集 `inner style`，而是立即执行每一个 `scopedCSS`
> - 这种情况 `serialExecFiberTasks` 返回的 `fiberStyleResult` 也是 `null`
> - 导致的结果是所有的方法都是立即执行，不会队列，也不会通过 `injectFiberTask` 利用浏览器空闲加载
>
> 注 ⑭：`flatChildren`
>
> - 参数：`Dom` 对象 `wrapElement`，`app` 对象，`microAppHead` 头部 `Dom`，记录样式集合 `fiberStyleTasks`
> - 想获取每次递归资源的子集转换成数组：`Array.from(parent.children)`
> - 遍历 `children` 迭代递归 `flatChildren`
> - 拆分每一个 `children` 的 `dom`，分 4 类处理：`link`、`style`、`script`、`image`
>
> 这里有个问题：
>
> - `microAppHead` 传给 `flatChildren`，除了不断递归之外，实际没用
> - 需要用到 `microAppHead` 是在 `fetchLinksFromHtml`，将其传给 `fetchLinkSuccess`
> - 用于将 `link` 转换成 `stye` 元素后添加到 `micro-app-head`
>
> 处理 `link`：
>
> - 如果元素包含 `exclude` 属性，或者使用 `plugin` 的 `excludeChecker` 排除，注释掉 `link`
> - 如果元素没有包含 `ignore` 属性，或者没有使用 `plugin` 的 `ignoreChecker` 排除执行 `extractLinkFromHtml` 注释掉 `link`
> - 否则就修正 `link` 的 `href` 属性为子应用对应的链接 `CompletionPath`
>
> 关于 `extractLinkFromHtml`：
>
> - 只有两处使用，一个是 `flatChildren`，另外一个 `source.patch.handleNewNode` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/patch.ts#L88)]
> - 这里只看 `flatChildren` 调用的 `extractLinkFromHtml`，这里没有提供参数 `isDynamic`
> - 最终如果 `replaceComment`存在的话，它要做的事是将注释 `Dom` 替换 `link` 元素：`parent?.replaceChild(replaceComment, link)`，否则什么都不会做
>
> `extractLinkFromHtml` 除此之外还做了：
>
> - `rel === 'stylesheet'` 时更新 `sourceCenter.link`，见注 ⑥：`createSourceCenter`
> - `isDynamic` 不成立的情况下添加资源：`app.source.links.add(href)`，便于后续 `fetchLinksFromHtml` 添加样式作用域
> - `app.source.links` 添加的 `item` 和 `sourceCenter.link` 映射的 `key` 一致
> - 需要注意的是 `app.source.links.add` 只能通过 `extractLinkFromHtml` 添加
>
> 处理 `style`:
>
> - 如果元素包含 `exclude` 注释掉 `style`
> - 如果是默认的样式隔离，且没有 `ignore` 属性，通过 `injectFiberTask` 队列调用 `scopedCSS` 将修改作用域的样式添加到 `fiberStyleTasks`
> - 如果没有提供 `fiberStyleTasks` 则立即通过 `scopedCSS` 更换 `style` 的样式作用域
> - 其他情况的 `style` 均不处理
>
> 处理 `script`：`extractScriptElement`
>
> - 只有两处使用，一个是 `flatChildren`，另外一个 `source.patch.handleNewNode` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/patch.ts#L114)]
> - 这里只看 `flatChildren` 调用的 `extractScriptElement`，这里没有提供参数 `isDynamic`
> - 最终如它要做的事是将注释 `Dom` 替换 `script` 元素：`parent?.replaceChild(replaceComment!, script)`
> - 只看 `replaceComment` 有 5 条，无论哪种结果都是用注释代替 `script`
>
> 如果 `script` 带有 `src` 或是内联脚本，除此之外还做了：
>
> - 将获取的信息最终汇总到 `sourceCenter.script`，见注 ⑥：`createSourceCenter`：
> - 将链接添加到 `app.source.scripts`，以便后续 `fetchScriptsFromHtml` 处理
> - `app.source.scripts` 添加的 `item` 和 `sourceCenter.script` 映射的 `key` 一致
> - 需要注意的是 `app.source.scripts.add` 只能通过 `extractScriptElement` 添加
>
> `extractScriptElement` 例外情况：
>
> - 当 `script` 不是规定范围脚本，或有属性 `ignore`，或被 `plguin` 通过 `ignoreChecker` 排除
> - 将删除 `globalEnv.rawDocument.currentScript` 返回 `nulll` 什么都不做
>
> 处理 `image`：
>
> - 修正元素的 `href` 属性为子应用对应的链接 `CompletionPath`
>
> 额外说下 `fiberStyleTasks`，用途是将修改 `css` 作用域的方法，封装在一个微任务队列中：
>
> - 先通过 `injectFiberTask` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/libs/utils.ts#L625)] 将队列 `fiberStyleTasks` 传过去
> - 修改 `css` 作用域的方法 `scopedCSS` 作为 `callback`
> - 返回的类型是 `() => promise<void>`，方便在后面迭代队列依次执行
>
> 执行 `injectFiberTask` 流程如下：
>
> - 遍历每个队列中的 `promiseRequestIdle` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/libs/utils.ts#L417)]，执行 `promise`
> - `promise` 中通过 `requestIdleCallback` 将 `resolve` 传给 `callback` 并执行
> - `callback` 中先修改 `css` 的作用域 `scopedCSS`
> - 然后通过 `resolve(void)` 返回最初函数中的 `promise`，以便后续队列执行
> - 如果传过来的 `injectFiberTask` 是无效值，直接执行 `callback` 不添加队列
>
> 注 ⑮：`fetchLinksFromHtml`
>
> 目录：`links.ts` - `fetchLinksFromHtml` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/links.ts#L124)]
>
> - 转换资源 `app.source.links` 为数组进行队列
> - 通过 `fetchLinkPromise` 将队列依次加载，如果资源没有内容 `linkInfo.code`，使用 `fetchSource` 加载资源，见注 ⑥
> - 根据 `fiberStyleResult` 决定是队列，还是立即执行，见注 ⑬
> - 执行 `promiseStream` 队列，这里假定都是成功的
> - 通过 `injectFiberTask` 将 `fetchLinkSuccess` 放入空闲时间执行
> - 没有 `fiberStyleResult` 立即触发 `app.onLoad`
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
> - 获取应用的 `appSpaceData` 资源信息和 `placeholder` 占位符，一个类型为注释的 `Dom` 元素
> - 如果 `placeholder` 不存在，什么都不做
> - 如果存在则创建一个新的 `style` 元素 `convertStyle`，通过 `handleConvertStyle` 转换样式
> - 如果 `placeholder` 存在父节点，则用新的 `style` 标签替换 `placeholder`。否则，将 `style` 标签添加到 `microAppHead`。
>
> 再补充 `fetchScriptsFromHtml`，加载 `script`：
>
> 目录：`scripts.ts` - `fetchScriptsFromHtml` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/scripts.ts#L305)]
>
> - 转换资源 `app.source.scripts` 为数组进行队列
> - 用 `fetchScriptPromise` 将队列依次加载，如果资源没有内容 `scriptInfo.code`，使用 `fetchSource` 加载资源，见注 ⑥
> - 用 `fetchScriptPromiseInfo` 按照应用记录地址和对应的资源信息 `sourceCenter.script.getInfo`，见注 ⑥
> - 根据 `isPrefetch` 或 `fiber` 决定是队列，还是立即执行，见注 ⑬
> - 执行 `promiseStream` 队列，这里假定都是成功的
> - 通过 `injectFiberTask` 将 `fetchScriptSuccess` 放入空闲时间执行
> - `fiberScriptTasks` 为 `null` 立即触发 `app.onLoad`
> - 否则将 `app.onLoad` 添加到 `fiberLinkTasks` 队列最后，通过 `serialExecFiberTasks` 依次执行
>
> 说说 `fetchScriptSuccess`：
>
> 目录：`links.ts` - `fetchScriptSuccess` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/scripts.ts#L352)]
>
> 流程：
>
> - 将加载的资源赋值给 `scriptInfo.code`
> - 如果应用是预加载 `isPrefetch`，并且加载等级又是 2：加载并解析，会更新资源信息
> - 将当前脚本信息的对象 `scriptInfo.appSpace[app.name]` 引用给 `appSpaceData`
> - 如果 `appSpaceData.parsedCode` 是空值，通过 `bindScope` 将脚本作为一个完整的模块字符，见注 ⑯
> - `getSandboxType` 更新沙箱类型
> - 通过 `getParsedFunction` 将应用 `app`，`script` 集合 `scriptInfo`、绑定的模块 `parsedCode` 字符，转换成可执行的模块方法，见注 ⑱

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
- 之后拿到 `iframe` 的 `window` 对象作为 `microAppWindow`
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

- 设置路由状态 `initRouteState`，添加历史记录监听器 `addHistoryListener`
- `createIframeBase` 创建并应用 `base` 元素，以及对 `HTML` 元素和 `document` 进行补丁处理等逻辑

`stop` 停止沙箱：

- 撤销 `window`，`document` 的补丁 `recordAndReleaseEffect`，恢复路由状态 `clearRouteState`，移除历史记录监听器 `removeHistoryListener`
- `this.escapeKeys` 移除 `iframe` 以及清理一些微应用的全局变量等操作。

`createIframeTemplate` 创建 `iframe` 模板：

- 清空 `iframe` 重塑内容

`initStaticGlobalKeys` 注入方法到沙箱的 `window` 上：

- 除了注入了全局对象外，通过 `EventCenterForMicroApp` 重新定义了相关的事件

**总结：**

`IframeSandbox` 类通过创建和管理 `iframe` 元素，隔离微应用的执行环境，提供了灵活且安全的沙盒机制。它包括：

- 初始化和配置 `iframe` 元素。
- 代理和修补 `window`、`document`、`router` 等。
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
- `setMappingPropertiesWithRawDescriptor`：在 `microAppWindow` 对象上设置一些属性映射
- `initStaticGlobalKeys`：为微应用注入全局属性

> `setMappingPropertiesWithRawDescriptor`：
>
> - 声明 2 个对象 `topValue`、`parentValue`，如果在 `iframe` 中分别表示 `top` 和 `parent`，否则全部为 `window` 对象
> - 然后将获取到的对象，为应用代理的 `microAppWindow` 赋值 `top` 和 `parent` 两个属性
> - 最后遍历 `GLOBAL_KEY_TO_WINDOW` 数组中的每个键（`window`、`self`、`globalThis`），并在 `microAppWindow` 上定义这些属性
> - 每个属性都通过 `createDescriptorForMicroAppWindow` 方法创建，并映射到 `this.proxyWindow`。

打补丁额外说明：

- 构造函数只挂载了方法，`patchIframe` 返回一个 `promise` 会在 `mount` 挂载应用前执行

`start` 启动：

- 激活沙箱 `active` 并执行初始操作，如设置内存路由器和全局键。
- 初始化路由状态 `initRouteState`，附加事件监听器，并修补全局键。

`stop` 停止：

- 停止沙箱，释放全局效果并清理资源 `recordAndReleaseEffect`
- 清除路由状态 `clearRouteState`，并在需要时移除注入的键和事件监听器。

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

#### 3.1. `onLoad` 加载完毕

接 1.3. `extractSourceDom` 成功加载资源回调后 [[查看](#13-extractsourcedom-成功加载资源回调)] 调用 `app.onLoad`

回到 `CreateApp` 构造函数，重新捋一遍顺序：

- 发起 `loadSourceCode` 加载资源
- 发起 `createSandbox` 创建沙箱，这两个操作是上下文先后执行的
- 加载资源会发起一个个微任务的形式执行，`fetch` 后再做相应更新
- 创建沙箱也会在对象中添加微任务的方式，等待 `mount`
- 资源加载完毕触发 `onLoad` 后，再发起挂载应用前，发起沙箱的 `mount` 方法

再回到 `onLoad` 看流程：

- 首先资源没有加载完 `++this.loadSourceLevel === 2` 是一定不会做任何操作
- 将加载的 `html` 对象记录在 `source.html`，以便在 `mount` 的时候克隆到容器中
- 应用已卸载的情况下返回不继续处理
- 不是预加载的情况 `isPrefetch`，触发 `web component` 的 `mount` 方法，而 `mount` 方法中会绕回来调用 `app.mount`
- 是预加载又是预渲染 `isPrerender`，创建个 `div` 作为容器，设置沙箱 `setPreRenderState`，调用 `app.mount`
- 其他情况不做处理，整个流程到此结束，例如：预加载，但不预渲染

“不是预加载”和“预加载&预渲染”都会调用 `mount`，但有些许差别：

- `routerMode`、`baseroute`、`defaultPage`：“预加载&预渲染”路由模式永远为空值
- `disablePatchRequest`：“预加载&预渲染”路由模式永远为 `false`，而 “不是预加载” 由 `web component` 属性决定
- `fiber`：“预加载&预渲染”路由模式永远为 `true`，查看注 ⑬ 了解，而“不是预加载” 由 `web component` 属性决定

> `disablePatchRequest` 为 `false` 在 `iframe` 沙箱中会在头部创建一个 `base` 元素，用于指向指定的 `location.pathname`，默认的沙箱 `WithSandbox` 中会重写 `fetch`、`XMLHttpRequest`、`EventSource`

`isPrefetch` 和 `isPrerender`：

- `CreateApp` 中除了构造函数全部为 `false`，也就是说内部不会更新应用为预加载或预渲染
- 而调用 `CreateApp` 有 2 处，见：1.2. `HTMLLoader` 加载资源 [[查看](#12-htmlloader-加载资源)] 中 `HTMLLoader` 部分
- 自定义组件 `MicroAppElement`，`new CreateApp` 时没有 `isPrefetch` 和 `isPrerender`，可以排除
- `start` 启动预加载时 `isPrefetch` 为 `true`，`prefetchLevel` 根据提供预加载的 `level` 来决定，`prefetchLevel` 为 3 的情况下开启预渲染 `isPrerender`

结论：

- 挂载应用的时候一定是：“不是预加载”
- 预加载应用的时候一定是：“预加载”，但不一定是 “预渲染”
- 预加载应用且 `level` 是 3 的时候：“预加载&预渲染”

下面是在这两个模式：“不是预加载”和“预加载&预渲染”，作为前提继续描述

#### 3.2. `mount` 挂载应用

一个对外公开的方法，包含 2 个情况：资源是否加载完成

**`loadSourceLevel` 资源没完成加载完成：**

主要用于外部调用，比如预加载应用时

- 设置容器 `container`，可能是一个用于挂载应用的 `DOM` 元素。
- 禁用预渲染功能 `this.isPrerender`，这可能是因为代码正在尝试在资源加载完毕之前就开始挂载应用，这种情况下可能无法进行预渲染。
- 之后 `dispatchCustomEventToMicroApp` 触发一个自定义事件 `statechange`，并将应用的状态 `appState` 修改为 `LOADING`

资源未完成触发 `mount` 会重复执行上述操作，以下全部为资源加载完成后的操作

**创建沙箱、更新状态：**

- `createSandbox` 见 2.1. 创建沙箱 [[查看](#21-createsandbox-创建沙箱)]，构建时会尽可能创建沙箱，并存储在 `sandBox` 对象
- 之后将应用的状态修改为 `BEFORE_MOUNT`

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
- 恢复之前记录的预渲染事件 `this.preRenderEvents?.forEach((cb) => cb())`。
- 重置预渲染状态 `isPrerender`、`preRenderEvents`
- 将路由信息附加到浏览器 URL `router.attachToURL`
- 设置沙箱的预渲染状态 `this.sandBox?.setPreRenderState(false)`

**常规挂载流程：**

如果不处于预渲染状态，执行以下操作：

- `container` 设置容器、`inline` 内联模式状态、`fiber` 纤程模式和 `routerMode` 路由模式
- 创建并派发 `BEFOREMOUNT` 生命周期事件，如果是预渲染将事件插入 `preRenderEvents` 不立即执行
- 将应用状态设置为 `MOUNTING`。
- 向微应用派发 `statechange` 事件，通知应用状态变化。
- 根据 `umdMode` 决定是深度克隆还是浅克隆容器 `this.cloneContainer`
- `this.cloneContainer` 在这里会将 `this.source.html` 中的 `children` 依次拷贝到 `web component` 中
- 启动沙箱 `this.sandBox?.start`，见 2.1. 创建沙箱 [[查看](#21-createsandbox-创建沙箱)]
- 根据 `umdMode` 模式执行脚本

> `preRenderEvents` 设置有段代码很有意思：`(this.preRenderEvents ??= []).push(dispatchBeforeMount)`
>
> - 可以先把它拆成 `this.preRenderEvents ?? []`，就相当于当值是 `null` 或 `undefined` 时使用 `[]`
> - 这里不同的是多了一个等号 `??=`，就相当于将得到的值 `[]` 赋值给 `this.preRenderEvents`
> - 之后通过 `().push()` 的方式插入 `item`

**不是 `umdMode`：**

- 更新 `HTML` 元素信息，并在沙箱内执行脚本 `execScripts`
- 在所有脚本执行完毕后，如果是 `umdMode` 模式，处理应用挂载 `handleMounted`
- 否则通过 `getUmdLibraryHooks` 提取 `mount` 和 `unmount`
- 将 `unmount` 交给 `umdHookUnmount`，将 `mount` 交给 `umdHookMount` 以便后续使用
- 标记沙箱模式 `markUmdMode` 后，将 `umdHookMount` 作为 `promise` 传给 `handleMounted` 挂载应用

**`umdMode` 模式：**

- 重建全局 `effect` 的快照：`this.sandBox?.rebuildEffectSnapshot`
- 调用 `UMD` 模式下的挂载钩子函数：`handleMounted`
- 处理挂载完成逻辑，如果出现错误，记录错误日志

> `handleMounted` 会将 `umdHookMount` 作为 `promise` 传递过去：
>
> - `umdHookMount` 是一个私有方法，默认是 `null`
> - 赋值更新只有一处，在非 `umdMode` 模式下 `execScripts` 提取 `mount` 赋值
> - 再回到 `umdMode`，它是一个公开的属性，但是在外部并没有更新
> - 内部也只有通过 `execScripts` 下设为 `true`
>
> 结论：
>
> - 应用首次加载的时候 `umdMode` 一定是 `false`
> - 因此也一定会从子应用中去拿 `mount` 和 `unmount`，之后直接使用之前获取的 `hook` 执行 `handleMounted`
> - 如果子应用不提供 `mount`，那么不提供 `promise` 去执行 `handleMounted`
> - 在后续的 `mount` 中也不会再获取子应用的挂载方法，直接根据首次获取的结果执行 `handleMounted`

**沙箱执行脚本补充：**

- 无论是不是 `umd` 模式，最终都会执行 `handleMounted`
- 不同的是拿不到 `mount` 下不用等待 `umdHookMount` 这个 `prmose` 结束再执行 `handleMounted`
- 不是 `umd` 模式，需要从沙箱代理的 `window` 对象上获取 `mount` 和 `unmount`、以便在处理 `handleMounted` 前完成挂载沙箱

**补充 `execScripts`：**

`execScripts`在沙箱中执行 `script`，重点在放入 `fiberScriptTasks` 的 `runScript`，队列执行脚本

目录：`scripts.ts` - `execScripts` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/scripts.ts#L396)]

参数：

- `app`：`CreateApp` 实例
- `initHook`：回调函数，带有两个属性 `moduleCount`、`errorCount`，用于判断是否完成加载的依据，作为参数回传给 `initHook`

流程：

- 先看结果，无论哪种结果都会执行 `initHook`
- 遍历 `app.source.scripts`，有延迟或者是异步加载，塞入队列 `deferScriptPromise` 稍后加载
- 否则通过 `injectFiberTask` 将沙箱放入 `fiberScriptTasks` 中队列执行

`deferScriptPromise` 延迟队列：

- 存在延迟队列，通过 `promiseStream` 将 `fetch` 的资源依次下载
- 然后通过 `injectFiberTask` 将沙箱放入 `fiberScriptTasks` 中队列执行

`deferScriptPromise` 延迟队列执行结束之后，或不存在延迟队列：

- 存在执行队列 `fiberScriptTasks`，将回调方法 `initHook` 添加到队列末尾，通过 `serialExecFiberTasks` 拍平 `promise` 执行队列
- 对于没有延迟队列，也没有执行队列的情况，就只能回调执行 `initHook`

延迟队列完成执行和不存在延迟队列的区别，看参数：

- 不存在 `deferScriptPromise` 回调时 `isFinished` 一定是 `true`
- 存在 `deferScriptPromise` 回调时 `isFinished` 根据 `initHook` 的属性 `moduleCount`、`errorCount` 决定

> 当 `moduleCount` 不是 `undefined`，并且资源没有全部加载失败 `isFinished` 为 `false`
>
> - `moduleCount` 要求 `script` 为 `module`，不使用沙箱或使用 `iframe` 沙箱
> - `errorCount` 资源失败时增加
>
> `isFinished` 为 `false` 带来的后果：
>
> - 首次挂载时不执行 `handleMounted` 处理挂载
> - 但这并不意味着不会触发 `handleMounted`，如果 `getUmdLibraryHooks` 也没有提取到 `mount`，在下次执行 `mount` 时依旧会重新走一遍上述流程

`fiberScriptTasks` 执行队列：

- 由 `app.fiber` 决定是否存在队列
- 在 `CreateApp` 中只有 2 处定义：① 初始化 `false`，② `mount` 挂载时更新
- 如果是预加载、与渲染、容器是 `div` 的情况下 `fiber` 不会被更新，`script` 也不会队列而是立即执行
- 上面提到的“预渲染状态”和“常规挂载流程”有详细说明

`injectFiberTask` 补充说明：

- 利用浏览器空闲时间执行，详细见注 ⑭ `injectFiberTask`
- 在每一个 `injectFiberTask` 微任务中都会去执行回调 `initHook(false)`，
- 但是 `isFinished` 一定是 `false`，意味着加载资源不一定要求全部都 `isFinished`，也不一定会处理挂载 `handleMounted`
- 处理挂载唯一要求是从 `sandBox.proxyWindow` 拿到 `mount` 和 `unmount`

**补充 `runScript`：**

在沙箱内执行脚本的方法，通过 `execScripts` 将其放在 `fiberScriptTasks` 队列执行，或立即执行

目录：`scripts.ts` - `runScript` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/source/scripts.ts#L481)]

参数：

- `address`：脚本链接
- `app`：微前端应用实例
- `scriptInfo`：脚本源信息，包含脚本内容和其他元数据。
- `callback`：回调函数
- `replaceElement`：可选的 `HTMLScriptElement`，用于替换现有脚本元素。

忽略的参数

- `replaceElement`：`execScripts` 没传
- `callback`：只有在延迟队列 `deferScriptPromise` 才会将 `initHook` 传过来

流程：

- `actionsBeforeRunScript`：为 `window` 对象注入 `__MICRO_APP_PROXY_WINDOW__` 为当前活跃沙箱的 `proxyWindow`
- 获取 `script` 信息 `appSpaceData`，以及沙箱类型 `sandboxType`
- 根据获取的信息，在 `parsedCode` 不存在时通过 `bindScope` 补全，注 ⑯
- 内联脚本通过 `runCode2InlineScript` 处理，注 ⑰
- 非内联脚本通过 `runParsedFunction` 立即执行，注 ⑱

> 注 ⑯：`bindScope` 只做一件事
>
> - 将提供的 `script` 脚本内容用 `function` 包裹成模块
> - 用沙箱提供的 `proxyWindow` 作为参数，作为模块的 `window` 等对象
> - 模块代码简化例子：`(function(window){ with(window) {} })(proxyWindow)`
>
> 注 ⑰：`runCode2InlineScript`
>
> - 如果是内联 `script` 设置内容，否则设置 `src`
> - 添加 `onload` 事件 `onloadHandler`
> - `setConvertScriptAttr` 为 `script` 元素添加属性
> - 执行完成后将 `script` 通过 `parent?.appendChild` 添加到应用容器内
>
> 注 ⑱：`runParsedFunction`
>
> - 如果 `scriptInfo` 不存在 `parsedFunction`，通过 `getParsedFunction` 生成
> - `getParsedFunction` 会优先通过 `getExistParseResult` 查找其他应用中是否有相同的执行脚本，将其放回
> - 如果没有则通过 `code2Function` 使用 `new Function` 生成执行函数
> - 生成的函，最终数通过 `getEffectWindow` 将应用的 `window` 作为上下文立即执行

**带入场景，非 `umd` 模式如何加载：**

假定子应用非 `umd` 模式，不暴露 `mount` 和 `unmount`，流程如下：

- 首次挂载应用 `umdMode` 为 `false`
- 通过 `execScripts` 在沙箱中运行 `script`，提供 `initHook` 回调函数处理挂载
- 回调函数中通过 `getUmdLibraryHooks` 提取 `mount` 和 `unmout` 不存在
- 判断 `isFinished` 完成无需 `mount` 直接执行挂载 `handleMounted`

那队列执行 `script` 重复触发回调怎么解决：

- 参考：`injectFiberTask` 补充说明，从队列回调过来的 `isFinished` 一定是 `false`
- 提取不到 `mount` 函数的情况下，`isFinished` 有效才能执行挂载

> 注 ⑲：`mount`、`unmount`
>
> - 和 `qiankun` 一样 `micro-app` 支持在子应用的 `window` 对象上添加 `mount`、`unmount`
> - 用于为子应用开启 `umd` 模式，详细见官方文档 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/framework/vue?id=_1%e3%80%81%e5%bc%80%e5%90%afumd%e6%a8%a1%e5%bc%8f%ef%bc%8c%e4%bc%98%e5%8c%96%e5%86%85%e5%ad%98%e5%92%8c%e6%80%a7%e8%83%bd)]

#### 3.3. `handleMounted` 执行挂载应用

目录：`create_app.ts` - `handleMounted` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L371)]

- 挂载应用后只要拿到 `mount` 和 `unmount` 就会执行这个方法
- 方法内通过 `dispatchAction` 触发已挂载事件

预加载应用会稍微不同：

- 不会立即执行 `dispatchAction`，只是将方法放入队列 `preRenderEvents`
- 除此之外预加载应用还会通过 `recordAndReleaseEffect` 去记录沙箱快照、并清理沙箱 `window effect`、`document effect` 等

`dispatchAction`：

- 无论什么情况都会执行 `nextAction` 去调用 `actionsAfterMounted`
- 如果有提供一个 `promise` 挂载队列作为参数，会等处理回调的队列处理完成之后再执行

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

#### 3.4. `unmount` 挂载应用

接 3.2 执行卸载 [[查看](#32-handledisconnected-执行卸载)]

目录：`create_app.ts` - `unmount` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L451)]

参数：

- `destroy`：彻底清除，删除缓存资源
- `clearData`：清空数据，参考官方官方文档 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/data?id=%e4%ba%94%e3%80%81%e6%b8%85%e7%a9%ba%e6%95%b0%e6%8d%ae)]
- `keepRouteState`：保持路由状态，默认是 `false`
- `unmountcb`：卸载之后的回调

先看执行场景有 3 个：

- 组件卸载 `unmount`，见组件卸载场景 [[查看](#32-handledisconnected-执行卸载)]
- 断开 `keep-alive` 模式的引用，而引用的 `level` 不是 2: 解析静态资源成可执行代码
- 手动卸载 `unmountApp`，使用方式见官方文档 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/api?id=unmountapp)]

手动卸载时参数由传入的 `options` 来决定，主要看组件卸载这部分：

- `destroy` 优先匹配 `handleDisconnected` 传入的参数，只在 `reload` 命令行重载时才强制清除，其他情况由组件属性 `destroy` 或 `destory` 决定
- `clearData` 由组件属性 `clear-data` 决定
- `keepRouteState` 由组件属性 `keep-router-state` 决定
- `unmountcb` 仅在组件重载和修改挂载组件属性的时候会用到 `callback` 来挂载或重新创建应用

现在来解读卸载普通的子应用：

```
const App: FC  = () => <micro-app name="sub-project" url="//localhost:8080" />
```

过程如下：

- 销毁 `react` 组件
- 销毁组件 `disconnectedCallback`，不提供任何参数
- 处理 `handleDisconnected`：`destroy` 为 `false`，没有 `callback`
- 执行 `unmount`：`destroy`、`clearData`、`keepRouteState` 全部为 `false`，没有 `callback`
- 卸载应用 `app.unmount`

接上面流程看 `app.unmount` 的流程：

- 只要不是应用加载失败的情况下不会强制销毁应用 `destroy`
- 更新应用状态 `UNMOUNT`
- 处理卸载 `handleUnmounted`

> 处理卸载前还记得挂载 `umd` 模式的应用时取 `unmount` 吧
>
> - 如果存在的情况下会通过 `this.umdHookUnmount` 记录
> - 将应用信息 `microApp.getData(this.name, true)` 作为参数触发 `unmount`
> - `unmount` 函数可以返回一个 `promise` 作为微任务

`handleUnmounted` 处理卸载：

- 触发自定义事件 `statechange`，通知 `UNMOUNT`
- 触发 `unmount` 事件
- 在子应用上拿到 `window.onunmount`，存在即触发
- 将 `actionsAfterUnmounted` 作为微任务在最后执行
- 如果 `this.umdHookUnmount` 返回的是一个 `promise`，会优先执行返回的微任务

`actionsAfterUnmounted` 完成卸载：

- `umd` 模式下还原容器：`cloneContainer`
- 关闭沙箱 `this.sandBox?.stop`
- `dispatchLifecyclesEvent` 向父应用派发 `UNMOUNT` 生命周期事件
- `clearOptions` 重置应用属性
- 提供 `unmountcb` 的话执行回调，也就是上面说的当组件需要重新挂载的时候需要用到

`clearOptions` 重置属性：

- 还原：`isPrerender`、`preRenderEvents`、`keep-alive`、`container`、`sandbox`
- 如果提供 `destory` 则执行完全销毁 `actionsForCompletelyDestroy`
- 删除 `DOM` 作用域 `removeDomScope`

### `keep-alive` 模式

了解挂载和卸载基本就结束了，最后再补充一个 `keep-alive` 模式，查案官方文档说明 [[查案](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/configure?id=keep-alive)]

#### 1.1. 断开应用 - 销毁组件

目录：`micro_app_element.ts` - `handleDisconnected` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app_element.ts#L124)]

反着来看 `keep-alive` 模式，还是回到 3.2 执行卸载 [[查看](#32-handledisconnected-执行卸载)] 开始：

- 当应用开启 `keep-alive` 模式 `getKeepAliveModeResult`，又不是强制销毁，断开应用处理 `handleHiddenKeepAliveApp`
- 执行场景参考 `handleDisconnected` [[查看](#32-handledisconnected-执行卸载)]

`handleHiddenKeepAliveApp` 断开应用：

- 应用实例存在，且不是卸载、断线状态，执行断开应用 `app.hiddenKeepAliveApp`

#### 1.2. 断开应用 - `app.hiddenKeepAliveApp`

目录：`create_app.ts` - `hiddenKeepAliveApp` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L600)]

参数：

- `callback`：和卸载组件用于断开应用后执行回调，通常用于应用重载或修改在线应用属性

流程：

- 通过 `setKeepAliveState` 设置 `keep-alive` 状态为 `KEEP_ALIVE_HIDDEN`
- 之后 `dispatchCustomEventToMicroApp` 触发一个自定义事件 `appstate-change`，`afterhidden` 事件需要提前发送，原因见源码备注 [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L600)]
- `dispatchLifecyclesEvent` 向父应用派发 `AFTERHIDDEN` 生命周期事件
- 如果路由是 `search` 模式需要清理下路由的生命周期事件 `this.sandBox?.removeRouteInfoForKeepAliveApp()`
- 如果应用 `level` 不是 2：解析静态资源成可执行代码，卸载应用 `mount`，详细见：3.4. 挂载应用 [[查案](#34-unmount-挂载应用)]
- 如果应用 `level` 是 2：创建一个新的 `div`，将容器的 `children` 拷贝放进去
- 最后执行回调，以便应用重载这样的场景重新挂载

#### 2.1. 连接应用 - `handleShowKeepAliveApp`

目录：`micro_app_element.ts` - `handleShowKeepAliveApp` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app_element.ts#L442)]

接收应用实例作为参数，只做一件事：

- 创建一个微任务去执行 `app.showKeepAliveApp`，将应用容器作为参数传过去

执行场景：

1. `handleConnected`：加载一个断开的应用，且 `url` 没有发生变化时，触发场景见：3.1 首次加载 [[查看](#31-handleconnected-首次加载)]
2. `actionsForAttributeChange`：修改在线已断开的应用，且 `url` 没有发生变化时，详细见：1.1 观察属性修改： [[查看](#11-attributechangedcallback-观察属性修改)]

#### 2.2. 连接应用 - `app.showKeepAliveApp`

目录：`create_app.ts` - `showKeepAliveApp` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/create_app.ts#L645)]

参数：

- `container`：应用容器

流程：

- 记录当前的容器为 `oldContainer`，更新当前容器，要求必须在重建沙箱 `rebuildEffectSnapshot` 之前
- 重建沙箱 `effect` 快照 `rebuildEffectSnapshot`
- 之后 `dispatchCustomEventToMicroApp` 触发一个自定义事件 `appstate-change`，通知状态 `beforeshow`
- `dispatchLifecyclesEvent` 向父应用派发 `BEFORESHOW` 生命周期事件
- 通过 `setKeepAliveState` 设置 `keep-alive` 状态为 `KEEP_ALIVE_SHOW`
- 通过 `cloneContainer` 将 `oldContainer` 的 `children` 拷贝到当前容器中
- 如果路由是 `search` 模式需在沙箱生命周期事件之前缓存 `this.sandBox?.setRouteInfoForKeepAliveApp()`
- 之后 `dispatchCustomEventToMicroApp` 触发一个自定义事件 `appstate-change`，通知状态 `aftershow`
- `dispatchLifecyclesEvent` 向父应用派发 `AFTERSHOW` 生命周期事件
