## toString

每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。如果此方法在自定义对象中未被覆盖，`toString()` 返回 "[object *type*]"，其中 `type` 是对象的类型。



使用 `toString` 检测对象类型

可以通过 `toString` 来获取每个对象的类型，为了每个对象都能通过 `Object.prototype.toString` 来检测，需要以 `call` 或者 `apply` 的形式来调用，传递要检查的对象作为第一个参数，称为 `thisArg` 

```javascript
var toString = Object.prototype.toString;

toString.call(new Date); // [object Date]
toString.call(new String); // [object String]
toString.call(Math); // [object Math]

//Since JavaScript 1.8.5
toString.call(undefined); // [object Undefined]
toString.call(null); // [object Null]
```

https://blog.doiduoyi.com/articles/1607052417279.html