class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.top = 1;
  }

  render() {
    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    let a = this.top;

    // front of cube
    drawTriangle3D([-.5, -.5, -0.5, .5, -.5, -.5, .5*a, .5, -.5]);
    drawTriangle3D([-.5, -.5, -0.5, -.5*a, .5, -.5, .5*a, .5, -.5]);
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );
    // back of cube
    drawTriangle3D([-.5, -.5, .5, .5, -.5, .5, .5*a, .5, .5]);
    drawTriangle3D([-.5, -.5, .5, -.5*a, .5, .5, .5*a, .5, .5]);
    
    // pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.7,
      rgba[1] * 0.7,
      rgba[2] * 0.7,
      rgba[3]
    );

    // top of cube
    drawTriangle3D([0.5*a, .5, -.5, .5*a, .5, .5, -.5*a, .5, -.5]);
    drawTriangle3D([-0.5*a, .5, .5, .5*a, .5, .5, -.5*a, .5, -.5]);

    // bottom of cube
    drawTriangle3D([-.5, -.5, -.5, -.5, -.5, .5, .5, -.5, .5]);
    drawTriangle3D([-.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5]);
    

    // pass the color of a point to u_FragColor uniform variable
    // gl.uniform4f(
    //   u_FragColor,
    //   rgba[0] * 0.8,
    //   rgba[1] * 0.8,
    //   rgba[2] * 0.8,
    //   rgba[3]
    // );

    // left of cube
    drawTriangle3D([.5, -.5, -.5, .5, -.5, .5, .5*a, .5, .5]);
    drawTriangle3D([.5, -.5, -.5, .5*a, .5, -.5, .5*a, .5, .5]);

    // right of cube
    drawTriangle3D([-.5, -.5, -.5, -.5, -.5, .5, -.5*a, .5, .5]);
    drawTriangle3D([-.5, -.5, -.5, -.5*a, .5, -.5, -.5*a, .5, .5]);

  }
}

function drawTriangle3D(vertices) {
  // var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}