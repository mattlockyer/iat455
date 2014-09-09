

"use strict";

var RGBEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//controls
	self.name = 'RGBEffect';

	self.directTotal = 0;
	self.arrayTotal = 0;
	self.count = 0;

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
		data = img.data,
		data32 = new Uint32Array(img.data.buffer);

		/*******************************
		* Two different approachings for manipulating pixels, the result is exactly the same
		*******************************/

		/*******************************
		* Approach 1 (fastest): direct pixel manipulation using 32 bit uint array
		*******************************/

		var t = Date.now();
		for (var i = 0; i < data32.length; i++) {
			var pixel = data32[i];
			var r = (pixel) & 0xff,
			g = (pixel >> 8) & 0xff,
			b = (pixel >> 16) & 0xff;

			data32[i] = (255 << 24) | ((b > bThresh ? b : 0) << 16) | ((g > gThresh ? g : 0) << 8) | (r > rThresh ? r : 0);
		}
		this.directTotal += Date.now() - t;

		/*******************************
		* Approach 2: using imageData.data array directly
		*******************************/

		var t = Date.now();
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i],
			g = data[i + 1],
			b = data[i + 2];

			data[i] = r > rThresh ? r : 0;
			data[i + 1] = g > gThresh ? g : 0;
			data[i + 2] = b > bThresh ? b : 0;
		}
		this.arrayTotal += Date.now() - t;


		//Benchmarking both techniques
		this.count++;
		console.log('Direct Average: ' + (this.directTotal / this.count));
		console.log('Array Average: ' + (this.arrayTotal / this.count));

		canvas.putImageData(img);
	}
};