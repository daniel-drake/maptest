
var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function(callback) { window.setTimeout(callback, 1000/60) };

var canvasWidth = 800;
var canvasHeight = 400;

var canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext('2d');

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

var step = function() {
    update();
    render();
    checkForCollisions();
    animate(step);
};

var update = function() {
    player1.update();
    player2.update();
};

var render = function() {
    context.fillStyle = "Black";
    context.fillRect(0, 0, canvas.width,canvas.height);
    player1.render();
    player2.render();
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

function Circle(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
};

function Coord(x,y){
    this.x = x;
    this.y = y;
};

function Tank(width,height, x, y){
    this.width = width;
    this.height = height;
    this.rotation = 0.0;
    this.speed = 2.0;
    this.xPos = x;
    this.yPos = y;
};

Tank.prototype.getCenter = function(){
    var xCenter = this.xPos + this.width / 2;
    var yCenter = this.yPos + this.height / 2;
    var center = new Coord(xCenter, yCenter);
    return center;
}

Tank.prototype.getBoundingCircle = function(){
    var center = this.getCenter();
    var circle = new Circle(center.x, center.y, this.width / 2);
    return circle;
}

Tank.prototype.render = function(id){

    context.save();

    var x = this.xPos;
    var y = this.yPos;
    var center = this.getCenter();

    context.translate(center.x, center.y);
    context.rotate(this.rotation);
    context.translate(-center.x, -center.y);

    var trackWidth = this.width * .25;
    var bodyWidth = this.width *.5;
    var trackHeight = this.height  * 1;
    var bodyHeight = this.height * .75;
    var leftTrackXOffset = 0 + x;
    var leftTrackYOffset = 0 + y; 
    var bodyXOffset = this.width * .25 + x;
    var bodyYOffset = this.height * .125 + y;
    var rightTrackXOffset = this.width * .75 + x;
    var rightTrackYOffset = leftTrackYOffset;
   
    // left track
    context.beginPath();
    context.strokeStyle = "White";
    context.moveTo(leftTrackXOffset, leftTrackYOffset);
    context.lineTo(leftTrackXOffset, leftTrackYOffset + trackHeight);
    context.lineTo(leftTrackXOffset + trackWidth, leftTrackYOffset + trackHeight);
    context.lineTo(leftTrackXOffset + trackWidth, leftTrackYOffset);
    context.lineTo(leftTrackXOffset, leftTrackYOffset);
    context.stroke();
    
    // body
    context.beginPath();
    context.strokeStyle = "White";
    context.moveTo(bodyXOffset, bodyYOffset);
    context.lineTo(bodyXOffset, bodyYOffset + bodyHeight);
    context.lineTo(bodyXOffset + bodyWidth, bodyYOffset + bodyHeight);
    context.lineTo(bodyXOffset + bodyWidth, bodyYOffset);
    context.lineTo(bodyXOffset, bodyYOffset);
    context.stroke();

    // right track
    context.beginPath();
    context.strokeStyle = "White";
    context.moveTo(rightTrackXOffset, rightTrackYOffset);
    context.lineTo(rightTrackXOffset, rightTrackYOffset + trackHeight);
    context.lineTo(rightTrackXOffset + trackWidth, rightTrackYOffset + trackHeight);
    context.lineTo(rightTrackXOffset + trackWidth, rightTrackYOffset);
    context.lineTo(rightTrackXOffset, rightTrackYOffset);
    context.stroke();

    // turrent
    context.beginPath();
    if (id == 1){
	context.fillStyle = "Red";
    }
    else if (id == 2){
	context.fillStyle = "Brown";
    }
    context.arc(x + (this.width / 2), y + (this.height/ 2), bodyWidth / 2, 0, 2 * Math.PI);
    context.fill();

    // draw the gun
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = "White";
    context.moveTo(x + (this.width / 2), y + (this.height/ 2));
    context.lineTo(x + (this.width / 2), y);
    context.stroke();

    context.restore();
 };

Tank.prototype.move = function(rotation, speed){

    if (rotation != 0){
	this.rotation += rotation;
	if (this.rotation > 2*Math.PI){
	    this.rotation = 0;
	}
	else if (this.rotation < 0){
	    this.rotation = 2 * Math.PI;
	}
    }

    if (speed != 0){
	this.speed = speed;
	// adjusting by Math.PI/2 is correcting direction for front
	// of tank
	this.xPos += this.speed * Math.cos(this.rotation + Math.PI/2);
	this.yPos += this.speed * Math.sin(this.rotation + Math.PI/2);

	if (this.xPos > canvas.width){
	    this.xPos = canvas.width;
	}

	if (this.xPos < 0){
	    this.xPos = 0;
	}

	if (this.yPos > canvas.height){
	    this.yPos = canvas.height;
	}

	if (this.yPos < 0){
	    this.yPos = 0;
	}
    }
}

Tank.prototype.update = function(){
    var rotation = 0;
    var speed = 0;
    
    for(var key in keysDown) {
	var value = Number(key);
	if(value == 37) { // left arrow
	    rotation += -.1;
	} else if (value == 39) { // right arrow
	    rotation += .1;
	}
	else if (value == 38) { // up arrow
	    speed = -3;
	}
	else if (value == 40) { // down arrow
	    speed = 3;
	}
    }

    if ((rotation != 0) || (speed != 0)){
	this.move(rotation, speed);
    }
}

function Bullet(){
    this.x = 0;
    this.y = 0;
    this.angleRadians = 0;
    this.maxDistance = 200;
    this.currDistance = 0;
    this.speed = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.radius = 4;
}

Bullet.prototype.setVector = function(x, y, angleRadians){
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.angleRadians = angleRadians;
}

Bullet.prototype.initDistance = function(){
    this.currDistance = 0;
    this.speed = -6;
}

Bullet.prototype.move = function(){
    var distX = this.speed * Math.cos(this.angleRadians + Math.PI/2);
    var distY = this.speed * Math.sin(this.angleRadians + Math.PI/2);
    this.x += distX;
    this.y += distY;

    var x1 = this.x;
    var x2 = this.initialX;
    var y1 = this.y;
    var y2 = this.initialY;

    var dist = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2-y1), 2));
    this.currDistance = (Math.abs(dist));
    if (this.currDistance >= this.maxDistance){
	this.display = false;
    }

    if (this.x > canvas.width){
	this.display = false;
    }

    if (this.x < 0){
	this.display = false;
    }

    if (this.y > canvas.height){
	this.display = false;
    }

    if (this.y < 0){
	this.display = false;
    }
}

Bullet.prototype.render = function(){
    if (this.display){
	context.beginPath();
	context.fillStyle = "Green";
	context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	context.fill();
    }
}

Bullet.prototype.getBoundingCircle = function(){
    var circle = new Circle(this.x, this.y, this.radius); 
    return circle;
}

function Player(id, x, y){
    this.tank = new Tank(50, 50, x, y);
    this.bullet = new Bullet();
    this.id = id;
}

Player.prototype.update = function(){

    var rotation = 0;
    var speed = 0;
    var up;
    var down;
    var left;
    var right;
    var shoot;

    // controls for player1 [cursor keys, space to shoot]
    if (this.id == 1){
    	up = 38;
	down = 40;
	left = 37;
	right = 39;
	shoot = 32;
    }
    // controls for player2 [wasd, f to shoot]
    else if (this.id == 2){
	up = 87;
	down = 83;
	left = 65;
	right = 68;
	shoot = 70;
    }
    
    for(var key in keysDown) {
	var value = Number(key);
	if(value == left) { 
	    rotation += -.1;
	} else if (value == right) { 
	    rotation += .1;
	}
	else if (value == up) { 
	    speed = -3;
	}
	else if (value == down) { 
	    speed = 3;
	}
	else if(value == shoot) {  
	    this.bullet.display = true;
	    this.bullet.initDistance();    
	    var center = this.tank.getCenter();
	    var yCoord = center.y - Math.sin(this.tank.rotation + Math.PI/2) * this.tank.height/2;
	    var xCoord = center.x - Math.cos(this.tank.rotation + Math.PI/2) * this.tank.width/2;
	    this.bullet.setVector(xCoord, yCoord, this.tank.rotation);
	}
    }

    if (this.bullet.display){
	this.bullet.move();
    }

    if ((rotation != 0) || (speed != 0)){
	this.tank.move(rotation, speed);
    }
}

Player.prototype.render = function(){
    this.tank.render(this.id);
    this.bullet.render();
}

var player1 = new Player(1, 20, 20);
var player2 = new Player(2, 80, 80);

function didCollide( obj1, obj2){
    var collision = false;
    var circle1 = obj1.getBoundingCircle();
    var circle2 = obj2.getBoundingCircle();

    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy,2));
    if (dist < (circle1.radius + circle2.radius)){
	collision = true;
    }

    return collision;
}

function checkForCollisions(){
    // check if player1 bullet hit player2 tank
    if (player1.bullet.display){
	if (didCollide(player1.bullet, player2.tank)){
	    player1.bullet.display = false;
	    console.log ("player1 hit player2");
	}
    }
    if (player2.bullet.display){
	if (didCollide(player2.bullet, player1.tank)){
	    player2.bullet.display = false;
	    console.log ("player2 hit player1");
	}
    }
}
