class Sphere {
  constructor() {
    this.type = "sphere";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // center ring
    let a = 0.1414;
    let x = a + 0.1;
    // drawTriangle3D([0, 0, 0, 1, 1, 0, 1, 0, 0]);
    drawTriangle3D([-0.1, -0.1, -x, 0.1, -0.1, -x, 0.1, 0.1, -x]);
    drawTriangle3D([-0.1, -0.1, -x, -0.1, 0.1, -x, 0.1, 0.1, -x]);
    drawTriangle3D([-0.1, -0.1, x, 0.1, -0.1, x, 0.1, 0.1, x]);
    drawTriangle3D([-0.1, -0.1, x, -0.1, 0.1, x, 0.1, 0.1, x]);

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );

    drawTriangle3D([-x, -0.1, -0.1, -x, 0.1, -0.1, -x, 0.1, 0.1]);
    drawTriangle3D([-x, -0.1, -0.1, -x, -0.1, 0.1, -x, 0.1, 0.1]);
    drawTriangle3D([x, -0.1, -0.1, x, 0.1, -0.1, x, 0.1, 0.1]);
    drawTriangle3D([x, -0.1, -0.1, x, -0.1, 0.1, x, 0.1, 0.1]);

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );

    drawTriangle3D([-x, -0.1, 0.1, -0.1, -0.1, x, -0.1, 0.1, x]);
    drawTriangle3D([-x, -0.1, 0.1, -x, 0.1, 0.1, -0.1, 0.1, x]);
    drawTriangle3D([x, -0.1, 0.1, 0.1, -0.1, x, 0.1, 0.1, x]);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1] + 1, rgba[2]+1, rgba[3]);
    
    drawTriangle3D([x, -0.1, 0.1, x, 0.1, 0.1, 0.1, 0.1, x]);
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );
    drawTriangle3D([-x, -0.1, -0.1, -0.1, -0.1, -x, -0.1, 0.1, -x]);
    drawTriangle3D([-x, -0.1, -0.1, -x, 0.1, -0.1, -0.1, 0.1, -x]);
    drawTriangle3D([x, -0.1, -0.1, 0.1, -0.1, -x, 0.1, 0.1, -x]);
    drawTriangle3D([x, -0.1, -0.1, x, 0.1, -0.1, 0.1, 0.1, -x]);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1] + 1, rgba[2], rgba[3]);

    // top
    drawTriangle3D([-0.1, x, -0.1, 0.1, x, -0.1, 0.1, x, 0.1]);
    drawTriangle3D([-0.1, x, -0.1, -0.1, x, 0.1, 0.1, x, 0.1]);

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      (rgba[1] + 1) * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );

    drawTriangle3D([0.1, x, -0.1, 0.1, x, 0.1, x, 0.1, -0.1]);
    drawTriangle3D([x, 0.1, 0.1, 0.1, x, 0.1, x, 0.1, -0.1]);
    drawTriangle3D([-0.1, x, -0.1, -0.1, x, 0.1, -x, 0.1, -0.1]);
    drawTriangle3D([-x, 0.1, 0.1, -0.1, x, 0.1, -x, 0.1, -0.1]);
    
    drawTriangle3D([-.1, x, .1, .1, x, .1, -.1, .1, x]);
    drawTriangle3D([.1, .1, x, .1, x, .1, -.1, .1, x]);
    drawTriangle3D([-.1, x, -.1, .1, x, -.1, -.1, .1, -x]);
    drawTriangle3D([.1, .1, -x, .1, x, -.1, -.1, .1, -x]);
    
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      (rgba[1] + 1) * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2] + 1, rgba[3]);
    // bottom
    drawTriangle3D([-.1, -x, -.1, .1, -x, -.1, .1, -x, .1]);
    drawTriangle3D([-.1, -x, -.1, -.1, -x, .1, .1, -x, .1]);

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      (rgba[2]+1) * 0.9,
      rgba[3]
    );

    drawTriangle3D([0.1, -x, -0.1, 0.1, -x, 0.1, x, -0.1, -0.1]);
    drawTriangle3D([x, -0.1, 0.1, 0.1, -x, 0.1, x, -0.1, -0.1]);
    drawTriangle3D([-0.1, -x, -0.1, -0.1, -x, 0.1, -x, -0.1, -0.1]);
    drawTriangle3D([-x, -0.1, 0.1, -0.1, -x, 0.1, -x, -0.1, -0.1]);

    drawTriangle3D([-.1, -x, .1, .1, -x, .1, -.1, -.1, x]);
    drawTriangle3D([.1, -.1, x, .1, -x, .1, -.1, -.1, x]);
    drawTriangle3D([-.1, -x, -.1, .1, -x, -.1, -.1, -.1, -x]);
    drawTriangle3D([.1, -.1, -x, .1, -x, -.1, -.1, -.1, -x]);

    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      (rgba[2]+1) * 0.8,
      rgba[3]
    );
    
  }
}
