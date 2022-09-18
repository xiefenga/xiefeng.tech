# 概念

Flex 布局是轴线布局，只能指定"项目"针对轴线的位置，可以看作是**一维布局**。

Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是**二维布局**。

和 Flex 相同，采用 Grid 布局的元素称为容器，内部的子元素为项目。

## 网格线

Grid 布局通过**网格线**将容器划分成行和列的单元格，水平网格线划分出行，垂直网格线划分出列。

`n` 行有 `n + 1` 根水平网格线，`m` 列有 `m + 1` 根垂直网格线

# 容器属性

类似于 Flex 布局，通过 `display: grid` / `display:inline-grid` 使用 Grid 布局。

## 划分行列

- `grid-template-rows`：分别定义每一行的行高
- `grid-template-columns`：分别定义每一列的列宽

给多少个值就会有多少将容器分为多少行/列：

```html
<div class="box">
    <div class="item item-1">1</div>
    <div class="item item-2">2</div>
    ...
    <div class="item item-8">8</div>
    <div class="item item-9">9</div>
</div>
```

```css
.box {
    display: grid;
    grid-template-columns: 50px 50px 50px;
    grid-template-rows: 50px 50px 50px;
}
.item {
    width: 20px;
    height: 20px;
    text-align: center;
}
```

![](http://oss.xiefeng.tech/img/20210803162140.png)

- `repeat()`：为了减少书写重复的值，可以使用 `repeat` 函数简化代码

```css
.box {
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-template-rows: repeat(3, 50px);
}
```

`repeat` 也可以重复某种模式：

```css
grid-template-columns: repeat(2, 100px 20px 80px);
```

- `auto-fill`：让每一行/每一列自动的根据实际情况最多的分出行/列

```css
.box {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
}
```

- `fr` 关键字：为了方便表示比例关系，如果两列的宽度分别为`1fr` 和 `2fr`，就表示后者是前者的两倍

```css
.box {
    display: grid;
    grid-template-columns: 1fr 1fr;
}
```

- `minmax()`：产生一个长度范围，表示长度就在这个范围之中

`minmax(100px, 1fr)`表示列宽不小于 `100px`，不大于 `1fr`

```css
grid-template-columns: 1fr 1fr minmax(100px, 1fr);
```

- `auto`：浏览器自动计算

```css
grid-template-columns: 100px auto 100px;
```

- 网格线的名称

`grid-template-columns` 和 `grid-template-rows` 属性里可以使用方括号，指定每一根网格线的名字，方便以后的引用。

```css
.box {
    display: grid;
    grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
    grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
```

`grid-template`：`grid-template-rows` 和 `grid-template-columns` 简写

## 行列间隔

- `grid-row-gap`：设置行与行的间隔（行间距）
- `grid-column-gap`：设置列与列的间隔（列间距）

```css
.box {
    grid-row-gap: 20px;
    grid-column-gap: 20px;
}
```

- `grid-gap`：`grid-column-gap` 和 `grid-row-gap` 的合并简写形式

第一个值是 `grid-row-gap`，第二个值是 `grid-column-gap`，给一个值同时设置两个

```css
grid-gap: 20px;
```

## 区域

网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。`grid-template-areas`属性用于定义区域

```css
.box {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 100px 100px 100px;
    grid-template-areas: 'a b c'
                         'd e f'
                         'g h i';
}
```

多个单元格合并成一个区域的写法：

```css
grid-template-areas: 'a a a'
                     'b b b'
                     'c c c';
```

## 排列

### 项目排列

- `justify-items`：设置单元格内容的水平位置
- `align-items`：设置单元格内容的垂直位置

取值：

- `start`：对齐单元格的起始边缘
- `end`：对齐单元格的结束边缘
- `center`：单元格内部居中
- `stretch`：拉伸，占满单元格（默认值）

![](https://www.wangbase.com/blogimg/asset/201903/bg2019032516.png)

- `place-items`：`align-items` 和`justify-items` 的合并简写形式

第一个值是 `align-items`，第二个值是 `justify-items`，传递一个同时设置两个

```css
place-items: start end;
```

### 区域排列

- `justify-content`：整个内容区域在容器里面的水平位置
- `align-content`：整个内容区域的垂直位置

取值：`start | end | center | stretch | space-around | space-between | space-evenly`

![](https://www.wangbase.com/blogimg/asset/201903/bg2019032519.png)

## 自动生成的行列

有时候，一些项目的指定位置，在现有网格的外部。比如网格只有3列，但是某一个项目指定在第5行。这时，浏览器会自动生成多余的网格，以便放置项目。

`grid-auto-columns`属性和`grid-auto-rows`属性用来设置，浏览器自动创建的多余网格的列宽和行高。它们的写法与`grid-template-columns`和`grid-template-rows`完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

## 简写

- `grid-template`：`grid-template-columns`、`grid-template-rows` 和 `grid-template-areas` 这三个属性的合并简写形式
- `grid`：`grid-template-rows`、`grid-template-columns`、`grid-template-areas`、 `grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow` 这六个属性的合并简写形式

# 项目属性

## 位置

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线

- `grid-column-start`：左边框所在的垂直网格线
- `grid-column-end`：右边框所在的垂直网格线
- `grid-row-start`：上边框所在的水平网格线
- `grid-row-end`：下边框所在的水平网格线

```css
.item-1 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
}
```

网格线从 1 开始编号，也支持负值，负数表示从反方向倒数第几个

`grid-column-start` 和 `grid-column-end` 可以使用 `span` 关键字表示相对于另一个的位置

```css
.item-1 {
    grid-column-start: 1;
    grid-column-end: span 3; /* 表示相对于 start 三个网格线 */
}
```

- `grid-column`：`grid-column-start `和 `grid-column-end` 简写形式

- `grid-row`： `grid-row-start` 和 `grid-row-end` 的简写形式

```css
.item-1 {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
}
```

`grid-column` 也可以可以使用 `span` 关键字

```css
.item-1 {
    grid-column: 1 / span 2;
}
```

- `grid-area`：指定项目放在哪一个区域

```css
.item-1 {
    grid-area: e;
}
```

`grid-area` 属性还可用作 `grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end` 的合并简写形式

```css
.item {
    grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
```

## 排列

`justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。

`align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。

