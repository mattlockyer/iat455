var renderer;
var scene;
// Also known as a projection matrix.
//
// [ a11, a12, a13
//   a21, a22, a23
//   a31, a32, a33 ]
var camera;
var cube;

var sceneSky;
var cameraSky;
var sky;

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.autoClear = false;

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );

  camera.position.z = 500;

  cameraSky = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );

  scene = new THREE.Scene();
  sceneSky = new THREE.Scene();

  var cubeGeometry = new THREE.BoxGeometry(200, 200, 200);
  // var material = new THREE.MeshBasicMaterial({
  //   color: 0xFFFFFF,
  //   wireframe: true,
  //   wireframeLinewidth: 2
  // });
  // var material = new THREE.MeshBasicMaterial({
  //   map: THREE.ImageUtils.loadTexture('crate.jpg')
  // });
  var material = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('crate.jpg')
  })
  cube = new THREE.Mesh(cubeGeometry, material);

  scene.add(cube);

  var ambientLight = new THREE.AmbientLight(0x333333);

  scene.add(ambientLight);

  // var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  // directionalLight.position.set(1,1,500);
  // scene.add(directionalLight);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.set(1,1,500);
  scene.add(pointLight);

  var urls = [
    'cubemap/posx.jpg',
    'cubemap/negx.jpg',
    'cubemap/posy.jpg',
    'cubemap/negy.jpg',
    'cubemap/posz.jpg',
    'cubemap/negz.jpg'
  ];

  var textureCube = THREE.ImageUtils.loadTextureCube(urls);
  // I don't know why this needs to be here.
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

  sky = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 1000, 1000),
    material
  );

  sceneSky.add(sky);
}

var lastTime = new Date().getTime();

function animate() {
  requestAnimationFrame(animate);

  var current = new Date().getTime();
  var time = current - lastTime;
  lastTime = current;

  camera.lookAt(scene.position);

  cube.rotation.x += time * 0.001;
  cube.rotation.y += time * 0.001;

  renderer.render(sceneSky, cameraSky);
  renderer.render(scene, camera);
}

init();
animate();