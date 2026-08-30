"use strict";

var TouchInstructions = {
    show: function() {
        var canvas = Canvas2D._canvas;
        var ctx = canvas.getContext('2d');
        
        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Instructions text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('طريقة اللعب باللمس', canvas.width / 2, canvas.height / 2 - 80);
        
        ctx.font = '18px Arial';
        ctx.fillText('1. المس الشاشة لتوجيه العصا', canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText('2. اسحب إصبعك للخلف لزيادة القوة', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('3. اترك الشاشة للضرب', canvas.width / 2, canvas.height / 2 + 50);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#aaa';
        ctx.fillText('المس أي مكان للاستمرار', canvas.width / 2, canvas.height / 2 + 100);
        
        this._visible = true;
    },
    
    hide: function() {
        this._visible = false;
    },
    
    isVisible: function() {
        return this._visible;
    },
    
    _visible: false
};