function RGBEffect() {
	this.canvas = new MEDIA.Canvas();
	this.name = 'RGBEffect';
	this.controls = {
		RedThreshold: {
			value: 128,
			min: 0,
			max: 255,
			step: 2
		}
	};
}

RGBEffect.prototype = {
	draw: function () {
		var canvas = this.canvas;

		var redThreshold = this.controls.RedThreshold.value;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var data = img.data;

		// Pixel data here

		// 0 red   : 1st pixel (0 - 255)
		// 1 green : 1st pixel
		// 2 blue  : 1st pixel
		// 3 alpha : 1st pixel

		// 4 red   : 2nd pixel
		// 5 green : 2nd pixel
		// 6 blue  : 2nd pixel
		// 7 alpha : 2nd pixel 



		for (var i = 0, len = data.length; i < len; i += 4) {
			var r = data[i];
			// data[i] = r > redThreshold ? r : 0;
			if (r > redThreshold) {
				data[i] = r;
			} else {
				data[i] = 0;
			}
		}

		canvas.putImageData(img);
	}
};