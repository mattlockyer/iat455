

"use strict";

var RGBMatteEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//create another canvas object for the other source image
	self.otherCanvas = new MEDIA.Canvas();
	//controls
	self.name = 'RGBMatteEffect';

	self.controls = {
		LoadBackground:function() {
			APP.loadImage(self.otherCanvas);
		},
		ChannelSelector:{
			value:1,
			min:1,
			max:3,
			step:1
		},
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

RGBMatteEffect.prototype = {
	draw: function() {
		var canvas = this.canvas,
		channel = this.controls.ChannelSelector.value,
		rThresh = this.controls.RedThreshold.value,
		gThresh = this.controls.GreenThreshold.value,
		bThresh = this.controls.BlueThreshold.value,
		w = MEDIA.width,
		h = MEDIA.height;

		APP.drawImage(canvas);

		var img = canvas.getImageData(),
		data32 = new Uint32Array(img.data.buffer);

		for (var i = 0; i < data32.length; i++) {
			var pixel = data32[i],
			result,
			r = (pixel) & 0xff,
			g = (pixel >> 8) & 0xff,
			b = (pixel >> 16) & 0xff; 

			//check which channel we're on
			//set the result pixel if we're over the threshold value
			switch (channel) {
				case 1: result = r > rThresh ? 255 : 0; break;
				case 2: result = g > gThresh ? 255 : 0; break;
				case 3: result = b > bThresh ? 255 : 0; break;
			}

			/*
			Finish example by drawing pixels of second image where result === 0
			*/

			data32[i] = (255 << 24) | (result << 16) | (result << 8) | result;
		}


		canvas.putImageData(img);
	}
};