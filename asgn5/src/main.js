// base code from https://threejs.org/manual
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

let renderer;
let camera;
let scene;
let loader;

let renderTarget1;
let rtCamera1;
let rtScene1;
let clockFaceMtl;
let hours;
let minutes;

let renderTarget2;
let rtCamera2;
let rtScene2;
let pendulumMtl;
let pendulum;

let rightGate;
let leftGate;

main();
function main() {
  // set up
  sceneSetup();
  lighting();

  clockTexture();
  pendulumTexture();

  // create objects
  shapes();
  objectLoaders();
  billboard("Polly Pocket", 5, 12);
  billboard("Noa Lahan - CSE 160 Asgn 5", 3, 8);
  billboard("Extras: Billboard, Shadows, Render to Texture (clock)", 1.5, 6);

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
  camera.position.set(0, 20, 20);

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
  controls.target.set(0, 10, -10);
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

function clockTexture() {
  const rtWidth = 256;
  const rtHeight = 256;
  renderTarget1 = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

  const rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 5;
  rtCamera1 = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera1.position.z = 2;

  rtScene1 = new THREE.Scene();
  rtScene1.background = new THREE.Color("white");

  const material = new THREE.MeshPhongMaterial({ color: "black" });
  minutes = new THREE.Object3D();
  rtScene1.add(minutes);
  const long = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.3), material);
  long.position.set(0.6, 0, 0);
  minutes.add(long);

  hours = new THREE.Object3D();
  rtScene1.add(hours);
  const short = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.3), material);
  short.position.set(-0.4, 0, 0);
  hours.add(short);

  clockFaceMtl = new THREE.MeshPhongMaterial({
    map: renderTarget1.texture,
  });
}

function pendulumTexture() {
  const rtWidth = 256;
  const rtHeight = 256;
  renderTarget2 = new THREE.WebGLRenderTarget(rtWidth * 1.8, rtHeight * 3);

  const rtFov = 75;
  const rtAspect = 1.8 / 3;
  const rtNear = 0.1;
  const rtFar = 5;
  rtCamera2 = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera2.position.z = 2;

  rtScene2 = new THREE.Scene();
  rtScene2.background = new THREE.Color("#511900");

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    rtScene2.add(light);
  }

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 3, 3),
    new THREE.MeshPhongMaterial({ color: "#F54E00", side: THREE.DoubleSide })
  );
  box.position.set(0, 0, 1);
  rtScene2.add(box);

  pendulum = new THREE.Object3D();
  pendulum.position.set(0, 1.5, -0.3);
  rtScene2.add(pendulum);

  const pole = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 2, 0.2),
    new THREE.MeshPhongMaterial({ color: "yellow" })
  );
  pole.position.y = -1;
  pendulum.add(pole);

  const ball = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshPhongMaterial({ color: "yellow" })
  );
  ball.position.y = -2.2;
  pendulum.add(ball);

  pendulumMtl = new THREE.MeshPhongMaterial({
    map: renderTarget2.texture,
  });
}

function shapes() {
  loader = new THREE.TextureLoader();

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
    const texture = loader.load("img/topWindow.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    const window = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 1.68, 16),
      new THREE.MeshPhongMaterial({ map: texture })
    );
    window.position.set(0, 25, -17.3);
    window.rotation.x = Math.PI / 2;
    window.rotation.y = Math.PI / 2;
    // window.receiveShadow = true;
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
      new THREE.CylinderGeometry(0.9, 0, 1, 16),
      clockFaceMtl
    );
    clock.position.set(2.7, 14.3, -14.74);
    clock.rotation.x = Math.PI / 2;
    scene.add(clock);
    // pendulum
    const weight = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 3, 1.8),
      pendulumMtl
    );
    weight.position.set(2.7, 11.5, -15.14);
    scene.add(weight);

    // window
    const texture = loader.load("img/bottomWindow.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    const window = new THREE.Mesh(
      new THREE.BoxGeometry(4, 3, 1.8),
      new THREE.MeshPhongMaterial({ map: texture })
    );
    window.position.set(7.5, 15.5, -17.35);
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

  // bottom heart
  {
    const fence = loader.load("img/fence.png");
    const inner = loader.load("img/inner.png");
    const left = loader.load("img/leftHeart.png");
    const right = loader.load("img/rightHeart.png");

    const rightMaterials = [
      new THREE.MeshPhongMaterial({ color: "white" }),
      new THREE.MeshPhongMaterial({ map: inner }),
      new THREE.MeshPhongMaterial({ map: fence }),
      new THREE.MeshPhongMaterial({ map: fence }),
      new THREE.MeshPhongMaterial({ map: left }),
      new THREE.MeshPhongMaterial({ map: right }),
    ];

    const leftMaterials = [
      new THREE.MeshPhongMaterial({ map: inner }),
      new THREE.MeshPhongMaterial({ color: "white" }),
      new THREE.MeshPhongMaterial({ map: fence }),
      new THREE.MeshPhongMaterial({ map: fence }),
      new THREE.MeshPhongMaterial({ map: right }),
      new THREE.MeshPhongMaterial({ map: left }),
    ];

    const geometry = new THREE.BoxGeometry(3.3, 3, 0.5);

    // right gate
    rightGate = new THREE.Object3D();
    rightGate.position.set(3.5, 3.3, 7.5);
    scene.add(rightGate);

    const lDoor = new THREE.Mesh(geometry, rightMaterials);
    lDoor.castShadow = true;
    lDoor.receiveShadow = true;
    lDoor.position.x = -1.8;
    rightGate.add(lDoor);

    // left gate
    leftGate = new THREE.Object3D();
    leftGate.position.set(-3.5, 3.3, 7.5);
    scene.add(leftGate);

    const rDoor = new THREE.Mesh(geometry, leftMaterials);
    rDoor.castShadow = true;
    rDoor.receiveShadow = true;
    rDoor.position.x = 1.8;
    leftGate.add(rDoor);
  }

  // back logo
  {
    const texture = loader.load("img/logo.png");
    texture.colorSpace = THREE.SRGBColorSpace;

    const back = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 0.5, 32),
      new THREE.MeshPhongMaterial({ map: texture })
    );
    back.position.set(0, 16, -18.06);
    back.rotation.x = Math.PI / 2;
    back.rotation.y = -Math.PI / 2;
    back.scale.set(1, 1, 1.3);
    scene.add(back);
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
  baseMtl.load("rsc/Heart_box/bottom_heart.mtl", (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load("rsc/Heart_box/bottom_heart.obj", (root) => {
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
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      root.scale.set(8, 8, 8);
      root.position.set(0, 19, -19);
      root.rotation.set(-Math.PI / 2, 0, Math.PI);
      scene.add(root);
    });
  });

  // // top
  // const heartMtl = new MTLLoader();
  // heartMtl.load("rsc/Heart_box/heart.mtl", (mtl) => {
  //   mtl.preload();
  //   const objLoader = new OBJLoader();
  //   objLoader.setMaterials(mtl);
  //   objLoader.load("rsc/Heart_box/heart.obj", (root) => {
  //     root.traverse((child) => {
  //       if (child.isMesh) {
  //         child.material.map.colorSpace = THREE.SRGBColorSpace;
  //         // child.castShadow = true;
  //         // child.receiveShadow = true;
  //       }
  //     });
  //     root.scale.set(8, 8, 8);
  //     root.position.set(0, -0.91, 0);
  //     // root.rotation.set(-Math.PI / 2, 0, Math.PI);
  //     scene.add(root);
  //   });
  // }); 
}

function render(time) {
  time *= 0.001; // convert time to seconds

  // gate
  rightGate.rotation.y = 0.8 * Math.sin(time * 1.5); // Rotate around the new pivot point
  leftGate.rotation.y = -0.8 * Math.sin(time * 1.5); // Rotate around the new pivot point

  // clock face
  hours.rotation.z = -time * 0.3;
  minutes.rotation.z = -time;

  // draw render target scene to render target
  renderer.setRenderTarget(renderTarget1);
  renderer.render(rtScene1, rtCamera1);
  renderer.setRenderTarget(null);

  // clock pendulum
  pendulum.rotation.z = 0.2 * Math.sin(time * 3);

  // draw render target scene to render target
  renderer.setRenderTarget(renderTarget2);
  renderer.render(rtScene2, rtCamera2);
  renderer.setRenderTarget(null);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

/**
 * Creates a billboard label
 * @param {String} text The lable text
 * @param {int} height The label height
 * @param {int} size  Size of text
 */
function billboard(text, height, size) {
  const canvas = makeLabelCanvas(size * 10, text);
  const texture = new THREE.CanvasTexture(canvas);
  // because our canvas is likely not a power of 2
  // in both dimensions set the filtering appropriately.
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const labelMaterial = new THREE.SpriteMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const labelGeometry = new THREE.PlaneGeometry(1, 1);
  const label = new THREE.Sprite(labelMaterial);

  label.position.set(-15, height, 8);

  // if units are meters then 0.01 here makes size
  // of the label into centimeters.
  const labelBaseScale = 0.01;
  label.scale.x = canvas.width * labelBaseScale;
  label.scale.y = canvas.height * labelBaseScale;

  scene.add(label);
}

/**
 * Creates a label canvas for billboard function
 * @param {int} size Size of canvas
 * @param {String} name Label text
 * @returns
 */
function makeLabelCanvas(size, name) {
  const borderSize = 20;
  const ctx = document.createElement("canvas").getContext("2d");
  const font = `${size}px bold Arial`;
  ctx.font = font;
  // measure how long the name will be
  const doubleBorderSize = borderSize * 2;
  const width = ctx.measureText(name).width + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  // need to set font again after resizing canvas
  ctx.font = font;
  ctx.textBaseline = "top";

  ctx.fillStyle = "#C78254";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "black";
  ctx.fillText(name, borderSize, borderSize);

  return ctx.canvas;
}
