# 项目-音乐播放器
## 主体构建思路
- 使用node JS创建一个index.js文件实现一个服务器，实现html中的数据获取
- 使用music.json文件存储音乐内容相关数据
- 使用index.css文件实现样式
- 在index.hml中使用js实现对样式和功能的控制
## 内容介绍
### index.js使用node js构建服务器
``` 
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url')
//声明核心模块
function sampleRoot(musicPlayerPath,req,res){//声明一个sampleRoot函数，参数分别是音乐对象的总文件路径、请求数据、返回数据
	console.log(musicPlayerPath)
	var pathObj = url.parse(req.url,true)//解析请求中的url获得我们需要的url值赋值给路径对象
	console.log(pathObj.pathname)
	var filePath = path.join(musicPlayerPath,pathObj.pathname)//收到请求后需要读取的文件路径等于音乐对象的总文件路径拼接上请求的url值
	console.log(filePath)
		fs.readFile(filePath,function(err,data){//读取要返回给浏览器的文件内容
			  if(err){
				  res.setHeader('content-Type','text/plain;charset=utf-8')
				  res.end('获取数据失败,找不到')
			  }else{
				  res.end(data)  
			  }  
	   }) 
	}
	var server = http.createServer(function(req,res){//启动服务器，传入的参数是分别当前服务器文件所在的绝对路径请求数据、返回数据
	sampleRoot(path.join(__dirname,'..'),req,res)
})
  server.listen(3000,function(){规定服务器的端口号
	  console.log('服务器启动了')
	}) 
  ```
  
  ### music.json文件存储音乐数据库
  - json文件内部存储了音乐相关的src/背景图片/作者/音乐名
  ``` 
  [
    {
        "src":"http://cloud.hunger-valley.com/music/玫瑰.mp3",
        "img":"https://image.zjstv.com/20181221b6adcc3cfae1a64eb4100993a80fa589_origin.jpg",
        "title":"玫瑰",
        "author":"伍佰"
    },{
        "src":"http://cloud.hunger-valley.com/music/ifyou.mp3",
        "img":"https://i.ytimg.com/vi/XLaNgEl0wTY/maxresdefault.jpg",
        "title":"IF YOU",
        "author":"Big Bang"
    }
] 
```
### index.html写入主体内容和js控制内容
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="css/index.css">
</head>

<body>
    <div class="play-box clear-fix">
        <div class="title">
            <div class="control">
                <a href="#" class="icon-previous"></a>
                <a href="#" class="fa icon-play"></a>
                <a href="#" class="icon-next"></a>//使用3个字体图标来实现上一曲、播放/暂停、下一曲的效果
            </div>
            <div class="information">
                <h3></h3>//由js控制在音乐播放的时候载入音乐名
                <p></p>//由js控制在音乐播放的时候载入作者名
            </div>
        </div>
        <div class="progress">
            <a href="#" class="total"></a>
            <a href="#" class="status"></a>//两个叠加实现进度条的效果
            <span>0.00</span>
        </div>
        <div class="cotalog-box">由js控制在音乐文件加载的时候载入音乐列表
        </div>
    </div>
    <script>
        var musicList = []
        var currentIndex = 0
        var audio = new Audio()
        audio.autoplay = true//设置音乐对象为自动播放
        getMusicList(function(list) {//获取音乐内容
            musicList = list;
            loadMusic(list[currentIndex])
            musicList.forEach(function(node) {
                var newA = document.createElement('a')
                newA.innerText = node.title
                newA.href = '#'
                $('.cotalog-box').appendChild(newA)//插入音乐名为音乐列表
            })
        })

        function $(selector) {
            return document.querySelector(selector)
        }

        function $$(selector) {
            return document.querySelectorAll(selector)
        }
        audio.ontimeupdate = function() {
            $('.status').style.width = (this.currentTime / this.duration) * parseInt//解析后面的进度条总宽度得到一个纯数字(getComputedStyle($('.total')).width) + 'px';
            //音乐播放时根据其触发的ontimeupdate事件，获取此时的音乐播放时间，除以音乐总时间乘以进度条总宽度得到进度条目前宽度
            var min = Math.floor(this.currentTime / 60)//当前音乐的播放时间除以60取整即得到目前的分钟数
            var sec = Math.floor(this.currentTime % 60) + ''//当前音乐的播放时间于上60取整即得到目前的分钟数再加上空字符串变为字符串格式
            sec = sec.length === 2 ? sec : '0' + sec//当秒数为个位数的时候前面加0，否则不加
            $('.progress span').innerText = min + ':' + sec;//当前的播放时间，分+秒
        }
        $('.icon-play').onclick = function() {//播放/暂停图标被点击时判断此时的播放状态，如果在播放就暂停，在暂停就播放并且图标相应跟随改变
            if (audio.paused) {
                audio.play();
                $('.fa').classList.remove('icon-pause');
                $('.fa').classList.add('icon-play');
            } else {
                audio.pause();
                $('.fa').classList.remove('icon-play');
                $('.fa').classList.add('icon-pause');
            }

        }
        $('.icon-previous').onclick = function(e) {//点击上一曲的时候播放序列中的序列号减一个曲目
            currentIndex = (musicList.length + (--currentIndex)) % musicList.length
            loadMusic(musicList[currentIndex])
            $$('.cotalog-box a').forEach(function(node) {//对列表中所有条目前面的左边框重置
                node.style.borderLeft = '1px solid #d1d1d1'
            })
            $$('.cotalog-box a').forEach(function(node) {
                if (node.innerText === musicList[currentIndex].title) {
                    node.style.borderLeft = '8px white  solid'//对当前播放条目的边框加粗，实现标记当前播放列表的效果
                }
            })
            if (audio.paused) {
                audio.play();
                $('.fa').classList.remove('icon-pause');
                $('.fa').classList.add('icon-play');
            } else {
                audio.pause();
                $('.fa').classList.remove('icon-play');
                $('.fa').classList.add('icon-pause');
            }
        }

        $('.icon-next').onclick = function() {
            currentIndex = (++currentIndex) % musicList.length
            loadMusic(musicList[currentIndex])
            $$('.cotalog-box a').forEach(function(node) {
                node.style.borderLeft = '1px solid #d1d1d1'
            })
            $$('.cotalog-box a').forEach(function(node) {
                if (node.innerText === musicList[currentIndex].title) {
                    node.style.borderLeft = '8px white  solid'
                }
            })
            if (audio.paused) {
                audio.play();
                $('.fa').classList.remove('icon-pause');
                $('.fa').classList.add('icon-play');
            } else {
                audio.pause();
                $('.fa').classList.remove('icon-play');
                $('.fa').classList.add('icon-pause');
            }
        }

        $('.progress').onclick = function(e) {
        //点击进度条时根据当前点击位置的offsetX值除以总进度条长度的数值乘以总播放时长得到当前播放时间实现拖动进度条的效果
            var percent = e.offsetX / parseInt(getComputedStyle($('.total')).width)
            audio.currentTime = audio.duration * percent
        }
        audio.onended = function() {//播放完当前曲目后播放序列号自动加1，实现自动播放下一曲的功能
            currentIndex = (++currentIndex) % musicList.length
            loadMusic(musicList[currentIndex])
            $$('.cotalog-box a').forEach(function(node) {
                node.style.borderLeft = '1px solid #d1d1d1'
            })
            $$('.cotalog-box a').forEach(function(node) {
                if (node.innerText === musicList[currentIndex].title) {
                    node.style.borderLeft = '8px white  solid'
                }
            })
        }
        $('.cotalog-box').addEventListener('click', function(e) {
            $$('.cotalog-box a').forEach(function(node) {
                node.style.borderLeft = '1px solid #d1d1d1'
            })
            for (var currentIndex = 0; currentIndex < musicList.length; currentIndex++) {
            //当播放列表被点击时根据被电击的元素的文本内容和曲目的title值去判断当前被点击元素对应的曲目，进而播放它，实现在播放列表点击相应的曲目播放的效果
                if (e.target.innerText !== musicList[currentIndex].title) continue;
                loadMusic(musicList[currentIndex])
                e.target.style.borderLeft = '8px white  solid'
                if (audio.paused) {
                    audio.play();
                    $('.fa').classList.remove('icon-pause');
                    $('.fa').classList.add('icon-play');
                } else {
                    audio.pause();
                    $('.fa').classList.remove('icon-play');
                    $('.fa').classList.add('icon-pause');
                }
            }
        })
        $('.cotalog-box').addEventListener('mouseover', function(e) {
        //当鼠标在播放列表上时触发列表中元素的背景色发生改变实现当前鼠标所在位置的列表被标记的效果
            e.target.classList.add('color')
        })
        $('.cotalog-box').addEventListener('mouseout', function(e) {
        //当鼠标在播放列表上离开时触发列表中元素的背景色取掉实现当前鼠标移走的列表被还原的效果
            e.target.classList.remove('color')
        })

        function getMusicList(callback) {//使用ajax向服务器获取数据
            var xhr = new XMLHttpRequest();//创建对象
            xhr.open('GET', '/music.json', true);//设置参数
            xhr.send();//启动，发送请求
            xhr.onload = function() {//加载数据
                if ((xhr.status >= 200 && xhr.status < 300) || xhr === 304) {
                    callback(JSON.parse(this.responseText))
                } else {
                    console.log('获取数据失败')
                }
            }
            xhr.onerror = function() {
                console.log('网络异常')
            }
        }

        function loadMusic(musicObj) {//定义一个播放函数，当音乐播放时将音乐的名字，作者，背景图片添加到播放器页面上，实现显示当前曲目内容的效果
            $('.information>h3').innerText = musicObj.title;
            $('.information>p').innerText = musicObj.author;
            audio.src = musicObj.src;
            $('body').style.backgroundImage = 'url(' + musicObj.img + ')'
        }
    </script>
</body>

</html>
```
