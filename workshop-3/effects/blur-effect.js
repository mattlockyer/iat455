

"use strict";

var BlurEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//name
	self.name = 'BlurEffect';
	//controls
	self.controls = {
		BlurBrightness:{
			value:1,
			min:0.1,
			max:2,
			step:0.05
		},
		BlurSize:{
			value:5,
			min:1,
			max:9,
			step:1
		}
	};
};

BlurEffect.prototype = {
	draw: function() {
		//cache some basic values for this iteration of draw
		var canvas = this.canvas,
		blurBrightness = this.controls.BlurBrightness.value,
		blurSize = this.controls.BlurSize.value,
		w = MEDIA.width,
		h = MEDIA.height;

		//update frame
		APP.drawImage(canvas);

		//image data
		var img = canvas.getImageData(),
		data32 = new Uint32Array(img.data.buffer);

		//cache some values for opimization in loop
		var blurValue = blurBrightness / Math.pow(blurSize, 2),
		low = -Math.floor(blurSize / 2),
		high = Math.ceil(blurSize / 2),
		len = data32.length,
		//start and end pixels, don't go outside array bounds
		start = low * w, 
		end = len - low * w;

		//loop every pixel
		for (var i = start; i < end; i++) {
			//start with a black pixel
			var r = 0, g = 0, b = 0;
			for (var j = low; j < high; j++) {
				for (var k = low; k < high; k++) {
					var index = i + j * w + k;
					//clamp the index so we don't have indexOutOfBoundsError
					//index = clamp(index, 0, len);
					//grab the pixel
					var pixel = data32[index];
					//add the averages of the neighboring pixels
					r += ((pixel) & 0xff) * blurValue;
					g += ((pixel >> 8) & 0xff) * blurValue;
					b += ((pixel >> 16) & 0xff) * blurValue;
					//don't overflow the byte, max = 255
					r = (r < 255) ? r : 255;
					g = (g < 255) ? g : 255;
					b = (b < 255) ? b : 255;
				}
			}
			//pack and set new pixel
			data32[i] = (255 << 24) | (b << 16) | (g << 8) | r;
		}
		//update canvas
		canvas.putImageData(img);
	}
};