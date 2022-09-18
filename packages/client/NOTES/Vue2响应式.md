## Observer

让一个对象变成响应式数据只需要调用 `observe` 方法即可，当然了只有 `object` 类型的数据可以实现响应式

该方法的核心逻辑十分简单：

```typescript
function observe (value: any): Observer | void {
  if (!isObject(value)) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (Array.isArray(value) || isPlainObject(value)) {
    ob = new Observer(value)
  }
  return ob
}
```

从 observe 方法可以看出来 vue2 只支持数组和普通对象的响应式，所以 `Set` 和 `Map` 在 vue2 中是没有响应式的

observe 方法中 `Observer` 类的作用就是关联每一个需要被观察的对象，并劫持其所有属性的 `getter` 和 `setter`

![](https://oss.xiefeng.tech/images/20210928091028.png)

vue2 中响应式的特点：

1. 数组中为原始值的项不具有响应式，但是一些原型方法是具有响应式的
2. 对象中所有的属性都具有响应式，但是新增的属性缺少响应式

实现响应式需要 `new` 一个 `Observer` 的实例，所以在构造函数中对数组和对象进行了区别对待

实现起来也非常简单：对数组的每一项调用 `observe` 方法，对象则调用劫持 `getter` 和 `setter` 的逻辑（`defineReactive` 方法）

```typescript
/**
 * Walk through all properties and convert them into getter/setters. 
 */
function walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i])
  }
}

/**
 * Observe a list of Array items.
 */
function observeArray (items: Array<any>) {
  for (let i = 0, l = items.length; i < l; i++) {
    observe(items[i])
  }
}
```

为了让数组的原型方法具有响应式，array 模块导出了一个具有响应式数组方法的 `arrayMethods` 对象

主要的实现思路是通过 `Object.create` 使得  `arrayMethods` 继承自数组的原型，重写的方法首先调用原始的方法，接着分发依赖

比较麻烦的是如何让已存在的数组生效，这就涉及到了 JavaScript 中继承的问题：怎么让一个已经存在的对象继承自另一个对象？

JavaScript 通过内部属性 `[[Prototype]]` 形成的原型链实现继承，通过修改这个属性可以很简单的修改继承关系

ES6 提供了 `Object.setPrototypeOf` 可以实现修改隐式原型的需求，但是 vue2 是基于 ES5 实现的，没有办法通过标准的方法进行修改

所以 vue2 只能针对实现了 `__proto__` 和未实现 `__proto__` 的浏览器分别执行不同的操作：

- 对于实现了 `__proto__` 的浏览器直接修改该数组的 `__proto__` 属性让数组继承自 arrayMethods
- 未实现 `__proto__` 的浏览器则将 arrayMethods 的那些方法直接定义到数组身上。

![](https://oss.xiefeng.tech/images/20210906205433.png)

## Dep

无论是 `defineReactive`，`set`、`del` 还是数组被重写的原型方法，都需要解决依赖收集和依赖分发的问题

vue2 中使用 Dep 来解决这个问题，Dep 的含义是 Dependency，表示依赖的意思。

vue2 会为响应式对象中的每个具有响应式的属性、对象本身创建一个 Dep 实例。

每个 Dep 实例需要做以下两件事：

- 记录依赖：是谁（函数）在用我对应的数据
- 派发更新：我对应的数据变了，要通知那些用到数据的函数进行更新

在 `defineReactive` 中利用闭包创建了一个 dep 实例，并且在通过 `defineProperty` 添加属性描述符时：

- 在 get 中使用 `dep.depend()` 收集依赖
- 在 set 中使用 `dep.notify()` 派发更新

![](http://oss.xiefeng.tech/img/20210319212645.png)

## Watcher

dep 想要获取到当前的正在运行的函数，则需要一个全局的变量来存储正在运行的函数

所以当执行某个函数之前就需要修改该变量，而函数本身是不知道 vue 所做的这些所以也不会去设置该变量

vue 通过一种巧妙的办法来解决这个问题，我们不要直接执行函数，而是把函数交给一个叫做 watcher 的东西去执行。

响应式的本质就是：数据发生了变化就去运行一些函数。vue 中这函数我们是知道的，总共就三类：render、computed、watch。

所以这些函数在初始化的时候都创建一个 Watcher 实例，最后是通过这个实例去执行原本的函数

所以所谓的依赖收集就是收集这些 Watcher 实例，而分发依赖则是让这些 Watcher 实例执行原本的函数

![](http://oss.xiefeng.tech/img/20210319210527.png)

具体的做法：

1. vue 会为每一个响应式数据都创建一个 Dep 实例，每个依赖响应式数据的函数都对应一个 watcher
2. 每一个 dep 实例都具有一个属性 subs 记录该 dep 对应的响应式数据被依赖的函数对应的 watcher
3. `Dep.target` 在全局用来记录正在执行的 watcher 实例
4. 当用到响应时数据时，函数是通过 Watcher 实例执行，在执行前将 Dep.target 设为自己
5. 当用到响应时数据时会调用 `dep.depend` 就会将现在这个 watcher 加入到 subs 中，也就是所谓的依赖记录
6. 当响应时数据发生改变，会运行 setter，从而运行 `dp.notify` 派发更新

## Scheduler

Watcher 实例具有两个方法：run 和 update，其中 run 方法，就是运行和 watcher 对应的函数

`dp.notify` 派发更新运行的是每一个 watcher 的 update 方法，该方法把自己交给一个叫调度器的东西，让调度器来调度自己的运行

```typescript
update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
```

调度器通过 scheduler 模块实现，该模块维护一个执行队列，该队列中同一个 watcher 仅会存在一次

scheduler 模块具有一个 `flushSchedulerQueue` 函数，用于清空执行队列，该函数会被传递给 next-tick 模块中 nextTick 函数。

next-tick 模块用于执行一些异步的微任务，该模块维护了一个任务队列，nextTick 方法会将需要执行的任务放入为微队列中

nextTick 函数通过 `$nextTick` 暴露给我们，如果在数据更新操作后使用 nextTick 和获取更新后的 DOM

![](http://oss.xiefeng.tech/img/20210319215147.png)



