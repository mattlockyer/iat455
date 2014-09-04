

"use strict";

var CaptureEffect = function(canvas) {
	var self = this;
	//parameters
	self.canvas = canvas;
	self.interval = null;
	//controls
	self.name = 'Capture';
	self.controls = {
		Toggle:APP.Effect.toggle.bind(this),
		Freeze:function() {
			clearInterval(self.interval);
		}
	};
};

CaptureEffect.prototype = {
	draw: function() {
		APP.drawImage(this.canvas);
	}
};