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

// var audio = document.createElement("audio");
// audio.src = "ocean.mp3";
// audio.loop = true;
// audio.autoplay = true;

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
// document.body.appendChild(audio);
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
  const geometryyy = new THREE.BoxGeometry(50, 2, 15);
  let base_texture = new THREE.TextureLoader().load("water.jpg");
  const materialll = new THREE.MeshBasicMaterial({ map: base_texture });

  cube = new THREE.Mesh(geometryyy, materialll);
  cube.position.x = 0;
  cube.position.y = 8;
  cube.position.z = -5;
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

// function hoverModel() {
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(reefs, true);
//   reefs.forEach((reef) => {
//     reef.material.color.set(0xffffff);
//   });
//   if (intersects.length > 0) {
//     intersects[0].object.material.color.set(0xff0000);
//   }

//   //   tooltip.textContent = "Model Information: " + intersectedObject.reef; // Customize this text
//   //   tooltip.style.display = "block";
//   //   tooltip.style.left = event.clientX + 15 + "px";
//   //   tooltip.style.top = event.clientY + 15 + "px";
// }

// function hoverModel() {
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(reefs, true);

//   reefs.forEach((reef) => {
//     reef.material.color.set(0xabf5e0);
//     reef.scale.set(0.1, 0.1, 0.1);
//   });

//   if (intersects.length > 0) {
//     const intersectedObject = intersects[0].object;
//     // Change color to highlight
//     intersectedObject.scale.set(1, 1, 1);
//     const tooltip = document.getElementById("tooltip");
//     // Customize the tooltip text based on the name of the intersected object
//     if (intersectedObject.name === "Cylinder") {
//       tooltip.textContent =
//         "Reefs are often called the rainforests of the sea.";
//       intersectedObject.material.color.set(0x52faf4);
//     } else if (intersectedObject.name === "Circle") {
//       tooltip.textContent =
//         "About 25% of the ocean's fish depend on healthy coral reefs. ";
//       intersectedObject.material.color.set(0x74fa52);
//       // intersectedObject.scale.set(12, 12, 12);
//     } else if (intersectedObject.name === "Circle002") {
//       tooltip.textContent =
//         "Fishes and other organisms shelter, find food, reproduce, and rear their young in the many nooks and crannies formed by corals.";
//       intersectedObject.material.color.set(0xf27dff);
//       // intersectedObject.scale.set(12, 12, 12);
//     }
//     tooltip.style.display = "block";
//     tooltip.style.left = event.clientX + 15 + "px";
//     tooltip.style.top = event.clientY + 15 + "px";
//   } else {
//     // Hide tooltip if no intersections
//     const tooltip = document.getElementById("tooltip");
//     tooltip.style.display = "none";
//   }

function hoverModel() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(reefs, true);

  // Reset all reefs to their original scale
  reefs.forEach((reef) => {
    reef.scale.set(0.2, 0.2, 0.2);
    reef.material.color.set(0xabf5e0);
    // Assuming 1, 1, 1 is the original scale
  });

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    intersectedObject.scale.set(0.15, 0.15, 0.15); // Increase the scale for the hovered object

    if (intersectedObject.name === "Cylinder") {
      intersectedObject.material.color.set(0x52faf4);
      const tooltip = document.getElementById("tooltip");
      tooltip.textContent =
        "Reefs are often called the rainforests of the sea.";
      tooltip.style.display = "block";
    }

    if (intersectedObject.name === "Circle") {
      intersectedObject.material.color.set(0x82e2ff);
      const tooltip = document.getElementById("tooltip");
      tooltip.textContent =
        "About 25% of the ocean's fish depend on healthy coral reefs. ";
      //       intersectedObject.material.color.set(0x74fa52)";
      tooltip.style.display = "block";
    }

    if (intersectedObject.name === "Circle002") {
      intersectedObject.material.color.set(0xf82bff);
      const tooltip = document.getElementById("tooltip");
      tooltip.textContent =
        "Fishes and other organisms shelter, find food, reproduce, and rear their young in the many nooks and crannies formed by corals.";
      tooltip.style.display = "block";
    }

    // Set tooltip text based on the intersected object
  } else {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  }
}

// if (intersects.length > 0) {
//   const intersectedObject = intersects[0].object;
//   intersectedObject.material.color.set(0x9bf2fa);

//   // Set tooltip text based on the intersected object
//   const tooltip = document.getElementById("tooltip");

//   tooltip.textContent = "Model Information: " + intersectedObject.name;
//   tooltip.style.display = "block";
// } else {
//   // Hide tooltip if no intersections
//   const tooltip = document.getElementById("tooltip");
//   tooltip.style.display = "none";
// }
// }

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

// function onMouseMove(event) {
//   // calculate mouse position in normalized device coordinates
//   // (-1 to +1) for both components

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   if (document.getElementById("tooltip").style.display !== "none") {
//     const tooltip = document.getElementById("tooltip");
//     tooltip.style.left = event.clientX + 15 + "px";
//     tooltip.style.top = event.clientY + 15 + "px";
//   }
// }
// window.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {
  // Update mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update tooltip position
  const tooltip = document.getElementById("tooltip");
  if (tooltip.style.display !== "none") {
    tooltip.style.left = event.clientX + 15 + "px";
    tooltip.style.top = event.clientY + 15 + "px";
  }
}
window.addEventListener("mousemove", onMouseMove, false);

// Call the animate function
init3d();
animate();
