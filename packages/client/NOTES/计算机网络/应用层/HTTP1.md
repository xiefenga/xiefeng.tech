# 请求方法

- `GET`：主要的获取信息方法，幂等方法

- `POST`：常用于提交 form 表单，新增资源等

- `HEAD`：类似于 GET 方法，但是服务器不返回 body，用于确认 URI 的有效性及资源更新的日期时间等，幂等方法

- `PUT`：传输文件，更新资源

- `DELETE`：删除文件

- `CONNECT`：要求在与代理服务器通信时建立隧道，实现用隧道协议进行TCP，主要使用 SSL 和 TLS 加密内容

- `OPTIONS`：查询服务器对访问资源支持的方法

- `TRACE`：路径追踪，回显服务器收到的请求，用于定位问题

发送请求时在 `Max-Forwards` 首部填入字段，每经过一个服务器就会该字段值就会 -1，为 0 时停止传输，最后接收到的服务器返回 200

客户端可以通过 TRACE 查询发出去的请求是如何经过一系列代理中转的。

但是该方法容易引发 XST(Cross-Site Tracing) 攻击

# WEBDAV

WebDAV是一组基于超文本传输协议的技术集合，有利于用户间协同编辑和管理存储在万维网服务器文档。

WebDAV 在标准的HTTP协议上扩展了特有的请求方式。 然后用这些请求，操作web服务器上的磁盘。

- `PROPFIND`：从 Web 资源中检索以 XML 格式存储的属性，也被重载以允许一个检索远程系统的集合结构（目录层次结构）
- `PROPPATCH`：在单个原子性动作中更改和删除资源的多个属性
- `MKCOL`：创建集合或目录
- `COPY`：将资源从一个URI复制到另一个URI
- `MOVE`：将资源从一个URI移动到另一个URI
- `LOCK`：锁定一个资源
- `UNLOCK`：解除资源的锁定

# 状态码

客户端如果遇到了无法识别的状态码，会当作该系列的第一个状态码处理，比如 555 会当作 500 来处理

## 100

请求已接收到，需要进一步处理才能完成，HTTP 1.0 不支持

- 100 Continue
  - 上传大文件前使用
  - 由客户端发起请求中携带 `Expect: 100-continue` 头部触发
- 101 Switch Protocols
  - 协议升级使用
  - 由客户端发起请求中携带 `Upgrade` 头部触发，如升级 websocket 或者 http/2.0
  - 返回该响应码表示服务器同意升级
- 102 Processing
	- WebDAV 请求可能包含许多涉及文件操作的子请求，需要很长时间才能完成请求
	- 该代码表示服务器已经收到并正在处理请求，但无响应可用
	- 这样可以防止客户端超时，并假设请求丢失

## 200

成功处理请求

- 200 OK：请求成功

- 201 Created：有新资源在服务器端被成功创建

- 202 Accepted

  - 服务器接收并开始处理请求，但请求未处理完成
  - 这样一个模糊的概念是有意如此设计，可以覆盖更多的场景。例如异步、需要长时间处理的任务

- 203 Non-Authoritative Information

	当代理服务器修改了 origin server 的原始响应包体时（例如更换了HTML中的元素值），代理服务器可以通过修改`200` 为 `203` 的方式告知客户端这一事实，方便客户端为这一行为作出相应的处理。`203` 响应可以被缓存。但是代理服务器一般不会这样做，直接返回 `200`

- 204 No Content：成功执行了请求且不携带响应包体，并暗示客户端无需更新当前的页面视图。

- 205 Reset Content：成功执行了请求且不携带响应包体，同时指明客户端需要更新当前页面视图。

- 206 Partial Content：使用 range 协议时返回部分响应内容时的响应码

- 207 Multi-Status

  - RFC4918
  - 在 WEBDAV 协议中以 XML 返回多个资源的状态
  - 每个资源也有自己的状态码，比如 200

- 208 Already Reported

	- RFC5842 
	- 为避免相同集合下资源在207响应码下重复上报，使用 `208` 可以使用父集合的响应码。

## 300

重定向使用 Location 指向的资源或者缓存中的资源。在 RFC2068中规定客户端重定向次数不应超过 5 次，以防止死循环。

- 300 Multiple Choices

  - 资源有多种表述，通过 300 返回给客户端后由其自行选择访问哪一种表述
  - 由于缺乏明确的细节，300 很少使用

- 301 Moved Permanently

  - 资源永久性的重定向到另一个 URI 中
  - 浏览器强制使用GET

- 302 Found

  - 资源临时的重定向到另一个 URI 中
  - 浏览器强制使用GET

- 303 See Other

	重定向到其他URI，客户端并且应该使用GET

- 304 Not Modified

  - 当客户端拥有可能过期的缓存时，会携带缓存的标识 `etag`、时间等信息询问服务器缓存是否仍可复用
  - 304是告诉客户端可以复用缓存

- 307 Temporary Redirect

  - 类似 302
  - 但明确重定向后请求方法必须与原请求方法相同，不得改变

- 308 Permanent Redirect

	- 类似301
	- 但明确重定向后请求方法必须与原请求方法相同，不得改变

## 400

客户端出现错误

- 400 Bad Request

  - 服务器认为客户端出现了错误，但不能明确判断为以下哪种错误时使用此错误码
  - 例如HTTP请求格式错误。浏览器会像对待200一样对待400

- 401 Unauthorized

  - 表示发送的请求需要有通过HTTP认证
  - 如果之前已经认证过一次，则表示认证失败

- 407 Proxy Authentication Required

	对需要经由代理的请求，认证信息未通过代理服务器的验证

- 403 Forbidden

	服务器理解请求的含义，但没有权限执行此请求 / 请求被拒绝

- 404 Not Found

	服务器没有找到对应的资源

- 410 Gone

	服务器没有找到对应的资源，且明确的知道该位置永久性找不到该资源

- 405 Method Not Allowed

	服务器不支持请求行中的 method 方法

- 406 Not Acceptable

	对客户端指定的资源表述不存在（例如对语言或者编码有要求），服务器返回表述列表供客户端选择。

- 408 Request Timeout

	服务器接收请求超时

- 409 Conflict

	资源冲突，例如上传文件时目标位置已经存在版本更新的资源

- 411 Length Required

	如果请求含有包体且未携带 `Content-Length` 头部，且不属于chunk 类请求时，返回 411

- 412 Precondition Failed

	复用缓存时传递的 `If-Unmodified-Since` 或 `If-None-Match` 头部不被满足

- 413 Payload Too Large/Request Entity Too Large

	请求的包体超出服务器能处理的最大长度

- 414 URI Too Long

	请求的 URI 超出服务器能接受的最大长度

- 415 Unsupported Media Type

	上传的文件类型不被服务器支持

- 416 Range Not Satisfiable

	无法提供 Range 请求中指定的那段包体

- 417 Expectation Failed

	对于 `Expect` 请求头部期待的情况无法满足时的响应码

- 421 Misdirected Request

	服务器认为这个请求不该发给它，因为它没有能力处理。

- 426 Upgrade Required

	服务器拒绝基于当前 HTTP 协议提供服务，通过 `Upgrade` 头部告知客户端必须升级协议才能继续处理。

- 428 Precondition Required

	用户请求中缺失了条件类头部，例如 `If-Match`

- 429 Too Many Requests

	客户端发送请求的速率过快，一般服务器不会返回该状态码，而是返回 503

- 431 Request Header Fields Too Large

	请求的 HEADER 头部大小超过限制

- 451 Unavailable For Legal Reasons

	RFC7725 ，由于法律原因资源不可访问

## 500

服务器端出现错误

- 500 Internal Server Error

	服务器内部错误，且不属于以下错误类型

- 501 Not Implemented

	服务器不支持实现请求所需要的功能

- 502 Bad Gateway

	代理服务器无法获取到合法响应

- 503 Service Unavailable

	服务器资源尚未准备好处理当前请求

- 504 Gateway Timeout

	代理服务器无法及时的从上游获得响应

- 505 HTTP Version Not Supported

	请求使用的 HTTP 协议版本不支持

- 507 Insufficient Storage

	服务器没有足够的空间处理请求，为了安全一般不会返回

- 508 Loop Detected

	访问资源时检测到循环

- 511 Network Authentication Required

	代理服务器发现客户端需要进行身份验证才能获得网络访问权限

# URI

- URL：Uniform Resource Locator，统一资源定位符，表示资源的位置
- URN：Uniform Resource Name
	- 期望为资源提供持久的、位置无关的标识方式
	- 例如磁力链接 `magnet:?xt=urn:sha1:YNCKHTQC5`
- URI：Uniform Resource Identifier
	- 统一资源标识符，用以区分资源
	- 是 URL 和 URN 的超集，用以取代 URL 和 URN 概念

## 组成

组成：schema, user information, host, port, path, query, fragme

![](http://oss.xiefeng.tech/img/20210801102030.png)

合法的 URI：

- `ftp://ftp.is.co.za/rfc/rfc1808.txt`
- `http://www.ietf.org/rfc/rfc2396.txt`

## 编码

URL 编码就是是把 URI 中不安全的字符转化为安全字符的过程，对于 URL 中的合法字符，编码和不编码是等价的

RFC3986 文档规定，URL 中只允许包含英文字母、数字、- _ . ~ 4个特殊字符以及所有保留字符

RFC3986 中指定了以下字符为保留字符：! * ' ( ) ; : @ & = + $ , / ? # [ ]

**保留字符**

URL 可以划分成若干个组件，协议、主机、路径等，当组件中的**普通数据**包含这些特殊字符时，需要对其进行编码

1. 一些字符（:/?#[]@）是用作分隔不同组件的

   例如：`:` 用于分隔协议和主机，`/` 用于分隔主机和路径，`?` 用于分隔路径和查询参数等

2. 一些字符（!$&'()*+,;=）用于在每个组件中起到分隔作用的

   例如：`=` 用于表示查询参数中的键值对，`&` 用于分隔查询多个键值对

**不安全字符**

有一些字符，当他们直接放在 URL 中的时候，可能会引起解析程序的歧义，这些字符被视为不安全字符，原因有很多。

- 空格：URL 在传输的过程，或者文本处理程序在处理 URL 时，都有可能引入无关紧要的空格，或者去掉了那些有意义的空格
- 引号和<>：引号和尖括号通常用于在普通文本中起到分隔 URL 的作用
- %：百分号本身用作对不安全字符进行编码时使用的特殊字符，因此本身需要编码
- ......

**编码方式**

URL 编码采用 **百分号编码**

URL 编码默认使用的字符集是 US-ASCII

百分号编码就是将字符采用 ASCII 编码的十六进制表示，再加上一个 `%`

对于非 ASCII 字符，需要使用 ASCII 字符集的超集进行编码得到相应的字节，然后对每个字节执行百分号编码

例如：`#` 在 ASCII 编码中对应的十六进制表示为 `23`，则 `#` 的百分号编码为 `%23`

# 长连接

早期 HTTP/1.0 性能上有一个很大的问题：每发起一个请求，都要新建一次 TCP 连接，而且是**串行**请求，做了无谓的 TCP 连接建立和断开，增加了通信开销。 

HTTP/1.1 提出了长连接的通信方式，即只要任意一端没有明确提出断开连接，则保持 TCP 连接状态。

HTTP/1.1 默认是长连接，当想要断开连接时只需要指定 `Connection: close`

HTTP/1.1 之前的版本默认短连接，如果想在旧版本也使用就需要指定 `Connection: Keep-alive`，服务器会返回 `Connection: keep-alive` 和 `Keep-alive: xxxx` 首部

对于陈旧的代理服务器（不认识 `Connection` 头部）需要使用 `Proxy-Connect` 头部来替代，当浏览器检测到**正向代理**时，就会这么做

![](http://oss.xiefeng.tech/img/20210402092543.jpg)

# 内容协商

- Proactive 主动式内容协商：客户端先在请求头部中提出需要的表述形式，服务器根据这些请求头部提供特定的表述

- Reactive 响应式内容协商：服务器返回 300 或者 406，由客户端选择一种表述 URI 使用

**常见的协商要素：**（请求）

- 质量因子 q：内容的质量、可接受类型的优先级，和内容通过 `;` 分隔，默认为 1

  ```http
  Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
  ```

- MIME 类型

  ```http
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
  ```

- 内容编码：主要指压缩算法

  ```http
  Accept-Encoding: gzip, deflate, br
  ```

- 表述语言

  ```http
  Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7
  ```

- 字符编码：由于 UTF-8 格式广为使用， `Accept-Charset` 已被废弃

**资源表述的元数据头部：**（响应）

- 媒体类型、编码

  ```http
  content-type: text/html; charset=utf-8
  ```

- 内容编码

  ```http
  content-encoding: gzip
  ```

- 语言

  ```http
  Content-Language: de-DE, en-CA
  ```

# 包体传输

HTTP 有两种包体传输方式：定长传输和分块传输

## 定长传输

发送 HTTP 消息时已能够确定包体的全部长度，使用 `Content-Length` 明确指明包体长度

- 使用 10 进制，而不是 16 进制，表示包体中的字节数

- 必须与实际传输的包体长度一致
- 接收端处理简单

```http
Content-Length = 1*DIGIT
```

当 `Content-Length` 指定的字节数小于包体中的数据长度，则浏览器会进行截断处理

```typescript
import { createServer } from 'http'

const server = createServer((_, res) => {
  res.setHeader('content-length', 10)
  res.write('hello world')
})

server.listen(12306)
```

当 `Content-Length` 指定的字节数大于包体中的数据长度，页面会加载失败

## 分块传输

发送 HTTP 消息时不能确定包体的全部长度，使用 `Transfer-Encoding: chunked` 指明使用 Chunk 传输方式

- 含 `Transfer-Encoding` 头部后 `Content-Length` 头部应被忽略
- 分块传输则 body 由一些分开发送的  chunked-body  组成

![](https://oss.xiefeng.tech/images/20210921152832.png)

- 每一个 chunk 都是一段数据，由 chunk 大小和数据组成
- last-chunk 指的是最后一个 chunk，其中没有数据代表的是 chunk 边界，由多个 0 组成，一般发送一个 0 即可
- trailer-part 是 chunk 传递完之后要传递的 HTTP 头部
  - 可没有该部分，如果有的话首先需要在 `Trailer` 头部声明
  - 该部分可能传递的值：分包传递的这个文件的 MD5 值

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

![](https://oss.xiefeng.tech/images/20210921152737.png)

如果在 chunk 传递完之后需要传递一些头部，则一开始就需要在 `Trailer` 字段中声明后续 trailer-part 部分要传递的头部字段名

```typescript
socket.write('HTTP/1.1 200 OK\r\n')
socket.write('Trailer: Date\r\n')
socket.write('Transfer-Encoding: chunked\r\n')
socket.write('\r\n')

socket.write('5\r\n')
socket.write('hello\r\n')

socket.write('0\r\n')

socket.write(`Date: ${new Date()}\r\n`)

socket.write('\r\n')
```

但是客户端需要在请求中添加 `TE: trailers` 表明客户端支持处理 `Trailer` 头部

  有些头部不允许在 `Trailer` 头部中传输：

  - 用于信息分帧的首部 (例如 `Transfer-Encoding` 和 `Content-Length`)
  - 用于路由用途的首部 (例如 `Host`)
  - 请求修饰首部 (例如控制类和条件类的，如 `Cache-Control`，Max-Forwards，或者 `TE`)
  - 身份验证首部 (例如 `Authorization` 或者 `Set-Cookie`)
  - `Content-Encoding`、`Content-Type`、 `Content-Range`，以及 `Trailer` 自身

https://imququ.com/post/transfer-encoding-header-in-http.html

  `Content-Disposition` 头部：

  - `inline`：指定包体是以 `inline` 内联的方式，作为页面的一部分展示
  
  - `attachment`：指定浏览器将包体以附件的方式下载
  
    例如：`Content-Disposition: attachment; filename=“filename.jpg”`
  
  - 在 multipart/form-data 类型应答中，可以用于子消息体部分
  
    例如：`Content-Disposition: form-data; name="fieldName"; filename="filename.jpg"`

# 表单提交

POST 方式下对表单内容在请求包体中的编码方式有两种，并通过 `enctype` 属性控制

1. `application/x-www-form-urlencoded`

	数据被编码成以 ‘&’ 分隔的键值对, 同时以 ‘=’ 分隔键和值，字符以 URL 编码方式编码

2. `multipart/form-data`

	在这种方式下，每个 input 的内容都是一个资源表述，前一种方式所有的 input 内容是一个资源表述

	格式特点：1. boundary 分隔符   2. 每部分表述皆有HTTP头部描述子包体，例如 Content-Type   3. last boundary 结尾

	`Content-type: multipart/form-data` 

![](http://oss.xiefeng.tech/img/20210403083002.png)

# Range请求

HTTP 允许服务器基于客户端的请求只发送响应包体的一部分，而客户端自动将多个片断的包体组合成完整的体积更大的包体

- 支持断点续传
- 支持多线程下载
- 支持视频播放器实时拖动

服务器通过 `Accept-Range` 头部表示是否支持 Range 请求：

- `Accept-Ranges: bytes` 表示支持
- `Accept-Ranges: none` 表示不支持

## 请求范围

客户端使用 `Range` 头部传递请求范围：

- `Range: bytes=0-499`：前 500 字节
- `Range: bytes=500-600,601-999`：多个范围
- `Range: bytes=-500`：最后 500 字节
- `Range: bytes = 9500-`：从当前到结尾

## 服务器响应

响应首部 `Content-Range` 显示的是一个数据片段在整个文件中的位置

```http
Content-Range: <unit> <range-start>-<range-end>/<size>
Content-Range: <unit> <range-start>-<range-end>/*
Content-Range: <unit> */<size>
```

- `unit`：数据区间所采用的单位，通常是 byte
- `range-start`：表示在给定单位下区间的起始值
- `range-end`：表示在给定单位下，区间的结束值
- `size`：整个文件的大小，如果大小未知则用 `*` 表示

### 单一范围

1. 服务器支持 range 请求并且请求范围正确，服务器返回 `206 Partial Content` + `Content-Range`

  ![](https://oss.xiefeng.tech/images/20210922113300.png)

2. 请求范围不满足实际资源的大小，服务器返回 `416 Range Not Satisfiable`  +  `Content-Range: bytes */1234`

  ![](https://oss.xiefeng.tech/images/20210922113443.png)

3. 服务器不支持 `Range` 请求时，服务器以 200 返回完整的响应包体

### 多重范围

当客户端请求多个范围时：

```shell
curl https://xiefeng.tech -i -H "Range: bytes=0-50, 100-150"
```

1. 服务器返回 206 Partial Content 状态码
2. 具有头部：`Content-Type：multipart/byteranges; boundary=xxxxxxxx`
3. `Content-Type：multipart/byteranges` 表示这个响应有多个 byterange，并且它们之间使用 boundary 分隔
4. 每一部分 byterange 都有他自己的 `Centen-type` 头部和 `Content-Range`

![](https://oss.xiefeng.tech/images/20210922113006.png)

## 条件Range

如果客户端已经得到了 Range 响应的一部分，并想在这部分响应未过期的情况下，获取其他部分的响应

则需要将 Range 和 If-Unmodified-Since 或者 If-Match 头部共同使用

可以使用 `If-Range = entity-tag / HTTP-date`，其值可以为 Etag 或者 Last-Modified

```http
GET /index.html HTTP/1.1
If-Range: "123456"
Range: bytes=5001-10000
```

它告知服务器若该字段的值（`ETage` 值 / 时间）和请求资源的 `ETage` 值 / 时间一致时，则作为范围请求处理，否则返回全体资源

# Cookie

Cookie 是保存在客户端、由浏览器维护、表示应用状态的 HTTP 头部

服务器通过响应中添加 `Set-Cookie` 来种 Cookie，客户端通过 `Cookie` 字段携带本地存储的 Cookie

`Set-Cookie` 头部一次只能传递 1 个 name/value 名值对，但是响应中可以含多个 `Set-Cookie` 头部

**Cookie 字段**

- `Name=value`：Cookie 的名和值
- `expires`：设置 cookie 的过期时间，如果没有设置则当前会话结束就过期
- `max-age`：cookie 经过多少秒后失效，`max-age` 优先级高于 `expires` 且不能为0，http1.1 出现
- `path`：可以访问此 cookie 的页面路径，子路径也能访问
- `domain`：可以访问此 cookie 的域名
  - 顶级域名只能设置 domain 为顶级域名
  - 二级域名能读取设置了 domain 为顶级域名或者自身的 cookie
  - 将设置 domain 为顶级域名， cookie 可以在多个二级域名中共享
- `Secure`：只有使用 TLS/SSL 协议（https）时才能使用该 cookie
- `HttpOnly`：不能通过 JavaScript 访问到该 cookie
- `SameSite`： 允许服务器要求某个 cookie 在跨站请求时不会被发送，用于阻止 CSRF 攻击
  - None：浏览器会在同站请求、跨站请求下继续发送 cookies
  - Strict：浏览器将只在访问相同站点时发送 cookie
  - Lax：与 Strict 类似，但用e户从外部站点导航至URL时（例如通过链接）除外

**第三方Cookie** 

浏览器允许对于其他域下的资源（如广告图片）响应中的 `Set-Cookie` 保存，并在后续访问该域时自动使用 Cookie

# 条件请求

- `If-Match`

	- 服务器会比对该字段值和资源的 `ETage` 值是否一致
	- 一致则会执行请求
	- 不一致则返回 412
	
- `If-Modified-Since`

	- 如果在该字段的日期之后资源没有更新，服务器返回 304
	- 否则返回 200 + `Last-Modified`
	
- `If-None-Match`

	- 和 `If-Match` 相反，当和 `ETag` 值不一致时处理请求

- `If-Unmodified-Since`

	- 和 `If-Unmodified-Since` 相反，如果发生了更新返回 412，没更新处理请求

- `If-Range`

	- 它告知服务器若该字段的值和请求资源的 `ETage` 值 / 时间一致时，则作为范围请求处理，否则返回全体资源

ETag：资源的实体标识，服务器会为每一份资源分配对应的 `ETag` 值，资源更新时，`ETag` 也需要更新

- 强 `ETag`：不论实体发生多么细微的变化该值都会变化，如：`ETag: "usagi-1234"` 

- 弱 `ETag`：只有资源发生了根本的改变，才会改变该值，会在字段开始添加 `W/` 如： `ETag: W/"usagi-1234"` 

# 请求上下文

- `User-Agent` 头部：指明客户端的类型信息，服务器可以据此对资源的表述做抉择

	```http
	User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36
	```

- `Referer` 头部：浏览器对来自某一页面的请求自动添加的头部

	- `Referer` 不会被添加的场景
		- 来源页面采用的协议为表示本地文件的 "`file`" 或者 "`data`" URI
		- 当前请求页面采用的是 `http` 协议，而来源页面采用的是 `https` 协议

- `From` 头部：主要用于网络爬虫，告诉服务器如何通过邮件联系到爬虫的负责人

- `Server` 头部：指明服务器上所用软件的信息，用于帮助客户端定位问题或者统计数据

- `Allow` 头部：告诉客户端，服务器上该 URI 对应的资源允许哪些方法的执行

# 缓存控制

- `Cache-Control`

	- **请求**

		- `no-cache`

			告诉服务器，不能直接使用已有缓存作为响应返回，除非带着缓存条件到上游服务端得到 304 验证返回码才可使用现有缓存

		- `no-store` 

			告诉各代理服务器不要对该请求的响应缓存（实际有不少不遵守该规定的代理服务器）

		- `max-age`

			告诉服务器，客户端不会接受时间超出 `max-age` 的缓存

		- `min-fresh`

			要求服务器返回至少还未超过指定时间的缓存资源（在指定时间内没有过期的缓存可以返回）

			告诉服务器，`Age` 至少经过 `min-fresh` 秒后缓存才可使用

		- `max-stale`

			接收缓存即使过期，没指定数值怎样都会接收缓存；如果指定数值，即使过期，只要没有超过指定的时间都可以接收

		- `no-transform`

			告诉代理服务器不要修改消息包体的内容

		- `only-if-cached`

			告诉服务器仅能返回缓存的响应，若没有缓存则返回 504 错误码

	- **响应**

		- `public`、`private`

			`public`：表示无论私有缓存或者共享缓存，皆可将该响应缓存

			`private`：表示该响应不能被代理服务器作为共享缓存使用。若 `private` 后指定头部，则在告诉代理服务器不能缓存指定的头部，但可缓存其他部分

		- `no-cache`

			告诉客户端不能直接使用缓存的响应，使用前必须在源服务器验证得到 304 返回码。如果 `no-cache` 后指定头部，则若客户端的后续请求及响应中不含有这些头则可直接使用缓存

		- `no-store`

			告诉所有下游节点不能对响应进行缓存

		- `max-age`

			告诉客户端缓存时间超出 `max-age` 秒后则缓存过期

		- `s-maxage`

			与 `max-age` 相似，但仅针对共享缓存，且优先级高于 `max-age` 和 `Expires`，告诉缓存最多缓存多久

		- `no-transform`

			告诉代理服务器不能修改消息包体的内容

		- `must-revalidate`

			告诉**客户端**一旦缓存过期，必须向服务器验证后才可使用

		- `proxy-revalidate` 

			与 `must-revalidate` 类似，但它仅对**代理服务器**的共享缓存有效

- `Age`

	表示自源服务器发出响应（或者验证过期缓存），到使用缓存的响应发出时经过的秒数

- `Pragma`

	是 HTTP/1.1 之前版本的历史遗留字段，仅作为与 HTTP/1.0 的向后兼容而定义

	```http
	Cache-Control: no-cache
	Pragma: no-cache
	```

- `Vary`

	服务器告诉缓存服务器/客户端，只有请求持有和 该头部指定的值相同且头部的相同 才可以响应缓存

	```http
	// 浏览器 -> 代理
	GET /sample.html
	Accept-Language: en-us
	
	// 代理 -> 源服务器
	GET /sample.html
	Accept-Language: en-us
	
	// 源 -> 代理
	Vary: Accept-Language
	```

- `Expires`

	资源失效的日期

- `Warning`

	HTTP/1.1 的 warning 首部是从 HTTP/1.0 的响应头部（Retry-After）演变过来的，通常会告知用户一些和缓存相关的问题的警告

	```http
	Warning: [警告码] [警告的主机:端口号] "[警告内容]"([日期时间])
	```


# 消息的转发

- `Via`

	使用该字段用于追踪客户端和服务器之间的请求和响应报文的传输路径，报文经过代理或网关时，会现在首部字段 `Via` 中附加该服务器的信息，然后再进行转发。

	`Via` 首部是为了追踪传输路径，所以经常和 `TRACE` 方法一起使用。代理服务器接收到请求并且 `Max-Forward: 0`，服务器则会加上自身的信息后返回响应

- `Max-Forwards`

	限制 Proxy 代理服务器的最大转发次数，仅对 `TRACE` / `OPTIONS` 方法有效

- 传递 IP 地址

	- `X-Forwarded-For` 传递代理服务器的地址
	- `X-Real-IP`  传递真正请求的地址

	```http
	X-Forwarded-For: 115.204.33.1, 1.1.1.1
	X-Real-IP: 115.204.33.1
	```

# 重定向

`Location` 可以将响应接收方引导至某个与请求URI位置不同的资源，和 3xx 配合，提供重定向的 URI

流程：当浏览器接收到重定向响应码时，需要读取响应头部 Location 头部的值，获取到新的 URI 再跳转访问该页面

1. 永久重定向，表示资源永久性变更到新的 URI
	- 301（HTTP/1.0）：重定向请求通常（一些浏览器会把 POST 改为GET）会使用 GET 方法，而不管原请求究竟采用的是什么方法
	- 308（HTTP/1.1）：重定向请求必须使用原请求的方法和包体发起访问
2. 临时重定向，表示资源只是临时的变更 URI
	- 302 （HTTP/1.0）：重定向请求通常会使用 GET 方法，而不管原请求究竟采用的是什么方法
	- 303 （HTTP/1.1）：它并不表示资源变迁，而是用新 URI 的响应表述而为原请求服务，重定向请求会使用 GET 方法
		- 例如表单提交后向用户返回新内容（亦可防止重复提交）
	- 307 （HTTP/1.1）：重定向请求必须使用原请求的方法和包体发起访问
3. 特殊重定向
	- 300：响应式内容协商中，告知客户端有多种资源表述，要求客户端选择一种自认为合适的表述
	- 304：服务器端验证过期缓存有效后，要求客户端使用该缓存

# Upgrade

用于检测 HTTP 协议及其它协议是否可以使用更高的版本进行通信，其参数可以用来指定一个完全不同的通信协议，对于 `Upgrade` 请求，服务器可返回 101

```http
GET /index.html HTTP/1.1
Upgrade: TLS/1.0
Connection: Upgrade
```

```http
HTTP/1.1 101 Switching Protocols
Upgrade: TLS/1.0, HTTP/1.1
Connection: Upgrade
```
