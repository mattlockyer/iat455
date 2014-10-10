function OverlayEffect() {
  // Do note that everything in this function (semantically called a
  // constructor) is called only once; it is when `new OverflayEffect()` is
  // evaluated, and only then.

  this.canvas = new MEDIA.Canvas();
  this.name = 'Overlay';
  this.controls = {}

  // Since there isn't any way to get pixel data from an `Image` object (which
  // we will see, below), we have no choice but to draw images to a canvas
  // object, and then extract the pixel data from there. This will serve as our
  // canvas to draw images on.
  this.otherCanvas = new MEDIA.Canvas();

  // This is to keep tabs of the scope of the current constructor, in case we
  // need to refer to it, later.
  //
  // When we are inside of a dynamically-generated function, it typically isn't
  // bound to the parent function (or constructor), and so the `this` keyword
  // will not refer to the parent funtion. Hence, we are creating a `self`
  // variable to keep tabs of the parent function.
  var self = this;

  // We initialize a new instance of an Image object, and "tell" it to load
  // Chris Hansen's image. We do so implicitly, by setting its `src` property
  // to the location of Chris Hansen's image. We will also attach an event
  // listener, so that we know when the image has loaded, and that we are then
  // able to draw the image onto our canvas.
  this.img = new Image();
  this.img.onload = function () {
    // We are now inside a function, which is bound to our `Image` instance,
    // and hence the `this` keyword will refere to the `Image` instance, and not
    // to the `OverflayEffect` instance.
    //
    // Do note that the code being run here is entirely asynchronous, and so the
    // code in the parent function will *always* run first, and *then* the code
    // inside of this function.

    // We'll just draw the image to our canvas, once.
    //
    // However, if we want to implement time-based post-processing, it would be
    // ideal to draw the image to our other canvas *at every frame*. In other
    // words, you would call `this.otherCanvas.context.drawImage` in the `draw`
    // method, below.
    self.otherCanvas.context.drawImage(
      self.img, 0, 0, MEDIA.width, MEDIA.height
    );
  }
  this.img.src = 'chris_hansen.jpg';
}

OverlayEffect.prototype = {
  draw: function () {
    var canvas = this.canvas;

    APP.drawImage(canvas);

    var backgroundImage = canvas.getImageData();
    var foregroundImage = this.otherCanvas.getImageData();

    var backgroundPixels = new Uint32Array(backgroundImage.data.buffer);
    var foregroundPixels = new Uint32Array(foregroundImage.data.buffer);

    var len = backgroundPixels.length;

    for (var i = 0; i < len; i++) {
      var foregroundPixel = foregroundPixels[i];

      // Get the brightness of our pixel.
      var luma =
        (
          ((foregroundPixel)       & 255) +
          ((foregroundPixel >> 8 ) & 255) +
          ((foregroundPixel >> 16) & 255)
        ) / 3;

      // If the foreground pixel is dark enough, then this means we can replace
      // the background pixel with the foreground pixel.
      if (luma < 220) {
        backgroundPixels[i] = foregroundPixel;
      }
    }

    // Let's not forget to draw the resulting image to our main canvas.
    canvas.putImageData(backgroundImage);
  }
};

var size = {
  small:{w:160, h:120},
  medium:{w:320, h:240},
  large:{w:640, h:480}
}
//setup app
APP.setup(size.large);
//add effects
APP.effects = [];
APP.effects.push(new OverlayEffect());
//setup controls
APP.setupControls();