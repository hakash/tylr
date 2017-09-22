document.addEventListener("DOMContentLoaded", function(event) { 
	Tylr.init();
});

var Tylr = {
	// Properties
	stylesheet : null,

	roomWidth 	: 500,
	roomHeight 	: 500,
	roomScale 	: 1,
	tileWidth 	: 20,
	tileHeight 	: 20,
	tileSpace 	: 1,
	tileScale 	: 1,
	
	cssrules : {

	},

	//Methods
	init : function(){

		// initialize the form with default values
		document.getElementById("roomWidth").value = this.roomWidth;
		document.getElementById("roomHeight").value = this.roomHeight;
		document.getElementById("tileWidth").value = this.tileWidth;
		document.getElementById("tileHeight").value = this.tileHeight;
		document.getElementById("tileSpace").value = this.tileSpace;

		// Add event listeners to the form elements
		document.getElementById("roomWidth").addEventListener("change",function(event){
			Tylr.resizeRoom();
		});

		document.getElementById("roomHeight").addEventListener("change",function(event){
			Tylr.resizeRoom();
		});
			
		document.getElementById("tileWidth").addEventListener("change",function(event){
			Tylr.resizeTile();			
		});

		document.getElementById("tileHeight").addEventListener("change",function(event){
			Tylr.resizeTile();			
		});

		document.getElementById("tileSpace").addEventListener("change",function(event){
			Tylr.changeTileSpace();			
		});
		
		var stylesheets = document.styleSheets;
		for(var i = 0; i < stylesheets.length; i++){
			var sheet = stylesheets.item(i);
			if(sheet.title === "tylr.css"){
				this.stylesheet = sheet;
				break;
			}
		}

		var rules = this.stylesheet.cssRules || this.stylesheet.rules;
		for(var i = 0; i < rules.length; i++){
			var rule = rules[i];
			this.cssrules[rule.selectorText] = rule;
		}

		this.drawRoom();
	},

	getScaledSize : function(size, unit){
		return (size * this.tileScale) + unit;
	},

	resizeRoom : function(){
		this.roomWidth = parseInt(document.getElementById("roomWidth").value);
		this.roomHeight = parseInt(document.getElementById("roomHeight").value);

		this.tileScale = this.roomWidth / parseFloat(this.cssrules["#walls"].style.width);

		this.cssrules[".tileRow"].style.height = this.getScaledSize(this.tileHeight + this.tileSpace, "px");
		this.drawRoom();
	},

	resizeTile : function(){
		this.tileWidth = parseInt(document.getElementById("tileWidth").value);
		this.tileHeight = parseInt(document.getElementById("tileHeight").value);

		this.cssrules[".tile"].style.width = this.getScaledSize(this.tileWidth, "px");
		this.cssrules[".tile"].style.height = this.getScaledSize(this.tileHeight, "px");

		this.drawRoom();
	},

	changeTileSpace : function(){
		this.tileSpace = parseInt(document.getElementById("tileSpace").value);

		var margin = this.getScaledSize(this.tileSpace, "px");
		this.cssrules[".tile"].style.margin = "0px " + margin + " " + margin + " 0px";
		this.cssrules[".tileRow"].style.height = this.getScaledSize(this.tileHeight + this.tileSpace, "px");
	console.log(this.cssrules[".tileRow"].style.height);		
		this.drawRoom();
	},

	drawRoom : function(){
		console.log("drawing...");
		var tilesPerRowRaw = this.roomWidth / (this.tileWidth + this.tileSpace);
		var tilesPerRow = Math.ceil(tilesPerRowRaw);
		console.log("tiles per row: " + tilesPerRowRaw);
		
		var numRowsRaw = this.roomHeight / (this.tileHeight + this.tileSpace);
		var numRows = Math.ceil(numRowsRaw);

		var overflowRow = tilesPerRowRaw - Math.ceil(tilesPerRowRaw);
		console.log(overflowRow);
		var overflowMargin = this.getScaledSize((this.tileWidth * overflowRow)/2,"px");
		console.log("tile width: " + this.tileWidth);
		console.log("tile width scaled: " + this.getScaledSize(this.tileWidth,""));
		this.cssrules[".tileRow"].style.margin = "0px 0px 0px " + overflowMargin;
		this.cssrules[".tileRow"].style.width = this.getScaledSize(tilesPerRow * (this.tileWidth + this.tileSpace), "px");
		
		var floor = document.getElementById("floor");
		floor.innerHTML = "";
		for(var i = 0; i < numRows; i++) {
			
			var row = document.createElement("div");
			row.classList.add("tileRow");
	
			for( var j = 0; j < tilesPerRow; j++){
				
				var tile = document.createElement("div");
				tile.classList.add("tile");
		
				row.appendChild(tile);
			}
	
			floor.appendChild(row);
		}
	},

};