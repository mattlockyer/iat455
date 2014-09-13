function RGBEffect32() {
	this.canvas = new MEDIA.Canvas();
	this.name = 'RGBEffect32';
	this.controls = {

	};
}

RGBEffect32.prototype = {
	draw: function () {
		var canvas = this.canvas;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var data32 = new Uint32Array(img.data.buffer);

		// index : is a 32-bit integer that varies from 0 - 2^32

		for (var i = 0; i < data32.length; i++) {
			var pixel = data32[i];

			var r = pixel & 0xFF; // 0xFF means 255
			//   01001001 00100100 10000100 01000010 
			// & 00000000 00000000 00000000 11111111 (255 or 0xFF)
			// -------------------------------------
			//   00000000 00000000 00000000 01000010
			var g = (pixel >> 8) & 0xFF;
			//   01001001 00100100 10000100 01000010
			// >>                                  8
			// -------------------------------------
			//   00000000 01001001 00100100 10000100
			var b = (pixel >> 16) & 0xFF;
			var a = (pixel >> 24) & 0xFF;

			g = 0;
			b = 0;

			pixel = (a << 24) | (b << 16) | (g << 8) | r;

			//   01001001 00000000 00000000 00000000
			// | 00000000 00100100 00000000 00000000
			// -------------------------------------
			//   01001001 00100100 00000000 00000000

			//   01001001 00100100 10000100 01000010
			// <<                                  8
			// -------------------------------------
			//   00100100 10000100 01000010 00000000

			data32[i] = pixel;
		}

		canvas.putImageData(img);
	}
};