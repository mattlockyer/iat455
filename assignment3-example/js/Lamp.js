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
    lampX        : -3,
    lampZ        : 0,
    angle        : 314/2,
    lampRotationY: 0.71
  };

  // Our lamp post.
  var loader = new THREE.JSONLoader();
  loader.load( 'assets/desk_lamp1.json', function ( geometry, material ) {
    var material = new THREE.MeshPhongMaterial( {
      color: 0xFFFFFF
    } );
    var mesh = self.lampMesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    self.lampMesh.position.x = -3;
    self.lampMesh.position.z = properties.lampZ;
    self.lampMesh.rotation.y = properties.lampRotationY;
  } );

  // The actual spotlight that will affect the material on other meshes.
  this.lampLight = new THREE.SpotLight( 0xFFFFFF );
  // this.lampLight.shadowCameraVisible = true;
  this.lampLight.castShadow = true;
  this.lampLight.shadowCameraNear  = 0.01;
  this.lampLight.shadowCameraFar  = 8;
  this.lampLight.shadowCameraFov = 89;
  // this.lampLight.shadowBias = 0.0001;
  scene.add( this.lampLight );

  var theta = (properties.lightRelativeRotationY + properties.lampRotationY)/100;
  var magnitude = properties.lightXZMagnitude;

  this.lampLight.position.x = Math.sin( theta ) * magnitude + properties.lampX + 0.5;
  this.lampLight.position.y = 4;
  this.lampLight.position.z = Math.cos( theta ) * magnitude + properties.lampZ;

  this.lampLight.angle = properties.angle/100;

  this.lampLight.target.position.z = 1.75;
  this.lampLight.target.updateMatrixWorld();
};

/*
 * Updates the light's hue and "lightness", based on the inputed decibel value.
 */
Lamp.prototype.setDecibel = function ( db ) {
  this.hue += (db / (255*255)); this.hue %= 1;
  this.lampLight.color.setHSL( this.hue, 1, 1 - (db/255)/1.5 );
}
