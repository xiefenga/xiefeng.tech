# 自定义元素

命名规范：自定义网页元素的标签名必须含有连字符 `-`，一个或多个连字符都可以。

自定义元素需要使用 JavaScript 通过自定义类继承 `HTMLElement` 或 `HTMLElement` 的子类。

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<h1>hello world</h1>`;
  }
}
```

要想在HTML中使用自定义元素，需要通过 `window.customElements.define` 方法建立自定义元素和该类之间的映射。

```javascript
window.customElements.define('my-element', MyElement);
```

之后页面上的每一个 `<my-element>` 元素都是一个 `MyElement` 的实例。只要浏览器解析到 `<my-element>` 元素，就会运行 `MyElement` 的构造函数。

## 生命周期

- `connectedCallback()`：插入 DOM 时调用
- `disconnectedCallback()`：移出 DOM 时执行
- `attributeChangedCallback(attrName, oldVal, newVal)`：添加、删除、更新或替换属性时调用。元素创建或升级时，也会调用。只有加入 `observedAttributes` 的属性才会执行这个方法。
- `adoptedCallback()`：自定义元素移动到新的 document 时调用，比如执行 `document.adoptNode(element)` 时。

- `observedAttributes`：是一个静态属性，用于设置需要观察的属性（属性白名单）

生命周期的顺序：`constructor` -> `attributeChangedCallback` -> `connectedCallback`。

这是因为 `attributeChangedCallback` 相当于调整配置，应该在插入 DOM 之前完成。

## 回调

自定义元素的原型有一些属性，用来指定回调函数，在特定事件发生时触发。

- `createdCallback()`：实例生成时触发
- `attachedCallback()`：实例插入HTML文档时触发
- `detachedCallback()`：实例从HTML文档移除时触发
- `attributeChangedCallback(attrName, oldVal, newVal)`：实例的属性发生改变时（添加、移除、更新）触发

## 子元素

自定义元素可以在内部放置子元素，可以通过任何 DOM 的方式放置。比如：`innterHTML`、`appenChild`、包括在HTML直接在标签内书写。

`<slot>` 和 Vue 中的插槽类似，可以让自定义元素的某些区域让外部传进来，但是外部传进来的会成为 `slot` 的子元素。

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = `
<div id="container">
  <div class="images">
    <slot name="image"></slot>
  </div>
</div>`
  }
}
```

```html
<image-gallery>
  <img src="foo.jpg" slot="image">
  <img src="bar.jpg" slot="image">
</image-gallery>
```

最终就会变成这样：

```html
<div id="container">
  <div class="images">
    <slot name="image">
      <img src="foo.jpg" slot="image">
      <img src="bar.jpg" slot="image">
    </slot>
  </div>
</div>
```

# HTML模板

HTML 模板说的就是 `template` 标签，标签内部就是正常的 HTML 代码，浏览器会自动将其解析为 DOM 子树，但跳过渲染。

```html
<template id="foo">
    <p>I'm inside a template!</p>
</template>
```

在使用 `template` 时，无法直接获取到里面的 DOM 元素。这是因为内部元素存在于一个包含在 HTML 模板中的 DocumentFragment 节点内。

通过 `template` 元素的 `content` 属性可以取得这个 DocumentFragment 的引用，再通过这个引用可以获取到内部的DOM。

```javascript
console.log(document.querySelector('#foo').content); // #document-fragment

const fragment = document.querySelector('#foo').content;
console.log(document.querySelector('p')); // null
console.log(fragment.querySelector('p')); // <p>...<p>
```

对于自定义元素来说，HTML具有辅助意义，可以将模板写在 `template` 中，再复制节点。

# 影子DOM

Shadow DOM 指的是，浏览器将模板、样式表、属性、JavaScript 码等，封装成一个独立的 DOM 元素。外部的设置无法影响到其内部，而内部的设置也不会影响到外部。

Shadow DOM 是通过 `attachShadow` 方法创建并添加给有效 HTML 元素的。容纳影子 DOM 的元素被称为影子宿主（shadow host）。影子 DOM 的根节点被称为影子根（shadow root）。

大部分 DOM 元素都可以创建 Shadow DOM，但没有必要。一般用于给自定义元素创建，隔离组件和外部的影响。

`attachShadow` 接受一个对象 `{ mode: 'open' }`，并返回 Shadow DOM 的实例。`mode` 取值为 `open` 或 `closed`。

对 `open` 影子 DOM的引用可以通过 `shadowRoot` 属性在 HTML 元素上获得，而对 `closed` 影子 DOM 的引用无法这样获取。

```javascript
class MyElement extends HTMLElement {
    constructor() {
        super();
        const shadowDOM = this.attachShadow({ mode: "open" });
        shadowDOM.innerHTML = 'fuck';
    }
}

customElements.define('my-element', MyElement);

console.log(document.querySelector('my-element').shadowRoot); // #shadow-root (open)
```

在 Shadow DOM 和 `template` 内部的样式都是通过 `<style>` 或 `<link>` 来设置。

样式中 `:host` 表示宿主元素，外部样式会覆盖掉 `:host` 的设置。

```javascript
const template = document.createElement('template');

template.innerHTML = `
<style>
:host {
    display: flex;
    flex-direction: column;

}
</style>
<h1>hello world</h1>
<slot></slot>
`

class MyElement extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(
            template.content.cloneNode(true)
        );
    }
}
window.customElements.define('my-element', MyElement);
```

