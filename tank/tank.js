//
// this is a test framework for a simple game where two
// tanks battle each other. There is only 1 shot allowed
// at a time (per tank) and the shot can only go a certain
// distance so the tanks must get relatively close together. 

//this part is infrasturture framework
// it sets the animate function that is supported
// by the browser being used.
var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function(callback) { window.setTimeout(callback, 1000/60) };

// this is the width and height of the play field
var canvasWidth = 800;
var canvasHeight = 400;

// create the canvas.  a canvas is what we are drawing on
var canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext('2d');

// add the canvas to the window so
// we can see what we are drawing
window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

// this gets run every frame, it updates positions
// draws the objects and checks for collisions.
// each call is a one shot deal, so if we want
// this function called again, we need to make
// a call to animate each time
var step = function() {
    update();
    render();
    checkForCollisions();
    animate(step);
};

// this updates the tank and bullets
// positions for each player
var update = function() {
    player1.update();
    player2.update();
};

// this repaints the backgrouns and
// draws the tanks and bullets foreach player
var render = function() {
    context.fillStyle = "Black";
    context.fillRect(0, 0, canvas.width,canvas.height);
    player1.render();
    player2.render();
};

// keysDown keeps track of the keys currently pressed
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

// this is an infrasturcture object
function Circle(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
};

// this is an infrasturcture object
function Coord(x,y){
    this.x = x;
    this.y = y;
};

// this is the tank object.  rotation
// is in radians and is off by PI/2 because
// of how the tank is drawn.  It is facing up
// pi/2 instead of right which would be 0 PI 
function Tank(width,height, x, y){
    this.width = width;
    this.height = height;
    this.rotation = 0.0;
    this.speed = 2.0;
    this.xPos = x;
    this.yPos = y;
    this.killed = 0;
    this.nextShotAllowed = Date.now();
};

// support function to return the center
// of a tank
Tank.prototype.getCenter = function(){
    var xCenter = this.xPos + this.width / 2;
    var yCenter = this.yPos + this.height / 2;
    var center = new Coord(xCenter, yCenter);
    return center;
}

// support function used to determine collisions
Tank.prototype.getBoundingCircle = function(){
    var center = this.getCenter();
    var circle = new Circle(center.x, center.y, this.width / 2);
    return circle;
}

// this draws a tank.  The tank is drawn
// facing up, but we set the rotation to
// allow it to face different directions
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
	context.fillStyle = "DarkKhaki";
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

// update tells the tank how to move, this function
// actually does the move
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

	var prevXPos = this.xPos;
	var prevYpos =this.yPos;

	// we are moving along an angle,  the cos is the x coord in
	// the unit circle and the sin is the y coord in 
	// the unit circle We multiply those number by
	// the speed  to get the number of pixels to move on each axis
	this.xPos += this.speed * Math.cos(this.rotation + Math.PI/2);
	this.yPos += this.speed * Math.sin(this.rotation + Math.PI/2);

	// make sure we stay on the screen
	if (this.xPos + this.width > canvas.width){
	    this.xPos = canvas.width - this.width;
	}

	if (this.xPos < 0){
	    this.xPos = 0;
	}

	if ((this.yPos + this.height) > canvas.height){
	    this.yPos = canvas.height - this.height;
	}

	if (this.yPos < 0){
	    this.yPos = 0;
	}

	// don't move if we are going to be in a collision
	if (didCollide(player1.tank, player2.tank)){
	    this.xPos = prevXPos;
	    this.yPos = prevYpos;
	}
    }
}

// this is the bullet object
// display is set to true when a shot is in progress
// max distance is the max distance a shot can travel
// angleRadians is the angle that the bullet is moving along
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

// this sets the start point and the angle for a bullet
Bullet.prototype.setVector = function(x, y, angleRadians){
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.angleRadians = angleRadians;
}

// this sets the currDistance (which we don't really need
// and the speed of the bullet
Bullet.prototype.initDistance = function(){
    this.currDistance = 0;
    this.speed = -6;
}

// this function sets the current position of the bullet
// PI/2 is used to correct for the tank facing up treated
// as 0 instead of the tank facing right being treated as 0
Bullet.prototype.move = function(){
    // cos is the x coord, sin is the y coord 
    var distX = this.speed * Math.cos(this.angleRadians + Math.PI/2);
    var distY = this.speed * Math.sin(this.angleRadians + Math.PI/2);
    this.x += distX;
    this.y += distY;

    // get variable to calculate distance
    var x1 = this.x;
    var x2 = this.initialX;
    var y1 = this.y;
    var y2 = this.initialY;

    var dist = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2-y1), 2));

    // if the distance traveled is over the limit,stop
    // displaying the bullet
    this.currDistance = (Math.abs(dist));
    if (this.currDistance >= this.maxDistance){
	this.display = false;
    }

    // if the bullet goes off the screen stop displaying it
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

// draw the bullet
Bullet.prototype.render = function(){
    if (this.display){
	context.beginPath();
	context.fillStyle = "Green";
	context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	context.fill();
    }
}

// used to detect collisions
Bullet.prototype.getBoundingCircle = function(){
    var circle = new Circle(this.x, this.y, this.radius); 
    return circle;
}

// a player encapsulates a tank and a bullet
// the controls are different per player
function Player(id, x, y){
    this.tank = new Tank(50, 50, x, y);
    this.bullet = new Bullet();
    this.id = id;
}

// update the positions of the tank and bullet
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

	    // do not allow player to keep shooting
	    // a dead tank
	    if (this.tank.nextShotAllowed < Date.now()){
		// set the bullet to display
		// and set the initial position
		// which is the top of the gun muzzle.
		// we need to do a little math to figure
		// out where that is
		this.bullet.display = true;
		this.bullet.initDistance();    
		var center = this.tank.getCenter();
		var yCoord = center.y - Math.sin(this.tank.rotation + Math.PI/2) * this.tank.height/2;
		var xCoord = center.x - Math.cos(this.tank.rotation + Math.PI/2) * this.tank.width/2;
		this.bullet.setVector(xCoord, yCoord, this.tank.rotation);
	    }
	}
    }

    // don't move the bullet if it has not been shoT
    if (this.bullet.display){
	this.bullet.move();
    }

    // handle case where tank is killed
    // a killed tank will spin
    if (this.tank.killed > 0){
	speed = 0;
	this.tank.killed -= 1;
	rotation = .1;
    }

    // don't move the tank if it will not move
    if ((rotation != 0) || (speed != 0)){
	this.tank.move(rotation, speed);
    }
}

// draw the tank and bullet 
Player.prototype.render = function(){
    this.tank.render(this.id);
    this.bullet.render();
}

// here are the two players
var player1 = new Player(1, 20, 20);
var player2 = new Player(2, 80, 80);

// this function determines if two objects
// collided
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

// this function will check if there were any
// collisions
function checkForCollisions(){
    // check if player1 bullet hit player2 tank
    if (player1.bullet.display){
	if (didCollide(player1.bullet, player2.tank)){
	    player1.bullet.display = false;
	    if (player2.tank.killed == 0){
		player2.tank.killed = 100;
		// can't shoot for another 5 seconds
		player1.tank.nextShotAllowed = Date.now() + 5000;
	    }
	}
    }

    // check if player1 bullet hit player1 tank
    if (player2.bullet.display){
	if (didCollide(player2.bullet, player1.tank)){
	    player2.bullet.display = false;
	    if (player2.tank.killed == 0){
		player1.tank.killed = 100;
		// can't shoot for another 5 seconds
		player2.tank.nextShotAllowed = Date.now() + 5000;
	    }
	}
    }
}
