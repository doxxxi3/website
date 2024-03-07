// Import necessary modules from the Three.js library
//This is a different way to import three.js library, if you are not familiar with this, find/email Zhiyang, find a time to figure it out

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Create a new Three.js scene
const scene = new THREE.Scene();

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

//giving an ID to the canvas
let canvas = renderer.domElement;
canvas.id = "threeCanvas";
// Add the renderer's canvas element to the DOM
document.body.appendChild(canvas);

// Create a new GLTFLoader instance to load the 3D model
const loader = new GLTFLoader();

// Add ambient light to the scene (soft white light)
const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

const geometry = new THREE.SphereGeometry(1000, 40, 60);
geometry.scale(-1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const Mesh = new THREE.Mesh(geometry, material);
scene.add(Mesh);

// Load a GLTF model (a duck in this case)
// in cargo use url instead of local file path
loader.load("./icon/Logo_Anim.gltf", function (gltf) {
  console.log("loaded duck", gltf.scene);
  // Scale and position the model
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.y = 10;
  // Add the loaded model to the scene
  scene.add(gltf.scene);
  console.log("loaded duck");
});

// Create OrbitControls to allow interactive control over camera's viewpoint
const controls = new OrbitControls(camera, renderer.domElement);

// Set the camera's position
camera.position.set(5, 30, 30);
Mesh.position.set(
  camera.position.x,
  camera.position.y,
  camera.position.z - 100
);
// Update the controls
controls.update();

// Define the animate function to continuously render the scene
function animate() {
  requestAnimationFrame(animate);
  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Call the animate function
animate();
