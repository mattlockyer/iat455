

"use strict";

var AdditiveEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();
	//create another canvas object for the other source image
	self.otherCanvas = new MEDIA.Canvas();
	//debugging so you can see the other canvas
	//self.otherCanvas.element.style.display = 'block';
	//name
	self.name = 'AdditiveEffect';
	//defaults
	var alphaDefaults = {
		value:1,
		min:0,
		max:1,
		step:0.01
	};
	//controls
	self.controls = {
		//loads an image through a cors proxy and sets crossOrigin = true
		//otherwise canvas is tainted, see: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
		LoadImage:function() {
			var url = window.prompt('Enter image url');
			var img = new Image();
			img.crossOrigin = true;
			img.onload = function() {
				var other = self.otherCanvas;
				other.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
			};
			img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
		},
		Source_1_Alpha:JSON.parse(JSON.stringify(alphaDefaults)),
		Source_2_Alpha:JSON.parse(JSON.stringify(alphaDefaults))
	};
};

AdditiveEffect.prototype = {
	draw: function() {
		//cache some basic values for this iteration of draw
		var canvas = this.canvas,
		other = this.otherCanvas,
		s1a = this.controls.Source_1_Alpha.value,
		s2a = this.controls.Source_2_Alpha.value,
		w = MEDIA.width,
		h = MEDIA.height;

		//update frame
		APP.drawImage(canvas);

		//image data canvas
		var img = canvas.getImageData(),
		data32 = new Uint32Array(img.data.buffer),
		//image data from other canvas
		data32Other = new Uint32Array(other.getImageData().data.buffer);

		//cache commonly used values for convenience + performance
		var len = data32.length, r = 0, g = 0, b = 0;

		for (var i = 0; i < len; i++) {
			var pixel = data32[i];
			var otherPixel = data32Other[i];
			//add both pixel vals together per channel
			r = ((pixel) & 0xff) * s1a + ((otherPixel) & 0xff) * s2a;
			g = ((pixel >> 8) & 0xff) * s1a + ((otherPixel >> 8) & 0xff) * s2a;
			b = ((pixel >> 16) & 0xff) * s1a + ((otherPixel >> 16) & 0xff) * s2a;
			//don't overflow the byte, max = 255
			r = (r < 255) ? r : 255;
			g = (g < 255) ? g : 255;
			b = (b < 255) ? b : 255;
			//pack and set new pixel in the original data32 array
			data32[i] = (255 << 24) | (b << 16) | (g << 8) | r;
		}
		//update canvas
		canvas.putImageData(img);
	}
};