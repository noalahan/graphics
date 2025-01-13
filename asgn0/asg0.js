var ctx, canvas;
function main() {
  // retrieve canvas element
  canvas = document.getElementById("canvas");
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }
  canvas.style.backgroundColor = "black";

  // get the rendering context for 2DCG
  ctx = canvas.getContext("2d");
}

/**
 * Draws input vector
 * @param {Vector3} v draws a vector in the canvas
 * @param {string} color color to draw the vector in
 */
function drawVector(v, color) {
  // get coordinates
  let x = v.elements[0];
  let y = v.elements[1];

  // Start a new Path
  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo(200 + 20 * x, 200 - 20 * y);

  // Draw the Path
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
}

/**
 * Processes input data into vectors to be drawn
 */
function handleDrawEvent() {
  // set vector 1
  var vect = document.getElementById("vect_form");
  let x = vect.elements[0].value;
  let y = vect.elements[1].value;
  const v1 = new Vector3([x, y, 0]);

  // set vector 2
  x = vect.elements[2].value;
  y = vect.elements[3].value;
  const v2 = new Vector3([x, y, 0]);

  // clear canvas and draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawVector(v1, "red");
  drawVector(v2, "blue");
}

/**
 * Uses input vectors and their dot product to calculate the angle between them
 * @param {Vector3} v1 First vector
 * @param {Vector3} v2 Second vector
 * @returns angle between the two vectors
 */
function angleBetween(v1, v2) {
  let dot = Vector3.dot(v1, v2);
  let m1 = v1.magnitude();
  let m2 = v2.magnitude();

  // get angle and convert it to degreen
  let angle = Math.acos(dot / m1 / m2);
  angle *= 180 / Math.PI;
  return angle;
}

/**
 * Calculates the area of the triangle formed by the vectors
 * @param {Vector3} v1 First vector
 * @param {Vector3} v2 Second vector
 * @returns area
 */
function areaTriangle(v1, v2) {
  let v3 = Vector3.cross(v1, v2);
  return v3.magnitude() / 2;
}

/**
 * Runs the correct function
 * @param {string} op operation to be performed
 * @param {Vector3} v1 First vector
 * @param {Vector3} v2 Second vector
 * @param {int} s Scalar (for mult and div)
 */
function operate(op, v1, v2, s) {
  if (op == "add") {
    v1.add(v2);
    drawVector(v1, "green");
  } else if (op == "sub") {
    v1.sub(v2);
    drawVector(v1, "green");
  } else if (op == "mul") {
    v1.mul(s);
    v2.mul(s);
    drawVector(v1, "green");
    drawVector(v2, "green");
  } else if (op == "div") {
    v1.div(s);
    v2.div(s);
    drawVector(v1, "green");
    drawVector(v2, "green");
  } else if (op == "mag") {
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  } else if (op == "nor") {
    v1.normalize();
    v2.normalize();
    drawVector(v1, "green");
    drawVector(v2, "green");
  } else if (op == "ang") {
    console.log("Angle: " + angleBetween(v1, v2));
  } else if (op == "area") {
    console.log("Area of the triangle: " + areaTriangle(v1, v2));
  }
}

function handleDrawOperationEvent() {
  // get vectors
  var vect = document.getElementById("vect_form");
  let x = vect.elements[0].value;
  let y = vect.elements[1].value;
  const v1 = new Vector3([x, y, 0]);
  x = vect.elements[2].value;
  y = vect.elements[3].value;
  const v2 = new Vector3([x, y, 0]);

  // draw vectors
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawVector(v1, "red");
  drawVector(v2, "blue");

  // get operation
  var ops = document.getElementById("ops_form");
  let operation = ops.elements[0].value;
  let s = ops.elements[1].value;

  // do operation
  operate(operation, v1, v2, s);
}
