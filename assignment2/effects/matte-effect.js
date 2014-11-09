function MatteEffect() {
  // For the background canvas, we're just going to be lazy, and draw over it
  // once we have drawn the webcam image.
  this.canvas = this.backgroundCanvas = new MEDIA.Canvas();
  // This is where we are going to draw the matte image.
  this.matteCanvas = new MEDIA.Canvas();

  // What we are going to do here is different. We're not interested in the
  // matte canvas itself, but rather the pixels that will be drawn to it.
  var foregroundCanvas = new MEDIA.Canvas();
  this.foreground = null;

  var self = this;

  this.name = 'Matte Effect';

  this.controls = {
    x: {
      value: Math.floor(MEDIA.width / 2),
      min: 0,
      max: MEDIA.width,
      step: 1
    },
    y: {
      value: Math.floor(MEDIA.height / 2),
      min: 0,
      max: MEDIA.height,
      step: 1
    },
    // Although, not required for this assignment, but this value is on a
    // logarithmic scale, and so, this means that we will have to take this
    // value, and use it as an exponent to the base 2.
    scale: {
      value: 0,
      min: -10,
      max: 10,
      step: 1
    },
    rotation: {
      value: 0,
      min: 0,
      max: 360,
      step: 1
    }
  };

  // Load the matte image.
  this.matteImage = new Image();
  this.matteImage.src = 'img/noise.png';

  // Load the foreground image.
  var img = new Image();
  img.onload = function () {
    foregroundCanvas.context.drawImage(
      img,
      0,
      0,
      MEDIA.width,
      MEDIA.height
    );
    var buffer = foregroundCanvas.getImageData().data.buffer;
    self.foreground = new Uint32Array(buffer);
  };
  img.src = 'img/star-field.jpg';
}

// Comment out the current one, and uncomment any of the following to see a
// change in effect.

var _blendMode = additiveBlend;
// var _blendMode = subtractiveBlend;
// var _blendMode = multiplyBlend;
// var _blendMode = screenBlend;
// var _blendMode = overlayBlend;

/*
 * Checks to see whether or not ay of the control values have changed. If so,
 * return true; false otherwise.
 */
MatteEffect.prototype._changed = function () {
  var controls = this.controls;
  if (!this.notFirstCall) {
    this.notFirstCall = true;
    return true;
  }
  for (var key in this.controls) {
    if (typeof controls[key].old == 'undefined') {
      controls[key].old = controls[key].value;
    } else if (controls[key].value !== controls[key].old) {
      controls[key].old = controls[key].value;
      return true;
    }
  }
  return false;
}

MatteEffect.prototype.draw = function () {
  var backgroundCanvas = this.backgroundCanvas;
  var foreground = this.foreground; var fgData = foreground;
  var matteCanvas = this.matteCanvas;
  var controls = this.controls;
  var matteImage = this.matteImage;

  // Draw the webcam image.
  APP.drawImage(backgroundCanvas);

  if (matteImage && this._changed()) {
    // Draw the matte image, with the transformations.
    var mcContext = matteCanvas.context;
    mcContext.fillRect(0, 0, MEDIA.width, MEDIA.height);
    mcContext.save();
    // Remember, you perform the transformations backwards.
    //
    // This because of the ways that matrices work.
    mcContext.translate(controls.x.value, controls.y.value);
    mcContext.rotate(Math.PI * controls.rotation.value / 180);
    var scale = Math.pow(2, controls.scale.value);
    mcContext.scale(scale, scale);
    mcContext.translate(-matteImage.width/2, -matteImage.height/2);
    mcContext.drawImage(matteImage, 0, 0, matteImage.width, matteImage.height);
    mcContext.restore();
  }

  var background = backgroundCanvas.getImageData();
  var bgData = new Uint32Array(background.data.buffer);
  var matteData = new Uint32Array(matteCanvas.getImageData().data.buffer);

  for (var i = 0; i < bgData.length; i++) {
    var matteAlpha = (matteData[i] & 255) / 255;
    var fgP = fgData ? fgData[i] : (255 << 24);
    // If you happened to have skipped to here, and are wondering what this
    // `_blendMode` function is. Scroll up to see where `_blendMode` was
    // defined and declared.
    bgData[i] =
      _blendMode(
        bgData[i],
        fgP,
        matteAlpha,
        1 - matteAlpha
      );
  }

  backgroundCanvas.putImageData(background);
};
