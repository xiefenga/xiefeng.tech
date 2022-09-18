# 字节流

- 字节流的基类是 `InputStream` 和 `OutputStream`
- 字节流每次读写以字节为单位
- 常用的字节流有 `FileInputStream` 、`FileOutputStream`

![字节流继承关系](http://oss.xiefeng.tech/img/20210426090358.png)

字节流的读写是以字节为单位进行读写，`InputStream` 提供了三种方式让我们进行读：

- `int read()`
- `int read(byte[] b)`
- `int read(byte[] b, int off, int len)`

`read()` 方法每次读取一个字节，读取的字节会以 `int` 形式返回，返回 `-1` 表明读取完毕。

后两个方法是传入 `byte` 数组作为缓冲区，返回值为写入数组的数据长度，返回 `-1` 表明读取完毕。

`read` 方法都是调用一次读取一次，连续读需要连续调用。

```java
public static void byteStreamInput() {
    try(InputStream is = new FileInputStream(new File("test.md"));) {
        byte[] data = new byte[1024];
        int len;
        while ((len = is.read(data)) != -1) {
            System.out.print(new String(data, len));
        }
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

`OutputStream` 同样也提供了类似的方式进行写入：

- `void write(int b)`
- `void write(byte[] b)`
- `void write(byte[] b, int off, int len)`

输出流在创建的时候可以选择是覆盖还是追加，构造函数有一个重载可以传入第二个参数 `true`

```java
public static void byteStreamOutput() {
    try(OutputStream os = new FileOutputStream(new File("test.txt"));) {
        os.write(68);
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

使用字节流可以读取任何内容，但是读取中文的文本文件不是很适合，因为文本文件采用了各种编码方式仅仅使用字节流读取然后将每个字节转为 `char` 会产生乱码。

# 字符流

- 最终继承自 `Reader`、`Writer`
- 读取的单位以字符为单位
- 常用的是字符流有 `FileReader` 、`FileWriter`

![字符流继承关系](http://oss.xiefeng.tech/img/20210426093904.png)

`Reader` 同样也提供了类似的读取方式：

- `int read()`
- `int read(char[] b)`
- `int read(char[] b, int off, int len)`

字符流的读取返回的都是以字符为单位，`read` 以 `int` 的形式返回单个字符的编码。

和字节流相同返回 `-1` 代表文件读取完毕。

```java
public static void charStreamInput() {
    try(Reader reader = new FileReader(new File("test.md"))) {
        int data;
        while ((data = reader.read()) != -1) {
            System.out.print((char)data);
        }
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

`Writer` 提供了一些写入方式：

- `void write(int c)`
- `void write(char[] buf)`
- `void write(char[] buf, int off, int len)`
- `void write(String str)`
- `void write(String str, int off, int len)`

和字节流一样，构造函数有一个追加的重载，传入第二个参数 `true`，即可将写入的内容以追加的方式写入

```java
public static void charStreamOutput() {
    try(Writer writer = new FileWriter(new File("test.txt"), true)) {
        writer.write("ssss");
        writer.write("ssss");
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

Writer 也实现了 `append` 方法，按名字来看这个方法做的应该是追加写入，但是这个方法本质上是直接调用的 `write`。

当没有传入第二个参数时，该函数也是覆盖写入。

区别的话就是：

- 可以传入 `null` 写入 `"null"` 
- 该方法返回 `this` 可以链式调用

```java
public static void charStreamOutput() {
    try(Writer writer = new FileWriter(new File("test.txt"), true)) {
        writer.append("ssss").append("ssss");
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

# 转换流

在字符流的继承关系中存在 `InputStreamReader` 和 `OutputStreamWriter` 两个类，这两个类可以将字节流转换成字符流。

这两个类实现了字符流的所有功能，字符流本质上也是依赖字节流实现，这两个类比较通用传入字节流帮你实现字符流。

实际上，常用的 `FileReader` 和 `FileWriter` 继承自这两个类并且没有做任何扩展，在内部构造了一个字节流来实现字符流。

```java
public class FileReader extends InputStreamReader {

    public FileReader(String fileName) throws FileNotFoundException {
        super(new FileInputStream(fileName));
    }

    public FileReader(File file) throws FileNotFoundException {
        super(new FileInputStream(file));
    }

    public FileReader(FileDescriptor fd) {
        super(new FileInputStream(fd));
    }

}
```

这两个类不仅 `FileReader` 和 `FileWriter` 内部使用了，我们也可以在需要将字节流转为字符流时借助这两个类。

在转换时可以传入编码，而不是使用默认的编码。

# 缓冲流

字节流、字符流，都是无缓冲的 I/O 流，每个读写操作均由底层操作系统直接处理，这样每个读写操作通常会触发磁盘访问，因此大量的读写操作，可能会使程序的效率大大降低。

**缓冲输入流：**从缓冲区读取数据，并且只有当缓冲区为空时才调用本地的输入 API

**缓冲输出流：**将数据写入缓冲区，并且只有当缓冲区已满时才调用本地的输出 API

在字符流和字节流的继承体系中，存在着 `Bufferd` 开头的流：

- `BufferedInputStream`、`BufferedOutputStream`
- `BufferedReader`、`BufferedWriter`

缓冲流的默认缓冲区大小是 8192 字节（8KB），可以通过构造方法传参设置缓冲区大小。

缓冲流的使用方式：将无缓冲流传递给缓冲流的构造方法（将无缓冲流包装成缓冲流），API 和原始流的使用都是一样的。

`BufferedReader` 扩展了一个方法 `readLine` 一行一行的读取内容，结束返回 `null`。

```java
public static void bufferStreamInput() {
    try(BufferedReader reader = new BufferedReader(new FileReader("test.md"))) {
        String data = null;
        while ((data = reader.readLine()) != null) {
            System.out.println(data);
        }
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

`BufferedWriter` 也扩展了一个方法 `newLine` 用于写入一个换行符。

```java
public static void bufferedStreamOuput() {
    try(BufferedWriter writer = new BufferedWriter(new FileWriter("test.txt"))){
        writer.write("hehe");
        writer.newLine();
        writer.write("lala");
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

当缓冲流中的缓冲区没有满时，数据是不会写入文件的。当缓冲流被关闭时会刷新缓冲区，如果当流没有关闭时需要刷新缓冲区可以使用 `flush` 方法手动刷新缓冲区将数据写入磁盘。

# 输出流

有两个输出流：`PrintStream` 和 `PrintWriter` 一个属于字节流，一个属于字符流。

通过传入相应的流（字符流，字节流）构造这两个流的实例，这两个流的 API 差不多，可以直接通过 `print` 方法来进行写入操作。

`PrintStream` 虽然是字节流，但是内部利用了字符流实现了很多功能。这两个流都可以创建格式化输出的流，但是 `PrintWriter` 更常用。

```java
public static void main(String[] args) {
    try(PrintWriter pw = new PrintWriter(new FileWriter("test.txt"))) {
        pw.println("aaaa");
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

`System.out` 为一个 `PrintStream`，且默认使用的流是标准输出流。

`System.setOut` 可以重新设置 `System.out` 这个 `PrintStream` 内部所使用的字节流。

怎么创建标准输出流？

- `FileOutputStream` 和 `FileWriter` 的构造函数都有有一个重载，通过传入文件描述符创建流。

- `FileDescriptor` 有三个静态属性：`out`、`err`、`in` 对应着标准输出和输入。
- 通过传入 `FileDescriptor.out` 即可创建标准输出流。

```java
public static void main(String[] args) {
    try {
        System.setOut(new PrintStream(new FileOutputStream("test.txt")));
        System.out.print("aaa");  // 输出到文件
        System.setOut(new PrintStream(new FileOutputStream(FileDescriptor.out)));
        System.out.print("aaaa"); // 控制台输出
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    }
}
```

# 标准输入

通过 `FileDescriptor.in` 可创建标准输入流，利用 `FileInputStream` 或 `FileReader` 即可创建标准输入流。

`System.in` 是 `InputStream` 类型，默认使用的就是标准输入流，可以通过 `System.setIn` 修改。

利用标准输入可以从控制台读取数据。

```java
public static void main(String[] args) {
    try(InputStream is = new FileInputStream(FileDescriptor.in)) {
        int data;
        while ((data = is.read()) != (char)'\n') {
            System.out.print((char)data);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

`java.util.Scanner` 是一个可以使用正则表达式来解析基本类型和字符串的简单文本扫描器。

它默认利用空白（空格\制表符\行终止符）作为分隔符将输入分隔成多个 token。

`Scanner` 构造函数具有一个根据 `InputStream` 读取数据的重载，利用这个重载创建的对象可以根据标准输入读取数据。

```java
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    System.out.print(scanner.nextLine());
}
```

# 数据流

数据流支持基本类型、字符串类型的 IO 操作。`DataInputStream` 、`DataOutputStream` 都是字节流，但是提供了方法可以直接读写基本类型和字符串。

写入和读取的顺序必须相同，不然读取的结果是错误的。

```java
public static void main(String[] args) {
    dataStreamOutput();
    dataStreamInput();
}

public static void dataStreamOutput() {
    try(DataOutputStream os = new DataOutputStream(new FileOutputStream("test.txt"))){
        os.writeInt(98);
        os.writeBoolean(true);
        os.writeUTF("hahahahah");
        os.writeDouble(9.0);
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}

public static void dataStreamInput() {
    try(DataInputStream is = new DataInputStream(new FileInputStream("test.txt"))) {
        System.out.println(is.readInt());
        System.out.println(is.readBoolean());
        System.out.println(is.readUTF());
        System.out.println(is.readDouble());
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

# 对象流

![](http://oss.xiefeng.tech/img/20210427164305.png)

对象流和数据流都是字节流，对象流用于支持引用类型的 IO 操作。

只有实现了 `java.io.Serializable` 接口的类才能使用对象流进行 IO 操作，`Serializable` 是一个标记接口，不要求实现任何方法。

**序列化：**将对象转换为可以存储或传输的数据，`ObjectOutputStream` 可以实现对象的序列化

**反序列化：**从序列化后的数据中恢复出对象，`ObjectInputStream` 可以实现对象的反序列化

```java
class Person implements Serializable {
    public String name;
    public int age;
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    @Override
    public String toString() {
        return "Person{" + "name='" + name + '\'' + ", age=" + age + '}';
    }
}
```

一个对象要能够被序列化，不仅需要自己实现了 `Serializable` 接口，内部使用的引用类型也要实现该接口。

通过 `writeObject` 和 `readObject` 方法可以序列化反序列化对象。

```java
public static void main(String[] args) {
    objectStreamOutput();
    objectStreamInput();
}

public static void objectStreamOutput() {
    try(ObjectOutputStream os = new ObjectOutputStream(new FileOutputStream("test.txt"))) {
        Person p = new Person("jack", 18);
        os.writeObject(p);
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}

public static void objectStreamInput() {
    try(ObjectInputStream is = new ObjectInputStream(new FileInputStream("test.txt"))) {
        Person p = (Person) is.readObject();
        System.out.println(p);
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
}
// Person{name='jack', age=18}
```

通过 `transient` 关键字修饰某些成员变量，序列化是即可忽略这些实例变量。

`serialVersionUID`：每一个可序列化类都有一个这个属性，相当于类的版本号。

- 默认情况下会根据类的详细信息计算出该值，一旦类的信息发生修改，这个值就会发生改变
- 如果序列化、反序列时 `serialVersionUID` 的值不同，会认定为序列化、反序列时的类不兼容，会抛出 `java.io.InvalidClassException` 异常
- 强烈建议每一个可序列化类都自定义该值
	- 该值是 `static final long`
	- 建议声明为 `private`
	- 如果没有自定义该值，编译器会有警告

# try-with-resources

编写 IO 的代码十分的麻烦，`try-catch` 写的十分恶心人，Java 7 开始推出的 try-with-resources 用于解决这个问题。

语句语法格式：

```java
try(资源1;资源2;...) {
    
} catch(Exception e) {
    
} finally {
    
}
```

- `try` 后面可以声明多个资源
- 实现了 `java.lang.AutoCloseable` 接口的就可以称为资源
- 可以省略 `catch` 和 `finally`
- 不管 `try` 是否正常结束都会调用每一资源的 `close` 方法，意味着不再需要我们手动调用
- `close` 的调用顺序与资源的声明顺序相反
- 调用完所有的 `close` 之后，再执行 `finally`