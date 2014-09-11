

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
  
  self.kernelX = [
	[-1, 0, 1],
	[-2, 0, 2],
	[-1, 0, 1]
	];
  
  self.kernelY = [
	[1, 2, 1],
	[0, 0, 0],
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
		kernel = this.kernel,
		kernelX = this.kernelX,
		kernelY = this.kernelY;

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
			var r = 0, g = 0, b = 0, cx = -1, cy = -1, rx = 0, gx = 0, bx = 0, ry = 0, gy = 0, by = 0;
			for (var j = low; j < high; j++) {
				cx++;
				//if (j === 0) continue; //uncomment for basic convolve
				cy = -1;
				for (var k = low; k < high; k++) {
					cy++;
					//if (k === 0) continue; //uncomment for basic convolve
					var index = i + k * w + j;
					//grab the pixel
					var pixel = data32[index];
					//basic convolve (skip when j and k === 0)
					//r += ((pixel) & bitMask) * kernel[cx][cy];
					//g += ((pixel >> 8) & bitMask) * kernel[cx][cy];
					//b += ((pixel >> 16) & bitMask) * kernel[cx][cy];
					//convolveX
					rx += ((pixel) & bitMask) * kernelX[cx][cy];
					gx += ((pixel >> 8) & bitMask) * kernelX[cx][cy];
					bx += ((pixel >> 16) & bitMask) * kernelX[cx][cy];
					//convolveY
					ry += ((pixel) & bitMask) * kernelY[cx][cy];
					gy += ((pixel >> 8) & bitMask) * kernelY[cx][cy];
					by += ((pixel >> 16) & bitMask) * kernelY[cx][cy];
				}
			}
            //basic convolve
            //r = r < 0 ? r * -1 : r;
            //g = g < 0 ? g * -1 : g;
            //b = b < 0 ? b * -1 : b;
            //convolve X and Y
            r = Math.sqrt(rx * rx + ry * ry);
            g = Math.sqrt(gx * gx + gy * gy);
            b = Math.sqrt(bx * bx + by * by);
            r = (r > 255) ? 255 : r;
            g = (g > 255) ? 255 : g;
            b = (b > 255) ? 255 : b;
            //invert
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
			//pack and set new pixel
			data32[i] = (255 << 24) | (b << 16) | (g << 8) | r;
		}
		//update canvas
		canvas.putImageData(img);
	}
};