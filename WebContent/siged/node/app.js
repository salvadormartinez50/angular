var http = require('http');
var url = require('url');
var fs = require('fs');
//var session = require('express<-session')


http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;

  if (filename == '/' || filename == './' ){
    filename = './index.html';
  }

  fs.readFile(filename, function(err, data) {
    ext = q.pathname.split('.');
    console.log(ext[ext.length-1])
    switch(ext[ext.length-1]){
      case 'html':
        content = 'text/html'
        break;
      case 'css':
        content = 'text/css'
        break;
      case 'js':
        content = 'text/js'
        break;
      default:
        content = 'text/html'
        break;

    }
      console.log(content);

    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 La página no existe");
    }
    res.writeHead(200, {'Content-Type':content});
    res.write(data);
    return res.end();
  });
}).listen(process.env.PORT || 5000);
