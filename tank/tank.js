
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
    myTank.render(20, 20);
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
   this.rotation = 0;
};

Tank.prototype.render = function(x,y){
    // rect body
    context.clearRect(x, y, this.width, this.height);
    context.fillStyle = "Blue";
    context.fillRect(x, y, this.width, this.height);

    context.save();

    //context.translate( x + (this.width/2), y + (this.height/2));
    context.translate( x, y);
    context.rotate(this.rotation);

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

Tank.prototype.move = function(rotation){
    if (rotation > 2*Math.PI){
	rotation = 0;
    }
    else if (rotation < 0){
	rotation = 2 * Math.PI;
    }
    this.rotation = rotation;
}

Tank.prototype.update = function(){
    var rotation = 0;
    for(var key in keysDown) {
	var value = Number(key);
	if(value == 37) { // left arrow
	    rotation = -1;
	} else if (value == 39) { // right arrow
	    rotation = 1;
	}
	myTank.move(rotation);
    }

}


var myTank = new Tank(50,50);
