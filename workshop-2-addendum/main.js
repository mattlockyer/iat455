function BlurEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'Blur';
  this.controls = {};

  this.kernel = [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111
  ];
}

BlurEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var width  = MEDIA.width;

    var kernel          = this.kernel;
    var kernelDimension = Math.sqrt(kernel.length);
    var kernelSize      = kernel.length;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

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

      pixels[i] =
        (accumRed & 255)           |
        ((accumGreen & 255) << 8 ) |
        ((accumBlue  & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function EdgeDetectEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'EdgeDetect';
  this.controls = {};

  this.kernel = [
    0,   1, 0,
    1,  -4, 1,
    0,   1, 0
  ];
}

EdgeDetectEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var width  = MEDIA.width;

    var kernel          = this.kernel;
    var kernelDimension = Math.sqrt(kernel.length);
    var kernelSize      = kernel.length;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

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

      pixels[i] =
        (accumRed & 255)           |
        ((accumGreen & 255) << 8 ) |
        ((accumBlue  & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function BufferdEdgeDetectEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'BufferedEdgeDetect';
  this.controls = {};

  this.kernel = [
    0,   1, 0,
    1,  -4, 1,
    0,   1, 0
  ];
}

BufferdEdgeDetectEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var width  = MEDIA.width;

    var kernel          = this.kernel;
    var kernelDimension = Math.sqrt(kernel.length);
    var kernelSize      = kernel.length;

    APP.drawImage(canvas);

    var buffer = [];

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

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

    canvas.putImageData(img);
  }
};

function BufferedBlurEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'BufferedBlur';
  this.controls = {};

  this.kernel = [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111
  ];
}

BufferedBlurEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var width  = MEDIA.width;

    var kernel          = this.kernel;
    var kernelDimension = Math.sqrt(kernel.length);
    var kernelSize      = kernel.length;

    APP.drawImage(canvas);

    var buffer = [];

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

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

      buffer.push(
        (accumRed & 255)           |
        ((accumGreen & 255) << 8 ) |
        ((accumBlue  & 255) << 16) |
        (255 << 24)
      );
    }

    for (var i = 0; i < pixels.length; i++) {
      pixels[i] = buffer[i]
    }

    canvas.putImageData(img);
  }
};

function BufferedSharpenEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'BufferedSharpen';
  this.controls = {};

  this.kernel = [
     0, -1,  0,
    -1,  5, -1,
     0, -1,  0
  ];
}

BufferedSharpenEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var width  = MEDIA.width;

    var kernel          = this.kernel;
    var kernelDimension = Math.sqrt(kernel.length);
    var kernelSize      = kernel.length;

    APP.drawImage(canvas);

    var buffer = [];

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

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

    canvas.putImageData(img);
  }
};

function BufferedLaplacianEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'BufferedLaplacian';
  this.controls = {};

  this.kernel = [
    -2,  1, -2,
     1,  4,  1,
    -2,  1, -2
  ];
}

BufferedLaplacianEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var width  = MEDIA.width;

    var kernel          = this.kernel;
    var kernelDimension = Math.sqrt(kernel.length);
    var kernelSize      = kernel.length;

    APP.drawImage(canvas);

    var buffer = [];

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

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

    canvas.putImageData(img);
  }
};

function BufferedControllableEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'BufferedControllable';
  this.controls = {
    k00: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k01: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k02: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k10: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k11: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k12: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k20: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k21: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    },
    k22: {
      value: 0,
      min: -10,
      max: 10,
      step: 0.01
    }
  };
}

BufferedControllableEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var width  = MEDIA.width;

    var kernel          = [
      this.controls.k00.value, this.controls.k01.value, this.controls.k02.value,
      this.controls.k10.value, this.controls.k11.value, this.controls.k12.value,
      this.controls.k20.value, this.controls.k21.value, this.controls.k22.value
    ];
    var kernelDimension = Math.sqrt(kernel.length);
    var kernelSize      = kernel.length;

    APP.drawImage(canvas);

    var buffer = [];

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

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

    canvas.putImageData(img);
  }
};

var size = {
  small:{w:160, h:120},
  medium:{w:320, h:240},
  large:{w:640, h:480}
};

//setup app
APP.setup(size.small);
//add effects
APP.effects = [];
APP.effects.push(new BlurEffect());
APP.effects.push(new EdgeDetectEffect());
APP.effects.push(new BufferdEdgeDetectEffect());
APP.effects.push(new BufferedBlurEffect());
APP.effects.push(new BufferedSharpenEffect());
APP.effects.push(new BufferedLaplacianEffect());
APP.effects.push(new BufferedControllableEffect());
//setup controls
APP.setupControls();
