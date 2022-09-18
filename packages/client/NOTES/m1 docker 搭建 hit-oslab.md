使用 docker 基于 ubuntu:18.04 搭建 hit-oslab 实验环境

首先拉取 ubuntu 18.04 镜像：

```shell
docker pull ubuntu:18.04
```

接着通过 Dockerfile 创建自己的 oslab 镜像

```dockerfile
FROM ubuntu:18.04

COPY source ./source

RUN \
  apt-get update \
  && cd ./source \
  && tar -xvf gcc-3.4.tar.gz \
  && tar -xvf hit-oslab-linux-20110823.tar.gz \
  && apt-get install -y binutils \
  && cd ./gcc-3.4/amd64 \
  && dpkg -i *.deb \
  && apt-cache search as86 ld86 \
  && apt install bin86 \
  && apt install -y libc6-dev-i386 \
  && cd ../../oslab/linux-0.11 \
  && apt-get install make \
  && make all \
  && dpkg --add-architecture i386 \
  && apt-get update \
  && apt-get install -y libsm6:i386 \
  && apt-get install -y libx11-6:i386 \
  && apt-get install libxpm4:i386
```

![](/Users/xiefeng/Downloads/iShot截图/iShot2022-03-15 23.25.27.png)

然后构建镜像，由于 linux 0.11 基于 x86，需要使用 buildx 在 m1 上构建 amd64 的镜像

```shell
docker buildx build --platform=Linux/amd64 -t oslab:v0 .
```

![](/Users/xiefeng/Downloads/iShot截图/iShot2022-03-15 23.25.12.png)

这样实验环境就搭好了，如果是使用虚拟机或者直接使用安装 ubuntu 18 的系统，但是 m1 虚拟机无法安装 x86 系统镜像

运行镜像可以发现环境确实是搭好了，就是缺少图形界面

```shell
docker run -it --platform linux/amd64 oslab:v0 /bin/bash
cd source/oslab/
./run
```

![](/Users/xiefeng/Downloads/iShot截图/iShot2022-03-16 22.48.37.png)

把 Docker 镜像看做一台没配显示器的电脑，程序可以运行，但是没地方显示

X Window System（也常称为X11或X）是一种以**位图方式**显示的软件窗口系统，最初是1984年麻省理工学院的研究，之后变成UNIX、类UNIX、以及OpenVMS等操作系统所一致适用的标准化软件工具包及显示架构的运作协议。

X 只是工具包及架构规范，本身并无实际参与运作的实体，所以必须有人依据此标准进行开发撰写。如此才有真正可用、可执行的实体，始可称为实现体。当前依据X的规范架构所开发撰写成的实现体中，以X.Org最为普遍且最受欢迎

X 协议由 X server 和 X client 组成：

1.  X server 管理主机上与显示相关的硬件设置（如显卡、硬盘、鼠标等），它负责屏幕画面的绘制与显示，以及将输入设置（如键盘、鼠标）的动作告知 X client
2. X client 则主要负责事件的处理（即程序的逻辑）

只要在容器启动的时候，将『unix:端口』或『主机名:端口』共享给docker，docker就可以通过端口找到显示输出的地方，和linux系统共用显示。

![](https://img2018.cnblogs.com/blog/1046925/201908/1046925-20190824165625707-1560779550.png)

```shell
brew install socat
brew install xquartz

echo $DISPLAY

# /private/tmp/com.apple.launchd.nzm51qjuIW/org.macosforge.xquartz:0

open -a Xquartz

socat TCP-LISTEN:6000,reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\"
```

**在容器内**设置环境变量指向我们的内网 IP： DISPLAY=192.168.0.106:0

```shell
docker run -it --platform linux/amd64 -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=192.168.3.146:0 oslab:v0 /bin/bash
```

参考文章

- https://www.cnblogs.com/noluye/p/11405358.html
- https://blog.csdn.net/Dsky_A/article/details/121489721
- https://www.zhihu.com/question/34493859
- https://blog.csdn.net/weixin_43833642/article/details/105341872
- https://www.runoob.com/docker/docker-dockerfile.html

