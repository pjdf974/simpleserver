onload = function(){
	var xml = new XMLHttpRequest();

	xml.onload = function(){
		var result = xml.responseText.split("||");
		for(var i=0, l=result.length; i<l; i++){
			slt.add(new Option(result[i]));
		};
		slt.selectedIndex = slt.length-1;
	};

	btnSend.onclick = function(){
		xml.open("get", "/getdatas?login="+txtLogin.value+"&motdepasse="+txtMotdepasse.value+"&commande="+txtCommande.value);
		xml.send();
	};

};
