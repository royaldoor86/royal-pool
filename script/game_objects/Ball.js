"use strict";

function Ball(initPos,color){
	this.initPos = initPos;
    this.position = initPos.copy();
    this.origin = new Vector2(25,25);
    this.velocity = Vector2.zero;
    this.color = color; 
    this.moving = false;
    this.visible = true;
    this.inHole = false;
    this.ballNumber = undefined;
}

Object.defineProperty(Ball.prototype, "color",
    {
    	get: function(){
    		if(this.sprite == sprites.redBall){
    			return Color.red;
    		}
    		else if(this.sprite == sprites.yellowBall){
    			return Color.yellow;
    		}
			else if(this.sprite == sprites.blackBall){
    			return Color.black;
    		}
    		else{
    			return Color.white;
    		}
    	},
        set: function (value) {
            if (value === Color.red){
                this.sprite = sprites.redBall;
            }
            else if(value == Color.yellow){
            	this.sprite = sprites.yellowBall;
            }
			else if(value == Color.black){
            	this.sprite = sprites.blackBall;
            }
            else{
            	this.sprite = sprites.ball;
            }
        }
    });

Ball.prototype.shoot = function(power, angle){
    if(power <= 0)
        return;

    this.moving = true;

    this.velocity = calculateBallVelocity(power,angle);
}

var calculateBallVelocity = function(power, angle){

    return new Vector2(100*Math.cos(angle)*power,100*Math.sin(angle)*power);
}

Ball.prototype.update = function(delta){

    this.updatePosition(delta);

    this.velocity.multiplyWith(0.98);

	if(this.moving && Math.abs(this.velocity.x) < 1 && Math.abs(this.velocity.y) < 1){
        this.stop();
    }
}

Ball.prototype.updatePosition = function(delta){

    if(!this.moving || this.inHole)
        return;
    var ball = this;
    var newPos = this.position.add(this.velocity.multiply(delta));


	if(Game.policy.isInsideHole(newPos)){
        if(Game.sound && SOUND_ON){
            var holeSound = sounds.hole.cloneNode(true);
            holeSound.volume = 0.5;
            holeSound.play();
        }
		this.position = newPos;
        this.inHole = true;
        setTimeout(function(){ball.visible=false;ball.velocity = Vector2.zero;}, 100);
        Game.policy.handleBallInHole(this);
		return;
	}

    var collision = this.handleCollision(newPos);

    if(collision){
		this.velocity.multiplyWith(0.95);
    }else{
    	this.position = newPos;
    }
}

Ball.prototype.handleCollision = function(newPos){

	var collision = false;

	if(Game.policy.isXOutsideLeftBorder(newPos, this.origin)){
        this.velocity.x = -this.velocity.x;
        this.position.x = Game.policy.leftBorderX + this.origin.x;
        collision = true;
    }
    else if(Game.policy.isXOutsideRightBorder(newPos, this.origin)){
        this.velocity.x = -this.velocity.x;
        this.position.x = Game.policy.rightBorderX - this.origin.x;
        collision = true;
    }

    if(Game.policy.isYOutsideTopBorder(newPos, this.origin)){
        this.velocity.y = -this.velocity.y;
        this.position.y = Game.policy.topBorderY + this.origin.y;
        collision = true;
    }
    else if(Game.policy.isYOutsideBottomBorder(newPos, this.origin)){
        this.velocity.y = -this.velocity.y;
        this.position.y = Game.policy.bottomBorderY - this.origin.y;
        collision = true;
    }

    return collision;
}

Ball.prototype.stop = function(){

    this.moving = false;
    this.velocity = Vector2.zero;
}

Ball.prototype.reset = function(){
	this.inHole = false;
	this.moving = false;
	this.velocity = Vector2.zero;
	this.position = this.initPos;
	this.visible = true;
	this.ballNumber = undefined;
}

Ball.prototype.out = function(){

	this.position = new Vector2(0, 900);
	this.visible = false;
	this.inHole = true;

}

Ball.prototype.draw = function () {
    if(!this.visible)
        return;

    // Enhanced realistic ball rendering
    var ctx = Canvas2D._canvas.getContext('2d');
    var radius = 25;
    var x = this.position.x;
    var y = this.position.y;
    
    // Get base color from sprite or use enhanced colors
    var baseColor = this.getRealisticColor();
    
    // Create radial gradient for 3D effect
    var gradient = ctx.createRadialGradient(
        x - radius/3, y - radius/3, radius/10,  // highlight
        x, y, radius                           // base
    );
    
    gradient.addColorStop(0, this.lightenColor(baseColor, 60));  // highlight
    gradient.addColorStop(0.3, this.lightenColor(baseColor, 20)); // mid-tone
    gradient.addColorStop(0.7, baseColor);                        // base color
    gradient.addColorStop(1, this.darkenColor(baseColor, 40));   // shadow
    
    // Draw ball with gradient
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add subtle shadow
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    
    // Add number for all balls (realistic pool balls)
    var ballNumber = this.getBallNumber();
    if (ballNumber > 0) {
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ballNumber.toString(), x, y);
    }
};

Ball.prototype.getRealisticColor = function() {
    // Return realistic pool ball colors
    if(this.sprite == sprites.redBall){
        return '#CC0000'; // Deep red
    }
    else if(this.sprite == sprites.yellowBall){
        return '#FFD700'; // Golden yellow
    }
    else if(this.sprite == sprites.blackBall){
        return '#1a1a1a'; // Deep black
    }
    else{
        return '#FFFFFF'; // Pure white
    }
};

// Add additional ball colors for more realistic set
Ball.prototype.getBallNumber = function() {
    // Store number if not already assigned
    if (this.ballNumber === undefined) {
        if(this.sprite == sprites.redBall){
            this.ballNumber = Math.floor(Math.random() * 7) + 1; // 1-7 for solids
        }
        else if(this.sprite == sprites.yellowBall){
            this.ballNumber = Math.floor(Math.random() * 7) + 9; // 9-15 for stripes
        }
        else if(this.sprite == sprites.blackBall){
            this.ballNumber = 8; // 8-ball
        }
        else{
            this.ballNumber = 0; // Cue ball
        }
    }
    return this.ballNumber;
};

Ball.prototype.lightenColor = function(color, percent) {
    var num = parseInt(color.replace("#",""),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
};

Ball.prototype.darkenColor = function(color, percent) {
    var num = parseInt(color.replace("#",""),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R>0?R:0)*0x10000 + (G>0?G:0)*0x100 + (B>0?B:0)).toString(16).slice(1);
};