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

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;

function addActionsForHtmlUI() {
  // Clear canvas
  document.getElementById("clear").onclick = function () {
    g_shapesList = [];
    renderAllShapes();
  };

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
    g_selectedColor[0] = this.value / 100;
  });
  document.getElementById("g").addEventListener("mouseup", function () {
    g_selectedColor[1] = this.value / 100;
  });
  document.getElementById("b").addEventListener("mouseup", function () {
    g_selectedColor[2] = this.value / 100;
  });

  // size selector
  document.getElementById("size").addEventListener("mouseup", function () {
    g_selectedSize = this.value;
  });
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

  // drawTriangles([0,0.5, -0.5,-0.5,  0.5,-0.5]);
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
  if (g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();
}

// function drawTriangles(vertices) {
//   // var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
//   var n = 3; // The number of vertices

//   // Create a buffer object
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log("Failed to create the buffer object");
//     return -1;
//   }

//   // Bind the buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   // Write date into the buffer object
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//   var a_Position = gl.getAttribLocation(gl.program, "a_Position");
//   if (a_Position < 0) {
//     console.log("Failed to get the storage location of a_Position");
//     return -1;
//   }
//   // Assign the buffer object to a_Position variable
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

//   // Enable the assignment to a_Position variable
//   gl.enableVertexAttribArray(a_Position);

//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }
