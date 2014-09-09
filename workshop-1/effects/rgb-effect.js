

"use strict";

var RGBEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//controls
	self.name = 'RGBEffect';
	self.controls = {
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

			data[i] = r > rThresh ? r : 0;
			data[i + 1] = g > gThresh ? g : 0;
			data[i + 2] = b > bThresh ? b : 0;
		}

		canvas.putImageData(img);
	}
};