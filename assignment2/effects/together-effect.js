function TogetherEffect() {
  // See the matte effect.

  this.canvas = this.backgroundCanvas = new MEDIA.Canvas();
  this.matteCanvas = new MEDIA.Canvas();

  var foregroundCanvas = new MEDIA.Canvas();
  this.foreground = null;

  var self = this;

  this.name = 'Together Effect';

  this.controls = {
    threshold: {
      value: 128,
      min: 0,
      max: 255,
      step: 1
    },
    fuzziness: {
      value: 128,
      min: 0,
      max: 255,
      step: 1
    }
  };

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
  img.src = 'img/vancouver-night.jpg';
}

// Comment out the current one, and uncomment any of the following to see a
// change in effect.

var _blendMode = additiveBlend;
// var _blendMode = subtractiveBlend;
// var _blendMode = multiplyBlend;
// var _blendMode = screenBlend;
// var _blendMode = overlayBlend;

TogetherEffect.prototype.draw = function () {
  var backgroundCanvas = this.backgroundCanvas;
  var foreground = this.foreground; var fgData = foreground;
  var matteCanvas = this.matteCanvas;
  var controls = this.controls;

  // Draw the webcam image.
  APP.drawImage(backgroundCanvas);
  APP.drawImage(matteCanvas);

  var background = backgroundCanvas.getImageData();
  var bgData = new Uint32Array(background.data.buffer);
  var matteData = new Uint32Array(matteCanvas.getImageData().data.buffer);

  for (var i = 0; i < bgData.length; i++) {
    var t = this.controls.threshold.value;
    var f = this.controls.fuzziness.value;

    // For this part, the algorithm was pretty simple:
    //
    //     (brightness - (threshold - fuzziness / 2)) / fuzziness
    //
    // We are trying to clamp the brightness to a scale from 0 to 1. However
    // *how* bright is determined by the threshold. How to clamp to 0 to 1
    // is determined by the relative position of the brightness value to the
    // lowest fuzziness, to the highest fuzziness.
    var matteAlpha = clamp((getLightness(matteData[i]) - t + f / 2) / f, 1);
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
