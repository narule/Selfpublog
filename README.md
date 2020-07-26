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

### shell逻辑代码

[markdown_up.sh](markdown_up.sh)

