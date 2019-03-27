
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url')

function sampleRoot(musicPlayerPath,req,res){
	//console.log(musicPlayerPath)
	console.log(req.url)
	var pathObj = url.parse(req.url,true)
	//console.log(req.url)
	var filePath = path.join(musicPlayerPath,pathObj.pathname)
	//onsole.log(filePath)
		fs.readFile(filePath,function(err,data){	
			  if(err){
				  res.setHeader('content-Type','text/plain;charset=utf-8')
				  res.end('获取数据失败,找不到')
			  }else{
				  res.end(data)  
			  }  
	   }) 
	}
	var server = http.createServer(function(req,res){
	sampleRoot(path.join(__dirname,'..'),req,res)
})
  server.listen(3000,function(){
	  console.log('服务器启动了')
	})
	