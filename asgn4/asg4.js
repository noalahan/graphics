// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
    // v_VertPos = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform bool u_isShiny;
  uniform bool u_lightOn;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec3 u_lightColor;
  varying vec4 v_VertPos;

  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);// use normal
    } else if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;                  // use color
    } else if (u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);         // use UV debug
    } else if (u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);  // use texture0
    } else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);  // use texture1
    } else if (u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);  // use texture2
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);           // error, put red(ish)
    }  

    if (u_lightOn){
      vec3 lightVector = u_lightPos - vec3(v_VertPos);

      // red/green vis
      // float r = length(lightVector);
      // if (r < 1.0) {
      //   gl_FragColor = vec4(1, 0, 0, 1);
      // } else if (r < 2.0){
      //   gl_FragColor = vec4(0, 1, 0, 1);
      // }

      // light vis
      // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r), 1);

      // N dot L
      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N, L), 0.0);

      // reflection
      vec3 R = reflect(-L, N);

      // eye
      vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

      // phong
      float specular = pow(max(dot(E, R), 0.0), 10.0);
      vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.3;

      // specular condition for shiny surfaces
      if (u_isShiny) {
        gl_FragColor = vec4(u_lightColor * (specular + diffuse) + ambient, 1.0);
        // gl_FragColor = vec4(u_lightColor + 0.0 * (specular + diffuse + ambient), 1.0);
      } else {
        gl_FragColor = vec4(u_lightColor * diffuse + ambient, 1.0);
      }
    }
  }`;

// Global GL Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_NormalMatrix;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_isShiny;
let u_lightOn;
let u_lightPos;
let u_cameraPos;
let u_lightColor;

// texture values
let NORMAL = -3;
let COLOR = -2;
let SKY = 0;
let CODE = 1;
let HEDGE = 2;

// camera
var g_eye = new Vector([3, 0.5, 0]);
var g_at = new Vector([-5, 0.5, 0]);
var g_up = new Vector([0, 1, 0]);
let g_globalAngle = 0;

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

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  if (a_Normal < 0) {
    console.log("Failed to get the storage location of a_Normal");
    return;
  }

  // get the storage location of u_NormalMatrix
  u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  if (!u_NormalMatrix) {
    console.log("Failed to get the storage location of u_NormalMatrix");
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

  // Get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if (!u_Sampler2) {
    console.log("Failed to get the storage location of u_Sampler2");
    return false;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture");
    return false;
  }

  // Get the storage location of u_isShiny
  u_isShiny = gl.getUniformLocation(gl.program, "u_isShiny");
  if (!u_isShiny) {
    console.log("Failed to get the storage location of u_isShiny");
    return false;
  }

  // Get the storage location of u_lightOn
  u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn");
  if (!u_lightOn) {
    console.log("Failed to get the storage location of u_lightOn");
    return false;
  }

  // Get the storage location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
  if (!u_lightPos) {
    console.log("Failed to get the storage location of u_lightPos");
    return false;
  }

  // Get the storage location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, "u_cameraPos");
  if (!u_cameraPos) {
    console.log("Failed to get the storage location of u_cameraPos");
    return false;
  }

  // Get the storage location of u_lightColor
  u_lightColor = gl.getUniformLocation(gl.program, "u_lightColor");
  if (!u_lightColor) {
    console.log("Failed to get the storage location of u_lightColor");
    return false;
  }

  // set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// from testing
let g_yellowAngle = 0;
let g_pinkAngle = 0;
let g_yellowAnim = true;
let g_pinkAnim = true;

// let mouseTrack = true;
// let g_currentX = -10;
// let g_currentZ = 0;
let g_normalOn = false;
let g_lightPos = [0, 3, 0];
let g_lightOn = true;
let g_lightAnim = true;
let g_lightColor = [1, 1, 1];
/**
 * Sets all functions of elements defined in HTML
 */
function addActionsForHtmlUI() {
  // animation selector
  document.getElementById("non").onclick = function () {
    g_normalOn = true;
  };
  document.getElementById("noff").onclick = function () {
    g_normalOn = false;
  };
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
  document.getElementById("lAnimOn").onclick = function () {
    g_lightAnim = true;
  };
  document.getElementById("lAnimOff").onclick = function () {
    g_lightAnim = false;
  };
  //   // mouse movement
  //   let lastMouseX = null;
  //   let lastMouseY = null;
  //   document.addEventListener("mousemove", function (event) {
  //     if (mouseTrack) {
  //       let frontDir = g_eye.direction(g_at);
  //       let right = Vector.cross(g_up, frontDir);
  //       right.normalize();

  //       let deltaX = event.clientX - canvas.width / 2 - lastMouseX;
  //       let deltaY = event.clientY - canvas.width / 2 - lastMouseY;

  //       lastMouseX = event.clientX - canvas.width / 2;
  //       lastMouseY = event.clientY - canvas.width / 2;

  //       rotateCamera(-deltaX * 0.005, g_up);
  //       rotateCamera(deltaY * 0.005, right);
  //     }
  //   });
  //   // mouse movement toggle
  //   document.getElementById("mouse").onclick = function () {
  //     if (mouseTrack) {
  //       g_at.y = 0;
  //     }
  //     if (mouseTrack) {
  //       this.style.backgroundColor = "#edebe8";
  //     } else {
  //       this.style.backgroundColor = "#f3a5c0";
  //     }
  //     mouseTrack = !mouseTrack;
  //   };
  //   // reset location
  //   document.getElementById("reset").onclick = function () {
  //     g_eye = new Vector([-10, 0.6, 0]);
  //     g_at = new Vector([10, 0.6, 0]);
  //     document.getElementById("title").innerHTML = "";
  //   };

  //   rotation selector
  document.getElementById("angle").addEventListener("mousemove", function () {
    g_globalAngle = this.value;
  });

  // light selector
  document.getElementById("lx").addEventListener("mousemove", function (ev) {
    if (ev.buttons == 1) {
      g_lightPos[0] = this.value / 100;
      // renderAllShapes();
    }
  });
  document.getElementById("ly").addEventListener("mousemove", function (ev) {
    if (ev.buttons == 1) {
      g_lightPos[1] = this.value / 100;
      // renderAllShapes();
    }
  });
  document.getElementById("lz").addEventListener("mousemove", function (ev) {
    if (ev.buttons == 1) {
      g_lightPos[2] = this.value / 100;
      // renderAllShapes();
    }
  });
  document.getElementById("lon").onclick = function () {
    g_lightOn = true;
  };
  document.getElementById("loff").onclick = function () {
    g_lightOn = false;
  };
  document.getElementById("lColor").addEventListener("mousemove", function () {
    let a = this.value * 0.1;
    if (a < 1) {        // red
      g_lightColor[0] = 1;
      g_lightColor[1] = 1 - a;
      g_lightColor[2] = 1 - a;
    } else if (a < 2) { // yellow
      g_lightColor[0] = 1;
      g_lightColor[1] = a - 1;
      g_lightColor[2] = 0;
    } else if (a < 3) { // green
      g_lightColor[0] = 3 - a;
      g_lightColor[1] = 1;
      g_lightColor[2] = 0;
    } else if (a < 4) { // cyan
      g_lightColor[0] = 0;
      g_lightColor[1] = 1;
      g_lightColor[2] = a - 3;
    } else if (a < 5) { // blue
      g_lightColor[0] = 0;
      g_lightColor[1] = 5 - a;
      g_lightColor[2] = 1;
    } else if (a < 6) { // purple
      g_lightColor[0] = a - 5;
      g_lightColor[1] = 0;
      g_lightColor[2] = 1;
    }
    document.getElementById("color").style.backgroundColor =
      "rgb(" + g_lightColor[0] * 255 + "," + g_lightColor[1] * 255 + "," + g_lightColor[2] * 255 + ")";
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
  image0.src = "img/sky.png";

  // add texture1
  var image1 = new Image();
  if (!image1) {
    console.log("Failed to create the image object");
    return false;
  }
  image1.onload = function () {
    sendImageToTexture(image1, 1);
  };
  image1.src = "img/code.png";

  // add texture2
  var image2 = new Image();
  if (!image2) {
    console.log("Failed to create the image object");
    return false;
  }
  image2.onload = function () {
    sendImageToTexture(image2, 2);
  };
  image2.src = "img/hedge.png";

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
  } else if (n == 2) {
    gl.activeTexture(gl.TEXTURE2);
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
  } else if (n == 2) {
    gl.uniform1i(u_Sampler2, 2);
  }

  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  //   console.log("finished loadTexture" + n);
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  pigeonActions();

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
  pigeonAnim();
  if (g_yellowAnim) {
    g_yellowAngle = 45 * Math.sin(g_seconds);
  }
  if (g_pinkAnim) {
    g_pinkAngle = 45 * Math.sin(3 * g_seconds);
  }

  if (g_lightAnim) {
    g_lightPos[0] = 2 * Math.cos(g_seconds);
    document.getElementById("lx").value = Math.cos(g_seconds) * 200;

    g_lightPos[2] = 2 * Math.sin(g_seconds);
    document.getElementById("lz").value = Math.sin(g_seconds) * 200;
  }
}

/**
 * Changes camera placement on key press
 * @param {*} event Key press event
 */
function keydown(event) {
  let change = 0.1;

  // get front direction
  var frontDir = g_eye.direction(g_at);
  frontDir.y = 0;
  frontDir.mul(change);

  // get side direction
  var sideDir = Vector.cross(g_up, frontDir);
  sideDir.normalize();
  sideDir.mul(change);

  if (event.keyCode == 87) {
    // W: move forward
    g_eye.add(frontDir);
    g_at.add(frontDir);
  } else if (event.keyCode == 65) {
    // A: move left
    g_eye.add(sideDir);
    g_at.add(sideDir);
  } else if (event.keyCode == 83) {
    // S: move backward
    g_eye.setSub(frontDir);
    g_at.setSub(frontDir);
  } else if (event.keyCode == 68) {
    // D: move right
    g_eye.setSub(sideDir);
    g_at.setSub(sideDir);
  } else if (event.keyCode == 81) {
    // Q: move up
    g_eye.y += change;
    g_at.y += change;
    // rotateCamera(change * 0.5, g_up);
  } else if (event.keyCode == 69) {
    // E: move down
    g_eye.y -= change;
    g_at.y -= change;
    // rotateCamera(-change * 0.5, g_up);
  } else if (event.keyCode == 38) {
    // up arrow: look up
    g_at.y += change * 2;
  } else if (event.keyCode == 40) {
    // down arrow: look down
    g_at.y -= change * 2;
  } else if (event.keyCode == 37) {
    // left arrow: look left
    rotateCamera(change * 0.5, g_up);
  } else if (event.keyCode == 39) {
    // right arrow: look right
    rotateCamera(-change * 0.5, g_up);
  }

  renderAllShapes();
  // console.log(event.keyCode);
}

/**
 * Draws all shaped on screen
 */
function renderAllShapes() {
  // pass the projection matrix
  var projMat = new Matrix4();
  // (field of view, aspect ratio, near plane, far plane)
  projMat.setPerspective(70, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_eye.x,
    g_eye.y,
    g_eye.z,
    g_at.x,
    g_at.y,
    g_at.z,
    g_up.x,
    g_up.y,
    g_up.z
  ); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // pass the light to u_lightPos attribute
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  // pass the camera position to u_cameraPos attribute
  gl.uniform3f(u_cameraPos, g_eye.x, g_eye.y, g_eye.z);
  // pass the light status to u_lightOn attribute
  gl.uniform1i(u_lightOn, g_lightOn);
  // pass the light color to u_lightColor
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // console.log("Light Position:", u_lightPos);
  // console.log("Camera Position:", g_eye.x);

  // pigeon
  renderPigeon();

  // light
  var light = new Cube();
  light.color = [g_lightColor[0], g_lightColor[1], g_lightColor[2], 1];
  light.textureNum = COLOR;
  light.shiny = false;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.2, -0.2, -0.2);
  light.render();

  var red = new Cube();
  red.color = [1.0, 0.0, 0.0, 1.0];
  red.textureNum = 1;
  red.matrix.setTranslate(0, -0.5, 0);
  red.matrix.scale(0.6, 0.3, 0.6);
  red.render();

  var yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.textureNum = -2;
  yellow.matrix.translate(0, -0.5, 0);
  yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinates = new Matrix4(yellow.matrix);
  yellow.matrix.translate(0, 0.5, 0);
  yellow.matrix.scale(0.25, 0.7, 0.5);
  yellow.render();

  var pink = new Cube();
  pink.color = [1, 0, 1, 1];
  pink.matrix = yellowCoordinates;
  pink.matrix.translate(0, 0.8, 0);
  pink.matrix.rotate(-g_pinkAngle, 0, 0, 1);
  pink.matrix.translate(0, 0.2, 0);
  pink.matrix.scale(0.3, 0.3, 0.3);
  pink.render();

  // scene
  var sky = new Cube();
  sky.textureNum = SKY;
  sky.shiny = false;
  sky.matrix.translate(0, 0, 0);
  sky.matrix.scale(-8, -8, -8);
  sky.render();

  var floor = new Cube();
  floor.color = [35 / 255, 74 / 255, 8 / 255, 1];
  floor.textureNum = HEDGE;
  floor.matrix.translate(0, -0.75, 0);
  floor.matrix.scale(8, 0.2, 8);
  floor.render();

  var sphere = new Sphere();
  sphere.quality = 12;
  sphere.matrix.scale(0.5, 0.5, 0.5);
  sphere.matrix.translate(-1, 0, -2);
  sphere.matrix.rotate(g_seconds * 100, 0, 1, 0);
  sphere.render();
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
  document.getElementById("performance").innerHTML =
    "Performance -  ms:  " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration);

  // coordinate display
  //   document.getElementById("coor").innerHTML =
  //     "Coordinates:\n" + g_currentX.toFixed(2) + ", " + g_currentZ.toFixed(2);

  // Tell the browser to update again
  requestAnimationFrame(tick);
}
