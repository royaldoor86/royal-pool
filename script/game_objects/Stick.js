"use strict";

function Stick(position){
    this.position = position;
    this.origin = new Vector2(970,11);
    this.shotOrigin = new Vector2(950,11);
    this.shooting = false;
    this.visible = true;
    this.rotation = 0;
    this.power = 0;
    this.trackMouse = true;
    this.wasDragging = false;
}

Stick.prototype.handleInput = function (delta) {

    if(AI_ON && Game.policy.turn === AI_PLAYER_NUM)
      return;

    if(Game.policy.turnPlayed)
      return;

    // Keyboard controls (W/S for power)
    if(Keyboard.down(Keys.W) && KEYBOARD_INPUT_ON){
      if(this.power < 75){
        this.origin.x+=2;
        this.power+=1.2;
      }
    }

    if(Keyboard.down(Keys.S) && KEYBOARD_INPUT_ON){
      if(this.power>0){
        this.origin.x-=2;
        this.power-=1.2;
      }
    }

    // Mouse click to shoot
    else if (this.power>0 && Mouse.left.down){
      var strike = sounds.strike.cloneNode(true);
      strike.volume = (this.power/(10))<1?(this.power/(10)):1;
      strike.play();
      Game.policy.turnPlayed = true;
      this.shooting = true;
      this.origin = this.shotOrigin.copy();

      Game.gameWorld.whiteBall.shoot(this.power, this.rotation);
      var stick = this;
      setTimeout(function(){stick.visible = false;}, 500);
    }
    
    // Touch controls - simplified version
    else if (Touch.isTouching) {
      if (Touch.isDragging) {
        // Direction of drag = shot direction (opposite to drag)
        this.rotation = Touch.dragAngle + Math.PI;
        
        // Distance of drag = power
        var maxDragDistance = 150;
        var dragPower = Math.min(Touch.dragDistance / maxDragDistance, 1) * 75;
        this.power = dragPower;
        this.origin.x = 970 + (this.power * 2);
        this.wasDragging = true;
        
        console.log("Touch drag - power:", this.power, "rotation:", this.rotation);
      } else {
        // Just touching - aim at touch position
        var opposite = Touch.position.y - this.position.y;
        var adjacent = Touch.position.x - this.position.x;
        this.rotation = Math.atan2(opposite, adjacent);
      }
    }
    
    // Shoot when touch ends after dragging
    else if (!Touch.isTouching && this.wasDragging && this.power > 0) {
      console.log("Touch shoot - power:", this.power, "rotation:", this.rotation);
      this.shoot(this.power, this.rotation);
      this.wasDragging = false;
      Touch.reset();
    }
    
    // Mouse aiming (only if not using touch)
    else if(this.trackMouse && !Touch.isTouching){
      var opposite = Mouse.position.y - this.position.y;
      var adjacent = Mouse.position.x - this.position.x;
      this.rotation = Math.atan2(opposite, adjacent);
    }
};

Stick.prototype.shoot = function(power, rotation){
  this.power = power;
  this.rotation = rotation;

  if(Game.sound && SOUND_ON){
    var strike = sounds.strike.cloneNode(true);
    strike.volume = (this.power/(10))<1?(this.power/(10)):1;
    strike.play();
  }
  Game.policy.turnPlayed = true;
  this.shooting = true;
  this.origin = this.shotOrigin.copy();

  Game.gameWorld.whiteBall.shoot(this.power, this.rotation);
  var stick = this;
  setTimeout(function(){stick.visible = false;}, 500);
}

Stick.prototype.update = function(){
  if(this.shooting && !Game.gameWorld.whiteBall.moving)
    this.reset();
};

Stick.prototype.reset = function(){
  if (Game.gameWorld && Game.gameWorld.whiteBall) {
    this.position.x = Game.gameWorld.whiteBall.position.x;
    this.position.y = Game.gameWorld.whiteBall.position.y;
  }
	this.origin = new Vector2(970,11);
  this.shooting = false;
  this.visible = true;
	this.power = 0;
  this.wasDragging = false;
  this.trackMouse = true;
};

Stick.prototype.draw = function () {
  if(!this.visible)
    return;
  Canvas2D.drawImage(sprites.stick, this.position,this.rotation,1, this.origin);
  
  // Draw touch indicator when using touch controls
  if(Touch.isTouching && Touch.isDragging) {
    var ctx = Canvas2D._canvas.getContext('2d');
    
    // Draw drag line
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(Touch.position.x, Touch.position.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw power indicator
    var powerPercent = (this.power / 75) * 100;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Power: ' + Math.round(powerPercent) + '%', this.position.x, this.position.y - 40);
  }
};