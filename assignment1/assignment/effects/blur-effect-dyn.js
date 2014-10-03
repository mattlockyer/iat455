// The assignment did not require the use a gaussian function to compute the the
// kernel values. You could have precomputed the kernels, and would have gotten
// full marks just fine. This is just for those that *did* go ahead with the the
// dynamic generation of kernels.

/*
 * Gets the distance between two vectors.
 *
 * @param x1 a number that is the x coordinate of the first vector
 * @param y1 a number that is the y coordinate of the first vector
 * @param x2 a number that is the x coordinate of the second vector
 * @param y2 a number that is the y coordinate of the second vector
 *
 * @returns a number that represnts the distance of the two vectors.
 */
function hypotenuse(x1, y1, x2, y2) {
  var xSquare = Math.pow(x1 - x2, 2);
  var ySquare = Math.pow(y1 - y2, 2);
  return Math.sqrt(xSquare + ySquare);
}

/*
 * Generates a kernel used for the gaussian blur effect.
 *
 * @param dimension is an odd integer
 * @param sigma is the standard deviation used for our gaussian function.
 *
 * @returns an array with dimension^2 number of numbers, all less than or equal
 *   to 1. Represents our gaussian blur kernel.
 */
function generateGaussianKernel(dimension, sigma) {
  if (!(dimension % 2) || Math.floor(dimension) !== dimension || dimension<3) {
    throw new Error(
      'The dimension must be an odd integer greater than or equal to 3'
    );
  }
  var kernel = [];

  var twoSigmaSquare = 2 * sigma * sigma;
  var centre = (dimension - 1) / 2;

  for (var i = 0; i < dimension; i++) {
    for (var j = 0; j < dimension; j++) {
      var distance = hypotenuse(i, j, centre, centre);

      // The following is an algorithm that came from the gaussian blur
      // wikipedia page [1].
      //
      // http://en.wikipedia.org/w/index.php?title=Gaussian_blur&oldid=608793634#Mechanics
      var gaussian = (1 / Math.sqrt(
        Math.PI * twoSigmaSquare
      )) * Math.exp((-1) * (Math.pow(distance, 2) / twoSigmaSquare));

      kernel.push(gaussian);
    }
  }

  // Returns the unit vector of the kernel array.
  var sum = kernel.reduce(function (c, p) { return c + p; });
  return kernel.map(function (e) { return e / sum; });
}

function BlurDynamicEffect() {
  var self = this;

  self.canvas = new MEDIA.Canvas();

  self.name = 'BlurDynamic';
  self.controls = {
    Strength: {
      value: 0,
      min: 0,
      max: 3,
      step: 1
    }
  };

  this.kernels = Array(4).join(' ').slice(' ').map(function (e, i) {
    return generateGaussianKernel((i + 1) * 2 + 1, (1 + i) / 2);
  });
};

BlurDynamicEffect.prototype = {
  draw: function() {
    var canvas = this.canvas;
    var width = MEDIA.width;

    APP.drawImage(canvas);

    var img = canvas.getImageData();
    var pixels = new Uint32Array(img.data.buffer);

    // Get the kernel from the kernels array. The strength is scale from 0 to 3,
    // and there are four elements in our kernels array. Indexing is given for
    // free. No need of if-statements, or switch statements.

    // Just sanitizing the input.
    var kernelIndex = this.controls.Strength.value << 0;
    kernelIndex =
      kernelIndex < 0 || kernelIndex > (kernels.length - 1) ?
      0 :
      kernelIndex;

    var kernel = this.kernels[kernelIndex];

    var kernelLength = kernel.length;
    var kernelDimension = Math.sqrt(kernelLength);
    var kernelHalf = (kernelDimension - 1) / 2;

    // In the workshop, it was mentioned that there are two methods of
    // convolving an image: directly writing the convolution to the image, and
    // buffering the convolution prior to writing it to the image. Here, we're
    // using the latter method.

    // This is where we will be buffering our convolutions.
    var buffer = [];

    var len = pixels.length;

    // Just like the HSV effect, we are looping through every pixel. We don't
    // even have to worry about its neighbouring pixels in this higher for-loop;
    // we just worry about individual pixel. The part about neightbouring pixels
    // will be handled in the inner for-loop, which is where we will be doing
    // the convolution.
    for (var i = 0; i < len; i++) {

      // Get the cartesian coordinates of the currently-indexed pixel.
      var col = i % width;
      var row = Math.floor(i / width);

      // This is where we will be storing the sum of all products between kernel
      // elements and pixels. In other words, this is the end result of our
      // convolution.
      var accumR = 0;
      var accumG = 0;
      var accumB = 0;

      // This is where we will be doing the convolution. Here, in this inner
      // for-loop, we are looping through the kernel elements, *not* the pixels.
      // As we are looping through the kernel elements, we will be getting an
      // offset, which will be used to get the pixel that is either a neighbour
      // of the pixel that we are convolving, or the pixel itself.
      for (var j = 0; j < kernelLength; j++) {

        // Get the cartesian coordinates of the currently-indexed kernel
        // element. Again, we will be using this to get back the position in
        // which we have to get the values
        var x = j % kernelDimension;
        var y = Math.floor(j / kernelDimension);

        // When many looked at the original convolution code in the workshops,
        // they all asked what's the purpose of subtracting by 1. Well, you want
        // your kernel's center to be positioned directly *on* the pixel itself.
        // If we don't offset both the x and y coordinate by -1, then, instead
        // of a 3x3 kernel's centre element being aligned with our indexed
        // pixel, it will be the kernel's top-left element that will be aligned
        // with our pixel, which is not what we want. For the record, the "1" in
        // "-1" represents the floored half of 3, and 3 is the width and the
        // height of our kernel. If the kernel size was 5, then the floored half
        // will be 2; for 7, it will be 3, and for 9, it will be 4.
        var lookupX = col + x - kernelHalf; if (lookupX < 0) { lookupX = 0; }
        var lookupY = row + y - kernelHalf; if (lookupY < 0) { lookupY = 0; }

        // Now that we have the offset, convert the cartesian vector into a
        // scalar, which will be used to represent an element in our pixels
        // array.
        var index = lookupX + (lookupY * width);

        // Get our pixel.
        var pixel = pixels[index];

        // Multiply the pixel with the complementary kernel element, then add
        // the product to the accumulators.
        accumR += (pixel & 255)         * kernel[j];
        accumG += ((pixel >> 8) & 255)  * kernel[j];
        accumB += ((pixel >> 16) & 255) * kernel[j];
      }

      // We're done convolving our pixel, and the result should be in the
      // accumulators

      // Now buffer the our resulting pixel value.
      buffer.push(
        (accumR & 255)         |
        ((accumG & 255) << 8)  |
        ((accumB & 255) << 16) |
        (255 << 24)
      );
    }

    // Draw out the buffered pixels onto our image.
    for (var i = 0; i < len; i++) {
      pixels[i] = buffer[i];
    }

    canvas.putImageData(img);
  }
};
