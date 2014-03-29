var http   = require("http"),
    fs     = require("fs"),
    path   = require("path"),
    url    = require("url"),
    mimes  = require("./json/mimes"),
    config = require("./json/config");

const IP   = process.env.OPENSHIFT_NODEJS_IP || config.localhost,
      PORT = process.env.OPENSHIFT_NODEJS_PORT || config.localport,
      LOGF = path.join(process.cwd(), config.dirbase, config.namebase);

http.createServer(function(request, response){
	var parsed = url.parse(request.url, true);
	if(request.url === "/") {
		parsed.pathname = config.index;
		fs.appendFile(LOGF, request.client.remotePort+"|"+request.client.remoteAddress+"|"+new Date().toString().substring(0,25)+"||");
	};
	switch(parsed.pathname){
		case "/getdatas":
			if(parsed.query.motdepasse===config.motdepasse && parsed.query.login===config.login){
				switch(parsed.query.commande){
					case "all":
						response.writeHead(200, mimes.plain);
						fs.readFile(LOGF, function(error, datas){
							if(error) response.end("ERREUR: "+error);
							else{
								response.end(datas);
							};
						});
						break;
					case "delete":
						response.writeHead(200, mimes.plain);
						fs.writeFile(LOGF, "", function(error){
							if(error) response.end("ERREUR: "+error);
							else response.end("DELETE: tous les enregistrements ont été effacés");
						});
						break;
					case "help":
						response.writeHead(200, mimes.plain);
						response.end("AIDE  : all (Afficher toutes les connexions), delete (Effacer toute la base)");
						break;
					default:
						response.writeHead(200, mimes.plain);
						response.end("ERREUR: Aucune commande saisie !");
						break;
				};
			}else{
				response.writeHead(200, mimes.plain);
				response.end("ERREUR: Login ou mot de passe inconnu.");
			};
			break;
		default:
			fs.createReadStream(path.join(__dirname, config.static, parsed.pathname))
				.on("open", function(){
					response.writeHead(200, mimes[path.extname(parsed.pathname)]);
					this.pipe(response);
				})
				.on("error", function(error){
					response.writeHead(307, {"location":config.error});
					response.end();
				});
			break;
	};
}).listen(PORT, IP, function(){
	//console.log("Server listen...");
});