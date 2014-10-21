var renderer;
var scene;
var camera;
var sceneSky;
var cameraSky;

// This is our model.
var cube;

// This is where our sky data is in.
var sky;

var time = new Date().getTime();

// These are the theta values that will be used to get the camera moving in
// circles
var cameraPositionHorizontalTheta = 0;
var cameraPositionVerticalTheta = 0;

// The mouse coordinates.
var mouse = {
  down: false,
  x: 0,
  y: 0,
  previousX: 0,
  previousY: 0
}

function init() {
  renderer = new THREE.WebGLRenderer();
  // renderer = new THREE.CanvasRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );

  cameraSky = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );

  camera.position.z = 500;

  scene = new THREE.Scene();
  sceneSky = new THREE.Scene();

  var geometry = new THREE.BoxGeometry(200, 200, 200);

  var material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('crate.jpg')
  });

  cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  var ambientLight = new THREE.AmbientLight(0x333333);

  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(1, 1, 250).normalize();
  scene.add(directionalLight);

  var urls = [
    'cubemap/posx.jpg',
    'cubemap/negx.jpg',
    'cubemap/posy.jpg',
    'cubemap/negy.jpg',
    'cubemap/posz.jpg',
    'cubemap/negz.jpg'
  ];

  var textureCube = THREE.ImageUtils.loadTextureCube(urls);
  // I honestly don't know what's this about.
  textureCube.format = THREE.RGBFormat;

  var shader = THREE.ShaderLib['cube'];
  shader.uniforms['tCube'].value = textureCube;

  var material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });

  sky = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
  sceneSky.add(sky);

  handleMouse();
}

// A helper function to set up listeners in order to handle mouse events.
function handleMouse() {
  document.body.onmousedown = function(evt) { 
    mouse.down = true;
  };
  document.body.onmouseup = function() {
    mouse.down = false;
  };
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  renderer.domElement.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(this, evt);
    mouse.previousX = mouse.x;
    mouse.previousY = mouse.y;
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
  }, false);
}

function animate() {
  var timeDifference = new Date().getTime() - time;
  time = new Date().getTime();

  // cameraPositionTheta += 0.003;

  cube.rotation.x += timeDifference * 0.0005;
  cube.rotation.y += timeDifference * 0.001;

  if (mouse.down) {
    cameraPositionHorizontalTheta -= (mouse.x - mouse.previousX) * 0.01;
    cameraPositionVerticalTheta += (mouse.y - mouse.previousY) * 0.01;
    if (cameraPositionVerticalTheta > Math.PI/2) {
      cameraPositionVerticalTheta = Math.PI/2
    } else if (cameraPositionVerticalTheta < -Math.PI/2) {
      cameraPositionVerticalTheta = -Math.PI/2
    }
  }
  mouse.previousX = mouse.x;
  mouse.previousY = mouse.y;

  camera.position.x =
    Math.sin(cameraPositionHorizontalTheta)*
    500*
    Math.cos(cameraPositionVerticalTheta);
  camera.position.y = Math.sin(cameraPositionVerticalTheta)*500;
  camera.position.z =
    Math.cos(cameraPositionHorizontalTheta)*
    500*
    Math.cos(cameraPositionVerticalTheta);

  camera.lookAt(scene.position);
  cameraSky.rotation.copy(camera.rotation);

  renderer.render(sceneSky, cameraSky);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

init();
animate();