# MVC

View：放置视图相关的代码，原则上里面不应该有任何业务逻辑

Model：封装和应用程序的业务逻辑相关的**数据**以及对**数据的处理**方法

Controller：放置视图与模型之间的映射，原则上这里应该很薄，他只放一些事件绑定相关的代码，但并不实现真正的功能

## 特点

Model 和 View 之间使用了观察者模式，View 事先在此 Model 上注册，在 Model 的值变更时收到通知

1. 控制器负责对模型中的数据进行更新，而视图向模型中请求数据
2. 当触发事件时，控制器更新模型，模型通知视图进行更新，这时视图向模型请求新的数据

![](https://oss.xiefeng.tech/images/20210917104854.png)

## 弊端

1. 当每个事件都流经 Controller 时，这层会变得十分臃肿
2. View 和 Controller 一般是一一对应的，View 与 Controller 过于紧密的连接让 Controller 的复用性成了问题
3. Controller 测试困难：因为视图同步操作是由 View 自己执行，而 View只能在有 UI 的环境下运行
4. View 无法组件化：View 是强依赖特定的 Model 的，将一个 View 抽出来作为另外一个应用程序可复用的组件比较困难

# MVP

MVP（model-view-Presenter）是经典 MVC 设计模式的一种衍生模式

## 特点

1. 用户对 View 的操作都会从 View 交移给 Presenter，Presenter 会执行相应的应用程序逻辑，并且对 Model 进行相应的操作
2. Model 执行完业务逻辑以后，通过观察者模式把自己变更的消息传递给 Presenter 而不是 View
3. Presenter 获取到 Model 变更的消息以后，通过 View 提供的接口更新界面

![](http://oss.xiefeng.tech/img/20210321203306.png)

## 区别

1. 在 MVC 中， Controller 是不能操作 View 的， View 也没有提供相应的接口
2. 在 MVP 中， Presenter 可以操作 View，View 需要提供一组对界面操作的接口给 Presenter 进行调用
3. Model 仍然通过事件广播自己的变更，但由 Presenter 监听而不是 View

## 优缺

优点：

1. 便于测试

   Presenter 对 View 是通过接口进行，在对 Presenter 进行不依赖 UI 环境的单元测试的时候，可以 Mock 一个 View对象

2. View 可以进行组件化

    View 不依赖 Model，这样就可以让 View 从特定的业务场景中脱离出来，它只需要提供一系列接口提供给上层操作

缺点：

Presenter 中除了应用逻辑以外，还有大量的 View 和 Model 之间的手动同步逻辑，导致 Presenter 比较笨重，维护起来会比较困难

# MVVM

MVVM 是 MVC 模式的另一个变种，MVVM 即 Model-View-ViewModel

## 特点

MVVM 在 MVP 的基础上进行了改良，将 presenter 改良成 ViewModel，实现了 View 和 Model 的同步逻辑自动化

ViewModel 中有一个 Binder，进行了数据的绑定，自动的处理 View 和 Model 的数据同步逻辑

- Model：包含了业务和验证逻辑的数据模型
- View：定义屏幕中 View 的结构，布局和外观
- ViewModel：扮演 View 和 Model 之间的使者，帮忙处理 View 的全部逻辑

![](http://oss.xiefeng.tech/img/20210321203749.png)

1. MVVM 将 View 的状态和行为抽象化，让我们可以将 UI 和业务逻辑分开
2. 这些工作 ViewModel 由完成，它可以取出 Model 的数据同时帮忙处理 View 中由于需要展示内容而涉及的业务逻辑
3. ViewModel 是由我们组织生成和维护的视图数据层，在这一层对从后端获取的 Model 数据进行转换处理，以生成符合 View 层使用预期的视图数据模型
4. ViewModel 所封装出来的数据模型包括视图的状态和行为两部分，而 Model 层的数据模型是只包含状态的

## 区别

在 MVC 中：

1. View 在 Controller 的顶端，而 Model 在 Controller 的底部
2. Controller 需要同时关注 View 和 Model
3. View 只能知道 Model 的存在并且能在 Model 的值变更时收到通知 

MVVM 模式和 MVC 有些类似，但有些不同:

1. ViewModel 替换了 Controller，在 UI 层之下
2. ViewModel 向 View 暴露它所需要的数据和指令对象
3. ViewModel 接收来自 Model 的数据

## 优缺

优点：提高可维护性、简化测试

缺点：简单 GUI应用会产生额外的性能损耗、复杂 GUI的 ViewModel 构建和维护成本高