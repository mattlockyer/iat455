var BALL_RADIUS = 0.15;
var LIGHT_OFFSET = 0.5;
var LIGHT_MIN_INTENSITY = 5;

/*
 * Represents a ball that animates according to inputed decibel values.
 */
function Ball( scene ) {
  var geometry = new THREE.SphereGeometry( BALL_RADIUS, 16, 16 );
  this.material = new THREE.MeshPhongMaterial({
    color: 0xFF0000,
    shininess: 0.1,
    bumpMap: THREE.ImageUtils.loadTexture( 'assets/ball-map.png' ),
    bumpScale: 0.03
  });
  this.mesh = new THREE.Mesh( geometry, this.material );
  // The ball will cast a shadow.
  this.mesh.castShadow = true;
  this.mesh.receiveShadow = false;
  this.mesh.position.y = BALL_RADIUS;
  this.velocityY = 0;
  this.db = 0;
  this.position = new THREE.Vector3( 0, 0, 0 );
  this.hue = 0;

  scene.add( this.mesh );

  this.light = new THREE.PointLight( 0xFFFFFF, 0, 1 );
  this.light.position.y = BALL_RADIUS + LIGHT_OFFSET;

  scene.add( this.light );
}

/*
 * Sets the ball's position on the x-z plane.
 */
Ball.prototype.setXZPosition = function ( x, z ) {
  this.position.x = x;
  this.position.z = z;
};

/*
 * Sets the ball and light's hue.
 */
Ball.prototype.setHue = function ( h ) {
  this.material.color.setHSL( h, 1, 0.5 );
  this.material.needsUpdate = true;
  this.light.color.setHSL( h, 1, 0.5 );
};

/*
 * Feed the volume into our ball, so that it can bounce accordingly.
 */
Ball.prototype.setDecibel = function ( db ) {
  db = db / 255;
  if ( db > this.db ) {
    this.db = db;
  }
  this.light.intensity = LIGHT_MIN_INTENSITY * db;
};

Ball.prototype.physics = function ( time ) {
  if ( this.mesh.position.y <= BALL_RADIUS ) {
    this.mesh.position.y = BALL_RADIUS;
    if ( this.db * 11 > Math.abs( this.velocityY ) ) {
      this.velocityY = this.db*11;
      this.db = 0;
    } else {
      this.velocityY = -this.velocityY*0.9;
    }
  }
  this.velocityY -= time*30;
  this.mesh.position.y += this.velocityY * time;
  this.light.position.y = this.mesh.position.y + LIGHT_OFFSET;
}

/*
 * Our balls will animate.
 */
Ball.prototype.animate = function ( time ) {
  this.mesh.position.x = this.position.x;
  this.mesh.position.z = this.position.z;
  this.light.position.x = this.position.x;
  this.light.position.z = this.position.z;

  // The following is to handle cases when framerate drops immensly.
  //
  // Stolen from http://gafferongames.com/game-physics/fix-your-timestep/

  var frameTime = time;

  while ( frameTime > 0 ) {
    var deltaTime = Math.min( frameTime, 1/60 );
    this.physics( deltaTime );
    frameTime -= deltaTime;
  }
};
