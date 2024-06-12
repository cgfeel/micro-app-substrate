# micro-app-substrate

一个 `micro-app` 基座，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

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
- 优点 2：由于 `micro-app` 的侵入性稍微好点，所以使用的范围更广也更方便一点，比如接入 `NextJS` 应用
- 缺点：兼容性，注 ③

> 注 ③：`qinkun` 的沙箱采用的是 `proxy`，同样存在兼容问题；如果需要兼容就要降级沙箱，但这样就要牺牲性能修改模式。

---- 分割线 ----
