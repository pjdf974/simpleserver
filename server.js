var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var mimes = require("./json/mimetypes");

var IP = process.env.OPENSHIFT_NODEJS_IP;
var PORT = process.env.OPENSHIFT_NODEJS_PORT;

http.createServer(function(request, response){
	//console.log(request.url);
	var parsed = url.parse(request.url, true);
	if(request.url === "/") parsed.pathname = "index.html";
	switch(parsed.pathname){
		case "/action":
			response.writeHead(200, mimes.plain);
			response.end("REPONSE SU SERVEUR = "+parsed.query.formNom+" a "+parsed.query.formAge+" ans!!!");
			break;
		default:
			fs.createReadStream(path.join(__dirname, "public", parsed.pathname))
				.on("open", function(){
					response.writeHead(200, mimes[path.extname(parsed.pathname)]);
					this.pipe(response);
				})
				.on("error", function(error){
					response.writeHead(404, mimes.plain);
					response.end("ERREUR 404 = "+error);
				});
			break;
	};
}).listen(PORT || 12345, IP || "localhost", function(){
	//console.log("Server listen...");
});