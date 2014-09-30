function AdditiveBlendingEffect() {
  this.canvas = new MEDIA.Canvas();

  this.otherCanvas = new MEDIA.Canvas();

  this.name = 'AdditiveBlending';

  var self = this;

  this.controls = {
    LoadImage:function() {
      var url = window.prompt('Enter image url');
      var img = new Image();
      img.crossOrigin = true;
      img.onload = function() {
        var other = self.otherCanvas;
        other.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
      };
      img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
    },
    Source_1_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    Source_2_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  };
}

AdditiveBlendingEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    other = this.otherCanvas;

    var s1a = this.controls.Source_1_Alpha.value;
    var s2a = this.controls.Source_2_Alpha.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var imgOther = other.getImageData();
    var pixels1 = new Uint32Array(img.data.buffer);
    var pixels2 = new Uint32Array(imgOther.data.buffer);

    for (var i = 0, len = pixels1.length; i < len; i++) {
      var pixel1 = pixels1[i];
      var pixel2 = pixels2[i];

      var r1 = pixel1 & 255;
      var g1 = (pixel1 >> 8) & 255;
      var b1 = (pixel1 >> 16) & 255;

      var r2 = pixel2 & 255;
      var g2 = (pixel2 >> 8) & 255;
      var b2 = (pixel2 >> 16) & 255;

      var r = r1 * s1a + r2 * s2a;
      var g = g1 * s1a + g2 * s2a;
      var b = b1 * s1a + b2 * s2a;

      if (r > 255) { r = 255; }
      if (g > 255) { g = 255; }
      if (b > 255) { b = 255; }

      pixels1[i] = 
        (r & 255)         |
        ((g & 255) << 8)  |
        ((b & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function SubtractiveBlendingEffect() {
  this.canvas = new MEDIA.Canvas();

  this.otherCanvas = new MEDIA.Canvas();

  this.name = 'SubtractiveBlending';

  var self = this;

  this.controls = {
    LoadImage:function() {
      var url = window.prompt('Enter image url');
      var img = new Image();
      img.crossOrigin = true;
      img.onload = function() {
        var other = self.otherCanvas;
        other.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
      };
      img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
    },
    Source_1_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    Source_2_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  };
}

SubtractiveBlendingEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    other = this.otherCanvas;

    var s1a = this.controls.Source_1_Alpha.value;
    var s2a = this.controls.Source_2_Alpha.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var imgOther = other.getImageData();
    var pixels1 = new Uint32Array(img.data.buffer);
    var pixels2 = new Uint32Array(imgOther.data.buffer);

    for (var i = 0, len = pixels1.length; i < len; i++) {
      var pixel1 = pixels1[i];
      var pixel2 = pixels2[i];

      var r1 = pixel1 & 255;
      var g1 = (pixel1 >> 8) & 255;
      var b1 = (pixel1 >> 16) & 255;

      var r2 = pixel2 & 255;
      var g2 = (pixel2 >> 8) & 255;
      var b2 = (pixel2 >> 16) & 255;

      var r = r1 * s1a - r2 * s2a;
      var g = g1 * s1a - g2 * s2a;
      var b = b1 * s1a - b2 * s2a;

      if (r < 0) { r = 0; }
      if (g < 0) { g = 0; }
      if (b < 0) { b = 0; }

      pixels1[i] = 
        (r & 255)         |
        ((g & 255) << 8)  |
        ((b & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function MultiplicativeBlendingEffect() {
  this.canvas = new MEDIA.Canvas();

  this.otherCanvas = new MEDIA.Canvas();

  this.name = 'MultiplicativeBlending';

  var self = this;

  this.controls = {
    LoadImage:function() {
      var url = window.prompt('Enter image url');
      var img = new Image();
      img.crossOrigin = true;
      img.onload = function() {
        var other = self.otherCanvas;
        other.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
      };
      img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
    },
    Source_1_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    Source_2_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  };
}

MultiplicativeBlendingEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    other = this.otherCanvas;

    var s1a = this.controls.Source_1_Alpha.value;
    var s2a = this.controls.Source_2_Alpha.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var imgOther = other.getImageData();
    var pixels1 = new Uint32Array(img.data.buffer);
    var pixels2 = new Uint32Array(imgOther.data.buffer);

    for (var i = 0, len = pixels1.length; i < len; i++) {
      var pixel1 = pixels1[i];
      var pixel2 = pixels2[i];

      var r1 = pixel1 & 255;
      var g1 = (pixel1 >> 8) & 255;
      var b1 = (pixel1 >> 16) & 255;

      var r2 = pixel2 & 255;
      var g2 = (pixel2 >> 8) & 255;
      var b2 = (pixel2 >> 16) & 255;

      var r = r1 * s1a * r2 * s2a;
      var g = g1 * s1a * g2 * s2a;
      var b = b1 * s1a * b2 * s2a;

      if (r > 255) { r = 255; }
      if (g > 255) { g = 255; }
      if (b > 255) { b = 255; }

      pixels1[i] = 
        (r & 255)         |
        ((g & 255) << 8)  |
        ((b & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function DivisiveBlendingEffect() {
  this.canvas = new MEDIA.Canvas();

  this.otherCanvas = new MEDIA.Canvas();

  this.name = 'DivisiveBlending';

  var self = this;

  this.controls = {
    LoadImage:function() {
      var url = window.prompt('Enter image url');
      var img = new Image();
      img.crossOrigin = true;
      img.onload = function() {
        var other = self.otherCanvas;
        other.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
      };
      img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
    },
    Source_1_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    Source_2_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  };
}

DivisiveBlendingEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    other = this.otherCanvas;

    var s1a = this.controls.Source_1_Alpha.value;
    var s2a = this.controls.Source_2_Alpha.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var imgOther = other.getImageData();
    var pixels1 = new Uint32Array(img.data.buffer);
    var pixels2 = new Uint32Array(imgOther.data.buffer);

    for (var i = 0, len = pixels1.length; i < len; i++) {
      var pixel1 = pixels1[i];
      var pixel2 = pixels2[i];

      var r1 = pixel1 & 255;
      var g1 = (pixel1 >> 8) & 255;
      var b1 = (pixel1 >> 16) & 255;

      var r2 = pixel2 & 255;
      var g2 = (pixel2 >> 8) & 255;
      var b2 = (pixel2 >> 16) & 255;

      var r = (r1 * s1a) / (r2 * s2a);
      var g = (g1 * s1a) / (g2 * s2a);
      var b = (b1 * s1a) / (b2 * s2a);

      if (r > 255) { r = 255; }
      if (g > 255) { g = 255; }
      if (b > 255) { b = 255; }

      pixels1[i] = 
        (r & 255)         |
        ((g & 255) << 8)  |
        ((b & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function OverlayBlendingEffect() {
  this.canvas = new MEDIA.Canvas();

  this.otherCanvas = new MEDIA.Canvas();

  this.name = 'OverlayBlending';

  var self = this;

  this.controls = {
    LoadImage:function() {
      var url = window.prompt('Enter image url');
      var img = new Image();
      img.crossOrigin = true;
      img.onload = function() {
        var other = self.otherCanvas;
        other.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
      };
      img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
    },
    Source_1_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    Source_2_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  };
}

OverlayBlendingEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    other = this.otherCanvas;

    var s1a = this.controls.Source_1_Alpha.value;
    var s2a = this.controls.Source_2_Alpha.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var imgOther = other.getImageData();
    var pixels1 = new Uint32Array(img.data.buffer);
    var pixels2 = new Uint32Array(imgOther.data.buffer);

    for (var i = 0, len = pixels1.length; i < len; i++) {
      var pixel1 = pixels1[i];
      var pixel2 = pixels2[i];

      var r1 = pixel1 & 255;
      var g1 = (pixel1 >> 8) & 255;
      var b1 = (pixel1 >> 16) & 255;

      var r2 = pixel2 & 255;
      var g2 = (pixel2 >> 8) & 255;
      var b2 = (pixel2 >> 16) & 255;

      var r = (r1 * s1a) / (r2 * s2a);
      var g = (g1 * s1a) / (g2 * s2a);
      var b = (b1 * s1a) / (b2 * s2a);

      if (r1 < 128) {
        r = 2 * r1 * s1a * r2 * s2a;
      } else {
        r = 255 - (255 - r1 * s1a) * (255 - r2 * s2a);
      }

      if (g1 < 128) {
        g = 2 * g1 * s1a * g2 * s2a;
      } else {
        g = 255 - (255 - g1 * s1a) * (255 - g2 * s2a);
      }

      if (b1 < 128) {
        b = 2 * b1 * s1a * b2 * s2a;
      } else {
        b = 255 - (255 - b1 * s1a) * (255 - b2 * s2a);
      }

      if (r > 255) { r = 255; }
      if (g > 255) { g = 255; }
      if (b > 255) { b = 255; }

      if (r < 0) { r = 0; }
      if (g < 0) { g = 0; }
      if (b < 0) { b = 0; }

      pixels1[i] = 
        (r & 255)         |
        ((g & 255) << 8)  |
        ((b & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function ScreenBlendingEffect() {
  this.canvas = new MEDIA.Canvas();

  this.otherCanvas = new MEDIA.Canvas();

  this.name = 'ScreenBlending';

  var self = this;

  this.controls = {
    LoadImage:function() {
      var url = window.prompt('Enter image url');
      var img = new Image();
      img.crossOrigin = true;
      img.onload = function() {
        var other = self.otherCanvas;
        other.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
      };
      img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
    },
    Source_1_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    Source_2_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  };
}

ScreenBlendingEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    other = this.otherCanvas;

    var s1a = this.controls.Source_1_Alpha.value;
    var s2a = this.controls.Source_2_Alpha.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var imgOther = other.getImageData();
    var pixels1 = new Uint32Array(img.data.buffer);
    var pixels2 = new Uint32Array(imgOther.data.buffer);

    for (var i = 0, len = pixels1.length; i < len; i++) {
      var pixel1 = pixels1[i];
      var pixel2 = pixels2[i];

      var r1 = pixel1 & 255;
      var g1 = (pixel1 >> 8) & 255;
      var b1 = (pixel1 >> 16) & 255;

      var r2 = pixel2 & 255;
      var g2 = (pixel2 >> 8) & 255;
      var b2 = (pixel2 >> 16) & 255;

      var r = (r1 * s1a) / (r2 * s2a);
      var g = (g1 * s1a) / (g2 * s2a);
      var b = (b1 * s1a) / (b2 * s2a);

      r = 255 - (255 - r1 * s1a) * (255 - r2 * s2a);
      g = 255 - (255 - g1 * s1a) * (255 - g2 * s2a);
      b = 255 - (255 - b1 * s1a) * (255 - b2 * s2a);

      if (r > 255) { r = 255; }
      if (g > 255) { g = 255; }
      if (b > 255) { b = 255; }

      if (r < 0) { r = 0; }
      if (g < 0) { g = 0; }
      if (b < 0) { b = 0; }

      pixels1[i] = 
        (r & 255)         |
        ((g & 255) << 8)  |
        ((b & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

function MaskingEffect() {
  this.canvas = new MEDIA.Canvas();

  this.otherCanvas = new MEDIA.Canvas();

  this.name = 'Masking';

  var self = this;

  var img = new Image();
  img.onload = function () {
    self.otherCanvas.context.drawImage(
      img, 0, 0, MEDIA.width, MEDIA.height
    );
  };
  img.src = 'img/mask.png';

  this.controls = {
    Source_1_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    Source_2_Alpha: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  };
}

MaskingEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    other = this.otherCanvas;

    var s1a = this.controls.Source_1_Alpha.value;
    var s2a = this.controls.Source_2_Alpha.value;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var imgOther = other.getImageData();
    var pixels1 = new Uint32Array(img.data.buffer);
    var pixels2 = new Uint32Array(imgOther.data.buffer);

    for (var i = 0, len = pixels1.length; i < len; i++) {
      var pixel1 = pixels1[i];
      var pixel2 = pixels2[i];

      var r1 = pixel1 & 255;
      var g1 = (pixel1 >> 8) & 255;
      var b1 = (pixel1 >> 16) & 255;

      var r2 = pixel2 & 255;
      var g2 = (pixel2 >> 8) & 255;
      var b2 = (pixel2 >> 16) & 255;

      if (r2 < 128) {
        g1 = 0;
        b1 = 0;
      }

      pixels1[i] =
        (r1 & 255)       |
        (g1 & 255) << 8  |
        (b1 & 255) << 16 |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

//setup app
APP.setup({w: 640, h: 480});
//add effects
APP.effects = [];
APP.effects.push(new AdditiveBlendingEffect());
APP.effects.push(new SubtractiveBlendingEffect());
APP.effects.push(new MultiplicativeBlendingEffect());
APP.effects.push(new DivisiveBlendingEffect());
APP.effects.push(new OverlayBlendingEffect());
APP.effects.push(new ScreenBlendingEffect());
APP.effects.push(new MaskingEffect());
//setup controls
APP.setupControls();