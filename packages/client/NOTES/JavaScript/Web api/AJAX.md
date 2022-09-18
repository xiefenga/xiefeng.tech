# XHR

把 Ajax 推到历史舞台上的关键技术是 XMLHttpRequest(XHR)对象。这个对象最早由微软发明， 然后被其他浏览器所借鉴

所有现代浏览器都通过 XMLHttpRequest 构造函数原生支持 XHR 对象

```javascript
const xhr = new XMLHttpRequest()
```

## 方法

1. `xhr.open(method, url, async)`：为发送请求做好准备
2. `xhr.setRequestHeader(key, value)`：为保证请求头部被发送，必须在 `open` 之后、`send` 之前调用
3. `overrideMimeType(mimetype)`：用于重写 XHR **响应**的 MIME 类型，在 `open` 之后、`send` 之前调用
4. `xhr.send(data)`：没有消息体，必须传递 `null`，调用之后就会发送请求
5. `xhr.abort()`：在收到响应之前取消异步请求
6. `xhr.getResponseHeader(key)`：获取响应头部
7. `xhr.getAllResponseHeaders()`：取得所有响应头部，该方法会返回包含所有响应头部的字符串

```http
Date: Sun, 14 Nov 2004 18:04:03 GMT
Server: Apache/1.3.29 (Unix)
Vary: Accept
X-Powered-By: PHP/4.3.8
Connection: close
Content-Type: text/html charset=iso-8859-1
```

## 属性

1. `timeout`：设置了 `timeout` 且超时之后，XHR 对象就会触发 `timeout` 事件，调用 `ontimeout` 事件处理程序
2. `withCredentials`：设置跨源请求提供凭据（cookie、HTTP 认证和客户端 SSL 证书）
3. `responseText`：作为响应主体被返回的文本
4. `status`：相应的 HTTP 状态
5. `statusText`：响应的 HTTP 状态描述

## readyState

XHR 对象有一个 readyState 属性，表示当前处在请求/响应过程的哪个阶段：

- `0`：未初始化，尚未调用 `open()`
- `1`：已打开，调用了 `open()`，还没有调用 `send()`
- `2`：已发送，调用了 `send()`，还没有收到响应

- `3`：接收中，已经收到部分响应数据

- `4`：完成，已经接收到全部响应数据，可以使用

为保证跨浏览器兼容，`readystatechange` 事件处理程序应该在调用 `open()` 之前注册

## 使用

```javascript
const xhr = new XMLHttpRequest()

xhr.addEventListener('readystatechange', () => {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      console.log(xhr.responseText)
    } else {
      console.log("Request was unsuccessful: " + xhr.status)
    }
  }
})

xhr.open('get', 'https://www.xiefeng.tech', true)

xhr.timeout = 1000 // 设置 1 秒超时

xhr.ontimeout = () => console.log("Request did not return in a second.")

xhr.overrideMimeType("text/xml")

xhr.send(null)
```

# FormData

FormData 类型便于创建 `multipart/form-data` 格式的数据，FormData 实例可以直接传给 XHR 对象的 `send()` 方法

```javascript
const fd = new FormData()
```

可以通过直接给 FormData 构造函数传入一个表单元素

```javascript
const fd = new FormData(document.forms[0])
```

## 方法

**append**

```javascript
formData.append(name, value)
formData.append(name, value[, filename])  // value 为 Blob (包括子类型，如 File)
```

**set**

```javascript
formData.set(name, value)
formData.set(name, value[, filename]) // value 为 Blob (包括子类型，如 File)
```

**区别：** append 新添加的对应的 key 存在也不会覆盖原值，而是新增一个值，如果 key 不存在则新增一项属性值。

## 使用

```javascript
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      alert(xhr.responseText)
    } else {
      alert("Request was unsuccessful: " + xhr.status)
    }
  }
}
xhr.open("post", "postexample.php", true)
const form = document.getElementById("user-info")
xhr.send(new FormData(form)) 
```

# 进度事件

Progress Events 是 W3C 的工作草案，定义了客户端-服务器端通信，这些事件最初只针对 XHR，现在也推广到了其他类似的 API。

## 事件

- `loadstart`：在接收到响应的第一个字节时触发
- `progress`：在接收响应期间反复触发
- `error`：在请求出错时触发
- `abort`：在调用 `abort()` 终止连接时触发
- `load`：在成功接收完响应时触发
- `loadend`：在通信完成时，且在 `error`、`abort` 或 `load` 之后触发

每次请求会首先触发 loadstart 事件，之后是一个或多个 progress 事件，接着是 error、abort 或 load 中的一个，最后是 loadend 事件

**load**

`load` 事件在响应接收完成后立即触发，这样就不用检查 `readyState` 属性

`onload` 事件处理程序的 `event.target` 为 XHR 实例，但不是所有浏览器都实现了这个事件的 `event` 对象

**progress**

`onprogress` 事件处理程序的 `event.target` 是 XHR 对象，且包含 3 个额外属性：`lengthComputable`、`position` 和 `totalSize`

- `lengthComputable` 是 一个布尔值，表示进度信息是否可用
- `position` 是接收到的字节数
- `totalSize` 是响应的 `ContentLength` 头部定义的总字节数

为了保证正确执行，需要在调用 `open()` 之前添加 `onprogress` 事件处理程序

## 使用

```javascript
const xhr = new XMLHttpRequest()
xhr.onload = () => {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    console.log(xhr.responseText)
  } else {
    console.log("Request was unsuccessful: " + xhr.status)
  }
}
xhr.onprogress = event => {
  const divStatus = document.getElementById("status")
  if (event.lengthComputable) {
    divStatus.innerHTML = "Received " + event.position + " of " + event.totalSize + " bytes"
  }
}
xhr.open("get", "https://xiefeng.tech", true)
xhr.send(null)
```

# Fetch

只要服务器返回了响应，Promise 就会 resolved，如果服务器没有响应而导致浏览器超时，这样才会导致 Promise rejected

这个行为是合理的：系统级网络协议已经成功完成消息的一次往返传输，至于真正的“成功”请求，则需要在处理响应时再定义。

违反 CORS、无网络连接、HTTPS 错配及其他浏览器/网络策略问题都会导致 Promise 被拒绝

## 中断请求

Fetch API 支持通过 AbortController/AbortSignal 对中断请求

`AbortController` 接口表示一个控制器对象，可以根据需要中止一个或多个 Web请求：

- `signal`：返回 `AbortSignal` 对象实例，可以用来 with/abort 一个Web(网络)请求
- `abort()`：中止一个尚未完成的 Web 请求

`AbortSignal ` 接口表示一个信号对象，通过 `AbortController` 对象与DOM请求进行通信并在需要时将其中止

- `aborted`：与之通信的请求是否被终止（true）或未终止（false）
- `onabort`：当信号正在与之通信的DOM请求被中止时调用

当初始化 fetch 时，将信号和控制器与获取请求相关联，可以允许我们通过调用 `abort()` 中止请求

当调用 `abort()` 时，`fetch` 会 reject 一个名为 `AbortError` 的 `DOMException`

```javascript
const abortController = new AbortController()

document.querySelector('#fetch').onclick = async () => {
  const url = 'http://api.xiefeng.tech/api/daily/quote'
  try {
    // 将信号和控制器与获取请求相关联
    const resp = await fetch(url, { signal: abortController.signal })
    const data = await resp.json()
    console.log(data)
  } catch (error) {
    console.log('request has been abort', error)
  }
}

document.querySelector('#abort').onclick = () => {
  abortController.abort()
}
```

## Header

Headers 对象是所有请求和响应头部的容器，通过 `Request.prototype.headers` 和 `Response.prototype.headers` 可以访问请求和响应包含着头部的 Headers 对象。

请求和响应的 Headers 对象的属性都是可以修改的，使用 `new Headers()` 也可以创建一个新的实例

Headers 类似于 Map，但是在初始化 Headers 对象时，可以使用键/值对形式的对象

```javascript
const header = new Headers({'a': 'b'})
header.get('a')	// 'b'
```

一个 HTTP 头部字段可以有多个值，Headers 对象通过 `append()` 方法支持添加多个值

```javascript
const header = new Headers({'a': 'b'})
header.get('a')	// 'b'
header.append('a', 'c')
header.get('a')	// 'b, c'
```

## Request

通过 `Request` 构造函数可以创建一个 `Request` 实例，参数和 `fetch` 相同

```javascript
new Requset('', {})
```

### 克隆Request

Fetch API 提供了两种方式创建 Request 对象的副本：使用 Request 构造函数、使用 `clone()` 方法

将 Request 实例作为 input 参数传给 Request 构造函数，会得到该请求的一个副本：

```javascript
const r1 = new Request('https://foo.com')
const r2 = new Request(r1)
```

这种克隆方式会使得第一个请求的请求体会被标记为“已使用”，并且可以传递第二个参数覆盖原始的值

```javascript
r1.bodyUsed	// true
r2.bodyUsed	// false
```

使用 `clone()` 方法会创建一模一样的副本，也不会将任何请求的请求体标记为“已使用”：

```javascript
const r1 = new Request('https://foo.com', { method: 'POST', body: 'foobar' })
const r2 = r1.clone()

console.log(r1.bodyUsed) // false
console.log(r2.bodyUsed) // false
```

如果请求对象的请求体已被读取（`bodyUsed = true`），进行克隆会导致抛出 TypeError

### 传入fetch

fetch 的参数和 Request 的参数是一摸一样的，在调用 `fetch` 时，可以传入已经创建好的 Request 实例

```javascript
const request = new Request('https://foo.com')
// 向 foo.com 发送 POST 请求
fetch(request, { method: 'POST' })
```

`fetch` 会在内部克隆传入的 Request 对象，通过 fetch 使用 Request 会将请求体标记为已使用

`fetch` 也不能拿请求体已 经用过的 Request 对象来发送请求

```javascript
const request = new Request('https://foo.com', { body: 'foobar' })
fetch(request)
fetch(request)	// TypeError: Cannot construct a Request with a Request object that has already been used.
```

## Response

Response 对象是获取资源响应的接口，这个接口暴露了响应的相关信息，也暴露了使用响应体的不同方式

可以使用构造函数创建 Response 实例

```javascript
const response = new Response('body content')
```

大多数情况下，产生 Response 对象的主要方式是调用 fetch

使用 `clone` 方法会克隆 Response 实例，不会将任何请求的请求体标记为已使用，如果响应体已经被读取则会报错

通过创建带有原始响应体的 Response 实例，可以执行伪克隆操作，不会导致第一个 Response 实例标记为已读，但会共享 body

```javascript
let r1 = new Response('foobar')
let r2 = new Response(r1.body)
console.log(r1.bodyUsed)    // false
console.log(r2.bodyUsed)    // false
r2.text().then(console.log) // foobar
r1.text().then(console.log) // TypeError: Failed to execute 'text' on 'Response': body stream is locked
```

## Body

Request 和 Response 都使用了 Fetch API 的 Body 混入，以实现两者承担有效载荷的能力，通过 body 即可访问

Body 混入提供了 5 个方法，用于将 ReadableStream 转存到缓冲区的内存里，以及通过 Promise 来产生结果

1. `body.text`
2. `body.json`
3. `body.formData`
4. `body.arrayBuffer`
5. `body.blob`

Body 混入是构建在 ReadableStream 之上的，所以主体流只能使用一次，再次调用就会抛出错误

在读取流时会给流加锁，无论流是否读完第二次调用都会报错，bodyUsed 表示流是否已**摄受**（读取器是否已经在流上加了锁）

```javascript
request.blob(); // 第一次调用给流加锁
request.blob(); // 第二次调用再次加锁会失败
```

ReadableStream 暴露了 `getReader()` 方法，可以用于在数据到达时异步获取数据块，数据流的格式是 Uint8Array

```javascript
const reader = response.body.getReader()
while (true) {
  const { value, done } = await reader.read()
  if (done) {
    break
  }
  console.log(value)
}
```

# WebSocket

要创建一个新的 WebSocket，就要实例化一个 WebSocket 对象并传入提供连接的 URL

创建 WebSocket 实例之后浏览器会马上尝试连接，同源策略不会限制 WebSocket：

```js
const socket = new WebSocket("ws://xxxxxxx")
```

## 状态

与 XHR 类似，WebSocket 也有一个 readyState 属性表示当前状态：

- `WebSocket.OPENING`：正在连接
- `WebSocket.OPEN`：已经建立连接
- `WebSocket.CLOSING`：正在关闭连接
- `WebSocket.CLOSE`：已经关闭连接

WebSocket 对象没有 readystatechange 事件，而是有与上述不同状态对应的其他事件

任何时候都可以调用 `close()` 方法关闭 Web Socket 连接

```javascript
socket.close()
```

## 发送 / 接收数据

打开 Web Socket 之后，使用 `send()` 方法传入字符串、ArrayBuffer 或 Blob 即可向服务器发送数据：

```js
const stringData = "Hello world!"
const arrayBufferData = Uint8Array.from(['f', 'o', 'o'])
const blobData = new Blob(['f', 'o', 'o'])
socket.send(stringData)
socket.send(arrayBufferData.buffer)
socket.send(blobData)
```

服务器向客户端发送消息时，WebSocket 对象上会触发 message 事件，可以通过 event.data 属性访问到有效载荷：

```javascript
socket.onmessage = (event)=> {
  const data = event.data
  // ......
}
```

`event.data` 也可能是 ArrayBuffer 或 Blob，这由 `socket.binaryType` 属性决定，该属性值为 `"blob"` 或 `"arraybuffer"`

## 事件

WebSocket 对象在连接生命周期中可能触发的事件：

- open：在连接成功建立时触发
- error：在发生错误时触发，连接无法存续
- message：接收到服务器消息时触发
- close：在连接关闭时触发

WebSocket 对象仅支持 DOM Level 0 风格的事件处理程序来监听这些事件