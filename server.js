var http   = require("http"),
    fs     = require("fs"),
    path   = require("path"),
    url    = require("url"),
    Nedb   = require("nedb"),
    mimes  = require("./json/mimes"),
    config = require("./json/config");

const IP   = process.env.OPENSHIFT_NODEJS_IP || config.localhost,
      PORT = process.env.OPENSHIFT_NODEJS_PORT || config.localport;

var db = new Nedb({filename:path.join(process.cwd(), config.dirbase, config.namebase), autoload:true});

http.createServer(function(request, response){
	var parsed = url.parse(request.url, true);
	if(request.url === "/") {
		parsed.pathname = config.index;
		db.insert({p:request.client.remotePort, a:request.client.remoteAddress, d:new Date()});
	};
	switch(parsed.pathname){
		case "/getdatas":
			if(parsed.query.motdepasse===config.motdepasse && parsed.query.login===config.login){
				switch(parsed.query.commande){
					case "all":
						db.find({}, function(error, result){
							var envoi = "";
							for(var i=0, l=result.length; i<l; i++){
								envoi += JSON.stringify(result[i])+"\n";
							};
							response.writeHead(200, mimes.plain);
							response.end(envoi);
						});
						break;
					case "delete":
						db.remove({}, {multi:true}, function(error, nbr){
							response.writeHead(200, mimes.plain);
							response.end("DELETE: "+nbr+" enregistrement(s) effacé(s). La base a été entièrement vidée...");
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