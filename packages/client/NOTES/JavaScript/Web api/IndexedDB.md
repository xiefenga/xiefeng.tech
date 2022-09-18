# 打开数据库

`indexedDB.open` 方法可以打开数据库，不存在会自动新建数据库。

该方法接收两个参数，第一个是数据库的名字，第二个是数据库的版本，打开已有数据库时，默认为当前版本；新建数据库时，默认为 `1`

```javascript
cosnt request = indexedDB.open(dbName[, version]);
```

该方法返回一个 `IDBRequest` 对象，该对象具有三个事件：

- `error`：打开数据库失败
- `success`：打开数据库成功，此时通过 `requset.result` 或 `e.target.result` 可以拿到数据库对象
- `upgradeneeded`：当数据库不存在或者传入的版本号比当前高，会触发该事件，可以通过相同的方式拿到数据库对象

当打开存在的数据库时，通过 `success` 事件处理后序，当新建数据库/升级版本时通过 `upgradeneeded` 事件处理后序。即 `success` 事件和 `upgradeneeded` 事件只会触发一个。

```javascript
request.onupgradeneeded = e => {
    const db = e.target.result;
    const objectStore = db.createObjectStore('person', { keyPath: 'id' });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
}
```

# 对象仓库

每个数据库包含若干个对象仓库（object store）。它类似于关系型数据库的表格，存储的是一个个 `object` 类型的数据。

## 创建

通过 `db.createObjectStore` 创建对象存储，只能在 `onupgradeneeded` 事件处理函数中创建。

第一个参数为仓库名，第二个参数指定主键。

```javascript
request.onupgradeneeded = e => {
    db = e.target.result;
    let objectStore;
    if (!db.objectStoreNames.contains('person')) {
        objectStore = db.createObjectStore('person', { keyPath: 'id' });
    }
}
```

## 删除

通过`db.deleteObjectStore` 删除对象仓库，该方法也只能用于 `onupgradeneeded` 事件处理函数中。

```javascript
request.onupgradeneeded = e => {
    db = e.target.result;
    db.deleteObjectStore('person', { keyPath: 'id' });
}
```

# 事务

数据记录的读写和删改，都要通过事务完成。这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。

事务要通过调用数据库对象的 `transaction` 方法创建。

第一个参数为第二个参数为访问数据的方式：`readonly`、`readwrite`、`versionchange`，默认为 `readonly`

```javascript
const transaction = db.transaction(['person'], 'readwrite');
const store = transaction.objectStore("person");
const request = store.get("007");

request.onerror = e => console.log("Did not get the object!");
request.onsuccess = e => console.log(e.target.result);
```

为一个事务可以完成任意多个请求，所以事务对象本身也有事件处理程序：`onerror` 和 `oncomplete`。

不能通过 `oncomplete` 事件处理程序的 event 对象访问请求返回的任何数据。

```javascript
transaction.onerror = (event) => {
    // 整个事务被取消
};
transaction.oncomplete = (event) => {
    // 整个事务成功完成
}; 
```

# 新增数据

新建事务以后，通过 `transaction.objectStore(name)` 方法，拿到 `IDBObjectStore` 对象，再通过表格对象的 `add()` 方法，向表格写入一条记录。

```javascript
const transaction = db.transaction(['person'], 'readwrite');
const store = transaction.objectStore('person');
const request = store.add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });

request.onsuccess = e => console.log('数据写入成功');

request.onerror = e => console.log('数据写入失败');
```

# 读取数据

新建事务以后，通过 `transaction.objectStore(name)` 方法，拿到 `IDBObjectStore` 对象，再通过表格对象的 `get()` 方法，向表格写入一条记录

```javascript
const transaction = db.transaction(['person']);
const store = transaction.objectStore('person');
cosnt request = store.get(1);

request.onerror = e => console.log('事务失败');

request.onsuccess = e => {
    if (request.result) {
        console.log('Name: ' + request.result.name);
        console.log('Age: ' + request.result.age);
        console.log('Email: ' + request.result.email);
    } else {
        console.log('未获得数据记录');
    }
};
```

# 更新数据

通过 `IDBObject.put()` 方法更新数据。

`add` 和 `put` 的区别：在新增数据的键名已存在时，`add` 会导致错误，而 `put` 会简单地重写该对象。

```javascript
const request = db.transaction(['person'], 'readwrite')
	.objectStore('person')
	.put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

request.onsuccess = e => console.log('数据更新成功');

request.onerror = e => console.log('数据更新失败');
```

# 删除数据

`IDBObjectStore.delete()` 方法用于删除记录。

```javascript
const request = db.transaction(['person'], 'readwrite')
	.objectStore('person')
	.delete(1);

request.onsuccess = e => console.log('数据删除成功');
```

# 游标

使用事务可以通过一个已知键取得一条记录。如果想取得多条数据，则需要在事务中创建一个游标。

与传统数据库查询不同，游标不会事先收集所有结果。相反，游标指向第一个结果，并在接到指令前不会主动查找下一条数据。

## 创建游标

在对象存储上调用 `openCursor()` 方法创建游标的请求对象，为它添加 `onsuccess` 和 `onerror` 事件处理程序。

`e.target.result` 的值为游标，游标为 `IDBCursor` 实例，当没有下一个值时，游标为 `null`。

```javascript
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
store.openCursor().onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) { // 永远要检查
        console.log(`Key: ${cursor.key}, Value: ${JSON.stringify(cursor.value)}`);
    }
};
request.onerror = e => console.log('error')
```

`IDBCursor` 实例有几个属性：

- `direction`：字符串常量，表示游标的前进方向以及是否应该遍历所有重复的值
	- `next`
	- `nextunique`
	- `prev`
	- `prevunique`
- `key`：键的值
- `value`：从数据库中拿到的对象值
- `primaryKey`：游标使用的键，游标用的键可能是对象键或索引键

## 数据更新

游标原型具有 `updata` 方法，可用来更新数据。

```javascript
const value = cursor.value; // 取得当前对象
value.password = "magic!"; // 更新数据
const updateRequest = cursor.update(value); // 请求保存更新后的对象
updateRequest.onsuccess = () => { };
updateRequest.onerror = () => { };
```

使用 `delelte()` 来删除游标位置的记录。

```javascript
const deleteRequest = cursor.delete(); // 请求删除对象
deleteRequest.onsuccess = () => { };
deleteRequest.onerror = () => { };
```

如果事务没有修改对象存储的权限，`update()` 和 `delete()` 都会抛出错误。

## 移动游标

游标原型具有 `continue` 和 `advance` 方法，用于移动游标。

- `continue([key])`：移动到结果集中的下一条记录。如果指定了 `key`，则游标移动到指定的键
- `advance(count)`：游标向前移动指定的 `count` 条记录

这两个方法都会让游标重用相同的请求，因此也会重用 `onsuccess` 和 `onerror` 处理程序，直至不再需要。

```javascript
request.onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) {
        console.log(`Key: ${cursor.key}, Value: ${JSON.stringify(cursor.value)}`);
        cursor.continue(); // 移动到下一条记录
    } else {
        console.log("Done!");
    }
}; 
```

## 键范围

使用游标会给人一种不太理想的感觉，因为获取数据的方式受到了限制。使用键范围可以让游标更容易管理。

键范围对应 `IDBKeyRange` 的实例，有四种方式指定键范围：

1. 通过 `only()` 方法并传入想要获取的键

	```javascript
	const onlyRange = IDBKeyRange.only("007");
	```

2. `lowerBound()` 定义结果集的下限

	```javascript
	// 从"007"记录开始，直到最后
	const lowerRange = IDBKeyRange.lowerBound("007");
	// 从"007"的下一条记录开始，直到最后
	const lowerRange = IDBKeyRange.lowerBound("007", true);
	```

3. `upperBound()` 定义结果集的上限 / 上下限

	```javascript
	// 从头开始，到"ace"记录为止
	const upperRange = IDBKeyRange.upperBound("ace");
	// 从头开始，到"ace"的前一条记录为止
	const upperRange = IDBKeyRange.upperBound("ace", true);
	// 从"007"记录开始，到"ace"记录停止
	const boundRange = IDBKeyRange.bound("007", "ace");
	// 从"007"的下一条记录开始，到"ace"记录停止
	const boundRange = IDBKeyRange.bound("007", "ace", true);
	// 从"007"的下一条记录开始，到"ace"的前一条记录停止
	const boundRange = IDBKeyRange.bound("007", "ace", true, true);
	// 从"007"记录开始，到"ace"的前一条记录停止
	const boundRange = IDBKeyRange.bound("007", "ace", false, true);
	```

定义了范围之后，把它传给 `openCursor()` 方法，就可以得到位于该范围内的游标，如果传递 `null`，表示键范围是所有值。

```javascript
const store = db.transaction("users").objectStore("users");
const range = IDBKeyRange.bound("007", "ace");
store.openCursor(range).onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) { // 永远要检查
        console.log(`Key: ${cursor.key}, Value: ${JSON.stringify(cursor.value)}`);
        cursor.continue(); // 移动到下一条记录
    } else {
        console.log("Done!");
    }
}; 
```

## 游标方向

`openCursor()` 方法实际上可以接收两个参数，第一个是 `IDBKeyRange` 的实例，第二个是表示方向的字符串。

通常，游标都是从对象存储的第一条记录开始，每次调用 `continue()` 或 `advance()` 都会向最后一条记录前进。

默认值为 `next`，如果传递 `nextunique`，则会跳过键重复的项。`prev`、`prevunique` 则是相反。

```javascript
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
const request = store.openCursor(null, "nextunique");
```

# 索引

索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键。

## 创建索引

要创建新索引，首先要取得对象存储的引用，然后调用 `createIndex()`

```javascript
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
const index = store.createIndex("username", "username", { unique: true });
```

`createIndex` 的第一个参数是索引的名称，第二个参数是索引属性的名称，第三个参数是包含 键 `unique` 的 `options` 对象。这个选项中的 `unique` 应该必须指定，表示这个键是否在所有记录中唯 一。

`createIndex()` 返回的是 `IDBIndex` 实例。在对象存储上调用 `index()` 方法也可以得到同一个实例。

```javascript
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
const index = store.index("username");
```

## 创建游标

在索引上使用 `openCursor()` 方法创建新游标，这个游标与在对象存储上调用 `openCursor()` 创建的游标完全一样。区别仅在于其`result.key` 属性中保存的是索引键，而不是主键。

```javascript
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
const index = store.index("username");
const request = index.openCursor();
request.onsuccess = e => { }; 
```

使用 `openKeyCursor()` 方法也可以在索引上创建特殊游标，只返回每条记录的主键。

这个方法接收的参数与 `openCursor()` 一样。不同在于 `event.result.key` 是索引键，且 `event.result.value` 是主键而不是整个记录。

## 获取数据

可以使用 `get()` 方法并传入索引键通过索引取得单条记录

```javascript
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
const index = store.index("username");
const request = index.get("007");
request.onsuccess = e => { };
request.onerror = e => { };
```

## 删除索引

在对象存储上调用 `deleteIndex()` 方法并传入索引的名称可以删除索引

```javascript
const transaction = db.transaction("users");
const store = transaction.objectStore("users");
const store.deleteIndex("username");
```

# 并发

如果两个不同的浏览器标签页同时打开了同一个网页，则有可能出现一个网页尝试升级数据库而另一个尚未就绪的情形。

第一次打开数据库时，添加 `onversionchange` 事件处理程序非常重要。另一个同源标签页将数据库打开到新版本时，将执行此回调。

对这个事件最好的回应是立即关闭数据库，以便完成版本升级。

```javascript
let request, database;
request = indexedDB.open("admin", 1);
request.onsuccess = e => {
    database = e.target.result;
    database.onversionchange = () => database.close();
}; 
```





