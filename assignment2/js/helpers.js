/*
 * Clamps the value between 0 to max.
 */
function clamp(val, max) {
  return val > max ? max : val < 0 ? 0 : val
}

/*
 * Converts the supplied r, g, and b values to a int-32 pixel. Stores r in the
 * lower 8 bits, g to the next higher 8 bits, and b to the next higher 8 bits.
 * The highest 8 bits is set to 0xFF (255);
 */
function rgbToInt32(r, g, b) {
  return (r & 255) | ((g & 255) << 8) | ((b & 255) << 16) | (255 << 24);
}

/*
 * Extracts the red component of the pixel (lowest 8 bits, 0th byte).
 */
function getRed(pixel) {
  return pixel & 255;
}

/*
 * Extracts the green component of the pixel (1st byte).
 */
function getGreen(pixel) {
  return (pixel >> 8) & 255;
}

/*
 * Extracts the blue component of the pixel (2nd byte).
 */
function getBlue(pixel) {
  return (pixel >> 16) & 255;
}

/*
 * Gets the lightness that is encoded into the pixel.
 */
function getLightness(p) {
  return (getRed(p) + getGreen(p) + getBlue(p))/3;
}

var numtypeof = 'number'

/*
 * Applies an additive blend between pixel 1 and pixel 2, and also applies the
 * supplied alpha value.
 *
 * Ignores the pixels' alphas.
 */
function additiveBlend(p1, p2, a1, a2) {
  a1 = typeof a1 !== numtypeof ? 1 : clamp(a1, 1);
  a2 = typeof a2 !== numtypeof ? 1 : clamp(a2, 1);

  var r1 = getRed(p1);
  var g1 = getGreen(p1);
  var b1 = getBlue(p1);

  var r2 = getRed(p2);
  var g2 = getGreen(p2);
  var b2 = getBlue(p2);

  var rf = clamp(r1*a1 + r2*a2, 255);
  var gf = clamp(g1*a1 + g2*a2, 255);
  var bf = clamp(b1*a1 + b2*a2, 255);

  return rgbToInt32(rf, gf, bf);
}

/*
 * Applies a subtractive blend between pixel 1 and pixel 2, and also applies the
 * supplied alpha value.
 *
 * Ignores the pixels' alphas.
 */
function subtractiveBlend(p1, p2, a1, a2) {
  a1 = typeof a1 !== numtypeof ? 1 : clamp(a1, 1);
  a2 = typeof a2 !== numtypeof ? 1 : clamp(a2, 1);

  var r1 = getRed(p1);
  var g1 = getGreen(p1);
  var b1 = getBlue(p1);

  var r2 = getRed(p2);
  var g2 = getGreen(p2);
  var b2 = getBlue(p2);

  var rf = clamp(r1*a1 - r2*a2, 255);
  var gf = clamp(g1*a1 - g2*a2, 255);
  var bf = clamp(b1*a1 - g2*a2, 255)

  return rgbToInt32(rf, gf, bf);
}

/*
 * Applies a multiply blend between pixel 1 and pixel 2, and also applies the
 * supplied alpha value.
 */
function multiplyBlend(p1, p2, a1, a2) {
  a1 = typeof a1 !== numtypeof ? 1 : clamp(a1, 1);
  a2 = typeof a2 !== numtypeof ? 1 : clamp(a2, 1);

  var r1 = getRed(p1);
  var g1 = getGreen(p1);
  var b1 = getBlue(p1);

  var r2 = getRed(p2);
  var g2 = getGreen(p2);
  var b2 = getBlue(p2);

  var rf = clamp(r1*a1*r2*a2/10, 255);
  var gf = clamp(g1*a1*g2*a2/10, 255);
  var bf = clamp(b1*a1*b2*a2/10, 255);

  return rgbToInt32(rf, gf, bf);
}

/*
 * Applies a screen blend between pixel 1 and pixel 2, and also applies the
 * supplied alpha value.
 */
function screenBlend(p1, p2, a1, a2) {
  a1 = typeof a1 !== numtypeof ? 1 : clamp(a1, 1);
  a2 = typeof a2 !== numtypeof ? 1 : clamp(a2, 1);

  var r1 = getRed(p1)/255;
  var g1 = getGreen(p1)/255;
  var b1 = getBlue(p1)/255;

  var r2 = getRed(p2)/255;
  var g2 = getGreen(p2)/255;
  var b2 = getBlue(p2)/255;

  var rf = clamp(1 - (1 - r1*a1)*(1 - r2*a2), 1)*255;
  var gf = clamp(1 - (1 - g1*a1)*(1 - g2*a2), 1)*255;
  var bf = clamp(1 - (1 - b1*a1)*(1 - b2*a2), 1)*255;

  return rgbToInt32(rf, gf, bf);
}

/*
 * Applies an overlay blend between pixel 1 and pixel 2, and also applies the
 * supplied alpha value.
 */
function overlayBlend(p1, p2, a1, a2) {
  a1 = typeof a1 !== numtypeof ? 1 : clamp(a1, 1);
  a2 = typeof a2 !== numtypeof ? 1 : clamp(a2, 1);

  var r1 = getRed(p1)*a1/255;
  var g1 = getGreen(p1)*a1/255;
  var b1 = getBlue(p1)*a1/255;

  var r2 = getRed(p2)*a2/255;
  var g2 = getGreen(p2)*a2/255;
  var b2 = getBlue(p2)*a2/255;

  var rf = clamp((r1 < 0.5 ? 2 * r1 * r2 : 1 - 2*(1 - r1)*(1 - r2))*255);
  var gf = clamp((g1 < 0.5 ? 2 * g1 * g2 : 1 - 2*(1 - g1)*(1 - g2))*255);
  var bf = clamp((b1 < 0.5 ? 2 * b1 * b2 : 1 - 2*(1 - b1)*(1 - b2))*255);

  return rgbToInt32(rf, gf, bf);
}
