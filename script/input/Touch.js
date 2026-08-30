"use strict";

function Touch_Singleton() {
    this._position = Vector2.zero;
    this._startPosition = Vector2.zero;
    this._isDragging = false;
    this._isTouching = false;
    this._dragDistance = 0;
    this._dragAngle = 0;
    
    // Touch event handlers
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    
    document.addEventListener('touchstart', this._handleTouchStart, { passive: false });
    document.addEventListener('touchmove', this._handleTouchMove, { passive: false });
    document.addEventListener('touchend', this._handleTouchEnd, { passive: false });
}

Touch_Singleton.prototype._handleTouchStart = function(evt) {
    if (evt.touches.length > 0) {
        evt.preventDefault();
        var touch = evt.touches[0];
        var canvasScale = Canvas2D.scale;
        var canvasOffset = Canvas2D.offset;
        var tx = (touch.pageX - canvasOffset.x) / canvasScale.x;
        var ty = (touch.pageY - canvasOffset.y) / canvasScale.y;
        
        this._position = new Vector2(tx, ty);
        this._startPosition = new Vector2(tx, ty);
        this._isTouching = true;
        this._isDragging = false;
        this._dragDistance = 0;
        this._dragAngle = 0;
    }
};

Touch_Singleton.prototype._handleTouchMove = function(evt) {
    if (evt.touches.length > 0 && this._isTouching) {
        evt.preventDefault();
        var touch = evt.touches[0];
        var canvasScale = Canvas2D.scale;
        var canvasOffset = Canvas2D.offset;
        var tx = (touch.pageX - canvasOffset.x) / canvasScale.x;
        var ty = (touch.pageY - canvasOffset.y) / canvasScale.y;
        
        this._position = new Vector2(tx, ty);
        
        // Calculate drag distance and angle
        var dx = this._position.x - this._startPosition.x;
        var dy = this._position.y - this._startPosition.y;
        this._dragDistance = Math.sqrt(dx * dx + dy * dy);
        this._dragAngle = Math.atan2(dy, dx);
        
        // Start dragging if moved enough
        if (this._dragDistance > 10) {
            this._isDragging = true;
        }
    }
};

Touch_Singleton.prototype._handleTouchEnd = function(evt) {
    if (this._isDragging) {
        evt.preventDefault();
    }
    this._isTouching = false;
    this._isDragging = false;
};

Touch_Singleton.prototype.reset = function() {
    this._isDragging = false;
    this._isTouching = false;
    this._dragDistance = 0;
};

Object.defineProperty(Touch_Singleton.prototype, "position", {
    get: function() {
        return this._position;
    }
});

Object.defineProperty(Touch_Singleton.prototype, "startPosition", {
    get: function() {
        return this._startPosition;
    }
});

Object.defineProperty(Touch_Singleton.prototype, "isDragging", {
    get: function() {
        return this._isDragging;
    }
});

Object.defineProperty(Touch_Singleton.prototype, "isTouching", {
    get: function() {
        return this._isTouching;
    }
});

Object.defineProperty(Touch_Singleton.prototype, "dragDistance", {
    get: function() {
        return this._dragDistance;
    }
});

Object.defineProperty(Touch_Singleton.prototype, "dragAngle", {
    get: function() {
        return this._dragAngle;
    }
});

var Touch = new Touch_Singleton();
