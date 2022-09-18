## 概述

`MutationObserver` 接口可以在 DOM 被修改时异步执行回调。

可以观察整个文档、DOM 树的一部分或某个元素，还可以观察元素属性、子节点、文本，或者前三者任意组合的变化。

## 使用

通过 `MutationObserver` 构造函数，传入回调函数创建实例。

```js
const observer = new MutationObserver(() => console.log('<body> attributes changed'));
```

新创建的 MutationObserver 实例不会关联 DOM 的任何部分。使用 `observe()` 方法将观察者和 DOM 关联起来。

该方法第一个参数为要观察的 DOM，第二个参数为一个 MutationObserverInit 对象。

```javascript
observer.observe(document.body, { attributes: true });
```

当  `body` 元素上任何属性发送变化都会异步执行注册的回调函数。

## 查看变化

每个回调都会收到一个 MutationRecord 实例的数组

MutationRecord 实例包含的信息包括发生了什么变化，以及 DOM 的哪一部分受到了影响。

因为回调执行之前可能同时发生多个满足观察条件 的事件，所以每次执行回调都会传入一个按顺序入队的 MutationRecord 实例数组。

```javascript
const observer = new MutationObserver(mutationRecords => console.log(mutationRecords));
observer.observe(document.body, { attributes: true });
document.body.setAttribute('foo', 'bar'); 
document.body.setAttribute('aa', 'bb');
```

![](http://oss.xiefeng.tech/img/20210329201518.png)

传给回调函数的第二个参数是观察变化的 MutationObserver 的实例。

## MutationRecord

通过 MutationRecord 实例可以分析出 DOM 是怎么变化的。

实例具有的属性：

- `target`：被修改影响的目标节点
- `type`：表示变化的类型：`"attributes"`、`"characterData"` 或 `"childList"`
- `oldValue`
- `attributeName`：对于 `attributes` 类型的变化，这里保存被修改属性的名字
- `attributeNamespace`：对于使用了命名空间的 `attributes` 类型的变化，这里保存被修改属性的名字
- `addedNodes`：对于 `childList` 类型的变化，返回包含变化中添加节点的 NodeList
- `removedNodes`：对于 `childList` 类型的变化，返回包含变化中删除节点的 NodeList
- `previousSibling`：对于 `childList` 类型的变化，返回变化节点的前一个同胞 Node
- `nextSibling`：对于 `childList` 类型的变化，返回变化节点的后一个同胞 Node

## 取消观察

默认情况下，只要被观察的元素不被垃圾回收，MutationObserver 的回调就会响应 DOM 变化事件，从而被执行。

要提前终止执行回调，可以调用 `disconnect()` 方法。

调用 `disconnect()` 之后，不仅会停止此后变化事件的回调，也会抛弃已经加入任务队列要异步执行的回调。

## 复用

多次调用 `observe()` 方法，可以复用一个 MutationObserver 对象观察多个不同的目标节点。

此 时，MutationRecord 的 `target` 属性可以标识发生变化事件的目标节点。

```javascript
const observer = new MutationObserver(
    mutationRecords => console.log(
        mutationRecords.map(
            x => x.target
        )
    )
);

const childA = document.createElement('div');
const childB = document.createElement('span');

document.body.appendChild(childA);
document.body.appendChild(childB);

// 观察两个子节点
observer.observe(childA, { attributes: true });
observer.observe(childB, { attributes: true });
// 修改两个子节点的属性
childA.setAttribute('foo', 'bar');
childB.setAttribute('foo', 'bar');
// [<div>, <span>]
```

`disconnect()` 方法是一个“一刀切”的方案，调用它会停止观察所有目标。

## 重用

调用 `disconnect()` 并不会结束 MutationObserver 的生命。还可以重新使用这个观察者，再将它关联到新的目标节点。





