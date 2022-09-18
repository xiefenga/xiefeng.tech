# 图像的显示

显卡中有一块叫**前缓冲区**的地方，这里存放着显示器要显示的图像，显示器会按照一定的频率读取并显示。

不同的显示器读取的频率是不同的，这取决于屏幕的刷新率，大部分的显示器都是 60HZ，也就是显示器会每间隔 1/60 秒就读取一次。

显卡的职责是**合成新的图像**并保存到**后缓冲区**中，一旦显卡把合成的图像写到后缓冲区，系统就会将后缓冲区和前缓冲区互换，这样就能保证显示器能读取到最新显卡合成的图像。

显卡的更新频率需要和显示器的刷新频率保持一致，否则就可能会造成视觉上的问题：

- 生成的帧速率比屏幕刷新率慢，屏幕会在两帧中显示同一个画面，当这种情况持续发生，会很明显地察觉到动画卡住了
- 生成的帧速率比屏幕刷新率快，GPU 所渲染的图像没有全部被显示出来，会造成丢帧现象

浏览器如果想要更新页面内容，则需要将新生成的图片提交到显卡的后缓冲区中，并且为了实现流畅的动画需要将页面更新的频率和显示器的刷新率保持一步

## VSync

显示器将一帧画面绘制完成后，在准备读取下一帧之前，会发出一个**垂直同步信号**（vertical synchronization）给 GPU，简称 VSync

当 GPU 接收到 VSync 信号后会同步给浏览器进程，浏览器进程再将其同步到对应的渲染进程，渲染进程接收到 VSync 信号之后，就可以准备绘制新的一帧了

## 一帧的内容

当接收到 VSync 信号，新的一帧就开始了：

1. Input event handlers：Compositor Thread 在之前接收到的用户UI交互输入在这一刻会被传入给主线程，触发相关事件的回调
2. requestAnimationFrame：执行之前 requestAnimationFrame 所传入的回调
3. 执行渲染流水线：当然没有必要的阶段会跳过，比如只需要合成，则会跳过前面几个阶段
4. requestIdleCallback：如果在这一帧结束时有空余时间，会执行一些不那么紧急的任务，例如该回调、V8 的垃圾回收

![](https://user-images.githubusercontent.com/1249423/42124418-cc60489e-7c94-11e8-961b-8b2d68bffd62.png)

# 实现动画

创造平滑动画的关键：知道何时绘制下一帧。

浏览器知道 CSS 过渡和动画应该什么时候开始，并据此计算出正确的时间间隔，到时间就去刷新用户界面

## 计时器

早期使用 JavaScript 实现动画一般都是采用计时器 `setInterval` / `setTimeout`，但是使用计时器没有办法确切保证何时能让浏览器把下一帧绘制出来

计时器存在的缺点：

1. `setInterval` / `setTimeout` 只能保证何时会把代码添加到浏览器的任务队列，不能保证立即执行
2. 浏览器自身计时器存在精度问题：
	- IE8 及更早版本的计时器精度为 15.625 毫秒
	- IE9 及更晚版本的计时器精度为 4 毫秒
	- Firefox 和 Safari 的计时器精度为约 10 毫秒
	- Chrome 的计时器精度为 4 毫秒
3. 浏览器对切换到后台或不活跃标签页中的计时器执行限流，因此即使将时间间隔设定为最优，也免不了只能得到近似的结果
4. 采用计时器实现动画，浏览器不知道动画什么时候开始
	- 定时间隔必须足够短，这样才能让不同的动画类型都能平滑顺畅
	- 定时间隔又要足够长，以便产生浏览器可以渲染出来的变化

## raf

Mozilla 提出了 `mozRequestAnimationFrame`，用于通知浏览器某些 JavaScript 代码要执行动画了

目前所有浏览器都支持不带前缀的版本，即 `requestAnimationFrame`

使用该 API 可以请求浏览器在下一个渲染帧开始的时候执行某个回调，在函数中修改 DOM 样式之后紧跟着就会进行页面的更新

浏览器可以通过最优方式确定重绘的时序，基于当前页面是否可见、CPU的负荷情况、设备绘制间隔等自行决定最佳的帧率，不会存在过度绘制的问题（动画掉帧）。

该 api 解决了实现流畅动画的问题：浏览器不知道 JavaScript 动画何时开始， 以及最佳间隔是多少的问题

`requestAnimationFrame` api 的一些特点：

- `requestAnimationFrame` 存在一个队列，每次调用该函数都会在队列上推入一个回调函数，下一个渲染帧会执行这些函数
- 通过 `requestAnimationFrame` 递归地向队列中加入回调函数，可以保证每次重绘最多只调用一次回调函数，可以非常好的节流

- `requestAnimationFrame` 回调中的 DOM 操作会在接下来的渲染流水线中完成更新，只要不写垃圾代码
- 在隐藏或不可见的元素中，`requestAnimationFrame` 不会进行重绘或回流
- `requestAnimationFrame` 回调实际上可以接收一个参数，此参数是一个 `DOMHighResTimeStamp` 的实例，表示下次重绘的时间

`requestAnimationFrame` 中的垃圾代码，在更新完 DOM 之后获取 DOM 元素的信息：

```javascript
requestAnimationFrame(() => {
  element.style.backgroundColor = 'lightblue'
  const left = element.offsetLeft
  console.log(left)
})
```

获取 DOM 的信息使用的上一帧的缓存，但是在更新完了之后再获取为了保证信息的准确性，浏览器会强行渲染之后返回正确的数据

# requestIdleCallback

`requestIdleCallback` 的作用是在浏览器一帧的剩余空闲时间内执行优先度相对较低的任务

## 使用

回调接收一个参数 `deadline`：

- `timeRemaining()`: 当前帧还剩下多少时间
- `didTimeout`: 是否超时

`requestIdleCallback` 第二个参数 `{timeout: ...}` 表示超过这个时间后，如果任务还没执行，则强制执行，不必等待空闲。

```javascript
requestIdleCallback(deadline => {
    console.log(deadline);
    console.log(deadline.didTimeout);
    console.log(deadline.timeRemaining());
});
```

## 特点

- `requestAnimationFrame` 的回调会在每一帧确定执行，属于高优先级任务
- `requestIdleCallback` 的回调在每一帧不一定会执行，属于低优先级任务
- 该 API 被浏览器调用的频率比较低，只有 20 HZ

## 使用限制

1. 禁止执行 DOM 操作，会导致之前所做的布局计算都会失效
   - DOM 操作的时间是不可预测的，因此很容易超出当前帧空闲时间
   - 如果下一帧里有获取布局等操作的话，浏览器就不得不执行强制重排工作，这会极大的影响性能
2. `Promise` 的回调不建议在这里面进行
   - `Promise` 的回调属于微任务，会在 `requestIdleCallback` 结束时立即执行，这样有很大可能会让一帧超时
   - 推荐放在该 api 里面的应该是一些低优先级的、小块的并且可预测时间的宏任务





