// NOTE: a lot of the conversion helper functions are in a file called
//     "helpers.js", which is located just above the "effects" folder.

function ScanlineEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'ScanlineEffect';
  this.controls = {
    Hue: {
      value: 0,
      min: 0,
      max: 360,
      step: 1
    },
    Saturation: {
      value: 0,
      min: 0,
      max: 255,
      step: 1
    },
    Brightness: {
      value: 0,
      min: 0,
      max: 100,
      step: 1
    },
    Thickness:{
      value:2,
      min:1,
      max:32,
      step:1
    }
  };
};

ScanlineEffect.prototype = {
  draw: function() {
    var canvas = this.canvas;
    var thickness = this.controls.Thickness.value;
    // var scrollSpeed = this.controls.Scrollspeed.value;
    var lineWidth = MEDIA.width * 4;

    APP.drawImage(canvas);

    var img = canvas.getImageData(),
    data = img.data;

    var colour = hsv2rgb([
      this.controls.Hue.value,
      this.controls.Saturation.value,
      this.controls.Brightness.value
    ]);

    for (var i = lineWidth; i < data.length; i += lineWidth * 2 * thickness) {
      for (var j = 0; j < lineWidth * thickness; j += 4) {
        data[i + j]     = colour[0];
        data[i + j + 1] = colour[1];
        data[i + j + 2] = colour[2];
      }
    }

    canvas.putImageData(img);
  }
};