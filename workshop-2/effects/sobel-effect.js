

"use strict";

var SobelEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//name
	self.name = 'SobelEffect';
	//controls
	self.controls = {
		BlurBrightness:{
			value:1,
			min:1,
			max:20,
			step:1
		}
	};

	self.kernel = [
	[1, 2, 1],
	[2, 0, -2],
	[-1, -2, -1]
	];
};

SobelEffect.prototype = {
	draw: function() {
		//cache some basic values for this iteration of draw
		var canvas = this.canvas,
		blurBrightness = this.controls.BlurBrightness.value,
		w = MEDIA.width,
		h = MEDIA.height,
		kernel = this.kernel;

		//update frame
		APP.drawImage(canvas);

		//image data
		var img = canvas.getImageData(),
		data32 = new Uint32Array(img.data.buffer);

		//cache some values for opimization in loop
		var low = -1,
		high = 2,
		len = data32.length,
		//start and end pixels, don't go outside array bounds
		start = low * w, 
		end = len - low * w,
		//bitmask
		bitMask = 0xff;

		//loop every pixel
		for (var i = start; i < end; i++) {
			//start with a black pixel
			var r = 0, g = 0, b = 0, cx = -1, cy = -1;
			for (var j = low; j < high; j++) {
				cx++;
				if (j === 0) continue;
				cy = -1;
				for (var k = low; k < high; k++) {
					cy++;
					if (k === 0) continue;
					var index = i + k * w + j;
					//grab the pixel
					var pixel = data32[index];
					//convolve
					r += ((pixel) & bitMask) * kernel[cx][cy];
					g += ((pixel >> 8) & bitMask) * kernel[cx][cy];
					b += ((pixel >> 16) & bitMask) * kernel[cx][cy];
				}
			}
			r = Math.sqrt(r * r);
			g = Math.sqrt(g * g);
			b = Math.sqrt(b * b);
			//pack and set new pixel
			data32[i] = (255 << 24) | (b << 16) | (g << 8) | r;
		}
		//update canvas
		canvas.putImageData(img);
	}
};