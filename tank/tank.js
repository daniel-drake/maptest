
var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
//function(callback) { window.setTimeout(callback, 1000/2) };
function(callback) { window.setTimeout(callback, 1000/60) };

var canvasWidth = 400;
var canvasHeight = 400;

var canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext('2d');

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};


console.log("starting");

var step = function() {
    update();
    render();
    animate(step);
};

var update = function() {
    myTank.update();
};

var render = function() {
    context.fillStyle = "Black";
    context.fillRect(0, 0, canvas.width,canvas.height);
    myTank.render();
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

function Tank(width,height){
    this.width = width;
    this.height = height;
    this.rotation = 0.0;
    this.speed = 2.0;
    this.xPos = 20;
    this.yPos = 20;

};

Tank.prototype.render = function(){

    context.save();

    var x = this.xPos;
    var y = this.yPos;

    var xCenter = x + this.width / 2;
    var yCenter = y + this.height / 2;
    context.translate(xCenter, yCenter);
    context.rotate(this.rotation);
    context.translate(-xCenter, -yCenter);

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
    context.strokeStyle = "Red";
    context.arc(x + (this.width / 2), y + (this.height/ 2), bodyWidth / 2, 0, 2 * Math.PI);
    context.stroke();

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
	myTank.move(rotation, speed);
    }
}


var myTank = new Tank(50,50);
