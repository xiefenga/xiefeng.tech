ES module本质上只有命名导出，默认导出只是名为default的命名导出的语法糖。所以一个模块可以同时具有默认导出和（普通的）命名导出



传统CommonJS中，如果`module.exports`是一个class或函数，就类似于默认导出，如果是一个用作namespace的plain object，就类似于命名导出。但`module.exports`本质上只是导出了一个值而已，所以这两种用法是互斥的。



理论上来说，ES module导入CommonJS模块，似乎问题不大。无论是命名导入还是默认导入，都是拿`module.exports`



一个常见情况是，一个模块本身使用了ES module写，但是发布成CommonJS

如题主提到的React便是如此。这就让我们被迫要考虑如何把ES module映射到CommonJS上的问题。



道理上，ES module转成CommonJS，其default导出只能映射到`module.exports.default`上，而不能映射到CommonJS传统的`module.exports`上，因为ES module可以同时有命名导出，你无法让`module.exports`既是一个导出值，又是一个namespace object。（什么？你说在默认导出的函数上加个其他属性又不会死？嗯，那你考虑下默认导出为primitive值甚至为`null`的情况吧……）



转译出来的CommonJS模块中默认导出值是在`module.exports.default`上，而传统CommonJS模块中的默认导出值是在`module.exports`上。那么Babel/TypeScript等在`import x from 'commonjs-module'`时咋知道到底应该是哪一个？如果不知道的话，结果就是前面说的Node.js试验性ESM类似的状况。



为此，Babel/TS等工具会对转译出来的CommonJS做记号，给`module.exports`上加一个属性`__esModule: true`。这样就可以区别了！



这个方式有个小毛病，在一般的CommonJS模块中导入转译的CommonJS模块就有点尴尬，因为没有编译器的帮忙，你得自己写：`const x = require('m').default`





https://www.zhihu.com/question/288322186



https://juejin.cn/post/7033392392866955278#heading-1