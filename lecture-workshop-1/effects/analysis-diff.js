


"use strict";

var AnalysisDiff = function() {
	var self = this;
	//parameters
	self.w = 16, self.h = 12,
	self.dw = 320, self.dh = 240,
	self.tw = self.dw / self.w,
	self.th = self.dh / self.h;
	//canvases
	self.canvas = new MEDIA.Canvas();
	self.canvas2 = new MEDIA.Canvas();
	self.canvas3 = new MEDIA.Canvas();
	//setup canvases
	//self.canvas2.el.style.display = 'block';
	//self.canvas2.el.style.float = 'left';
	self.canvas3.el.style.float = 'left';
	self.canvas3.el.style.display = 'block';
	self.canvas2.el.width = self.w;
	self.canvas2.el.height = self.h;
	self.canvas3.el.width = self.dw;
	self.canvas3.el.height = self.dh;

	self.pct = 0; //prev capture time
	self.prevPix = null;
	//controls
	self.name = 'Analysis Difference';
	self.controls = {
		Threshold:{
			value:50,
			min:0,
			max:400,
			step:10
		},
		Erase:function() {
			self.canvas3.el.width = self.canvas3.el.width;
		}
	};
};

AnalysisDiff.prototype = {
	draw: function() {
		APP.drawImage(this.canvas);

		var t = Date.now();
		this.analyze();
		//console.log(Date.now() - t);
	},
	analyze:function() {
		var self = this,
		thresh = self.controls.Threshold.value,
		c1 = self.canvas,
		c2 = self.canvas2,
		c3 = self.canvas3,
		ctx1 = c1.context,
		ctx2 = c2.context,
		ctx3 = c3.context;
		//draw webcam image smaller
		ctx2.drawImage(c1.el, 0, 0, self.w, self.h);

		//blow up small image, show result in big image
		var src = c2.getImageData({x:0, y:0, w:self.w, h:self.h}),
		srcPix = new Uint32Array(src.data.buffer),
		prevPix = self.prevPix ? self.prevPix : srcPix;

		for (var x = 0; x < self.w; x++) {
			for (var y = 0; y < self.h; y++) {
				var pixel = srcPix[x + y * self.w],
				r = (pixel) & 0xff,
				g = (pixel >> 8) & 0xff,
				b = (pixel >> 16) & 0xff,
				prevPixel = prevPix[x + y * self.w],
				pr = (prevPixel) & 0xff,
				pg = (prevPixel >> 8) & 0xff,
				pb = (prevPixel >> 16) & 0xff,
				tx = x * self.tw,
				ty = y * self.th;

				//draw the block only if there's a difference greater than thresh
				var dist = ds(r, pr) + ds(g, pg) + ds(b, pb);
				if (dist > thresh) {
					ctx3.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
					ctx3.fillRect(tx, ty, self.tw, self.th);
				}
				continue;
				//draw the block
				ctx3.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')';
				ctx3.fillRect(tx, ty, self.tw, self.th);
			}
		}

		if (Date.now() - self.pct > 250) {
			self.prevPix = srcPix;
			self.pct = Date.now();
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