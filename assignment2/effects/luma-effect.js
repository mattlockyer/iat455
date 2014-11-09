function LumaEffect() {
  this.canvas = new MEDIA.Canvas();

  this.name = 'Luma Effect';

  this.controls =  {
    threshold: {
      value: 128,
      min: 0,
      max: 255,
      step: 1
    }
  };
}

LumaEffect.prototype.draw = function () {
  var canvas = this.canvas;

  APP.drawImage(canvas);

  var image = canvas.getImageData();
  var data = new Uint32Array(image.data.buffer);

  for (var i = 0; i < data.length; i++) {
    // The algorithm was pretty simple for this one. Just get the brightness
    // (however that may be) and replace the r, g, and b values with that
    // retrieved brightness value.

    var l = getLightness(data[i]) > this.controls.threshold.value ? 255 : 0;
    data[i] = rgbToInt32(l, l, l);
  }
  canvas.putImageData(image);
};
