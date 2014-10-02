var RGB_SCALE = 255;

var HUE_SCALE = 60;
var SATURATION_SCALE = 255;
var BRIGHTNESS_SCALE = 100;

/*
 * Accepts an array of three numbers that represents the red, green, and blue
 * RGB channels, and returns a conversion of that represents hue, saturation,
 * and brightness (HSV) values.
 *
 * @param colour is an array with three elements; one representing red, the
 *   other representing green, and the other representing blue. Ideally, their
 *   values will vary between 0 to 255.
 *
 * @returns an array of three numbers, representing hue, saturation, and
 *   brightness.
 */
function rgb2hsv(colour) {
  var r = colour[0] / RGB_SCALE;
  var g = colour[1] / RGB_SCALE;
  var b = colour[2] / RGB_SCALE;

  var h = 0;
  var s = 0;
  var v = 0;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);

  var delta = max - min;

  // Below, you'll see that when delta == 0, then this means that r == g == b.
  // Then, this means, that whether we compute "g - b", "b - r", or r - g, we
  // will always be getting 0. And also, delta is zero. For any of the following
  // operations, this means that we will ultimately be computing "0 / 0". In
  // JavaScript, this will result in a value called "NaN" [1].
  //
  // We may as well treat this number as our "undefined" case that is talked
  // about in the document [2].
  //
  // [1] http://en.wikipedia.org/wiki/NaN#Floating_point
  // [2] http://mattlockyer.github.io/iat455/documents/rgb-hsv.pdf

  switch (max) {
    case r: h = (g - b) / delta    ; break;
    case g: h = (b - r) / delta + 2; break;
    case b: h = (r - g) / delta + 4; break;
  }

  v = max;

  s = v === 0 ? 0 : delta / v;

  // The assignment never asked about sanitizing the values when returning the
  // HSV values, so, we're just scaling, and nothing else.

  return [h * HUE_SCALE, s * SATURATION_SCALE, v * BRIGHTNESS_SCALE];
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
