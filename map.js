console.log("starting");
// map is made of 20pix x 20pix blocks
// right now, each map is just a filled rect

const TILE_WIDTH = 20;
const TILE_HEIGHT = 20;

var terrain = [ "grass", "trees", "dirt", "water" ];
var topPixel = 0;
var leftPixel = 0;
var width = 400;
var height = 600;
var topRow = 0;
var leftCol = 0;
var mapWidth = width / TILE_WIDTH;
var mapHeight = height / TILE_HEIGHT; 

// this hold the terrain to draw
var map = [];

function calcMapOffset(col, row){
    return row * mapWidth + col;
}

function Tile(type, col, row) {
  this.type = type;
  this.row = row;
  this.col = col;
  this.pixelCol = col * TILE_WIDTH;
  this.pixelRow = row * TILE_HEIGHT;
}

Tile.prototype.render = function() {
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

  var pixelX = this.pixelCol - leftPixel;
  var pixelY = this.pixelRow - topPixel;
  context.fillStyle = color;
  context.fillRect(pixelX, pixelY, TILE_WIDTH, TILE_HEIGHT);
}

function getRandomTerrain(){
   return terrain[Math.floor(Math.random() * Math.floor(terrain.length))]; 
}

//populate terrain
function populateMap(){
    console.log("creating map");
    var y;
    var x;
    for(y = 0; y < mapHeight; ++y){
	for(x = 0; x < mapWidth; ++x){
	    var type = getRandomTerrain();
	    var offset = calcMapOffset(x, y);
	    var tile = new Tile(type, y, x);
	    map.push(tile);
	}
    }
}

function DrawMap(){
    var topTile = 0;
    var leftTile = 0;
    var bottomTile = mapHeight; 
    var rightTile =  mapWidth;

    var y;
    var x;
    for(y = topTile; y < bottomTile; y++){
	for(x = leftTile; x <rightTile; x++){
	    var offset = calcMapOffset(x, y);
	    map[offset].render();
	}
    }
    
}   

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

populateMap();

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
};

var render = function() {
    DrawMap();
};



