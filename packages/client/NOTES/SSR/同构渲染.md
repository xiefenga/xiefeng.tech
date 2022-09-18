## 同构渲染

同构渲染是实现 SSR 的一种方式

> **同构**的概念最早是angular2在beat版中提出来的(2016年)， 那时叫angular isomorphism，是一个类似于草案的策略， 是为了解决angular 1.x时代的SPA首屏慢及SEO问题而提出的

> **同构渲染**加入一个中间层的概念，中间层从后端接过渲染的逻辑，首次渲染时使用 Node.js 生成 HTML，后续客户端交互包括当前页路由切换直接在客户端完成。一般来说同构渲染是介于前后端中的共有部分

同构的核心是客户端和服务端共用一套渲染代码， 服务端需要使用可以识别 javascript 的引擎

一套代码在服务器上运行一遍，得到完整的页面结构，到达浏览器又运行一遍，注册事件让页面可交互

![](https://oss.xiefeng.tech/images/20220816105806.png)

## 入口

实现同构渲染需要在服务端运行组件代码生成 HTML 字符串，客户端运行组件代码对已有的 DOM 注册事件

服务端使用 `renderToString` 可以将组件树渲染成 HTML 字符串

客户端使用 `hydrate` 在服务器渲染的容器中对 `HTML` 的内容进行水合操作

因为客户端需要运行 JavaScript 进行注水，所以服务器返回的 HTML 中除了静态的页面结构还需要已经打包好的 JavaScript 文件

```react
// client.js
import Root from '@/Root'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(document.getElementById('root'), <Root />)

// server.js
import Root from '@/Root'
import { renderToString } from 'react-dom/server'

app.use(express.static('./public'))

app.get('*', async (req, res) => {
  const ssrString = renderToString(<Root location={req.path} />)
  const scripts = await readdir('./public/js')
  const html = await renderTemplate(template, { ssrString, scripts })
  res.send(html)
})
```

```ejs
// template.ejs
...
<body>
  <div id="root"><%- ssrString %></div>
  <% scripts.forEach(script => { %>
  <script src="/js/<%= script %>"></script>
  <% }) %>
</body>
```

## 样式处理

服务端和客户端对于 CSS 的处理有些许不同，对于 CSS 的解析是相同的（例如使用：css-loader）

- 客户端可能需要将样式插入页面（style-loader）或者生成 CSS 文件（mini-css-extract-plugin）

- 服务端不能也不可以运行插入样式的代码，也不需要重复的生成 CSS 文件，对于普通 CSS 可以什么也不做

对于使用 CSS modules 的情况，需要保证客户端和服务端得到类名相同

在客户端可以使用 `style-loader` 或者 `mini-css-extract-plugin` 处理 `style-loader` 生成的 CSS modules 代码并导出类名

在服务端可以使用 `isomorphic-style-loader` 实现相同的效果，原理和 `style-loader` 相似

## 兼容路由

浏览器的请求达到服务器，服务器渲染的应该是相应路由对应的页面组件

客户端可以使用 `BrowserRouter` 进行路由的选择，服务器端是没有办法使用 web api 进行路由匹配的

借助 `react-router` 提供的 `StaticRouter` 组件，通过传入 `location` 属性可以找到相应组件

```react
import { BrowserRouter } from 'react-router-dom'
import { StaticRouter } from 'react-router-dom/server'

import App from './App'
import { isBrowser } from './utils/env'

const Router = isBrowser ? BrowserRouter : StaticRouter

export default function Root(props) {
  const routerProps = isBrowser ? {} : { location: props.location }
  return (
    <Router {...routerProps}>
      <App />
    </Router>
  )
}
```

## 兼容Redux

redux 本身是不依赖环境的，react-redux 也只是依赖 react

客户端服务端都可以运行，可以直接使用

需要注意的一点是，服务端的仓库应当是一个请求对应一个仓库，每个服务端仓库都需要脱水注入页面

```react
import { makeStore } from './store'
import { Provider } from 'react-redux'

const Router = isBrowser ? BrowserRouter : StaticRouter

const clientStore = makeStore()

export default function Root(props) {
  const routerProps = isBrowser ? {} : { location: props.location }
  const store = isBrowser ? clientStore : props.store
  return (
    <Provider store={store}>
      <Router {...routerProps}>
        <App />
      </Router>
    </Provider>
  )
}
```

### 数据请求

有些路由是需要加载数据的，在 SSR 的时候应当服务器请求数据，获取数据渲染成完整页面

如果是返回的页面是个空列表，还需要客户端再请求一次就失去了 SSR 的意义

给需要获取数据的组件添加静态方法 `getInitialData` 获取数据

服务端在渲染之前调用匹配到路由的静态方法获取数据写入仓库，再开始渲染组件

```react
app.get('*', async (req, res) => {
  const store = makeStore()

  const matches = matchRoutes(routes, req.path)
  .filter(route => !!route.getInitialData)

  await Promise.all(
    matches.map(route => Promise.resolve(route.getInitialData(store)))
  )

  const ssrString = renderToString(<Root location={req.path} store={store} />)
  const scripts = await readdir('./public/js')
  const storeState = store.getState()
  const ssrPath = req.path
  
  const renderData = { ssrString, scripts, styles, storeState, ssrPath }
  const html = await renderTemplate(template, renderData)
  res.send(html)
})
```

### 数据脱水

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <script>
      window.INITIAL_STORE_STATE = <%- JSON.stringify(storeState) %>
       window.SSR_REQUEST_PATH = "<%= ssrPath %>"
    </script>
  </head>
  ...
</html>
```

## 脱水

- 组件被序列化成了静态的 HTML 片段
- 仓库数据被序列化为 JSON 传到客户端

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <script>
      window.INITIAL_STORE_STATE = <%- JSON.stringify(storeState) %>
        window.SSR_REQUEST_PATH = "<%= ssrPath %>"
    </script>
  </head>
  <body>
    <div id="root"><%- ssrString %></div>
    <% scripts.forEach(script => { %>
    <script src="/js/<%= script %>"></script>
    <% }) %>
  </body>
</html>
```

## 注水

客户端 JavaScript 加载完成后执行 react 同构方法 `hydrate` 

- `hydrate` 类似于 `render` 方法，用于二次渲染
- `hydrate` 会复用原本已经存在的 DOM 节点，只进行事件的绑定
- `hydrate` 主要用于二次渲染服务端渲染的节点，提高首次加载体验

```react
import Root from '@/Root'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(document.getElementById('root'), <Root />)
```

## 整体思路

1. 后端根据路径找到需要渲染的页面组件
2. 调用组件初始化时需要请求的接口，同步获取到数据（写入仓库）
3. 使用 `renderToString` 方法对组件进行渲染，使其渲染出节点字符串
4. 后端将组件字符串、仓库数据脱水、客户端打包的 js、css 路径拼接，返回最终 HTML 文件
5. 客户端渲染后端返回的 HTML，加载并运行其中的 JavaScript，完成同构



https://juejin.cn/post/6902541164931448846#heading-20