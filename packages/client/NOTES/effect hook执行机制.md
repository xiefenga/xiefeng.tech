1. 在 commit 阶段的前期
	- 会**调用**类组件生命周期方法：getSnapshotBeforeUpdate 
	- 会**调度**函数式组件的 useEffect 的 cleanup 以及回调函数，具体是将它们放入 React 维护的调度队列中，给予一个普通的优先级异步执行
2. 在 commit 阶段将 DOM 的变化映射到真实的 DOM 之后，同步的执行生命周期函数 `componentDidMount`，`componentDidUpdate` 以及 `useLayoutEffect` hook，由于此时虽然改变了内存中的 DOM 的数据，但是主线程由于在执行js还没有开始执行渲染的任务，所以在这些函数中可以获取到变化之后的 DOM 数据，但是页面还未更新，此时更新 DOM 数据也不会造成页面闪烁。
3. 在 commit 阶段结束之后，浏览器渲染完毕之后会通知 react，react 开始执行自己调度队列中的任务，此时才开始执行 useEffect的产生的函数



批处理：React会尝试将同一上下文中触发的更新合并为一个更新



半自动：只对同步流程中的this.setState进行批处理

