// cuon-matrix.js (c) 2012 kanda and matsuda
/**
 * This is a class treating 4x4 matrix.
 * This class contains the function that is equivalent to OpenGL matrix stack.
 * The matrix after conversion is calculated by multiplying a conversion matrix from the right.
 * The matrix is replaced by the calculated result.
 */

class Vector {
  constructor(opt_src) {
    this.elements = new Float32Array(3);
    if (opt_src && opt_src.length === 3) {
      this.elements.set(opt_src);
    }
  }

  get x() {
    return this.elements[0];
  }
  get y() {
    return this.elements[1];
  }
  get z() {
    return this.elements[2];
  }
  set x(value) {
    this.elements[0] = value;
  }
  set y(value) {
    this.elements[1] = value;
  }
  set z(value) {
    this.elements[2] = value;
  }

  /**
   * Copy vector.
   * @param src source vector
   * @return this
   */
  set(src) {
    this.x = src.x;
    this.y = src.y;
    this.z = src.z;

    return this;
  }

  /**
   * Add other to this vector.
   * @return this
   */
  add(other) {
    this.elements[0] += other.elements[0];
    this.elements[1] += other.elements[1];
    this.elements[2] += other.elements[2];

    return this;
  }

  /**
   * Subtract other from this vector.
   * @return this
   */
  setSub(other) {
    this.elements[0] -= other.elements[0];
    this.elements[1] -= other.elements[1];
    this.elements[2] -= other.elements[2];

    return this;
  }

  /**
   * Subtract vec2 from vec1.
   * @return this
   */
  sub(vec1, vec2) {
    var diff = new Vector();
    diff.elements[0] = vec1.x - vec2.x;
    diff.elements[1] = vec1.y - vec2.y;
    diff.elements[2] = vec1.z - vec2.z;

    return diff;
  }

  /**
   * Divide this vector by a scalar.
   * @return this
   */
  div(scalar) {
    this.elements[0] /= scalar;
    this.elements[1] /= scalar;
    this.elements[2] /= scalar;

    return this;
  }

  /**
   * Multiply this vector by a scalar.
   * @return this
   */
  mul(scalar) {
    this.elements[0] *= scalar;
    this.elements[1] *= scalar;
    this.elements[2] *= scalar;

    return this;
  }

  /**
   * Calcualte the dot product between this vector and other.
   * @return scalar
   */
  static dot(other1, other2) {
    let x1 = other1.elements[0];
    let y1 = other1.elements[1];
    let z1 = other1.elements[2];
    let x2 = other2.elements[0];
    let y2 = other2.elements[1];
    let z2 = other2.elements[2];

    return x1 * x2 + y1 * y2 + z1 * z2;
  }

  /**
   * Calcualte the cross product between this vector and other.
   * @return new vector
   */
  static cross(other1, other2) {
    let x1 = other1.elements[0];
    let y1 = other1.elements[1];
    let z1 = other1.elements[2];
    let x2 = other2.elements[0];
    let y2 = other2.elements[1];
    let z2 = other2.elements[2];

    let x3 = y1 * z2 - z1 * y2;
    let y3 = z1 * x2 - x1 * z2;
    let z3 = x1 * y2 - y1 * x2;

    let v3 = new Vector([x3, y3, z3]);

    return v3;
  }

  /**
   * Calculate the magnitude (or length) of this vector.
   * @return scalar
   */
  magnitude() {
    let x = this.elements[0];
    let y = this.elements[1];
    let z = this.elements[2];

    let m = Math.sqrt(x * x + y * y + z * z);

    return m;
  }

  /**
   * Normalize this vector.
   * @return this
   */
  normalize() {
    let m = this.magnitude();

    this.elements[0] /= m;
    this.elements[1] /= m;
    this.elements[2] /= m;

    return this;
  }

  /**
   * Find direction from this to input vector
   * @param {Vector} vect at vector
   * @returns normalized direction vector
   */
  direction(vect) {
    var dir = this.sub(vect, this);
    dir.normalize();
    return dir;
  }
}

function rotateCamera(angle, axis) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  
  var ux = axis.x, uy = axis.y, uz = axis.z;
  
  // Rotation matrix components
  var rotationMatrix = [
    [cos + (1 - cos) * ux * ux, (1 - cos) * ux * uy - sin * uz, (1 - cos) * ux * uz + sin * uy],
    [(1 - cos) * uy * ux + sin * uz, cos + (1 - cos) * uy * uy, (1 - cos) * uy * uz - sin * ux],
    [(1 - cos) * uz * ux - sin * uy, (1 - cos) * uz * uy + sin * ux, cos + (1 - cos) * uz * uz]
  ];
  
  // Step 2: Compute the new direction for g_at (view direction)
  var viewDir = g_eye.sub(g_at, g_eye);  // g_at - g_eye
  var newViewDir = new Vector();
  
  newViewDir.x = rotationMatrix[0][0] * viewDir.x + rotationMatrix[0][1] * viewDir.y + rotationMatrix[0][2] * viewDir.z;
  newViewDir.y = rotationMatrix[1][0] * viewDir.x + rotationMatrix[1][1] * viewDir.y + rotationMatrix[1][2] * viewDir.z;
  newViewDir.z = rotationMatrix[2][0] * viewDir.x + rotationMatrix[2][1] * viewDir.y + rotationMatrix[2][2] * viewDir.z;

  // Step 3: Update g_at with the new direction
  g_at = new Vector([g_eye.x + newViewDir.x, g_eye.y + newViewDir.y, g_eye.z + newViewDir.z]);
}
