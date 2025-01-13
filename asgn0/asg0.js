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
  var vect = document.getElementById("form");
  let x = vect.elements[0].value;
  let y = vect.elements[1].value;
  const v1 = new Vector3([x, y, 0]);

  x = vect.elements[2].value;
  y = vect.elements[3].value;
  const v2 = new Vector3([x, y, 0]);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawVector(v1, "red");
  drawVector(v2, "blue");
}
