# 基本属性

采用 Flex 布局的元素，称为 Flex 容器，它的所有子元素自动成为容器成员，称为 Flex 项目

容器默认存在两根轴：主轴和交叉轴

## 容器属性

- `flex-direction`：设置主轴的方向
- `justify-content`：设置**主轴**方向上的项目对齐方式
- `align-items`：设置子项在**交叉轴**方向上的对齐方式
  - 默认值：`stretch`，如果子项的 `height ` 为 `auto` 会拉伸子项
  - 设置的是单行的子项对其方式
- `align-content`：设置**多行**的子项在**交叉轴**方向上的对齐方式
  - 默认值：`stretch`
  - 和 `justify-content` 相对应
- `flex-wrap`：当子项溢出时是否换行
- `flex-flow`：`flex-direction` 和 `flex-wrap` 的复合值

## 项目属性

- `align-self`：设置**该项目**在**交叉轴**上的对齐方式

  - 默认值：`auto`，其值为父元素的 `align-items`，如果其没有父元素，则为 `stretch`
  
  - 该属性可覆盖 `align-items`，没法覆盖 `align-content`
  
- `flex-grow`：设置项目的扩展比例

  - 默认值为 0
  - 不允许设置负值

- `flex-basis`：定义了在分配多余空间之前，项目占据的主轴空间，默认值为 auto

- `flex-shrink`：设置项目的收缩比例，默认值为 1

- `flex`：`flex-grow` 、`flex-shrink`、`flex-basis` 的复合值

  - 默认值为 `0 1 auto`
  - 有两个快捷值：`auto` (`1 1 auto`) 和 none (`0 0 auto`）
  - `flex: 1` 表示 `flex: 1 1 0`

- `order`：设置项目出现的順序，默认值为：0

# 项目尺寸

Flex 布局的项目元素的尺寸不是固定的，是具有伸缩性的

影响项目最终尺寸的因素：最大最小尺寸限制、弹性增长或收缩、基础尺寸

并且这些因素具有优先级：最大最小尺寸限制 > 弹性增长或收缩 > 基础尺寸

## 基础尺寸

`flex-basis` 用于设置项目的基础宽度，和 `width` 一样作用于 `content-box`

flex 项目的基础尺寸由 `flex-basis`、`width`、`content-size` 共同决定，`content-size` 就是内容的尺寸，内容包括文本内容和元素

`flex-basis` 为 `auto` 表示子项的基本尺寸根据其自身的尺寸决定，这时元素的基本尺寸由 `width` 和内容决定，当然也要考虑盒模型

1. 如果设置了 `width`，内容无法撑开项目的宽度
2. 如果没有设置 `width`，内容可以撑开项目

`flex-basis` 不为 `auto` 的情况是比较复杂的：

1. 如果设置了 `width` 的值：
   - `width > flex-basis`，项目最终的尺寸 一定是 `flex-basis <= realWidth <= width`
     - `width > content-size > flex-basis` && `flex-basis > width`
     - 也就是当不存在内容溢出的情况，项目尺寸就是 `flex-basis`
     - 当存在内容溢出的情况，项目尺寸会被内容撑开，但是不会超过 `width` 的值
   - `flex-basis >= width`，项目的宽度为 `flex-basis`，且**内容**无法撑开项目
2. 没设置 `width`：内容可以撑开该项目

## 收缩尺寸

`flex-grow` 设置项目的扩展比例，默认值为 0，容器剩余的空间会根据项目设置的比例进行伸展

`flex-shrink` 用于设置项目的收缩比例，默认值为 1

**特殊点：收缩比例的计算方式**

1. 计算加权值（content-width * 比例 + content-width * 比例 + …… = W）
2. 收缩像素（ content-width / W * 溢出像素）
3. 计算方式和盒模型没有关系，只和内容盒的宽度有关
4. 当该项目设置 `flex-basis` 并且内容溢出**撑开**盒子，该项目不参与收缩

