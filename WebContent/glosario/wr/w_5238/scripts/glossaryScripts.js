var currenttextDisplay;
var btnClicked = "-1";

var setWidth;
var isPresenter = false;
function getWidgetIFrame(){
	if(isPresenter){
		return window.parent.document.getElementById(window.name);
	}else{
		var cpWidget = window.parent.document.getElementsByClassName("cp-widget");
		for(i=0;i<cpWidget.length;i++){
			for(j=0;j<cpWidget[i].children.length;j++){
				if(cpWidget[i].children[j].children[0] != undefined){
					if(cpWidget[i].children[j].children[0].contentDocument.getElementById("glossarywdgt") != null){
						myFrameName = window.name;
						return window.parent.document.getElementById(window.name);
					}
				}
			}
		}
	}
}

function resizeInteractionPresenter(thewidth,theheight) {
	var scale = 0;
	thewidth = String(thewidth).replace("px","");
	theheight = String(theheight).replace("px","");
	
	setWidth = thewidth;
	
	/**********************/
	//Modification made for Presenter same logic holds good for Captivate
	//iframe width and Height
	var scaleW = thewidth / (700);
	var scaleH = theheight/ (498);
	
	if(scaleW<scaleH){
		scale = scaleW
	}else{
		scale = scaleH
	}
	
	myWidgetiFrame.style.width = parseInt(parseInt(750*scaleW))+"px"
	myWidgetiFrame.style.height = parseInt(parseInt(550*scaleH))+"px"
	
	var iframewidth = String(myWidgetiFrame.style.width).replace("px","");
	var iframeheight = String(myWidgetiFrame.style.height).replace("px","");
	
	//Resize fonts
	var fontscaleW = thewidth / (800);
	var fontscaleH = theheight/ (600);
	if(fontscaleW<fontscaleH){
		fontscale = fontscaleW
	}else{
		fontscale = fontscaleH
	}
		
	contentStyles.size = contentStylessize*fontscale;
	buttonStyles.size = buttonStylessize*fontscale;
	headerStyles.size = headerStylessize*fontscale;
	instStyles.size = instStylessize*fontscale;
	
	setupStyle("#intTitle", headerStyles)
	setupStyle("#intInstructions", instStyles)
	setupStyle("#Search_Result_Container", contentStyles)
	setupStyle("#Search_Result_Header", contentHeadStyles)
	setupStyle(".sidebarWord", buttonStyles)
	setupStyle(".letterHead", buttonStyles)
	
	$("#searchText").css('font-size', (13*fontscale)+"px");
	$("#searchInput").css('font-size', (13*fontscale)+"px");
	$("#searchInput").css('height', (15*scale));
	
	var marginsW
	
	var headerActiveSize;
	if (generalStyles.headerActive == 2) {
		headerActiveSize = 30*scale
	}else{
		$('#headerColor').css('height',(60*scaleH));
		headerActiveSize = $('#headerColor').height();
	}
	
	console.log(headerActiveSize)
	
	var marginsW = Math.round(10* scaleW);
	var marginsH = Math.round(5 * scaleH);
	
	$('#reveal').css('width',(680*scaleW));
	$('#reveal').css('height',(470*scaleH));
	$('#reveal').css('margin-left', marginsW+"px");
	$('#reveal').css('margin-top', marginsH+"px");
	
	var revealHeight = parseInt(String($('#reveal').css('height').replace("px","")));
	var revealWidth = parseInt(String($('#reveal').css('width').replace("px","")));
	
	var contentBg = document.getElementById("content_bg");
	//contentBg.style.width = ((revealHeight-headerActiveSize)-40)+"px"
	contentBg.style.height = ((revealHeight-headerActiveSize)-40)+"px"
	//$("#content_bg").hide();
	
	var contentBgHeight = parseInt(String($('#content_bg').css('height').replace("px","")));
	$('#content_bg').css('height',contentBgHeight-30)
	contentBgHeight = parseInt(String($('#content_bg').css('height').replace("px","")));
	
	//display matrix
	
	//Adjust width and height positions
	var WidthForSearchInpContainer =  173*scaleW
	var WidthForSearchContainer =  175*scaleW
	if(WidthForSearchInpContainer<=120){
		WidthForSearchInpContainer = 120
		WidthForSearchContainer=124
	}
	
	
	$("#Search_Input_Container").css("width",WidthForSearchInpContainer);
	$("#Search_Container").css("width",WidthForSearchContainer);
	
	
	var SearchContainerW = parseInt(String($('#Search_Container').css('width').replace("px",""))-120);
	if(SearchContainerW<=50){
		SearchContainerW = 50;
	}
	$("#searchInput").css("width",(SearchContainerW));
	
	var pyramidHolderW = parseInt(String($('#Search_Container').css('width').replace("px","")));
	var pyramidHolderH = parseInt(String($('#Search_Container').css('height').replace("px","")));
	var SearchInputContainerH = parseInt(String($('#Search_Input_Container').css('height').replace("px","")));
	
	$(".scroll-pane").css("width",WidthForSearchContainer)
	if (generalStyles.headerActive == 2){
		$(".scroll-pane").css("height",(contentBgHeight-SearchInputContainerH)-(22*scaleH)+70)
	}else{
		$(".scroll-pane").css("height",(contentBgHeight-SearchInputContainerH)-(5*scaleH))
	}
	
	//Adjust top and left positions
	var pyramidTop = ((contentBgHeight/2)-(pyramidHolderH/2))+(headerActiveSize*scaleH)+40;
	$(".scroll-pane").css("top",pyramidTop);
	$(".scroll-pane").css("left",30*scale);
	
	//Resize and display content
	
	var wH = parseInt(String($('#Search_Result_Header').css('height').replace("px","")));
	var sT = parseInt(String($('.scroll-pane-content').css('top').replace("px","")));
	
	var addHeight = 0;
	if(SearchInputContainerH>wH){
		addHeight = 10;
		//console.log(addHeight)
	}else{
		addHeight = 0;
	}
	
	if (generalStyles.headerActive == 2){
		$(".scroll-pane-content").css('height',(((revealHeight-headerActiveSize)-130)+(65+addHeight)));
	}else{
		$(".scroll-pane-content").css('height',(((revealHeight-headerActiveSize)-120)));
	}
	$("#Search_Result_Header").css("width",(revealWidth-pyramidHolderW)-(50+(10*scale)));
	$(".scroll-pane-content").css('width',((revealWidth-pyramidHolderW))-(55+(10*scale)));
	
	$("#Search_Result_Header").css('left',(pyramidHolderW)+(25*scale));
	$(".scroll-pane-content").css('left',(pyramidHolderW)+(25*scale));
	
	$("#Search_Result_Header").css('height', (15*scale));
	$("#Search_Result_Header").css('font-size', (15*fontscale)+"px");
	//
	$('#Navigation_Container').css('min-width', "100px");
	$('.navNode').css('font-size', (letterStyles.size)+"px");
	$('.navNode').css('font-size', (18*fontscale)+"px");
	checkSearchResultHeaderText()
	
	$(myWidgetiFrame).show();
}

function resizeInteraction(thewidth,theheight) {
	if(isPresenter)
		return resizeInteractionPresenter(thewidth, theheight);
	var scale = 0;
	thewidth = String(thewidth).replace("px","");
	theheight = String(theheight).replace("px","");

	if(thewidth<320){
		thewidth = 320
	}
	if(theheight<320){
		theheight = 320
	}
	
	setWidth = thewidth;
	
	/**********************/
	//Modification made for Presenter same logic holds good for Captivate
	//iframe width and Height
	var scaleW = thewidth / (700);
	var scaleH = theheight/ (498);
	
	if(scaleW<scaleH){
		scale = scaleW
	}else{
		scale = scaleH
	}
	
	myWidgetiFrame.style.width = parseInt(parseInt(750*scaleW))+"px"
	myWidgetiFrame.style.height = parseInt(parseInt(550*scaleH))+"px"
	
	var iframewidth = String(myWidgetiFrame.style.width).replace("px","");
	var iframeheight = String(myWidgetiFrame.style.height).replace("px","");
	
	//$($(myWidgetiFrame).parent().parent()).css("top",(-19*scaleH))
	//$($(myWidgetiFrame).parent().parent()).css("left",(-25*scaleW))
	
	/*********************/
	
	//Resize interaction
	
	//Resize fonts
	//scalefont = true;
	if(scalefont=="true"){
		//Content font size
		if(contentStylessize>=12){
			if(thewidth>=1024){
				contentStyles.size = contentStylessize;
			}else if(thewidth>= 768){
				var tempNum = Math.round(contentStylessize-2);
				if(tempNum>=12){
					contentStyles.size = tempNum
				}else{
					contentStyles.size = 12
				}
			}else if(thewidth>= 360){
				contentStyles.size = 12
			}else{
				contentStyles.size = 10
			}
			
			var tempcontentStylessize = contentStyles.size*scaleW;
			if(tempcontentStylessize>=12 && tempcontentStylessize<=contentStylessize){
				contentStyles.size = tempcontentStylessize;
			}
			
		}
		
		
		//Button font size
		if(buttonStylessize>=12){
			if(thewidth>=1024){
				buttonStyles.size = buttonStylessize;
			}else if(thewidth>= 768){
				var tempNum = Math.round(buttonStylessize-2);
				if(tempNum>=12){
					buttonStyles.size = tempNum

				}else{
					buttonStyles.size = 12
				}
			}else if(thewidth>= 360){
				buttonStyles.size = 12
			}else{
				buttonStyles.size = 10
			}
			
			var tempbuttonStylessize = buttonStyles.size*scaleW;
			if(tempbuttonStylessize>=12 && tempbuttonStylessize<=buttonStylessize){
				buttonStyles.size = tempbuttonStylessize;
			}
			
		}
		
		
		//Header font size
		if(headerStylessize>=16){
			if(thewidth>=1024){
				headerStyles.size = headerStylessize;
			}else if(thewidth>= 768){
				var tempNum = Math.round(headerStylessize-2);
				if(tempNum>=16){
					headerStyles.size = tempNum
				}else{
					headerStyles.size = 16
				}
			}else if(thewidth>= 360){
				headerStyles.size = 16
			}else{
				headerStyles.size = 14
			}
			
			var tempheaderStylessize = headerStyles.size*scaleW;
			if(tempheaderStylessize>=16 && tempheaderStylessize<=headerStylessize){
				headerStyles.size = tempheaderStylessize;
			}
			
		}
		
		//Instructions font size
		if(instStylessize>=12){
			if(thewidth>=1024){
				instStyles.size = instStylessize;

			}else if(thewidth>= 768){
				var tempNum = Math.round(instStylessize-2);
				if(tempNum>=12){
					instStyles.size = tempNum
				}else{
					instStyles.size = 12
				}
			}else if(thewidth>= 360){
				instStyles.size = 12
			}else{
				instStyles.size = 10
			}
			
			var tempinstStylessize = instStyles.size*scaleW;
			if(tempinstStylessize>=12 && tempinstStylessize<=instStylessize){
				instStyles.size = tempinstStylessize;
			}

		}

		setupStyle("#intTitle", headerStyles)
		setupStyle("#intInstructions", instStyles)
		setupStyle("#Search_Result_Container", contentStyles)
		setupStyle("#Search_Result_Header", contentHeadStyles)
		setupStyle(".sidebarWord", buttonStyles)
		setupStyle(".letterHead", buttonStyles)
	}else{
		
		contentStyles.size = contentStylessize;
		buttonStyles.size = buttonStylessize;
		headerStyles.size = headerStylessize;
		instStyles.size = instStylessize;
		
		if(theheight <= 360 || thewidth <= 360){
			contentStyles.size = 10;
			buttonStyles.size = 10;
			headerStyles.size = 14;
			instStyles.size = 10;
		}
		
		setupStyle("#intTitle", headerStyles)
		setupStyle("#intInstructions", instStyles)
		setupStyle("#Search_Result_Container", contentStyles)
		setupStyle("#Search_Result_Header", contentHeadStyles)
		setupStyle(".sidebarWord", buttonStyles)
		setupStyle(".letterHead", buttonStyles)
	}
	
	var marginsW
	
	var headerActiveSize;
	if (generalStyles.headerActive == 2) {
		headerActiveSize = 30
	}else{
		headerActiveSize = $('#headerColor').height();
	}
	
	//console.log(headerActiveSize,"headerActiveSize")
	if(iframewidth>=1024){
		marginsW = Math.round((27+scaleW) * scaleW);
	}else if(iframewidth>= 768){
		marginsW = Math.round((25+scaleW) * scaleW);
	}else{
		marginsW = Math.round((19+scaleW) * scaleW);
	}
	marginsW = Math.round(10* scaleW);
	var marginsH = Math.round(10 * scaleH);
	
	$('#reveal').css('width',(680*scaleW));
	$('#reveal').css('height',(470*scaleH));
	$('#reveal').css('margin-left', marginsW+"px");
	$('#reveal').css('margin-top', marginsH+"px");
	
	var revealHeight = parseInt(String($('#reveal').css('height').replace("px","")));
	var revealWidth = parseInt(String($('#reveal').css('width').replace("px","")));
	
	var contentBg = document.getElementById("content_bg");
	//contentBg.style.width = ((revealHeight-headerActiveSize)-40)+"px"
	contentBg.style.height = ((revealHeight-headerActiveSize)-40)+"px"
	//$("#content_bg").hide();
	
	var contentBgHeight = parseInt(String($('#content_bg').css('height').replace("px","")));
	$('#content_bg').css('height',contentBgHeight-30)
	contentBgHeight = parseInt(String($('#content_bg').css('height').replace("px","")));
	
	//display matrix
	
	//Adjust width and height positions
	var WidthForSearchInpContainer =  170*scaleW
	var WidthForSearchContainer =  175*scaleW
	if(WidthForSearchInpContainer<=120){
		WidthForSearchInpContainer = 120
		WidthForSearchContainer=124
	}
	
	
	$("#Search_Input_Container").css("width",WidthForSearchInpContainer);
	$("#Search_Container").css("width",WidthForSearchContainer);
	
	
	var SearchContainerW = parseInt(String($('#Search_Container').css('width').replace("px",""))-75);
	if(SearchContainerW<=50){
		SearchContainerW = 50;
	}
	$("#searchInput").css("width",(SearchContainerW));
	
	var pyramidHolderW = parseInt(String($('#Search_Container').css('width').replace("px","")));
	var pyramidHolderH = parseInt(String($('#Search_Container').css('height').replace("px","")));
	var SearchInputContainerH = parseInt(String($('#Search_Input_Container').css('height').replace("px","")));
	
	$(".scroll-pane").css("width",WidthForSearchContainer)
	if (generalStyles.headerActive == 2){
		$(".scroll-pane").css("height",(contentBgHeight-SearchInputContainerH)-(22*scaleH)+70)
	}else{
		$(".scroll-pane").css("height",(contentBgHeight-SearchInputContainerH)-(22*scaleH))
	}
	
	//Adjust top and left positions
	var pyramidTop = ((contentBgHeight/2)-(pyramidHolderH/2))+(headerActiveSize*scaleH)+40;
	$(".scroll-pane").css("top",pyramidTop);
	$(".scroll-pane").css("left",30*scale);
	
	//Resize and display content
	
	var wH = parseInt(String($('#Search_Result_Header').css('height').replace("px","")));
	var sT = parseInt(String($('.scroll-pane-content').css('top').replace("px","")));
	
	var addHeight = 0;
	if(SearchInputContainerH>wH){
		addHeight = 10;
		//console.log(addHeight)
	}else{
		addHeight = 0;
	}
	
	if (generalStyles.headerActive == 2){
		$(".scroll-pane-content").css('height',(((revealHeight-headerActiveSize)-130)+(65+addHeight)));
	}else{
		$(".scroll-pane-content").css('height',(((revealHeight-headerActiveSize)-120)));
	}
	if(currentTheme==8 || currentTheme==9 || currentTheme==11 ){
		$("#Search_Result_Header").css("width",(revealWidth-pyramidHolderW)-(65+(10*scale)));
		$(".scroll-pane-content").css('width',((revealWidth-pyramidHolderW))-(70+(10*scale)));
	}else{
		$("#Search_Result_Header").css("width",(revealWidth-pyramidHolderW)-(55+(10*scale)));
		$(".scroll-pane-content").css('width',((revealWidth-pyramidHolderW))-(60+(10*scale)));
	}
	var defval = 25;
	if(thewidth<= 560){
		defval = 45	
	}
	
	$("#Search_Result_Header").css('left',(pyramidHolderW)+(defval*scale));
	$(".scroll-pane-content").css('left',(pyramidHolderW)+(defval*scale));
	
	//
	$('#Navigation_Container').css('min-width', "100px");
	$('.navNode').css('font-size', (letterStyles.size)+"px");
	if(thewidth<360){
		$('.navNode').css('font-size', (18)+"px");
		$('#Navigation_Container').css('min-width', "600px");
	}
	checkSearchResultHeaderText()
	
	$(myWidgetiFrame).show();
}


//$(document).ready(function() {
function addClickHandlers() {
	$("#reveal").fadeIn();
	$('td a').each(function(index, element) {
       $(this).click(function(e){
		  clearAllColor()
		  if($(this).hasClass("HasValue")){
		  	$(this).css('color', formatColor(letterStyles.textColorDown));
			
			if(setWidth<360){
				var div = document.createElement("div");
				div.id = "showalpha"
				div.style.width = "20px";
				div.style.height = "30px";
				div.style.background = "lightgrey";
				div.style.color = "black";
				div.style.top = 60+"px";
				div.style.left = (e.pageX - 10)+"px" ;
				div.style.position = 'absolute';
				div.style.fontSize = "18px"
				div.style.fontFamily = (letterStyles.face)
				div.style.fontWeight = 'bold';
				div.style.textAlign = 'center'
				div.innerHTML = $(this).text();
				
				document.body.appendChild(div);
				setTimeout(removeDiv,300)
			}
		  }
		  changeDescription(-1);
		  scrollContext($(this).attr('id'));
		 // changeDescription(-1);
		});
	});
}

function removeDiv(){
	var element = document.getElementById("showalpha");
	element.parentNode.removeChild(element);
}

function clearAllColor(){
	$('.navNode .NoValue').css('color', formatColor(letterStyles.textColorOver));
	$('.navNode .HasValue').css('color', formatColor(letterStyles.color));
}

function setupInput() {

    //Search input
    var self = this;
    self.input = $("#searchInput").select().focus();

    // Glossary search
    self.performSearch = function () {
		var phrase = self.input.val();
		var wordFoundArray =  [];
	
		if (phrase.length < 1) { 
			changeDescription(-1)
			$(".keyContext").each(function() {
				this.style.backgroundColor = '#FFFFFF';
				this.style.color = '#666666';
				this.style.border = 'none'
			});
			
			scrollContextTo($($(".keyContext").get([0])).attr('id'));
			changeDescription($($(".keyContext").get([0])).attr('data-id'));
			
			$($(".keyContext").get([0])).val(function() {
				this.style.backgroundColor = '#2277CC';
				this.style.color = '#FFFFFF';
			});
			
			return; 
		}
			//phrase = ["\\b(", phrase, ")"].join("");
		var count = 0;
		$(".keyContext").each(function (i, v) {
			var block = $(v);
			count++;
			var phraseLength = phrase.length;
			var phraseMatch = phrase.toLowerCase();
			var wordMatch = textArray[idholder[$(v).attr('data-id')]].substring(0, phraseLength).toLowerCase();
			if(phraseMatch == wordMatch){
				wordFoundArray.push($(v))
			}
			$("#searchInput").focus();
		});
	
		$(".result-count").text(count + " results on this page!");
		self.search = null;
		
		//Select the first search item found if more than one result is found
		scrollContextTo(wordFoundArray[0].attr('id'));
		changeDescription(wordFoundArray[0].attr('data-id'));
		$(".keyContext").each(function() {
			this.style.backgroundColor = '#FFFFFF';
			this.style.color = '#666666';
		});
		wordFoundArray[0].val(function() {
			this.style.backgroundColor = '#2277CC';
			this.style.color = '#FFFFFF';
		});
		
	};

	self.search;
	self.input.keyup(function (e) {
		if (self.search) { clearTimeout(self.search); }

		//start a timer to perform the search. On browsers like
		//Chrome, Javascript works fine -- other less performant
		//browsers like IE6 have a hard time doing this
		self.search = setTimeout(self.performSearch, 50);
		checkSearchResultHeaderText();
	});
}

$.fn.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};


function checkSearchResultHeaderText(){
	$("#Search_Result_Header").text(currenttextDisplay)
	//$("#Search_Result_Header").css("font-size",letterStyles.size+"px")
	resetSearchResultHeaderText()
}

function resetSearchResultHeaderText(){
	var SearchResultHeaderTxtWidth = $("#Search_Result_Header").textWidth();
	var SearchResultHeaderWidth = parseInt(String($("#Search_Result_Header").css("width").replace("px","")));
	var curFontSize = parseInt($("#Search_Result_Header").css("font-size"))
	if(SearchResultHeaderTxtWidth>(SearchResultHeaderWidth-10)){
		curFontSize--;
		if(curFontSize>=8){
			$("#Search_Result_Header").css("font-size",curFontSize+"px")
			$("#Search_Result_Header").text($("#Search_Result_Header").text())
			resetSearchResultHeaderText();
		}else{
			if($("#Search_Result_Header").text().length>30){
				$("#Search_Result_Header").css("font-size",10+"px")
				var shortenText = $("#Search_Result_Header").text().slice(0,25);
				$("#Search_Result_Header").text(shortenText+"...");
			}
		}
	}
}


//Modifying the sound function - Audio load and play is now handled by captivate: IF it does not handle the audio revert to old code.
//This fix was mainly  implemented for IPAD.
var isiPad = navigator.userAgent.match(/iPad/i) != null;
var theSnd = null;
var theSndURL = null;

function pauseSound() {
	if(isiPad){
		if(!this.handle)
		return;
		
		if(!this.handle.stopWidgetAudio(theSndURL)){
			if(theSnd != null){ 
				theSnd.pause();
			}
		}else{
			this.handle.stopWidgetAudio(theSndURL)
		}
	} else {
		if(!this.handle.stopWidgetAudio(theSndURL)){
			if(theSnd != null){ 
				theSnd.pause();
			}
		}else{
			this.handle.stopWidgetAudio(theSndURL)
		}
	}
}

function play_sound(url){
	if(isiPad){
		if(!this.handle)
		return;
		
		theSndURL = url;
		if(!this.handle.playWidgetAudio(url)){	
			theSnd = new Audio(url);
			theSnd.load();
			theSnd.play();
		}else{
			this.handle.playWidgetAudio(url)
		}
	}else{
		theSndURL = url;
		if(!this.handle.playWidgetAudio(url)){	
			theSnd = new Audio(url);
			theSnd.load();
			theSnd.play();
		}else{
			this.handle.playWidgetAudio(url)
		}
	}
}

////////////////////////////////////////////////////////

function changeTheme(newCSS, newHeader) {
	document.getElementById("cssFile").href = newCSS;
	document.getElementById("cssHeader").href = newHeader;
}
///////////////////////////////////////////////////////////////////
function formatColor(clr) {
	clr = clr.substring(2);
	if (clr.length == 4) { 
		clr = "#00" + clr; 
	} else if (clr.length == 5) {
		
		clr = "#0" + clr; 
	} else {
		clr = "#" + clr;
	}
	return clr; 
}


function setupCustomStyles() {
	generalStyles.headerColor = formatColor(generalStyles.headerColor); //generalStyles.headerColor.substring(2);
	generalStyles.letterBarColor = formatColor(generalStyles.letterBarColor); //"#" + generalStyles.contentBodyColor.substring(2);
	generalStyles.contentHeaderColor = formatColor(generalStyles.contentHeaderColor); //"#" + generalStyles.contentBodyColor.substring(2);
	generalStyles.contentBodyColor = formatColor(generalStyles.contentBodyColor); //"#" + generalStyles.contentBodyColor.substring(2);
	generalStyles.bodyColor = formatColor(generalStyles.bodyColor); //"#" + generalStyles.bodyColor.substring(2);
	//generalStyles.arrowColor = formatColor(generalStyles.arrowColor);
	//generalStyles.btnColorUp = formatColor(generalStyles.btnColorUp);
	//generalStyles.btnColorOver = formatColor(generalStyles.btnColorOver);
//	generalStyles.btnColorDown = formatColor(generalStyles.btnColorDown);
	//generalStyles.lineColor = formatColor(generalStyles.lineColor);	

	//alert(generalStyles.lineColor);
		if (currentTheme != 3 && currentTheme != 11 && currentTheme != 16) {
			$('#headerColor').css('background-color', generalStyles.headerColor)//generalStyles.headerColor);
		} else {
			$('#headerColor').css('background-color', generalStyles.bodyColor)//generalStyles.headerColor);
			
		}//$('#headerColor').css('background-image', 'none');
	$('#Navigation_Container').css('background-color', generalStyles.letterBarColor);
	$('#Navigation_Container_main').css('background-color', generalStyles.letterBarColor);
	$('#Search_Result_Header').css('background-color', generalStyles.contentHeaderColor);
	$('#Search_Input_Container').css('background-color', generalStyles.contentHeaderColor);
	
	
	$('#Search_Result_Container').css('background-color', generalStyles.contentBodyColor);
	$('#content_bg').css('background-color', generalStyles.bodyColor);
	$('.letterHead').css('color', formatColor(buttonStyles.color));
	$('.sidebarWord').css('color', formatColor(buttonStyles.color));
	$('.navNode .NoValue').css('color', formatColor(letterStyles.textColorOver));
	$('.navNode .HasValue').css('color', formatColor(letterStyles.color));
	
	$('.navNode').css('font-family', letterStyles.face);
	
	$('.navNode .NoValue').css('font-weight', 'normal');
	$('.navNode .HasValue').css('font-weight', 'normal');
	
	$('.navNode').css('font-size', letterStyles.size+"px");
	$('.sidebarWord').css('cursor', 'pointer');
	$('.sidebarWord').css('font-weight', 'normal');
	$('#Glossary_Context').css('width', '100%');
	

	if (generalStyles.headerActive == 2) {
		$('#headerColor').css('display', 'none');
	}	

}

//function setupStyle(cssObj,color,face,style,size,align) {
function setupStyle(cssObj, styleObj) {
	//assign the new class
	$(cssObj).css('font-size', styleObj.size+"px");
	$(cssObj).css('color', formatColor(styleObj.color));
	$(cssObj).css('font-family', styleObj.face);
		
	
	if (styleObj.italic == 'true') {	
		$(cssObj).css('font-style', 'italic');
	} else {
		$(cssObj).css('font-style', 'none');
		
	}
	
	if (styleObj.bold == 'true') {	
		$(cssObj).css('font-weight', 'bold');
	} else {
		
		$(cssObj).css('font-weight', 'none');
	}
		
		
	$(cssObj).css('text-align', styleObj.align);


}