class Cylinder {
  constructor() {
    this.type = "cylinder";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = -1;
    this.segments = 8;
    this.top = 1;
    this.bottom = 1;
  }

  render() {
    var rgba = this.color;

    // pass the texture number
    if (g_normalOn) this.textureNum = NORMAL;
    gl.uniform1i(u_whichTexture, this.textureNum);

    // pass the shiny attribute
    gl.uniform1i(u_isShiny, this.shiny);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Pass the normal matrix to u_NormalMatrix attribute
    this.normalMatrix.setInverseOf(this.matrix).transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    // Draw
    let angleStep = 360 / this.segments;
    let a = this.top;
    let b = this.bottom;
    var v = [];
    var uv = [];
    var norm = [];

    for (var angle = 0; angle < 360; angle += angleStep) {
      let centerPt = [0, 0];
      let angle1 = angle;
      let angle2 = angle + angleStep;
      let vec1 = [
        Math.cos((angle1 * Math.PI) / 180) * 0.5,
        Math.sin((angle1 * Math.PI) / 180) * 0.5,
      ];
      let vec2 = [
        Math.cos((angle2 * Math.PI) / 180) * 0.5,
        Math.sin((angle2 * Math.PI) / 180) * 0.5,
      ];
      let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
      let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];
      
      // circles
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      v = v.concat([0, 0, .5, pt1[0]*a, pt1[1]*a, .5, pt2[0]*a, pt2[1]*a, .5]);
      uv = uv.concat([0.5, 0.5, (pt1[0] + 1) / 2, (pt1[1] + 1) / 2, (pt2[0] + 1) / 2, (pt2[1] + 1) / 2]);     
        norm = norm.concat([0, 0, 1, 0, 0, 1, 0, 0, 1]); 

      v = v.concat([0, 0, -.5, pt1[0]*b, pt1[1]*b, -.5, pt2[0]*b, pt2[1]*b, -.5]);
      uv = uv.concat([0.5, 0.5, (pt1[0] + 1) / 2, (pt1[1] + 1) / 2, (pt2[0] + 1) / 2, (pt2[1] + 1) / 2]);
      norm = norm.concat([0, 0, -1, 0, 0, -1, 0, 0, -1]);

      v = v.concat([pt1[0]*a, pt1[1]*a, .5, pt1[0]*b, pt1[1]*b, -.5, pt2[0]*b, pt2[1]*b, -.5]);
      uv = uv.concat([angle1 / 360, 1, angle1 / 360, 0, angle2 / 360, 0]);
      norm = norm.concat([ pt1[0], pt1[1], 0, pt1[0], pt1[1], 0, pt2[0], pt2[1], 0]);

      v = v.concat([pt2[0]*b, pt2[1]*b, -.5, pt1[0]*a, pt1[1]*a, .5, pt2[0]*a, pt2[1]*a, .5]);
      uv = uv.concat([angle2 / 360, 0, angle1 / 360, 1, angle2 / 360, 1]);
      norm = norm.concat([pt2[0], pt2[1], 0, pt1[0], pt1[1], 0, pt2[0], pt2[1], 0]);
    }

    drawTriangle3DUVNormal(v, uv, norm)
  }
}
