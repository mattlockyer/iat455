/*
 * Represents a lamp that emits light.
 */
function Lamp( scene ) {
  var self = this;

  // This represents the hue value of the emitting light
  this.hue = 0;

  // The properties that will give us dynamic controls to the lamp.
  var properties = {
    lightRelativeRotationY: 0,
    lightXZMagnitude: 1.25,
    lightY       : 4,
    targetX      : 0,
    targetY      : 0,
    targetZ      : 1.75,
    lampX        : -3,
    lampY        : 0,
    lampZ        : 0,
    lampRotationY: 71,
    angle        : 314/2,
    lightSourceVisible: false,
    targetMeshVisible: false
  };

  // The sphere that represents where the originating spotlight is located.
  var geometry = new THREE.SphereGeometry( 0.25, 16, 16 );
  var material = new THREE.MeshBasicMaterial( {
    color: 0xFFFFFF
  } );
  var sourceMesh = new THREE.Mesh( geometry, material );
  scene.add( sourceMesh );

  // The sphere that represents to where the spotlight is going to direct to.
  var geometry = new THREE.SphereGeometry( 0.25, 16, 16 );
  var material = new THREE.MeshBasicMaterial( {
    color: 0xFFFFFF
  } );
  var targetMesh = new THREE.Mesh( geometry, material );
  scene.add( targetMesh );

  // Our lamp post.
  var loader = new THREE.JSONLoader();
  loader.load( '/assets/desk_lamp1.json', function ( geometry, material ) {
    var material = new THREE.MeshPhongMaterial( {
      color: 0xFFFFFF
    } );
    var mesh = self.lampMesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    self.lampMesh.position.x = properties.lampX;
    self.lampMesh.position.y = properties.lampY;
    self.lampMesh.position.z = properties.lampZ;
    self.lampMesh.rotation.y = properties.lampRotationY/100;
  } );

  // The actual spotlight that will affect the material on other meshes.
  this.lampLight = new THREE.SpotLight( 0xFFFFFF );
  this.lampLight.castShadow = true;
  // this.lampLight.shadowCameraVisible = true;
  this.lampLight.shadowCameraNear  = 0.01;
  this.lampLight.shadowCameraFar  = 8;
  this.lampLight.shadowCameraFov = 89;
  scene.add( this.lampLight );

  var theta = (properties.lightRelativeRotationY + properties.lampRotationY)/100;
  var magnitude = properties.lightXZMagnitude;

  sourceMesh.visible = properties.lightSourceVisible;
  targetMesh.visible = properties.targetMeshVisible;

  sourceMesh.position.x = Math.sin( theta ) * magnitude + properties.lampX;
  sourceMesh.position.y = properties.lightY + properties.lampY;
  sourceMesh.position.z = Math.cos( theta ) * magnitude + properties.lampZ;

  targetMesh.position.x = properties.targetX;
  targetMesh.position.y = properties.targetY;
  targetMesh.position.z = properties.targetZ;

  this.lampLight.position.copy( sourceMesh.position );
  this.lampLight.angle = properties.angle/100;

  this.lampLight.target.position.copy( targetMesh.position );
  this.lampLight.target.updateMatrixWorld();
};

/*
 * Updates the light's hue and "lightness", based on the inputed decibel value.
 */
Lamp.prototype.setDecibel = function ( db ) {
  this.hue += (db / (255*255)); this.hue %= 1;
  this.lampLight.color.setHSL( this.hue, 1, 1 - (db/255)/1.5 );
}
