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
let g_yellowAngle = 0;
let g_pinkAngle = 0;
let g_yellowAnim = false;
let g_pinkAnim = false;

function addActionsForHtmlUI() {
  // animation selector
  document.getElementById("yon").onclick = function () {
    g_yellowAnim = true;
  };
  document.getElementById("yoff").onclick = function () {
    g_yellowAnim = false;
  };
  document.getElementById("pon").onclick = function () {
    g_pinkAnim = true;
  };
  document.getElementById("poff").onclick = function () {
    g_pinkAnim = false;
  };

  // rotation selector
  document.getElementById("angle").addEventListener("mousemove", function () {
    g_globalAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("yellow").addEventListener("mousemove", function () {
    g_yellowAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("pink").addEventListener("mousemove", function () {
    g_pinkAngle = this.value;
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
  if (g_yellowAnim) {
    g_yellowAngle = 45 * Math.sin(g_seconds);
  }
  if (g_pinkAnim) {
    g_pinkAngle = 45 * Math.sin(3 * g_seconds);
  }
}

// draw every shape on canvas
function renderAllShapes() {
  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // let bodyColor = [0.874, 0.878, 0.886, 1];
  let bodyColor = [0.761, 0.776, 0.812, 1];

  // body
  var base = new Sphere();
  base.color = bodyColor
  base.matrix.setTranslate(0, -0.25, 0);
  base.matrix.rotate(g_yellowAngle, 1, 0, 0);
  let baseCoor = new Matrix4(base.matrix);
  base.matrix.scale(1.55, 1, 2);
  base.render();

  var chest = new Sphere();
  chest.color = bodyColor
  chest.matrix = baseCoor;
  chest.matrix.translate(0, 0.1, -0.25);
  chest.matrix.rotate(-25, 1, 0, 0);
  chest.matrix.scale(1.6, 1.3, 1.3);
  let chestCoor = new Matrix4(chest.matrix);
  chest.render();

  var upperChest = new Sphere();
  upperChest.color = bodyColor
  upperChest.matrix = new Matrix4(chestCoor);
  upperChest.matrix.rotate(-g_pinkAngle * 0.9, 1, 0, 0);
  upperChest.matrix.translate(0, 0.04, 0.03);
  upperChest.matrix.scale(0.9, 1.05, 0.9);
  upperChest.matrix.rotate(10, 1, 0, 0);
  upperChest.matrix.rotate(20, 0, 1, 0);
  upperChest.render();

  var back = new Cube();
  back.color = bodyColor
  back.top = 0.8;
  back.matrix = new Matrix4(baseCoor);
  back.matrix.translate(0, -0.08, 0.33);
  back.matrix.rotate(-40, 1, 0, 0);
  back.matrix.scale(0.4, 0.5, 0.1);
  back.render();

  var tailBase = new Sphere();
  tailBase.color = bodyColor
  tailBase.matrix = new Matrix4(baseCoor);
  tailBase.matrix.translate(0, -0.29, 0.49);
  tailBase.matrix.rotate(50, 1, 0, 0);
  tailBase.matrix.scale(0.85, 0.25, 0.51);
  tailBase.render();

  var tail = new Cube();
  tail.color = [7/255, 16/255, 19/255, 1];
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
  pink.matrix.rotate(-g_pinkAngle, 1, 0, 0);
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
  green.bottom = 0.8;
  green.top = 1.1;
  green.matrix = new Matrix4(neckCoor);
  green.matrix.translate(0, 0.4, 0.2);
  green.matrix.rotate(-20, 1, 0, 0);
  green.matrix.scale(0.29, 0.2, 0.35);
  green.matrix.rotate(120, 1, 0, 0);
  green.render();

  // head
  var head = new Sphere();
  head.color = [0.333, 0.372, 0.404, 1];
  head.matrix.setTranslate(0, 0.47, -0.345);
  head.matrix.scale(0.9, 0.9, 0.8);
  head.matrix.rotate(45, 0, 1, 0);
  head.render();

  // eyes
  var lEye = new Sphere();
  lEye.color = [0.99, 0.5, 0.357, 1];
  lEye.matrix.rotate(15, 0, 1, 1);
  lEye.matrix.translate(0.375, 0.48, -0.3);
  lEye.matrix.scale(0.1, 0.25, 0.25);
  lEye.render();

  var rEye = new Sphere();
  rEye.color = [0.99, 0.5, 0.357, 1];
  rEye.matrix.rotate(-15, 0, 1, 1);
  rEye.matrix.translate(-0.375, 0.48, -0.3);
  rEye.matrix.scale(0.1, 0.25, 0.25);
  rEye.render();

  var lPupil = new Sphere();
  lPupil.color = [0.031, 0.063, 0.075, 1];
  lPupil.matrix = lEye.matrix;
  lPupil.matrix.translate(0.18, 0, 0);
  lPupil.matrix.scale(0.5, 0.5, 0.5);
  lPupil.render();

  var rPupil = new Sphere();
  rPupil.color = [0.031, 0.063, 0.075, 1];
  rPupil.matrix = rEye.matrix;
  rPupil.matrix.translate(-0.18, 0, 0);
  rPupil.matrix.scale(0.5, 0.5, 0.5);
  rPupil.render();

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
  console.log(g_seconds);

  // update animation angles
  updateAnim();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again
  requestAnimationFrame(tick);
}

var g_shapesList = [];
