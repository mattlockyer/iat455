// This is a custom implementation of a low-pass cutoff filter.
//
// We are actually using the fast-fourier transform, but in the real world, when
// it comes to real-time audio synthesis, **never**, **ever** use the FFT for
// simple effects such as cutoff filters. Use a biquad filter, instead.
//
// However, for anything non-realtime, go ahead, use the FFT. In fact, use the
// DFT, no matter how slow it is!

// The number of samples to run the FFT against.
var samples = 1024

// The typical web audio stuff.
var audioContext = new AudioContext()

// A custom audio node that will serve as our *real* low-pass cutoff. There are
// other filters out there that mimic the low-pass cutoff, but we're not going
// to mimic, but do the real thing, manually, ourselves.
var lpfilter = audioContext.createScriptProcessor(samples, 1, 1)

// Override the audio node's `onaudioprocess` method. This will be called
// whenever the browser feels is best.
lpfilter.onaudioprocess = function (e) {
  // This is our array of complex numbers. Will be used, at first, to store the
  // raw PCM data, but afterwards, will be converted into the PCM data's
  // harmonics data. The harmonics data is not readily available; it's encoded
  // in the list of complex numbers.
  //
  // Remember, complex numbers are expressions of the following sort:
  //
  //     a + ib
  //
  // Where a and b are real numbers, and i is the imaginary number (sqrt(-1)).
  //
  // The elements in our complex number array contain two properties: `real` and
  // `imag`. If we are to refer back to our original complex number expression,
  // `real` would represent the a term, and `imag` will represent the
  // real number coefficient of the ib term, b.
  var data = new complex_array.ComplexArray(samples)

  // The audio data that is coming in.
  var inbuf = e.inputBuffer.getChannelData(0)
  
  // The place to write our audio data.
  var outbuf = e.outputBuffer.getChannelData(0)

  // Initialize our complex numbers array with PCM data.
  data.map(function (value, i, n) {
    value.real = inbuf[i]
  })

  // Transform the PCM data into a set of complex numbers that will encode the
  // harmonics data.
  data.FFT()

  // Now, loop through each complex number, and cut out all the frequencies that
  // are the value indicated by our knob.
  data.map(function (value, i, n) {

    // **This is where you had to fill in the blank**

    if (((i+1)/n)*100 > window.knobValue) {
      // If we are to look back at the original algorithm on how to extract
      // amplitudes, we see that we are applying pythagorean theorem.
      //
      // And so, by pythagorean theorem, if all terms inside the square root
      // is 0, then the entire square root is 0.
      //
      // And so, set the real term and the coefficient of the imaginary term
      // to 0, and the amplitude will thus result in 0.
      value.real *= 0
      value.imag *= 0
    }
  })

  // Now convert the harmonics encoding back into PCM.
  data.InvFFT()

  // Write out the resulting PCM into the output.
  data.forEach(function (value, i, n) {
    outbuf[i] = value.real
  })
}

////////////////////////////////////////////////////////////////////////////////

// Below is all the regular stuff regarding loading audio files.

var req = new XMLHttpRequest(); 
req.open("GET","../workshop-6/Hustle.mp3",true)
//the data will be loaded as an array buffer
req.responseType = "arraybuffer"
req.onload = function() {
  //use the audioContext object to decode the response as audio
  audioContext.decodeAudioData(req.response, function(data) {
    buffer = data
    //create a source node from the buffer 
    var src = audioContext.createBufferSource()
    src.buffer = buffer
    src.connect(lpfilter)
    lpfilter.connect(audioContext.destination)
    src.start()
  });
};
req.send();