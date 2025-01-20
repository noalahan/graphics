// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");
  // canvas.style.backgroundColor = "black";

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { perserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
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

  u_Size = gl.getUniformLocation(gl.program, "u_Size");
  if (!u_Size) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSeg = 10;

let r = 255,
  g = 255,
  b = 255;
function addActionsForHtmlUI() {
  // Clear canvas
  document.getElementById("clear").onclick = function () {
    g_shapesList = [];
    renderAllShapes();
  };

  // shape selector
  document.getElementById("sqr").onclick = function () {
    g_selectedType = POINT;
  };
  document.getElementById("tri").onclick = function () {
    g_selectedType = TRIANGLE;
  };
  document.getElementById("cir").onclick = function () {
    g_selectedType = CIRCLE;
  };

  // Color selector
  document.getElementById("r").addEventListener("mouseup", function () {
    r = (this.value / 100) * 255;
    document.getElementById("color").style.backgroundColor =
      "rgb(" + r + "," + g + "," + b + ")";
    g_selectedColor[0] = this.value / 100;
  });
  document.getElementById("g").addEventListener("mouseup", function () {
    g = (this.value / 100) * 255;
    document.getElementById("color").style.backgroundColor =
      "rgb(" + r + "," + g + "," + b + ")";
    g_selectedColor[1] = this.value / 100;
  });
  document.getElementById("b").addEventListener("mouseup", function () {
    b = (this.value / 100) * 255;
    document.getElementById("color").style.backgroundColor =
      "rgb(" + r + "," + g + "," + b + ")";
    g_selectedColor[2] = this.value / 100;
  });

  // size selector
  document.getElementById("size").addEventListener("mouseup", function () {
    g_selectedSize = this.value;
  });
  document.getElementById("seg").addEventListener("mouseup", function () {
    g_selectedSeg = this.value;
  });

  // document.getElementById("draw").onclick = painting();
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) {
    if (ev.buttons == 1) {
      click(ev);
    }
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gl.drawArrays(gl.POINTS, 0, n);
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

var g_shapesList = [];

function click(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_selectedSeg;
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();
}

function draw(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  // if (a_Position < 0) {
  //   console.log("Failed to get the storage location of a_Position");
  //   return -1;
  // }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

let color;
function painting() {
  gl = canvas.getContext("webgl", { perserveDrawingBuffer: true });
  // background
  color = [169 / 255, 214 / 255, 232 / 255, 1.0];
  draw([-1, -1, 1, -1, 1, 1]);
  draw([-1, -1, -1, 1, 1, 1]);

  // plane
  color = [248 / 255, 186 / 255, 18 / 255, 1.0];
  draw([-0.8, 0.5, -0.6, 0.2, 0.8, 0.1]);
  color = [229 / 255, 153 / 255, 24 / 255, 1.0];
  draw([-0.35, -0.3, -0.6, -0.4, -0.4, -0.1]);
  draw([-0.8, 0.5, -0.15, 0.15, -0.1, 0.15]);
  color = [210 / 255, 119 / 255, 29 / 255, 1.0];
  draw([-0.6, 0.2, -0.4, -0.1, 0.8, 0.1]);
  draw([-0.6, 0.2, -0.6, -0.4, -0.4, -0.1]);

  // coat
  color = [29 / 255, 62 / 255, 78 / 255, 1.0];
  draw([0.4, 0.1, 0.45, 0, 0.45, 0.3]);
  draw([0.6, 0, 0.45, 0, 0.45, 0.3]);
  draw([0.6, 0, 0.6, 0.3, 0.45, 0.3]);
  draw([0.6, 0, 0.6, 0.3, 0.65, 0.05]);

  // head
  color = [255 / 255, 202 / 255, 133 / 255, 1.0];
  draw([0.5, 0.45, 0.675, 0.4, 0.675, 0.5]);
  draw([0.5, 0.45, 0.675, 0.4, 0.6, 0.35]);
  draw([0.5, 0.45, 0.45, 0.35, 0.6, 0.35]);
  draw([0.5, 0.3, 0.45, 0.35, 0.6, 0.35]);
  color = [134 / 255, 67 / 255, 9 / 255, 1.0];
  draw([0.5, 0.45, 0.375, 0.5, 0.4, 0.55]);
  draw([0.5, 0.45, 0.45, 0.58, 0.4, 0.55]);
  draw([0.5, 0.45, 0.45, 0.58, 0.5, 0.6]); //?
  draw([0.5, 0.45, 0.55, 0.6, 0.5, 0.6]);
  draw([0.5, 0.45, 0.55, 0.6, 0.6, 0.58]);
  draw([0.5, 0.45, 0.65, 0.55, 0.6, 0.58]);
  draw([0.5, 0.45, 0.65, 0.55, 0.675, 0.5]);
  draw([0.5, 0.45, 0.375, 0.5, 0.475, 0.35]);
  draw([0.36, 0.44, 0.375, 0.5, 0.475, 0.35]);
  draw([0.36, 0.44, 0.3, 0.4, 0.475, 0.35]);
  draw([0.4, 0.35, 0.3, 0.4, 0.475, 0.35]);

  // goggles
  color = [58 / 255, 28 / 255, 4 / 255, 1.0];
  draw([0.69, 0.43, 0.69, 0.49, 0.35, 0.45]);
  color = [96 / 255, 48 / 255, 6 / 255, 1.0];
  draw([0.6, 0.5, 0.69, 0.49, 0.6, 0.42]);
  draw([0.69, 0.43, 0.69, 0.49, 0.6, 0.42]);
  color = [207 / 255, 232 / 255, 242 / 255, 1.0];
  draw([0.61, 0.49, 0.68, 0.48, 0.61, 0.43]);
  draw([0.68, 0.44, 0.68, 0.48, 0.61, 0.43]);

  // scarf
  color = [171 / 255, 52 / 255, 40 / 255, 1.0];
  draw([0.45, 0.3, 0.45, 0.35, 0.55, 0.275]);
  draw([0.45, 0.3, 0.6, 0.3, 0.55, 0.275]);
  draw([0.45, 0.3, 0.6, 0.3, 0.6, 0.35]);
  draw([0.45, 0.3, 0.45, 0.35, 0.35, 0.25]);
  draw([0.2, 0.3, 0.2, 0.4, 0.35, 0.25]);
  draw([0.3, 0.3, 0.4, 0.3, 0.35, 0.25]);

  // plane top wing
  color = [248 / 255, 186 / 255, 18 / 255, 1.0];
  draw([-0.4, -0.1, -0.3, -0.5, 0.8, 0.1]);
  color = [229 / 255, 153 / 255, 24 / 255, 1.0];
  draw([-0.1, -0.05, -0.3, -0.5, -0.065, -0.04]);
}
