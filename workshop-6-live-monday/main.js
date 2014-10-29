var SAMPLES = 128;
var BARS_COUNT = Math.floor(SAMPLES/3);
var WIDTH = 800;
var HEIGHT = 600;
var BAR_WIDTH = 8;
var BARS_RADIUS = 10;

var RGB_SCALE = 255;

var HUE_SCALE = 60;
var SATURATION_SCALE = 255;
var BRIGHTNESS_SCALE = 100;

var audioContext = new AudioContext();
var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');

var fft =  audioContext.createAnalyser();
fft.fftSize = SAMPLES;

// Will contain amplitude data of our harmonics.
var buffer = new Uint8Array(SAMPLES);

function animate() {
  requestAnimationFrame(animate);

  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
  canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

  fft.getByteFrequencyData(buffer);

  for (var i = 0; i < BARS_COUNT; i++) {
    var barsScale = (i / BARS_COUNT);
    var hue = barsScale * HUE_SCALE * 6;
    var rgb = hsv2rgb([hue, SATURATION_SCALE, BRIGHTNESS_SCALE]);
    var rotation = 2 * Math.PI * barsScale;

    var x = Math.cos(rotation) * BARS_RADIUS * ((buffer[i]/255)*10 + BAR_WIDTH);
    var y = Math.sin(rotation) * BARS_RADIUS * ((buffer[i]/255)*10 + BAR_WIDTH);
    
    canvasContext.fillStyle = 'rgb(' +
      (rgb[0]|0) + ',' +
      (rgb[1]|0) + ',' +
      (rgb[2]|0) +
    ')';

    canvasContext.save();

    canvasContext.translate(x + WIDTH / 2, y + HEIGHT / 2);
    // Possibly a scale
    canvasContext.rotate(rotation - Math.PI/2);

    canvasContext.fillRect(
      0,
      0,
      BAR_WIDTH,
      100
    );

    canvasContext.restore();
  }
}

/*
 * Accepts an array of three numbers that represents the hue, saturation, and
 * brightness values, and returns a conversion of that represents red, green,
 * and blue (RGB) channels.
 *
 * @param colour is an array with three elements; one representing hue, the
 *   other representing saturation, and the other representing brightness.
 *   Ideally, their values will vary between 0 to 255.
 *
 * @returns an array of three numbers, representing red, green, and blue.
 */
function hsv2rgb(colour) {
  var h = (colour[0] / HUE_SCALE) % 6 ; if (h < 0) { h += 6; }
  var s = colour[1] / SATURATION_SCALE;
  var v = colour[2] / BRIGHTNESS_SCALE;

  var fl = Math.floor(h);
  var di = h - fl;
  var ax = v * (1 - s);
  var bx = v * (1 - di * s);
  var cx = v * (1 - (1 - di) * s);

  var r = v;
  var g = v;
  var b = v;

  // Below, n < m <= p is the same as n == floor(m)
  //
  // The following switch statement will automatically ignore cases when `h` is
  // mathematically "undefined".

  switch (fl) {
    case 0: r = v ; g = cx; b = ax; break;
    case 1: r = bx; g = v ; b = ax; break;
    case 2: r = ax; g = v ; b = cx; break;
    case 3: r = ax; g = bx; b = v ; break;
    case 4: r = cx; g = ax; b = v ; break;
    case 5: r = v ; g = ax; b = bx; break;
  }

  // For this assignment, we really don't need to worry about returning
  // integers, since, later on, we will be applying the bitwise shift operators
  // on the channels, and the mere act of calling the bitwise shift operator
  // converts a 16-bit floating point number into a 32-bit signed integer, in
  // JavaScript.

  return [r * RGB_SCALE, g * RGB_SCALE, b * RGB_SCALE ];
}

var req = new XMLHttpRequest();
req.open('GET', '../workshop-6/Hustle.mp3', true);
req.responseType = 'arraybuffer';
req.onload = function () {
  audioContext.decodeAudioData(req.response, function (data) {
    var src = audioContext.createBufferSource();
    src.buffer = data;

    src.connect(fft);
    fft.connect(audioContext.destination);

    src.start();
    animate();
  });
};
req.send();