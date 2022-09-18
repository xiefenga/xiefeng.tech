# Node

所有 DOM 节点类型都实现了 Node 接口，Node 接口在 JavaScript中被实现为 Node 类型，所有类型的节点都继承 Node 类型

## 节点类型

每个节点都有 `nodeType` 属性，表示该节点的类型，Node 类型上定义了 12 个数值常量：

- `Node.ELEMENT_NODE`（1）
- `Node.ATTRIBUTE_NODE`（2）
- `Node.TEXT_NODE`（3）
- ......

## 节点信息

- `nodeName`： 节点的名称，对于元素 `nodeName` 始终等于元素的标签名

- `nodeValue`：节点的值，Text 节点或 Comment 节点为文本内容，元素则始终为 `null`

## 节点关系

- `parentNode`：最顶端的为 `#document`
- `childNodes`：NodeList 实例，DOM 结构的变化会自动地反映出来，而不是第一次访问内容的快照
- `firstChild`、`lastChild`、`nextSibling`、`previousSibling`
- `hasChildNodes()`：返回 `true` 则说明节点有一个或多个子节点
- `ownerDocument`：指向自己所在的整个文档的文档节点

## 节点操作

- `appendChild`：如果传递的是已经存在的节点，则这个节点会从之前的位置被转移到新位置
- `insertBefore`：如果参照节点是 `null`，效果等于 `appendChild`
- `replaceChild`：要替换的节点会被返回并从文档树中完全移除，要插入的节点会取而代之
- `removeChild`：被移除的节点会被返回
- `cloneNode`：传入 `true` 会进行深复制（包括其整个子 DOM树），只复制 HTML 属性不包括事件
- `normalize`：处理文档子树中的文本节点
	- 由于解析器实现的差异或 DOM 操作等原因，可能会出现并不包含文本的文本节点
	- 也可能出现文本节点之间互为同胞关系
	- `normalize` 会检测这个节点的所有后代进行修复

并非所有节点类型都有子节点，如果在不支持子节点的节点上调用操作子节点的方法，则会导致抛出错误

# Document

`Document` 是 JavaScript 中表示文档节点的类型，表示 HTML 文档或其他 XML 文档

`document` 是 `HTMLDocument` 实例，`HTMLDocument` 继承 `Document`

Document 节点的特点：

- `nodeName`：`'#document'`
- `nodeValue`：`null`
- `parentNode`：`null`
- `ownerDocument`：`null`

Document 节点的子节点可以是 DocumentType、Element、ProcessingInstruction 或 Comment

## 快捷信息

document 提供了几个访问子节点的快捷方式：

- `document.documentElement`、`document.head`、`document.body`
- `document.doctype`： 取得对 `<!doctype>` 标签的引用，节点类型为 DocumentType

document 对象上提供了一些浏览器所加载网页的信息：

- `document.title`：页面标题

- `document.URL`：当前页面地址栏中的 URL，只读
- `document.domain`：当前页面的域名
- `document.referrer`：链接到当前页面的那个页面的 URL，只读

通过修改 `document.domain` 的值可以实现跨域：

当页面中包含来自某个不同**子域**的窗格（`<frame>`）或内嵌窗格（`<iframe>`）时，因为跨源通信存在安全隐患，所以不同子域的页面间无法通过 JavaScript 通信。此时，在每个页面上把 `document.domain` 设置为相同的父域名可以实现通信。

`document` 对象上暴露了几个特殊集合，这些集合都是 HTMLCollection 的实例：

- `document.anchors`：文档中所有带 `name` 属性的 `a` 元素
- `document.forms`：文档中所有 `form` 元素
- `document.images`：文档中所有 `img` 元素
- `document.links`：文档中所有带 `href` 属性的 `a` 元素

## 获取元素

document 对象上暴露了一些方法，获取某个或某组元素的引用

- `getElementById`
- `getElementsByTagName`：传入 `*` 可以取得文档中的所有元素
- `getElementsByClassName`

返回 HTMLCollection 对象，和 NodeList 一样查询的结果都是实时的，具有和中括号相同作用的 `item` 方法

HTMLCollection 对象有一个额外的方法 `namedItem`，可通过标签的 `name` 属性取得某一项的引用

HTMLCollection 对象中括号既可以接收数值和字符串索引，背后会分别调用 `item` 和 `namedItem` 方法

- `querySelector`
- `querySelectorAll`

`querySelectorAll` 返回的是一个 `NodeList` 的静态实例，避免了使用 `NodeList` 可能造成的性能问题

在 Document 和 Element 类上均有定义：

`getElementsByTagName`、`getElementsByClassName`、`querySelectorAll`、`querySelector` 

## 文档写入

`document` 对象有一个古老的能力，即向网页输出流中写入内容。

这个能力对应 4 个方法：`write`、 `writeln`、`open` 和 `close`。

在页面加载完之后调用 `document.write`，则输出的内容会重写整个页面。

`open` 和 `close` 方法分别用于打开和关闭网页输出流，在调用 `write` 和 `writeln` 时，这两个方法不是必需的

## 其他扩展

- `document.characterSet`：文档实际使用的字符集，可读写
- `document.compatMode`：标准模式下是 `"CSS1Compat"`，而在混杂模式下是 `"BackCompat"`
- `document.readyState`
	- `loading`：表示文档正在加载
	- `complete`：表示文档加载完成
- `document.activeElement`：指向当前拥有焦点的 DOM 元素
	- 页面完全加载之前值为 null
	- 页面刚加载完之后为 document.body
- `document.hasFocus()`：判断文档是否拥有焦点

# Element

Element 表示 XML 或 HTML 元素，对外暴露出访问元素标签名、子节点和属性的能力

Element 类型的节点的特点：

- `nodeName` 值为元素的标签名
- `nodeValue` 值为 `null`

使用 `document.createElement` 可以创建新的元素，同时新元素的 `ownerDocument` 会被设置为 `document`

## HTML元素

所有 HTML 元素都通过 `HTMLElement` 类型表示，所有 HTML 元素都是 HTMLElement 或其子类型的实例。

例如：div 元素为 HTMLDivElement 类型的实例

所有 HTML 元素上都有的标准属性：id、title、lang、dir、className

## 属性操作

每个元素都有零个或多个属性，通常用于为元素或其内容附加更多信息

- `getAttribute`
- `setAttribute`
- `removeAttribute`

分别用于操纵元素的属性，包括 HTML 属性和自定义的属性。

- 通过 `.` 只能读写 HTML 属性，自定义的属性只能添加到相应的 js 对象身上而无法添加到 DOM 上

- 通过 `attr` 方法既可以操作 HTML 属性，也可以操作自定义属性

HTML5 允许给元素指定非标准的属性，但要使用前缀 `data-`，通过 `dataset` 来操作 `data-` 开头的自定义属性

- `dom.dataset.pro`
- `delete dom.dataset.pro`

## 元素关系

- `parentElement`：最顶端的为 `html`
- `children`、`firstElementChild`、`lastElementChild`
- `childElementCount`
- `contains`：确定一个元素是不是后代

## 插入内容

- `innerHTML`、`outerHTML`

在所有现代浏览器中，通过 innerHTML 插入的`script`是不会执行的，

- `innerText`、`outerText`

读取文本值时两者会返回同样的内容，在写入文本值时 `outerText` 会替换整个元素

`outerText` 是一个非标准的属性，而且也没有被标准化的前景

- `dom.textContent`  得到的是内部源代码中的文本

- `insertAdjacentHTML()`、`insertAdjacentText()`

它们都接收两个参数：要插入标记的位置和要插入的 HTML 或文本

## 区域滚动

HTML5  标准化了 `scrollIntoView` 方法，用于滚动页面中的某个区域

`scrollIntoView` 方法存在于所有 HTML 元素上，可以滚动浏览器窗口或容器元素以便包含元素进入视口

- alignToTop：窗口滚动后元素的顶部 / 底部与视口顶部对齐
- scrollIntoViewOptions：滚动的选项

`scrollIntoViewIfNeeded` 会在元素不可见的情况下，将其滚动到窗口或包含窗口中使其可见，但是非标准

# Attr

元素的每个属性都是一个 Attr 节点

Attr节点的 nodeName 是对应属性的属性名，nodeValue 则是属性值，parentNode 为 null

`attributes` 属性返回一个 NamedNodeMap 实例，其中包含的是元素的每个 Attr 节点

NamedNodeMap 有一些方法：

- `getNamedItem`：返回属性名为参数的 Attr 节点
- `removeNamedItem`：删除属性名为参数的 Attr 节点
- `setNamedItem`：添加属性节点
- `item`：返回索引位置 pos 处的节点

# Text

HTML 中的每段文本都被一个 Text 节点包含，Text 节点为 Text 类型

通过 `document.createTextNode` 可以创建新的文本节点

Text 节点的特征：

- `nodeName` 值为 `"#text"`
- `nodeValue` 值为节点中包含的文本
- 不支持子节点

Text 节点中包含的文本可以通过 nodeValue 属性访问，也可以通过 data 属性访问

- `appendData(text)`：向节点末尾添加文本 text
- `deleteData(offset, count)`：从位置 offset 开始删除 count 个字符
- `insertData(offset, text)`：在位置 offset 插入 text
-  `replaceData(offset, count, text)`：用 text 替换从位置 offset 到 offset + count 的 文本
- `splitText(offset)`：在位置 offset 将当前文本节点拆分为两个文本节点
- `substringData(offset, count)`：提取从位置 offset 到 offset + count 的文本

# 样式操作

HTML 中的样式有 3 种定义方式：外部样式表、文档样式表、元素特定样式。

DOM2 Style 为这 3 种应用样式的机制都提供了 API

## classList

通过 classList 可以方便的实现类名的添加、删除和替换

- `add(value)` 向类名列表中添加指定的字符串值 `value`
- `contains(value)` 返回布尔值，表示给定的 `value` 是否存在
- `remove(value)` 从类名列表中删除指定的字符串值 `value`
- `toggle(value)` 如果类名列表中已经存在指定的 `value`，则删除；如果不存在，则添加

## style

style 属性是 CSSStyleDeclaration 类型的实例，其中包含通过 HTML style 属性为元素设置的所有样式信息

DOM2 Style 规范在 `style` 对象上定义了一些属性和方法，提供了元素 `style` 属性的信息并支持修改：

- `cssText`：`style` 属性中的 CSS 代码
-  `length`：应用给元素的 CSS 属性数量
- `parentRule`：表示 CSS 信息的 `CSSRule` 对象
- `getPropertyPriority(propertyName)`：如果属性使用了 `!important` 返回 `important`否则返回 `''`
- `getPropertyValue(propertyName)`：返回属性的字符串值
- `removeProperty(propertyName)`：从样式中删除 CSS 属性
- `setProperty(propertyName, value, priority)`：设置 CSS 属性，`priority` 是`important`或 `''`

## 计算样式

`window.getComputedStyle(dom, pseudoElement)` 返回 `CSSStyleDeclaration` 类型的对象

- `pseudoElement`: 可选，伪类元素，当不查询伪类元素的时候可以忽略或者传入 `null`
- 获取的样式是元素在浏览器中**最终渲染效果的样式**
- 返回的计算样式的值都是**绝对值**

浏览器虽然会返回样式值，但返回值的格式不一定相同

## 样式表

`CSSStyleSheet` 类型表示 CSS 样式表，包括使用元素和通过 `link` 和 `style` 素定义的样式表。

`CSSStyleSheet` 类型继承 `StyleSheet`，后者可用作非 CSS 样式表的基类。

- `disabled`：表示样式表是否被禁用，可读写
- `href`：`link` 包含的样式表返回 URL，否则返回 `null`
- `ownerNode`：指向拥有当前样式表的节点，`link` 或 `style` 元素
- `parentStyleSheet`：如果当前样式表是通过 `@import` 导入，则这个属性指向导入它的样式表
- `cssRules`：当前样式表包含的样式规则的集合
- `ownerRule`：如果样式表是使用 `@import` 导入的，则指向导入规则，否则为 `null`
- `deleteRule(index)`：在指定位置删除 cssRules 中的规则
- `insertRule(rule, index)`：在指定位置向 cssRules 中插入规则

通过  `document.styleSheets` 可以得到页面上所有的 CSS 样式表

###  CSS 规则

CSSRule 类型表示样式表中的一条规则，这个类型也是一个通用基类。

最常用的是表示样式信息的是 CSSStyleRule 类型，继承自 CSSRule

CSSStyleRule 对象上可用的属性：

- `cssText`：整条规则的文本，这里的文本可能与样式表中实际的文本不一样
- `parentRule`：如果这条规则被其他规则（如@media）包含，则指向包含规则，否则就是 null
- `parentStyleSheet`：包含当前规则的样式表
- `selectorText`：返回规则的选择符文本
- `style`：CSSStyleDeclaration 对象，可以设置和获取当前规则中的样式
- `type`：数值常量，表示规则类型，对于样式规则，它始终为 1

### 修改规则

通过 `style` 属性可以通过类似修改元素 `style` 属性一样修改规则中的样式，但是这样修改规则会影响到页面上所有应用了该规则的元素

```javascript
document.styleSheets[0].cssRules[0].style.height = '1000px'
```

###  创建规则

可以使用 `insertRule()` 方法向样式表中添加新规则，该方法接收两个参数：

- 规则的文本
- 插入位置的索引值

```javascript
sheet.insertRule("body { background-color: silver }", 0);
```

### 删除规则

通过 `deleteRule()` 方法从样式表中删除一条规则，该方法的参数：要删除规则的索引

```javascript
sheet.deleteRule(0)
```

# 元素尺寸

## 偏移尺寸

- `offsetHeight`、`offsetWidth` 元素的**可视区**的宽高（包括滚动条，除了 `body` 和 `html`）
- `offsetLeft`、`offsetTop` 相对于包含元素的距离，包含元素保存在 `offsetParent` 属性中

`body` 的 `offsetLeft`、`offsetTop` 为 0

- `offsetParent`
	- 返回最近的**有定位**的父级；否则返回 `body`
	- `body` 的上一级为 `null`

![](http://oss.xiefeng.tech/img/20210306210831.png)

## 客户端尺寸

> 包含元素内容及其内边距所占用的空间

- `dom.clientWidth`、`dom.clientHeight`

	返回的是元素的显示的内容的宽高（ `padding-box - barWidth` ) ，元素内部的空间不包括滚动条

`documentElement.clientWidth / clientHeight`  返回的是**视口**的宽高（不包括滚动条的宽度）

与偏移尺寸一样，客户端尺寸也是只读的，而且每次访问都会重新计算。

![](http://oss.xiefeng.tech/img/20210306210901.png)

## 滚动尺寸

- `scrollHeight`、`scrollWidth`：没有滚动条出现时，元素内容的总宽高
- `scrollLeft`、`scrollTop`：内容区左侧/顶部隐藏的像素数，设置这个属性可以改变元素的滚动位置。 

通常认位 `<html>` 是浏览器视口中的滚动元素，所以 `documentElement.scrollHeight` / `scrollWidth`代表的就是页面的高度 / 宽度。

![](http://oss.xiefeng.tech/img/20210306210659.png)

##  确定元素尺寸

`getBoundingClientRect`，返回一个 `DOMRect` 对象，包含：`left`、`top`、`right`、`bottom`、`height` 和 `width`。这些属性给出了元素在页面中相对于视口的位置。

`height`、`width` 是**可视区**的大小。

![](https://oss.xiefeng.tech/img/20210821105750.png)

# DOM遍历

DOM2 Traversal and Range 模块定义了两个类型用于辅助顺序遍历 DOM 结构：

- NodeIterator

- TreeWalker

从某个起点开始执行对 DOM 结构的深度优先遍历，DOM 树中的任何节点都可以成为遍历的根节点

## NodeIterator

通过 `document.createNodeIterator()` 方法创建实例：

- `root`：作为遍历根节点的节点
- `whatToShow`：数值代码，表示应该访问哪些节点
- `filter`：NodeFilter 对象或函数，表示是否接收或跳过特定节点
- `entityReferenceExpansion`：表示是否扩展实体引用，HTML 文档中没有效果（实体引用永远不扩展）

`whatToShow` 是一个位掩码，指定访问哪些节点，对应的常量在 NodeFilter 上定义：

- `NodeFilter.SHOW_ALL`：所有节点
- `NodeFilter.SHOW_ELEMENT`：元素节点
- `NodeFilter.SHOW_TEXT`：文本节点
- .......

除了 `NodeFilter.SHOW_ALL` 之外，其他值都可以通过按位或组合使用：

```javascript
let whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT; 
```

NodeFilter为有 `acceptNode(node)` 方法的对象 => `NodeFilter.FILTER_ACCEPT`、`NodeFilter.FILTER_SKIP`

通过 `nextNode()` 和 `previousNode()` 方法进行遍历：

```javascript
const iterator = document.createNodeIterator(
    document.getElementById("div1"), 
    NodeFilter.SHOW_ELEMENT, 
    null, 
    false
);

let node = iterator.nextNode()

while (node) {
    console.log(node)
    node = iterator.nextNode()
}

console.log(node, iterator.previousNode())
```

## TreeWalker

TreeWalker 是 NodeIterator 的高级版。除了 `nextNode()`、`previousNode()` 方法，还添加了在 DOM 结构中向不同方向遍历的方法：

- `parentNode()`：遍历到当前节点的父节点
- `firstChild()`：遍历到当前节点的第一个子节点
- `lastChild()`：遍历到当前节点的最后一个子节点
- `nextSibling()`：遍历到当前节点的下一个同胞节点
- `previousSibling()`：遍历到当前节点的上一个同胞节点。

通过 `document.createTreeWalker()` 方法创建实例，接收和 NodeIterator 相同的参数
