## npx

### 本地命令

使用 `npx` 可以快捷的运行项目中安装的模块命令

```shell
npx tsc --init
```

npx 的原理很简单，在运行的时候从 `node_modules/.bin` 和 `$PATH` 中检查命令是否存在

由于 npx 会检查环境变量 `$PATH`，所以也可以调用系统命令

```shell
npx ls # ls
```

### 未安装命令

`npx` 可以无需先安装模块即可运行命令，这非常有用：

1. 不需要安装任何东西。
2. 可以使用 `@version` 语法运行同一命令的不同版本

```shell
npx uglify-js@3.1.0 main.js -o ./dist/main.js
```

当执行的某个命令在本地无法找到时，`npx` 会下载同名的包到一个临时目录并执行命令

`npx` 对于包名和命令名的策略：

- 当需要下载的包只有一个 `bin` 时可以不指定命令的名称

- 当需要下载的包有多个 `bin` 并且执行的命令和包名相同无需指定命令的名称

```shell
npx package@version ...args
```

- 如果命令名称和需要下载的包名不一致时，可以通过参数手动指定包名

```shel
npx -p @vue/cli vue create vue-app
```

对于 `@vue/cli` 包来说，其只有一个命令 `vue`，所以可以有两种使用方式：

```shell
npx @vue/cli create my-vue-app
npx -p @vue/cli vue create vue-app
```

只要 npx 后面的模块无法在本地发现，就会下载同名模块

### 其他版本Node

本质上就是执行未安装包的命令，npm 上有作为包发布的不同版本的 node 

```shell
npx node@10 -v #v10.18.1
npx node@12 -v #v12.14.1
```

### 远程代码

 npx 可以执行 GitHub 上面的模块源码

```shell
# 执行 Gist 代码
npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32

# 执行仓库代码
npx github:piuccio/cowsay hello
```

远程代码必须是一个模块，即必须包含 `package.json` 和入口脚本

### 参数

https://www.ruanyifeng.com/blog/2019/02/npx.html

## npm init

`npm init` 除了初始化 `package.json` 之外，也有和 `yarn create` 相同的作用

```shell
npm init 包名 # 等效于 npx create-包名 
npm init @命名空间 # 等效于 npx @命名空间/create
npm init @命名空间/包名 # 等效于 npx @命名空间/create-包名
```

