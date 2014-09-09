

"use strict";

var ScanlineEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	self.y = 0;
	//controls
	self.name = 'ScanlineEffect';
	self.controls = {
		Thickness:{
			value:2,
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
		h = MEDIA.height,
		lineWidth = w * 4;

		this.y += scrollSpeed;
		if (this.y > thickness * 2) this.y = 0;

		APP.drawImage(canvas);

		var img = canvas.getImageData(),
		data = img.data;

		for (var i = this.y * lineWidth; i < data.length; i += lineWidth * 2 * thickness) {
			for (var j = 0; j < lineWidth * thickness; j++) {
				data[i + j] = 0;
			}
		}

		canvas.putImageData(img);
	}
};