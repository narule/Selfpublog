/**
 * 首页加载
 */

 /**
  * 博客信息相关变量定义
  */


// 博客文章简要信息 json
var blogInfo = {};

//首页目录树组件 分类
var articleTableDiv;

//首页目录树组件 时间
var articlInTimeDiv;

// 博客信息-按时间收集
var BlogInTime;

// 时间键
var timeKey = [];
timeKey.sort(function(a,b){
    return b.id = a.id;
})


// 文章访问路径记录变量
var sortStr;

// 博客目录信息
var folders = [];

// 博客文章信息
var articles = [];

// 文章顶层目录
var RootPg = "html";

var blogsh;
/**
 * 页面组件相关
 */

// 加载完成标志
 var isOnload = false;


 // 屏幕宽高
 var  h_With;
 var  h_Height;

 // 文章显示组件
var articleHTML;

// 导航按钮
var menu;


// 遮罩层
var cover;

var uCober = false;

//变量标记
var pageDataMap = new Map();

/**
 * 遮罩层逻辑
 */
function isCover(){
    if(!cover.style.display){
        // 关闭 cover
        artf_table.className = "phonetableC";
        cover.style.display = 'none';
        articleHTML.height = pageDataMap.get("article_h");
    }else{
        // 显示cover
        cover.style.display = '';
        pageDataMap.set("article_h",articleHTML.height);
        artf_table.className = "phonetableO";
        artf_table.style.display = 'block';
        articleHTML.height = h_Height*0.6;

    }
}





/**
 * 页面宽高调整
 */

 
function adjust_window(){
    if(h_With < 700){
        uCober = true;
        if(menu.style.display){
            menu.style.display='';
            artf_table.style.display='none';
            artf_table.addEventListener('animationend', function(){
                if(cover.style.display){  
                    artf_table.style.display = 'none';
                }
            });
        }
        
    }else{
        uCober = false;
        if(!menu.style.display){
            menu.style.display='none';
            artf_table.className='';
            artf_table.style.display='block';
            cover.style.display = 'none';
        }
    }

    articleHTML.width = h_With * 0.94;
    articleHTML.height = articleHTML.contentDocument.body.clientHeight;
}



/**
 * 
 * @param {博客数据--json}} data 
 */
function request_callback(data){
    parseBloginfo(data);
    // parseBlogJson(data);
    isOnload = true;

    createArticleListPage();

    elementEventInit();


}

/**
 * 创建文章list页
 */
function createArticleListPage(){
    if(timeKey.length > 0){
        var articleListhtmlStr = "";
        for(var i=0;i< timeKey.length; i++){
            var date = timeKey[i].date;
            var articles = BlogInTime.get(date);
            if(articles){
                articles.forEach(function(value,key){

                    var category = value.category;
                    var create_time = value.md_time;
                    if(category == "html"){
                        category = "无";
                    }
                    if(create_time == "0" || create_time.length < 4){
                        create_time = value.create_time;
                    }
                    articleListhtmlStr = articleListhtmlStr + 
                    
                    "<div>"+  
                        "<div>" +
                            "<hr>" +
                            "<h2 id='" + value.url + "' class='article-a'>" +value.title+ "</h2>" + 
                        "</div>" + 
                        "<div>" + 
                            "<p style='text-align: right;' style='display: inline-table'>" + 
                                "<div style='text-align: right;width:100%;display:inline-block;'>" + 
                                "<div style='width:30%;text-align: left;display:inline-block'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分类：" + category + "</div>" + 
                                "<div style='width:70%;text-align: right;display:inline-block'>创建：" + create_time + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;更新： " + value.update_time + "</div>" + 
                                "</div>" +
                            "</p>" + 
                        "</div>" + 
                    "</div>"

                });
            }
        }
        articlelistHTML.innerHTML = articleListhtmlStr;
    }
    
}


function accessArticle(url){
    get_window_wh();
    articleHTML.src = url;
    articleHTML.height =  h_Height * 0.68;
    articleHTML.width = h_With;
    articlelistHTML.style.display = 'none';
    blogsh.style.display = 'none';
    articleHTML.style.display = '';
}

function toIndexpage(){
    articleHTML.style.display = 'none';
    blogsh.style.display = '';
    articlelistHTML.style.display = '';
}
/**
 * 
 * @param {请求获取文章归纳信息--json} callback 
 */
function request_brief_blog_info(callback){

    BlogInTime = new Map();

    sortStr = '';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 ) {
        // && this.status == 200
        
        blogInfo  = JSON.parse(xmlhttp.responseText);
        if(blogInfo){

            blogInfo = blogInfo[RootPg];
            if(blogInfo){
                blogInfo.path__ = '';
                callback(blogInfo);
            }
        }
      }
    };
    xmlhttp.open("GET", "json/blog.json", true);
    xmlhttp.send();
}


/**
 * 
 * @param {解析文章信息显示在目录} json 
 */
function parseBloginfo(json){
    sortStr = json.path__;
    var newjson = {};
    folders = [];
    articles = [];

    for(var key in json){
        var item =　json[key];
        if(key == 'key__' || key == 'path__'){
            continue;
        }
        key = key.replace("_html",".html");
        key = key.replace(/--/g," ");
        item.key__ = key;
        
        if(key && key.length > 5 && ".html" == key.substr(key.length-5,key.length-1)){
            articles.push(item);
        }else{
            item.path__ = sortStr + key + '/';
            newjson[key] = item;
            folders.push(item);
        }
    }
    
    if(folders && folders.length>0){
        // create folder 创建目录
        folders.forEach(element => {
            // var dirst = item.path__ + '/';
            // sortStr = sortStr + key + '/';
            var folderpaths = element.path__.split('/');
            var createId = "folder";
            for(var i =0; i < folderpaths.length - 1;i++){
                createId = createId + '-' + folderpaths[i];
                if(folderpaths.length > 2 && i == folderpaths.length -3){
                    articleTableDiv =  document.getElementById(createId + '-inner');
                }
            }
            
            var treeTableDiv = document.createElement("div"); 
            treeTableDiv.id = createId;
            treeTableDiv.className = 'treeTable';
            articleTableDiv.appendChild(treeTableDiv);

            var btndiv = document.createElement("div"); 
            btndiv.id = createId + '-btn';
            btndiv.innerHTML =  element.key__;
            btndiv.className = 'tree-btn';
            treeTableDiv.appendChild(btndiv);
            var innerTablediv = document.createElement("div"); //<div class="innerTreeTable" id="folder-java-inner" style="display: none;">
            innerTablediv.id = createId + '-inner';
            innerTablediv.className = 'innerTreeTable';

            innerTablediv.style = "display: none;";
            treeTableDiv.appendChild(innerTablediv);

        });
    }

    
    //create file access 创建文件
    var folderpaths = sortStr.split('/');
    folderpaths.pop();
    var url = RootPg + "/";
    if(folderpaths && folderpaths.length > 0){
        folderpaths.forEach(element => {
            url = url + element + '/';
        });
    }
    var createId = "folder";
    if(folderpaths.length < 1){
        articleTableDiv = document.getElementById('atctables');
    }else{
        for(var i =0; i < folderpaths.length;i++){
            createId = createId + '-' + folderpaths[i];
        }
        createId = createId + '-' + 'inner';
        articleTableDiv = document.getElementById(createId);
    }
    if(articles && articles.length>0){
        
        articles.forEach(element => {
            //<a id="note/IO/IO.html" class="article-a" >index</a><br>
            var a = document.createElement("a"); 
            a.id = url + element.key__;
            a.className = "article-a";
            a.innerHTML = element.title;
            articleTableDiv.appendChild(a)
            a.outerHTML = a.outerHTML + '<br>';
            
            element.url = a.id
            var categorys = url.split('/');

            element.category = categorys[categorys.length - 2];
            dealTimeInfo(element);

            var time = element.create_time;
            if(time){
                time = time + '';
                var timeFolder = time.split('-');
                while(timeFolder.length > 2){
                    timeFolder.pop();
                }
                var timenode;
                var parent = articlInTimeDiv;
                var childNodes = parent.childNodes;
                if(timeFolder.length > 0){
                    var nodeId = 'time';
                    var nodeHtml = '';
                    for(var t = 0;t< timeFolder.length;t++){
                        var havaNode = false;
                        nodeId = nodeId + '-' + timeFolder[t];
                        if(t == 0){
                            nodeHtml = timeFolder[t];
                        }else{
                            nodeHtml = nodeHtml + '-' + timeFolder[t];
                        }
                        // nodeHtml = nodeHtml + '-' + timeFolder[t];
                        if(childNodes && childNodes.length> 0){
                            for(var p = 0;p < childNodes.length;p++){
                                var node = childNodes[p];
                                if(node.id == nodeId){
                                    havaNode = true;
                                    timenode = node;
                                    break;
                                }
                            }
                            
                        }
                        if(!havaNode){
                            timenode = document.createElement("div"); 
                            timenode.id = nodeId;
                            timenode.className = 'treeTable';
                            parent.appendChild(timenode);
                
                            var  nbtndiv = document.createElement("div"); 
                            nbtndiv.id = nodeId + '-btn';
                            // nbtndiv.innerHTML =  timeFolder[t];
                            nbtndiv.innerHTML =  nodeHtml;
                            nbtndiv.className = 'tree-btn';
                            timenode.appendChild(nbtndiv);

                            var innerTablediv = document.createElement("div"); //<div class="innerTreeTable" id="folder-java-inner" style="display: none;">
                            innerTablediv.id = nodeId + '-inner';
                            innerTablediv.className = 'innerTreeTable';
                            innerTablediv.style = "display: none;";

                            timenode.appendChild(innerTablediv);
                        }

                        
                        parent = document.getElementById(nodeId + '-inner');
                        childNodes = parent.childNodes;
                        if(t == timeFolder.length -1){
                            var ta = document.createElement("a"); 
                            ta.id = url + element.key__;
                            ta.className = "article-ta";
                            ta.innerHTML = element.title;
                            parent.appendChild(ta);
                            ta.outerHTML = ta.outerHTML + '<br>';
                            
                        }
                    }
                }
            }
        });
    }

    for(var key in newjson){
        parseBloginfo(newjson[key]);
    }

}

/**
 * 文章时间处理
 */
function dealTimeInfo(article){
    var time = article.md_time;
    if(time == '0'){
        time = article.create_time;
    }
    var articles = BlogInTime.get(time);
    if(!articles){
        articles = [];
        if(time.indexOf('-') != -1){
            var timenode = 
            {
                id: string2date(time),
                date: time
            };
            timeKey.push(timenode);
        }
        
    }
    articles.push(article);
    BlogInTime.set(time,articles);

}


/**
 * 目录组件初始化
 */
function elementEventInit(){
    /**
     * 目录 - 鼠标点击事件
     */
    function treeOnclick() {
        var innerTree = document.getElementById(this.id.substr(0,this.id.length-'-btn'.length) + "-inner"); 
        if(innerTree && isOnload){

            if(innerTree.style.display ==  'none'){
                innerTree.style.display = '';
            }else{
                innerTree.style.display = 'none';
            }
        }
    }

    /**
     * 为目录 标签绑定点击事件
     */
    var treeBtns = document.getElementsByClassName('tree-btn'); 
    if(treeBtns && treeBtns.length > 0){
        for(var i in treeBtns){
            treeBtns[i].onclick = treeOnclick;
        }
    }

    /**
     * 文章 - 鼠标点击事件
     */
    function getArticle() {
        if(uCober){
            isCover();
        }
        var url = this.id;
        if(isOnload && url){
            accessArticle(url);
        }
    }

    /**
     * 为每个文章标题组件绑定点击事件
     */
    var articleslable = document.getElementsByClassName('article-a'); 
    if(articleslable && articleslable.length > 0){
        for(var g in articleslable){
            articleslable[g].onclick = getArticle;
        }
    }

    var articleslablet = document.getElementsByClassName('article-ta'); 
        if(articleslablet && articleslablet.length > 0){
            for(var g in articleslablet){
                articleslablet[g].onclick = getArticle;
            }
        }

}

/**
 * 设置文章 iframe 高度 自动修改
 * @param {} 
 */
function set_article_display_logic(){
    try{
        articleHTML.width = h_With;
        // var iframe = document.getElementById(id);
        if(articleHTML.attachEvent){
            articleHTML.attachEvent("onload", function(){
                articleHTML.height =  articleHTML.contentWindow.document.documentElement.clientHeight;
                // iframe.height =  iframe.contentWindow.document.documentElement.scrollHeight;
                
            });
            // return;
        }else{
            articleHTML.onload = function(){
                articleHTML.height = articleHTML.contentDocument.body.clientHeight;
                // iframe.height = iframe.contentDocument.body.scrollHeight;
            };
            // return;                 
        }     
    }catch(e){
        throw new Error('setIframeHeight Error');
    }
}

/**
 * 获取窗口宽高
 */
function get_window_wh(){
    h_With = window.innerWidth//浏览器窗口的内部宽度（包括滚动条）
 
    || document.documentElement.clientWidth
    
    || document.body.clientWidth;
    
    h_Height = window.innerHeight//浏览器窗口的内部高度（包括滚动条）
 
    || document.documentElement.clientWidth
    
    || document.body.clientHeight;
    
    console.log(h_With, h_Height);

}


function init_page_elements(){
    //遮罩层
    cover = document.getElementById('a-cover');
    
    //目录
    artf_table = document.getElementById('articleTable');
    
    //目录组件 -- 文件夹归类
    articleTableDiv = document.getElementById('atctables');

    //目录组件 -- 时间归类
    articlInTimeDiv = document.getElementById('articlInTime');

    //文章内嵌组件 iframe
    articleHTML = document.getElementById('innerArticle');

    //文章列表组件 TODO
    articlelistHTML = document.getElementById('articlelist');
    
    blogsh = document.getElementById('blogsh');

    
    //导航按钮
    menu = document.getElementById('h-menu');

    cover.onclick = function coverClick(e) {
        isCover()
        e = e || window.event;
        if (e.stopPropagation) { //W3C阻止冒泡方法  
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法  
        }
    }

    menu.onclick = function menuClick(e) {
        isCover();
        e = e || window.event;
        if (e.stopPropagation) { //W3C阻止冒泡方法  
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法  
        }
    }

}





/**
 * 窗口变化
 */

window.onresize = function () {
    h_With = document.body.clientWidth
     
    || window.innerWidth//浏览器窗口的内部宽度（包括滚动条）会出现滚动条不优先考虑
     
    || document.documentElement.clientWidth;
     
    h_Height = document.body.clientHeight
     
    || window.innerHeight//浏览器窗口的内部高度（包括滚动条）
     
    || document.documentElement.clientWidth;

    
    // console.log(h_With, h_Height);
    adjust_window();

}

/**
 * 时间字符串转 数字 
 * time yyyy-mm-dd or yyyy-mm
 * 最小单位 月
 */
function string2month(timestr){
    var arr = timestr.split('-');
    if(arr){
        if(arr.length == 1){
            return parseInt(arr[0]) * 12;
        }
        else if(arr.length == 2){
            return parseInt(arr[0]) * 12 + parseInt(arr[1]);
        }
        
    }

    return 0;
}

/**
 * 时间字符串转 数字
 * time yyyy-mm-dd
 * 最小单位 日
 */
function string2date(timestr){
    var arr = timestr.split('-');
    if(arr){
        if(arr.length == 1){
            return parseInt(arr[0]) * 365;
        }
        if(arr.length == 2){
            return parseInt(arr[0]) * 365 + parseInt(arr[1]) * 30;
        }
        if(arr.length == 3){
            return parseInt(arr[0]) * 365 + parseInt(arr[1]) * 30 + parseInt(arr[2]);
        }
    }
    return 0;
}

/**
 * 页面加载后执行页面逻辑处理
 */

window.onload = function () {


    get_window_wh();

    init_page_elements();
    
    set_article_display_logic();
    
    adjust_window();
    
    request_brief_blog_info(request_callback); 
    

}