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
main();
function main() {
  // set up
  sceneSetup();
  lighting();

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
  let w = window.innerWidth;
  let h = window.innerHeight;
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
  camera.position.set(5, 30, 5);

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
  controls.target.set(0, 20, -10);
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
  dirLight.position.set(0, 10, 5);
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

  // {
  //   // small cubes
  //   materials = [
  //     new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge1.png") }),
  //     new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge2.png") }),
  //     new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge3.png") }),
  //     new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge4.png") }),
  //     new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge5.png") }),
  //     new THREE.MeshBasicMaterial({ map: loadColorTexture("img/hedge6.png") }),
  //   ];
  //   function loadColorTexture(path) {
  //     const texture = loader.load(path);
  //     texture.colorSpace = THREE.SRGBColorSpace;
  //     return texture;
  //   }

  //   // create box
  //   const boxWidth = 1;
  //   const boxHeight = 1;
  //   const boxDepth = 1;
  //   const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  //   cubes = [
  //     makeInstance(geometry, 0x44aa88, 0),
  //     makeInstance(geometry, 0x8844aa, -2),
  //     makeInstance(geometry, 0xaa8844, 2),
  //   ];
  //   function makeInstance(geometry, color, x) {
  //     // const material = new THREE.MeshPhongMaterial({ color });
  //     // const material = new THREE.MeshBasicMaterial({ map: texture });
  //     const cube = new THREE.Mesh(geometry, materials);
  //     scene.add(cube);
  //     cube.position.x = x;
  //     return cube;
  //   }
  // }

  {
    // bedroom

    // floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(19, 1, 3.2), // size
      new THREE.MeshPhongMaterial({ color: "#FFE882" }) // color
    );
    floor.position.set(0, 20, -15);
    scene.add(floor);

    // bed base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(7, 1, 3.2), // size
      new THREE.MeshPhongMaterial({ color: "#8A2A01" }) // color
    );
    base.position.set(0, 21, -15);
    scene.add(base);
    // bed
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(5, 1, 3), // size
      new THREE.MeshPhongMaterial({ color: "#F0F6F6" }) // color
    );
    bed.position.set(0, 22, -15);
    scene.add(bed);
    // blanket
    const blanket = new THREE.Mesh(
      new THREE.BoxGeometry(4, 1.2, 3.1), // size
      new THREE.MeshPhongMaterial({ color: "#9DDDE3" }) // color
    );
    blanket.position.set(1, 22, -15);
    scene.add(blanket);
    // pillow
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.2, 1.8), // size
      new THREE.MeshPhongMaterial({ color: "#9DDDE3" }) // color
    );
    pillow.position.set(-1.8, 22.6, -15);
    scene.add(pillow);

    // sconces
    const left = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 10, 10),
      new THREE.MeshPhongMaterial({ color: "#FFF" })
    );
    left.position.set(-4.6, 23.3, -15);
    scene.add(left);
    const right = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 10, 10),
      new THREE.MeshPhongMaterial({ color: "#FFF" })
    );
    right.position.set(4.6, 23.3, -15);
    scene.add(right);
    // bases
    const leftBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1, 2),
      new THREE.MeshPhongMaterial({ color: "#D6800F" })
    );
    leftBase.position.set(-4.6, 22.9, -16);
    scene.add(leftBase);
    const rightBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1, 2),
      new THREE.MeshPhongMaterial({ color: "#D6800F" })
    );
    rightBase.position.set(4.6, 22.9, -16);
    scene.add(rightBase);

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

  {
    // sky box
    const skyLoader = new THREE.CubeTextureLoader();
    const texture = skyLoader.load([
      "img/sky1.png",
      "img/sky3.png",
      "img/skyTop.png",
      "img/skyBottom.png",
      "img/sky4.png",
      "img/sky2.png",
    ]);
    scene.background = texture;
  }
}

function objectLoaders() {
  // doll: https://free3d.com/3d-model/doll-v3--666831.html
  const mtlLoader = new MTLLoader();
  mtlLoader.load("rsc/doll/doll.mtl", (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load("rsc/doll/doll.obj", (root) => {
      root.scale.set(0.2, 0.2, 0.2);
      root.position.set(0, 1, 0);
      root.rotation.set(-Math.PI / 2, 0, 0);
      scene.add(root);
    });
  });

  // heart
  // edited blender model, original: https://www.turbosquid.com/3d-models/heart-box-2024099
  const baseMtl = new MTLLoader();
  baseMtl.load("rsc/Heart_box/heart.mtl", (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load("rsc/Heart_box/heart.obj", (root) => {
      root.scale.set(8, 8, 8);
      root.position.set(0, -1, 0);
      // root.rotation.set(-Math.PI / 2, 0, 0);
      scene.add(root);
    });
  });
  const topMtl = new MTLLoader();
  topMtl.load("rsc/Heart_box/top_heart.mtl", (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load("rsc/Heart_box/top_heart.obj", (root) => {
      root.scale.set(8, 8, 8);
      root.position.set(0, 19, -19);
      root.rotation.set(-Math.PI / 2, 0, Math.PI);
      scene.add(root);
    });
  });
}

function render(time) {
  time *= 0.001; // convert time to seconds

  // shapes
  // {
  //   cubes.forEach((cube, ndx) => {
  //     const speed = 1 + ndx * 0.1;
  //     const rot = time * speed;
  //     cube.rotation.x = rot;
  //     cube.rotation.y = rot;
  //   });
  // }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
