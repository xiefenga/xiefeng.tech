# 协议升级

## URI 格式

- ws://host:port/path/query
- wss://host:port/path/query

## 提供的信息

- 握手随机数：Sec-WebSocket-Key
- 选择子协议：Sec-WebSocket-Protocol，可选
- 扩展协议：Sec-WebSocket-Extensions，可选
- CORS跨域：Orign，可选

## 建立握手

协议升级必须是 GET 请求，必须基于 HTTP/1.1，必须传输随机握手数 `Sec-WebSocket-Key`

```http
GET /?encoding=text HTTP/1.1
Host: websocket.taohui.tech
Accept-Encoding: gzip, deflate
Sec-WebSocket-Version: 13
Origin: http://www.websocket.org
Sec-WebSocket-Extensions: permessage-deflate
Sec-WebSocket-Key: c3SkgVxVCDhVCp69PJFf3A==
Connection: keep-alive, Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
```

升级成功返回 101 状态码，`Sec-WebSocket-Accept` 头部是必须的，证明握手被服务器接受。

```http
HTTP/1.1 101 Web Socket Protocol Handshake
Server: openresty/1.13.6.2
Date: Mon, 10 Dec 2018 08:14:29 GMT
Connection: upgrade
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Headers: authorization
Access-Control-Allow-Headers: x-websocket-extensions
Access-Control-Allow-Headers: x-websocket-version
Access-Control-Allow-Headers: x-websocket-protocol
Access-Control-Allow-Origin: http://www.websocket.org
Sec-WebSocket-Accept: yA9O5xGLp8SbwCV//OepMPw7pEI=
Upgrade: websocket
```

`Sec-WebSocket-Accept` 值构造规则：

1. 将请求的 `Sec-WebSocket-Key` 拼接上GUID：`258EAFA5-E914-47DA-95CA-C5AB0DC85B11`
2. SHA1(Sec-WebSocket-Key + GUID)
3. BASE64(SHA1(Sec-WebSocket-Key + GUID))

# 数据帧

WebSocket客户端、服务端通信的最小单位是帧，1 条消息由 1 个或者多个帧组成，这些数据帧属于同一类型

每一帧要么承载字符数据，要么承载二进制数据

## 帧格式

![](http://oss.xiefeng.tech/img/20210404220400.png)

`FIN`：如果是1，表示这是消息的最后一个分片），如果是0，表示不是是消息的最后一个分片

RSV1/RSV2/RSV3：默认为 0，仅当使用 extension 扩展时，由扩展决定其值

`Mask`：表示是否要对数据载荷进行掩码操作

`Opcode` 代表了帧的类型：

- 持续帧
  - 0 帧的类型和前一帧相同
- 非控制帧

	- 1：文本帧（UTF8）

	- 2：二进制帧

	- 3-7：为非控制帧保留
- 控制帧
	- 8：关闭帧
	- 9：心跳帧 ping
	- A：心跳帧 pong
	- B-F：为控制帧保留

`Payload length` 表示消息内容的长度：

- <= 125 字节，仅使用 `Payload len`
- 126 至 $2^{16}-1$ 字节，`Payload len` 值为 126，`Extended payload length` 16位表示长度
- $2^{16}$ 至 $2^{64}-1$字节，`Payload len` 值为 127，`Extended payload length` 共 8 字节 64 位表示长度

Payload data：载荷数据，包括了扩展数据、应用数据

## 数据分片

当 WebSocket 的接收方收到一个数据帧时，会根据 `FIN` 的值来判断，是否已经收到消息的最后一个数据帧。

- FIN=1表示当前数据帧为消息的最后一个数据帧，此时接收方已经收到完整的消息，可以对消息进行处理。

- FIN=0，则接收方还需要继续监听接收其余的数据帧。

![](http://oss.xiefeng.tech/img/20210404223607.png)

`opcode` 在数据交换的场景下，表示的是数据的类型：

- `0x01`表示文本
- `0x02`表示二进制
- `0x00` 表示延续帧，就是完整消息对应的数据帧还没接收完，帧的类型（文本/二进制）和前一个帧相同

## 掩码

从客户端向服务端发送数据时，需要对数据进行掩码操作；从服务端向客户端发送数据时，不需要对数据进行掩码操作。

如果服务端接收到的数据没有进行过掩码操作，服务端需要断开连接。

简单来说：

- 客户端发出的消息：MASK 为 1（包括控制帧），传递 32 位无法预测的、随机的 Masking-key
- 服务器端发出的消息：MASK 为 0

**作用**：防止代理缓存污染攻击，恶意页面上的代码可以构造出合法的 GET 请求，使得代理服务器可以识别出请求并缓存响应

![](http://oss.xiefeng.tech/img/20210405094233.png)

## 心跳帧

WebSocket为了保持客户端、服务端的实时双向通信，需要确保客户端、服务端之间的TCP通道保持连接没有断开。

对于长时间没有数据往来的连接，采用心跳帧来检测连接是否断开。

- 心跳帧可以插在数据帧中传输
- ping 帧，opcode=9，可以含有数据
- pong 帧，opcode=A，必须与 ping 帧数据相同

- 发送方->接收方：ping
- 接收方->发送方：pong

## 关闭帧

关闭会话的方式：

1. 通过关闭帧双向关闭
2. TCP 连接意外中断

关闭帧格式：

- opcode=8
- 可以含有数据，但仅用于解释关闭会话的原因
- 遵循 mask 掩码规则

## 消息传递

- WebSocket 会话处于 OPEN 状态
- 以帧来承载消息，一条消息可以拆分多个数据帧
- 客户端发送的帧必须基于掩码编码
- 一旦发送或者接收到关闭帧，连接处于 CLOSING 状态
- 一旦发送了关闭帧，且接收到关闭帧，连接处于 CLOSED 状态
- TCP 连接关闭后，WebSocket 连接才完全被关闭

