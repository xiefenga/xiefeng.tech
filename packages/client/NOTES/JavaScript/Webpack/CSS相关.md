## 导入CSS

webpack 本身只能读取 CSS 文件的内容并将其当作 JavaScript 代码进行分析，因此需要有一个 loader 转换 CSS 代码

### css-loader

css-loader 的作用，就是将 CSS 代码转换为 JavaScript 代码，具体做的工作：

1. 将 CSS 文件的内容作为字符串导出，以及导出其他一些信息
2. 将 CSS 中的其他依赖作为 require 导入，以便 webpack 分析依赖
3. 通过传递 `module` 配置项，启用 CSS module 功能

### style-loader

css-loader 仅将 CSS 转换为字符串导出，style-loader 可以将 css-loader 转换后的代码进一步加入到页面的 style 元素中

可以简单的描述为给经过 css-loader 的模块添加了如下代码：

```javascript
var style = module.exports;
var styleElem = document.createElement("style");
styleElem.innerHTML = style;
document.head.appendChild(styleElem);
module.exports = {}
```

## 抽离css文件

style-loader 使用的方式是用一段 JavaScript 代码将样式加入到 style 元素中

实际的开发中，我们往往希望依赖的样式最终形成一个 CSS 文件

使用 `mini-css-extract-plugin` 可以解决这个问题，该库提供了1个plugin和1个loader：

- plugin：负责生成css文件
- loader：负责记录要生成的css文件的内容，同时导出开启css-module后的样式对象

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader?modules"]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin() //负责生成css文件
  ]
}
```

