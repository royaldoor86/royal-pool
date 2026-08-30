"use strict";

function Touch_Singleton() {
    this._position = Vector2.zero;
    this._startPosition = Vector2.zero;
    this._isDragging = false;
    this._isTouching = false;
    this._dragDistance = 0;
    this._dragAngle = 0;
    this._initialized = false;
    this._fallbackAttempted = false;
    this._wasPressed = false;
    
    // Touch event handlers
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    
    // Initialize when DOM is ready
    this.initialize();
}

Touch_Singleton.prototype.initialize = function() {
    if (this._initialized) return;
    
    // Add touch event listeners to canvas instead of document
    var canvas = document.getElementById('screen');
    if (canvas) {
        canvas.addEventListener('touchstart', this._handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', this._handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', this._handleTouchEnd, { passive: false });
        canvas.addEventListener('touchcancel', this._handleTouchEnd, { passive: false });
        this._initialized = true;
        console.log("Touch system initialized on canvas");
    } else {
        // Fallback to document if canvas not found after multiple attempts
        if (!this._fallbackAttempted) {
            this._fallbackAttempted = true;
            document.addEventListener('touchstart', this._handleTouchStart, { passive: false });
            document.addEventListener('touchmove', this._handleTouchMove, { passive: false });
            document.addEventListener('touchend', this._handleTouchEnd, { passive: false });
            this._initialized = true;
            console.log("Touch system initialized on document (fallback)");
        } else {
            // Try again after a delay
            var self = this;
            setTimeout(function() {
                self.initialize();
            }, 100);
        }
    }
};

Touch_Singleton.prototype._handleTouchStart = function(evt) {
    if (evt.touches.length > 0) {
        evt.preventDefault();
        var touch = evt.touches[0];
        var canvas = Canvas2D._canvas;
        var rect = canvas.getBoundingClientRect();
        
        var tx = touch.clientX - rect.left;
        var ty = touch.clientY - rect.top;
        
        // Scale to canvas coordinates
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        
        this._position = new Vector2(tx * scaleX, ty * scaleY);
        this._startPosition = new Vector2(tx * scaleX, ty * scaleY);
        this._isTouching = true;
        this._isDragging = false;
        this._dragDistance = 0;
        this._dragAngle = 0;
        this._wasPressed = true;
        
        console.log("Touch start at:", this._position.x, this._position.y);
    }
};

Touch_Singleton.prototype._handleTouchMove = function(evt) {
    if (evt.touches.length > 0 && this._isTouching) {
        evt.preventDefault();
        var touch = evt.touches[0];
        var canvas = Canvas2D._canvas;
        var rect = canvas.getBoundingClientRect();
        
        var tx = touch.clientX - rect.left;
        var ty = touch.clientY - rect.top;
        
        // Scale to canvas coordinates
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        
        this._position = new Vector2(tx * scaleX, ty * scaleY);
        
        // Calculate drag distance and angle
        var dx = this._position.x - this._startPosition.x;
        var dy = this._position.y - this._startPosition.y;
        this._dragDistance = Math.sqrt(dx * dx + dy * dy);
        this._dragAngle = Math.atan2(dy, dx);
        
        // Start dragging if moved enough (reduced threshold for mobile)
        if (this._dragDistance > 5) {
            this._isDragging = true;
        }
        
        console.log("Touch move:", this._position.x, this._position.y, "drag:", this._dragDistance);
    }
};

Touch_Singleton.prototype._handleTouchEnd = function(evt) {
    if (this._isDragging) {
        evt.preventDefault();
        console.log("Touch end - drag detected, distance:", this._dragDistance);
    } else if (this._isTouching) {
        // Tap detected (short touch without drag)
        console.log("Touch end - tap detected");
    }
    this._isTouching = false;
    this._isDragging = false;
};

Touch_Singleton.prototype.reset = function() {
    this._isDragging = false;
    this._isTouching = false;
    this._dragDistance = 0;
    this._wasPressed = false;
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

Object.defineProperty(Touch_Singleton.prototype, "pressed", {
    get: function() {
        return this._wasPressed;
    }
});

var Touch = new Touch_Singleton();
