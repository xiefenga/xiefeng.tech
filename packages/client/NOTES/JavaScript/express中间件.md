# 中间件

中间件函数能够访问请求对象 (`req`)、响应对象 (`res`) 以及应用程序的请求/响应循环中的下一个中间件函数。下一个中间件函数通常由名为 `next` 的变量来表示。简单来说就是请求的回调函数，该函数最多有四个参数，并且该函数可以有多个，可以接力处理。

```js
const express = require('express');

const app = express();

app.get(
    '/',
    (req, res, next) => {
        console.log('第一个中间件函数');
        next();
    },
    (req, res, next) => {
        console.log('第二个中间件函数');
        next();
    },
    (req, res, next) => {
        console.log('最后一个中间件');
        res.send('hello world');
    }
);

app.listen(12306, () => console.log('serve is running on 12306'));
```

# 中间件处理的细节

1. 后续没有中间件但是调用了 `next()`，如果前面的中间件已经响应没事否则express 会返回 404

```js
app.get(
    '/',
    (req, res, next) => {
        console.log('第一个中间件函数');
        next();
    },
    (req, res, next) => {
        console.log('第一个中间件函数');
        next();
    },
    (req, res, next) => {
        console.log('最后一个中间件');
        next();
    }
);
```

2. 调用 `next()` 的时候传参，那么参数就是下一个中间件的错误参数（参数的类型未必是 error）

```js
app.get(
    '/',
    (req, res, next) => {
        console.log('didi');
        next('dada');
    },
    (err, req, res, next) => {
        console.log(err);
        res.end('hello world');
    }
);
```

如果后续(不一定紧挨着)不接收该参数，也就是不处理该错误，express 会给客户端返回 500，并在控制台输出该错误参数

3. 如果中间件发生了错误，和调用 `next(error)` 一样

```js
app.get(
    '/',
    (req, res, next) => {
        console.log('didi');
       throw new Error('dada');
        next();
    },
    (err, req, res, next) => {
        console.log(err);
        res.end('hello world');
    }
);
```

