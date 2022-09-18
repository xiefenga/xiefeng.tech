`>>>`

- `NaN Infinity -Infinity >>> 0 === 0`
- `1.1 >>> 0 === 1`

# castArray

使用 剩余参数，可以很好的 区分没有传递参数 和 传递 undefined 

# eq

`===` 可以判断除了 `NaN` 之外其他所有类型的值，包括 `+0 === -0`

`Object.is` 可以判断 `NaN`，但是无法判断 `+0` 和 `-0`

```javascript
function eq(value, other) {
  return value === other || (value !== value && other !== other)
}
```

# isArguments

arguments 对象的 tag ： '[object Arguments]'



# isArrayLike 和 isArrayObjectLike

isArrayLike 只要符合有 `length` 属性就行

isArrayObjectLike 在 isArrayLike 的基础上增加了 isObject 的限制

两者的区别是对于 字符串 的判定结果

