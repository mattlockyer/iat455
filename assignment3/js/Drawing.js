/*
 * The little drawing that is layn down on the desk.
 */
function Drawing( scene ) {
  var properties = {
    scale: -1.2,
    rotationZ: 31,
    x: -0.25,
    z: 2
  };

  var geometry = new THREE.PlaneGeometry( 8.5, 11 );
  var material = new THREE.MeshPhongMaterial( {
    map: THREE.ImageUtils.loadTexture( '/assets/pencil_drawing.jpg' ),
    bumpMap: THREE.ImageUtils.loadTexture( '/assets/paper-bump.jpg' ),
    // The paper is not going to be bumpy at all. But there will be some
    // bumps, nonetheless.
    bumpScale: 0.30,
    shininess: 1
  } );
  var paper = new THREE.Mesh( geometry, material );
  paper.rotation.x = -Math.PI/2;
  paper.position.y = 0.01;
  paper.castShadow = false;
  paper.receiveShadow = true;
  scene.add( paper );
  
  paper.position.x = properties.x;
  paper.position.z = properties.z;
  paper.rotation.z = properties.rotationZ/100;
  paper.scale.x = paper.scale.y = Math.pow(2, properties.scale);
}