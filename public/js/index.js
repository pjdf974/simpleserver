onload = function(){
	var xml = new XMLHttpRequest();

	xml.onload = function(){
		slt.add(new Option(xml.responseText));
		slt.selectedIndex = slt.length-1;
	};

	btnSave.onclick = function(){
		var chaine = "/save?num="+encodeURIComponent(txtNum.value)+
			"&dte="+encodeURIComponent(txtDte.value)+
			"&lib="+encodeURIComponent(txtLib.value)+
			"&mnt="+encodeURIComponent(txtMnt.value);
		xml.open("get", chaine);
		xml.send();
	};

	btnClear.onclick = function(){
		txtNum.value = "";
		txtDte.value = "";
		txtLib.value = "";
		txtMnt.value = "";
		slt.length = 0;
	}
}