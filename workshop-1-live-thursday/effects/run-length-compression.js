function RunLengthCompression() {
	this.canvas = new MEDIA.Canvas();
	this.name = 'RunLengthCompression';
	this.controls = {};
}

RunLengthCompression.prototype = {
	draw: function () {
		var canvas = this.canvas;
		
		APP.drawImage(canvas);
		
		var img = canvas.getImageData();
		var data = img.data;

		for (var i = 0; i < data.length; i++) {
			//   10101010
			// & 11110000
			// ----------
			//   10100000
			data[i] = data[i] & 0x80 // (8, 0) or 10000000
		}

		canvas.putImageData(img);
	}
};