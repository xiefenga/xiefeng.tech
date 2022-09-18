# stringify

在序列化 JavaScript 对象时，函数和原型成员都会被省略，值为 `undefined` 的任何属性也会被跳过，只会保留符合JSON格式的数据

该方法可以传递任何 JavaScript 值，对于符合 JSON 格式的值，也会返回字符串表示，其余返回 `undefined`

```javascript
JSON.stringify(1234)	// '1234'
JSON.stringify('1234')	// '"1234"'
JSON.stringify([1, 2, 3])	// '[1,2,3,4]'
```

**序列化选项**

`JSON.stringify()` 方法除了要序列化的对象，还可以接收两个参数，这两个参数可以用于指定其他序列化 JavaScript 对象的方式。

第一个参数是过滤器，可以是数组或函数；第二个参数是用于缩进结果 JSON 字符串的选项。

## 过滤

- 如果第二个参数是一个数组，那么 `JSON.stringify()` 返回的结果只会包含该数组中列出的对象属性

  ```javascript
  const book = {
    title: "Professional JavaScript",
    authors: [
      "Nicholas C. Zakas",
      "Matt Frisbie"
    ],
    edition: 4,
    year: 2017
  }
  JSON.stringify(book, ["title", "edition"]) // {"title":"Professional JavaScript","edition":4}
  ```

- 如果第二个参数是一个函数，则函数的返回值就是该属性对应的值，返回 `undefined` 会导致该属性被忽略

  ```javascript
  JSON.stringify(book, (key, value) => {
    switch(key) {
      case "authors":
        return value.join(",")
      case "year":
        return 5000
      case "edition":
        return undefined
      default:
        return value
    }
  })
  // {"title":"Professional JavaScript","authors":"Nicholas C. Zakas,MattFrisbie","year":5000} 
  ```

## 缩进

`JSON.stringify()` 第三个参数控制缩进

- 在这个参数是数值时，会自动插入换行符并缩进相应的数值，最大缩进值为 10，大于 10 的值会自动设置为 10

  ```javascript
  JSON.stringify(book, null, 4)
  /*
  {
      "title": "Professional JavaScript",
      "authors": [
          "Nicholas C. Zakas",
          "Matt Frisbie"
      ],
      "edition": 4,
      "year": 2017
  }
  */
  ```

- 如果缩进参数是一个字符串，就会使用这个字符串来缩进，如果字符串长度超过 10，则会在第 10 个字符处截断

  ```javascript
  JSON.stringify(book, null, "--" )
  /*
  {
  --"title": "Professional JavaScript",
  --"authors": [
  ----"Nicholas C. Zakas",
  ----"Matt Frisbie"
  --],
  --"edition": 4,
  --"year": 2017
  }
  */
  ```

##  toJSON

有时候，对象需要在 `JSON.stringify()` 之上自定义 JSON 序列化

可以在要序列化的对象中添加 `toJSON()` 方法，序列化时会基于这个方法返回适当的 JSON 表示

原生 `Date` 对象就 有一个 `toJSON()` 方法，能够自动将 JavaScript 的 `Date` 对象转换为 ISO 8601 日期字符串

对于嵌套对象返回 `undefined` 会导致，该属性被略过，对于其他值返回什么值就是什么

在使用了该方法时，序列化的步骤：

1.  如果可以获取实际的值，则调用 `toJSON()` 方法获取实际的值，否则使用默认的值进行序列化
2.  如果提供了第二个参数，则应用过滤
3. 顾虑函数返回的每个值都会相应地进行序列化，所以字符串会被序列化为带双引号的字符串，`'1'` 会被序列化为 `'"1"'`
4. 如果提供了第三个参数，则相应地进行缩进

# parse

如果给 `JSON.parse()` 传入的 JSON 字符串无效，则会导致抛出错误

`JSON.parse()` 方法也可以接收一个额外的函数，该函数会针对每个键值对都调用一次

该函数也接收两个参数：属性名和属性值，返回值即为该属性最终的属性值，返回 `undefined`，则结果中就会删除相应的项

使用该函数可以将日期字符串转换为 `Date` 对象：

```javascript
const book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017,
  releaseDate: new Date(2017, 11, 1)
}
const jsonText = JSON.stringify(book)
const bookCopy = JSON.parse(
  jsonText, 
  (key, value) => key == "releaseDate" ? new Date(value) : value
)
```

