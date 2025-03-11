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
  renderer.shadowMap.enabled = true;

  // set up camera
  const fov = 75;
  const aspect = w / h;
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 20, 5);

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
  controls.target.set(0, 15, -10);
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
  {
    const color = 0xffffff;
    intensity = 2.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(20, 35, 10);
    scene.add(light);
    light.target.position.set(-5, 5, -10);
    scene.add(light.target);

    // Shadows
    light.castShadow = true;
    // shadow camera size
    light.shadow.camera.left = -15;
    light.shadow.camera.right = 18;
    light.shadow.camera.top = 19;
    light.shadow.camera.bottom = -15;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    // const helper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(helper);
  }

  // point light (from position in all directions)
  {
    // left sconce
    const left = new THREE.PointLight(0xffff55, 15);
    left.position.set(-4.6, 22.3, -15);
    scene.add(left);
    // const helperl = new THREE.PointLightHelper(left);
    // scene.add(helperl);

    // right sconce
    const right = new THREE.PointLight(0xffff55, 15);
    right.position.set(4.6, 22.3, -15);
    scene.add(right);
    // const helperr = new THREE.PointLightHelper(right);
    // scene.add(helperr);
  }

  // spot light
  {
    const spotlight = new THREE.SpotLight(0xffff55, 150, 10, Math.PI / 5, 0.1);
    spotlight.position.set(-6, 16.7, -15);
    scene.add(spotlight);
    spotlight.target.position.set(-6, 15, -15);
    scene.add(spotlight.target);

    // shadows
    spotlight.castShadow = true;

    spotlight.shadow.camera.near = 1;
    spotlight.shadow.camera.far = 8;

    // const helper = new THREE.CameraHelper(spotlight.shadow.camera);
    // scene.add(helper);
  }
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

  // bedroom
  {
    // floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(21, 1, 3.2), // size
      new THREE.MeshPhongMaterial({ color: "#FFE882" }) // color
    );
    floor.position.set(0, 19, -15);
    floor.castShadow = true;
    floor.receiveShadow = true;
    scene.add(floor);

    // bed base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(7, 1, 3.2), // size
      new THREE.MeshPhongMaterial({ color: "#8A2A01" }) // color
    );
    base.position.set(0, 20, -15);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);
    // bed
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(5, 1, 3), // size
      new THREE.MeshPhongMaterial({ color: "#F0F6F6" }) // color
    );
    bed.position.set(0, 21, -15);
    bed.castShadow = true;
    bed.receiveShadow = true;
    scene.add(bed);
    // blanket
    const blanket = new THREE.Mesh(
      new THREE.BoxGeometry(4, 1.2, 3.1), // size
      new THREE.MeshPhongMaterial({ color: "#9DDDE3" }) // color
    );
    blanket.position.set(1, 21, -15);
    blanket.castShadow = true;
    blanket.receiveShadow = true;
    scene.add(blanket);
    // pillow
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.2, 1.8), // size
      new THREE.MeshPhongMaterial({ color: "#9DDDE3" }) // color
    );
    pillow.position.set(-1.8, 21.6, -15);
    pillow.castShadow = true;
    // pillow.receiveShadow = true;
    scene.add(pillow);

    // sconces
    const left = new THREE.Mesh(
      new THREE.SphereGeometry(-0.8, 10, 10),
      new THREE.MeshPhongMaterial({ color: "#ffff99", side: THREE.DoubleSide })
    );
    left.position.set(-4.6, 22.3, -15);
    scene.add(left);
    const right = new THREE.Mesh(
      new THREE.SphereGeometry(-0.8, 10, 10),
      new THREE.MeshPhongMaterial({ color: "#ffff99", side: THREE.DoubleSide })
    );
    right.position.set(4.6, 22.3, -15);
    scene.add(right);
    // bases
    const leftBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 1, 2),
      new THREE.MeshPhongMaterial({ color: "#D6800F" })
    );
    leftBase.position.set(-4.6, 21.5, -16);
    // leftBase.castShadow = true;
    // leftBase.receiveShadow = true;
    scene.add(leftBase);
    const rightBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 1, 2),
      new THREE.MeshPhongMaterial({ color: "#D6800F" })
    );
    rightBase.position.set(4.6, 21.5, -16);
    // rightBase.castShadow = true;
    // rightBase.receiveShadow = true;
    scene.add(rightBase);

    // window
    const window = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 0, 1, 16),
      new THREE.MeshPhongMaterial({ color: "skyblue" })
    );
    window.position.set(0, 25.5, -16.8);
    window.rotation.x = Math.PI / 2;
    scene.add(window);
  }

  // dining room
  {
    // floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(23, 1, 3.2), // size
      new THREE.MeshPhongMaterial({ color: "#FFE882" }) // color
    );
    floor.position.set(0, 8.7, -15);
    floor.castShadow = true;
    floor.receiveShadow = true;
    scene.add(floor);

    // table
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.4, 16),
      new THREE.MeshPhongMaterial({ color: "#F5878E" })
    );
    table.position.set(-6, 11.9, -15);
    table.castShadow = true;
    scene.add(table);
    // base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.5, 3, 16),
      new THREE.MeshPhongMaterial({ color: "#8A2A01" })
    );
    base.position.set(-6, 10.5, -15);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);

    // left chairs
    // seat
    const leftBase = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.5, 2),
      new THREE.MeshPhongMaterial({ color: "#8A2A01" })
    );
    leftBase.position.set(-8.5, 9.9, -15);
    leftBase.castShadow = true;
    leftBase.receiveShadow = true;
    scene.add(leftBase);
    // back
    const leftBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 4.5, 2),
      new THREE.MeshPhongMaterial({ color: "#8A2A01" })
    );
    leftBack.position.set(-9.6, 11, -15);
    leftBack.castShadow = true;
    // leftBack.receiveShadow = true;
    scene.add(leftBack);
    // pillow
    const leftPillow = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 16, 6),
      new THREE.MeshPhongMaterial({ color: "#f5878e" })
    );
    leftPillow.position.set(-8.5, 10.8, -15);
    leftPillow.scale.set(1, 0.2, 1);
    // leftPillow.castShadow = true;
    leftPillow.receiveShadow = true;
    scene.add(leftPillow);

    // right chairs
    // seat
    const rightBase = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.5, 2),
      new THREE.MeshPhongMaterial({ color: "#8A2A01" })
    );
    rightBase.position.set(-3.5, 9.9, -15);
    rightBase.castShadow = true;
    rightBase.receiveShadow = true;
    scene.add(rightBase);
    // back
    const rightBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 4.5, 2),
      new THREE.MeshPhongMaterial({ color: "#8A2A01" })
    );
    rightBack.position.set(-2.4, 11, -15);
    rightBack.castShadow = true;
    // rightBack.receiveShadow = true;
    scene.add(rightBack);
    // pillow
    const rightPillow = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 16, 6),
      new THREE.MeshPhongMaterial({ color: "#f5878e" })
    );
    rightPillow.position.set(-3.5, 10.8, -15);
    rightPillow.scale.set(1, 0.2, 1);
    // rightPillow.castShadow = true;
    rightPillow.receiveShadow = true;
    scene.add(rightPillow);

    // light
    const pole = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.8, 0.2),
      new THREE.MeshPhongMaterial({ color: "#D6800F" })
    );
    pole.position.set(-6, 17.2, -15);
    scene.add(pole);
    // top
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 1.7, 4, 16),
      new THREE.MeshPhongMaterial({ color: "#6B2737" })
    );
    top.position.set(-6, 16.2, -15);
    top.scale.set(1, 0.2, 1);
    scene.add(top);
    // light bulb
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(-0.6, 10, 10),
      new THREE.MeshPhongMaterial({ color: "#ffff99", side: THREE.DoubleSide })
    );
    light.position.set(-6, 15.5, -15);
    scene.add(light);
  }

  // living room
  {
    // sofa
    const back = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 1, 16),
      new THREE.MeshPhongMaterial({ color: "#C3DD7E" })
    );
    back.position.set(7, 12, -16);
    back.rotation.x = Math.PI / 2;
    back.castShadow = true;
    back.receiveShadow = true;
    scene.add(back);
    // bottom
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 1.8, 3),
      new THREE.MeshPhongMaterial({ color: "#C3DD7E" })
    );
    base.position.set(7, 10, -15);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);
    // left arm
    const left = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 3.1, 16),
      new THREE.MeshPhongMaterial({ color: "#C3DD7E" })
    );
    left.position.set(5.5, 11.3, -15);
    left.rotation.x = Math.PI / 2;
    left.castShadow = true;
    left.receiveShadow = true;
    scene.add(left);
    // right arm
    const right = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 3.1, 16),
      new THREE.MeshPhongMaterial({ color: "#C3DD7E" })
    );
    right.position.set(8.5, 11.3, -15);
    right.rotation.x = Math.PI / 2;
    right.castShadow = true;
    right.receiveShadow = true;
    scene.add(right);

    // clock
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 7, 2.5),
      new THREE.MeshPhongMaterial({ color: "#8A2A01" })
    );
    body.position.set(2.7, 12, -15.5);
    body.castShadow = true;
    body.receiveShadow = true;
    scene.add(body);
    // clock
    const clock = new THREE.Mesh(
      new THREE.CylinderGeometry(.9, 0, 1, 16),
      new THREE.MeshPhongMaterial({ color: "white" })
    );
    clock.position.set(2.7, 14.3, -14.6);
    clock.rotation.x = Math.PI / 2;
    scene.add(clock);
    // window
    const weight = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 3, 1.8),
      new THREE.MeshPhongMaterial({color: "#511901"})
    );
    weight.position.set(2.7, 11.5, -15);
    scene.add(weight);

    // window
    const window = new THREE.Mesh(
      new THREE.BoxGeometry(4, 3, 1),
      new THREE.MeshPhongMaterial({color: "skyblue"})
    );
    window.position.set(7.5, 15.5, -17);
    scene.add(window);
  }

  // ground plane
  {
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
    mesh.position.set(0, 0, -5);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  // sky box
  {
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
      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; // Model will cast shadows
          child.receiveShadow = true; // Model will receive shadows
        }
      });
      root.scale.set(0.2, 0.2, 0.2);
      root.position.set(0, 1.4, 0);
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
      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; // Model will cast shadows
          child.receiveShadow = true; // Model will receive shadows
        }
      });
      root.scale.set(8, 8, 8);
      root.position.set(0, -1, 0);
      scene.add(root);
    });
  });

  const topMtl = new MTLLoader();
  topMtl.load("rsc/Heart_box/top_heart.mtl", (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load("rsc/Heart_box/top_heart.obj", (root) => {
      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; // Model will cast shadows
          child.receiveShadow = true; // Model will receive shadows
        }
      });
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
