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

let g_globalAngle = 0;
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
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Render
  // renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnim() {
  if (g_yellowAnim) {
    g_yellowAngle = 45 * Math.sin(g_seconds);
  }
  if (g_pinkAnim) {
    g_pinkAngle = 45 * Math.sin(3*g_seconds);
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

  // draw the body cube
  var red = new Cube();
  red.color = [1.0, 0.0, 0.0, 1.0];
  red.matrix.setTranslate(-0.25, -0.75, 0.0);
  red.matrix.rotate(-5, 1, 0, 0);
  red.matrix.scale(0.5, 0.3, 0.5);
  red.render();

  // draw left arm
  var yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.matrix.setTranslate(0, -0.5, 0.0);
  yellow.matrix.rotate(-5, 1, 0, 0);
  yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinates = new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25, 0.7, 0.5);
  yellow.matrix.translate(-0.5, 0, 0);
  yellow.render();

  // test box
  var pink = new Cube();
  pink.color = [1, 0, 1, 1];
  pink.matrix = yellowCoordinates;
  pink.matrix.translate(0, 0.65, 0);
  pink.matrix.rotate(-g_pinkAngle, 0, 0, 1);
  pink.matrix.scale(0.3, 0.3, 0.3);
  pink.matrix.translate(-0.5, 0, -0.00005);
  pink.render();
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