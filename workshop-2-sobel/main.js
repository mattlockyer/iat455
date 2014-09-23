function SobelEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'Sobel';
  this.controls = {};

  this.kernelX = [
    -1,  0, 1,
    -2,  0, 2,
    -1,  0, 1
  ];

  this.kernelY = [
     1,  2,  1,
     0,  0,  0,
    -1, -2, -1
  ];
}

function convolve(pixels, kernel) {
  var width  = MEDIA.width;

  var kernelDimension = Math.sqrt(kernel.length);
  var kernelSize      = kernel.length;

  var buffer = [];

  for (var i = 0; i < pixels.length; i++) {
    var col = i % width;
    var row = Math.floor(i / width);

    var accumRed   = 0;
    var accumGreen = 0;
    var accumBlue  = 0;

    for (var j = 0; j < kernelSize; j++) {
      var x = j % kernelDimension;
      var y = Math.floor(j / kernelDimension);

      var lookupX = col + x - 1;
      if (lookupX < 0) { lookupX = 0; }

      var lookupY = row + y - 1;
      if (lookupY < 0) { lookupY = 0; }

      var index = lookupX + (lookupY * width);

      var pixel = pixels[index];


      var red   = (pixel & 255        ) * kernel[j];
      var green = ((pixel >> 8 ) & 255) * kernel[j];
      var blue  = ((pixel >> 16) & 255) * kernel[j];

      accumRed   += red;
      accumGreen += green;
      accumBlue  += blue;
    }

    if (accumRed   > 255) { accumRed   = 255; }
    if (accumGreen > 255) { accumGreen = 255; }
    if (accumBlue  > 255) { accumBlue  = 255; }

    if (accumRed   < 0) { accumRed   = 0; }
    if (accumGreen < 0) { accumGreen = 0; }
    if (accumBlue  < 0) { accumBlue  = 0; }

    buffer.push(
      (accumRed & 255)           |
      ((accumGreen & 255) << 8 ) |
      ((accumBlue  & 255) << 16) |
      (255 << 24)
    );
  }

  for (var i = 0; i < pixels.length; i++) {
    pixels[i] = buffer[i];
  }
}

SobelEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;

    var kernelX         = this.kernelX;
    var kernelY         = this.kernelY;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

    convolve(pixels, kernelX);
    convolve(pixels, kernelY);

    canvas.putImageData(img);
  }
};

var size = {
  small:{w:160, h:120},
  medium:{w:320, h:240},
  large:{w:640, h:480}
};

//setup app
APP.setup(size.medium);
//add effects
APP.effects = [];
APP.effects.push(new SobelEffect());
//setup controls
APP.setupControls();
