# Reflect

> `Reflect` 是一个内置的JS对象，它提供了一系列方法，可以让开发者通过调用这些方法，访问一些JS底层功能

**提供的API：**

- `Reflect.set(target, propertyKey, value)` 

  设置对象 `target` 的属性 `propertyKey` 的值为 `value`，等同于给对象的属性赋值

- `Reflect.get(target, propertyKey)` 

  读取对象 `target` 的属性 `propertyKey`，等同于读取对象的属性值

- `Reflect.apply(target, thisArgument, argumentsList)`

  调用一个指定的函数，并绑定 `this` 和参数列表。等同于函数调用

- `Reflect.deleteProperty(target, propertyKey)`

  删除一个对象的属性，等同于 `delete` 

- `Reflect.defineProperty(target, propertyKey, attributes)`

  类似于 `Object.defineProperty`，不同的是如果配置出现问题，返回 `false` 而不是报错

- `Reflect.construct(target, argumentsList)`

  用构造函数的方式创建一个对象，等同于 `new`

- `Reflect.has(target, propertyKey)` 

  判断一个对象是否拥有一个属性，等同于 `in` 

其他API：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

# Proxy

> `Proxy` 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）

```js
const p = new Proxy(target, handler)
```

`handler` 对象是一个容纳一批特定属性的占位符对象。它包含有 `Proxy` 的各个捕获器，捕获器和 `Reflect` 静态方法保持一致

```js
const obj = {a: 1, b: 2};
const p = new Proxy(obj, {
    set(target, property, value) {
        console.log('赋值了')
        Reflect.set(target, property, value);
    },
    deleteProperty(target, property) {
        console.log('我不让你删除');
        return false;
    }
});
```

