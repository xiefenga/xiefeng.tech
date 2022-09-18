## Shebang

Shebang（也称 hashbang）就是字符序列 `#!`，通常出现在脚本文件的开头，用于指定脚本解释器的位置，仅在类 Unix 操作系统有效

名称由来：Unix术语中，`#` 通常称为*sharp*，*hash*或*mesh*，`!` 常常称为*bang* 

具体的语法为：Shebang 后面可以有一个或数个空白字符，跟着执行该脚本所需解释器的**绝对路径**，也可以传递参数给解释器

当直接调用脚本时，系统的程序加载器会分析 `#!` 后的内容，将这些内容作为解释器指令并调用，同时将该文件路径作为参数

解释器一般都会忽略 `#!` 开头的首行内容，以提供与 Shebang 的兼容性

```shell
// main.js
#! /Users/xiefeng/.nvm/versions/node/v14.17.6/bin/node
console.log("main.js")

$ ./main.js  # /Users/xiefeng/.nvm/versions/node/v14.17.6/bin/node ./main.js
```

通常写 shell 脚本，文件开头都是 `#! /bin/sh`，表明该脚本使用 `/bin/sh` 来解释执行，使用时我们只需 `./xxx.sh` 调用即可

## env

对于 node、python 等脚本，Shebang 往往都是以 `#! /usr/bin/env` 加上 node 和 python 做为参数这样的格式

```shell
#! /usr/bin/env python3
```

`env` 是一个可以查看当前所有的环境变量的命令，其位置为 `/usr/bin/env`，由于 PATH 中通常都包含 /usr/bin，所以可以在 shell 中直接执行 `env` 

```shell
➜ ~ env
SSH_AUTH_SOCK=/private/tmp/com.apple.launchd.RcFvL4jesG/Listeners
PATH=/Users/xiefeng/.nvm/versions/node/v14.17.6/bin:/Library/Frameworks/Python.framework/Versions/3.10/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/VMware Fusion Tech Preview.app/Contents/Public:/opt/X11/bin:/Library/Apple/usr/bin:/Users/xiefeng/.cargo/bin:/usr/local/mysql/bin:/usr/local/mysql/support-files
DISPLAY=/private/tmp/com.apple.launchd.cEFmm89qC7/org.xquartz:0
...
```

通过向 `env` 传递参数，会在环境变量中查找名为这个参数的可执行文件，并用使用后续的参数启动该执行文件

通过 `#! /usr/bin/env node` 这样的写法可以让脚本更通用（跑在别人的电脑上），每个人解释器安装的位置不一定相同



