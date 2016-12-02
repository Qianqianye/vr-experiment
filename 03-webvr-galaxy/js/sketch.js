
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
var controls = new THREE.VRControls(camera);
controls.standing = true;
controls.standing = true;
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var loader = new THREE.TextureLoader();
loader.load('img/galaxy.jpg', onTextureLoaded);

function onTextureLoaded(texture) {

 var geometry = new THREE.SphereGeometry(50, 200, 200);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
  });

  // Align the skybox to the floor (which is at y=0).
  skybox = new THREE.Mesh(geometry, material);
  skybox.position.y = 50;
  scene.add(skybox);

  setupStage();
}


//VR manager helper to enter and exit VR mode.
var params = {
  hideButton: false, 
  isUndistorted: false 
};
var manager = new WebVRManager(renderer, effect, params);

// Geometry
var vertexHeight = 0.3;
var planeDefinition = 20;
var planeSize = 2
var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeSize, planeSize, planeDefinition, planeDefinition ), new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } ) );
scene.add( plane );
  for (var i = 0; i < plane.geometry.vertices.length; i++) 
   { 
     plane.geometry.vertices[i].z += Math.random()*vertexHeight -vertexHeight; 
   } 

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

var lastRender = 0;

function animate(timestamp) {
  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;
  plane.rotation.x += delta * 0.0006;
  // plane.rotation.z += delta * 0.0006;
  controls.update();
  manager.render(scene, camera, timestamp);
  effect.render(scene, camera);
  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

var vrDisplay;

function setupStage() {
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      if (vrDisplay.stageParameters) {
        setStageDimensions(vrDisplay.stageParameters);
      }
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}

function setStageDimensions(stage) {
   var material = skybox.material;
  scene.remove(skybox);
  var geometry = new THREE.SphereGeometry(50, 200, 200);
  skybox = new THREE.Mesh(geometry, material);
  skybox.position.y =50;
  scene.add(skybox);
  plane.position.set(0, controls.userHeight, 0);
}