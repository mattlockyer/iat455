function AdditiveEffect() {
	this.canvas = new MEDIA.Canvas();
	this.otherCanvas = new MEDIA.Canvas();
	this.name = 'Additive';
	var self = this;
	this.controls = {
		LoadImage: function () {
			var url = window.prompt('Enter image url');
			var img = new Image();
			img.crossOrigin = true;
			img.onload = function () {
				var other = self.otherCanvas;
				other.context.drawImage(
					img,
					0,
					0,
					MEDIA.width,
					MEDIA.height
				);
			};
			img.src =
				'http://www.corsproxy.com/' +
				url.substr(url.indexOf('//') + 2);
		},
		Source_1_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		},
		Source_2_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		}
	};
}

AdditiveEffect.prototype = {
	draw: function () {
		var canvas = this.canvas;
		var other = this.otherCanvas;

		var s1a = this.controls.Source_1_Alpha.value;
		var s2a = this.controls.Source_2_Alpha.value;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var otherImg = other.getImageData();

		var data32 =
			new Uint32Array(img.data.buffer);
		var data32Other =
			new Uint32Array(otherImg.data.buffer);

		var len = data32.length;

		for (var i = 0; i < len; i++) {
			var pixel = data32[i];
			var otherPixel = data32Other[i];

			var r = pixel & 255;
			var g = (pixel >> 8) & 255;
			var b = (pixel >> 16) & 255;

			var rOther = otherPixel & 255;
			var gOther = (otherPixel >> 8) & 255;
			var bOther = (otherPixel >> 16) & 255;

			var finalR = r * s1a + rOther * s2a;
			if (finalR > 255) { finalR = 255; }

			var finalG = g * s1a + gOther * s2a;
			if (finalG > 255) { finalG = 255; }

			var finalB = b * s1a + bOther * s2a;
			if (finalB > 255) { finalB = 255; }

			data32[i] =
				(finalR & 255)         |
				((finalG & 255) << 8)  |
				((finalB & 255) << 16)|
				(255 << 24);
		}

		canvas.putImageData(img);
	}
};

function DifferenceEffect() {
	this.canvas = new MEDIA.Canvas();
	this.otherCanvas = new MEDIA.Canvas();
	this.name = 'Difference';
	var self = this;
	this.controls = {
		LoadImage: function () {
			var url = window.prompt('Enter image url');
			var img = new Image();
			img.crossOrigin = true;
			img.onload = function () {
				var other = self.otherCanvas;
				other.context.drawImage(
					img,
					0,
					0,
					MEDIA.width,
					MEDIA.height
				);
			};
			img.src =
				'http://www.corsproxy.com/' +
				url.substr(url.indexOf('//') + 2);
		},
		Source_1_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		},
		Source_2_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		}
	};
}

DifferenceEffect.prototype = {
	draw: function () {
		var canvas = this.canvas;
		var other = this.otherCanvas;

		var s1a = this.controls.Source_1_Alpha.value;
		var s2a = this.controls.Source_2_Alpha.value;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var otherImg = other.getImageData();

		var data32 =
			new Uint32Array(img.data.buffer);
		var data32Other =
			new Uint32Array(otherImg.data.buffer);

		var len = data32.length;

		for (var i = 0; i < len; i++) {
			var pixel = data32[i];
			var otherPixel = data32Other[i];

			var r = pixel & 255;
			var g = (pixel >> 8) & 255;
			var b = (pixel >> 16) & 255;

			var rOther = otherPixel & 255;
			var gOther = (otherPixel >> 8) & 255;
			var bOther = (otherPixel >> 16) & 255;

			var finalR = r * s1a - rOther * s2a;
			if (finalR < 0) { finalR = 0; }

			var finalG = g * s1a - gOther * s2a;
			if (finalG < 0) { finalG = 0; }

			var finalB = b * s1a - bOther * s2a;
			if (finalB < 0) { finalB = 0; }

			data32[i] =
				(finalR & 255)         |
				((finalG & 255) << 8)  |
				((finalB & 255) << 16)|
				(255 << 24);
		}

		canvas.putImageData(img);
	}
};

function MultiplicativeEffect() {
	this.canvas = new MEDIA.Canvas();
	this.otherCanvas = new MEDIA.Canvas();
	this.name = 'Multiplicative';
	var self = this;
	this.controls = {
		LoadImage: function () {
			var url = window.prompt('Enter image url');
			var img = new Image();
			img.crossOrigin = true;
			img.onload = function () {
				var other = self.otherCanvas;
				other.context.drawImage(
					img,
					0,
					0,
					MEDIA.width,
					MEDIA.height
				);
			};
			img.src =
				'http://www.corsproxy.com/' +
				url.substr(url.indexOf('//') + 2);
		},
		Source_1_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		},
		Source_2_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		}
	};
}

MultiplicativeEffect.prototype = {
	draw: function () {
		var canvas = this.canvas;
		var other = this.otherCanvas;

		var s1a = this.controls.Source_1_Alpha.value;
		var s2a = this.controls.Source_2_Alpha.value;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var otherImg = other.getImageData();

		var data32 =
			new Uint32Array(img.data.buffer);
		var data32Other =
			new Uint32Array(otherImg.data.buffer);

		var len = data32.length;

		for (var i = 0; i < len; i++) {
			var pixel = data32[i];
			var otherPixel = data32Other[i];

			var r = pixel & 255;
			var g = (pixel >> 8) & 255;
			var b = (pixel >> 16) & 255;

			var rOther = otherPixel & 255;
			var gOther = (otherPixel >> 8) & 255;
			var bOther = (otherPixel >> 16) & 255;

			var finalR = r * s1a * rOther * s2a;
			if (finalR > 255) { finalR = 255; }

			var finalG = g * s1a * gOther * s2a;
			if (finalG > 255) { finalG = 255; }

			var finalB = b * s1a * bOther * s2a;
			if (finalB > 255) { finalB = 255; }

			data32[i] =
				(finalR & 255)         |
				((finalG & 255) << 8)  |
				((finalB & 255) << 16)|
				(255 << 24);
		}

		canvas.putImageData(img);
	}
};

function OverlayEffect() {
	this.canvas = new MEDIA.Canvas();
	this.otherCanvas = new MEDIA.Canvas();
	this.name = 'Overlay';
	var self = this;
	this.controls = {
		LoadImage: function () {
			var url = window.prompt('Enter image url');
			var img = new Image();
			img.crossOrigin = true;
			img.onload = function () {
				var other = self.otherCanvas;
				other.context.drawImage(
					img,
					0,
					0,
					MEDIA.width,
					MEDIA.height
				);
			};
			img.src =
				'http://www.corsproxy.com/' +
				url.substr(url.indexOf('//') + 2);
		},
		Source_1_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		},
		Source_2_Alpha: {
			value: 1,
			min: 0,
			max: 1,
			step: 0.01
		}
	};
}

OverlayEffect.prototype = {
	draw: function () {
		var canvas = this.canvas;
		var other = this.otherCanvas;

		var s1a = this.controls.Source_1_Alpha.value;
		var s2a = this.controls.Source_2_Alpha.value;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var otherImg = other.getImageData();

		var data32 =
			new Uint32Array(img.data.buffer);
		var data32Other =
			new Uint32Array(otherImg.data.buffer);

		var len = data32.length;

		for (var i = 0; i < len; i++) {
			var pixel = data32[i];
			var otherPixel = data32Other[i];

			var r = pixel & 255;
			var g = (pixel >> 8) & 255;
			var b = (pixel >> 16) & 255;

			var rOther = otherPixel & 255;
			var gOther = (otherPixel >> 8) & 255;
			var bOther = (otherPixel >> 16) & 255;

			var finalR;
			if (r < 127) {
				finalR = r * s1a * rOther * s2a;
			} else {
				finalR =
					1 -
					(1 - r * s1a) *
					(1 - rOther * s2a);
			}
			var finalG;
			if (g < 127) {
				finalG = g * s1a * gOther * s2a;
			} else {
				finalG =
					1 -
					(1 - g * s1a) *
					(1 - gOther * s2a);
			}
			var finalB;
			if (b < 127) {
				finalB = b * s1a * bOther * s2a;
			} else {
				finalB =
					1 -
					(1 - b * s1a) *
					(1 - bOther * s2a);
			}

			data32[i] =
				(finalR & 255)         |
				((finalG & 255) << 8)  |
				((finalB & 255) << 16) |
				(255 << 24);
		}

		canvas.putImageData(img);
	}
};

APP.setup({w:640, h:480});

APP.effects = [];
APP.effects.push(new AdditiveEffect());
APP.effects.push(new DifferenceEffect());
APP.effects.push(new MultiplicativeEffect());
APP.effects.push(new OverlayEffect());

APP.setupControls();