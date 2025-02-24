class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -1;
  }

  slowrender() {
    var rgba = this.color;

    // pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // front of cube
    drawTriangle3DUV(
      [0, 0, 0, 1, 1, 0, 1, 0, 0],
      [0.25, 0.25, 0.5, 0.5, 0.5, 0.25]
    );
    drawTriangle3DUV(
      [0, 0, 0, 0, 1, 0, 1, 1, 0],
      [0.25, 0.25, 0.25, 0.5, 0.5, 0.5]
    );
    // back of cube
    drawTriangle3DUV(
      [0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0.25, 0.75, 0.5, 0.75, 0.25]
    );
    drawTriangle3DUV([0, 0, 1, 0, 1, 1, 1, 1, 1], [1, 0.25, 1, 0.5, 0.75, 0.5]);
    // pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );
    // top of cube
    drawTriangle3DUV(
      [0, 1, 0, 0, 1, 1, 1, 1, 1],
      [0.25, 0.5, 0.25, 0.75, 0.5, 0.75]
    );
    drawTriangle3DUV(
      [0, 1, 0, 1, 1, 1, 1, 1, 0],
      [0.25, 0.5, 0.5, 0.75, 0.5, 0.5]
    );
    // bottom of cube
    drawTriangle3DUV(
      [0, 0, 0, 0, 0, 1, 1, 0, 1],
      [0.25, 0.25, 0.25, 0, 0.5, 0]
    );
    drawTriangle3DUV(
      [0, 0, 0, 1, 0, 1, 1, 0, 0],
      [0.25, 0.25, 0.5, 0, 0.5, 0.25]
    );
    // pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );
    // left of cube
    drawTriangle3DUV(
      [1, 0, 0, 1, 1, 0, 1, 1, 1],
      [0.5, 0.25, 0.5, 0.5, 0.75, 0.5]
    );
    drawTriangle3DUV(
      [1, 0, 0, 1, 1, 1, 1, 0, 1],
      [0.5, 0.25, 0.75, 0.5, 0.75, 0.25]
    );
    // right of cube
    drawTriangle3DUV(
      [0, 0, 0, 0, 1, 0, 0, 1, 1],
      [0.25, 0.25, 0.25, 0.5, 0, 0.5]
    );
    drawTriangle3DUV(
      [0, 0, 0, 0, 1, 1, 0, 0, 1],
      [0.25, 0.25, 0, 0.5, 0, 0.25]
    );
  }
  renderWORKS() {
    var rgba = this.color;

    // pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];
    var alluvs = [];

    // front of cube
    allverts = allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]);
    alluvs = alluvs.concat([0.25, 0.25, 0.5, 0.5, 0.5, 0.25]);
    allverts = allverts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0.5, 0.5, 0.5]);
    // back of cube
    allverts = allverts.concat([0, 0, 1, 1, 1, 1, 1, 0, 1]);
    alluvs = alluvs.concat([1, 0.25, 0.75, 0.5, 0.75, 0.25]);
    allverts = allverts.concat([0, 0, 1, 0, 1, 1, 1, 1, 1]);
    alluvs = alluvs.concat([1, 0.25, 1, 0.5, 0.75, 0.5]);
    // pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.9,
      rgba[1] * 0.9,
      rgba[2] * 0.9,
      rgba[3]
    );
    // top of cube
    allverts = allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]);
    alluvs = alluvs.concat([0.25, 0.5, 0.25, 0.75, 0.5, 0.75]);
    allverts = allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]);
    alluvs = alluvs.concat([0.25, 0.5, 0.5, 0.75, 0.5, 0.5]);
    // bottom of cube
    allverts = allverts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0, 0.5, 0]);
    allverts = allverts.concat([0, 0, 0, 1, 0, 1, 1, 0, 0]);
    alluvs = alluvs.concat([0.25, 0.25, 0.5, 0, 0.5, 0.25]);
    // pass the color of a point to u_FragColor uniform variable
    gl.uniform4f(
      u_FragColor,
      rgba[0] * 0.8,
      rgba[1] * 0.8,
      rgba[2] * 0.8,
      rgba[3]
    );
    // left of cube
    allverts = allverts.concat([1, 0, 0, 1, 1, 0, 1, 1, 1]);
    alluvs = alluvs.concat([0.5, 0.25, 0.5, 0.5, 0.75, 0.5]);
    allverts = allverts.concat([1, 0, 0, 1, 1, 1, 1, 0, 1]);
    alluvs = alluvs.concat([0.5, 0.25, 0.75, 0.5, 0.75, 0.25]);
    // right of cube
    allverts = allverts.concat([0, 0, 0, 0, 1, 0, 0, 1, 1]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0.5, 0, 0.5]);
    allverts = allverts.concat([0, 0, 0, 0, 1, 1, 0, 0, 1]);
    alluvs = alluvs.concat([0.25, 0.25, 0, 0.5, 0, 0.25]);

    // console.log("All verts length:", allverts.length);
    // console.log("Expected vertex count:", allverts.length / 3);

    drawTriangle3DUV(allverts, alluvs);
  }
  render() {
    var rgba = this.color;

    // pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts = [];
    var alluvs = [];

    // front of cube
    allverts = allverts.concat([-0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.5, 0.5, 0.5, 0.25]);
    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0.5, 0.5, 0.5]);
    // back of cube
    allverts = allverts.concat([-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([1, 0.25, 0.75, 0.5, 0.75, 0.25]);
    allverts = allverts.concat([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([1, 0.25, 1, 0.5, 0.75, 0.5]);
    // top of cube
    allverts = allverts.concat([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.5, 0.25, 0.75, 0.5, 0.75]);
    allverts = allverts.concat([-0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.5, 0.5, 0.75, 0.5, 0.5]);
    // bottom of cube
    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0, 0.5, 0]);
    allverts = allverts.concat([-0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.5, 0, 0.5, 0.25]);
    // left of cube
    allverts = allverts.concat([0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([0.5, 0.25, 0.5, 0.5, 0.75, 0.5]);
    allverts = allverts.concat([0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([0.5, 0.25, 0.75, 0.5, 0.75, 0.25]);
    // right of cube
    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0.5, 0, 0.5]);
    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0, 0.5, 0, 0.25]);

    // console.log("All verts length:", allverts.length);
    // console.log("Expected vertex count:", allverts.length / 3);

    drawTriangle3DUV(allverts, alluvs);
  }
  
}

function drawTriangle3D(vertices) {
  if (vertices.length === 0) {
    console.log("Failed to get cube vertices");
    return;
  }
  var n = vertices.length / 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length / 3; // the number of vertices

  // --------
  // create a buffer object for positions
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // write the data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // assgin the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // --------
  // create a buffer object for UV
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // binf the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  // write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  // assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  // --------
  // draw the triangles
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
