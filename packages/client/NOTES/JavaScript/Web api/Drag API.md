# 原生拖放

IE4 最早在网页中为 JavaScript 引入了对拖放功能的支持，HTML5 在 IE 的拖放实现基础上标准化了拖放功能

拖放最有意思的可能就是可以跨窗格、跨浏览器容器，有时候甚至可以跨应用程序拖动元素

## 拖放事件

拖放事件几乎可以让开发者控制拖放操作的方方面面，有的事件在被拖放元素上触发，有的事件则在放置目标上触发。

在某个元素被拖动时，会按顺序触发以下事件： 

1. `dragstart`
2. `drag`
3. `dragend`

`dragstart` 和 `dragend` 只会在拖动开始和结束时触发一次，在拖动过程中 `drag` 事件会一直触发

在把元素拖动到一个有效的放置目标上时，目标会依次触发以下事件：

1. `dragenter`
2.  `dragover`
3. `dragleave` 或 `drop`

`dragenter` 和 `dragleave` 只会在拖动元素进入和离开目标时触发一次，`dragover` 会在进入目标元素之后拖动元素只要还在拖动就会一直触发，`drap` 事件在将拖动元素在目标中释放时触发。

## 可拖动能力

默认情况下，图片、链接和文本是可拖动的，文本只有在被选中后才可以拖动，而图片和链接在任意时候都是可以拖动的。

HTML5 在所有 HTML 元素上规定了一个 `draggable` 属性， 表示元素是否可以拖动。

图片和链接的 `draggable` 属性自动被设置为 `true`，而其他所有元素此属性的默认值为 `false`。

如果想让其他元素可拖动，或者不允许图片和链接被拖动，都可以设置这个属性。

```html
<!-- 禁止拖动图片 -->
<img src="smile.gif" draggable="false" alt="Smiley face">
<!-- 让元素可以拖动 -->
<div draggable="true">...</div>
```

## 放置目标

虽然所有元素都支持放置目标事件，但是元素默认也是不允许放置的。

如果把元素拖动到不允许放置的 目标上，无论用户动作是什么都不会触发 drop 事件

通过覆盖 `dragenter` 和 `dragover` 事件的默认行为，可以把任何元素转换为有效的放置目标

```javascript
const target = document.querySelector(".droptarget")

target.ondragover= e => e.preventDefault()

target.ondragenter = e => e.preventDefault()
```

有的浏览器对放置事件有默认行为（Firefox 默认会导航放置的目标URL，如果无效则会导致错误），最好也取消该事件的默认行为：

```javascript
droptarget.addEventListener("drop", (event) => {
    event.preventDefault()
}) 
```

# 数据传输

简单的拖放并没有实际意义，在拖动过程中往往需要传递数据

event 对象上暴露了 `dataTransfer` 对象，用于从被拖动元素向放置目标传递数据

该对象是 IE 引入，原本支持的数据类型为："text"、"URL"，HTML5 已经将其扩展为允许任何 MIME 类型

为向后兼容 HTML5 还会继续支持"text"和"URL"，但它们会分别被映射到"text/plain"和"text/uri-list"

dataTransfer 对象有两个主要方法：`getData()` 和 `setData()`

## 存取数据

通过 `setData` 方法可以向目标元素传递数据

第一个参数为数据类型（可以是自定义也可以是 MIME），第二个参数为数据，两个都是字符串。

```javascript
e.dataTransfer.setData("text", "some text")
```

dataTransfer 对象实际上可以包含每种 MIME 类型的一个值，也就是说同时保存文本和 URL，两者不会相互覆盖

```javascript
e.dataTransfer.setData("text", "some text")
e.dataTransfer.setData("url", "https://xiefeng.tech")
```

通过 `getData` 方法可以取出存储在 dataTransfer 中的数据

传递需要的类型即可取出数据，如果不存在该类型的数据则返回空字符串

`dataTransfer.types` 中包括所有通过 `setData` 设置的类型，该数组中的类型都是 MIME 类型格式

```javascript
e.dataTransfer.getData("text")
```

存储为文本和 URL 的数据有一个区别：数据作为 URL 存储时会被作为网页中的一个链接，放到另一个窗口中会导航

## 存取过程

- 在从文本框拖动文本时，浏览器会调用 setData 并将拖动的文本以"text"格式存储起来
- 在拖动链接或图片时，浏览器会调用 setData 并把 URL 存储起来
- 也可以在 `dragstart` 事件中手动调用 setData 存储自定义数据。

当数据被放置在目标上时，可以使用 getData 获取这些数据

存储在 dataTransfer 对象中的数据只能在 `drop` 事件中读取，如果没有取得这些数据，dataTransfer 对象就会被销毁，数据也会丢失

## 文件传输

通过 `dataTransfer.files` 可以得到拖拽进来的外部文件列表，该属性是一个 FileList 对象，使用该对象可以直接得到 File 对象

```javascript
dragtarget.addEventListener('drop', e => {
  e.preventDefault()
  console.log(e.dataTransfer.files)
})
```

![](https://oss.xiefeng.tech/images/20210911152402.png)

## 数据列表

`dataTransfer.items` 是一个包含所有拖动数据列表的 `DataTransferItemList` 对象（类数组）

拖动没有传递数据则该属性为空，只有通过 `setData` 传递数据了才会有值，默认网页中文本、图片和链接默认都会传递数据

浏览器外部的文件拖入也会传递一些文件数据

`DataTransferItemList` 对象的每一个成员都是一个 `DataTransferItem` 类型对象，`DataTransferItem` 描述了一个拖拽项：

- `kind`：拖拽项的种类，`string` 或 `file`
- `type`：拖拽项的类型，一般是一个MIME 类型

![](https://oss.xiefeng.tech/images/20210911153520.png)

`DataTransferItem` 具有一些方法：

- `getAsFile`：对于通过外部传递的文件，可以通过该方法的到 File 对象，当拖拽项不是一个文件时返回 `null`
- `getAsString`：使用拖拽项的字符串作为参数执行指定回调函数

```javascript
const file = e.dataTransfer.items[0].getAsFile()

e.dataTransfer.items[0].getAsString(str => console.log(str))	// text data
```

## 拖动行为

dataTransfer 对象不仅可以用于实现简单的数据传输，还可以用于确定能够对被拖动元素和放置目标执行什么操作

dataTransfer 提供了两个属性：dropEffect 与 effectAllowed 实现该功能

dropEffect 告诉浏览器允许哪种放置行为：

- `none`：被拖动元素不能放到这里，这是除文本框之外所有元素的默认值
- `move`：被拖动元素应该移动到放置目标
- `copy`：被拖动元素应该复制到放置目标
- `link`：表示放置目标会导航到被拖动元素（仅在它是 URL 的情况下）

在把元素拖动到放置目标上时，每种值都会导致显示一种不同的光标，但是是否导致光标示意的动作还要取决于开发者

也就是如果没有代码参与，则没有什么会自动移动、复制或链接，只会变光标

dropEffect 需要在放置目标的 ondragenter 事件处理程序中设置

```javascript
dragtarget.addEventListener('dragenter', (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
})
```

需要同时设置 effectAllowed，dropEffect 才会有用，该属性需要在 ondragstart 事件处理程序中设置

effectAllowed 表示对被拖动元素是否允许 dropEffect：

- `none`：被拖动元素上没有允许的操作
- ......
- `all`：允许所有 dropEffect

这两个属性只能改变浏览器的一些默认行为，具体的功能实现还是需要自己实现
