class Sphere {
  constructor() {
    this.type = "sphere";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum = -1;
    this.shiny = true;
    this.quality = 7;
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

    var d = Math.PI/this.quality;
    var dd = Math.PI/this.quality;

    for (var t = 0; t < Math.PI; t+=d){
        for (var r = 0; r < (2 * Math.PI); r += d){
            var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];
            var p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
            var p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
            var p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

            var uv1 = [t/Math.PI, r/(2*Math.PI)];
            var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
            var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
            var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

            var v = [...p1, ...p2, ...p4, ...p1, ...p4, ...p3];
            var uv = [...uv1, ...uv2, ...uv4, ...uv1, ...uv4, ...uv3];
            drawTriangle3DUVNormal(v, uv, v);
        }
    }
  }
}

function sin(x){
    return Math.sin(x);
}
function cos(x){
    return Math.cos(x);
}
