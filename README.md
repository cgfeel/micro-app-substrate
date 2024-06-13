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

`micro-app` 是基于 `web component`，在上面演示了 `web component` 特性。所以大致可以想到 `micro-app` 启动流程如下：

- 去掉注册信息，无需关心接入协议
- 使用配置文件启动 `start`
- 在组件渲染过程中解析 `web component`
- 将取到的配置文件在 `web component` 生命周期内进行处理，如：添加沙箱等

和 `qiankun` 解读一样，为了便于阅读全部以当前官方版本 `c177d77ea7f8986719854bfc9445353d91473f0d` [[查看](https://github.com/micro-zoe/micro-app/tree/c177d77ea7f8986719854bfc9445353d91473f0d)] 为准

> 这一章节链接指向官方仓库，由于内容比较长，每一条信息我都暴露了关键的对象名，可以打开链接复制关键的对象名，查看上下文对照理解。有一点需要说明的是，`micro-app` 更新速度比 `qinkun` 要快，可能你在查阅的时候最新的源码已做了调整

### `microApp.start` 启动应用

直接从 `start` 方法开始

目录：`micro_app.ts` - `MicroApp` - `start` [[查看](https://github.com/micro-zoe/micro-app/blob/c177d77ea7f8986719854bfc9445353d91473f0d/src/micro_app.ts#L272)]

参数：

- `options`：`OptionsType` 类型，直接看官方文档 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/api?id=start)]

准备工作，判断和设置环境：

- 先判断环境：`isBrowser || !window.customElements`
- 保证一个基座只启动 1 次 `hasInit`，通过即设置为 `true` 避免重复 `start`
- 判断自定义 `tagName`
- `initGlobalEnv`：将当前环境下的 `global` 做一份备份，注 ④
- 确保真实 `window` 是否中还没有创建自定义的 `tagName`

> 注 ④：
>
> - 将 `window`、`document`、`Document` 上的属性和方法拷贝到 `globalEnv` 中
> - 创建一个 `Image` 的 `proxy` 对象，用于在创建时使用微应用的名称添加一个属性 `__MICRO_APP_NAME__`
> - 给 `window` 注入一个全局属性 `__MICRO_APP_BASE_APPLICATION__`
> - 通过 `rejectMicroAppStyle` 创建一个 `style` 标签，将所有 `tagName` 和 `micro-app-body` 作为块级元素，隐藏 `micro-app-head`
> - `micro-app` 会将子应用的 `head` 转换为 `micro-app-head`，将 `body` 转换为 `micro-app-body`，后面会提到

定义配置文件：

- 将整个 `options` 赋值给 `this.options`
- `disable-scopecss` 定义全局禁用样式隔离，默认为 `false`
- `disable-sandbox` 定义全局禁用沙箱，默认为 `false`
- `preFetch` 利用浏览器空闲时间预加载 `app` 资源，注 ⑤

> 注 ⑤：关于预加载通过文档了解 [[查看](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/prefetch)]
>
> 原理：
>
> - `preFetch` 在 `requestIdleCallback` 中起一个微任务
> - 通过 `preFetchInSerial` 拍平并通过 `preFetchAction` 微任务队列加载：
> - `preFetchAction` 返回一个 `promise`，在 `promise` 中通过 `requestIdleCallback` 利用空闲时间加载每一个资源
>
> `micro-app` 和 `qiankun` 都支持预加载，不同的是：
>
> - `qiankun` 默认在第一个应用加载完成后开始预加载，可以通过 `prefetch: 'all'` 优先加载全部应用
> - `micro-app` 没有自定义加载策略，只能通过 `delay` 统一延迟加载时间
> - `micro-app` 可以设置加载等级：加载、执行、渲染，`qiankun` 并不支持，同样不支持的还有 `iframe` 沙箱
> - 除此之外 `micro-app` 预加载还支持隔离、渲染等配置，而 `qiankun` 中需要通过手动加载 `loadMicroApp` 来实现，但手动加载并非预加载
