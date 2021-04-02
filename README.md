# Selfpublog
Self-publishing blog util

A blog post automatic publishing tool  
一个博客文章自动发布工具

  This tool can monitor the file changes in the specified folder, and convert your newly added (modified) markdown files into html files, so that web pages can be directly accessed  
  这个工具能监控指定文件夹下的文件变化，将你新增（修改)的markdown文件转为html文件，使网页可以直接访问

  You only need to put the written markdown article on the server (or the git update file is the same), and other things are done automatically  
  你只需要将写好的markdown文章放到服务器即可(或者git更新文件 同理)，其他事情自动完成

## How to use | 如何使用

### Premise | 前提

1. Linux server, can run shell scripts | linux服务器，能运行shell脚本

2. Install the following tools | 安装以下工具

    inotify-tool: file monitoring tool  
    markdown2html-converter: markdown to html tool  
    jq: read and write json files  
  
    inotify-tool: 文件监控工具  
    markdown2html-converter: markdown转html工具   
    jq: 读写json文件  
  
3. The folder specified in markdown_up.sh exists in your linux;   
   markdown_up.sh 中指定的文件夹在你的linux中存在;  
  
  Explanation of some parameters in shell script:   
  ```shell
  SRCDIR=/home/data/narule/markdown/ # indicates the location of the monitoring folder   
  MARKDOWNDIR=markdown #This generally does not need to be modified, unless your monitored folder is not called **markdown**   
  BLOGDIR=blog/html #Indicates the location where the html page file is generated   
  ```
  shell脚本中的一些参数解释:  
  ```shell
  SRCDIR=/home/data/narule/markdown/ #表示监控文件夹位置  
  MARKDOWNDIR=markdown #这一一般不需要修改，除非你的监控的文件夹不是不叫**markdown**  
  BLOGDIR=blog/html   #表示html页面文件生成位置  
  ```
  If these tools are not installed, please refer to the specific introduction    
  如果这些工具没安装 可以参考具体介绍    
  [Seflpublog-design](markdown/2020-07-25-博客部署设计和构建%5E%5EBlog%20deployment%20design%20and%20construction.md)

### Start up | 启动
  command | 执行命令
  `nohup ./markdown_up.sh > /var/log/monitor.log 2>1& &`   
  This will start the blog automatic publishing program, you put the file in the markdown folder, the program will take the initiative to help you convert the markdown file into an html page file   
  You can view the `/var/log/monitor.log` file to understand the monitoring output log   
  这样就能启动博客自动发布程序，你将文件放到markdown文件夹下，程序就会主动帮你把markdown文件转为html页面文件   
  你可以查看`/var/log/monitor.log`文件了解监控输出日志

### Shell logic code | shell逻辑代码

[markdown_up.sh](markdown_up.sh)

More detailed content is also in   
更详细的内容也在  
[Seflpublog-design](markdown/2020-07-25-博客部署设计和构建%5E%5EBlog%20deployment%20design%20and%20construction.md)

### Problem | 问题
  1.文章内跳转会失败，因为iframe内嵌的原因
  2.目前依赖markdown2html-converter
  肯定有不少问题，但它基本可以使用
### END | 结尾

When I wanted to build a private blog by myself, I tried to realize it. The main questions that came to my mind were:  
  1. How to monitor the changes of markdown files  
  2. How to convert markdown files to html files  
  3. How to store the generated html page information (including the location of the folder where it is located) and modify it  


当我想要自己搭建私人博客的时候，试着去实现，首先想到的几个主要问题是：  
  1. 如何监控markdown文件的变化  
  2. 如何将markdown文件转html文件  
  3. 如何将生成的html页面信息（包括它所在的文件夹位置）存储下来，并且可以修改  

  In response to these three questions, I checked information on the Internet, including GitHub, and learned   

  Problem 1 can be solved by [inotify-tools](https://github.com/inotify-tools/inotify-tools)  
  Problem 2 can be solved by [markdown2html-converter](https://github.com/magiclen/markdown2html-converter)  
  Problem 3 can be solved by [jq](https://github.com/stedolan/jq)  
  
  And these resources are all available on GitHub, I mainly use these three tools to achieve the function of this tool, thank you very much to the developers and maintainers of these projects  
  
  针对这三个问题，我在网上查询了一下资料，包括GitHub,得知  
  
  问题1可以通过[inotify-tools](https://github.com/inotify-tools/inotify-tools)解决  
  问题2可以通过[markdown2html-converter](https://github.com/magiclen/markdown2html-converter)解决  
  问题3可以通过[jq](https://github.com/stedolan/jq)解决  
  
  并且这些资源全部能在GitHub上获取，我主要使用了这三个工具实现了此工具的功能，非常感谢这些项目的开发和维护人员

最后这些东西写好后，运行shell命令即可启动监控自动化
`nohup ./markdown_up.sh > /var/log/monitor_markdown.log 2>&1 &` 

查看日志了解监控触发时的一些动作记录 
`tail -10f /var/log/monitor_markdown.log`


Do something based on standing on the shoulders of others. Thanksgiving
站在别人的肩膀做些事 感谢
