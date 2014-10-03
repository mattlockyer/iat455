// NOTE: a lot of the conversion helper functions are in a file called
//     "helpers.js", which is located just above the "effects" folder.

function HSVEffect() {
  var self = this;
  self.canvas = new MEDIA.Canvas();
  self.name = 'HSV';

  self.controls = {
    Hue:{
      value:0,
      min:0,
      max:360,
      step:1
    },
    Saturation:{
      value:255,
      min:0,
      max:255,
      step:1
    },
    Brightness:{
      value:100,
      min:0,
      max:100,
      step:1
    }
  };
};

HSVEffect.prototype = {
  draw: function() {
    var canvas = this.canvas;

    var hue        = this.controls.Hue.value;
    var saturation = this.controls.Saturation.value;
    var brightness = this.controls.Brightness.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData(),
    pixels = new Uint32Array(img.data.buffer);

    for (var i = 0, len = pixels.length; i < len; i++) {
      var pixel = pixels[i];

      var r = pixel & 255;
      var g = (pixel >> 8) & 255;
      var b = (pixel >> 16) & 255;

      var hsv = rgb2hsv([r, g, b]);

      // Shift the hue; scale the saturation and brightness.
      hsv[0] += hue; // hsv[0] = hsv[0] + hue;
      hsv[1] *= saturation/SATURATION_SCALE;
      hsv[2] *= brightness/BRIGHTNESS_SCALE;

      var rgb = hsv2rgb(hsv);

      // We'll simply be assuming that the alpha value is 255.
      pixels[i] = (rgb[0] << 0) | (rgb[1] << 8) | (rgb[2] << 16) | (255 << 24);
    }

    canvas.putImageData(img);
  }
};
