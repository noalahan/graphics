import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

let renderer;
let camera;
let scene;
let loadManager;
let loader;

let materials;
let cubes;

main();
function main() {
  // set up
  sceneSetup();
  lighting();

  textureSetup();

  // create objects
  shapes();
  objectLoaders();

  // render
  requestAnimationFrame(render);
}

/**
 * Sets up canvas, renderer, camera, and scene
 */
function sceneSetup() {
  let w = window.innerWidth * 0.8;
  let h = window.innerHeight * 0.3;
  // set up canvas
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);

  // set up camera
  const fov = 90;
  const aspect = w / h;
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  // resize canvas if window size changes
  window.addEventListener("resize", () => {
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // create camera controls
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  // set up scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("skyblue");
}

/**
 * Adds lighting to Scene
 */
function lighting() {
  // create light
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

function textureSetup() {
  loadManager = new THREE.LoadingManager();
  loader = new THREE.TextureLoader();

  // cube
  materials = [
    new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge1.png") }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge2.png") }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge3.png") }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge4.png") }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge5.png") }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge6.png") }),
  ];

  function loadColorTexture(path) {
    const texture = loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}

function shapes() {
  // create box
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];

  function makeInstance(geometry, color, x) {
    // const material = new THREE.MeshPhongMaterial({ color });
    // const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    cube.position.x = x;
    return cube;
  }
}

function objectLoaders() {
  const mtlLoader = new MTLLoader();
  mtlLoader.load("rsc/cottage/cottage_obj.mtl", (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load("rsc/cottage/cottage_obj.obj", (root) => {
      scene.add(root);
    });
  });

  // windmill
  // // const objLoader = new OBJLoader();
  // objLoader.load(
  //   "https://threejs.org/manual/examples/resources/models/windmill/windmill.obj",
  //   (root) => {
  //     scene.add(root);
  //   }
  // );
}

function render(time) {
  time *= 0.001; // convert time to seconds

  // shapes
  {
    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
