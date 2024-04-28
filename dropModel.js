// Import necessary modules from the Three.js library
//This is a different way to import three.js library, if you are not familiar with this, find/email Zhiyang, find a time to figure it out

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Create a new Three.js scene
const scene = new THREE.Scene();

var cube, draughts, mouse, raycaster;
var reefs = [];
var reefsMaterial = [];

mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

// Create a camera with a perspective view
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create a WebGL renderer for the scene and set its size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

//giving an ID to the canvas
let canvas = renderer.domElement;
canvas.id = "threeCanvas";
// Add the renderer's canvas element to the DOM
document.body.appendChild(canvas);

// Create a new GLTFLoader instance to load the 3D model
const loader = new GLTFLoader();

// Add ambient light to the scene (soft white light)
// const light = new THREE.AmbientLight(0xffffff, 4);
// scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 100, 0);
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const geometry = new THREE.SphereGeometry(500, 32, 32);
geometry.scale(-1, 1, 1);

function init3d() {
  const geometryyy = new THREE.BoxGeometry(50, 0.2, 50);
  let base_texture = new THREE.TextureLoader().load("water.jpg");
  const materialll = new THREE.MeshBasicMaterial({ map: base_texture });

  cube = new THREE.Mesh(geometryyy, materialll);
  cube.position.x = 0;
  cube.position.y = 5;
  scene.add(cube);

  let bgGeometery = new THREE.SphereGeometry(400, 200, 40);
  // let bgGeometery = new THREE.CylinderGeometry(725, 725, 1000, 10, 10, true)
  bgGeometery.scale(-1, 1, 1);
  // has to be power of 2 like (4096 x 2048) or(8192x4096).  i think it goes upside down because texture is not right size
  let panotexture = new THREE.TextureLoader().load("underwater.jpg");
  // var material = new THREE.MeshBasicMaterial({ map: panotexture, transparent: true,   alphaTest: 0.02,opacity: 0.3});
  let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });

  let back = new THREE.Mesh(bgGeometery, backMaterial);
  scene.add(back);
}

// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const Mesh = new THREE.Mesh(geometry, material);
// scene.add(Mesh);

// Load a GLTF model (a duck in this case)
// in cargo use url instead of local file path
loader.load("./reef/reef2.gltf", function (gltf) {
  console.log("loaded duck", gltf.scene);
  const reef = gltf.scene;
  // Scale and position the model
  reef.scale.set(10, 10, 10);
  reef.position.y = 0;
  reef.position.x = -13;
  reef.position.z = 15;
  reef.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true; // Optional: enable shadow receiving
      reefs.push(child);
      reefsMaterial.push(child.material);
    }
  });
  // Add the loaded model to the scene
  scene.add(gltf.scene);
  console.log("loaded duck");
});

// Create OrbitControls to allow interactive control over camera's viewpoint
const controls = new OrbitControls(camera, renderer.domElement);

// Set the camera's position
camera.position.set(5, 30, 30);
// Mesh.position.set(
//   camera.position.x,
//   camera.position.y,
//   camera.position.z - 100
// );
// Update the controls
controls.update();

function hoverModel() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(reefs, true);
  reefs.forEach((reef) => {
    reef.material.color.set(0xffffff);
  });
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xff0000);
  }

  //   tooltip.textContent = "Model Information: " + intersectedObject.reef; // Customize this text
  //   tooltip.style.display = "block";
  //   tooltip.style.left = event.clientX + 15 + "px";
  //   tooltip.style.top = event.clientY + 15 + "px";
}
// Define the animate function to continuously render the scene
function animate() {
  requestAnimationFrame(animate);
  hoverModel();
  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

function createPanoVideo(filename) {
  let geometry = new THREE.SphereGeometry(1000, 60, 40);
  //var geometry = new THREE.SphereBufferGeometry(1000, 60, 40);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1);
  let videoElement = document.createElement("video");
  videoElement.crossOrigin = "anonymous";
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.src = filename;
  videoElement.setAttribute("webkit-playsinline", "webkit-playsinline");
  videoElement.play();
  let videoTexture = new THREE.VideoTexture(videoElement);
  var material = new THREE.MeshBasicMaterial({ map: videoTexture });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (document.getElementById("tooltip").style.display !== "none") {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.left = event.clientX + 15 + "px";
    tooltip.style.top = event.clientY + 15 + "px";
  }
}
window.addEventListener("mousemove", onMouseMove, false);

// Call the animate function
init3d();
animate();
