// Herein lies the code to visualize audio, by displaying its
// amplitude-range/frequency-domain data to a canvas element.

// Summary:
//
// 1. initialize a bunch of variables to hold some preliminary information for
//    the animation
// 2. define our animation inside a function, which we will call `animate`
// 3. download the audio file
//     1. run the audio file against the FFT
//     2. have the FFT simply output the sound to our destination output
//         - however, on top of just playing the sound, our FFT object will
//           expose a method, which will populate a fixed-size array with
//           amplitude-range/frequency-domain data.
// 4. animate the bars
//     - the bars' height values will be determined by the amplitude of a given
//       amplitude value
//     - the amplitude values will be in a logarithmic scale

////////////////////////////////////////////////////////////////////////////////

// Below, we are declaring variables, as well as initializing most of them.

// `audioContext` has all the browser's audio stuff in it.
//
// There is absolutely no need to initialize two or more instances of the
// `AudioContext` class. Only one instance *should* (but maybe not always)
// suffice to get all the web audio stuff.
//
// Why do we have to create an entirely new instance of AudioContext to access
// the browser's audio features? Why is the audio features even allocated to a
// separate class? I honestly don't know.
var audioContext = new AudioContext();

// This is our canvas object where we will be drawing the visualization to.
//
// The canvas should have already been initialized when it was declared in the
// `index.html`. Take a look at the line, right under the comment "Our canvas
// here", in `index.html`.
var canvas = document.getElementById('canvas');
canvasContext = canvas.getContext('2d');

// This is our fast fourier transform (FFT). We are not going to be initializing
// this just yet.
//
// More on the initialization below.
var fft;

// This is the chunk size to be sent to our FFT. Remember, always use powers of
// 2! Most fast FFTs work only on sample sizes of powers of 2.
var SAMPLE_SIZE = 256;

// Because most of the output from our FFT is useless, we'll only be grabbing
// the fist third of the amplitude-range/frequency-domain data.
var SAMPLES_TO_READ = (SAMPLE_SIZE/3);

// Our canvas' width and height hard coded here (I hard coded them because I'm
// lazy. If I wasn't being lazy, I would have looked at the DOM element, and
// looked up the width and height from there).
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

// This is the width of a single bar that will be drawn to the screen.
var BAR_WIDTH = CANVAS_WIDTH / SAMPLES_TO_READ;

// This fixed-size array will get populated with
// amplitude-range/frequency-domain data.
var data = new Uint8Array(SAMPLE_SIZE);

///////////////////////////////////////////////////////////////////////////////

// The above was variable declaration. Below is the definition of our animation
// loop. Pretty much similar to the 3D compositing done in workshop 5, except
// it's intended for 2D compositing.

// This is for our visualizer animation. Will be called whenever the browser
// feels like it.
function animate() {
  // This function is the same from the 3D compositing workshop. Email me if you
  // have any questions regarding this.
  requestAnimationFrame(animate);

  // Clear the screen. We're applying a hack here so that there's a nice strobe
  // effect.
  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
  canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Each element of the amplitude-range/frequency-domain data is in a
  // logarithmic scale. Varies from 0 to 255.
  fft.getByteFrequencyData(data);

  // *Right* below the following line, we're going to be drawing rectangles. 
  // Hence, the following line is there to tell the canvas that all shapes that
  // are going to be "filled" are going to have the colour red.
  canvasContext.fillStyle = 'red';

  // Loop through each of the samples from our amplitude-range/frequency-domain
  // data and draw the bars accordingly.
  for (var i = 0; i < SAMPLES_TO_READ; i++) {
    canvasContext.fillRect(
      // This is the x coordinate where the rectangle is going to be drawn.
      i * BAR_WIDTH,
      // This is the y coordinate where the rectangle is going to be drawn.
      500 - data[i] * 1.6,

      // This is the width of our bar.
      BAR_WIDTH,
      // This is the height of our bar.
      100
    );
  }
}

////////////////////////////////////////////////////////////////////////////////

// Above, was the definition of what our animation will be, but not animating it
// just yet. We will be doing that below. But first, some administrative stuff,
// *then*, the gravy train.
//
// We will be downloading an audio file, and then running it against an FFT, and
// then playing that sound, while also getting the
// amplitude-range/frequency-domain PCM data.

// This is the helper object for downloading the MP3 file, and buffering it into
// the browser. For now, it does nothing. We need to define some stuff by either
// calling some of its methods (e.g. req.open, which we'll see below), or by
// setting some of its properties.
var req = new XMLHttpRequest();

// Tell the request object that this is what we want to download (won't
// download, yet. You have to tell it. You'll see how to do that way at the
// bottom of this file).
req.open('GET', '../workshop-6/Hustle.mp3', true);

// We set this property, so that the browser will send us the MP3 data as an
// array of bytes, instead of some other type of object.
req.responseType = 'arraybuffer';

// We're setting the request object's `onload` property to a function. In this
// case, the function is now informally known as a "listener". Listeners are
// called during a specific event. In the following case, the listener will
// be called when our file has loaded.
req.onload = function () {
  // Remember: all code inside *this* function (now--in *this* case--called a
  // listener) will only be called once the MP3 file has beeen downloaded.

  // Once loaded, `req.response` should have been set to the byte array that
  // contains MP3 data.

  // Tell the browser to decode the MP3 data, as PCM data.
  audioContext.decodeAudioData(req.response, function (data) {
    // N.B. we are now in yet another function scope. So not only are we inside
    //      a listener function, we are now inside yet another callback
    //      function, and this one is being called by
    //      `audioContext.decodeAudioData`.

    // The `data` parameter in our function *should* be PCM data that has been
    // decoded from the MP3 response that we got from the server.

    // The way audio works in the browser is very similar to the way audio works
    // in most digital audio workstations (DAW). You *connect* audio nodes
    // together for various purposes, such as adding reverb, delay, phasing,
    // flanging, setting the gain, applying frequency filters, or just
    // outputting directly to the destination output.
    //
    // Below, we are initializing an object called `src`, that will serve as an
    // audio node. Not just any audio node, but the initial input node, that is
    // intended to be sent to the destination output, which is the final stop.
    //
    // However, instead of connecting the `src` object to the destination
    // directly, we are connecting `src` to an intermediary node, which *that*
    // node is going to be connected to either the destination, or yet another
    // intermediary. In our specific case, that intermediary node is going to
    // be connected directly to our destination output.
    //
    // The intermediary node that our `src` object is connecting to is our FFT.
    // Unlike what was mentioned earlier about nodes being audio processors,
    // our FFT is not going to do any form of synthesis, whatsoever. It will
    // simply read the input, and output what it read in.
    //
    // The purpose of the FFT is to not just output what it just read in, but
    // to parse the PCM data, and derive the amplitude-range/frequency-domain
    // data, and store it somewhere so that we can access it later (which we
    // do by calling `fft.getByteFrequencyData`, and we're doing it in our
    // animation loop).

    // Create an audio source, based on our PCM.
    var src = audioContext.createBufferSource();
    src.buffer = data;

    // Initialize our FFT. Tell the FFT what size to expect.
    fft = audioContext.createAnalyser();
    fft.fftSize = SAMPLE_SIZE;

    // Connect the input node (which doubles as the audio source node) to our
    // FFT.
    src.connect(fft);

    // Finally, connect the FFT to our destination output.
    fft.connect(audioContext.destination);

    // Tell the source node to start streaming in the PCM data, and then
    // streaming it out to connecting node.
    //
    // How much PCM samples will be streamed out will depend entirely on how
    // much the connecting node is willing to accept.
    //
    // Actually, the source node isn't even going to stream; it's going to
    // buffer the PCM data into a chunk that is the size of what the connecting
    // node is only willing to accept. Once buffered (which takes an insanely
    // tiny fraction of a second), it will send the buffer out to the connecting
    // node.
    src.start();

    // And last, but not least, start the visualization animation.
    animate();
  });
}

// Finally, tell the request object to download the file that
// we are pending to download.
req.send();