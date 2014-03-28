var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var mimes = require("./json/mimetypes");

var IP = process.env.OPENSHIFT_NODEJS_IP;
var PORT = process.env.OPENSHIFT_NODEJS_PORT;

http.createServer(function(request, response){
	var parsed = url.parse(request.url);
	if(request.url === "/") parsed.pathname = "index.html";
	fs.createReadStream(path.join(__dirname, "public", parsed.pathname))
		.on("open", function(){
			response.writeHead(200, mimes[path.extname(parsed.pathname)]);
			this.pipe(response);
		})
		.on("error", function(error){
			response.writeHead(307, {"location":"error.html"});
			response.end();
		});
}).listen(PORT || 12345, IP || "localhost", function(){
	//console.log("Server listen...");
});