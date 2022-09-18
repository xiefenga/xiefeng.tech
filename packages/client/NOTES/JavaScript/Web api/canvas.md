vscode 添加 `/** @type {HTMLCanvasElement} **/`  即可拥有 canvas 提示

## 图形

1. 画线

   ```js
   const canvas = document.getElementById('canvas');
   const ctx = canvas.getContext('2d');
   ctx.beginPath();
   ctx.moveTo(100, 100);
   ctx.lineTo(200, 200);
   ctx.stroke();
   ```

2. 矩形

   ```js
   ctx.beginPath();
   ctx.rect(100, 100, 200, 200);
   ctx.stroke();
   // or
   ctx.beginPath();
   ctx.strokeRect(100, 100, 200, 200);
   
   // 填充矩形
   ctx.beginPath();
   ctx.fillRect(100, 100, 200, 200);
   ```

3. 圆弧

   - `arc(x, y, radius, startAngle, endAngle, acticlockwise)`   

     `endAngle` 是顺时针方向来数，开始和结束的弧度都需要传弧度（`Math.PI`），最后一个参数是否逆时针

   ```js
   ctx.beginPath();
   ctx.arc(100, 100, 50, 0, 60 * Math.PI / 180, false);
   ctx.stroke();
   ```

   - `arcTo(x1, y1, x2, y2, radius)`

     `arcTo()` 方法在画布上创建介于两个切线之间的弧/曲线。

     ![](https://oss.xiefeng.tech/images/20210906202258.png)

   ```js
   ctx.beginPath();
   ctx.moveTo(110, 100);
   ctx.arcTo(200, 100, 200, 150, 10);
   ctx.arcTo(200, 200, 100, 200, 10);
   ctx.arcTo(100, 200, 100, 100, 10);
   ctx.arcTo(100, 100, 200, 100, 10);
   ctx.stroke();
   ```



## 背景填充

背景的填充都是从canvas的原点开始的

1. 纯色填充

   ```js
   ctx.fillStyle = "red";
   ```

2. 图片填充

   ```js
   ctx.beginPath();
   const img = new Image();
   img.src = './1.jpg';
   img.onload = function () {
       const bg = ctx.createPattern(img, 'no-repeat');
       ctx.fillStyle = bg;
       ctx.translate(100, 100);
       ctx.fillRect(0, 0, 200, 200);
   }
   ```

3. 线性渐变

   ```js
   ctx.beginPath();
   var bg = ctx.createLinearGradient(0, 0, 200, 0);
   ctx.fillStyle = bg;
   ctx.translate(100, 100);
   bg.addColorStop(0, "white");
   bg.addColorStop(0.5, "black");
   bg.addColorStop(1, "white");
   ctx.fillRect(0, 0, 200, 200);
   ```

4. 辐射渐变

   ```js
   ctx.beginPath();
   var bg = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
   ctx.fillStyle = bg;
   ctx.translate(100, 100);
   bg.addColorStop(0, "white");
   bg.addColorStop(0.5, "black");
   bg.addColorStop(1, "white");
   ctx.fillRect(0, 0, 200, 200);
   ```

## 其他

1. 阴影

   ```js
   ctx.shadowColor = "red";ctx.shadowBlur = 10;ctx.shadowOffsetX = 0;ctx.shadowOffsetY = 0;ctx.strokeRect(100, 100, 100, 100);
   ```

2. 文字

   `ctx.strokeText(text, x, y)`    空心文字

   `ctx.font = "20px consolas"`

   `ctx.fillText(text, x, y)`   实心文字

   `ctx.textAlign`、`ctx.textBaseline` 设置文字对齐方式

   ![](https://oss.xiefeng.tech/images/20210906202258.png)

3. 线段样式

   ```js
   ctx.lineCap = "butt | round | square";ctx.lineJoin = "bevel | miter | round";ctx.miterLimit = 5;
   ```

4. 属性合成

   `ctx.globalCompositeOperation`  属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上，该属性需要设置在两个图形绘制的中间

   <img src="https://oss.xiefeng.tech/images/20210906202258.png" style="zoom: 33%;" />

   ```js
   ctx.beginPath();ctx.fillStyle = "#eee";ctx.fillRect(100, 100, 100, 100);ctx.globalCompositeOperation = "source-out";  // 位置很重要ctx.beginPath();ctx.fillStyle = "#aaa";ctx.fillRect(150, 150, 100, 100);
   ```

## 图像处理

1. 设置图片

   `drawImage()` 方法在画布上绘制图像、画布或视频，也能够绘制图像的某些部分，以及/或者增加或减少图像的尺寸。

   1. 定位

   ```js
   ctx.drawImage(img,x,y);
   ```

   1. 在画布上定位图像，并规定图像的宽度和高度

   ```js
   ctx.drawImage(img,x,y,width,height);
   ```

   1. 剪切图像，并在画布上定位被剪切的部分

   参数：开始剪切的 x y坐标，被剪切图像的宽高，在画布上放置图像的坐标，要使用的图像的宽高（放大/缩小）

   ```js
   ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
   ```

2. 将 canvas 导出为图片

   `canvas.toDataURL()` 可以将该 canvas 的整个内容导出为一个base64的图片

3. 得到图片的信息

   `ctx.getImageData(x, y, width, height)` 可以得到指定区域的像素点信息

   `ctx.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight)` 将图像数据（从指定的 `ImageData` 对象）放回画布上

   参数：`ImageData` 对象左上角的坐标，在画布上放置图像的位置（可选），在画布上绘制图像所使用的宽高（可选）



## 尺寸设置

Canvas 的默认大小为 300 × 150，元素实际在页面中占据的大小由 CSS 控制

画布会伸缩以适应 CSS 所设置的尺寸，当画布尺寸和 CSS 尺寸比例不一致时会出现扭曲

元素大小默认等于设置的画布大小（无 CSS 设置宽高的情况）

当改变画布的长度或者宽度时，画布中的内容会被清空，上下文对象的属性值会被重置

## 画布状态

CanvasRenderingContext2D 包含了多种绘图的样式状态（线的样式、填充样式、阴影样式等）

- `save` 将当前 canvas 的状态压入绘图堆栈中，保存目前 canvas 的状态

- `restore` 从绘图堆栈中弹出上一个 canvas 状态，恢复之前的绘图状态

存储在状态堆栈的数据列表：

- 坐标变换（变换矩阵）信息
- 剪贴区域
- 渲染上下文对象（`CanvasRenderingContext2D`）的属性值

> [`strokeStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeStyle), [`fillStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillStyle), [`globalAlpha`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalAlpha), [`lineWidth`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineWidth), [`lineCap`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap), [`lineJoin`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin), [`miterLimit`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/miterLimit), [`lineDashOffset`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineDashOffset), [`shadowOffsetX`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX), [`shadowOffsetY`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY), [`shadowBlur`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowBlur), [`shadowColor`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowColor), [`globalCompositeOperation`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation), [`font`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/font), [`textAlign`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textAlign), [`textBaseline`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textBaseline), [`direction`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/direction), [`imageSmoothingEnabled`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled)

## 路径

### beginPath

`beginPath` 方法用于开始一段新路径

canvas 中的绘制方法（`stroke`、`fill` 等）都会以上一次 `beginPath` 之后的所有路径为基础进行绘制

1. 无论使用 `moveTo` 把画笔移动到哪里，只要没有 `beginPath`，都是在画一条路径
2. `fillRect` 与 `strokeRect` 这种直接画出独立区域的函数，也不会打断当前的路径

```javascript
ctx.beginPath()
ctx.moveTo(100.5, 20.5)
ctx.lineTo(200.5, 20.5)
ctx.stroke()

debugger
ctx.moveTo(100.5, 40.5)
ctx.lineTo(200.5, 40.5)
ctx.strokeStyle = '#f00'
ctx.stroke()
```

这段代码绘制出的图案是两条红线，因为两次 stroke 都是以 beginPath 后的所有路径为基础画的

第一条路径 stroke 了两下，第一下是黑的，第二下是红的，所以最终也是红的

![](/Users/xiefeng/Library/Application Support/typora-user-images/image-20220731165857256.png)

![](/Users/xiefeng/Library/Application Support/typora-user-images/image-20220731170011798.png)

## 变形

`translate(x, y)` 将 canvas 的原点进行移动

```javascript
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    ctx.save()
    ctx.fillStyle = `rgb(${51 * i}, ${255 - 51 * i}, 255)`
    ctx.translate(10 + j * 50, 10 + i * 50)
    ctx.fillRect(0, 0, 25, 25)
    ctx.restore()
  }
}
```

`rotate(angle)` 将坐标轴顺时针旋转指定的弧度

- 参数计算方式 `degree * Math.PI / 180` 
- 旋转中心点为 canvas 的原点

`scale(x, y)`  可以缩放画布的水平和垂直的单位

- x 为水平缩放因子，y 为垂直缩放因子
- 如果比 1 小，会缩小图形，如果比 1 大会放大图形
- 默认值为 1，为实际大小

`transform(a, b, c, d, e, f)`  用于使用矩阵多次叠加当前变换

- 该方法是将当前的变形矩阵乘上一个基于自身参数的矩阵（每调用 transform 都会在前一个变换矩阵上构建）
- 可以缩放、旋转、移动和倾斜上下文
- `setTransform` 使用单位矩阵重新设置（覆盖）当前的变换
- `resetTransform` 重置坐标轴的变换

矩阵：

```javascript
a  c  e             x
b  d  f      *      y
0  0  1             1
```

![](/Users/xiefeng/Library/Application Support/typora-user-images/image-20220731213302126.png)

## path2D







## 绘制平滑曲线

由于浏览器对 `mousemove` 事件的采集频率，使用 `lineTo` 无法绘制平滑的曲线

可以通过 `quadraticCurveTo` 绘制二次贝塞尔曲线的方式绘制出平滑曲线

![](https://img2020.cnblogs.com/blog/449809/202008/449809-20200803174427946-1862846632.png)

https://segmentfault.com/a/1190000016672567



