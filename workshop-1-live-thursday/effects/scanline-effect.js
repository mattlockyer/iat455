function ScanlineEffect() {
	this.canvas = new MEDIA.Canvas();
	this.name = 'ScanlineEffect';
	this.y = 0;
	this.controls = {
		ScrollSpeed: {
			value: 1,
			min: 0,
			max: 255,
			step: 1
		}
	};
}

ScanlineEffect.prototype = {
	draw: function () {
		var canvas = this.canvas;

		var width = MEDIA.width;
		var height = MEDIA.height;

		var thickness = 10;
		var lineWidth = width * 4;

		this.y += this.controls.ScrollSpeed.value;
		if (this.y > thickness * 2) this.y = 0;

		APP.drawImage(canvas);

		var img = canvas.getImageData();
		var data = img.data;

		for (
			var i = this.y * lineWidth;
			i < data.length;
			i += lineWidth * 2 * thickness
		) {
			for (var j = 0; j < lineWidth * thickness; j += 4) {
				data[i + j] = 0;
				data[i + j + 1] = 0;
				data[i + j + 2] = 0;
			}
		}

		canvas.putImageData(img);
	}
};