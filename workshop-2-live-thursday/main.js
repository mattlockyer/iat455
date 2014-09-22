function BlurEffect() {
  //parameters
  this.canvas = new MEDIA.Canvas();
  //name
  this.name = 'BlurEffect';
  //controls
  this.controls = {};
 
  this.kernel =
    [ 0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111 ];
 
  // this.kernel =
  //   [ 0,  1, 0,
  //     1, -4, 1,
  //     0,  1, 0, ]
 
  // this.kernel =
  //   [  1,  0, -1,
  //      0,  0,  0,
  //     -1,  0,  1 ]
 
  // this.kernel =
  //   [  0,  -1,  0,
  //      -1,   5,  -1,
  //      0,  -1,  0, ];
 
  // this.kernel =
  //   [  1/16,  1/8,  1/16,
  //       1/8,  1/4,   1/8,
  //      1/16,  1/8,  1/16, ];
};
 
BlurEffect.prototype = {
  draw: function() {
    var canvas = this.canvas;
    var width  = MEDIA.width;
 
    var kernel          = this.kernel;
    var kernelDimension = 3;
    var kernelSize      = 9;
 
    //update frame
    APP.drawImage(canvas);
 
    //image data
    var img    = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);
    var buffer = [];
 
    for (var i = 0; i < pixels.length; i++) {
      var col = i % width;
      var row = Math.floor(i / width);
 
      var accumRed   = 0;
      var accumBlue  = 0;
      var accumGreen = 0;
 
      for (var j = 0; j < kernelSize; j++) {
        var x = j % kernelDimension;
        var y = Math.floor(j / kernelDimension);

        var lookupX = col + x - Math.floor(kernelDimension / 2); if (lookupX < 0) { lookupX = 0; }
        var lookupY = row + y - Math.floor(kernelDimension / 2); if (lookupY < 0) { lookupY = 0; }
 
        var index = lookupX + (lookupY * width);
 
        var pixel = pixels[index];
 
        var red   = pixel & 255;
        var green = (pixel >> 8)  & 255;
        var blue  = (pixel >> 16) & 255;
 
        accumRed   += red   * kernel[j];
        accumGreen += green * kernel[j];
        accumBlue  += blue  * kernel[j];
 
        if (accumRed   < 0) { accumRed   = 0; }
        if (accumGreen < 0) { accumGreen = 0; }
        if (accumBlue  < 0) { accumBlue  = 0; }
 
        if (accumRed   > 255) { accumRed   = 255; }
        if (accumGreen > 255) { accumGreen = 255; }
        if (accumBlue  > 255) { accumBlue  = 255; }
      }
 
      var alpha = (pixels[i] >> 24) & 255
      buffer.push((accumRed & 255) | ((accumGreen & 255) << 8) | ((accumBlue & 255) << 16) | (alpha << 24));
    }
 
    for (var i = 0; i < buffer.length; i++) {
      pixels[i] = buffer[i];
    }
 
    //update canvas
    canvas.putImageData(img);
  }
};

function EdgeDetectionEffect() {
  //parameters
  this.canvas = new MEDIA.Canvas();
  //name
  this.name = 'EdgeDetection';
  //controls
  this.controls = {};
 
  this.kernel =
    [ -1,  -1, -1,
      -1,   8, -1,
      -1,  -1, -1, ];
};
 
EdgeDetectionEffect.prototype = {
  draw: function() {
    var canvas = this.canvas;
    var width  = MEDIA.width;
 
    var kernel          = this.kernel;
    var kernelDimension = 3;
    var kernelSize      = 9;
 
    //update frame
    APP.drawImage(canvas);
 
    //image data
    var img    = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);
    var buffer = [];
 
    for (var i = 0; i < pixels.length; i++) {
      var col = i % width;
      var row = Math.floor(i / width);
 
      var accumRed   = 0;
      var accumBlue  = 0;
      var accumGreen = 0;
 
      for (var j = 0; j < kernelSize; j++) {
        var x = j % kernelDimension;
        var y = Math.floor(j / kernelDimension);
 
        var lookupX = col + x - 1; if (lookupX < 0) { lookupX = 0; }
        var lookupY = row + y - 1; if (lookupY < 0) { lookupY = 0; }
 
        var index = lookupX + (lookupY * width);
 
        var pixel = pixels[index];
 
        var red   = pixel & 255;
        var green = (pixel >> 8)  & 255;
        var blue  = (pixel >> 16) & 255;
 
        accumRed   += red   * kernel[j];
        accumGreen += green * kernel[j];
        accumBlue  += blue  * kernel[j];
 
        if (accumRed   < 0) { accumRed   = 0; }
        if (accumGreen < 0) { accumGreen = 0; }
        if (accumBlue  < 0) { accumBlue  = 0; }
 
        if (accumRed   > 255) { accumRed   = 255; }
        if (accumGreen > 255) { accumGreen = 255; }
        if (accumBlue  > 255) { accumBlue  = 255; }
      }
 
      var alpha = (pixels[i] >> 24) & 255
      buffer.push((accumRed & 255) | ((accumGreen & 255) << 8) | ((accumBlue & 255) << 16) | (alpha << 24));
    }
 
    for (var i = 0; i < buffer.length; i++) {
      pixels[i] = buffer[i];
    }
 
    //update canvas
    canvas.putImageData(img);
  }
};
 
var size = {
  small:{w:160, h:120},
  medium:{w:320, h:240},
  large:{w:640, h:480}
}
//setup app
APP.setup(size.small);
//add effects
APP.effects = [];
// APP.effects.push(new BlurEffect());
APP.effects.push(new EdgeDetectionEffect());
//setup controls
APP.setupControls();
