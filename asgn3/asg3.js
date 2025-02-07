// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;

  void main() {
    if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;                 // use color
    } else if (u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);        // use UV debug
    } else if (u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV); // use texture0
    } else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV); // use texture0
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);          // error, put red(ish)
    }  
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
// let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

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

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV");
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

  // get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return;
  }

  // get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture");
    return false;
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

/**
 * Sets all functions of elements defined in HTML
 */
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

/**
 * Sets all sampler textures
 * @returns true if ran successfully
 */
function initTextures() {
  // add texture0
  var image0 = new Image(); // Create the image object
  if (!image0) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image0.onload = function () {
    sendImageToTexture(image0, 0);
  };
  // Tell the browser to load an image
  image0.src = "img/sky.jpg";

  // add texture1
  var image1 = new Image();
  if (!image1) {
    console.log("Failed to create the image object");
    return false;
  }
  image1.onload = function () {
    sendImageToTexture(image1, 1);
  };
  image1.src = "img/code.jpg";

  return true;
}

/**
 * Saves input image to texture n
 * @param {Image} image Texture n image object
 * @returns true if ran successfully
 */
function sendImageToTexture(image, n) {
  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit n
  if (n == 0) {
    gl.activeTexture(gl.TEXTURE0);
  } else if (n == 1) {
    gl.activeTexture(gl.TEXTURE1);
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit n to the sampler
  if (n == 0) {
    gl.uniform1i(u_Sampler0, 0);
  } else if (n == 1) {
    gl.uniform1i(u_Sampler1, 1);
  }

  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log("finished loadTexture" + n);
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  document.onkeydown = keydown;
  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Render
  // renderAllShapes();
  requestAnimationFrame(tick);
}

/**
 * Increment animated elements
 */
function updateAnim() {
  if (g_yellowAnim) {
    g_yellowAngle = 45 * Math.sin(g_seconds);
  }
  if (g_pinkAnim) {
    g_pinkAngle = 45 * Math.sin(3 * g_seconds);
  }
}

var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];
/**
 * Changes camera placement on key press
 * @param {*} event Key press event
 */
function keydown(event) {
  let change = 0.1;
  if (event.keyCode == 87) {
    // W
    g_eye[2] += change;
  } else if (event.keyCode == 65) {
    // A
    g_eye[0] += change;
  } else if (event.keyCode == 83) {
    // S
    g_eye[2] -= change;
  } else if (event.keyCode == 68) {
    // D
    g_eye[0] -= change;
  } else if (event.keyCode == 81) {
    // Q
    // rotate left
  } else if (event.keyCode == 69) {
    // E
    // rotate right
  }

  renderAllShapes();
  console.log(event.keyCode);
}

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
];

//function drawMap() {
// for (let x = 0; x < 8; x++) {
//   for (let y = 0; y < 8; y++) {
//     if (g_map[x][y] == 1) {
//       var block = new Cube();
//       block.color = [1, 1, 0, 1];
//       block.matrix.translate(x - 4, -0.75, y - 4);
//       block.render();
//     }
//   }
// }
//}

function drawMap() {
  for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
      if (x<1 || x==31 || y==0 || y==31){
        var body = new Cube();
        body.color = [0.8, 1, 1, 1];
        body.matrix.translate(0, -.75, 0);
        body.matrix.scale(.4, .4, .4);
        body.matrix.translate(x-16, 0, y-16);
        body.render()
      }
    }
  }
}

/**
 * Draws all shaped on screen
 */
function renderAllShapes() {
  // // check the time at the start of this function
  // var startTime = performance.now();

  // pass the projection matrix
  var projMat = new Matrix4();
  // (field of view, aspect ratio, near plane, far plane)
  projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_eye[0],
    g_eye[1],
    g_eye[2],
    g_at[0],
    g_at[1],
    g_at[2],
    g_up[0],
    g_up[1],
    g_up[2]
  ); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // floor
  var floor = new Cube();
  floor.color = [0, 1, 0, 1];
  floor.matrix.translate(0, -0.75, 0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  drawMap();

  // draw the body cube
  var red = new Cube();
  red.color = [1.0, 0.0, 0.0, 1.0];
  red.textureNum = 1;
  red.matrix.setTranslate(-0.25, -0.75, 0.0);
  red.matrix.rotate(-5, 1, 0, 0);
  red.matrix.scale(0.5, 0.3, 0.5);
  red.render();

  // draw left arm
  var yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.textureNum = 0;
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

/**
 * calls animation and render functions
 */
function tick() {
  // save current time
  var startTime = performance.now();
  g_seconds = performance.now() / 1000.0 - g_startTime;
  // console.log(g_seconds);

  // update animation angles
  updateAnim();

  // Draw everything
  renderAllShapes();

  // check running time
  var duration = performance.now() - startTime;
  document.getElementById("perf").innerHTML =
    "  ms:  " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration);

  // Tell the browser to update again
  requestAnimationFrame(tick);
}
