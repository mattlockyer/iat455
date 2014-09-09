

"use strict";

var CaptureEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//controls
	self.name = 'Capture';
	self.controls = {
		//base controls added in app-utils.js
	};
};

CaptureEffect.prototype = {
	draw: function() {
		APP.drawImage(this.canvas);
	}
};