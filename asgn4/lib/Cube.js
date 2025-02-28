class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = -1;
    this.shiny = true;
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
    if (this.shiny) {
      this.normalMatrix.setInverseOf(this.matrix).transpose();
    }
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    var allverts = [];
    var alluvs = [];
    var allnorms = [];

    // front of cube
    allverts = allverts.concat([-0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.5, 0.5, 0.5, 0.25]);
    allnorms = allnorms.concat([0, 0, -1, 0, 0, -1, 0, 0, -1]);

    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0.5, 0.5, 0.5]);
    allnorms = allnorms.concat([0, 0, -1, 0, 0, -1, 0, 0, -1]);
    
    // back of cube
    allverts = allverts.concat([-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([1, 0.25, 0.75, 0.5, 0.75, 0.25]);
    allnorms = allnorms.concat([0, 0, 1, 0, 0, 1, 0, 0, 1]);

    allverts = allverts.concat([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([1, 0.25, 1, 0.5, 0.75, 0.5]);
    allnorms = allnorms.concat([0, 0, 1, 0, 0, 1, 0, 0, 1]);

    // top of cube
    allverts = allverts.concat([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.5, 0.25, 0.75, 0.5, 0.75]);
    allnorms = allnorms.concat([0, 1, 0, 0, 1, 0, 0, 1, 0]);

    allverts = allverts.concat([-0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.5, 0.5, 0.75, 0.5, 0.5]);
    allnorms = allnorms.concat([0, 1, 0, 0, 1, 0, 0, 1, 0]);

    // bottom of cube
    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0, 0.5, 0]);
    allnorms = allnorms.concat([0, -1, 0, 0, -1, 0, 0, -1, 0]);

    allverts = allverts.concat([-0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.5, 0, 0.5, 0.25]);
    allnorms = allnorms.concat([0, -1, 0, 0, -1, 0, 0, -1, 0]);

    // left of cube
    allverts = allverts.concat([0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([0.5, 0.25, 0.5, 0.5, 0.75, 0.5]);
    allnorms = allnorms.concat([1, 0, 0, 1, 0, 0, 1, 0, 0]);

    allverts = allverts.concat([0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([0.5, 0.25, 0.75, 0.5, 0.75, 0.25]);
    allnorms = allnorms.concat([1, 0, 0, 1, 0, 0, 1, 0, 0]);

    // right of cube
    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0.25, 0.5, 0, 0.5]);
    allnorms = allnorms.concat([-1, 0, 0, -1, 0, 0, -1, 0, 0]);

    allverts = allverts.concat([-0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5]);
    alluvs = alluvs.concat([0.25, 0.25, 0, 0.5, 0, 0.25]);
    allnorms = allnorms.concat([-1, 0, 0, -1, 0, 0, -1, 0, 0]);

    // console.log("All verts length:", allverts.length);
    // console.log("Expected vertex count:", allverts.length / 3);

    drawTriangle3DUVNormal(allverts, alluvs, allnorms);
  }
  
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
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
  // create a buffer object for Normals
  var normalBuffer = gl.createBuffer();
  if (!normalBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // binf the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  // write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

  // assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

  // enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Normal);

  // --------
  // draw the triangles
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
