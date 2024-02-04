import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

let camera, controls, scene, renderer;
const torusBox = [];



init();
animate();

function init() {

  // console.log(dis.value)
  scene = new THREE.Scene();

  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);


  camera.position.z = parseFloat(slider.value);

  slider.addEventListener('input', function() {
    camera.position.z = parseFloat(this.value);
    // Change the scale of all torus meshes in torusBox
    torusBox.forEach((torusMesh) => {
      const scaleValue = parseFloat(this.value) / 100;
      torusMesh.scale.set(scaleValue, scaleValue, scaleValue);
    });
  });
  


  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
  // renderer.domElement.appendChild(sliderContainer);



  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;
  controls.maxAzimuthAngle = Math.PI / 2;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;

  const gridSizeX = Math.floor(window.innerWidth / (100 + 1));
  const gridSizeY = Math.floor(window.innerHeight / (100 + 1));
  const startX = -(gridSizeX * (100 + 1)) / 2 - 5;
  const startY = -(gridSizeY * (100 + 1)) / 2;

  for (let i = 0; i < gridSizeX; i++) {
    for (let j = 0; j < gridSizeY; j++) {
      const color = new THREE.Color();
      color.setHSL((i / gridSizeX + j / gridSizeY) % 1, 1, 0.6);


      const geometry = new THREE.TorusGeometry(20, 8, 16, 1.5 * i + 3);
      const material = new THREE.MeshToonMaterial({ color: color });
      const torus = new THREE.Mesh(geometry, material);

      // Position each cube in a grid
      torus.position.x = startX + i * (100 + 1); // Add some spacing between cubes
      torus.position.y = startY + j * (100 + 1); // Add some spacing between cubes

      // Add the cube to the scene
      scene.add(torus);

      // Store the cube in an array for later use
      torusBox.push(torus);
      // console.log(torusBox);
    }
  }

  let myLight = new THREE.AmbientLight("0xffffff");
  scene.add(myLight);

  // White directional light at half intensity shining from the top.
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.99);
  scene.add(directionalLight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  torusBox.forEach((cube) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });

  controls.update();

}


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
