function CaptureEffect() {
	this.canvas = new MEDIA.Canvas();
	this.name = 'Capture';
	this.controls = {
		// Inherit from the base
	};
}

CaptureEffect.prototype = {
	draw: function () {
		APP.drawImage(this.canvas);
	}
};