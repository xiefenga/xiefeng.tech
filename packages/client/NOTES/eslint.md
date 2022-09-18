## 规则配置

```json
{
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}
```

配置项为一个数组，第一个为规则的错误级别：`error`、`warn`、`off`，第二个为规则的配置项

## 解析器

ESLint 中解析器的作用是将代码转化成 AST，借助 AST 来对代码进行分析

配置项 `parser` 用于指定 ESLint 使用的解析器，ESLint 默认解析器为 Espree

例如：`@typescript-eslint/parser` 用于解析 typescript，从而检查和规范Typescript代码

ESTree 是业界统一遵从的标准，它定义了JavaScript中所有涉及到的语法的表达形式，对语法元素描述进行统一标准的定义，并且ES在不断的升级过程中 ESTree 也会伴随着进行升级。

AST 选择器

用来匹配 AST 中节点的字符串（类似于 CSS 选择器），对于描述代码中的特定语法模式非常有用

## 扩展

手动配置完整的配置文件工作量很大，使用 `extends` 可以使用一些预先设置好的配置

预设包一般以 `eslint-config-xxx` 格式命名，配置时可以省略 `eslint-config-` 前缀

`extends` 多个模块，有冲突的配置项，后面的包将覆盖前面的。

该配置文件中的配置项的优先级恒定高于 `extends` 中的

extends 就是一个 mixin 的过程，优先级为：当前文件 > 后 extends > 先 extends

## 插件

ESLint 插件用于新增 lint 规则

> 由于eslint本身主要是对js代码进行语法检查以及少量代码格式化的操作，对于一些eslint没有定义的规则或其他格式文件的内容就无法识别进行lint校验。此时，若需要对这些文件内容进行lint规则，就需要使用eslint提供的plugins插件配置对lint规则进行新增。

### 插件配置

插件一般以 `eslint-plugin-xxx` 方式来命名，也支持 `@xx/eslint-plugin-xx` 带 scope 的命名

配置的时候可以省略 `eslint-plugin-` 前缀仅配置插件名，但是 scope 不可以省略

```json
{
  plugins: [
    'vue', // eslint-plugin-vue
    '@typescript-eslint', // @typescript-eslint/eslint-plugin
    '@0x1461ao/react', // @0x1461ao/eslint-plugin-react
  ]
}
```

如果插件新增的规则很多，`rules` 中就需要配置很多

如果插件提供了预设配置借助 `extends` 可以启用插件的预设。

通过配置`extends: ['plugin:<包名>/<配置名称>']` 可以实现插件和预设一同导入 

### 插件格式

一个规则就是一个导出一个对象的模块，该对象有两个属性：

- `meta` 代表了这条规则的元数据
- `create` 表达了这条规则具体会怎么分析代码
  - 是一个函数，返回一个属性为 AST 选择器的对象
  - 返回值对象的每个属性值都是一个函数，是对 AST 节点监听的回调
  - 在回调中我们可以获取对应选中的内容，我们可以针对选中的内容作一定的判断
    - 如果不满足，可用 `context.report` 抛出问题
    - `ESLint` 会利用我们的配置对抛出的内容做不同的展示
  - ESLint 会收集这些选择器，在 AST 遍历过程中会执行所有监听该节点的回调

```javascript
// lib/rules/no-console-time.js

module.exports = {
  meta: {
    docs: {
      description: "no console.time",
      category: "Fill me in",
      recommended: false,
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [],
    // 报错信息描述
    messages: {
      avoidMethod: "console method '{{name}}' is forbidden.",
    },
  },

  create(context) {

    return {
      'CallExpression MemberExpression': node => {
        const { object, property } = node
        if (object.name === 'console' && property.name === 'time' ) {
          context.report({
            node,
            messageId: 'avoidMethod',
            data: { name: 'time' },
          })
        }
      }
    }
  },
}
```

## Processor

processor 在 parser 解析源文件之前，以及在 rules 校验完后处理一些事情

processor 需要提供两个钩子函数：`preprocess` 和 `postprocess` 

- `preprocess` 是在 parser 解析源文件之前调用的方法
- `postprocess` 是在 rules 校验完毕之后调用的方法

## 运行原理

1. ESLint 使用解析器将代码解析成 AST
2. 深度遍历 AST，监听匹配过程
3.  触发监听选择器的 `rule` 回调

## 配置文件

每个目录下都可以存在配置文件，ESLint 会一直向上查找配置文件，直到`/`、 `~/` 或者 `root: true` 

与被 lint 文件位于同一目录中的配置文件优先级高

如果在同一个目录下有 `.eslintrc` 和 `package.json` 中 `eslintConfig` 字段

 `.eslintrc` 会优先， `package.json` 文件中的配置不会被使用

配置类型上： 注释 > 命令行参数 > 配置文件

- 文件层级上：（相对目标文件）近 > 远

- 同一目录内：（只会采用一个配置文件）js > cjs > yaml > yml > json > package.json

- 同一配置内：`overrides` > `rule` > `extends`

- 同一选项内：后者 > 前者

## overrides

`overrides` 配置项通过 Glob 模式匹配特定文件集合，额外应用不同的配置。

每一项支持大部分的 ESLint 配置，以及用于匹配文件的 `files` 数组和 `excludedFiles` 数组

```json
{
  "overrides": [
    {
      "files": ["src/*.js"],
      "excludedFiles": "a.js",
      "rules": {
        "no-alert": "warn"
      }
    }
  ]
}
```

## ignorePatterns

`ignorePatterns` 配置项包含一组 glob 模式，其作用类似`.gitignore` 

```json
{
  "ignorePatterns": ["**/dist/**", "**/output/**"]
}
```

## 注释

ESLint 支持使用注释禁用规则、进行配置、注入全局变量以及环境配置

`//` 和 `/* */` 都可以，可以在注释的同时说明原因，原因放在配置内容之后，用**两个或两个以上 `-`** 隔开

### 禁用规则

通过 `eslint-disable(-next)-line rule` 可以单行禁用规则

```javascript
alert('foo'); // eslint-disable-line
alert('foo'); /* eslint-disable-line */
alert('foo'); // eslint-disable-line plugin/rule-name

/* eslint-disable-next-line */
alert('foo');
// eslint-disable-next-line -- I don't want eslint 
alert('foo');
// eslint-disable-next-line no-alert, quotes, semi
alert('foo');
```

通过 `eslint-disable` 和 `eslint-enable` 实现某一块关闭规则校验

```javascript
/* eslint-disable */
console.log("bar")
alert('foo');
/* eslint-enable */

/* eslint-disable no-alert, no-console */
alert('foo');
console.log('bar');
/* eslint-enable no-alert, no-console */
```

在文件第一行使用  `eslint-disable`  实现整个文件关闭校验

```javascript
/* eslint-disable */
alert('foo');
//...

/* eslint-disable no-alert */
alert('foo');
//...
```

### 规则配置

```javascript
/* eslint quotes: ["error", "double"], curly: 2 */
const foo="'bar'"
```

### 全局变量

通过 `global` 注入全局变量，默认只读，通过 `: writable` 表明可写

```javascript
// var1 只读，var2 读写
/* global var1, var2: writable */
```



[ESLint使用教程](https://juejin.cn/post/7012798266089668645)

[深入浅出之ESLint](https://juejin.cn/post/7028754877312401444)
