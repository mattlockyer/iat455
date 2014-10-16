// This is our projection matrix.
var camera;

// This is where all mesh will be stored.
var scene;

// Should we use canvas? WebGL? SVG? DOM+CSS? This object determines that.
var renderer;

// This will be our cube object. Typically, "geometry" will represent an array
// of vertices, and its connections (in other words, their edges).
var geometry;

// This is where we will be representing the "texture" used on our cube.
// (material does not always imply that it will represent a texture. It can
// also represent the ways to represent vertices and edges.)
var material;

// This is where we convert the vertex and material data into a mesh that we
// will draw onto our scene.
var mesh;

// Considering this is JavaScript, the code inside this `init` function really
// does not need to be in here. However, it allows us to keep our code clean so
// whatever.
function init() {

  // Initialize our renderer.
  renderer = new THREE.WebGLRenderer();
  // If things hit the fan, then comment out the above line, and uncomment the
  // following:
  //
  //renderer = new THREE.CanvasRenderer();

  // Set the size of our renderer (pretty much a DOM element with width and
  // height style properties set to the current window size).
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );

  // Initialize our object that will represent a projection matrix.
  camera = new THREE.PerspectiveCamera(
    // The angle in degrees that will represent the perspective. The wider the
    // angle, the more we achieve a fish-eye view. The narrower, we go closer
    // to a telescope.
    75,
    // The aspect ratio. This is crucial. It will determine how to project a
    // square on our scene. We get the aspect ratio wrong, then the square will
    // apear more like a rectangle.
    window.innerWidth / window.innerHeight,
    // This determines how close an object needs to be in order to "disappear".
    1,
    // This determines how far an object needs to be in order to "disappear".
    1000
  );

  // The position of the camera in our scene.
  camera.position.z = 500;

  // Initialize a scene to draw to.
  scene = new THREE.Scene();

  // This is our list of vertices (not-really) that will represent a cube.
  geometry = new THREE.BoxGeometry(200, 200, 200);

  // Determine how our mesh is going to be drawn.
  material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true,
    wireframeLinewidth: 2
  });

  // Initialize our mesh.
  mesh = new THREE.Mesh(geometry, material);

  // Add our mesh.
  scene.add(mesh);
}

// This is where our draw loop happens.
//
// In a non-JavaScript world, the draw loop and "game" happen asynchronously;
// but considering how this is JavaScript, and that all synchronous code is
// blocking (even asynchronous ones!), they are therefore intertwined.
function animate() {

  // `requestAnimationFrame` calls a function only when it's appropriate. Here,
  // we're asking `requestAnimationFrame` to call `animate`. This allows us to
  // run our game loop.
  requestAnimationFrame( animate );

  // Here is our animation.
  mesh.rotation.x = Date.now() * 0.0005;
  mesh.rotation.y = Date.now() * 0.001;

  // Render the scene.
  renderer.render(scene, camera);

}

init();
animate();
