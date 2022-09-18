## h函数

h 函数不会传入 render 函数，被全局导出

## 异步组件

```javascript
defineAsyncComponent({
	loader: Promise
    loadingComponent: Component
    errorComponent: Component
});
```

返回一个组件，直接使用就行。

## Teleport

将组件结构和真实DOM结构分开

```vue
<Teleport to="css选择器">
    <Component />
</Teleport>
```

## Reactivity API

### API

|    API     |           传入            |       返回       |                             备注                             |
| :--------: | :-----------------------: | :--------------: | :----------------------------------------------------------: |
| `reactive` |      `plain-object`       |     `Proxy`      |       深度代理对象中的所有成员，如果已经是代理直接返回       |
| `readonly` | `plain-object` or `proxy` |     `Proxy`      |              只能读取代理对象中的成员，不可修改              |
|   `ref`    |           `any`           | `{ value: ... }` | 对 `value` 的访问是响应式的；如果传递的值是一个对象，则会通过 `reactive` 函数进行代理；如果已经是代理，`value` 则是代理，如果是 `ref` 则直接返回 |
| `computed` |        `function`         | `{ value: ... }` |                   返回的格式和 `ref` 相同                    |

- 如果想要让一个对象变为响应式数据，可以使用 `reactive` 或 `ref`
- 如果想要让一个对象的所有属性只读，使用 `readonly`
- 如果想要让一个非对象数据变为响应式数据，使用 `ref`
- 如果想要根据已知的响应式数据得到一个新的响应式数据，使用 `computed`

### 监听

**watchEffect**

```javascript
const stop = watchEffect(() => {
    // 该函数会立即执行，然后追中函数中用到的响应式数据，响应式数据变化后会再次执行
})

// 通过调用stop函数，会停止监听
stop(); // 停止监听
```

**watch**

```javascript
// 监听单个数据的变化
const state = reactive({ count: 0 })
watch(() => state.count, (newValue, oldValue) => {
    // ...
}, options)

// ref 可以直接传递 ref 而不传递函数
const countRef = ref(0);
watch(countRef, (newValue, oldValue) => {
    // ...
}, options)

// 监听多个数据的变化
watch([() => state.count, countRef], ([new1, new2], [old1, old2]) => {
    // ...
});
```

无论是 `watchEffect` 还是 `watch`，当依赖项变化时，回调函数的运行都是异步的（微队列）

除非遇到下面的场景，否则均建议选择 `watchEffect`

- 不希望回调函数一开始就执行
- 数据改变时，需要参考旧值
- 需要监控一些回调函数中不会用到的数据

### 判断

| API          | 含义                                                         |
| ------------ | ------------------------------------------------------------ |
| `isProxy`    | 判断某个数据是否是由`reactive`或`readonly`                   |
| `isReactive` | 判断某个数据是否是通过`reactive`创建的，详细:https://v3.vuejs.org/api/basic-reactivity.html#isreactive |
| `isReadonly` | 判断某个数据是否是通过`readonly`创建的                       |
| `isRef`      | 判断某个数据是否是一个`ref`对象                              |

### 转换

**unref**

等同于：`isRef(val) ? val.value : val`

**toRef**

得到一个响应式对象某个属性的 `ref` 格式

```javascript
const state = reactive({
    foo: 1,
    bar: 2
})

const fooRef = toRef(state, 'foo'); // fooRef: {value: ...}

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

**toRefs**

把一个响应式对象的所有属性转换为ref格式，然后包装到一个`plain-object`中返回

```javascript
const state = reactive({
    foo: 1,
    bar: 2
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs: not a proxy
{
  foo: { value: ... },
  bar: { value: ... }
}
*/
```

## setup提案

在 `setup` 脚本中定义的顶级绑定都会被编译为 `setup` 函数的返回值，顶级绑定：

- `import` 
- 顶级变量

### 组件属性

```javascript
import { defineProps } from 'vue'

const props = defineProps({
    username: {
        type: String,
        required: true
    }
})
```

### emit事件

```javascript
import { defineEmit } from 'vue'
const emit = defineEmit(['click']);
const onClick = () => emit('click');
```

## Ref语法糖

只能适用于SFC中（`.vue` 文件中）

```vue
<script setup>
    Ref: a = 'a';	// const a = Ref('a')
    Ref: b = 'b';
    Ref: c = computed(() => a + b);
</script>
```

## Suspense

fallback插槽：显示的是组件没有加载出来之前显示的内容

default插槽：组件 `setup` 返回的是 `Promise`

用于处理子组件一开始就需要请求数据的情况，请求数据的请求中需要显示 loading

## 生命周期

renderTracked

renderTriggered























