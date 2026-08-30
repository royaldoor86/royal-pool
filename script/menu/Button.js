function Button(sprite, position, callback, hoverSprite){

    this.sprite = sprite;
    this.hoverSprite = hoverSprite ? hoverSprite : sprite;
    this.position = position;
    this.callback = callback;
}

Button.prototype.draw = function(){

    if(this.mouseInsideBorders() || this.touchInsideBorders()){
        Canvas2D.drawImage(this.hoverSprite, this.position, 0, 1);
        Canvas2D._canvas.style.cursor = "pointer";
    }
    else{
        Canvas2D.drawImage(this.sprite, this.position, 0, 0.98);
    }
}

Button.prototype.handleInput = function(){

    // Support both mouse and touch
    var isPressed = (Mouse.left.pressed && this.mouseInsideBorders()) ||
                   (Touch.pressed && this.touchInsideBorders());
    
    if(isPressed){
        this.callback();
    }
}

Button.prototype.mouseInsideBorders = function(){
    
    mousePos = Mouse.position;

    if(mousePos.x > this.position.x 
        &&
        mousePos.x < this.position.x + this.sprite.width
        &&
        mousePos.y > this.position.y
        &&
        mousePos.y < this.position.y + this.sprite.height
    ){
        return true;
    }

    return false;
}

Button.prototype.touchInsideBorders = function(){
    
    touchPos = Touch.position;

    if(touchPos.x > this.position.x 
        &&
        touchPos.x < this.position.x + this.sprite.width
        &&
        touchPos.y > this.position.y
        &&
        touchPos.y < this.position.y + this.sprite.height
    ){
        return true;
    }

    return false;
}