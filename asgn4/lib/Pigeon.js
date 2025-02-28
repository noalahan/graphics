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

function pigeonActions() {
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
  });
  document.getElementById("pos").addEventListener("mousemove", function () {
    g_bodyPos = this.value * 0.01;
  });

  // body rotations
  document.getElementById("body").addEventListener("mousemove", function () {
    g_bodyAngle = this.value;
  });
  document.getElementById("neck").addEventListener("mousemove", function () {
    g_neckAngle = this.value;
  });
  document.getElementById("head").addEventListener("mousemove", function () {
    g_headAngle = this.value;
  });
  // wing rotations
  document.getElementById("lWing").addEventListener("mousemove", function () {
    g_lWingAngle = this.value;
  });
  document.getElementById("rWing").addEventListener("mousemove", function () {
    g_rWingAngle = this.value;
  });
  // left leg rotations
  document.getElementById("lLeg").addEventListener("mousemove", function () {
    g_lLegAngle = this.value;
  });
  document.getElementById("lCalf").addEventListener("mousemove", function () {
    g_lCalfAngle = this.value;
  });
  document.getElementById("lFoot").addEventListener("mousemove", function () {
    g_lFootAngle = this.value;
  });
  // right left rotations
  document.getElementById("rLeg").addEventListener("mousemove", function () {
    g_rLegAngle = this.value;
  });
  document.getElementById("rCalf").addEventListener("mousemove", function () {
    g_rCalfAngle = this.value;
  });
  document.getElementById("rFoot").addEventListener("mousemove", function () {
    g_rFootAngle = this.value;
  });
}

function pigeonAnim() {
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
function renderPigeon() {
  // body
  var base = new Sphere();
  base.color = bodyColor;
  base.textureNum = COLOR;
  base.matrix.setTranslate(0, 0.2 + g_bodyHeight, g_bodyPos);
  base.matrix.rotate(g_bodyAngle, 1, 0, 0);
  let baseCoor = new Matrix4(base.matrix);
  base.matrix.scale(1.55, 1, 2);
  base.matrix.scale(0.25, 0.25, 0.25);
  base.render();

  var chest = new Sphere();
  chest.color = bodyColor;
  chest.textureNum = COLOR;
  chest.matrix = baseCoor;
  chest.matrix.translate(0, 0.1, -0.25);
  chest.matrix.rotate(-25, 1, 0, 0);
  chest.matrix.scale(1.6, 1.3, 1.3);
//   chest.matrix.scale(0.25, 0.25, 0.25);
  let chestCoor = new Matrix4(chest.matrix);
//   chest.render();

  var upperChest = new Sphere();
  upperChest.color = bodyColor;
  upperChest.textureNum = COLOR;
  upperChest.matrix = new Matrix4(chestCoor);
  upperChest.matrix.rotate(-g_neckAngle * 0.9, 1, 0, 0);
  upperChest.matrix.translate(0, 0.05, 0);
  upperChest.matrix.scale(0.25, 0.3, 0.25);
  upperChest.matrix.rotate(10, 1, 0, 0);
  upperChest.matrix.rotate(20, 0, 1, 0);
  upperChest.render();

  var back = new Cube();
  back.color = bodyColor;
  back.textureNum = COLOR;
//   back.top = 0.8;
  back.matrix = new Matrix4(baseCoor);
  back.matrix.translate(0, -0.08, 0.33);
  back.matrix.rotate(-40, 1, 0, 0);
  back.matrix.scale(0.4, 0.5, 0.1);
  back.render();

  // wings
  var lShoulder = new Sphere();
  lShoulder.color = wingColor;
  lShoulder.textureNum = COLOR;
  lShoulder.matrix = new Matrix4(baseCoor);
  lShoulder.matrix.rotate(25, 1, 0, 0);
  lShoulder.matrix.rotate(g_lWingAngle, 1, 0, 0);
  let lWingCoor = new Matrix4(lShoulder.matrix);
  lShoulder.matrix.rotate(15, 0, 0, 1);
  lShoulder.matrix.translate(0.23, 0.06, 0.1);
  lShoulder.matrix.scale(0.05, 0.175, 0.175);
  lShoulder.render();

  var lWing = new Cylinder();   // cylindar
  lWing.color = wingColor;
//   lWing.textureNum = COLOR;
  lWing.top = 0;
  lWing.matrix = new Matrix4(lWingCoor);
  lWing.matrix.translate(0.215, 0.05, 0.4);
  lWing.matrix.rotate(13, 1, 0, 0);
  lWing.matrix.rotate(15, 0, 0, 1);
  lWing.matrix.scale(0.1, 0.34, 0.55);
  lWing.render();

  var rShoulder = new Sphere();
  rShoulder.color = wingColor;
  rShoulder.textureNum = COLOR;
  rShoulder.matrix = new Matrix4(baseCoor);
  rShoulder.matrix.rotate(25, 1, 0, 0);
  rShoulder.matrix.rotate(g_rWingAngle, 1, 0, 0);
  let rWingCoor = new Matrix4(rShoulder.matrix);
  rShoulder.matrix.rotate(-15, 0, 0, 1);
  rShoulder.matrix.translate(-0.23, 0.06, 0.1);
  rShoulder.matrix.scale(0.05, 0.175, 0.175);
  rShoulder.render();

  var rWing = new Cylinder();   // cylindar
  rWing.color = wingColor;
  rWing.textureNum = COLOR;
  rWing.top = 0;
  rWing.matrix = new Matrix4(rWingCoor);
  rWing.matrix.translate(-0.215, 0.05, 0.4);
  rWing.matrix.rotate(13, 1, 0, 0);
  rWing.matrix.rotate(-15, 0, 0, 1);
  rWing.matrix.scale(0.1, 0.34, 0.55);
  rWing.render();

  // tail
  var tailBase = new Cube();
//   tailBase.color = bodyColor;
tailBase.color = [1, 0, 0, 1];
  tailBase.textureNum = COLOR;
  tailBase.matrix = new Matrix4(baseCoor);
  tailBase.matrix.translate(0, -0.29, 0.49);
  tailBase.matrix.rotate(50, 1, 0, 0);
  tailBase.matrix.scale(0.85, 0.25, 0.51);
//   tailBase.matrix.scale(0.25, 0.25, 0.25);
//   tailBase.render();

//   g_globalAngle = 90;
g_lightAnim = false;

  var tail = new Cube();
  tail.color = blackColor;
  tail.textureNum = COLOR;
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

  var pink = new Cube();    // cylindar
  pink.color = [0.631, 0.259, 0.624, 1];
  pink.textureNum = COLOR;
  pink.bottom = 0.7;
  pink.top = 1.1;
  pink.matrix = new Matrix4(chestCoor);
  pink.matrix.rotate(-g_neckAngle, 1, 0, 0);
  let neckCoor = new Matrix4(pink.matrix);
  pink.matrix.translate(0, 0.25, 0.01 - z);
  pink.matrix.rotate(-20, 1, 0, 0);
  pink.matrix.scale(0.35, 0.2, 0.4);
  pink.matrix.rotate(120, 1, 0, 0);
//   pink.render();

  var backPink = new Cube();    // cylindar
  backPink.color = [0.631, 0.259, 0.624, 1];
  backPink.textureNum = COLOR;
  backPink.top = 0.9;
  backPink.bottom = 1.05;
  backPink.matrix = new Matrix4(neckCoor);
  backPink.matrix.translate(0, 0.26, 0.19);
  backPink.matrix.rotate(-85, 1, 0, 0);
  backPink.matrix.scale(0.35, 0.3, 0.1);
//   backPink.render();

  var green = new Cube();   // cylindar
  // green.color = [0.314, 0.541, 0.357, 1];
  green.color = [0.271, 0.588, 0.329, 1];
  green.textureNum = COLOR;
  green.bottom = 0.78;
  green.top = 1.13;
  green.matrix = new Matrix4(neckCoor);
  green.matrix.translate(0, 0.35, 0.19);
  green.matrix.rotate(g_greenAngle, 1, 0, 0);
  green.matrix.scale(0.29, 0.15, 0.34);
  green.matrix.rotate(100, 1, 0, 0);
//   green.render();

  let headY = 0.2;
  let headZ = 0.15;
  let headCoor = new Matrix4(neckCoor);
  headCoor.translate(0, headY + g_headY, headZ + g_headZ);

  // head
  var head = new Sphere();
  head.color = headColor;
  head.textureNum = COLOR;
  head.matrix = new Matrix4(headCoor);
  head.matrix.rotate(g_headAngle, 1, 0, 0);
  let chinCoor = new Matrix4(head.matrix);
  head.matrix.translate(0, 0.47 - headY, 0.24 - headZ);
  head.matrix.scale(0.55, 0.55, 0.55);
  head.matrix.rotate(25, 1, 0, 0);
//   head.render();

  var chin = new Cube();    // cylindar
  chin.color = headColor;
  chin.textureNum = COLOR;
  chin.matrix = new Matrix4(chinCoor);
  chin.matrix.translate(0, 0.42 - headY, 0.213 - headZ);
  chin.matrix.rotate(0, 1, 0, 0);
  chin.matrix.scale(0.28, 0.1, 0.3);
  chin.matrix.rotate(100, 1, 0, 0);
//   chin.render();

  var beak = new Cube();    // cylindar
  beak.color = blackColor;
  beak.textureNum = COLOR;
  beak.top = 0;
  beak.matrix = new Matrix4(chinCoor);
  beak.matrix.rotate(205, 1, 0, 0);
  beak.matrix.translate(0, -0.29, 0.21);
  beak.matrix.scale(0.08, 0.07, 0.1);
//   beak.render();

  var beakBase = new Sphere();
  beakBase.color = bodyColor;
  beakBase.textureNum = COLOR;
  beakBase.matrix = new Matrix4(chinCoor);
  beakBase.matrix.translate(0, 0.34, -0.015);
  beakBase.matrix.rotate(25, 1, 0, 0);
  beakBase.matrix.scale(0.17, 0.17, 0.1);
//   beakBase.render();

  // eyes
  var lEye = new Sphere();
  lEye.color = eyeColor;
  lEye.textureNum = COLOR;
  lEye.matrix = new Matrix4(chinCoor);
  lEye.matrix.rotate(25, 0, 1, 1);
  lEye.matrix.rotate(25, 1, 0, 0);
  lEye.matrix.translate(0.185, 0.295, 0.01);
  lEye.matrix.scale(0.1, 0.2, 0.2);
//   lEye.render();
  var lPupil = new Sphere();
  lPupil.color = blackColor;
  lPupil.textureNum = COLOR;
  lPupil.matrix = lEye.matrix;
  lPupil.matrix.translate(0.18, 0, 0);
  lPupil.matrix.scale(0.5, 0.5, 0.5);
//   lPupil.render();

  var rEye = new Sphere();
  rEye.color = eyeColor;
  rEye.textureNum = COLOR;
  rEye.matrix = new Matrix4(chinCoor);
  rEye.matrix.rotate(-25, 0, 1, 1);
  rEye.matrix.rotate(25, 1, 0, 0);
  rEye.matrix.translate(-0.185, 0.295, 0.01);
  rEye.matrix.scale(0.1, 0.2, 0.2);
//   rEye.render();
  var rPupil = new Sphere();
  rPupil.color = blackColor;
  rPupil.textureNum = COLOR;
  rPupil.matrix = rEye.matrix;
  rPupil.matrix.translate(-0.18, 0, 0);
  rPupil.matrix.scale(0.5, 0.5, 0.5);
//   rPupil.render();

  // legs
  var lThigh = new Cube();  // cylindar
  lThigh.color = legColor;
  lThigh.textureNum = COLOR;
  lThigh.matrix = new Matrix4(baseCoor);
  lThigh.matrix.rotate(25, 1, 0, 0);
  lThigh.matrix.translate(0.1, 0.1, 0.07);
  lThigh.matrix.rotate(g_lLegAngle - 10, 1, 0, 0);
  let lThighCoor = new Matrix4(lThigh.matrix);
  lThigh.matrix.rotate(90, 1, 0, 0);
  lThigh.matrix.translate(0, 0, 0.3);
  lThigh.matrix.scale(0.06, 0.06, 0.37);
//   lThigh.render();

  var lCalf = new Cube();   // cylindar
  lCalf.color = legColor;
  lCalf.textureNum = COLOR;
  lCalf.bottom = 0.7;
  lCalf.matrix = new Matrix4(lThighCoor);
  lCalf.matrix.translate(0, -0.47, 0);
  lCalf.matrix.rotate(g_lCalfAngle - 40, 1, 0, 0);
  let lCalfCoor = new Matrix4(lCalf.matrix);
  lCalf.matrix.translate(0, 0, -0.07);
  lCalf.matrix.scale(0.06, 0.06, 0.17);
//   lCalf.render();

  var lFoot = new Cube();
  lFoot.color = legColor;
  lFoot.textureNum = COLOR;
  lFoot.top = 0.4;
  lFoot.matrix = new Matrix4(lCalfCoor);
  lFoot.matrix.translate(0, 0, -0.15);
  lFoot.matrix.rotate(180, 1, 0, 0);
  lFoot.matrix.rotate(g_lFootAngle - 40, 1, 0, 0);
  lFoot.matrix.scale(0.15, 0.2, 0.03);
//   lFoot.render();

  var rThigh = new Cube();  // cylindar
  rThigh.color = legColor;
  rThigh.textureNum = COLOR;
  rThigh.matrix = new Matrix4(baseCoor);
  rThigh.matrix.rotate(25, 1, 0, 0);
  rThigh.matrix.translate(-0.1, 0.1, 0.07);
  rThigh.matrix.rotate(g_rLegAngle - 10, 1, 0, 0);
  let rThighCoor = new Matrix4(rThigh.matrix);
  rThigh.matrix.rotate(90, 1, 0, 0);
  rThigh.matrix.translate(0, 0, 0.3);
  rThigh.matrix.scale(0.06, 0.06, 0.37);
//   rThigh.render();

  var rCalf = new Cube();   // cylindar
  rCalf.color = legColor;
  rCalf.textureNum = COLOR;
  rCalf.bottom = 0.7;
  rCalf.matrix = new Matrix4(rThighCoor);
  rCalf.matrix.translate(0, -0.47, 0);
  rCalf.matrix.rotate(g_rCalfAngle - 40, 1, 0, 0);
  let rCalfCoor = new Matrix4(rCalf.matrix);
  rCalf.matrix.translate(0, 0, -0.07);
  rCalf.matrix.scale(0.06, 0.06, 0.17);
//   rCalf.render();

  var rFoot = new Cube();
  rFoot.color = legColor;
  rFoot.textureNum = COLOR;
  rFoot.top = 0.4;
  rFoot.matrix = new Matrix4(rCalfCoor);
  rFoot.matrix.translate(0, 0, -0.15);
  rFoot.matrix.rotate(180, 1, 0, 0);
  rFoot.matrix.rotate(g_rFootAngle - 40, 1, 0, 0);
  rFoot.matrix.scale(0.15, 0.2, 0.03);
//   rFoot.render();
}