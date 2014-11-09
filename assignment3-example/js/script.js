// A power of two sample size to feed to the FFT.
var SAMPLES = 128;
// Not all elements in the resulting amplitude range will represent values
// greater than 0 on most electronic tracks. This constant tells only which
// number of elements to read.
var SAMPLES_TO_READ = Math.floor( SAMPLES / 3 - SAMPLES / 15 );
// The number of balls there's going to be.
var BALLS = 10;

var renderer;

var camera;
var scene;
var mesh;

var cameraTheta = 0;
var cameraParams = {
  cameraOffsetX: 0,
  cameraOffsetY: 0,
  cameraOffsetZ: 1.75,
  cameraDistance: 7,
  cameraY: 74
};

var ambientHue = 0;
var ambientLight;

var lamp;
var drawing;
var actionFigure;
var balls = []

var clock;

var freqDomain = new Uint8Array( SAMPLES );
var audioContext;
var fft;

function init() {
  // RENDERER

  // Tell the renderer to draw shadows, and smoothen out the lines.
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMapType    = THREE.PCFSoftShadowMap;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Listen for window resize events. This allows the canvas to be resized when
  // the window resizes.
  window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );

  // CAMERA

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  camera.position.z = cameraParams.cameraDistance;
  camera.position.y = 10;

  // SCENE

  scene = new THREE.Scene();

  // TABLETOP MODEL

  var geometry = new THREE.PlaneBufferGeometry( 10, 7 );
  var material = new THREE.MeshPhongMaterial( {
    map: THREE.ImageUtils.loadTexture( 'assets/wood.jpg' ),
    bumpMap: THREE.ImageUtils.loadTexture( 'assets/wood-disp.jpg' ),
    bumpScale: 0.02,
    shininess: 100
  } );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.x = -Math.PI / 2;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.position.z = 1.8;
  scene.add( mesh );

  // OUR HELPER CLASSES

  lamp = new Lamp( scene );
  drawing = new Drawing( scene );
  actionFigure = new ActionFigure( scene );

  // AMBIENT LIGHT

  ambientLight = new THREE.AmbientLight( 0x202020 );
  scene.add( ambientLight );

  // THE BOUNCING BALLS

  for (var i = 0; i < BALLS; i++) {
    var ball = new Ball( scene );
    ball.setXZPosition( (i * 1/10)*4 - 2, Math.random()*4 );
    ball.setHue( i * (1/10) );
    balls.push( ball );
  }

  // THE CLOCK

  clock = new THREE.Clock();
  clock.start();

  // AUDIO

  audioContext = new AudioContext();
  fft = audioContext.createAnalyser();
  fft.fftSize = SAMPLES;

  // Get the file.
  var req = new XMLHttpRequest(); 
  req.open( 'GET', 'assets/audio.mp3',true );
  req.responseType = 'arraybuffer';
  req.onload = function() {
    audioContext.decodeAudioData(req.response, function( buffer ) {
      var src = audioContext.createBufferSource();
      src.buffer = buffer;
      src.connect( fft );
      fft.connect( audioContext.destination );
      src.start();
      // setTimeout(function () {
      //   src.stop();
      // }, 4000);
    });
  };
  req.send();
}

var skip = true;

function animate() {
  requestAnimationFrame( animate );

  // skip = !skip;
  // if (skip) { return; }

  // Get the time difference.
  var time = clock.getDelta();

  // The "position" of our camera.
  cameraTheta += time/4;
  var cameraY = cameraParams.cameraY / 100;
  camera.position.x =
    Math.sin( cameraTheta ) *
      Math.cos( cameraY ) *
      cameraParams.cameraDistance +
    cameraParams.cameraOffsetX;
  camera.position.y =
    Math.sin( cameraY ) *
      cameraParams.cameraDistance +
    cameraParams.cameraOffsetY;
  camera.position.z =
    Math.cos( cameraTheta ) *
      Math.cos( cameraY ) *
      cameraParams.cameraDistance +
    cameraParams.cameraOffsetZ;

  // The "lookat" position of our camera.
  var lookAt = new THREE.Vector3();
  lookAt.copy( scene.position );
  lookAt.x += cameraParams.cameraOffsetX;
  lookAt.y += cameraParams.cameraOffsetY;
  lookAt.z += cameraParams.cameraOffsetZ;
  camera.lookAt( lookAt );

  // Get the audio information.
  fft.getByteFrequencyData( freqDomain );

  // Apply the audio information to our bouncing balls, and animate the balls.
  for (var i = 0; i < balls.length; i++) {
    var index = Math.floor( (i / balls.length) * SAMPLES_TO_READ );
    balls[i].setDecibel( freqDomain[ index ] );
    balls[i].animate( time );
  }

  // Get the total volume.
  var sum = 0;
  for (var i = 0; i < SAMPLES_TO_READ; i++) {
    sum += freqDomain[i];
  }
  var db = sum / SAMPLES_TO_READ;

  // Set the overall lighting based on the lighting.

  lamp.setDecibel( db );

  ambientHue += (db / (255*255)); ambientHue %= 1;
  ambientLight.color.setHSL( ambientHue, db/255, 0.1 - (db/255)*0.01 )

  // Render the scene.
  renderer.render( scene, camera );
}

init();
animate();
