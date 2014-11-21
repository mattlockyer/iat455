

"use strict";

var AnalysisMotionDetect = function() {
	var self = this;
	//canvases
	self.canvas = new MEDIA.Canvas();
	//setup canvases
	self.canvas2 = new MEDIA.Canvas();
	self.canvas3 = new MEDIA.Canvas();
	//sample width / height
	self.w = 4;
	self.h = 4;
	//destination width / height
	self.dw = 160;
	self.dh = 160;
	self.tw = self.dw / self.w;
	self.th = self.dh / self.h;

	self.motion = [];
	self.prevMotion = [];
	for (var i = 0; i < self.w * self.h; i++) {
		self.motion[i] = 0;
		self.prevMotion[i] = 0;
	}

	self.canvas3.el.width = self.dw;
	self.canvas3.el.height = self.dh;

	self.prevPix = null;

	self.pct = 0; //prev capture time


	self.canvas2.el.style.display = 'block';
	self.canvas3.el.style.display = 'block';

	self.name = 'Analysis Motion Detect';
	self.controls = {
		DiffThreshold:{
			value:50,
			min:0,
			max:500,
			step:10
		},
	};
};

AnalysisMotionDetect.prototype = {
	draw: function() {
		var self = this;
		APP.drawImage(self.canvas);

		var t = Date.now();

		//only analyze every half sec and draw block results
		if (Date.now() - self.pct > 1000) {


			var c1 = self.canvas,
			c2 = self.canvas2,
			c3 = self.canvas3,
			ctx1 = c1.context,
			ctx2 = c2.context,
			ctx3 = c3.context,
			thresh = self.controls.DiffThreshold.value;
			

			//draw small version
			ctx2.drawImage(c1.el, 0, 0, self.w, self.h);

			//get src pixels from little guy
			var src = c2.getImageData({x:0, y:0, w:self.w, h:self.h}),
			srcPix = new Uint32Array(src.data.buffer);

			self.prevPix = self.prevPix ? self.prevPix : srcPix;

			//loop all the pixels and draw some tiles
			for (var x = 0; x < self.w; x++) {
				for (var y = 0; y < self.h; y++) {
				//pixels
				var p = srcPix[x + y * self.w],
				r = p & 255,
				g = (p >> 8) & 255,
				b = (p >> 16) & 255,
				pp = self.prevPix[x + y * self.w],
				pr = pp & 255,
				pg = (pp >> 8) & 255,
				pb = (pp >>16) & 255,
				//tile x, y
				tx = x * self.tw,
				ty = y * self.th;


				//test of pixel differences
				var dist = ds(r, pr) + ds(g, pg) + ds(b, pb);
				//draw tiles if diff
				if (dist > thresh) {
					ctx3.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
					ctx3.fillRect(tx, ty, self.tw, self.th);

					self.motion[x + y * self.w] = 1;

					//compare to pixels around to see if they had differences
					for (var i = -1; i <= 1; i++) {
						for (var j = -1; j <= 1; j++) {

							if (x + i < 0) x = 0;
							if (x + i > self.w) x = self.w;
							if (y + i < 0) y = 0;
							if (y + i > self.h) y = self.h;

							//this method is very noisy and rough

							//with the current configuration (timing = 1s and depending on lighting)

							if (self.prevMotion[x + i, y + j] == 1) {
								if (i == -1 && j == 0) console.log('left to right');
							}
						}
					}
				} else {
					self.motion[x + y * self.w] = 0;
				}

			}
		}

		self.pct = Date.now();
		self.prevPix = srcPix;
		self.prevMotion = self.motion;


		//console.log(Date.now() - t);
	}
}
};

/*******************************
* Helper Functions
*******************************/

//distance squared
var ds = function(a, b) {
	return Math.abs(b - a);
};