## move语义

通过引用不可以移动所有权，编译器会报这样的错误：

1. `cannot move out of op.next which is behind a shared reference ` 
2. `cannot move out of op.next which is behind a mutable reference` 

```rust
struct IterMut<'a> {
  next: Option<&'a mut i32>,
}

let mut a = 1;

let op = &IterMut { next: Some(&mut a) };
// let op = &mut Demo { next: Some(&mut a) };

let b = op.next;

b.map(|x| *x);
```

对于 `Option` 的可变引用，可以使用 `take` 解决

```rust
let b = op.next.take();

b.map(|x| *x);
```



