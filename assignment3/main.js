// The grid's width and height.
var GRID_W = 20;
var GRID_H = 20;
var GRID_PADDING = 2;
var CAMERA_DISTANCE = 20;
var SAMPLE_SIZE = 128;
var SAMPLES_TO_READ = SAMPLE_SIZE / 3;
var LIGHTS_COUNT = 10;
var PARTICLES_COUNT = 1000;

var BOX_DIMENSION = 0.5;

// var stats;

var renderer;

var scene;
var camera;
var cameraTheta = 0;
var clock = new THREE.Clock();

var particles;
var particlesMaterial;

var bars;
var barHeights = Array( GRID_W * GRID_H )
  .join( ' ' )
  .split( ' ' )
  .map( function () {
    return 0
  } );

var lights = [];
var ambientLight;
var ambientLightHue = 0;

var audioContext = new AudioContext();
var spectrum = new Uint8Array(SAMPLE_SIZE);
var fft = audioContext.createAnalyser();
fft.fftSize = SAMPLE_SIZE;

function init() {
  var gridWidth = (GRID_W * BOX_DIMENSION * GRID_PADDING - BOX_DIMENSION);
  var gridHeight = (GRID_H * BOX_DIMENSION * GRID_PADDING - BOX_DIMENSION);
  var leftMost = -(gridWidth / 2);
  var topMost = -(gridHeight / 2);

  // RENDERER

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );

  // STATISTICS

  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0';
  // stats.domElement.style.zIndex = 100;
  // document.body.appendChild( stats.domElement );

  // SCENE

  scene = new THREE.Scene();

  // CAMERA

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );

  camera.position.z = -100;
  camera.position.y = CAMERA_DISTANCE;

  // GRID

  bars = Array( GRID_W * GRID_H )
    .join( ' ' )
    .split( ' ' )
    .map( function (str, i) {
      var geometry = new THREE.BoxGeometry( BOX_DIMENSION, 1, BOX_DIMENSION );
      var material = new THREE.MeshPhongMaterial( {
        color: 0xFFFFFF
      } );
      var mesh = new THREE.Mesh( geometry, material );

      var col = Math.floor(i / GRID_W);
      var row = i % GRID_W;

      mesh.position.x = col * BOX_DIMENSION * GRID_PADDING + leftMost;
      mesh.position.z = row * BOX_DIMENSION * GRID_PADDING + topMost;
      // console.log(mesh.position);
      // mesh.scale.y = 500 * (i / barHeights.length)

      return mesh;
    } );
  bars
    .forEach( function (mesh) {
      scene.add( mesh );
    } );

  // AMBIENT LIGHT

  ambientLight = new THREE.AmbientLight( 0 );
  scene.add( ambientLight );

  // POINT LIGHT

  for (var i = 0; i < LIGHTS_COUNT; i++) {
    var colour = new THREE.Color();
    colour.setHSL(i/LIGHTS_COUNT, 1, 0.5);
    var light = new THREE.PointLight(colour.getHex(), 1.5, 20);
    light.position.x = -gridWidth;
    light.position.y = 20;
    light.position.z = -gridWidth + ((i * gridWidth)/LIGHTS_COUNT) + 10;
    // light.position.z = topMost;
    lights.push(light);
    scene.add(light);
  }

  // PARTICLES

  particles = new THREE.Geometry();
  particlesMaterial = new THREE.PointCloudMaterial( {
    color: 0,
    size: 1,
    map: THREE.ImageUtils.loadTexture(
      'texture/spark.png'
    ),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: true,
    alphaTest: 0.5
  } );

  for (var i = 0; i < PARTICLES_COUNT; i++) {
    var x = Math.random() * gridWidth + leftMost;
    var y = Math.random() * 100 * 2;
    var z = Math.random() * gridHeight + topMost;
    var vertex = new THREE.Vector3(x, y, z);
    particles.vertices.push( vertex );
  }

  var pointCloud = new THREE.PointCloud( particles, particlesMaterial );
  pointCloud.sortParticles = true;

  scene.add( pointCloud );

  // AUDIO

  var req = new XMLHttpRequest();
  req.open('GET', 'audio/track.mp3', true);
  req.responseType = 'arraybuffer';
  req.onload = function () {
    audioContext.decodeAudioData( req.response, function (data) {
      var src = audioContext.createBufferSource();
      src.buffer = data;
      src.connect(fft);
      fft.connect(audioContext.destination);
      src.start();
    } );
  };
  req.send();
}

function animate() {
  requestAnimationFrame( animate );

  var time = clock.getDelta();

  fft.getByteFrequencyData(spectrum);

  for (var i = bars.length - 1; i >= 0; i--) {
    var col = i % GRID_W;
    var row = Math.floor(i / GRID_W);
    if (row === 0) {
      barHeights[i] = spectrum[Math.floor((i/GRID_W)*SAMPLES_TO_READ)]/32 + 1;
    } else {
      barHeights[i] = barHeights[col + ((row - 1) * GRID_W)];
    }
    bars[i].scale.y = barHeights[i];
    bars[i].position.y = barHeights[i]/2 - 0.5;
  }

  for (var i = 0; i < lights.length; i++) {
    var index = Math.floor((i/lights.length)*SAMPLES_TO_READ);
    lights[i].distance = spectrum[index]/8 + 1;
  }

  var sum = 0;
  for (var i = 0; i < SAMPLES_TO_READ; i++) {
    sum += spectrum[i]
  }
  sum /= spectrum.length * 255;

  ambientLightHue += sum/50; ambientLightHue %= 1;
  ambientLight.color.setHSL(ambientLightHue, 1, sum/4);

  cameraTheta += time/4;

  camera.position.x = Math.sin(cameraTheta)*CAMERA_DISTANCE;
  camera.position.z = Math.cos(cameraTheta)*CAMERA_DISTANCE;

  camera.lookAt( scene.position );

  particlesMaterial.color.setHSL(ambientLightHue, 1, sum*2);
  for (var i = 0; i < particles.vertices.length; i++) {
    particles.vertices[i].y += time*sum*25;
    particles.vertices[i].y %= 100;
  }

  particles.verticesNeedUpdate = true;

  renderer.render( scene, camera );
  // stats.update();
}

init();
animate();
