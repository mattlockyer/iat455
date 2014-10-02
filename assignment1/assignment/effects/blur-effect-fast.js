// The assignment did not require the use a gaussian function to compute the the
// kernel values. You could have precomputed the kernels, and would have gotten
// full marks just fine. This is just for those that *did* go ahead with the the
// dynamic generation of kernels.

function boxesForGauss(sigma, n) { // standard deviation, number of boxes
    var wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width 
    var wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
    var wu = wl+2;

    var mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
    var m = Math.round(mIdeal);

    var sizes = [];  for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
    return sizes;
}

function gaussBlur(scl, tcl, w, h, r) {
    var bxs = boxesForGauss(r, 3);
    boxBlur(scl, tcl, w, h, (bxs[0]-1)/2);
    boxBlur(tcl, scl, w, h, (bxs[1]-1)/2);
    boxBlur(scl, tcl, w, h, (bxs[2]-1)/2);
}

function boxBlur(scl, tcl, w, h, r) {
    for(var i=0; i<scl.length; i++) tcl[i] = scl[i];
    boxBlurH(tcl, scl, w, h, r);
    boxBlurT(scl, tcl, w, h, r);
}

function boxBlurH(scl, tcl, w, h, r) {
    var iarr = 1 / (r+r+1);
    for(var i=0; i < h; i++) {
        var ti = i*w;
        var li = ti;
        var ri = ti+r;
        var fv = scl[ti];
        var lv = scl[ti+w-1];
        var val = (r+1)*fv;
        for(var j=0; j<r; j++) {
          val += scl[ti+j];
        }
        for(var j=0  ; j<=r ; j++) {
          val += scl[ri++] - fv;
          tcl[ti++] = Math.round(val*iarr);
        }
        for(var j=r+1; j<w-r; j++) {
          val += scl[ri++] - scl[li++];
          cl[ti++] = Math.round(val*iarr);
        }
        for(var j=w-r; j<w  ; j++) {
          val += lv - scl[li++];
          tcl[ti++] = Math.round(val*iarr);
        }
    }
}

function boxBlurT(scl, tcl, w, h, r) {
    var iarr = 1 / (r+r+1);
    for(var i=0; i<w; i++) {
        var ti = i, li = ti, ri = ti+r*w;
        var fv = scl[ti], lv = scl[ti+w*(h-1)], val = (r+1)*fv;
        for(var j=0; j<r; j++) {
          val += scl[ti+j*w];
        }
        for(var j=0  ; j<=r ; j++) {
          val += scl[ri] - fv;
          tcl[ti] = Math.round(val*iarr);
          ri+=w; ti+=w;
        }
        for(var j=r+1; j<h-r; j++) {
          val += scl[ri] - scl[li];
          tcl[ti] = Math.round(val*iarr);
          li+=w;
          ri+=w;
          ti+=w;
        }
        for(var j=h-r; j<h  ; j++) {
          val += lv - scl[li];
          tcl[ti] = Math.round(val*iarr);
          li+=w;
          ti+=w;
        }
    }
}

function BlurFastEffect() {
  var self = this;

  self.canvas = new MEDIA.Canvas();

  self.name = 'BlurFast';
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
