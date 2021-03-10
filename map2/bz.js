
var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
//function(callback) { window.setTimeout(callback, 1000/2) };
function(callback) { window.setTimeout(callback, 1000/60) };

var canvasWidth = 40;
var canvasHeight = 40;

var canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext('2d');

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

console.log("starting");

function Coord(x,y){
    this.x = x;
    this.y = y;
}

function Tile(type) {
    this.type = type;
}

Tile.prototype.render = function(topLeft, size) {
    switch(this.type) {
	case "grass":
	    color = "LightGreen";
	    break;
	case "trees":
	    color = "DarkOliveGreen";
	    break;
	case "dirt":
	    color = "SandyBrown";
	    break;
	case "water":
	    color = "RoyalBlue";
	    break;
	default:
	    color = "Black";
	    break;
    }

    context.fillStyle = color;
    context.fillRect(topLeft.x, topLeft.y, size.x, size.y);
}

function Map(tileWidth, tileHeight, cols, rows){
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.cols = cols;
    this.rows = rows;
    this.terrain = [ "grass", "trees", "dirt", "water" ];
    this.contents = [];
}

Map.prototype.calcOffset = function(x, y){
    return y * this.cols + x;
}

Map.prototype.get = function(x, y){
    var offset = this.calcOffset(x,y);
    return this.contents[offset];
}

Map.prototype.set = function(tile, x, y){
    var offset = this.calcOffset(x,y);
    this.contents[offset] = tile; 
}

Map.prototype.getRandomTerrain = function(){
    return this.terrain[Math.floor(Math.random() * Math.floor(this.terrain.length))]; 
}

Map.prototype.populate = function(){
    var y;
    var x;
    for(y = 0; y < this.rows; ++y){
	for(x = 0; x < this.cols; ++x){
	    var type = this.getRandomTerrain();
	    var tile = new Tile(type);
	    this.contents.push(tile);
	}
    }
}

function ViewPort(topLeft, bottomRight){
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
    this.initialWidth = bottomRight.x;
    this.initialHeight = bottomRight.y;
    this.updateOccurred = true;
}

ViewPort.prototype.render = function(map){
    var firstRowPixels = map.tileHeight - (this.topLeft.y % map.tileHeight);
    var lastRowPixels = this.bottomRight.y % map.tileHeight;
    var firstColPixels = map.tileWidth - (this.topLeft.x % map.tileWidth);
    var lastColPixels = this.bottomRight.x % map.tileWidth;

    var topTile = Math.floor(this.topLeft.y / map.tileHeight);
    var leftTile = Math.floor(this.topLeft.x / map.tileWidth);
    var bottomTile = Math.floor(this.bottomRight.y / map.tileHeight);
    var rightTile = Math.floor(this.bottomRight.x / map.tileWidth);

    // only redraw the screen if it was updated
    if (this.updateOccurred){
	console.log("a", rightTile,bottomTile);
	var x,y;
	var xpos = 0;
	var ypos = 0;
	var width = 0;
	var height = 0;

	for (y = topTile; y < bottomTile; ++y){
	    if (y == 0) {
		height = firstRowPixels;
	    }
	    else if (y == (bottomTile - 1)) {
		height = lastRowPixels;
	    }
	    else {
		height = map.tileHeight;
	    }

	    xpos = 0;

	    for(x = leftTile; x < rightTile; ++x){
		var tile = map.get(x, y);
		
		if (x == 0) {
		    width = firstColPixels;
		}
		else if (x == (rightTile - 1)) {
		    width = lastColPixels;
		}
		else {
		    width = map.tileWidth;
		}		


		var coord = new Coord(xpos, ypos);
		var size = new Coord(width, height);
		// need to add start coord in as offset
		// for a fill it doesn't make a difference, for
		// a bitmap it will
		console.log("a", coord, size);
		tile.render(coord, size);

		xpos += width;
	    }
	    ypos += height;
	}

	this.updateOccurred = false;
    }
}

ViewPort.prototype.move = function(xDelta, yDelta){
    this.updateOccurred = true;
    this.topLeft.x += xDelta;
    this.topLeft.y += yDelta;
    this.bottomRight.x += xDelta;
    this.bottomRight.y += yDelta;

    if (this.topLeft.x < 0){
	this.topLeft.x = 0;
    }

    if ((this.topLeft.x + this.tileWidth) > this.initialWidth){
	this.topLeft.x = this.initialWidth;
    }

    if (this.topLeft.y < 0){
	this.topLeft.y = 0;
    }

    if ((this.topLeft.y + this.tileHeight) > this.initialHeight){
	this.topLeft.y = this.initialHeight;
    }

    this.bottomRight.x = this.topLeft.x + this.initialWidth;
    this.bottomRight.y = this.topLeft.y + this.initialHeight;
}

ViewPort.prototype.update = function(){
    var xDelta = 0;
    var yDelta= 0;
    for(var key in keysDown) {
	var value = Number(key);
	if(value == 37) { // left arrow
	    xDelta = 0;
	    yDelta = -1;
	} else if (value == 39) { // right arrow
	    xDelta = 0;
	    yDelta = 1;
	} else {
	    xDelta = 0;
	    yDelta = 0;
	}
    }

    if (xDelta != 0 || yDelta != 0){
	viewPort.move(xDelta, yDelta);
    }
}

var map = new Map(20, 20, 50, 50);
map.populate();
var initViewPortStart = new Coord(0,0);
var initViewPortEnd = new Coord(canvasWidth, canvasHeight);
var viewPort = new ViewPort(initViewPortStart, initViewPortEnd);

var step = function() {
    update();
    render();
    animate(step);
};

var update = function() {
    viewPort.update();
};

var render = function() {
    viewPort.render(map);
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});


