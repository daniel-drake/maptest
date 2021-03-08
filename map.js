var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

console.log("starting");

function Coord(x,y){
    this.x = x;
    thix.y = y;
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

Map.prototype.calcOffset(x, y){
    return y * this.cols + x;
}

Map.prototype.get(x, y){
    var offset = this.calcOffset(x,y);
    return contents[offset];
}

Map.prototype.set(tile, x, y){
    var offset = this.calcOffset(x,y);
    contents[offset] = tile; 
}

Map.prototype.getRandomTerrain(){
    return this.terrain[Math.floor(Math.random() * Math.floor(this.terrain.length))]; 
}

Map.prototype.populate(){
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
    this.updateOccurred = false;
}

ViewPort.prototype.render(map){
    var topTile = Math.floor(this.topLeft.y / this.tileHeight);
    var leftTile = Math.floor(this.topLeft.x / this.tideWidth);
    var bottomTile = Math.floor(this.bottomRight.y / this.tileHeight);
    var rightTile = Math.floor(this.bottomRight.x / this.tileWidth);
    console.log("viewport is (", leftTile, ",", topTile, ") (", rightTile, ",", bottomTile, ")");

    // only redraw the scrren if it was updated
    if (this.updateOccurred){
	var x,y;
	for (y = topTile; y < bottomTile; ++y){
	    for(x = leftTile, x < rightTile, ++x){
		var tile = map.get(x, y);
		var coord = new Coord(x*this.tileWidth, y * this.tileHeight);
		var size = new Coord(this.tileWidth, this.tileHeight);
		//tile.render(coord, size);
	    }
	}
    }
}

var map = new Map(20, 20, 50, 50);
map.populate();
var initViewPortStart(0,0);
var initviewPortEnd(400,600);
var viewPort new ViewPort(initViewPortStart, initViewPortEnd);

var step = function() {
    update();
    render();
    animate(step);
};

var update = function() {
};

var render = function() {
    viewPort.render(map);
};


