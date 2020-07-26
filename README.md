# Selfpublog
Self-publishing blog util

一个博客文章自动发布工具

这个工具能监控指定文件夹下的文件变化，将你新增（修改)的markdown文件转为html文件，使网页可以直接访问

你只需要将写好的markdown文章放到服务器即可(或者git更新文件 同理)，其他事情自动完成

## 如何使用

### 前提
1.linux服务器，能运行shell脚本
2.安装以下工具
  inotify-tool: 文件监控工具
  markdown2html-converter: markdown转html工具  
  jq: 读写json文件
3.markdown_up.sh 中指定的文件夹在你的linux中存在  
  shell脚本中的一些参数解释
  SRCDIR=/home/data/narule/markdown/ #表示监控文件夹位置
  MARKDOWNDIR=markdown #这一一般不需要修改，除非你的监控的文件夹不是不叫**markdown**
  BLOGDIR=blog/html   #表示html页面文件生成位置

如果这些工具没安装 可以参考具体介绍 [Seflpublog-design](markdown/2020-07-25-博客部署设计和构建%5E%5EBlog%20deployment%20design%20and%20construction.md)

### 启动
执行命令
`nohup ./markdown_up.sh > /var/log/monitor.log 2>1& &`
这样就能启动博客自动发布程序，你将文件放到markdown文件夹下，程序就会主动帮你把markdown文件转为html页面文件
你可以查看`/var/log/monitor.log`文件了解监控输出日志

### shell逻辑代码

[markdown_up.sh](markdown_up.sh)

### END

当我想要自己搭建私人博客的时候，试着去实现，首先想到的几个主要问题是：
  1.如何监控markdown文件的变化
  2.如何将markdown文件转html文件
  3.如何将生成的html页面信息（包括它所在的文件夹位置）存储下来，并且可以修改
针对这三个问题，我在网上查询了一下资料，包括GitHub,得知
  问题1可以通过[inotify-tools](https://github.com/inotify-tools/inotify-tools)解决 
  问题2可以通过[markdown2html-converter](https://github.com/magiclen/markdown2html-converter)解决
  问题3可以通过[jq](https://github.com/stedolan/jq)解决
  并且这些资源全部能在GitHub上获取，我主要使用了这三个工具实现了此工具的功能，非常感谢这些项目的开发和维护人员
  
在工作之余能有时间写个工具已经是奢求，感恩
