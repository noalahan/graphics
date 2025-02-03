// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { perserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  // get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  // get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }

  // set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

let g_globalAngle = 90;
let g_xAngle = 0;
let g_zAngle = 0;
let g_speed = 7;
// body
let g_bodyHeight = 0;
let g_bodyPos = 0;
let g_bodyAngle = 0;
let g_neckAngle = 0;
let g_greenAngle = 0;
let g_headAngle = 0;
let g_headY = 0;
let g_headZ = 0;
// wings
let g_lWingAngle = 0;
let g_rWingAngle = 0;
// left lef
let g_lLegAngle = 0;
let g_lCalfAngle = 0;
let g_lFootAngle = 0;
// right leg
let g_rLegAngle = 0;
let g_rCalfAngle = 0;
let g_rFootAngle = 0;

let g_walkAnim = false;
let g_pokeAnim = false;
var count = 0;

function addActionsForHtmlUI() {
  // animation selector
  document.getElementById("wOn").onclick = function () {
    g_walkAnim = true;
  };
  document.getElementById("wOff").onclick = function () {
    g_walkAnim = false;
  };
  document.getElementById("pose").onclick = function () {
    g_walkAnim = false;
    // g_globalAngle = 90;
    g_bodyHeight = 0;
    g_bodyPos = 0;
    g_bodyAngle = 0;
    g_neckAngle = 0;
    g_greenAngle = 0;
    g_headAngle = 0;
    g_headY = 0;
    g_headZ = 0;

    g_lWingAngle = 0;
    g_rWingAngle = 0;

    g_lLegAngle = 0;
    g_lCalfAngle = 0;
    g_lFootAngle = 0;

    g_rLegAngle = 0;
    g_rCalfAngle = 0;
    g_rFootAngle = 0;

    document.getElementById("height").value = 0;
    document.getElementById("body").value = 0;
    document.getElementById("neck").value = 0;
    document.getElementById("head").value = 0;
    document.getElementById("lWing").value = 0;
    document.getElementById("rWing").value = 0;
    document.getElementById("lLeg").value = 0;
    document.getElementById("lCalf").value = 0;
    document.getElementById("lFoot").value = 0;
    document.getElementById("rLeg").value = 0;
    document.getElementById("rCalf").value = 0;
    document.getElementById("rFoot").value = 0;
  };
  document.getElementById("speed").addEventListener("mousemove", function () {
    g_speed = this.value;
  });
  // poke animation
  document.getElementById("pOn").onclick = function () {
    g_pokeAnim = true;
    count = 0;
  };
  document.addEventListener("click", function (event) {
    if (event.shiftKey) {
      g_pokeAnim = true;
      count = 0;
    }
  });

  // Position selector
  document.getElementById("height").addEventListener("mousemove", function () {
    g_bodyHeight = this.value * 0.01;
    renderAllShapes();
  });
  document.getElementById("pos").addEventListener("mousemove", function () {
    g_bodyPos = this.value * 0.01;
    renderAllShapes();
  });

  // Camera rotation
  document.getElementById("angle").addEventListener("mousemove", function () {
    g_globalAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("xAngle").addEventListener("mousemove", function () {
    g_xAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("zAngle").addEventListener("mousemove", function () {
    g_zAngle = this.value;
    renderAllShapes();
  });
  let x = 0,
    y = 0,
    xStart,
    yStart,
    xLast,
    yLast;
  let drag = false;
  document
    .getElementById("webgl")
    .addEventListener("mousedown", function (event) {
      drag = true;
      xStart = event.clientX;
      yStart = event.clientY;
    });
  document
    .getElementById("webgl")
    .addEventListener("mousemove", function (event) {
      if (drag) {
        xLast = x;
        x = event.clientX - xStart;
        if (Math.abs(xLast) - Math.abs(x) > 0) {
          xStart = event.clientX;
        }
        // console.log(event.clientX);
        g_globalAngle -= x * 0.04;
        document.getElementById("angle").value = g_globalAngle;

        yLast = y;
        y = event.clientY - yStart;
        if (Math.abs(yLast) - Math.abs(y) > 0) {
          yStart = event.clientY;
        }
        if (event.clientX < 200) {
          g_xAngle -= y * 0.04;
          document.getElementById("xAngle").value = g_xAngle;
        } else {
          g_zAngle -= y * 0.04;
          document.getElementById("zAngle").value = g_zAngle;
        }
      }
    });
  document.addEventListener("mouseup", function () {
    drag = false;
  });

  // body rotations
  document.getElementById("body").addEventListener("mousemove", function () {
    g_bodyAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("neck").addEventListener("mousemove", function () {
    g_neckAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("head").addEventListener("mousemove", function () {
    g_headAngle = this.value;
    renderAllShapes();
  });
  // wing rotations
  document.getElementById("lWing").addEventListener("mousemove", function () {
    g_lWingAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("rWing").addEventListener("mousemove", function () {
    g_rWingAngle = this.value;
    renderAllShapes();
  });
  // left leg rotations
  document.getElementById("lLeg").addEventListener("mousemove", function () {
    g_lLegAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("lCalf").addEventListener("mousemove", function () {
    g_lCalfAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("lFoot").addEventListener("mousemove", function () {
    g_lFootAngle = this.value;
    renderAllShapes();
  });
  // right left rotations
  document.getElementById("rLeg").addEventListener("mousemove", function () {
    g_rLegAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("rCalf").addEventListener("mousemove", function () {
    g_rCalfAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("rFoot").addEventListener("mousemove", function () {
    g_rFootAngle = this.value;
    renderAllShapes();
  });
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.4, 0.7, 1, 1.0);
  // gl.clearColor(0, 0, 0, 1.0);

  // Render
  // renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnim() {
  if (g_walkAnim) {
    let a = g_speed;

    // body
    g_bodyHeight = 0.01 * Math.sin(g_seconds * a);
    g_bodyAngle = 3 * Math.sin(-g_seconds * a);
    g_neckAngle = 20 * (Math.sin(g_seconds * a) + 1);
    g_greenAngle = 8 * (Math.sin(g_seconds * a) + 1);
    g_headAngle = 19 * (Math.sin(g_seconds * a) + 0.5);
    g_headY = 0.03 * Math.sin(g_seconds * a) + 0.06;
    g_headZ = 0.07 * Math.sin(-g_seconds * a);
    // update sliders
    document.getElementById("height").value = 2 * Math.sin(g_seconds * a) * 5;
    document.getElementById("body").value = 3 * Math.sin(g_seconds * a);
    document.getElementById("neck").value = 20 * (Math.sin(g_seconds * a) + 1);
    document.getElementById("head").value =
      19 * (Math.sin(g_seconds * a) + 0.5);

    // wings
    g_lWingAngle = 5 * Math.sin(g_seconds * a + Math.PI / 2);
    g_rWingAngle = 5 * Math.sin(g_seconds * a + Math.PI / 4);
    // update sliders
    document.getElementById("lWing").value =
      5 * Math.sin(g_seconds * a + Math.PI / 2);
    document.getElementById("rWing").value =
      5 * Math.sin(g_seconds * a + Math.PI / 4);

    // legs
    let b = 0.7;
    g_lLegAngle = 25 * Math.sin(g_seconds * a * b) - 5;
    g_lCalfAngle = 35 * Math.sin(g_seconds * a * b + Math.PI / 2) + 25;
    g_lFootAngle = 15 * Math.sin(g_seconds * a * b - Math.PI / 4) - 10;
    g_rLegAngle = -25 * Math.sin(g_seconds * a * b) - 5;
    g_rCalfAngle = -35 * Math.sin(g_seconds * a * b + Math.PI / 2) + 25;
    g_rFootAngle = -15 * Math.sin(g_seconds * a * b - Math.PI / 4) - 10;
    //update sliders
    document.getElementById("lLeg").value =
      25 * Math.sin(g_seconds * a * b) - 5;
    document.getElementById("lCalf").value =
      -35 * Math.sin(g_seconds * a * b) + 25;
    document.getElementById("lFoot").value =
      15 * Math.sin(g_seconds * a * b - Math.PI / 4) - 5;
    document.getElementById("rLeg").value =
      -25 * Math.sin(g_seconds * a * b) - 5;
    document.getElementById("rCalf").value =
      -35 * Math.sin(g_seconds * a * b + Math.PI / 2) + 25;
    document.getElementById("rFoot").value =
      -15 * Math.sin(g_seconds * a * b - Math.PI / 4) - 10;
  }
  if (g_pokeAnim) {
    count += 6;
    let angle = Math.cos((count * Math.PI) / 180);

    // document.getElementById("button").innerHTML =
    //   10 * Math.sin(((Math.PI / 2) * (count * Math.PI)) / 180) + 5;

    // animation
    g_bodyHeight = 0.105 * angle - 0.105;
    g_bodyPos = 0.115 * angle - 0.115;
    g_lLegAngle = 15 * angle - 15;
    g_lCalfAngle = -30 * angle + 30;
    g_lFootAngle = 15 * angle - 15;
    g_rLegAngle = 15 * angle - 15;
    g_rCalfAngle = -30 * angle + 30;
    g_rFootAngle = 15 * angle - 15;
    g_lWingAngle = 10 * Math.sin((Math.PI * (count * Math.PI)) / 180) - 20;
    g_rWingAngle = 10 * Math.sin(-((Math.PI * (count * Math.PI)) / 180)) - 20;

    document.getElementById("height").value = (0.105 * angle - 0.105) * 100;
    document.getElementById("pos").value = (0.115 * angle - 0.115) * 100;
    document.getElementById("lLeg").value = 15 * angle - 15;
    document.getElementById("lCalf").value = -30 * angle + 30;
    document.getElementById("lFoot").value = 15 * angle - 15;
    document.getElementById("rLeg").value = 15 * angle - 15;
    document.getElementById("rCalf").value = -30 * angle + 30;
    document.getElementById("rFoot").value = 15 * angle - 15;
    document.getElementById("lWing").value =
      10 * Math.sin((Math.PI * (count * Math.PI)) / 180) - 20;
    document.getElementById("rWing").value =
      10 * Math.sin(-((Math.PI * (count * Math.PI)) / 180)) - 20;

    if (count > 360) {
      count = 0;
      g_pokeAnim = false;
      g_lWingAngle = 0;
      g_rWingAngle = 0;
      document.getElementById("lWing").value = 0;
      document.getElementById("rWing").value = 0;
    }
  }
}

// colors
let bodyColor = [0.761, 0.776, 0.812, 1];
let headColor = [0.333, 0.372, 0.404, 1];
let eyeColor = [0.859, 0.439, 0.196, 1];
let blackColor = [0.031, 0.063, 0.075, 1];
let wingColor = [0.596, 0.651, 0.71, 1];
let legColor = [0.812, 0.376, 0.243, 1];

// draw every shape on canvas
function renderAllShapes() {
  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_xAngle, 1, 0, 0);
  globalRotMat.rotate(g_zAngle, 0, 0, 1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // body
  var base = new Sphere();
  base.color = bodyColor;
  base.matrix.setTranslate(0, -0.25 + g_bodyHeight, 0 + g_bodyPos);
  base.matrix.rotate(g_bodyAngle, 1, 0, 0);
  let baseCoor = new Matrix4(base.matrix);
  base.matrix.scale(1.55, 1, 2);
  base.render();

  var chest = new Sphere();
  chest.color = bodyColor;
  chest.matrix = baseCoor;
  chest.matrix.translate(0, 0.1, -0.25);
  chest.matrix.rotate(-25, 1, 0, 0);
  chest.matrix.scale(1.6, 1.3, 1.3);
  let chestCoor = new Matrix4(chest.matrix);
  chest.render();

  var upperChest = new Sphere();
  upperChest.color = bodyColor;
  upperChest.matrix = new Matrix4(chestCoor);
  upperChest.matrix.rotate(-g_neckAngle * 0.9, 1, 0, 0);
  upperChest.matrix.translate(0, 0.04, 0.03);
  upperChest.matrix.scale(0.9, 1.05, 0.9);
  upperChest.matrix.rotate(10, 1, 0, 0);
  upperChest.matrix.rotate(20, 0, 1, 0);
  upperChest.render();

  var back = new Cube();
  back.color = bodyColor;
  back.top = 0.8;
  back.matrix = new Matrix4(baseCoor);
  back.matrix.translate(0, -0.08, 0.33);
  back.matrix.rotate(-40, 1, 0, 0);
  back.matrix.scale(0.4, 0.5, 0.1);
  back.render();

  // wings
  var lShoulder = new Sphere();
  lShoulder.color = wingColor;
  lShoulder.matrix = new Matrix4(baseCoor);
  lShoulder.matrix.rotate(25, 1, 0, 0);
  lShoulder.matrix.rotate(g_lWingAngle, 1, 0, 0);
  let lWingCoor = new Matrix4(lShoulder.matrix);
  lShoulder.matrix.rotate(15, 0, 0, 1);
  lShoulder.matrix.translate(0.23, 0.06, 0.1);
  lShoulder.matrix.scale(0.2, 0.7, 0.7);
  lShoulder.render();

  var lWing = new Cylinder();
  lWing.color = wingColor;
  lWing.top = 0;
  lWing.matrix = new Matrix4(lWingCoor);
  lWing.matrix.translate(0.215, 0.05, 0.4);
  lWing.matrix.rotate(13, 1, 0, 0);
  lWing.matrix.rotate(15, 0, 0, 1);
  lWing.matrix.scale(0.1, 0.34, 0.55);
  lWing.render();

  var rShoulder = new Sphere();
  rShoulder.color = wingColor;
  rShoulder.matrix = new Matrix4(baseCoor);
  rShoulder.matrix.rotate(25, 1, 0, 0);
  rShoulder.matrix.rotate(g_rWingAngle, 1, 0, 0);
  let rWingCoor = new Matrix4(rShoulder.matrix);
  rShoulder.matrix.rotate(-15, 0, 0, 1);
  rShoulder.matrix.translate(-0.23, 0.06, 0.1);
  rShoulder.matrix.scale(0.2, 0.7, 0.7);
  rShoulder.render();

  var rWing = new Cylinder();
  rWing.color = wingColor;
  rWing.top = 0;
  rWing.matrix = new Matrix4(rWingCoor);
  rWing.matrix.translate(-0.215, 0.05, 0.4);
  rWing.matrix.rotate(13, 1, 0, 0);
  rWing.matrix.rotate(-15, 0, 0, 1);
  rWing.matrix.scale(0.1, 0.34, 0.55);
  rWing.render();

  // tail
  var tailBase = new Sphere();
  tailBase.color = bodyColor;
  tailBase.matrix = new Matrix4(baseCoor);
  tailBase.matrix.translate(0, -0.29, 0.49);
  tailBase.matrix.rotate(50, 1, 0, 0);
  tailBase.matrix.scale(0.85, 0.25, 0.51);
  tailBase.render();

  var tail = new Cube();
  tail.color = blackColor;
  tail.matrix = new Matrix4(baseCoor);
  tail.top = 0.7;
  tail.matrix.translate(0, -0.37, 0.6);
  tail.matrix.rotate(-70, 1, 0, 0);
  tail.matrix.scale(0.3, 0.2, 0.08);
  tail.matrix.rotate(30, 1, 0, 0);
  tail.render();

  // neck
  let z = -0.1;
  chestCoor.translate(0, 0, z);

  var pink = new Cylinder();
  pink.color = [0.631, 0.259, 0.624, 1];
  pink.bottom = 0.7;
  pink.top = 1.1;
  pink.matrix = new Matrix4(chestCoor);
  pink.matrix.rotate(-g_neckAngle, 1, 0, 0);
  let neckCoor = new Matrix4(pink.matrix);
  pink.matrix.translate(0, 0.25, 0.01 - z);
  pink.matrix.rotate(-20, 1, 0, 0);
  pink.matrix.scale(0.35, 0.2, 0.4);
  pink.matrix.rotate(120, 1, 0, 0);
  pink.render();

  var backPink = new Cylinder();
  backPink.color = [0.631, 0.259, 0.624, 1];
  backPink.top = 0.9;
  backPink.bottom = 1.05;
  backPink.matrix = new Matrix4(neckCoor);
  backPink.matrix.translate(0, 0.26, 0.19);
  backPink.matrix.rotate(-85, 1, 0, 0);
  backPink.matrix.scale(0.35, 0.3, 0.1);
  backPink.render();

  var green = new Cylinder();
  // green.color = [0.314, 0.541, 0.357, 1];
  green.color = [0.271, 0.588, 0.329, 1];
  green.bottom = 0.78;
  green.top = 1.13;
  green.matrix = new Matrix4(neckCoor);
  green.matrix.translate(0, 0.35, 0.19);
  green.matrix.rotate(g_greenAngle, 1, 0, 0);
  green.matrix.scale(0.29, 0.15, 0.34);
  green.matrix.rotate(100, 1, 0, 0);
  green.render();

  let headY = 0.2;
  let headZ = 0.15;
  let headCoor = new Matrix4(neckCoor);
  headCoor.translate(0, headY + g_headY, headZ + g_headZ);

  // head
  var head = new Sphere();
  head.color = headColor;
  head.matrix = new Matrix4(headCoor);
  head.matrix.rotate(g_headAngle, 1, 0, 0);
  let chinCoor = new Matrix4(head.matrix);
  head.matrix.translate(0, 0.47 - headY, 0.24 - headZ);
  head.matrix.scale(0.55, 0.55, 0.55);
  head.matrix.rotate(25, 1, 0, 0);
  head.render();

  var chin = new Cylinder();
  chin.color = headColor;
  chin.matrix = new Matrix4(chinCoor);
  chin.matrix.translate(0, 0.42 - headY, 0.213 - headZ);
  chin.matrix.rotate(0, 1, 0, 0);
  chin.matrix.scale(0.28, 0.1, 0.3);
  chin.matrix.rotate(100, 1, 0, 0);
  chin.render();

  var beak = new Cylinder();
  beak.color = blackColor;
  beak.top = 0;
  beak.matrix = new Matrix4(chinCoor);
  beak.matrix.rotate(205, 1, 0, 0);
  beak.matrix.translate(0, -0.29, 0.21);
  beak.matrix.scale(0.08, 0.07, 0.1);
  beak.render();

  var beakBase = new Sphere();
  beakBase.color = bodyColor;
  beakBase.matrix = new Matrix4(chinCoor);
  beakBase.matrix.translate(0, 0.34, -0.015);
  beakBase.matrix.rotate(25, 1, 0, 0);
  beakBase.matrix.scale(0.17, 0.17, 0.1);
  beakBase.render();

  // eyes
  var lEye = new Sphere();
  lEye.color = eyeColor;
  lEye.matrix = new Matrix4(chinCoor);
  lEye.matrix.rotate(25, 0, 1, 1);
  lEye.matrix.rotate(25, 1, 0, 0);
  lEye.matrix.translate(0.185, 0.295, 0.01);
  lEye.matrix.scale(0.1, 0.2, 0.2);
  lEye.render();
  var lPupil = new Sphere();
  lPupil.color = blackColor;
  lPupil.matrix = lEye.matrix;
  lPupil.matrix.translate(0.18, 0, 0);
  lPupil.matrix.scale(0.5, 0.5, 0.5);
  lPupil.render();

  var rEye = new Sphere();
  rEye.color = eyeColor;
  rEye.matrix = new Matrix4(chinCoor);
  rEye.matrix.rotate(-25, 0, 1, 1);
  rEye.matrix.rotate(25, 1, 0, 0);
  rEye.matrix.translate(-0.185, 0.295, 0.01);
  rEye.matrix.scale(0.1, 0.2, 0.2);
  rEye.render();
  var rPupil = new Sphere();
  rPupil.color = blackColor;
  rPupil.matrix = rEye.matrix;
  rPupil.matrix.translate(-0.18, 0, 0);
  rPupil.matrix.scale(0.5, 0.5, 0.5);
  rPupil.render();

  // legs
  var lThigh = new Cylinder();
  lThigh.color = legColor;
  lThigh.matrix = new Matrix4(baseCoor);
  lThigh.matrix.rotate(25, 1, 0, 0);
  lThigh.matrix.translate(0.1, 0.1, 0.07);
  lThigh.matrix.rotate(g_lLegAngle - 10, 1, 0, 0);
  let lThighCoor = new Matrix4(lThigh.matrix);
  lThigh.matrix.rotate(90, 1, 0, 0);
  lThigh.matrix.translate(0, 0, 0.3);
  lThigh.matrix.scale(0.06, 0.06, 0.37);
  lThigh.render();

  var lCalf = new Cylinder();
  lCalf.color = legColor;
  lCalf.bottom = 0.7;
  lCalf.matrix = new Matrix4(lThighCoor);
  lCalf.matrix.translate(0, -0.47, 0);
  lCalf.matrix.rotate(g_lCalfAngle - 40, 1, 0, 0);
  let lCalfCoor = new Matrix4(lCalf.matrix);
  lCalf.matrix.translate(0, 0, -0.07);
  lCalf.matrix.scale(0.06, 0.06, 0.17);
  lCalf.render();

  var lFoot = new Cube();
  lFoot.color = legColor;
  lFoot.top = 0.4;
  lFoot.matrix = new Matrix4(lCalfCoor);
  lFoot.matrix.translate(0, 0, -0.15);
  lFoot.matrix.rotate(180, 1, 0, 0);
  lFoot.matrix.rotate(g_lFootAngle - 40, 1, 0, 0);
  lFoot.matrix.scale(0.15, 0.2, 0.03);
  lFoot.render();

  var rThigh = new Cylinder();
  rThigh.color = legColor;
  rThigh.matrix = new Matrix4(baseCoor);
  rThigh.matrix.rotate(25, 1, 0, 0);
  rThigh.matrix.translate(-0.1, 0.1, 0.07);
  rThigh.matrix.rotate(g_rLegAngle - 10, 1, 0, 0);
  let rThighCoor = new Matrix4(rThigh.matrix);
  rThigh.matrix.rotate(90, 1, 0, 0);
  rThigh.matrix.translate(0, 0, 0.3);
  rThigh.matrix.scale(0.06, 0.06, 0.37);
  rThigh.render();

  var rCalf = new Cylinder();
  rCalf.color = legColor;
  rCalf.bottom = 0.7;
  rCalf.matrix = new Matrix4(rThighCoor);
  rCalf.matrix.translate(0, -0.47, 0);
  rCalf.matrix.rotate(g_rCalfAngle - 40, 1, 0, 0);
  let rCalfCoor = new Matrix4(rCalf.matrix);
  rCalf.matrix.translate(0, 0, -0.07);
  rCalf.matrix.scale(0.06, 0.06, 0.17);
  rCalf.render();

  var rFoot = new Cube();
  rFoot.color = legColor;
  rFoot.top = 0.4;
  rFoot.matrix = new Matrix4(rCalfCoor);
  rFoot.matrix.translate(0, 0, -0.15);
  rFoot.matrix.rotate(180, 1, 0, 0);
  rFoot.matrix.rotate(g_rFootAngle - 40, 1, 0, 0);
  rFoot.matrix.scale(0.15, 0.2, 0.03);
  rFoot.render();

  // // draw left arm
  // var yellow = new Cube();
  // yellow.color = [1, 1, 0, 1];
  // yellow.matrix.setTranslate(0, -0.5, 0.0);
  // yellow.matrix.rotate(-5, 1, 0, 0);
  // yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  // var yellowCoordinates = new Matrix4(yellow.matrix);
  // yellow.matrix.scale(0.25, 0.7, 0.5);
  // yellow.matrix.translate(-0.5, 0, 0);
  // yellow.render();

  // // test box
  // var pink = new Cube();
  // pink.color = [1, 0, 1, 1];
  // pink.matrix = yellowCoordinates;
  // pink.matrix.translate(0, 0.65, 0);
  // pink.matrix.rotate(-g_pinkAngle, 0, 0, 1);
  // pink.matrix.scale(0.3, 0.3, 0.3);
  // pink.matrix.translate(-0.5, 0, -0.00005);
  // pink.render();
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0;

function tick() {
  // save current time
  g_seconds = performance.now() / 1000.0 - g_startTime;
  // console.log(g_seconds);

  // update animation angles
  updateAnim();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again
  requestAnimationFrame(tick);
}
