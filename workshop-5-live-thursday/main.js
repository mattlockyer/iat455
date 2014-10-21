var renderer;
var scene;
var camera;
var sceneSky;
var cameraSky;

// This is our model.
var cube;

// This is where our sky data is in.
var sky;

var cameraPositionHorizontalTheta = 0;
var cameraPositionVerticalTheta = 0;

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

  // Tells our scene to draw the cube as lines.
  // var material = new THREE.MeshBasicMaterial({
  //   color: 0xFFFFFF,
  //   wireframe: true,
  //   wireframeLinewidth: 2
  // });

  // var material = new THREE.MeshBasicMaterial({
  //   map: THREE.ImageUtils.loadTexture('./crate.jpg')
  // });

  var material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('crate.jpg'),
    opacity: 1,
    // transparent: true,
    // blending: THREE.MultiplyBlending
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
}

var time = new Date().getTime();
var cameraPositionTheta = 0;

function animate() {
  var timeDifference = new Date().getTime() - time;
  time = new Date().getTime();

  cameraPositionTheta += timeDifference * 0.0003;

  cube.rotation.x += timeDifference * 0.0005;
  cube.rotation.y += timeDifference * 0.0005;

  camera.position.x = Math.cos(cameraPositionTheta)*500;
  camera.position.z = Math.sin(cameraPositionTheta)*500;

  camera.lookAt(scene.position);
  cameraSky.rotation.copy(camera.rotation);

  renderer.render(sceneSky, cameraSky);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

init();
animate();