/*
 * Represents the action figure on the desk.
 */
function ActionFigure( scene ) {
  var x = y = z = 0;
  x = 2.5;

  // GLASS CYLINDER

  var urls = [
    '/assets/cubemap/posx.jpg',
    '/assets/cubemap/negx.jpg',
    '/assets/cubemap/posy.jpg',
    '/assets/cubemap/negy.jpg',
    '/assets/cubemap/posz.jpg',
    '/assets/cubemap/negz.jpg'
  ];

  var cubemap = THREE.ImageUtils.loadTextureCube( urls );
  cubemap.format = THREE.RGBFormat;

  var geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16, 1);
  var material = new THREE.MeshPhongMaterial( {
    color: 0xFFFFFF,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.9,
    // This is glass, and so, crank up the shininess
    shininess: 250,
    envMap: cubemap
  } );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = x;
  mesh.position.y = 1;
  scene.add( mesh );

  // GLASS BASE

  var geometry = new THREE.CylinderGeometry(0.55, 0.6, 0.25, 16, 1);
  var material = new THREE.MeshLambertMaterial( {
    // A gray base.
    color: 0xaaaaaa
  } );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = x;
  // Will be both casting and receiving shadow.
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add( mesh );

  // ACTION FIGURE

  var loader = new THREE.JSONLoader();
  loader.load( '/assets/soldier.json', function ( geometry, material ) {
    var material = new THREE.MeshPhongMaterial( {
      map: THREE.ImageUtils.loadTexture( '/assets/TSoldier.jpg' ),
      shininess: 100
    } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.4
    mesh.position.x = x;
    mesh.position.y = 0.125;
    mesh.rotation.y = -0.75;
    // Only cast a shadow.
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    scene.add( mesh );
  } );

  // Do note that we are not having our glass cylinder cast a shadow.
}