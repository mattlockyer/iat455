

"use strict";

var APP = APP || {};

function LipSwitchEffect() {
  this.canvas = new MEDIA.Canvas();
  this.foregroundCanvas = new MEDIA.Canvas();
  this.maskCanvas = new MEDIA.Canvas();

  this.name = 'Lip Switch';
  this.controls = {};

  var self = this;

  

  this.foregroundImage = new Image();
  this.foregroundImage.onload = function () {
  };
  this.foregroundImage.src = 'img/reggie_fils_aime.jpg'

  this.maskImage = new Image();
  this.maskImage.onload = function () {
    
  }
  this.maskImage.src = 'img/reggie_fils_aime-masks.jpg'
}

LipSwitchEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;
    var foregroundCanvas = this.foregroundCanvas;
    var maskCanvas = this.maskCanvas;
    var width = MEDIA.width;
    var height = MEDIA.height;

    APP.drawImage(canvas);

    var self = this;

    self.maskCanvas.context.drawImage(
      self.mxaskImage, 0, 0, width, height
    );

    self.foregroundCanvas.context.drawImage(
      self.foregroundImage, 0, 0, width, height
    );

    var img = canvas.getImageData();
    var foregroundImg = foregroundCanvas.getImageData();
    var maskImg = maskCanvas.getImageData();

    var imgData = new Uint32Array(img.data.buffer);
    var foregroundImgData =
      new Uint32Array(foregroundImg.data.buffer);
    var maskImgData = new Uint32Array(maskImg.data.buffer);

    for (var i = 0, len = imgData.length; i < len; i++) {
      if ((maskImgData[i] & 255) > 128) {
        imgData[i] = foregroundImgData[i]
      }
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
