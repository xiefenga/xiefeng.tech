---
title: TLS总结
date: 2021-09-26 11:19:26
tags: http/https
categories:	[计算机基础, 计算机网络]
cover: https://oss.xiefeng.tech/images/20210926112430.jpeg
description:
---

# 数字证书

无论是对称加密还是非对称加密，甚至是对称加密和非对称加密组合，都存在中间人攻击

这是因为无法保证接收到的秘钥是可信的，为了实现安全传输，服务器就需要能够证明自己的身份，使得公钥可信

所以就需要借助第三方权威机构 CA （数字证书认证机构），服务器需要向 CA 申请证书，只要证书是可信的，公钥就是可信的。

## 申请证书

1. 在申请证书时，需要提供一些网站的基础信息以及最重要的**服务器**的**公钥**
2. CA 会将通过审核的信息使用 Hash 算法将这些数据生成**信息摘要**
3. 接着将信息摘要通过 CA 机构自己的**私钥**进行加密生成**数字签名**
4. 最后将数字证书和网站所提供的的信息组装成一个数字签名颁发给网站

![](https://static001.geekbang.org/resource/image/f5/a6/f569c80f8f4b25b3bf384037813cdca6.png)

## 验证证书

在客户端和服务器建立 HTTPS 连接的过程中，首先会向服务器请求数字证书进行验证。

会验证证书的有效期、证书是否被 CA 吊销、证书是否由合法 CA 机构颁发，当然重点就是验证证书的合法性。

验证证书的过程和加密 CA 生成证书的过程类似：

1. 客户端利用证书中网站的信息（公钥 + 基础信息）计算出**信息摘要**
2. 利用 CA 的公钥来解密证书中的**数字签名**，得到原始的信息摘要
3. 通过判断这两个信息摘要是否相同来判断该证书是否合法

![](http://oss.xiefeng.tech/img/20210407225017.png)

## 证书链

颁发证书的机构通常被划分为两种类型：根 CA 和中间 CA 。

通常我们都是向中间 CA 去申请证书，而根 CA 主要就是给中间 CA 做认证，证明这个 CA 机构合法可以颁发合法的证书

一个根 CA 往往会认证很多中间的 CA，而中间 CA 又可以去认证其他的中间 CA，所以在验证一个证书是否合法时，也需要验证其 CA 机构的合法性，就像验证服务器的证书一样，这样一来就形成了一个证书链。

![](https://oss.xiefeng.tech/images/20210924100930.png)

CA 之间的认证也是通过证书，就像服务器的证书那样，所以客户端真正验证的时候，会从服务器的证书开始层层验证直到根证书

所以我们部署的时候不仅需要服务器的证书，还需要证名 CA 机构合法性，通常我们都是部署一个证书链

![](https://oss.xiefeng.tech/images/20210924093401.png)

对于根证书的验证十分简单，客户端只需要简单地判断这个根证书在不在操作系统里面，内置在操作系统则是合法的。

如果某个机构想要成为根 CA，并让它的根证书内置到操作系统中，那么这个机构首先要通过 WebTrust 国际安全审计认证。

WebTrust 是由两大著名注册会计师协会 AICPA 和 CICA 共同制定的安全审计标准，主要对互联网服务商的系统及业务运作逻辑安全性、保密性等共计七项内容进行近乎严苛的审查和鉴证。

# 密钥交换

## RSA 密钥交换

在验证完服务器身份之后通过客户端生成对称加密的密钥来进行加密通信

![](https://oss.xiefeng.tech/images/20210924102305.png)

但是这种方式存在一个问题，没有向前保密性。

所谓的向前保密性，就是如果有人将一些报文存储起来，等得到 CA 服务器的私钥之后（这是有可能的），就可以破解这些信息了。

## DH 密钥交换

>1976 年由 Bailey Whitfield Diffie 和 Martin Edward Hellman 首次发表，故称为 Diffie–Hellman key exchange，简称 DH

它可以让双方在完全没有对方任何预先信息的条件下通过不安全信道创建起一个密钥。

![](http://oss.xiefeng.tech/img/20210407225648.png)

DH 密钥交换的思路：

1. 客户端选定两个数 p 和 g，以及选择一个秘密数 a，并通过 $g^a \mod p$  算出 A
2. 将 p、g、A 发送给服务器
3. 服务器选择一个秘密数 b，并通过 $g^b \mod p$ 算出 B，并发送给客户端
4. 服务器和客户端分别使用 A 和 B 通过 $A^b \mod p$ ，$B^a \mod p$  生成相同的密钥

## ECDH 密钥交换

是 DH 密钥交换协议使用椭圆曲线后的变种，优点是比 DH 计算速度快、同等安全条件下密钥更短

全称为 Elliptic Curve Diffie–Hellman key Exchange，简称 ECDH，也称 ECDHE

ECC：椭圆曲线密码学，全称 Elliptic Curve Cryptography

### ECC 椭圆曲线

椭圆曲线的表达式：$y^2 = x^3 + ax + b$，$4a^3 + 27b^2 \neq 0$

图像始终关于 x 轴对称：

![](https://oss.xiefeng.tech/images/20210924110854.png)

#### 特性

ECC 曲线的特性：P + Q = R

- `+` 运算的几何意义：R 为 P、Q 连续与曲线交点在 X 轴上的镜像

- P、Q、R 都是曲线上的点
- 当 P 和 Q 为同一点时，就是 P + P = R，P.2 = R
- 满足交换律和结合率
	- a + b = b + a
	- (a + b) + c = a + (b + c)

![](https://oss.xiefeng.tech/images/20210924111632.png)

#### 关键原理

Q = K.P，就是多个 P 点相加。

![](http://oss.xiefeng.tech/img/20210408095444.png)

特点：

- 已知 K 与 P，正向运算快速
- 已知 Q 与 P，计算 K 的逆向运算非常困难

### ECDH 协议

1. Alice 选定大整数 Ka 作为私钥，并基于选定曲线及曲线上的共享 P 点计算出 Qa = Ka.P
3. Alice 将 Qa、选定曲线、共享 P 点传递点 Bob
4. Bob 选定大整数 Kb 作为私钥，将计算了 Qb = Kb.P，并将 Qb 传递给 Alice
5. Alice 生成密钥 Qb.Ka = (X, Y)，其中 X 为对称加密的密钥
6. Bob 生成密钥 Qa.Kb = (X, Y)，其中 X 为对称加密的密钥

即：Qb.Ka = Ka.(Kb.P) = Ka.Kb.P = Kb. (Ka.P) = Qa.Kb

其中 Q 分别为服务器和客户端生成的公钥，K 则是它们分别生成的私钥

Alice 对应的是服务器，Bob 对应的是客户端

# TLS

SSL 即安全套接层（Secure Sockets Layer），TLS 即传输层安全，Transport Layer Security

SSL/TLS 处于 OSI 七层模型中的会话层

TLS/SSL 发展历程：

1. 1996 年，SSL3.0 问世，得到大规模应用（已于 2015 年弃用）
2. 1999 年，SSL3.1 被标准化，更新为 TLS1.0
3. 2008 年发布 TLS1.2
4. 2018 年发布 TLS1.3

## 密码套件

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f41065f4cfad4f15ab5035b01a008701~tplv-k3u1fbpfcp-watermark.awebp)

- 握手过程中，使用 `ECDHE` 秘钥交换协议
- 身份(证书签名)验证时的非对加解密使用 `RSA` 算法
- 后续加密数据时对称加密的算法、强度、工作模式
- 数据完整性校验的哈希摘要算法采用 `SHA256` 算法

## TLS1.2 通讯过程

1. ClientHello：在这一步，客户端主要向服务器发送客户端支持的**安全套件列表**
2. ServerHello：服务器从客户端支持的安全套件列表中选择一个
3. Server Certificates：服务器将自己的数字证书发送给客户端进行验证
4. ServerKeyExhange：服务器选中的椭圆曲线（固定的椭圆曲线 P 点是确定的），以及生成的公钥
5. ClientKeyExhange：验证完服务器的证书之后，会根据服务器选择的椭圆曲线生成客户端的公钥
6. 此时客户端和服务器都可以根据椭圆曲线以及两个公钥生成相同的会话秘钥

![](http://oss.xiefeng.tech/img/20210407232116.png)

## TLSv1.3

TLS 握手的目的就是生成**会话密钥**，TLS1.2 中握手存在 2 个 RTT，TLS1.3 进行了优化。

TLS1.3 只有5种加密套件，因为 TLS1.2 的加密套件比较多存在 FREAK 攻击。

TLS1.3 握手过程中，客户端在通信开始就生成自己的公钥和私钥，由于此时服务器和客户端并没有协商使用什么安全套件，客户端会生成所有加密套件所对应的公钥和私钥，然后将公钥和加密套件一起发送给服务器。

这样一来服务器就可以直接完成加密套件的选择和最终秘钥的生成，使得握手阶段只有一个 RTT。

![](http://oss.xiefeng.tech/img/20210408110438.png)

## 握手优化

由于 TLS 存在握手阶段，会引入多余的 RTT，所以需要尽可能的减少握手次数

### session缓存

类似于解决 HTTP 无状态的 session，服务器在首次握手过程中会生成一个 sessionID，并发送给客户端进行保存

在一定时间内客户端在 ClientHello 阶段顺带上这个 sessionID，服务器收到之后会检查 session 是否有效

如果有效则回复客户端就是用上次的秘钥吧

![](https://oss.xiefeng.tech/images/20210924151355.png)

### ticket票据

session 缓存存在两个问题：

1. 存储 sessionID 会占用服务器的资源
2. 一般大型站点都是服务器集群，sessionID 一般存在内存中无法共享

将 session 加密生成 session ticket 并发送给客户端，后续服务器收到该 ticket 进行解密就可以得出 session

![](https://oss.xiefeng.tech/images/20210924152826.png) 

### TLS1.3的0-RTT

在 TLS1.3 的后续握手过程中，利用 session 或者 ticket 优化，可以实现 0 RTT

服务器收到 ClientHello 之后，验证完 session 之后就可以直接响应

![](https://oss.xiefeng.tech/images/20210924153111.png)

## 重放攻击

握手优化的这些措施都存在着重放攻击，所谓重放攻击就是中间人保存客户端和服务器之间的 POST 请求，一般 POST 请求是会更改数据库的，中间人不需要破解只需要向服务器一直发送缓存的报文就可以改变数据库中的数据。

![](http://oss.xiefeng.tech/img/20210408111937.png)
