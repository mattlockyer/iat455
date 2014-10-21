

"use strict";

var APP = APP || {};

function LipSwitchEffect() {
  this.canvas = new MEDIA.Canvas();
  this.name = 'Lip Switch';
  this.controls = {
    x: {
      min:0,
      max: MEDIA.width
    },
    y: {
      min: 0,
      max: MEDIA.height
    },
    width: {},
    height: {}
  };

  this.foregroundCanvas = new MEDIA.Canvas();
  this.maskCanvas = new MEDIA.Canvas();

  var self = this;

  var width = MEDIA.width;
  var height = MEDIA.height;

  var foreground = new Image();
  foreground.onload = function () {
    self.foregroundCanvas.context.drawImage(
      foreground, 0, 0, width, height
    );
  };
  foreground.src = 'img/reggie_fils_aime.jpg';

  var mask = new Image();
  mask.onload = function () {
    self.maskCanvas.context.drawImage(
      mask, 0, 0, width, height
    );
  };
  mask.src = 'img/reggie_fils_aime-masks.jpg';
}

LipSwitchEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var foreground = this.foregroundCanvas.getImageData();
    var mask = this.maskCanvas.getImageData();

    var imgData = new Uint32Array(img.data.buffer);
    var foregroundData = new Uint32Array(foreground.data.buffer);
    var maskData = new Uint32Array(mask.data.buffer);

    for (var i = 0, len = imgData.length; i < len; i++) {
      var imgPixel = imgData[i];

      var imgR = imgPixel & 255;
      var imgG = (imgPixel >> 8) & 255;
      var imgB = (imgPixel >> 16) & 255;

      var foregroundPixel = foregroundData[i];

      var foregroundR = foregroundPixel & 255;
      var foregroundG = (foregroundPixel >> 8) & 255;
      var foregroundB = (foregroundPixel >> 16) & 255;

      var maskPixel = maskData[i];

      var maskR = maskPixel & 255;
      var maskG = (maskPixel >> 8) & 255;
      var maskB = (maskPixel >> 16) & 255;

      // We could have looked at green or blue of the mask.
      if (maskR > 128) {
        imgR = foregroundR;
        imgG = foregroundG;
        imgB = foregroundB;
      }

      imgData[i] =
        (imgR & 255)         |
        ((imgG & 255) << 8 ) |
        ((imgB & 255) << 16) |
        (255 << 24);
    }

    canvas.putImageData(img);
  }
};

APP.init = function() {
  //setup app
  APP.setup({w:640, h:480});
  //add effects
  APP.effects = [];
  APP.effects.push(new RGBMatteEffect());
  APP.effects.push(new LipSwitchEffect());
  //setup controls
  APP.setupControls();
};

APP.init();
