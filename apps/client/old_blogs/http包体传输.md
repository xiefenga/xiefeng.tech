---
title: http包体传输方式
date: 2021-09-21 15:52:25
tags:
  - http/https
  - 网络
categories:
  - [计算机基础, 计算机网络]
cover: https://oss.xiefeng.tech/images/20210921170805.png
---

# 定长传输

发送 HTTP 消息时如果能够确定包体的全部长度，我们一般会使用 `Content-Length` 指明包体长度

`Content-Length` 使用 10 进制数，指明的是请求包体中的**字节数**

```typescript
import { createServer } from 'net'

const server = createServer((socket) => {
  socket.on('data', () => {
    socket.write('HTTP/1.1 200 OK\r\n')
    socket.write('Content-Length: 11\r\n')
    socket.write('\r\n')
    socket.write('hello world\r\n')
    socket.write('\r\n')
  })
})

server.listen(12306)
```

但是如果我们不设置这个字段会怎么样呢？

刷新一下浏览器会发现浏览器一直处于加载状态，这是怎么回事呢？

这就跟长连接有关了，HTTP/1.1 规定所有连接都必须是持久的，除非显式地在头部加上 `Connection: close`

对于持久连接，浏览器会将多个 HTTP 请求复用一个 TCP 连接，所以浏览器需要明确的知道这一次请求是否已经结束

如果给定了 `Content-Length` 字段，客户端解析起来就十分的简单，当请求体的长度到达该值时表明该请求已经结束

而如果没有这个字段，我们自己知道数据已经发完了，但是浏览器并不知道这一点，它无法得知这个打开的连接上是否还会有新数据进来，只能傻傻地等了

当然了如果是非持久连接，浏览器可以通过连接是否关闭来界定请求或响应实体的边界

```typescript
socket.destroy()
// 或者 socket.end()
```

如果 `Content-Length` 值和请求体的字节数不相同会怎么样？

客户端根据 `Content-Length` 的值以及接收到请求体中的数据长度来判断当前响应实体的边界

```typescript
import { createServer } from 'net'

const server = createServer((socket) => {
  socket.on('data', () => {
    socket.write('HTTP/1.1 200 OK\r\n')
    socket.write('Content-Length: 10\r\n')
    socket.write('\r\n')
    socket.write('hello world\r\n')
    socket.write('\r\n')
  })
})

server.listen(12306)
```

当给定的数值小于包体的数据字节数时，客户端一般会截断处理，最后接收到的数据则为 `hello worl`

而当给定的数值大于包体的长度时，会发现浏览器一直处于 loading 状态，这也很好理解：浏览器发现接收到的数据还没有达到给定的长度，说明还有数据在传输，所以会一直等待后续的数据，就像没有给 `Content-Length` 一样

所以 `Content-Length` 字段必须真实反映实体长度，否则就会产生一些问题

# 分块传输

但是有些时候实体长度并不能在传输之前就确定，例如：实体来自于网络文件，或者我们需要边解压边发送

在 HTTP 报文中，实体一定要在头部之后，为此我们需要一个新的机制：不依赖头部的长度信息，也能知道实体的边界

使用 `Transfer-Encoding: chunked` 即可指明使用分块传输方式传递实体

使用了该字段之后 `Content-Length` 会失效，并且报文中的实体需要改为用**一系列分块**（chunk）来传输

![](https://oss.xiefeng.tech/images/20210921152832.png)

- 请求 body 由 chunk、last-chunk、trailer-part 组成
- 每一个 chunk 由 chunk-size 和 chunk-data 组成
- last-chunk 指明这是最后一个 chunk，其中没有数据，由多个 0 组成，一般发送一个 0 即可
- trailer-part 部分是 chunk 传递完之后要传递的 HTTP 头部
  - 该部分可以没有，如果有的话首先需要在 `Trailer` 头部声明
  - 该部分使用场景：分包传递的这个文件的 MD5 值

```typescript
import { createServer } from 'net'

const server = createServer((socket) => {
  socket.on('data', () => {
    // 头部
    socket.write('HTTP/1.1 200 OK\r\n')
    socket.write('Transfer-Encoding: chunked\r\n')
    socket.write('\r\n')
    // 第一个 chunk
    socket.write('5\r\n')
    socket.write('hello\r\n')
    // 第二个 chunk
    socket.write('6\r\n')
    socket.write(' world\r\n')
    // last chunk
    socket.write('0\r\n')
    socket.write('\r\n')
  })
})
server.listen(12306)
```

使用 wireshark 抓包可以看到 http 报文中分包的数据

![](https://oss.xiefeng.tech/images/20210921152737.png)

在 chunk 传递完之后需要传递一些头部，则一开始就需要在 `Trailer` 字段中声明后续 trailer-part 部分要传递的头部字段名

```typescript
import { createServer } from 'net'

const server = createServer((socket) => {
  socket.on('data', () => {
    // 头部
    socket.write('HTTP/1.1 200 OK\r\n')
    socket.write('Trailer: Date\r\n')
    socket.write('Transfer-Encoding: chunked\r\n')
    socket.write('\r\n')
    // 第一个 chunk
    socket.write('5\r\n')
    socket.write('hello\r\n')
    // 第二个 chunk
    socket.write('6\r\n')
    socket.write(' world\r\n')
    // last chunk
    socket.write('0\r\n')
    // trailer-part
    socket.write(`Date: ${new Date()}\r\n`)
    socket.write('\r\n')
  })
})
server.listen(12306)
```

![](https://oss.xiefeng.tech/images/20210921165030.png)

如果客户端要使用这些头部则需要在请求时发送 `TE: trailers` 头部，表明客户端接收 Trailer 头部

`Trailer` 字段值有一些限制，有些头部不允许在 `Trailer` 头部中传输：

  - 用于信息分帧的首部 (例如 `Transfer-Encoding` 和 `Content-Length`)
  - 用于路由用途的首部 (例如 `Host`)
  - 请求修饰首部 (例如控制类和条件类的，如 `Cache-Control`，Max-Forwards，或者 `TE`)
  - 身份验证首部 (例如 `Authorization` 或者 `Set-Cookie`)
  - `Content-Encoding`、`Content-Type`、 `Content-Range`，以及 `Trailer` 自身
