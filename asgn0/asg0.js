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

  // draw the rectangle
  //ctx.fillStyle = "rgba(0, 0, 0, 1.0)"; // sets color to blue
  //ctx.fillRect(0, 0, 400, 400); // fill rect with color

  const v1 = new Vector3([2.25, 2.25, 0]);
  drawVector(v1, "red");
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
  ctx.stroke();
}

function handleDrawEvent() {
  var vect = document.getElementById("v1");
  let x = vect.elements[0].value;
  let y = vect.elements[1].value;
  const v1 = new Vector3([x, y, 0]);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawVector(v1, "red");
}
