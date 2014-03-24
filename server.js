var http = require("http");
var fs = require("fs");
var path = require("path");

var IP = process.env.OPENSHIFT_NODEJS_IP;
var PORT = process.env.OPENSHIFT_NODEJS_PORT;

http.createServer(function(request, response){
	//console.log(request.url);
	fs.createReadStream(path.join(__dirname, "public", "index.html"))
		.on("open", function(){
			response.writeHead(200, {"content-type":"text/html"});
			this.pipe(response);
		})
		.on("error", function(error){
			response.writeHead(404, {"content-type":"text/plain; charset=utf8"});
			response.end("ERREUR 404 = "+error);
		});
}).listen(PORT || 12345, IP || "localhost", function(){
	//console.log("Server listen...");
});