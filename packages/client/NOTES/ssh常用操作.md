## 文件传输

在 linux 下一般用 scp 命令来通过 ssh 传输文件，**目标服务器要开启写入权限**

1. 上传文件到服务器

   ```shell
   scp /path/filename username@servername:/path 
   ```

2. 上传目录到服务器

   ```shell
   scp  -r local_dir username@servername:remote_dir
   ```

3. 从服务器下载文件

   ```shell
   scp username@servername:/path/filename /local_dir
   ```

4. 从服务器下载目录

   ```shell
   scp -r username@servername:/remote_dir /local_dir
   ```

