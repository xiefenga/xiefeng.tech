# 基础查询

通过 `SELECT` 语句进行查询：

```mysql
SELECT
	prod_name
FROM
	products;
```

- 查询列表可以是：表中的字段、常量值、表达式、函数
- 查询的结果是一个虚拟的表格

## 字段查询

查询多个字段，使用 `,` 分隔

```mysql
SELECT
	prod_id,
	prod_name,
	prod_price 
FROM
	products;
```

使用通配符 `*` 查询所有字段

```mysql
SELECT * FROM products;
```

## 去重查询

使用关键字 `DISTINCT`，将其直接放在列名之前。

```mysql
SELECT DISTINCT vend_id FROM products;
```

不能部分使用 `DISTINCT`，该关键字应用于**所有列**而不仅仅是前置它的列。

所以如果给出了多个列，只有这些列都相同才好使，但是不会报错会列出所有的行。

## 查询别名

使用 `AS` 关键词起别名，`AS` 也可省略用空格代替。

  ```mysql
SELECT
	prod_name AS 名称,
	prod_price  AS 价格
FROM
	products;
  ```

## 完全限定

1. 完全限定列

	可以使用完全限定的名字来引用列，也就是同时使用表名和列名

	```mysql
	SELECT
		products.prod_name 
	FROM
		products;
	```

2. 完全限定表

	表名也是可以完全限定的，即使用数据库名和表名

	```mysql
	SELECT
		products.prod_name 
	FROM
		crashcourse.products;
	```

## 其他查询

1. 查询常量
2. 查询表达式
3. 查询函数

```mysql
-- 常量
SELECT 100;
-- 表达式
SELECT 100 % 98;
-- 函数
SELECT VERSION();
```

# 分页查询

使用 `LIMIT` 子句进行对于查询的结果数量进行限制：

```mysql
SELECT
	prod_name
FROM
	products
LIMIT 5;
```

- 查询结果的行数是从第 0 行开始计算

- `LIMIT 5` 指示返回的结果不多于 5 行
- `LIMIT 5, 5` 指示返回从第 5 行开始 5 行的数据
- MySQL 5 添加了 `LIMIT 4 OFFSET 3` 的语法，相当于 `LIMIT 3, 4`

# 过滤数据

使用 `WHERE` 子句进行数据过滤：

```mysql
SELECT
	prod_name,
	prod_price 
FROM
	products 
WHERE
	prod_price = 2.50;
```

## 范围操作符

- `>`、` =`、`!=`、`<>`、`<=>`、`>=`、`<=`

  - `<>` 和 `!=` 相同，没有区别，都是不等于
  - `<=>` 安全等于，`!=` 和 `=` 无法判断 `null`，`<=>` 可以判断 `null`
  - 执行匹配时默认不区分大小写（字符串）

- `BETWEEN ... AND ...`
- 相当于 `>= ... AND  <= ...`
  - 可以用于日期类型数据

## 空值查询

使用 `IS`、`IS NOT` 操作符来判空 `NULL`，`=` 无法判断 `NULL` 

```mysql
SELECT
	prod_name 
FROM
	products 
WHERE
	prod_price IS NULL;
```

## 逻辑操作符

`AND`、`OR`、`NOT`

```mysql
SELECT
	last_name,
	salary,
	commission_pct 
FROM
	employees 
WHERE
	salary >= 10000 AND salary <= 20000;
```

优先级：`AND` 优先级比 `OR` 高，判断比较复杂的时候可以加上 `()`

## IN操作符

判断某字段的值是否属于 `IN` 列表中的某一项，列表的值类型必须一致或兼容，列表中不支持通配符

```mysql
SELECT
	prod_name,
	prod_price 
FROM
	products 
WHERE
	vend_id IN ( 1002, 1003 );
```

- 语法更清晰直观
- 查询速度更快
- 可以包含其他 `SELECT` 语句

## LIKE操作符

使用 `LIKE` 可以进行模糊查询，`%` 表示任意个字符（包括0个），`_` 表示单个任意字符

```mysql
SELECT
	prod_id,
	prod_name 
FROM
	products 
WHERE
	prod_name LIKE 'jet%'
```

## 正则查询

使用 `REGEXP` 关键字代替 `LIKE` 可以使用正则表达式匹配来进行数据过滤。

MySQL 仅支持多数正则表达式实现的一个**很小**的子集。

```mysql
SELECT
	prod_name 
FROM
	products 
WHERE
	prod_name REGEXP '1000';
```

MySQL 中正则表达式的匹配不区分大小写，需要区分大小写需要使用 `REGEXP BINAR` 关键字

# 排序查询

使用 `ORDER BY` 语句进行排序：

```mysql
SELECT
	prod_name 
FROM
	products 
ORDER BY
	prod_name ASC;
```

- `ASC` 升序，`DESC` 降序，默认升序
- `ORDER BY` 子句支持单个字段、别名、表达式、函数、多个字段排序
- `ORDER BY` 子句在查询语句的最后面，除了 `LIMIT` 子句

## 按单个字段排序

```mysql
SELECT
	* 
FROM
	employees 
ORDER BY
	salary DESC;
```

## 按表达式排序

```mysql
SELECT
	salary * 12 * ( 1 + IFNULL( commission_pct, 0 ) ) AS 年薪 
FROM
	employees 
ORDER BY
	salary * 12 *( 1 + IFNULL( commission_pct, 0 ) ) DESC;
```

## 按别名排序

```mysql
SELECT
	salary * 12 * ( 1 + IFNULL( commission_pct, 0 ) ) AS 年薪
FROM
	employees 
ORDER BY
	年薪 ASC;
```

## 按函数排序

```mysql
SELECT
	last_name 
FROM
	employees 
ORDER BY
	LENGTH( last_name ) DESC;
```

## 按多个字段排序

```mysql
SELECT
	* 
FROM
	employees 
ORDER BY
	salary DESC,
	employee_id ASC;
```

# CASE语句

条件可以写在 `CASE` 后面也可以写在 `WHEN` 后面，`END` 代表这个 `CASE` 结束了，可以在 `END` 后使用别名

两种用法类似于 `switch..case..` 和 `if..else if ..` 的区别

**第一种用法**

```mysql
SELECT salary AS 原始工资, department_id,
	CASE department_id 
		WHEN 30 THEN salary * 1.1 
		WHEN 40 THEN salary * 1.2 
		WHEN 50 THEN salary * 1.3
		ELSE salary 
	END AS 新工资 
FROM
	employees;
```

**第二种用法**

```mysql
SELECT salary,
	CASE
		WHEN salary > 20000 THEN 'A' 
		WHEN salary > 15000 THEN 'B' 
		WHEN salary > 10000 THEN 'C'
		ELSE 'D' 
	END AS 工资级别 
FROM
	employees;
```

# 分组查询

使用 `GROUP BY` 子句进行分组：

```mysql
SELECT 查询列表
FROM 表
WHERE 筛选条件
GROUP BY 分组的依据
ORDER BY 排序的字段;
```

- `GROUP BY` 子句指示 MySQL 分组数据，然后对每个组而不是整个结果进行聚集
- `GROUP BY` 子句必须在 `WHERE` 子句之后，`ORDER BY` 子句之前

## 简单分组

```mysql
SELECT
	MAX( salary ) 
FROM
	employees 
WHERE
	email LIKE '%a%' 
GROUP BY
	department_id;
```

## 过滤分组

当分组查询后需要继续过滤数据，就需要用到 `HAVING` 语句：

```mysql
-- 查询部门员工数量大于5的部门id和员工数量
SELECT
	COUNT(*),
	department_id 
FROM
	employees 
GROUP BY
	department_id 
HAVING
	COUNT(*)> 5;
```

`HAVING` 子句和 `WHERE` 子句的区别：

- `WHERE` 过滤行，`HAVING` 过滤分组
- `WHERE` 分组前过滤，`HAVING` 分组后过滤

## 多个字段分组

将多个字段都相同的分为一组

```mysql
SELECT
	MIN( salary ) 
FROM
	employees 
GROUP BY
	department_id,
	job_id 
ORDER BY
	MIN( salary ) DESC;
```

# 子句顺序

`SELECT` 子句使用顺序：

1. `SELECT`
2. `FROM`
3. `WHERE`
4. `GROUP BY`
5. `HAVING`
6. `ORDER BY`
7. `LIMIT`

# 连接查询

当查询的字段来自于多个表时，就可以使用连接查询。

## 笛卡尔积

在连接两个表时，实际上做的是将第一个表的每一行与第二个表中的每一行配对。

`WHERE` 子句可以将不需要的行过滤掉，在连接查询时这个条件叫做连接条件。

当没有连接条件时连接查询返回的结果就是**笛卡尔积**，检索出的行数时两表行数的乘积。

为了避免笛卡尔集，可以在 `WHERE` 加入有效的连接条件。

## 内连接

内连接查询操作只列出与连接条件匹配的数据行，也就是交集

- 根据所使用的**比较方式**不同，分为等值连接、非等值连接。

- n表连接，至少需要n-1个连接条件
- 一般需要为表起别名

### SQL92

将连接条件写在 `WHERE` 后进行过滤的是 SQL92 语法

```mysql
SELECT
	vend_name,
	prod_name,
	prod_price 
FROM
	vendors,
	products 
WHERE
	vendors.vend_id = products.vend_id;
```

### SQL99

SQL99 语法使用 `INNER JOIN` 语法来实现表的内连接

```mysql
SELECT
	vend_name,
	prod_name,
	prod_price 
FROM
	vendors
	INNER JOIN products ON vendors.vend_id = products.vend_id;
```

- `INNER` 关键字可以省略
- 连接条件在 `ON` 后面
- 可以接着使用 `WHERE` 进行过滤
- 筛选条件放在 `WHERE` 后面，连接条件放在 `ON` 后面，提高分离性，便于阅读

**区别**

- **WHERE 没有 ON 效率高**
- ON 匹配到第一条成功的就结束，其他不匹配；若没有，不进行匹配
-  WHERE 会一直匹配，进行判断

## 自然连接

在返回所有结果的等值连接中，必然至少有一个列是重复的，自然连接就是自己选择结果集合中所包括的列。

## 自连接

自连接就是同一张表和同一张表进行连接，当一张表中有两个以上的字段有一定的关系时就可能用到自连接。

```mysql
-- mysql92
SELECT
	e.last_name,
	m.last_name 
FROM
	employees e,
	employees m 
WHERE
	e.`manager_id` = m.`employee_id`;

-- mysql99
SELECT
	e.last_name,
	m.last_name 
FROM
	employees e
	JOIN employees m ON e.`manager_id` = m.`employee_id`;
```

## 外连接

外连接不只列出与连接条件相匹配的行，而且还加上左表(左外连接时)或右表(右外连接时)或两个表(全外连接时)中所有符合搜索条件的数据行

外连接只有 SQL99 支持，SQL92 不支持。

### 左外连接

左外连接从左边表（`FROM`）中选择所有行，另一个表中没有的数据则显示 `NULL`

```mysql
SELECT
	customers.cust_id,
	orders.order_num 
FROM
	customers
	LEFT OUTER JOIN orders ON customers.cust_id = orders.cust_id;
```

- `OUTER` 关键字可以省略
- 可以多表连接
- 多表连接时先连接成一个大表再和后面的表依次进行连接，主表在左边

### 右外连接

右外连接从右边表（`FROM`）中选择所有行，另一个表中没有的数据则显示 `NULL` 

```mysql
SELECT
	customers.cust_id,
	orders.order_num 
FROM
	orders
	RIGHT OUTER JOIN customers ON customers.cust_id = orders.cust_id;
```

### 全外连接

全外连接就是两个表中的行都有，每一个表中不匹配的行列的数据为 `NULL`

全外连接使用 `FULL OUTER JOIN` 关键字MySQL 不支持全外连接

```mysql
SELECT
	b.*,
	bo.* 
FROM
	beauty b
	FULL OUTER JOIN boys bo ON b.`boyfriend_id` = bo.id;
```

## 交叉连接

交叉连接就是笛卡尔积，交叉连接使用 `CROSS JOIN` 关键字

```mysql
SELECT
	b.*,
	bo.* 
FROM
	beauty b
	CROSS JOIN boys bo;
```

# 子查询

子查询就是嵌套在其他查询中的查询（出现在其他语句中的 `SELECT`语句）

子查询可以出现的位置：

- `SELECT` 之后
- `FROM` 之后
- `WHERE` 之后
- `HAVING` 之后
- `EXISTS` 之后

子查询的结果的行和列的数量必须要合法，要和使用的位置所需要的格式相匹配。

```mysql
SELECT
	cust_id 
FROM
	orders 
WHERE
	order_num IN ( SELECT order_num FROM orderitems WHERE prod_id = 'TNT2' );
```

在 `SELECT` 语句中，子查询总是由内向外处理，先运行子查询再运行主查询。

对于 `IN` 操作符内部的子查询，查询出来的多行单列的结果会以 `IN` 操作符要求的逗号分隔的格式传递给外部。

## 相关子查询

当**子查询中**涉及到**外部查询**的子查询称之为相关子查询

`SELECT` 之后的子查询会在检索每一行时都会执行一遍，对于每个 customer 都会在执行一边子查询。

```mysql
SELECT
	cust_name,
	cust_state,
	( SELECT count(*) FROM orders WHERE orders.cust_id = customers.cust_id ) AS orders 
FROM
	customers 
ORDER BY
	cust_name;
```

## EXISTS

当 `EXISTS` 子句中的子查询有结果返回 1，否则返回 0

```mysql
SELECT EXISTS ( SELECT * FROM products WHERE vend_id IS NULL );
```

## ANY/SOME/ALL

`ANY`、`SOME` 和 `ALL`  中只能放子查询，和 `IN`、`NOT IN` 子句一样后面放的是多行单列的子查询

- `ANY`、`SOME` 是一样的，只要和其中的任意一个数据比较满足就可以。

- `ALL` 则是和其中所有的进行比较满足才可以。

```mysql
SELECT
	prod_name,
	vend_id 
FROM
	products 
WHERE
	vend_id > ALL ( SELECT DISTINCT vend_id FROM products WHERE vend_id IN ( 1001, 1002 ) );
```

# 联合查询

联合查询就是将多条查询语句的结果合并成一个结果。

```mysql
SELECT
	vend_id,
	prod_id,
	prod_price 
FROM
	products 
WHERE
	prod_price <= 5
UNION
SELECT
	vend_id,
	prod_id,
	prod_price 
FROM
	products 
WHERE
	vend_id IN ( 1001, 1002 );
```

- `UNION` 必须由两条或两条以上的 `SELECT` 语句组成
- `UNION` 中的每个查询必须包含**相同的列**
- `UNION` 从查询结果中自动去除了的**重复的行**
- 想返回所有匹配的行，使用 `UNION ALL`
- 只能使用一条 `ORDER BY` 子句，必须出现在最后一条 `SELECT` 语句之后，MySQL 使用它来给整个结果排序
- `UNION` 几乎总是完成与多个 `WHERE` 条件相同的工作

# 插入数据

使用 `SELECT INTO` + 表名向表中插入一行数据：

```mysql
INSERT INTO customers
VALUES
	( NULL, 'Prp E. LaPew', '100 Main Street', 'Los Angeles', 'CA', '90046', 'USA', NULL, NULL );
```

- 这种方式需要传入所有的字段，以及顺序高度依赖表中列定义的次序
- `NULL` 可以传递给主键，MySQL 会忽略该值自动插入递增的值

比较安全的 `INSERT` 语句是写出插入的字段：

```mysql
INSERT INTO customers ( cust_name, 
	cust_address, 
	cust_city, 
	cust_state,
	cust_zip, 
	cust_country, 
	cust_contact, 
	cust_email )
VALUES
	( 'Prp E. LaPew', '100 Main Street', 'Los Angeles', 'CA', '90046', 'USA', NULL, NULL );
```

- 可以省略允许定义为 `NULL` 或有默认值的列
- 列的顺序随意

## 多行插入

插入多行可以使用多条 `INSERT` 语句，也可以使用 `,` 分隔多组值：

```mysql
INSERT INTO customers ( cust_name, 
	cust_address, 
	cust_city, 
	cust_state,
	cust_zip, 
	cust_country, 
	cust_contact, 
	cust_email )
VALUES
	( 'Prp E. LaPew', '100 Main Street', 'Los Angeles', 'CA', '90046', 'USA', NULL, NULL ),
	( 'M. Martain', '42 Galaxy Way', 'New York', 'NY', '11213', 'USA' );
```

## 检索插入

可以使用 `INSERT SELECT` 插入查询出来的数据：

```mysql
INSERT INTO customers ( cust_contact, 
	cust_email, 
	cust_name, 
	cust_address, 
	cust_city, 
	cust_state, 
	cust_zip, 
	cust_country ) 
SELECT
    cust_contact,
    cust_email,
    cust_name,
    cust_address,
    cust_city,
    cust_state,
    cust_zip,
    cust_country 
FROM
	customers 
WHERE
	cust_contact IS NOT NULL;
```

`INSERT` 和 `SELECT` 中的列名不要求相同，MySQL 不关心列名只关心位置

# 更新数据

使用 `UPDATE` 语句更新表中的数据，

```mysql
UPDATE customers 
SET cust_email = 'elmer@fudd.com' 
WHERE
	cust_id = 10005;
```

- `UPDATE` 会更新符合条件的行，没有条件则会更行所有行
- 通过 `SET` 改变字段的值

## 更新多个列

在更新多个列时只需要使用单个 `SET` ，每个 `列=值` 之间使用 `,` 分隔，最后一列不需要。

```mysql
UPDATE customers 
SET cust_email = 'elmer@fudd.com',
	cust_name = 'The Fudds' 
WHERE
	cust_id = 10005;
```

## IGNORE

当使用 `UPDATE` 语句更新多个行时，当在更新过程中出现错误，则整个 `UPDATE` 操作会被取消，数据会恢复到之前的值。

使用 `IGNORE` 关键字可以即使发生错误也继续更新。

```mysql
UPDATE IGNORE customers ...
```

## 更新多表

```mysql
UPDATE products
INNER JOIN vendors ON products.vend_id = vendors.vend_id 
SET vendors.vend_name = 'The Fudds',
	products.prod_name = 'Wascals' 
WHERE
	products.prod_id = 'FC';
```

# 删除数据

使用 `DELETE` 语句删除特定的行：

```mysql
DELETE 
FROM
	customers 
WHERE
	cust_id = 10006;
```

- `DELETE` 会删除符合条件的行，没有条件则会删除所有行
- `DELETE FROM` 指定删除数据的表名
- 可以和 `UPDATE` 一样删除多个表

## 删除多表

`DELETE` 后面跟的是要删除的表，`FROME` 后面跟的是连接的主表

```mysql
DELETE b, bo 
FROM
	beauty b
	INNER JOIN boys bo ON b.`boyfriend_id` = bo.`id` 
WHERE
	bo.`boyName` = '黄晓明';
```

## 更快的删除

如果要从表中删除所有的行，使用 `TRUNCATE TABLE` 语句更合适：

```mysql
TRUNCATE TABLE customers ;
```

- `TRUNCATE TABLE` 的速度比 `DELETE` 更快
- `TRUNCATE` 的本质是删除原来的表然后重新创建一个表



