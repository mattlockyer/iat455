/*
 * The little drawing that is layn down on the desk.
 */
function Drawing( scene ) {
  var geometry = new THREE.PlaneBufferGeometry( 8.5, 11 );
  var material = new THREE.MeshPhongMaterial( {
    map: THREE.ImageUtils.loadTexture( 'assets/pencil_drawing.jpg' ),
    bumpMap: THREE.ImageUtils.loadTexture( 'assets/paper-bump.jpg' ),
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
  
  paper.position.x = -0.25;
  paper.position.z = 2;
  paper.rotation.z = 0.31;
  paper.scale.x = paper.scale.y = Math.pow(2, -1.2);
}