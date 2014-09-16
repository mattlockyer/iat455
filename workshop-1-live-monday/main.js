function BasicEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'Basic';
  this.controls = {};
}

BasicEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;

    APP.drawImage(canvas);
  }
};

function RedEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'Red';
  this.controls = {};
}

RedEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var pixels = img.data;

    for (var i = 0; i < pixels.length; i += 4) {
      // pixels[i] is red;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
    }

    canvas.putImageData(img);
  }
};

function ScanlineEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'Scanline';
  this.controls = {};
}

ScanlineEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;

    var width = MEDIA.width;
    var height = MEDIA.height;
    var lineWidth = width * 4;
    var thickness = 4;

    APP.drawImage(canvas); // ?

    var img = canvas.getImageData();
    var data = img.data;

    for (
      var i = lineWidth;
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

function BrightnessEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'Brightness';
  this.controls = {
    Brightness: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01
    }
  }
}

BrightnessEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

    var brightness = this.controls.Brightness.value;

    for (var i = 0; i < pixels.length; i++) {
      var pixel = pixels[i];

      var red   = pixel & 255;
      var green = (pixel >> 8) & 255;
      var blue  = (pixel >> 16) & 255;
      var alpha = (pixel >> 24) & 255;

      // TODO: do our logic here
      red = Math.floor(red * brightness * 2);
      green = Math.floor(green * brightness * 2);
      blue = Math.floor(blue * brightness * 2);

      pixel =
        (red & 255) |
        ((green & 255) << 8) |
        ((blue  & 255) << 16) |
        ((alpha & 255) << 24);

      pixels[i] = pixel;
    }

    canvas.putImageData(img);
  }
};

function BrightnessAnimatedEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'BrightnessAnimated';
  this.controls = {
  }
}

BrightnessAnimatedEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

    var brightness = (Math.sin(new Date().getTime() / 1000) + 1) / 2;

    for (var i = 0; i < pixels.length; i++) {
      var pixel = pixels[i];

      var red   = pixel & 255;
      var green = (pixel >> 8) & 255;
      var blue  = (pixel >> 16) & 255;
      var alpha = (pixel >> 24) & 255;

      red   = Math.floor(red * brightness * 2);
      green = Math.floor(green * brightness * 2);
      blue  = Math.floor(blue * brightness * 2);

      pixel =
        (red & 255) |
        ((green & 255) << 8) |
        ((blue  & 255) << 16) |
        ((alpha & 255) << 24);

      pixels[i] = pixel;
    }

    canvas.putImageData(img);
  }
};

// Tell our library on how to set up the canvases
APP.setup({ w:640, h:480 });

// Our library is going to read all of the effects from this array.
APP.effects = [];
APP.effects.push(new BasicEffect());
APP.effects.push(new RedEffect());
APP.effects.push(new ScanlineEffect());
APP.effects.push(new BrightnessEffect());
APP.effects.push(new BrightnessAnimatedEffect());

// Set up dat.gui controls
APP.setupControls();