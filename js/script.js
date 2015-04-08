function voerCodeUit() { 
	
	var tekst = ''
	for (var i=0; i<bestanden.length; i++){
		if (bestanden[i].naam.search(".htm") > 0){
			tekst = $("#" + bestanden[i].naam.replace(".","")).val();
		}
	}
	for (var i=0; i<bestanden.length; i++) {
		if (!bestanden[i].tag && bestanden[i].naam.search(".htm") < 0) {
			console.log(bestanden[i].naam);
			pos = tekst.search(bestanden[i].naam);
			begin = tekst.substr(0,pos).lastIndexOf("<");
			eindeTag = begin + tekst.substr(begin).indexOf(" ");
			var tag = tekst.substr(begin+1, eindeTag - begin - 1);
			console.log('tag: ' + tag);
			
			eind = pos + tekst.substr(pos).indexOf(">");
			var endTag = "</"+tag+">";
			if (tekst.substr(eind+1, endTag.length) == endTag) {
				eind += endTag.length;
			}
			
			var extraTekst = $("#" + bestanden[i].naam.replace(".","")).val();
			console.log("extraTekst: " + extraTekst);
			switch(tag) {
				case 'link': 
					extraTekst = "<style type='text/css' media='all'>" + extraTekst + "</style>";
					console.log(extraTekst);
					break;
				case 'script':
					extraTekst = "<script>" + extraTekst + "</script>";
					console.log(extraTekst);
					break;
			}
			tekst = tekst.replace(tekst.substr(begin, eind - begin + 1), extraTekst);
		}
	}
	console.log(tekst);
	$("#iframeResult").attr('srcdoc', tekst);
}

function toonCode(i){
	for (var j=0; j<bestanden.length; j++){
		var eCode = $("#"+bestanden[j].naam.replace('.',''));
		eCode.addClass("hidden");
	}
	var eCode = $("#"+bestanden[i].naam.replace('.',''));
	eCode.toggleClass("hidden");
	
}

window.onload = function() {
	var eLijst = $('#lijstBestanden');
	var eCodeWarper = $('.textareawrapper');
	
	for (var i=0; i<bestanden.length; i++){
		eLijst.append("<li><a href='#' onclick='toonCode("+i+")'>"+bestanden[i].naam+"</a></li>");
		if (!bestanden[i].tag) {
			eCodeWarper.append("<textarea autocomplete='off' class='code_input hidden' id='"
							   +bestanden[i].naam.replace('.','')
							   +"' wrap='logical' xrows='30' xcols='50'></textarea>");
			var eCode = $("#"+bestanden[i].naam.replace('.',''));
			$.ajax({
				url: bestanden[i].url,
				dataType: "text",
				async: false,
				success: function(result){
					eCode.text(result);
				}
			});
		} else {
			eCodeWarper.append("<div class='code_input hidden' id='"+bestanden[i].naam.replace('.','')+"'></div>");
			var eCode = eCodeWarper.find('#'+bestanden[i].naam.replace('.',''));
			eCode.append("<"+bestanden[i].tag+">");
			eCodeTag = eCode.find(bestanden[i].tag);
			for (attr in bestanden[i]) {
				if (attr != 'naam' && attr != 'url' && attr != 'tag'){
					eCodeTag.attr(attr, bestanden[i][attr]);
				}
			}
		}
	}
	
	var eEersteCode = $("#"+bestanden[0].naam.replace('.',''));
	eEersteCode.toggleClass('hidden');
	
}