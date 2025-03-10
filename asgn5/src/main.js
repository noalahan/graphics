import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

let renderer;
let camera;
let scene;
let loader;

let materials;
let cubes;
let planeTexture;
main();
function main() {
  // set up
  sceneSetup();
  lighting();

  // create objects
  shapes();
  // objectLoaders();

  // render
  requestAnimationFrame(render);
}

/**
 * Sets up canvas, renderer, camera, and scene
 */
function sceneSetup() {
  let w = window.innerWidth;
  let h = window.innerHeight * 0.7;
  // set up canvas
  const canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true,
    antialias: true,
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);

  // set up camera
  const fov = 75;
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
  // hemisphere light (ambient)
  const skyColor = 0xb1e1ff;
  const groundColor = 0xb97a20;
  let intensity = 1;
  const hemLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(hemLight);

  // directional light (from position to target)
  const color = 0xffffff;
  intensity = 2;
  const dirLight = new THREE.DirectionalLight(color, intensity);
  dirLight.position.set(0, 10, 0);
  scene.add(dirLight);
  dirLight.target.position.set(-5, 0, 0);
  scene.add(dirLight.target);

  // point light (from position in all directions)
  intensity = 150;
  const pLight = new THREE.PointLight(color, intensity);
  pLight.position.set(0, 10, 0);
  // scene.add(pLight);

  // spot light
  // intensity = 150;
  // const spotLight = new THREE.SpotLight(color, intensity);
  // spotLight.position.set(0, 10, 0);
  // scene.add(spotLight);
  // spotLight.target.position.set(-5, 0, 0);
  // scene.add(spotLight.target);
}

function shapes() {
  loader = new THREE.TextureLoader();

  {
    // small cubes
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

  {
    // cube
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }

  {
    // sphere
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    );
    const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  {
    // plane

    let planeSize = 40;
    // const loader = new THREE.TextureLoader();
    const planeTexture = loader.load(
      "https://threejs.org/manual/examples/resources/images/checker.png"
    );
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.magFilter = THREE.NearestFilter;
    planeTexture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    planeTexture.repeat.set(repeats, repeats);
    // plane
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: planeTexture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  { // sky box
    const skyLoader = new THREE.CubeTextureLoader();
    const texture = skyLoader.load( [
			'img/sky1.png',
			'img/sky3.png',
			'img/skyTop.png',
			'img/skyBottom.png',
			'img/sky4.png',
			'img/sky2.png',
		] );
		scene.background = texture;
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
