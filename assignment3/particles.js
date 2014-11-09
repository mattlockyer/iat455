// Just some constants.
var CAMERA_DISTANCE = 20;
var PARTICLES_COUNT = 1000;

// Our renderer just like in the lab.
var renderer;

// Scene and camera just like in the lab. Unlike in the lab, though, I'm
// declaring "state-specific" information at the top, where as, in the lab, I
// declared and defined them right above the `animate` function, below. It's
// just for code cosmetic reasons, not really anything tecnnical; much more
// easier to read.
var scene;
var camera;
var cameraTheta = 0;

// In the lab, I manually updated the timer. However, now, I just realized that
// THREE.js offers a solution for times, alread. `THREE.Clock` should do the
// trick.
//
// The difference now, the value returned by the `clock` object is scaled down
// by a factor of 1000.
var clock = new THREE.Clock();

// This is our particles' mesh and material information. They get updated in the
// game/business logic, though.
var particles;
var particlesMaterial;
var particlesHue = 0;

function init() {
  var sceneWidth = 20;
  var sceneHeight = 20;
  var leftMost = -(sceneWidth / 2);
  var topMost = -(sceneHeight / 2);

  // RENDERER

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Although, in an email, I mentioned that I'm applying a topic not covered in
  // the lab, BUT THIS IS NOT IT. This is something totally different. However,
  // I highly encourage you to use it anyways. What this does is that when the
  // browser window resizes, so will the canvas. What I had done in the lab,
  // the canvas does not resize when the browser resizes.
  window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );

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

  // PARTICLES

  // Yep, I'm using a geometry. You know, the stuff that comprise our cubes that
  // we used in the lab? Yep, that stuff. But, we're going to use it for our
  // particles.
  //
  // Except, the difference here is that the geometry isn't going to have any
  // edges (information on which vertex is connected to which), and faces
  // (information on which edge/vertex collection is going to be covered by
  // by a material).
  particles = new THREE.Geometry();

  // Remember how I mentioned earlier that we are going to use a geometry to
  // represent particle information? The way we do it is that we treat the
  // vertices of the geometry as particles.
  //
  // The geometry is now informally known as a "point cloud", and it's because
  // the vertices are being semantically treated as points.
  //
  // The material that we are initializing, below, is encoding information on
  // how to draw these points.
  //
  // Why we use a geometry, and not define each points individually? All I can
  // say is that it's much faster.
  //
  // Unfortunately, I can't go into the details, because I simply don't know.
  // Maybe read up on it if you're interested.
  particlesMaterial = new THREE.PointCloudMaterial( {
    // Initialize the colour as black.
    color: 0,
    // The size scale of our particles.
    size: 1,
    // The texture to use for our particles.
    map: THREE.ImageUtils.loadTexture(
      'texture/spark.png'
    ),
    // Indicate to the graphics engine that we *want* to perform some form of
    // blending
    transparent: true,
    // What blending to apply. Here, we're using additive.
    blending: THREE.AdditiveBlending,
    // Indicate that the z-depth of our particles *matter*.
    //
    // If you are not using any blending, uncomment the following line:
    //depthWrite: true,
  } );

  // Add the particles to our geometry. Remember, the vertices in our geometry
  // *represent* our particles. And so, we push a new three-dimensional vector
  // (or, more formally, triple) to our geometry's vertices array.
  for (var i = 0; i < PARTICLES_COUNT; i++) {

    // The 3D coordinates of our particle. They will be placed randomly in our
    // scene, along with some additional arithmetic to ensure that it's within
    // our camera's viewpoint.
    var x = Math.random() * sceneWidth*2 + leftMost*2;
    var y = Math.random() * 100 * 2;
    var z = Math.random() * sceneHeight*2 + topMost*2;

    // Create our triple (3D vector).
    var vertex = new THREE.Vector3(x, y, z);

    // Push it to our geometry's vertices array.
    particles.vertices.push( vertex );

  }

  // Initialize our mesh from our geometry and material.
  var pointCloud = new THREE.PointCloud( particles, particlesMaterial );
  // Indicate that the z-depth of our particles *matter*.
  //
  // If you are nt using any blending, uncomment the following line:
  //pointCloud.sortParticles = true;

  // Add our mesh (point cloud) to the scene.
  scene.add( pointCloud );
}

function animate() {
  requestAnimationFrame( animate );

  // Remember, from the declaration and the definition of the `clock` object
  // at the top of this file: we are going to use this object to get the time
  // difference.
  var time = clock.getDelta();

  // The rate in which to update the camera position and rotation around the
  // center.
  cameraTheta += time/4;

  // Position the camera.
  camera.position.x = Math.sin(cameraTheta)*CAMERA_DISTANCE;
  camera.position.z = Math.cos(cameraTheta)*CAMERA_DISTANCE;

  // Have the camera look at the centre.
  camera.lookAt( scene.position );

  // Update the particle's hue (not necessary for *all* use cases. I'm just
  // doing it here for aesthetic reasons on the final result, and also to
  // demonstrate *how* to change the colours of particles. Again, not necessary
  // if you don't want to. It's just a demonstration)
  particlesHue = (particlesHue + time/4)%1;

  // Turns out, unlike what I mentioned in class, there's an even easier way to
  // update colours: use three.js' internal functions. setHSL is one of them.
  particlesMaterial.color.setHSL( particlesHue, 1, 2 );

  // Now, update the y-position of the particles.
  for (var i = 0; i < particles.vertices.length; i++) {
    particles.vertices[i].y += time;
    particles.vertices[i].y %= 100;
  }

  // Remember: our particles are encoded inside a geometry. The graphics engine
  // absolutely needs to be notified that our geometry has changed, internally,
  // and so, we are doing that here, by setting the geometry's
  // `verticesNeedUpdate` property to `true`
  particles.verticesNeedUpdate = true;

  // Finally, render our scene.
  renderer.render( scene, camera );
}

init();
animate();
