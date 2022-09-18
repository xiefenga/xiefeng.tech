# $

- css选择器

- jQuery独有的选择器

- `null`、`undefined`

- `dom`

- `function`

  `$(function(){}) == $(document).ready(function() {}) ` 使用的是 `DOMContentLoaded` 事件

- `selector, context` 

  将选择的选择的元素范围限定在 `context` 的范围内
  
- jQuery 对象

  这个对象的一个克隆对象将被创建，这个新的jQuery对象引用同一DOM元素。

# 元素的基本操作

## 元素的遍历和筛选

- `get()` 	返回原生的dom对象，不传参数返回由全部dom组成的数组
- `eq()`     返回jQuery对象，不传参返回空对象
- `find()`     返回该元素的**后代元素**中符合条件的，可传入selector、dom、jQuery对象
- `filter()`    返回元素中符合条件元素，可传入selector、dom、jQuery对象、`function(index, ele)`
- `not()`    和 `filter()` 相反，将不符合条件的元素选择出来
- `has()`    返回有符合条件的后代元素的元素
- `is()`    返回该对象和参数中匹配的是否有交集，（前面的元素有没有后面的元素）
- `add()`    添加元素到匹配的元素集合中一起操作
- `end()`    回退到上一步

## 取赋值操作

- `html()`    读取只读取元素集合中的第一个，赋值全部都赋值，可传 字符串、函数
- `text()`    读写匹配元素集合中每个元素的文本内容，可传 字符串、函数
- `val()`    读写表单元素的 `value` 值，可传入 字符串、函数
- `size()`    返回某个集合中元素的数量 `== xx.length`

### css操作

- `addClass()`    为匹配的所有元素添加类名（可多个），可传 字符串、函数

- `removeClass()`    移除匹配的元素上一个、多个或全部样式（不传参），可传 字符串、函数

- `hasClass()`    确定任何一个匹配元素**是否有**被分配给定的类

- `css()` 读写CSS属性

  读取传入字符串、字符串数组

  写入传入 属性名+值、属性名+函数、对象

## 属性操作

- `attr()`   读写属性，对于没写就是 `undefined`，对于特性不好用
- `prop()`   读写特性
- `data()`    在匹配元素上存储任意相关数据（存储在jQuery对象中，而不是dom上，但有映射），可读第一个匹配的元素的相关数据或行间的 `data-xxx` 的数据

## 增删改查操作

1. 创建

   - `$(标签字符串)`  创建jQuery对象

   - `clone()`  

     深度克隆（包括行间样式和内容），可传入 `true` 也克隆事件和数据（通过 `data()` 添加的）

     传入两个 `true` 数据中的引用值类型也会被深度克隆

2. 查找

   - `next()` 、`prev()`

     返回后 / 前一个兄弟元素，可以传入选择器参数进行限定

   - `nextAll()`、`prevAll()`

     返回后面 / 前面所有兄弟元素，可以传入选择器参数进行筛选

   - `nextUntil()`、`prevUntil()`

     返回后面 / 前面的兄弟元素，第一个参数用来限定到哪截至，第二个参数用来筛选元素

   - `siblings()`

     返回该元素的所有兄弟元素，可以传参进行筛选

   - `parent()`

     获取该元素的父元素，可传参进行筛选

   - `parents()`

     返回该元素的所有祖先元素，可传参进行筛选

   - `offsetParent()`    

     最近的有定位的父级

   - `closest()`

     从元素**本身**开始，逐级向父元素匹配，并返回最先匹配的祖先元素，可以传参进行限定
     
   - `children()`   

     返回所有的子元素，可传参进行筛选

   - `slice()`

     根据指定的下标范围，过滤匹配的元素集合，并生成一个新的 jQuery 对象

3. 插入

   - `insertAfter()`、`insertBefore()`、`appendTo()`、`prependTo()`

     在目标元素之后插入，可传入selector、dom、jQuery

   - `after()`、`before()`、`append()`、`prepend()`

     目标元素在该元素之前，对于添加元素需要传入dom或jQuery
     
   - `wrap()`    给每个元素添加父级，对于已有的dom是克隆操作

   - `wrapInner()`    给该元素的直接子元素们添加一个父级

   - `wrapAll()`    给匹配的元素集合一起添加一个父级

   - `unWrap()`    将匹配元素集合的父级元素删除

4. 删除

   - `remove()`、`detach()`

     相同点：都会返回被删除的对象

     区别：`remove()` 会将事件等数据一并移除，`detach()` 不会（再次添加被删除的对象）

# 事件

- `on(events [, selector ] [, data ], handler(e))` 

	`selector` 参数可以用来模拟事件委托，事件绑定在父级身上，但是只有在事件源对象为`selector`时才触发

	`data` 的内容会在 `e.data` 中

	`on` 可以绑定多个事件处理函数（甚至一个函数多次），可以绑定自定义事件

	对于多个事件的绑定可以：

	```javascript
	$('.demo').on({
	    click: function () {
	        console.log('click');
	    },
	    mouseenter: function () {
	        console.log('mouseenter');
	    },
	    mouseleave: function () {
	        console.log('mouseleave');
	    }
	});
	```

- `one()`

	和 `on` 相同，只不过事件只发生一次

- `hover()`    用来绑定鼠标移入移出事件的函数 `== on ('mouseenter').on('mouseleave')`

	参数` handlerIn(eventObject), handlerOut(eventObject)` 两个函数分别对应移入、移出；

	当两个函数为一个时，可以只传入一个

- `off()`

	不传参，取消所有事件的所有处理函数；传类型，取消该事件类型的所有处理函数

	其他情况，绑定怎么写取消怎么写（参数）

- `trigger(eventType [, extraParameters])`

# 动画

- `show()`、`hide()`、`toggle()`

	显示、隐藏匹配的元素，过渡的是 `width` `height` `opacity` `padding` `margin` 这几个属性

	可传参数 `[duration ] [, easing ] [, complete ]` ；

	对于 `easing` jQuery自身提供`linear` 和 `swing`，其他效果可以使用[jQuery Easing Plugin](http://gsgd.co.uk/sandbox/jquery/easing/)插件

- `fadeIn()`、`fadeout ()`、`fadeToggle()`

	通过淡入淡出的方式显示、隐藏匹配元素，过渡的只有 `opacity` 属性

	可传参数 `[duration ] [, easing ] [, complete ]` ；

- `fadeTo()`

	调整匹配元素的透明度（淡入淡出到指定的 `opacity`）

	参数为 `duration, opacity [, easing ] [, complete ]` 

- `slideDown()`、`slideUp()`、`slideToggle()`

	用滑动动画显示、隐藏一个匹配元素，过渡的是 `height` 属性

	参数：`[duration ] [, easing ] [, complete ]`

- `animate()`

	根据一组 CSS 属性，执行自定义动画

	参数为 `properties [, duration ] [, easing ] [, complete ]` ，第一个参数为CSS属性对象

- `stop()`

	参数 `[clearQueue ] [, jumpToEnd ]` 

	无参，取消当前动画开始下一个动画；

	一个参数 `true` 取消以列队动画；

	两个 `true` ，取消队列动画并直接到最终的状态

- `finish()`

	停止当前正在运行的动画，删除所有排队的动画，并直接到最终状态

- `delay(duration)`

	设置一个延时来推迟执行队列中后续的项（动画）

# 位置大小

- `offset()`    返回一个对象，包含距离**文档**的位置 `{left right}`
- `position()`    返回相对于最近**有定位的父级**
- `scrollLeft()` 、`scrollTop()`    获取 / 设置匹配的元素集合中第一个元素的当前**滚动条的位置**
- `width()`、`height()`    获取 / 设置匹配的元素集合中第一个元素的当前**内容区**的宽高
- `innerWidth()`、`innerHeight()`    获取元素的**填充区**的宽高
- `outerWidth()`、`outerHeight()`    获取元素的**边框盒**的宽高，传入参数 `true` 可以加上 `margin`

**遍历索引**

`each()`    遍历一个jQuery对象，为每个匹配元素执行一个函数

`index()`

- 如果不传递任何参数，则返回值就是jQuery对象中第一个元素相对于它同辈元素的位置

- 如果在一组元素上调用并且参数是一个DOM / jQuery对象，返回值就是传入的元素相对于原先集合的位置

- 如果参数是一个选择器，返回值就是原先元素相对于选择器匹配元素的位置，找不到返回 -1

# 工具方法

- `$.type()`    判断数据类型
- `$.trim()`    消除字符串头尾空格
- `$.proxy()`   改变 `this` 指向，类似于 `bind` ，`function, context [, additionalArguments ]`
- `$.noConfict()`   防止 `$` 冲突
- `$.parseJSON()`    将严格 `json` 字符串转换成对象
- `$.each()`    给传进来的数组/对象遍历
- `$.makeArray()`    类数组转数组

**插件扩展**

- `$.extend()`、`$.fn.extend()`
	1. 可以实现方法的扩展，一个为工具方法，一个为实例方法
	2. 可以实现克隆，深度克隆

# 异步

- `$.ajax()`

	`url`、`type`、`data`、`dataType`、`success`

- `$.Callbacks(flags)`

	`flags`  ：  `once`   、`memory` 、`unique` 、`stopOnFalse`

	`cb.add()`    可以添加回调函数

	`cb.fire()`    执行回调函数

- `$.Deferred()`

	`df.done()`    绑定延迟对象解决时的回调函数；`df.resolve(args)`   完成成功的回调

	`df.fail()`    绑定延迟对象失败时的回调函数；`df.reject(args)`   完成失败的回调

	`df.progress()`    绑定延迟对象进行时的回调函数；`df.notify(args)`   完成进行时的回调

	成功和失败的回调只执行一次

	`df.promise()`    返回延迟的承诺对象

	`df.then()`    参数为 `doneFilter [, failFilter ] [, progressFilter ]`   

	​	 方法返回一个承诺对象，多次调用，前一个回调函数的返回值为新的同类型的回调函数的参数

- `$.when(deferreds)`

	传入一个或多个延迟对象，返回一个promise对象，当这些延迟对象都解决触发后面注册的成功的回调，一个失败全都失败

	

