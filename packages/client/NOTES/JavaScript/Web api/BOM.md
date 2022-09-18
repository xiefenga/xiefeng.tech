## 窗口关系

在应用有 iframe 的页面时：

- top 对象始终指向最上层窗口，即浏览器窗口本身
- parent 对象则始终指向当前窗口的父窗口
-  self 对象始终会指向 window

如果没有使用 iframe 则都指向 window

## 像素比

CSS 像素是 Web 开发中使用的统一像素单位。

这个单位的背后其实是一个角度：0.0213°。

如果屏幕距离人眼是一臂长，则以这个角度计算的 CSS 像素大小约为 1/96 英寸，这样定义像素大小是为了在不同设备上统一标准。

物理像素与 CSS 像素之间的转换比率由 `window.devicePixelRatio` 属性提供

`window.devicePixelRatio` 实际上与 DPI 相对应，DPI 表示单位像素密度，`window.devicePixelRatio` 表示物理像素与逻辑像素之间的缩放系数

## 窗口位置

现代浏览器提供了 `screenLeft` 和 `screenTop` 属性，用于表示窗口相对于屏幕左侧和顶部的位置 ，返回值的单位是 CSS 像素。

使用 `moveTo()` 和 `moveBy()` 方法可以移动窗口，

## 窗口大小

所有现代浏览器都支持 4 个属性：`innerWidth`、`innerHeight`、`outerWidth` 和 `outerHeight`。

- `outerWidth` 和 `outerHeight` 返回浏览器窗口自身的大小
- `innerWidth` 和 `innerHeight` 返回浏览器窗口中页面视口的大小

`resizeTo()` 和 `resizeBy()` 方法可以调整窗口大小，缩放窗口的方法可能会被浏览器禁用，缩放窗口只能应用到最上层的 window 对象。

## 视口位置

度量文档相对于视口滚动距离的属性有两对，并且返回相同的值：

- `window.pageXoffset`、`window.pageYoffset`
- `window. scrollX`、`window.scrollY`

使用 `scroll()`、`scrollTo()` 和 `scrollBy()` 方法可以滚动页面：

1. `scroll` 和 `scrollTo` 相同
2. 除了可以接受偏移距离，也可以接收一个 ScrollToOptions 字典参数
   1. ScrollToOptions 对象具有 `left` 和 `top` 属性
   2. ScrollToOptions 对象还具有 `behavior` 属性，描述滚动行为，取值 `auto` 和 `smooth`

```javascript
// 正常滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'auto'
})
// 平滑滚动
window.scrollTo({ 
  left: 100,
  top: 100,
  behavior: 'smooth'
})
```

## 导航和新窗口

`window.open()` 方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。

该方法接收四个参数：URL、目标窗口名、特性字符串、替换当前页面

### 窗口名

如果第二个参数是一个已经存在的窗口或窗格(frame)的名字，则会在对应的窗口或窗格中打开 URL

```javascript
// 与<a href="http://www.wrox.com" target="topFrame"/>相同 
window.open("http://www.wrox.com/", "topFrame");
```

该参数也可以是一个特殊的窗口名，比如`_self`、 `_parent`、`_top` 或 `_blank`。

### 窗口特性

如果不是打开已有窗口，则会打开一个新窗口或标签页。

1. 当特性字符串中至少包含 `width` 或 `height` 时则会打开一个新的窗口
2. 如果打开的不是新窗口，则忽略该参数
3. 特性字符串是一个逗号分隔的设置字符串，用于指定新窗口包含的特性

|     参数      |       值       |                     说明                     |
| :-----------: | :------------: | :------------------------------------------: |
| height、width |     number     |       新窗口的高度和宽度，不能小于 100       |
|   top、left   |     number     |       新窗口的 x、y 轴坐标，不能小于 0       |
|   location    | 'yes' \| 'no'  | 表示是否显示地址栏，不同浏览器的默认值不一样 |
|    Menubar    | 'yes' \| 'no'  |        表示是否显示菜单栏，默认为"no"        |
|   resizable   | 'yes'  \| 'no' |  表示是否可以拖动改变新窗口大小。默认为"no"  |
|  scrollbars   | 'yes' \| 'no'  |   表示是否可以在内容过长时滚动，默认为"no"   |
|    status     | 'yes' \| 'no'  | 表示是否显示状态栏，不同浏览器的默认值不一样 |
|    toolbar    | 'yes' \| 'no'  |        表示是否显示工具栏，默认为"no"        |

```javascript
window.open('https://xiefeng.tech', null, 'height=400,width=400')
```

### 窗口控制

`window.open()` 方法返回一个对新建窗口的引用，这个对象与普通 window 对象没有区别，只是为控制新窗口提供了方便。

某些浏览器默认不允许缩放或移动主窗口，但可能允许缩放或移动通过 `window.open()` 创建的窗口，比如 chrome

Chrome 下无法 resize 和 move 主窗口，也没有办法 close 主窗口，但是允许通过 open 返回的对象对新建窗口进行操作：

1. 可以关闭新建窗口
2. 非跨域情况可以正常 `resizeTo`、`moveTo` 操作

新创建窗口的 window 对象的 opener 属性指向打开它的窗口：

```javascript
const child = window.open('/index.html', null, `height=400,width=400`)
console.log(child.opener === window)	// true
```

现代浏览器都是多进程架构，每个标签页会运行在独立的进程中。

如果一个标签页打开了另一个，window 对象可能需要跟另一个标签页通信，那么新的标签页不能运行在独立的进程中。

将新打开标签页的 opener 设置为 null，表示新打开的标签页可以运行在独立的进程中，这个连接一旦切断就无法恢复。

```javascript
const child = window.open('/index.html', null, `height=400,width=400`)
child.opener = null
```

## location

location 对象提供了当前窗口中加载文档的信息，以及通常的导航功能

### URL 信息

- location.hash：URL 中的 hash 值，包括 `#`
- location.host：主机名及端口号
- location.hostname：主机名（域名）
- location.href：当前加载页面的完整 URL，location 的 `toString()` 方法也返回这个值
- location.port：URL 中的端口号，没有即为 `''`
- location.protocol：页面使用的协议，通常是 `"http:"` 或 `"https:"`
- location.search：URL 中的查询字符串，包括 `?`
- location.origin：URL 的源地址，只读

### 操作地址

可以通过修改 location 对象修改浏览器的地址，除了 `location.origin` 其他的属性都可以修改从而改变当前的 URL

使用 `location.assign` 方法会立即启动导航到新 URL 的操作，同时在浏览器历史记录中增加一条记录

```javascript
// 相同的效果
location.assign('https://xiefeng.tech')
location.href = 'https://xiefeng.tech'
window.location = 'https://xiefeng.tech'
```

如果不希望增加历史记录，可以使用 `location.replace` 方法，使用该方法重新加载后不会增加历史记录

```javascript
location.replace('https://xiefeng.tech')
```

使用 `location.reload` 可以重新加载当前显示的页面，如果想强制从服务器重新加载页面，可以传递参数 true

```javascript
location.reload(); // 重新加载，可能是从缓存加载 
location.reload(true); // 重新加载，从服务器加载
```

位于 `reload` 之后的代码可能执行也可能不执行，这取决于网络延迟和系统资源等因素，最好把 `reload` 作为最后一行代码。

### URLSearchParams

URLSearchParams 提供了一组标准 API 方法，通过它们可以检查和修改查询字符串：

```javascript
const qs = '?q=javascript&num=10'

const searchParams = new URLSearchParams(qs)

console.log(searchParams.toString())	// q=javascript&num=10

console.log(
  searchParams.has('q'),
  searchParams.get('q')
)	// true 'javascript'

searchParams.set('page', '10')

searchParams.delete('num')

console.log(searchParams.toString())	// q=javascript&page=10
```

 URLSearchParams 也实现了迭代器接口：

```javascript
for (let param of searchParams) {
  console.log(param);
}
// ["q", "javascript"]
// ["num", "10"]
```

### URL 编码

JavaScript 内置了一些进行 URL 编码和解码的函数

- `escape`

  - 不能直接用于URL编码，它的真正作用是返回一个字符的 Unicode 编码值
  - 除了ASCII字母、数字、标点符号 @ * _ + - . / 以外，对其他所有字符进行编码
  - 解码函数是 `unescape()`

  ```javascript
  escape('https://xiefeng.tech/Vue2的响应式原理.html')
  // 'https%3A//xiefeng.tech/Vue2%u7684%u54CD%u5E94%u5F0F%u539F%u7406.html'
  
  unescape('https%3A//xiefeng.tech/Vue2%u7684%u54CD%u5E94%u5F0F%u539F%u7406.html')
  // 'https://xiefeng.tech/Vue2的响应式原理.html'
  ```

- `encodeURI`

  - 对整个URL进行编码，对 URL 中特殊的含义的符号 ; / ? : @ & = + $ , # 不进行编码
  - 编码后输出为 utf-8 形式，并且在每个字节前加上%
  - 对应的解码函数是 `decodeURI()`

- `encodeURIComponent`

  - 对URL的组成部分进行个别编码，; / ? : @ & = + $ , # 也会进行编码
  - 编码方法和 `encodeURL` 相同
  - 解码函数是 `decodeURIComponent()`

## history

history 对象表示当前窗口首次使用以来用户的导航历史记录，出于安全考虑，该对象不会暴露用户访问过的 URL， 但可以通过它在不知道实际 URL 的情况下前进和后退。

### 导航

`history.go` 可以在用户历史记录中沿任何方向导航，可以前进也可以后退：

```javascript
history.go(-1)
history.go(1)
```

`history.go` 有两个简写方法：`history.back` 和 `history.forward`，这两个方法模拟了浏览器的后退按钮和前进按钮

`history.length` 表示历史记录中有多个条目

### 历史状态

HTML5 为 history 对象增加了方便的状态管理特性，状态管理 API 可以让开发者改变浏览器 URL 而不会加载新页面。

`history.pushState()` 方法接收 3 个参数：一个 state 对象、一个新状态的标题、一个相对 URL（可选）

- 第一 个参数包含初始化页面状态所必需的信息，状态的对象大小通常在 500KB~1MB 以内
- 第二个参数并未被当前实现所使用
- 方法执行后，状态信息就会被推到历史记录中，浏览器地址栏也会改变以反映新的 URL

通过 pushState 所添加的历史记录，在进行前进、后退操作时会触发 window 的 `popstate` 事件：

```javascript
window.addEventListener('popstate', e => {
  console.log(e.state)
})
```

页面初次加载时没有状态，因此后退到最初页面时，event.state 为 `null`

可以通过 `history.state` 获取当前的状态对象，通过 `replaceState` 可以更新当前的状态，参数和 `pushState` 前两个参数相同