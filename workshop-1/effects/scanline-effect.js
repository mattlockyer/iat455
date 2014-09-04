

"use strict";

var ScanlineEffect = function(canvas) {
	var self = this;
	//parameters
	self.canvas = canvas;
	self.interval = null;
	//controls
	self.name = 'ScanlineEffect';
	self.controls = {
		Toggle:APP.Effect.toggle.bind(this),
		Thickness:{
			value:1,
			min:1,
			max:32,
			step:1
		},
		Scrollspeed:{
			value:1,
			min:0,
			max:8,
			step:1
		}
	};
};

ScanlineEffect.prototype = {
	draw: function() {
		var canvas = this.canvas,
		thickness = this.controls.Thickness.value,
		scrollSpeed = this.controls.Scrollspeed.value,
		w = MEDIA.width,
		h = MEDIA.height;

		APP.drawImage(canvas);

		var img = canvas.getImageData(),
		data = img.data;

		for (var i = 0; i < data.length; i += w * 2 * 4 * thickness) {
			for (var j = 0; j < w * 4 * thickness; j++) {
				data[i + j] = 0;
			}
		}

		canvas.putImageData(img);
	}
};