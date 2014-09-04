

"use strict";

var RGBEffect = function(canvas) {
	var self = this;
	//parameters
	self.canvas = canvas;
	self.interval = null;
	//controls
	self.name = 'RGBEffect';
	self.controls = {
		Toggle:APP.Effect.toggle.bind(this),
		RedThreshold:{
			value:128,
			min:0,
			max:255,
			step:2
		},
		GreenThreshold:{
			value:128,
			min:0,
			max:255,
			step:2
		},
		BlueThreshold:{
			value:128,
			min:0,
			max:255,
			step:2
		}
	};
};

RGBEffect.prototype = {
	draw: function() {
		var canvas = this.canvas,
		rThresh = this.controls.RedThreshold.value,
		gThresh = this.controls.GreenThreshold.value,
		bThresh = this.controls.BlueThreshold.value,
		w = MEDIA.width,
		h = MEDIA.height;

		APP.drawImage(canvas);

		var img = canvas.getImageData(),
		data = img.data;

		for (var i = 0; i < data.length; i += 4) {
			var r = data[i],
			g = data[i + 1],
			b = data[i + 2];

			if (r > g && r > b) {
				data[i] = r > rThresh ? 255 : 0;
				data[i + 1] = 0;
				data[i + 2] = 0;
			} else if (g > r && g > b) {
				data[i] = 0;
				data[i + 1] = g > gThresh ? 255 : 0;
				data[i + 2] = 0;
			} else {
				data[i] = 0;
				data[i + 1] = 0;
				data[i + 2] = b > bThresh ? 255 : 0;
			}
		}

		canvas.putImageData(img);
	}
};