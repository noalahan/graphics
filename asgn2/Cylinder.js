class Cylinder {
  constructor() {
    this.type = "cylinder";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.segments = 8;
    this.top = 1;
    this.bottom = 1;
  }

  render() {
    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Draw
    let angleStep = 360 / this.segments;
    let a = this.top;
    let b = this.bottom;
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
      drawTriangle3D([0, 0, .5, pt1[0]*a, pt1[1]*a, .5, pt2[0]*a, pt2[1]*a, .5]);
      drawTriangle3D([0, 0, -.5, pt1[0]*b, pt1[1]*b, -.5, pt2[0]*b, pt2[1]*b, -.5]);
      
      // sides
      gl.uniform4f(
        u_FragColor,
        rgba[0] * 0.8,
        rgba[1] * 0.8,
        rgba[2] * 0.8,
        rgba[3]
      );
      drawTriangle3D([pt1[0]*a, pt1[1]*a, .5, pt1[0]*b, pt1[1]*b, -.5, pt2[0]*b, pt2[1]*b, -.5]);
      drawTriangle3D([pt2[0]*b, pt2[1]*b, -.5, pt1[0]*a, pt1[1]*a, .5, pt2[0]*a, pt2[1]*a, .5]);
      
    }
  }
}
