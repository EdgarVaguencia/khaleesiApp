var http = require('http'),
	st = require('node-static'),
	opts = { cache: false },
	file = new st.Server('../',opts),
	port = process.env.Port || 8080;

http.createServer(function(req,res){
	file.serve(req,res);
}).listen(port);
