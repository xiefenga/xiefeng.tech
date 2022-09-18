# ArrayBuffer

`ArrayBuffer` 用于在内存中分配特定数量的字节空间，就像 C 语言的 malloc 函数

通过 `ArrayBuffer` 申请的内存一经创建就不能再调整大小，要读写 ArrayBuffer 则需要通过**视图**。

```javascript
const buf = new ArrayBuffer(16); 
console.log(buf.byteLength); // 16
```

ArrayBuffer 某种程度上类似于 C 语言的 malloc 函数，但也存在区别：

- `malloc` 在分配失败时会返回一个 `null` 指针；`ArrayBuffer` 在分配失败时会抛出错误
- `malloc` 可以利用虚拟内存，因此最大可分配尺寸只受可寻址系统内存限制；`ArrayBuffer` 分配的内存不能超过 `Number.MAX_SAFE_INTEGER`
- `malloc` 调用成功不会初始化实际的地址；`ArrayBuffer` 则默认会将所有二进制位初始化为 0
- 通过 `malloc` 分配的堆内存需要手动通过 `free`；而通过声明 `ArrayBuffer` 分配的堆内存可以被当成垃圾回收，不用手动释放

# DataView

DataView 是一种可以读写 ArrayBuffer 的视图，其 API 支持对缓冲数据的高度控制，但相比于其他类型的视图性能也差一些

创建 DataView 视图需要通过已有的 ArrayBuffer 实例，可以使用全部或部分 ArrayBuffer

```javascript
const buf = new ArrayBuffer(16);

// DataView 默认使用整个 ArrayBuffer
const fullDataView = new DataView(buf);

// 构造函数接收一个可选的字节偏移量和字节长度
const firstHalfDataView = new DataView(buf, 0, 8);

// DataView 会使用剩余的缓冲
const secondHalfDataView = new DataView(buf, 8);
```

DataView 的读写需要的条件：

- 要读写的字节偏移量
- 读写的类型，例如：Int8、Unit8、Int16、Uint16、Int32、Uint32、Float32、Float64
- 内存中值的字节序（大小端），默认为大端

DataView 为上表中的每种类型都暴露了 get 和 set 方法，这些方法使用 byteOffset 定位要读取或写入值的位置

```javascript
const buf = new ArrayBuffer(2)
const view = new DataView(buf)
view.setUint8(0, 255)
view.setUint8(1, 0xFF)
view.getInt16(0) // -1
```

![](https://oss.xiefeng.tech/images/20211003113520.png)

JavaScript 运行时所在系统的原生字节序决定了如何读取或写入字节，但 DataView 并不遵守这个约定。

DataView 是一个中立接口，它会遵循你指定的字节序。DataView 所有 API 方法都以大端字节序作为默认值，但接收一个可选的布尔值参数，设置为 true 即可启用小端字节序。

# TypedArray

定型数组是另一种形式的 ArrayBuffer 视图。

创建定型数组的方式包括读取已有的缓冲、使用自有缓冲、填充可迭代结构，以及填充基于任意类型的定型数组。

```javascript
const buf = new ArrayBuffer(12);
// 创建一个引用该缓冲的 Int32Array
const ints = new Int32Array(buf);

console.log(ints.length); // 3

// 创建一个长度为 6 的 Int32Array
const ints2 = new Int32Array(6);

// 创建一个包含[2, 4, 6, 8]的 Int32Array
const ints3 = new Int32Array([2, 4, 6, 8]);

// 通过复制 ints3 的值创建一个 Int16Array
const ints4 = new Int16Array(ints3); 

// 基于普通数组来创建一个 Int16Array
const ints5 = Int16Array.from([3, 5, 7, 9]);

// 基于传入的参数创建一个 Float32Array
const floats = Float32Array.of(3.14, 2.718, 1.618);
```

# Atomics

`SharedArrayBuffer` 是 `ArrayBuffer` 的一个变体，主要区别是 `SharedArrayBuffer` 可以被任意多个执行上下文同时使用

多个上下文同时对缓冲区执行操作，可能出现资源争用问题，Atomics API 通过强制同一时刻只能对缓冲区执行一个操作，可以让多个上下文安全地读写一个缓冲区，保证 JavaScript 操作是线程安全的

## 原子性

现代编程语言中，一条普通的命令被编译器处理以后，会变成多条机器指令。

在多线程环境并且共享内存时，就会出问题。因为在这一组指令的运行期间，可能会被中断然后运行其他线程的指令操作共享内存，从而导致运行结果出错。

原子性就是让一个操作所对应的多条机器指令，一定是作为一个整体运行不会被中断。

`Atomics` 对象就是为了实现原子操作而产生的，提高多线程共享内存时的操作安全。

## 指令排序

JavaScript 编译器和 CPU 架构本身都有权限重排指令以提升程序执行效率。但多线程下的指令重排可能导致资源争用，而且极难排错。

Atomics API 通过两种主要方式解决了这个问题：

- 所有原子指令相互之间的顺序永远不会重排
- 使用原子读或原子写保证所有指令都不会相对原子读/写重新排序

这意味着位于原子读/写之前的所有指令会在原子读/写发生前完成，而位于原子读/写之后的所有指令会在原子读/写完成后才会开始。

```javascript
const sharedArrayBuffer = new SharedArrayBuffer(4);
const view = new Uint32Array(sharedArrayBuffer);
// 执行非原子写
view[0] = 1;
// 非原子写可以保证在这个读操作之前完成，因此这里一定会读到 1
console.log(Atomics.load(view, 0)); // 1
// 执行原子写
Atomics.store(view, 0, 2);
// 非原子读可以保证在原子写完成后发生，因此这里一定会读到 2
console.log(view[0]); // 2
```

## 读写API

- `load(typedArray, index)`：从共享内存读出数据
- `store(typedArray, index, value)`：向共享内存写入数据

- `exchange(typedArray, index, value)`：替换掉数组上的值，然后返回数组的旧值
- `compareExchange(typedArray, index, expected, replacement)`：在数组的值与期望值相等的时候，将给定的替换值替换掉数组上的值，然后返回旧值
- `add(typedArray, index, value)`：对共享内存索引处执行原子 `+` 操作
- `sub(typedArray, index, value)`：对共享内存索引处执行原子 `-` 操作
- `or(typedArray, index, value)`：对共享内存索引处执行原子或操作
- `and(typedArray, index, value)`：对共享内存索引处执行原子与操作
- `xor(typedArray, index, value)`：对共享内存索引处执行原子异或操作

## 锁

如果没有某种锁机制，多线程程序就无法支持复杂需求。为此，Atomics API 提供了模仿 Linux Futex （快速用户空间互斥量）的方法。

所有原子 Futex 操作只能用于 Int32Array 视图。

`Atomics` 对象提供了 `wait()` 和 `notify()` 两个方法用于等待通知。这两个方法相当于锁内存，即在一个线程进行操作时，让其他线程休眠（建立锁），等到操作结束，再唤醒那些休眠的线程（解除锁）。

```javascript
// worker.js
self.addEventListener('message', e => {
  const sharedArray = new Int32Array(e.data);
  Atomics.wait(sharedArray, 0, 50);
  console.log(Atomics.load(sharedArray, 0));
});
```

`wait()` 方法告诉 Worker 线程，只要满足给定条件（`sharedArray`的 `0` 号位置等于 `50`）Worker 线程进入休眠。

```javascript
// main.js
Atomics.store(sharedArray, 0, 100);
Atomics.notify(sharedArray, 0, 1);
```

`notify()` 方法，唤醒在 `sharedArray` 的 `0` 号位置休眠队列里的一个线程。

`Atomics.wait()` 和 `Atomic.notify()` 这两个原子操作和操作系统提供的一对原语 P、V 操作非常类似。

```javascript
Atomics.wait(sharedArray, index, value[, timeout])
```

- `value`：该位置的预期值，一旦实际值等于预期值，线程就进入休眠
- `timeout`：表示过了这个时间以后自动唤醒，单位毫秒。默认值是 `Infinity`，只有通过 `notify` 才能唤醒
- 返回值是一个字符串：和预期值不等，返回 `not-equal`；`notify` 唤醒，返回 `ok`；超时唤醒，返回 `timed-out`

```javascript
Atomics.notify(sharedArray, index, count)
```

- `count`：需要唤醒的 Worker 线程的数量，默认为 `Infinity`，全部唤醒。

[js-lock-and-condition](https://github.com/lars-t-hansen/js-lock-and-condition) 库基于 `wait` 和 `notify` 这两个方法实现锁内存实现。

**锁的判断**

`Atomics.isLockFree(size)`：该字节长度为可处理的 `TypedArray` 标准字节长度之一则返回 `true`

只有传递的数值为标准的字节长度才可以，`TypedArray` 的标准字节长度参见 [BYTES_PER_ELEMENT](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/BYTES_PER_ELEMENT)

该方法我们基本上应该不会用到。这个方法在 高性能算法中可以用来确定是否有必要获取锁。

规范中的介绍如下：

> Atomics.isLockFree 是一个优化原语。基本上，如果一个原子原语（compareExchange、 load、store、add、sub、and、or、xor 或 exchange）在 n 字节大小的数据上的原子步骤 在不调用代理在组成数据的n字节之外获得锁的情况下可以执行，则Atomics.isLockFree(n) 会返回 true。高性能算法会使用 Atomics.isLockFree 确定是否在关键部分使用锁或原子操作。如果原子原语需要加锁，则算法提供自己的锁会更高效。 Atomics.isLockFree(4)始终返回 true，因为在所有已知的相关硬件上都是支持的。 能够如此假设通常可以简化程序。
