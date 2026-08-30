/*! CosmoGraph 3D demo bundle — the plugin's own renderer (SphericalGraph) with the
 *  sample vault from github.com/n1ghtmare-dev/obsidian-cosmograph — MIT licence.
 *  Bundles three.js (c) 2010-2025 three.js authors — MIT licence, https://threejs.org
 */
var Ya = Object.defineProperty;
var Ka = (i, e, t) => e in i ? Ya(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var xe = (i, e, t) => Ka(i, typeof e != "symbol" ? e + "" : e, t);
const bt = "srgb", Jn = "srgb-linear", nr = "linear", Ke = "srgb";
const ls = "300 es";
class ti {
  /**
   * Adds the given event listener to the given event type.
   *
   * @param {string} type - The type of event to listen to.
   * @param {Function} listener - The function that gets called when the event is fired.
   */
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
  }
  /**
   * Returns `true` if the given event listener has been added to the given event type.
   *
   * @param {string} type - The type of event.
   * @param {Function} listener - The listener to check.
   * @return {boolean} Whether the given event listener has been added to the given event type.
   */
  hasEventListener(e, t) {
    const n = this._listeners;
    return n === void 0 ? !1 : n[e] !== void 0 && n[e].indexOf(t) !== -1;
  }
  /**
   * Removes the given event listener from the given event type.
   *
   * @param {string} type - The type of event.
   * @param {Function} listener - The listener to remove.
   */
  removeEventListener(e, t) {
    const n = this._listeners;
    if (n === void 0) return;
    const r = n[e];
    if (r !== void 0) {
      const s = r.indexOf(t);
      s !== -1 && r.splice(s, 1);
    }
  }
  /**
   * Dispatches an event object.
   *
   * @param {Object} event - The event that gets fired.
   */
  dispatchEvent(e) {
    const t = this._listeners;
    if (t === void 0) return;
    const n = t[e.type];
    if (n !== void 0) {
      e.target = this;
      const r = n.slice(0);
      for (let s = 0, a = r.length; s < a; s++)
        r[s].call(this, e);
      e.target = null;
    }
  }
}
const St = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let cs = 1234567;
const mi = Math.PI / 180, _i = 180 / Math.PI;
function en() {
  const i = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (St[i & 255] + St[i >> 8 & 255] + St[i >> 16 & 255] + St[i >> 24 & 255] + "-" + St[e & 255] + St[e >> 8 & 255] + "-" + St[e >> 16 & 15 | 64] + St[e >> 24 & 255] + "-" + St[t & 63 | 128] + St[t >> 8 & 255] + "-" + St[t >> 16 & 255] + St[t >> 24 & 255] + St[n & 255] + St[n >> 8 & 255] + St[n >> 16 & 255] + St[n >> 24 & 255]).toLowerCase();
}
function He(i, e, t) {
  return Math.max(e, Math.min(t, i));
}
function Zr(i, e) {
  return (i % e + e) % e;
}
function Za(i, e, t, n, r) {
  return n + (i - e) * (r - n) / (t - e);
}
function $a(i, e, t) {
  return i !== e ? (t - i) / (e - i) : 0;
}
function gi(i, e, t) {
  return (1 - t) * i + t * e;
}
function ja(i, e, t, n) {
  return gi(i, e, 1 - Math.exp(-t * n));
}
function Ja(i, e = 1) {
  return e - Math.abs(Zr(i, e * 2) - e);
}
function Qa(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * (3 - 2 * i));
}
function eo(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : (i = (i - e) / (t - e), i * i * i * (i * (i * 6 - 15) + 10));
}
function to(i, e) {
  return i + Math.floor(Math.random() * (e - i + 1));
}
function no(i, e) {
  return i + Math.random() * (e - i);
}
function io(i) {
  return i * (0.5 - Math.random());
}
function ro(i) {
  i !== void 0 && (cs = i);
  let e = cs += 1831565813;
  return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
}
function so(i) {
  return i * mi;
}
function ao(i) {
  return i * _i;
}
function oo(i) {
  return (i & i - 1) === 0 && i !== 0;
}
function lo(i) {
  return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2));
}
function co(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function ho(i, e, t, n, r) {
  const s = Math.cos, a = Math.sin, o = s(t / 2), c = a(t / 2), l = s((e + n) / 2), h = a((e + n) / 2), f = s((e - n) / 2), d = a((e - n) / 2), p = s((n - e) / 2), g = a((n - e) / 2);
  switch (r) {
    case "XYX":
      i.set(o * h, c * f, c * d, o * l);
      break;
    case "YZY":
      i.set(c * d, o * h, c * f, o * l);
      break;
    case "ZXZ":
      i.set(c * f, c * d, o * h, o * l);
      break;
    case "XZX":
      i.set(o * h, c * g, c * p, o * l);
      break;
    case "YXY":
      i.set(c * p, o * h, c * g, o * l);
      break;
    case "ZYZ":
      i.set(c * g, c * p, o * h, o * l);
      break;
    default:
      console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + r);
  }
}
function Ht(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function Ze(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const mt = {
  DEG2RAD: mi,
  RAD2DEG: _i,
  /**
   * Generate a [UUID]{@link https://en.wikipedia.org/wiki/Universally_unique_identifier}
   * (universally unique identifier).
   *
   * @static
   * @method
   * @return {string} The UUID.
   */
  generateUUID: en,
  /**
   * Clamps the given value between min and max.
   *
   * @static
   * @method
   * @param {number} value - The value to clamp.
   * @param {number} min - The min value.
   * @param {number} max - The max value.
   * @return {number} The clamped value.
   */
  clamp: He,
  /**
   * Computes the Euclidean modulo of the given parameters that
   * is `( ( n % m ) + m ) % m`.
   *
   * @static
   * @method
   * @param {number} n - The first parameter.
   * @param {number} m - The second parameter.
   * @return {number} The Euclidean modulo.
   */
  euclideanModulo: Zr,
  /**
   * Performs a linear mapping from range `<a1, a2>` to range `<b1, b2>`
   * for the given value.
   *
   * @static
   * @method
   * @param {number} x - The value to be mapped.
   * @param {number} a1 - Minimum value for range A.
   * @param {number} a2 - Maximum value for range A.
   * @param {number} b1 - Minimum value for range B.
   * @param {number} b2 - Maximum value for range B.
   * @return {number} The mapped value.
   */
  mapLinear: Za,
  /**
   * Returns the percentage in the closed interval `[0, 1]` of the given value
   * between the start and end point.
   *
   * @static
   * @method
   * @param {number} x - The start point
   * @param {number} y - The end point.
   * @param {number} value - A value between start and end.
   * @return {number} The interpolation factor.
   */
  inverseLerp: $a,
  /**
   * Returns a value linearly interpolated from two known points based on the given interval -
   * `t = 0` will return `x` and `t = 1` will return `y`.
   *
   * @static
   * @method
   * @param {number} x - The start point
   * @param {number} y - The end point.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {number} The interpolated value.
   */
  lerp: gi,
  /**
   * Smoothly interpolate a number from `x` to `y` in  a spring-like manner using a delta
   * time to maintain frame rate independent movement. For details, see
   * [Frame rate independent damping using lerp]{@link http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/}.
   *
   * @static
   * @method
   * @param {number} x - The current point.
   * @param {number} y - The target point.
   * @param {number} lambda - A higher lambda value will make the movement more sudden,
   * and a lower value will make the movement more gradual.
   * @param {number} dt - Delta time in seconds.
   * @return {number} The interpolated value.
   */
  damp: ja,
  /**
   * Returns a value that alternates between `0` and the given `length` parameter.
   *
   * @static
   * @method
   * @param {number} x - The value to pingpong.
   * @param {number} [length=1] - The positive value the function will pingpong to.
   * @return {number} The alternated value.
   */
  pingpong: Ja,
  /**
   * Returns a value in the range `[0,1]` that represents the percentage that `x` has
   * moved between `min` and `max`, but smoothed or slowed down the closer `x` is to
   * the `min` and `max`.
   *
   * See [Smoothstep]{@link http://en.wikipedia.org/wiki/Smoothstep} for more details.
   *
   * @static
   * @method
   * @param {number} x - The value to evaluate based on its position between min and max.
   * @param {number} min - The min value. Any x value below min will be `0`.
   * @param {number} max - The max value. Any x value above max will be `1`.
   * @return {number} The alternated value.
   */
  smoothstep: Qa,
  /**
   * A [variation on smoothstep]{@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
   * that has zero 1st and 2nd order derivatives at x=0 and x=1.
   *
   * @static
   * @method
   * @param {number} x - The value to evaluate based on its position between min and max.
   * @param {number} min - The min value. Any x value below min will be `0`.
   * @param {number} max - The max value. Any x value above max will be `1`.
   * @return {number} The alternated value.
   */
  smootherstep: eo,
  /**
   * Returns a random integer from `<low, high>` interval.
   *
   * @static
   * @method
   * @param {number} low - The lower value boundary.
   * @param {number} high - The upper value boundary
   * @return {number} A random integer.
   */
  randInt: to,
  /**
   * Returns a random float from `<low, high>` interval.
   *
   * @static
   * @method
   * @param {number} low - The lower value boundary.
   * @param {number} high - The upper value boundary
   * @return {number} A random float.
   */
  randFloat: no,
  /**
   * Returns a random integer from `<-range/2, range/2>` interval.
   *
   * @static
   * @method
   * @param {number} range - Defines the value range.
   * @return {number} A random float.
   */
  randFloatSpread: io,
  /**
   * Returns a deterministic pseudo-random float in the interval `[0, 1]`.
   *
   * @static
   * @method
   * @param {number} [s] - The integer seed.
   * @return {number} A random float.
   */
  seededRandom: ro,
  /**
   * Converts degrees to radians.
   *
   * @static
   * @method
   * @param {number} degrees - A value in degrees.
   * @return {number} The converted value in radians.
   */
  degToRad: so,
  /**
   * Converts radians to degrees.
   *
   * @static
   * @method
   * @param {number} radians - A value in radians.
   * @return {number} The converted value in degrees.
   */
  radToDeg: ao,
  /**
   * Returns `true` if the given number is a power of two.
   *
   * @static
   * @method
   * @param {number} value - The value to check.
   * @return {boolean} Whether the given number is a power of two or not.
   */
  isPowerOfTwo: oo,
  /**
   * Returns the smallest power of two that is greater than or equal to the given number.
   *
   * @static
   * @method
   * @param {number} value - The value to find a POT for.
   * @return {number} The smallest power of two that is greater than or equal to the given number.
   */
  ceilPowerOfTwo: lo,
  /**
   * Returns the largest power of two that is less than or equal to the given number.
   *
   * @static
   * @method
   * @param {number} value - The value to find a POT for.
   * @return {number} The largest power of two that is less than or equal to the given number.
   */
  floorPowerOfTwo: co,
  /**
   * Sets the given quaternion from the [Intrinsic Proper Euler Angles]{@link https://en.wikipedia.org/wiki/Euler_angles}
   * defined by the given angles and order.
   *
   * Rotations are applied to the axes in the order specified by order:
   * rotation by angle `a` is applied first, then by angle `b`, then by angle `c`.
   *
   * @static
   * @method
   * @param {Quaternion} q - The quaternion to set.
   * @param {number} a - The rotation applied to the first axis, in radians.
   * @param {number} b - The rotation applied to the second axis, in radians.
   * @param {number} c - The rotation applied to the third axis, in radians.
   * @param {('XYX'|'XZX'|'YXY'|'YZY'|'ZXZ'|'ZYZ')} order - A string specifying the axes order.
   */
  setQuaternionFromProperEuler: ho,
  /**
   * Normalizes the given value according to the given typed array.
   *
   * @static
   * @method
   * @param {number} value - The float value in the range `[0,1]` to normalize.
   * @param {TypedArray} array - The typed array that defines the data type of the value.
   * @return {number} The normalize value.
   */
  normalize: Ze,
  /**
   * Denormalizes the given value according to the given typed array.
   *
   * @static
   * @method
   * @param {number} value - The value to denormalize.
   * @param {TypedArray} array - The typed array that defines the data type of the value.
   * @return {number} The denormalize (float) value in the range `[0,1]`.
   */
  denormalize: Ht
};
class we {
  /**
   * Constructs a new 2D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   */
  constructor(e = 0, t = 0) {
    we.prototype.isVector2 = !0, this.x = e, this.y = t;
  }
  /**
   * Alias for {@link Vector2#x}.
   *
   * @type {number}
   */
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  /**
   * Alias for {@link Vector2#y}.
   *
   * @type {number}
   */
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @return {Vector2} A reference to this vector.
   */
  set(e, t) {
    return this.x = e, this.y = t, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector2} A reference to this vector.
   */
  setScalar(e) {
    return this.x = e, this.y = e, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setX(e) {
    return this.x = e, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setY(e) {
    return this.y = e, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y.
   * @param {number} value - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y.
   * @return {number} A vector component value.
   */
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector2} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector2} v - The vector to copy.
   * @return {Vector2} A reference to this vector.
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector2} v - The vector to add.
   * @return {Vector2} A reference to this vector.
   */
  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector2} A reference to this vector.
   */
  addScalar(e) {
    return this.x += e, this.y += e, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector2} a - The first vector.
   * @param {Vector2} b - The second vector.
   * @return {Vector2} A reference to this vector.
   */
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector2} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector2} A reference to this vector.
   */
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector2} v - The vector to subtract.
   * @return {Vector2} A reference to this vector.
   */
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector2} A reference to this vector.
   */
  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector2} a - The first vector.
   * @param {Vector2} b - The second vector.
   * @return {Vector2} A reference to this vector.
   */
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector2} v - The vector to multiply.
   * @return {Vector2} A reference to this vector.
   */
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector2} A reference to this vector.
   */
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector2} v - The vector to divide.
   * @return {Vector2} A reference to this vector.
   */
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector2} A reference to this vector.
   */
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  /**
   * Multiplies this vector (with an implicit 1 as the 3rd component) by
   * the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to apply.
   * @return {Vector2} A reference to this vector.
   */
  applyMatrix3(e) {
    const t = this.x, n = this.y, r = e.elements;
    return this.x = r[0] * t + r[3] * n + r[6], this.y = r[1] * t + r[4] * n + r[7], this;
  }
  /**
   * If this vector's x or y value is greater than the given vector's x or y
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector2} v - The vector.
   * @return {Vector2} A reference to this vector.
   */
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }
  /**
   * If this vector's x or y value is less than the given vector's x or y
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector2} v - The vector.
   * @return {Vector2} A reference to this vector.
   */
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }
  /**
   * If this vector's x or y value is greater than the max vector's x or y
   * value, it is replaced by the corresponding value.
   * If this vector's x or y value is less than the min vector's x or y value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector2} min - The minimum x and y values.
   * @param {Vector2} max - The maximum x and y values in the desired range.
   * @return {Vector2} A reference to this vector.
   */
  clamp(e, t) {
    return this.x = He(this.x, e.x, t.x), this.y = He(this.y, e.y, t.y), this;
  }
  /**
   * If this vector's x or y values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x or y values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector2} A reference to this vector.
   */
  clampScalar(e, t) {
    return this.x = He(this.x, e, t), this.y = He(this.y, e, t), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector2} A reference to this vector.
   */
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(He(n, e, t));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector2} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x and y = -y.
   *
   * @return {Vector2} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector2} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  /**
   * Calculates the cross product of the given vector with this instance.
   *
   * @param {Vector2} v - The vector to compute the cross product with.
   * @return {number} The result of the cross product.
   */
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0) to (x, y). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0) to (x, y).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector2} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Computes the angle in radians of this vector with respect to the positive x-axis.
   *
   * @return {number} The angle in radians.
   */
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  /**
   * Returns the angle between the given vector and this instance in radians.
   *
   * @param {Vector2} v - The vector to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(He(n, -1, 1));
  }
  /**
   * Computes the distance from the given vector to this instance.
   *
   * @param {Vector2} v - The vector to compute the distance to.
   * @return {number} The distance.
   */
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  /**
   * Computes the squared distance from the given vector to this instance.
   * If you are just comparing the distance with another distance, you should compare
   * the distance squared instead as it is slightly more efficient to calculate.
   *
   * @param {Vector2} v - The vector to compute the squared distance to.
   * @return {number} The squared distance.
   */
  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y;
    return t * t + n * n;
  }
  /**
   * Computes the Manhattan distance from the given vector to this instance.
   *
   * @param {Vector2} v - The vector to compute the Manhattan distance to.
   * @return {number} The Manhattan distance.
   */
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector2} A reference to this vector.
   */
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector2} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector2} A reference to this vector.
   */
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector2} A reference to this vector.
   */
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector2} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]` and y
   * value to be `array[ offset + 1 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector2} A reference to this vector.
   */
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector2} A reference to this vector.
   */
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this;
  }
  /**
   * Rotates this vector around the given center by the given angle.
   *
   * @param {Vector2} center - The point around which to rotate.
   * @param {number} angle - The angle to rotate, in radians.
   * @return {Vector2} A reference to this vector.
   */
  rotateAround(e, t) {
    const n = Math.cos(t), r = Math.sin(t), s = this.x - e.x, a = this.y - e.y;
    return this.x = s * n - a * r + e.x, this.y = s * r + a * n + e.y, this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector2} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class wn {
  /**
   * Constructs a new quaternion.
   *
   * @param {number} [x=0] - The x value of this quaternion.
   * @param {number} [y=0] - The y value of this quaternion.
   * @param {number} [z=0] - The z value of this quaternion.
   * @param {number} [w=1] - The w value of this quaternion.
   */
  constructor(e = 0, t = 0, n = 0, r = 1) {
    this.isQuaternion = !0, this._x = e, this._y = t, this._z = n, this._w = r;
  }
  /**
   * Interpolates between two quaternions via SLERP. This implementation assumes the
   * quaternion data are managed  in flat arrays.
   *
   * @param {Array<number>} dst - The destination array.
   * @param {number} dstOffset - An offset into the destination array.
   * @param {Array<number>} src0 - The source array of the first quaternion.
   * @param {number} srcOffset0 - An offset into the first source array.
   * @param {Array<number>} src1 -  The source array of the second quaternion.
   * @param {number} srcOffset1 - An offset into the second source array.
   * @param {number} t - The interpolation factor in the range `[0,1]`.
   * @see {@link Quaternion#slerp}
   */
  static slerpFlat(e, t, n, r, s, a, o) {
    let c = n[r + 0], l = n[r + 1], h = n[r + 2], f = n[r + 3];
    const d = s[a + 0], p = s[a + 1], g = s[a + 2], _ = s[a + 3];
    if (o === 0) {
      e[t + 0] = c, e[t + 1] = l, e[t + 2] = h, e[t + 3] = f;
      return;
    }
    if (o === 1) {
      e[t + 0] = d, e[t + 1] = p, e[t + 2] = g, e[t + 3] = _;
      return;
    }
    if (f !== _ || c !== d || l !== p || h !== g) {
      let m = 1 - o;
      const u = c * d + l * p + h * g + f * _, A = u >= 0 ? 1 : -1, E = 1 - u * u;
      if (E > Number.EPSILON) {
        const C = Math.sqrt(E), R = Math.atan2(C, u * A);
        m = Math.sin(m * R) / C, o = Math.sin(o * R) / C;
      }
      const M = o * A;
      if (c = c * m + d * M, l = l * m + p * M, h = h * m + g * M, f = f * m + _ * M, m === 1 - o) {
        const C = 1 / Math.sqrt(c * c + l * l + h * h + f * f);
        c *= C, l *= C, h *= C, f *= C;
      }
    }
    e[t] = c, e[t + 1] = l, e[t + 2] = h, e[t + 3] = f;
  }
  /**
   * Multiplies two quaternions. This implementation assumes the quaternion data are managed
   * in flat arrays.
   *
   * @param {Array<number>} dst - The destination array.
   * @param {number} dstOffset - An offset into the destination array.
   * @param {Array<number>} src0 - The source array of the first quaternion.
   * @param {number} srcOffset0 - An offset into the first source array.
   * @param {Array<number>} src1 -  The source array of the second quaternion.
   * @param {number} srcOffset1 - An offset into the second source array.
   * @return {Array<number>} The destination array.
   * @see {@link Quaternion#multiplyQuaternions}.
   */
  static multiplyQuaternionsFlat(e, t, n, r, s, a) {
    const o = n[r], c = n[r + 1], l = n[r + 2], h = n[r + 3], f = s[a], d = s[a + 1], p = s[a + 2], g = s[a + 3];
    return e[t] = o * g + h * f + c * p - l * d, e[t + 1] = c * g + h * d + l * f - o * p, e[t + 2] = l * g + h * p + o * d - c * f, e[t + 3] = h * g - o * f - c * d - l * p, e;
  }
  /**
   * The x value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  /**
   * The y value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  /**
   * The z value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  /**
   * The w value of this quaternion.
   *
   * @type {number}
   * @default 1
   */
  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }
  /**
   * Sets the quaternion components.
   *
   * @param {number} x - The x value of this quaternion.
   * @param {number} y - The y value of this quaternion.
   * @param {number} z - The z value of this quaternion.
   * @param {number} w - The w value of this quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  set(e, t, n, r) {
    return this._x = e, this._y = t, this._z = n, this._w = r, this._onChangeCallback(), this;
  }
  /**
   * Returns a new quaternion with copied values from this instance.
   *
   * @return {Quaternion} A clone of this instance.
   */
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  /**
   * Copies the values of the given quaternion to this instance.
   *
   * @param {Quaternion} quaternion - The quaternion to copy.
   * @return {Quaternion} A reference to this quaternion.
   */
  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the rotation specified by the given
   * Euler angles.
   *
   * @param {Euler} euler - The Euler angles.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromEuler(e, t = !0) {
    const n = e._x, r = e._y, s = e._z, a = e._order, o = Math.cos, c = Math.sin, l = o(n / 2), h = o(r / 2), f = o(s / 2), d = c(n / 2), p = c(r / 2), g = c(s / 2);
    switch (a) {
      case "XYZ":
        this._x = d * h * f + l * p * g, this._y = l * p * f - d * h * g, this._z = l * h * g + d * p * f, this._w = l * h * f - d * p * g;
        break;
      case "YXZ":
        this._x = d * h * f + l * p * g, this._y = l * p * f - d * h * g, this._z = l * h * g - d * p * f, this._w = l * h * f + d * p * g;
        break;
      case "ZXY":
        this._x = d * h * f - l * p * g, this._y = l * p * f + d * h * g, this._z = l * h * g + d * p * f, this._w = l * h * f - d * p * g;
        break;
      case "ZYX":
        this._x = d * h * f - l * p * g, this._y = l * p * f + d * h * g, this._z = l * h * g - d * p * f, this._w = l * h * f + d * p * g;
        break;
      case "YZX":
        this._x = d * h * f + l * p * g, this._y = l * p * f + d * h * g, this._z = l * h * g - d * p * f, this._w = l * h * f - d * p * g;
        break;
      case "XZY":
        this._x = d * h * f - l * p * g, this._y = l * p * f - d * h * g, this._z = l * h * g + d * p * f, this._w = l * h * f + d * p * g;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return t === !0 && this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the given axis and angle.
   *
   * @param {Vector3} axis - The normalized axis.
   * @param {number} angle - The angle in radians.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromAxisAngle(e, t) {
    const n = t / 2, r = Math.sin(n);
    return this._x = e.x * r, this._y = e.y * r, this._z = e.z * r, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the given rotation matrix.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromRotationMatrix(e) {
    const t = e.elements, n = t[0], r = t[4], s = t[8], a = t[1], o = t[5], c = t[9], l = t[2], h = t[6], f = t[10], d = n + o + f;
    if (d > 0) {
      const p = 0.5 / Math.sqrt(d + 1);
      this._w = 0.25 / p, this._x = (h - c) * p, this._y = (s - l) * p, this._z = (a - r) * p;
    } else if (n > o && n > f) {
      const p = 2 * Math.sqrt(1 + n - o - f);
      this._w = (h - c) / p, this._x = 0.25 * p, this._y = (r + a) / p, this._z = (s + l) / p;
    } else if (o > f) {
      const p = 2 * Math.sqrt(1 + o - n - f);
      this._w = (s - l) / p, this._x = (r + a) / p, this._y = 0.25 * p, this._z = (c + h) / p;
    } else {
      const p = 2 * Math.sqrt(1 + f - n - o);
      this._w = (a - r) / p, this._x = (s + l) / p, this._y = (c + h) / p, this._z = 0.25 * p;
    }
    return this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion to the rotation required to rotate the direction vector
   * `vFrom` to the direction vector `vTo`.
   *
   * @param {Vector3} vFrom - The first (normalized) direction vector.
   * @param {Vector3} vTo - The second (normalized) direction vector.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromUnitVectors(e, t) {
    let n = e.dot(t) + 1;
    return n < 1e-8 ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
  }
  /**
   * Returns the angle between this quaternion and the given one in radians.
   *
   * @param {Quaternion} q - The quaternion to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(e) {
    return 2 * Math.acos(Math.abs(He(this.dot(e), -1, 1)));
  }
  /**
   * Rotates this quaternion by a given angular step to the given quaternion.
   * The method ensures that the final quaternion will not overshoot `q`.
   *
   * @param {Quaternion} q - The target quaternion.
   * @param {number} step - The angular step in radians.
   * @return {Quaternion} A reference to this quaternion.
   */
  rotateTowards(e, t) {
    const n = this.angleTo(e);
    if (n === 0) return this;
    const r = Math.min(1, t / n);
    return this.slerp(e, r), this;
  }
  /**
   * Sets this quaternion to the identity quaternion; that is, to the
   * quaternion that represents "no rotation".
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  identity() {
    return this.set(0, 0, 0, 1);
  }
  /**
   * Inverts this quaternion via {@link Quaternion#conjugate}. The
   * quaternion is assumed to have unit length.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  invert() {
    return this.conjugate();
  }
  /**
   * Returns the rotational conjugate of this quaternion. The conjugate of a
   * quaternion represents the same rotation in the opposite direction about
   * the rotational axis.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  /**
   * Calculates the dot product of this quaternion and the given one.
   *
   * @param {Quaternion} v - The quaternion to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  /**
   * Computes the squared Euclidean length (straight-line length) of this quaternion,
   * considered as a 4 dimensional vector. This can be useful if you are comparing the
   * lengths of two quaternions, as this is a slightly more efficient calculation than
   * {@link Quaternion#length}.
   *
   * @return {number} The squared Euclidean length.
   */
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  /**
   * Computes the Euclidean length (straight-line length) of this quaternion,
   * considered as a 4 dimensional vector.
   *
   * @return {number} The Euclidean length.
   */
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  /**
   * Normalizes this quaternion - that is, calculated the quaternion that performs
   * the same rotation as this one, but has a length equal to `1`.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }
  /**
   * Multiplies this quaternion by the given one.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  /**
   * Pre-multiplies this quaternion by the given one.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  /**
   * Multiplies the given quaternions and stores the result in this instance.
   *
   * @param {Quaternion} a - The first quaternion.
   * @param {Quaternion} b - The second quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  multiplyQuaternions(e, t) {
    const n = e._x, r = e._y, s = e._z, a = e._w, o = t._x, c = t._y, l = t._z, h = t._w;
    return this._x = n * h + a * o + r * l - s * c, this._y = r * h + a * c + s * o - n * l, this._z = s * h + a * l + n * c - r * o, this._w = a * h - n * o - r * c - s * l, this._onChangeCallback(), this;
  }
  /**
   * Performs a spherical linear interpolation between quaternions.
   *
   * @param {Quaternion} qb - The target quaternion.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {Quaternion} A reference to this quaternion.
   */
  slerp(e, t) {
    if (t === 0) return this;
    if (t === 1) return this.copy(e);
    const n = this._x, r = this._y, s = this._z, a = this._w;
    let o = a * e._w + n * e._x + r * e._y + s * e._z;
    if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1)
      return this._w = a, this._x = n, this._y = r, this._z = s, this;
    const c = 1 - o * o;
    if (c <= Number.EPSILON) {
      const p = 1 - t;
      return this._w = p * a + t * this._w, this._x = p * n + t * this._x, this._y = p * r + t * this._y, this._z = p * s + t * this._z, this.normalize(), this;
    }
    const l = Math.sqrt(c), h = Math.atan2(l, o), f = Math.sin((1 - t) * h) / l, d = Math.sin(t * h) / l;
    return this._w = a * f + this._w * d, this._x = n * f + this._x * d, this._y = r * f + this._y * d, this._z = s * f + this._z * d, this._onChangeCallback(), this;
  }
  /**
   * Performs a spherical linear interpolation between the given quaternions
   * and stores the result in this quaternion.
   *
   * @param {Quaternion} qa - The source quaternion.
   * @param {Quaternion} qb - The target quaternion.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {Quaternion} A reference to this quaternion.
   */
  slerpQuaternions(e, t, n) {
    return this.copy(e).slerp(t, n);
  }
  /**
   * Sets this quaternion to a uniformly random, normalized quaternion.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  random() {
    const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), r = Math.sqrt(1 - n), s = Math.sqrt(n);
    return this.set(
      r * Math.sin(e),
      r * Math.cos(e),
      s * Math.sin(t),
      s * Math.cos(t)
    );
  }
  /**
   * Returns `true` if this quaternion is equal with the given one.
   *
   * @param {Quaternion} quaternion - The quaternion to test for equality.
   * @return {boolean} Whether this quaternion is equal with the given one.
   */
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  /**
   * Sets this quaternion's components from the given array.
   *
   * @param {Array<number>} array - An array holding the quaternion component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Quaternion} A reference to this quaternion.
   */
  fromArray(e, t = 0) {
    return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
  }
  /**
   * Writes the components of this quaternion to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the quaternion components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The quaternion components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
  }
  /**
   * Sets the components of this quaternion from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding quaternion data.
   * @param {number} index - The index into the attribute.
   * @return {Quaternion} A reference to this quaternion.
   */
  fromBufferAttribute(e, t) {
    return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
  }
  /**
   * This methods defines the serialization result of this class. Returns the
   * numerical elements of this quaternion in an array of format `[x, y, z, w]`.
   *
   * @return {Array<number>} The serialized quaternion.
   */
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class P {
  /**
   * Constructs a new 3D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   * @param {number} [z=0] - The z value of this vector.
   */
  constructor(e = 0, t = 0, n = 0) {
    P.prototype.isVector3 = !0, this.x = e, this.y = t, this.z = n;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @param {number} z - The value of the z component.
   * @return {Vector3} A reference to this vector.
   */
  set(e, t, n) {
    return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector3} A reference to this vector.
   */
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setX(e) {
    return this.x = e, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setY(e) {
    return this.y = e, this;
  }
  /**
   * Sets the vector's z component to the given value
   *
   * @param {number} z - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setZ(e) {
    return this.z = e, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
   * @param {number} value - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
   * @return {number} A vector component value.
   */
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector3} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector3} v - The vector to copy.
   * @return {Vector3} A reference to this vector.
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector3} v - The vector to add.
   * @return {Vector3} A reference to this vector.
   */
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector3} A reference to this vector.
   */
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector3|Vector4} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector3} A reference to this vector.
   */
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector3} v - The vector to subtract.
   * @return {Vector3} A reference to this vector.
   */
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector3} A reference to this vector.
   */
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector3} v - The vector to multiply.
   * @return {Vector3} A reference to this vector.
   */
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector3} A reference to this vector.
   */
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }
  /**
   * Multiplies the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  multiplyVectors(e, t) {
    return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
  }
  /**
   * Applies the given Euler rotation to this vector.
   *
   * @param {Euler} euler - The Euler angles.
   * @return {Vector3} A reference to this vector.
   */
  applyEuler(e) {
    return this.applyQuaternion(hs.setFromEuler(e));
  }
  /**
   * Applies a rotation specified by an axis and an angle to this vector.
   *
   * @param {Vector3} axis - A normalized vector representing the rotation axis.
   * @param {number} angle - The angle in radians.
   * @return {Vector3} A reference to this vector.
   */
  applyAxisAngle(e, t) {
    return this.applyQuaternion(hs.setFromAxisAngle(e, t));
  }
  /**
   * Multiplies this vector with the given 3x3 matrix.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @return {Vector3} A reference to this vector.
   */
  applyMatrix3(e) {
    const t = this.x, n = this.y, r = this.z, s = e.elements;
    return this.x = s[0] * t + s[3] * n + s[6] * r, this.y = s[1] * t + s[4] * n + s[7] * r, this.z = s[2] * t + s[5] * n + s[8] * r, this;
  }
  /**
   * Multiplies this vector by the given normal matrix and normalizes
   * the result.
   *
   * @param {Matrix3} m - The normal matrix.
   * @return {Vector3} A reference to this vector.
   */
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  /**
   * Multiplies this vector (with an implicit 1 in the 4th dimension) by m, and
   * divides by perspective.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {Vector3} A reference to this vector.
   */
  applyMatrix4(e) {
    const t = this.x, n = this.y, r = this.z, s = e.elements, a = 1 / (s[3] * t + s[7] * n + s[11] * r + s[15]);
    return this.x = (s[0] * t + s[4] * n + s[8] * r + s[12]) * a, this.y = (s[1] * t + s[5] * n + s[9] * r + s[13]) * a, this.z = (s[2] * t + s[6] * n + s[10] * r + s[14]) * a, this;
  }
  /**
   * Applies the given Quaternion to this vector.
   *
   * @param {Quaternion} q - The Quaternion.
   * @return {Vector3} A reference to this vector.
   */
  applyQuaternion(e) {
    const t = this.x, n = this.y, r = this.z, s = e.x, a = e.y, o = e.z, c = e.w, l = 2 * (a * r - o * n), h = 2 * (o * t - s * r), f = 2 * (s * n - a * t);
    return this.x = t + c * l + a * f - o * h, this.y = n + c * h + o * l - s * f, this.z = r + c * f + s * h - a * l, this;
  }
  /**
   * Projects this vector from world space into the camera's normalized
   * device coordinate (NDC) space.
   *
   * @param {Camera} camera - The camera.
   * @return {Vector3} A reference to this vector.
   */
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  /**
   * Unprojects this vector from the camera's normalized device coordinate (NDC)
   * space into world space.
   *
   * @param {Camera} camera - The camera.
   * @return {Vector3} A reference to this vector.
   */
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  /**
   * Transforms the direction of this vector by a matrix (the upper left 3 x 3
   * subset of the given 4x4 matrix and then normalizes the result.
   *
   * @param {Matrix4} m - The matrix.
   * @return {Vector3} A reference to this vector.
   */
  transformDirection(e) {
    const t = this.x, n = this.y, r = this.z, s = e.elements;
    return this.x = s[0] * t + s[4] * n + s[8] * r, this.y = s[1] * t + s[5] * n + s[9] * r, this.z = s[2] * t + s[6] * n + s[10] * r, this.normalize();
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector3} v - The vector to divide.
   * @return {Vector3} A reference to this vector.
   */
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector3} A reference to this vector.
   */
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  /**
   * If this vector's x, y or z value is greater than the given vector's x, y or z
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector3} v - The vector.
   * @return {Vector3} A reference to this vector.
   */
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }
  /**
   * If this vector's x, y or z value is less than the given vector's x, y or z
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector3} v - The vector.
   * @return {Vector3} A reference to this vector.
   */
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }
  /**
   * If this vector's x, y or z value is greater than the max vector's x, y or z
   * value, it is replaced by the corresponding value.
   * If this vector's x, y or z value is less than the min vector's x, y or z value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector3} min - The minimum x, y and z values.
   * @param {Vector3} max - The maximum x, y and z values in the desired range.
   * @return {Vector3} A reference to this vector.
   */
  clamp(e, t) {
    return this.x = He(this.x, e.x, t.x), this.y = He(this.y, e.y, t.y), this.z = He(this.z, e.z, t.z), this;
  }
  /**
   * If this vector's x, y or z values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x, y or z values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector3} A reference to this vector.
   */
  clampScalar(e, t) {
    return this.x = He(this.x, e, t), this.y = He(this.y, e, t), this.z = He(this.z, e, t), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector3} A reference to this vector.
   */
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(He(n, e, t));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector3} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x, y = -y and z = -z.
   *
   * @return {Vector3} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector3} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  // TODO lengthSquared?
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0, 0) to (x, y, z). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector3} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector3} A reference to this vector.
   */
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector3} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector3} A reference to this vector.
   */
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector3} A reference to this vector.
   */
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
  }
  /**
   * Calculates the cross product of the given vector with this instance.
   *
   * @param {Vector3} v - The vector to compute the cross product with.
   * @return {Vector3} The result of the cross product.
   */
  cross(e) {
    return this.crossVectors(this, e);
  }
  /**
   * Calculates the cross product of the given vectors and stores the result
   * in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  crossVectors(e, t) {
    const n = e.x, r = e.y, s = e.z, a = t.x, o = t.y, c = t.z;
    return this.x = r * c - s * o, this.y = s * a - n * c, this.z = n * o - r * a, this;
  }
  /**
   * Projects this vector onto the given one.
   *
   * @param {Vector3} v - The vector to project to.
   * @return {Vector3} A reference to this vector.
   */
  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0) return this.set(0, 0, 0);
    const n = e.dot(this) / t;
    return this.copy(e).multiplyScalar(n);
  }
  /**
   * Projects this vector onto a plane by subtracting this
   * vector projected onto the plane's normal from this vector.
   *
   * @param {Vector3} planeNormal - The plane normal.
   * @return {Vector3} A reference to this vector.
   */
  projectOnPlane(e) {
    return dr.copy(this).projectOnVector(e), this.sub(dr);
  }
  /**
   * Reflects this vector off a plane orthogonal to the given normal vector.
   *
   * @param {Vector3} normal - The (normalized) normal vector.
   * @return {Vector3} A reference to this vector.
   */
  reflect(e) {
    return this.sub(dr.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  /**
   * Returns the angle between the given vector and this instance in radians.
   *
   * @param {Vector3} v - The vector to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(He(n, -1, 1));
  }
  /**
   * Computes the distance from the given vector to this instance.
   *
   * @param {Vector3} v - The vector to compute the distance to.
   * @return {number} The distance.
   */
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  /**
   * Computes the squared distance from the given vector to this instance.
   * If you are just comparing the distance with another distance, you should compare
   * the distance squared instead as it is slightly more efficient to calculate.
   *
   * @param {Vector3} v - The vector to compute the squared distance to.
   * @return {number} The squared distance.
   */
  distanceToSquared(e) {
    const t = this.x - e.x, n = this.y - e.y, r = this.z - e.z;
    return t * t + n * n + r * r;
  }
  /**
   * Computes the Manhattan distance from the given vector to this instance.
   *
   * @param {Vector3} v - The vector to compute the Manhattan distance to.
   * @return {number} The Manhattan distance.
   */
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  /**
   * Sets the vector components from the given spherical coordinates.
   *
   * @param {Spherical} s - The spherical coordinates.
   * @return {Vector3} A reference to this vector.
   */
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  /**
   * Sets the vector components from the given spherical coordinates.
   *
   * @param {number} radius - The radius.
   * @param {number} phi - The phi angle in radians.
   * @param {number} theta - The theta angle in radians.
   * @return {Vector3} A reference to this vector.
   */
  setFromSphericalCoords(e, t, n) {
    const r = Math.sin(t) * e;
    return this.x = r * Math.sin(n), this.y = Math.cos(t) * e, this.z = r * Math.cos(n), this;
  }
  /**
   * Sets the vector components from the given cylindrical coordinates.
   *
   * @param {Cylindrical} c - The cylindrical coordinates.
   * @return {Vector3} A reference to this vector.
   */
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  /**
   * Sets the vector components from the given cylindrical coordinates.
   *
   * @param {number} radius - The radius.
   * @param {number} theta - The theta angle in radians.
   * @param {number} y - The y value.
   * @return {Vector3} A reference to this vector.
   */
  setFromCylindricalCoords(e, t, n) {
    return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
  }
  /**
   * Sets the vector components to the position elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this;
  }
  /**
   * Sets the vector components to the scale elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), r = this.setFromMatrixColumn(e, 2).length();
    return this.x = t, this.y = n, this.z = r, this;
  }
  /**
   * Sets the vector components from the specified matrix column.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @param {number} index - The column index.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }
  /**
   * Sets the vector components from the specified matrix column.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @param {number} index - The column index.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }
  /**
   * Sets the vector components from the given Euler angles.
   *
   * @param {Euler} e - The Euler angles to set.
   * @return {Vector3} A reference to this vector.
   */
  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }
  /**
   * Sets the vector components from the RGB components of the
   * given color.
   *
   * @param {Color} c - The color to set.
   * @return {Vector3} A reference to this vector.
   */
  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector3} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`
   * and z value to be `array[ offset + 2 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector3} A reference to this vector.
   */
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector3} A reference to this vector.
   */
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector3} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  /**
   * Sets this vector to a uniformly random point on a unit sphere.
   *
   * @return {Vector3} A reference to this vector.
   */
  randomDirection() {
    const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
    return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const dr = /* @__PURE__ */ new P(), hs = /* @__PURE__ */ new wn();
class Ne {
  /**
   * Constructs a new 3x3 matrix. The arguments are supposed to be
   * in row-major order. If no arguments are provided, the constructor
   * initializes the matrix as an identity matrix.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   */
  constructor(e, t, n, r, s, a, o, c, l) {
    Ne.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, n, r, s, a, o, c, l);
  }
  /**
   * Sets the elements of the matrix.The arguments are supposed to be
   * in row-major order.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @return {Matrix3} A reference to this matrix.
   */
  set(e, t, n, r, s, a, o, c, l) {
    const h = this.elements;
    return h[0] = e, h[1] = r, h[2] = o, h[3] = t, h[4] = s, h[5] = c, h[6] = n, h[7] = a, h[8] = l, this;
  }
  /**
   * Sets this matrix to the 3x3 identity matrix.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Copies the values of the given matrix to this instance.
   *
   * @param {Matrix3} m - The matrix to copy.
   * @return {Matrix3} A reference to this matrix.
   */
  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
  }
  /**
   * Extracts the basis of this matrix into the three axis vectors provided.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix3} A reference to this matrix.
   */
  extractBasis(e, t, n) {
    return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  /**
   * Set this matrix to the upper 3x3 matrix of the given 4x4 matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  setFromMatrix4(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[4],
      t[8],
      t[1],
      t[5],
      t[9],
      t[2],
      t[6],
      t[10]
    ), this;
  }
  /**
   * Post-multiplies this matrix by the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to multiply with.
   * @return {Matrix3} A reference to this matrix.
   */
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  /**
   * Pre-multiplies this matrix by the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to multiply with.
   * @return {Matrix3} A reference to this matrix.
   */
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  /**
   * Multiples the given 3x3 matrices and stores the result
   * in this matrix.
   *
   * @param {Matrix3} a - The first matrix.
   * @param {Matrix3} b - The second matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  multiplyMatrices(e, t) {
    const n = e.elements, r = t.elements, s = this.elements, a = n[0], o = n[3], c = n[6], l = n[1], h = n[4], f = n[7], d = n[2], p = n[5], g = n[8], _ = r[0], m = r[3], u = r[6], A = r[1], E = r[4], M = r[7], C = r[2], R = r[5], L = r[8];
    return s[0] = a * _ + o * A + c * C, s[3] = a * m + o * E + c * R, s[6] = a * u + o * M + c * L, s[1] = l * _ + h * A + f * C, s[4] = l * m + h * E + f * R, s[7] = l * u + h * M + f * L, s[2] = d * _ + p * A + g * C, s[5] = d * m + p * E + g * R, s[8] = d * u + p * M + g * L, this;
  }
  /**
   * Multiplies every component of the matrix by the given scalar.
   *
   * @param {number} s - The scalar.
   * @return {Matrix3} A reference to this matrix.
   */
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
  }
  /**
   * Computes and returns the determinant of this matrix.
   *
   * @return {number} The determinant.
   */
  determinant() {
    const e = this.elements, t = e[0], n = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8];
    return t * a * h - t * o * l - n * s * h + n * o * c + r * s * l - r * a * c;
  }
  /**
   * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
   * You can not invert with a determinant of zero. If you attempt this, the method produces
   * a zero matrix instead.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  invert() {
    const e = this.elements, t = e[0], n = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = h * a - o * l, d = o * c - h * s, p = l * s - a * c, g = t * f + n * d + r * p;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const _ = 1 / g;
    return e[0] = f * _, e[1] = (r * l - h * n) * _, e[2] = (o * n - r * a) * _, e[3] = d * _, e[4] = (h * t - r * c) * _, e[5] = (r * s - o * t) * _, e[6] = p * _, e[7] = (n * c - l * t) * _, e[8] = (a * t - n * s) * _, this;
  }
  /**
   * Transposes this matrix in place.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  transpose() {
    let e;
    const t = this.elements;
    return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
  }
  /**
   * Computes the normal matrix which is the inverse transpose of the upper
   * left 3x3 portion of the given 4x4 matrix.
   *
   * @param {Matrix4} matrix4 - The 4x4 matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }
  /**
   * Transposes this matrix into the supplied array, and returns itself unchanged.
   *
   * @param {Array<number>} r - An array to store the transposed matrix elements.
   * @return {Matrix3} A reference to this matrix.
   */
  transposeIntoArray(e) {
    const t = this.elements;
    return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
  }
  /**
   * Sets the UV transform matrix from offset, repeat, rotation, and center.
   *
   * @param {number} tx - Offset x.
   * @param {number} ty - Offset y.
   * @param {number} sx - Repeat x.
   * @param {number} sy - Repeat y.
   * @param {number} rotation - Rotation, in radians. Positive values rotate counterclockwise.
   * @param {number} cx - Center x of rotation.
   * @param {number} cy - Center y of rotation
   * @return {Matrix3} A reference to this matrix.
   */
  setUvTransform(e, t, n, r, s, a, o) {
    const c = Math.cos(s), l = Math.sin(s);
    return this.set(
      n * c,
      n * l,
      -n * (c * a + l * o) + a + e,
      -r * l,
      r * c,
      -r * (-l * a + c * o) + o + t,
      0,
      0,
      1
    ), this;
  }
  /**
   * Scales this matrix with the given scalar values.
   *
   * @param {number} sx - The amount to scale in the X axis.
   * @param {number} sy - The amount to scale in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  scale(e, t) {
    return this.premultiply(fr.makeScale(e, t)), this;
  }
  /**
   * Rotates this matrix by the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix3} A reference to this matrix.
   */
  rotate(e) {
    return this.premultiply(fr.makeRotation(-e)), this;
  }
  /**
   * Translates this matrix by the given scalar values.
   *
   * @param {number} tx - The amount to translate in the X axis.
   * @param {number} ty - The amount to translate in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  translate(e, t) {
    return this.premultiply(fr.makeTranslation(e, t)), this;
  }
  // for 2D Transforms
  /**
   * Sets this matrix as a 2D translation transform.
   *
   * @param {number|Vector2} x - The amount to translate in the X axis or alternatively a translation vector.
   * @param {number} y - The amount to translate in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  makeTranslation(e, t) {
    return e.isVector2 ? this.set(
      1,
      0,
      e.x,
      0,
      1,
      e.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      e,
      0,
      1,
      t,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a 2D rotational transformation.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix3} A reference to this matrix.
   */
  makeRotation(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      -n,
      0,
      n,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a 2D scale transform.
   *
   * @param {number} x - The amount to scale in the X axis.
   * @param {number} y - The amount to scale in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  makeScale(e, t) {
    return this.set(
      e,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Returns `true` if this matrix is equal with the given one.
   *
   * @param {Matrix3} matrix - The matrix to test for equality.
   * @return {boolean} Whether this matrix is equal with the given one.
   */
  equals(e) {
    const t = this.elements, n = e.elements;
    for (let r = 0; r < 9; r++)
      if (t[r] !== n[r]) return !1;
    return !0;
  }
  /**
   * Sets the elements of the matrix from the given array.
   *
   * @param {Array<number>} array - The matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Matrix3} A reference to this matrix.
   */
  fromArray(e, t = 0) {
    for (let n = 0; n < 9; n++)
      this.elements[n] = e[n + t];
    return this;
  }
  /**
   * Writes the elements of this matrix to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The matrix elements in column-major order.
   */
  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
  }
  /**
   * Returns a matrix with copied values from this instance.
   *
   * @return {Matrix3} A clone of this instance.
   */
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const fr = /* @__PURE__ */ new Ne();
function Ma(i) {
  for (let e = i.length - 1; e >= 0; --e)
    if (i[e] >= 65535) return !0;
  return !1;
}
function ir(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function uo() {
  const i = ir("canvas");
  return i.style.display = "block", i;
}
const us = {};
function Zn(i) {
  i in us || (us[i] = !0, console.warn(i));
}
function fo(i, e, t) {
  return new Promise(function(n, r) {
    function s() {
      switch (i.clientWaitSync(e, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          r();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(s, t);
          break;
        default:
          n();
      }
    }
    setTimeout(s, t);
  });
}
const ds = /* @__PURE__ */ new Ne().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), fs = /* @__PURE__ */ new Ne().set(
  3.2409699,
  -1.5373832,
  -0.4986108,
  -0.9692436,
  1.8759675,
  0.0415551,
  0.0556301,
  -0.203977,
  1.0569715
);
function po() {
  const i = {
    enabled: !0,
    workingColorSpace: Jn,
    /**
     * Implementations of supported color spaces.
     *
     * Required:
     *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
     *	- whitePoint: reference white [ x y ]
     *	- transfer: transfer function (pre-defined)
     *	- toXYZ: Matrix3 RGB to XYZ transform
     *	- fromXYZ: Matrix3 XYZ to RGB transform
     *	- luminanceCoefficients: RGB luminance coefficients
     *
     * Optional:
     *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace }
     *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
     *
     * Reference:
     * - https://www.russellcottrell.com/photo/matrixCalculator.htm
     */
    spaces: {},
    convert: function(r, s, a) {
      return this.enabled === !1 || s === a || !s || !a || (this.spaces[s].transfer === Ke && (r.r = tn(r.r), r.g = tn(r.g), r.b = tn(r.b)), this.spaces[s].primaries !== this.spaces[a].primaries && (r.applyMatrix3(this.spaces[s].toXYZ), r.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === Ke && (r.r = $n(r.r), r.g = $n(r.g), r.b = $n(r.b))), r;
    },
    workingToColorSpace: function(r, s) {
      return this.convert(r, this.workingColorSpace, s);
    },
    colorSpaceToWorking: function(r, s) {
      return this.convert(r, s, this.workingColorSpace);
    },
    getPrimaries: function(r) {
      return this.spaces[r].primaries;
    },
    getTransfer: function(r) {
      return r === "" ? nr : this.spaces[r].transfer;
    },
    getLuminanceCoefficients: function(r, s = this.workingColorSpace) {
      return r.fromArray(this.spaces[s].luminanceCoefficients);
    },
    define: function(r) {
      Object.assign(this.spaces, r);
    },
    // Internal APIs
    _getMatrix: function(r, s, a) {
      return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ);
    },
    _getDrawingBufferColorSpace: function(r) {
      return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace;
    },
    _getUnpackColorSpace: function(r = this.workingColorSpace) {
      return this.spaces[r].workingColorSpaceConfig.unpackColorSpace;
    },
    // Deprecated
    fromWorkingColorSpace: function(r, s) {
      return Zn("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), i.workingToColorSpace(r, s);
    },
    toWorkingColorSpace: function(r, s) {
      return Zn("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), i.colorSpaceToWorking(r, s);
    }
  }, e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], t = [0.2126, 0.7152, 0.0722], n = [0.3127, 0.329];
  return i.define({
    [Jn]: {
      primaries: e,
      whitePoint: n,
      transfer: nr,
      toXYZ: ds,
      fromXYZ: fs,
      luminanceCoefficients: t,
      workingColorSpaceConfig: { unpackColorSpace: bt },
      outputColorSpaceConfig: { drawingBufferColorSpace: bt }
    },
    [bt]: {
      primaries: e,
      whitePoint: n,
      transfer: Ke,
      toXYZ: ds,
      fromXYZ: fs,
      luminanceCoefficients: t,
      outputColorSpaceConfig: { drawingBufferColorSpace: bt }
    }
  }), i;
}
const We = /* @__PURE__ */ po();
function tn(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function $n(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let Cn;
class mo {
  /**
   * Returns a data URI containing a representation of the given image.
   *
   * @param {(HTMLImageElement|HTMLCanvasElement)} image - The image object.
   * @param {string} [type='image/png'] - Indicates the image format.
   * @return {string} The data URI.
   */
  static getDataURL(e, t = "image/png") {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
      return e.src;
    let n;
    if (e instanceof HTMLCanvasElement)
      n = e;
    else {
      Cn === void 0 && (Cn = ir("canvas")), Cn.width = e.width, Cn.height = e.height;
      const r = Cn.getContext("2d");
      e instanceof ImageData ? r.putImageData(e, 0, 0) : r.drawImage(e, 0, 0, e.width, e.height), n = Cn;
    }
    return n.toDataURL(t);
  }
  /**
   * Converts the given sRGB image data to linear color space.
   *
   * @param {(HTMLImageElement|HTMLCanvasElement|ImageBitmap|Object)} image - The image object.
   * @return {HTMLCanvasElement|Object} The converted image.
   */
  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const t = ir("canvas");
      t.width = e.width, t.height = e.height;
      const n = t.getContext("2d");
      n.drawImage(e, 0, 0, e.width, e.height);
      const r = n.getImageData(0, 0, e.width, e.height), s = r.data;
      for (let a = 0; a < s.length; a++)
        s[a] = tn(s[a] / 255) * 255;
      return n.putImageData(r, 0, 0), t;
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let n = 0; n < t.length; n++)
        t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[n] = Math.floor(tn(t[n] / 255) * 255) : t[n] = tn(t[n]);
      return {
        data: t,
        width: e.width,
        height: e.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}
let go = 0;
class $r {
  /**
   * Constructs a new video texture.
   *
   * @param {any} [data=null] - The data definition of a texture.
   */
  constructor(e = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: go++ }), this.uuid = en(), this.data = e, this.dataReady = !0, this.version = 0;
  }
  /**
   * Returns the dimensions of the source into the given target vector.
   *
   * @param {(Vector2|Vector3)} target - The target object the result is written into.
   * @return {(Vector2|Vector3)} The dimensions of the source.
   */
  getSize(e) {
    const t = this.data;
    return t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : t instanceof VideoFrame ? e.set(t.displayHeight, t.displayWidth, 0) : t !== null ? e.set(t.width, t.height, t.depth || 0) : e.set(0, 0, 0), e;
  }
  /**
   * When the property is set to `true`, the engine allocates the memory
   * for the texture (if necessary) and triggers the actual texture upload
   * to the GPU next time the source is used.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  /**
   * Serializes the source into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized source.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0)
      return e.images[this.uuid];
    const n = {
      uuid: this.uuid,
      url: ""
    }, r = this.data;
    if (r !== null) {
      let s;
      if (Array.isArray(r)) {
        s = [];
        for (let a = 0, o = r.length; a < o; a++)
          r[a].isDataTexture ? s.push(pr(r[a].image)) : s.push(pr(r[a]));
      } else
        s = pr(r);
      n.url = s;
    }
    return t || (e.images[this.uuid] = n), n;
  }
}
function pr(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? mo.getDataURL(i) : i.data ? {
    data: Array.from(i.data),
    width: i.width,
    height: i.height,
    type: i.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let _o = 0;
const mr = /* @__PURE__ */ new P();
class Rt extends ti {
  /**
   * Constructs a new texture.
   *
   * @param {?Object} [image=Texture.DEFAULT_IMAGE] - The image holding the texture data.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {string} [colorSpace=NoColorSpace] - The color space.
   */
  constructor(e = Rt.DEFAULT_IMAGE, t = Rt.DEFAULT_MAPPING, n = 1001, r = 1001, s = 1006, a = 1008, o = 1023, c = 1009, l = Rt.DEFAULT_ANISOTROPY, h = "") {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: _o++ }), this.uuid = en(), this.name = "", this.source = new $r(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = n, this.wrapT = r, this.magFilter = s, this.minFilter = a, this.anisotropy = l, this.format = o, this.internalFormat = null, this.type = c, this.offset = new we(0, 0), this.repeat = new we(1, 1), this.center = new we(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Ne(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.isArrayTexture = !!(e && e.depth && e.depth > 1), this.pmremVersion = 0;
  }
  /**
   * The width of the texture in pixels.
   */
  get width() {
    return this.source.getSize(mr).x;
  }
  /**
   * The height of the texture in pixels.
   */
  get height() {
    return this.source.getSize(mr).y;
  }
  /**
   * The depth of the texture in pixels.
   */
  get depth() {
    return this.source.getSize(mr).z;
  }
  /**
   * The image object holding the texture data.
   *
   * @type {?Object}
   */
  get image() {
    return this.source.data;
  }
  set image(e = null) {
    this.source.data = e;
  }
  /**
   * Updates the texture transformation matrix from the from the properties {@link Texture#offset},
   * {@link Texture#repeat}, {@link Texture#rotation}, and {@link Texture#center}.
   */
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  /**
   * Adds a range of data in the data texture to be updated on the GPU.
   *
   * @param {number} start - Position at which to start update.
   * @param {number} count - The number of components to update.
   */
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  /**
   * Clears the update ranges.
   */
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  /**
   * Returns a new texture with copied values from this instance.
   *
   * @return {Texture} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given texture to this instance.
   *
   * @param {Texture} source - The texture to copy.
   * @return {Texture} A reference to this instance.
   */
  copy(e) {
    return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.isArrayTexture = e.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
  }
  /**
   * Sets this texture's properties based on `values`.
   * @param {Object} values - A container with texture parameters.
   */
  setValues(e) {
    for (const t in e) {
      const n = e[t];
      if (n === void 0) {
        console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);
        continue;
      }
      const r = this[t];
      if (r === void 0) {
        console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);
        continue;
      }
      r && n && r.isVector2 && n.isVector2 || r && n && r.isVector3 && n.isVector3 || r && n && r.isMatrix3 && n.isMatrix3 ? r.copy(n) : this[t] = n;
    }
  }
  /**
   * Serializes the texture into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized texture.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.textures[this.uuid] !== void 0)
      return e.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.7,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(e).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires Texture#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  /**
   * Transforms the given uv vector with the textures uv transformation matrix.
   *
   * @param {Vector2} uv - The uv vector.
   * @return {Vector2} The transformed uv vector.
   */
  transformUv(e) {
    if (this.mapping !== 300) return e;
    if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
      switch (this.wrapS) {
        case 1e3:
          e.x = e.x - Math.floor(e.x);
          break;
        case 1001:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case 1002:
          Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
          break;
      }
    if (e.y < 0 || e.y > 1)
      switch (this.wrapT) {
        case 1e3:
          e.y = e.y - Math.floor(e.y);
          break;
        case 1001:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case 1002:
          Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
          break;
      }
    return this.flipY && (e.y = 1 - e.y), e;
  }
  /**
   * Setting this property to `true` indicates the engine the texture
   * must be updated in the next render. This triggers a texture upload
   * to the GPU and ensures correct texture parameter configuration.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  /**
   * Setting this property to `true` indicates the engine the PMREM
   * must be regenerated.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsPMREMUpdate(e) {
    e === !0 && this.pmremVersion++;
  }
}
Rt.DEFAULT_IMAGE = null;
Rt.DEFAULT_MAPPING = 300;
Rt.DEFAULT_ANISOTROPY = 1;
class ht {
  /**
   * Constructs a new 4D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   * @param {number} [z=0] - The z value of this vector.
   * @param {number} [w=1] - The w value of this vector.
   */
  constructor(e = 0, t = 0, n = 0, r = 1) {
    ht.prototype.isVector4 = !0, this.x = e, this.y = t, this.z = n, this.w = r;
  }
  /**
   * Alias for {@link Vector4#z}.
   *
   * @type {number}
   */
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  /**
   * Alias for {@link Vector4#w}.
   *
   * @type {number}
   */
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @param {number} z - The value of the z component.
   * @param {number} w - The value of the w component.
   * @return {Vector4} A reference to this vector.
   */
  set(e, t, n, r) {
    return this.x = e, this.y = t, this.z = n, this.w = r, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector4} A reference to this vector.
   */
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setX(e) {
    return this.x = e, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setY(e) {
    return this.y = e, this;
  }
  /**
   * Sets the vector's z component to the given value
   *
   * @param {number} z - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setZ(e) {
    return this.z = e, this;
  }
  /**
   * Sets the vector's w component to the given value
   *
   * @param {number} w - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setW(e) {
    return this.w = e, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y,
   * `2` equals to z, `3` equals to w.
   * @param {number} value - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y,
   * `2` equals to z, `3` equals to w.
   * @return {number} A vector component value.
   */
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector4} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector3|Vector4} v - The vector to copy.
   * @return {Vector4} A reference to this vector.
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector4} v - The vector to add.
   * @return {Vector4} A reference to this vector.
   */
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector4} A reference to this vector.
   */
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector4} a - The first vector.
   * @param {Vector4} b - The second vector.
   * @return {Vector4} A reference to this vector.
   */
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector4} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector4} A reference to this vector.
   */
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector4} v - The vector to subtract.
   * @return {Vector4} A reference to this vector.
   */
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector4} A reference to this vector.
   */
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector4} a - The first vector.
   * @param {Vector4} b - The second vector.
   * @return {Vector4} A reference to this vector.
   */
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector4} v - The vector to multiply.
   * @return {Vector4} A reference to this vector.
   */
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector4} A reference to this vector.
   */
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }
  /**
   * Multiplies this vector with the given 4x4 matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector4} A reference to this vector.
   */
  applyMatrix4(e) {
    const t = this.x, n = this.y, r = this.z, s = this.w, a = e.elements;
    return this.x = a[0] * t + a[4] * n + a[8] * r + a[12] * s, this.y = a[1] * t + a[5] * n + a[9] * r + a[13] * s, this.z = a[2] * t + a[6] * n + a[10] * r + a[14] * s, this.w = a[3] * t + a[7] * n + a[11] * r + a[15] * s, this;
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector4} v - The vector to divide.
   * @return {Vector4} A reference to this vector.
   */
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector4} A reference to this vector.
   */
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  /**
   * Sets the x, y and z components of this
   * vector to the quaternion's axis and w to the angle.
   *
   * @param {Quaternion} q - The Quaternion to set.
   * @return {Vector4} A reference to this vector.
   */
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
  }
  /**
   * Sets the x, y and z components of this
   * vector to the axis of rotation and w to the angle.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper left 3x3 matrix is a pure rotation matrix.
   * @return {Vector4} A reference to this vector.
   */
  setAxisAngleFromRotationMatrix(e) {
    let t, n, r, s;
    const c = e.elements, l = c[0], h = c[4], f = c[8], d = c[1], p = c[5], g = c[9], _ = c[2], m = c[6], u = c[10];
    if (Math.abs(h - d) < 0.01 && Math.abs(f - _) < 0.01 && Math.abs(g - m) < 0.01) {
      if (Math.abs(h + d) < 0.1 && Math.abs(f + _) < 0.1 && Math.abs(g + m) < 0.1 && Math.abs(l + p + u - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const E = (l + 1) / 2, M = (p + 1) / 2, C = (u + 1) / 2, R = (h + d) / 4, L = (f + _) / 4, F = (g + m) / 4;
      return E > M && E > C ? E < 0.01 ? (n = 0, r = 0.707106781, s = 0.707106781) : (n = Math.sqrt(E), r = R / n, s = L / n) : M > C ? M < 0.01 ? (n = 0.707106781, r = 0, s = 0.707106781) : (r = Math.sqrt(M), n = R / r, s = F / r) : C < 0.01 ? (n = 0.707106781, r = 0.707106781, s = 0) : (s = Math.sqrt(C), n = L / s, r = F / s), this.set(n, r, s, t), this;
    }
    let A = Math.sqrt((m - g) * (m - g) + (f - _) * (f - _) + (d - h) * (d - h));
    return Math.abs(A) < 1e-3 && (A = 1), this.x = (m - g) / A, this.y = (f - _) / A, this.z = (d - h) / A, this.w = Math.acos((l + p + u - 1) / 2), this;
  }
  /**
   * Sets the vector components to the position elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector4} A reference to this vector.
   */
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
  }
  /**
   * If this vector's x, y, z or w value is greater than the given vector's x, y, z or w
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector4} v - The vector.
   * @return {Vector4} A reference to this vector.
   */
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }
  /**
   * If this vector's x, y, z or w value is less than the given vector's x, y, z or w
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector4} v - The vector.
   * @return {Vector4} A reference to this vector.
   */
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }
  /**
   * If this vector's x, y, z or w value is greater than the max vector's x, y, z or w
   * value, it is replaced by the corresponding value.
   * If this vector's x, y, z or w value is less than the min vector's x, y, z or w value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector4} min - The minimum x, y and z values.
   * @param {Vector4} max - The maximum x, y and z values in the desired range.
   * @return {Vector4} A reference to this vector.
   */
  clamp(e, t) {
    return this.x = He(this.x, e.x, t.x), this.y = He(this.y, e.y, t.y), this.z = He(this.z, e.z, t.z), this.w = He(this.w, e.w, t.w), this;
  }
  /**
   * If this vector's x, y, z or w values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x, y, z or w values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector4} A reference to this vector.
   */
  clampScalar(e, t) {
    return this.x = He(this.x, e, t), this.y = He(this.y, e, t), this.z = He(this.z, e, t), this.w = He(this.w, e, t), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector4} A reference to this vector.
   */
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(He(n, e, t));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector4} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x, y = -y, z = -z, w = -w.
   *
   * @return {Vector4} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector4} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0, 0, 0) to (x, y, z, w). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0, 0, 0) to (x, y, z, w).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector4} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector4} A reference to this vector.
   */
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector4} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector4} A reference to this vector.
   */
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector4} A reference to this vector.
   */
  lerpVectors(e, t, n) {
    return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector4} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`,
   * z value to be `array[ offset + 2 ]`, w value to be `array[ offset + 3 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector4} A reference to this vector.
   */
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector4} A reference to this vector.
   */
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector4} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class vo extends ti {
  /**
   * Render target options.
   *
   * @typedef {Object} RenderTarget~Options
   * @property {boolean} [generateMipmaps=false] - Whether to generate mipmaps or not.
   * @property {number} [magFilter=LinearFilter] - The mag filter.
   * @property {number} [minFilter=LinearFilter] - The min filter.
   * @property {number} [format=RGBAFormat] - The texture format.
   * @property {number} [type=UnsignedByteType] - The texture type.
   * @property {?string} [internalFormat=null] - The texture's internal format.
   * @property {number} [wrapS=ClampToEdgeWrapping] - The texture's uv wrapping mode.
   * @property {number} [wrapT=ClampToEdgeWrapping] - The texture's uv wrapping mode.
   * @property {number} [anisotropy=1] - The texture's anisotropy value.
   * @property {string} [colorSpace=NoColorSpace] - The texture's color space.
   * @property {boolean} [depthBuffer=true] - Whether to allocate a depth buffer or not.
   * @property {boolean} [stencilBuffer=false] - Whether to allocate a stencil buffer or not.
   * @property {boolean} [resolveDepthBuffer=true] - Whether to resolve the depth buffer or not.
   * @property {boolean} [resolveStencilBuffer=true] - Whether  to resolve the stencil buffer or not.
   * @property {?Texture} [depthTexture=null] - Reference to a depth texture.
   * @property {number} [samples=0] - The MSAA samples count.
   * @property {number} [count=1] - Defines the number of color attachments . Must be at least `1`.
   * @property {number} [depth=1] - The texture depth.
   * @property {boolean} [multiview=false] - Whether this target is used for multiview rendering.
   */
  /**
   * Constructs a new render target.
   *
   * @param {number} [width=1] - The width of the render target.
   * @param {number} [height=1] - The height of the render target.
   * @param {RenderTarget~Options} [options] - The configuration object.
   */
  constructor(e = 1, t = 1, n = {}) {
    super(), n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: 1006,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1,
      depth: 1,
      multiview: !1
    }, n), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = n.depth, this.scissor = new ht(0, 0, e, t), this.scissorTest = !1, this.viewport = new ht(0, 0, e, t);
    const r = { width: e, height: t, depth: n.depth }, s = new Rt(r);
    this.textures = [];
    const a = n.count;
    for (let o = 0; o < a; o++)
      this.textures[o] = s.clone(), this.textures[o].isRenderTargetTexture = !0, this.textures[o].renderTarget = this;
    this._setTextureOptions(n), this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples, this.multiview = n.multiview;
  }
  _setTextureOptions(e = {}) {
    const t = {
      minFilter: 1006,
      generateMipmaps: !1,
      flipY: !1,
      internalFormat: null
    };
    e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
    for (let n = 0; n < this.textures.length; n++)
      this.textures[n].setValues(t);
  }
  /**
   * The texture representing the default color attachment.
   *
   * @type {Texture}
   */
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  set depthTexture(e) {
    this._depthTexture !== null && (this._depthTexture.renderTarget = null), e !== null && (e.renderTarget = this), this._depthTexture = e;
  }
  /**
   * Instead of saving the depth in a renderbuffer, a texture
   * can be used instead which is useful for further processing
   * e.g. in context of post-processing.
   *
   * @type {?DepthTexture}
   * @default null
   */
  get depthTexture() {
    return this._depthTexture;
  }
  /**
   * Sets the size of this render target.
   *
   * @param {number} width - The width.
   * @param {number} height - The height.
   * @param {number} [depth=1] - The depth.
   */
  setSize(e, t, n = 1) {
    if (this.width !== e || this.height !== t || this.depth !== n) {
      this.width = e, this.height = t, this.depth = n;
      for (let r = 0, s = this.textures.length; r < s; r++)
        this.textures[r].image.width = e, this.textures[r].image.height = t, this.textures[r].image.depth = n, this.textures[r].isArrayTexture = this.textures[r].image.depth > 1;
      this.dispose();
    }
    this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
  }
  /**
   * Returns a new render target with copied values from this instance.
   *
   * @return {RenderTarget} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the settings of the given render target. This is a structural copy so
   * no resources are shared between render targets after the copy. That includes
   * all MRT textures and the depth texture.
   *
   * @param {RenderTarget} source - The render target to copy.
   * @return {RenderTarget} A reference to this instance.
   */
  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let t = 0, n = e.textures.length; t < n; t++) {
      this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = !0, this.textures[t].renderTarget = this;
      const r = Object.assign({}, e.textures[t].image);
      this.textures[t].source = new $r(r);
    }
    return this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires RenderTarget#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class kt extends vo {
  /**
   * Constructs a new 3D render target.
   *
   * @param {number} [width=1] - The width of the render target.
   * @param {number} [height=1] - The height of the render target.
   * @param {RenderTarget~Options} [options] - The configuration object.
   */
  constructor(e = 1, t = 1, n = {}) {
    super(e, t, n), this.isWebGLRenderTarget = !0;
  }
}
class Sa extends Rt {
  /**
   * Constructs a new data array texture.
   *
   * @param {?TypedArray} [data=null] - The buffer data.
   * @param {number} [width=1] - The width of the texture.
   * @param {number} [height=1] - The height of the texture.
   * @param {number} [depth=1] - The depth of the texture.
   */
  constructor(e = null, t = 1, n = 1, r = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: e, width: t, height: n, depth: r }, this.magFilter = 1003, this.minFilter = 1003, this.wrapR = 1001, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  /**
   * Describes that a specific layer of the texture needs to be updated.
   * Normally when {@link Texture#needsUpdate} is set to `true`, the
   * entire data texture array is sent to the GPU. Marking specific
   * layers will only transmit subsets of all mipmaps associated with a
   * specific depth in the array which is often much more performant.
   *
   * @param {number} layerIndex - The layer index that should be updated.
   */
  addLayerUpdate(e) {
    this.layerUpdates.add(e);
  }
  /**
   * Resets the layer updates registry.
   */
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class xo extends Rt {
  /**
   * Constructs a new data array texture.
   *
   * @param {?TypedArray} [data=null] - The buffer data.
   * @param {number} [width=1] - The width of the texture.
   * @param {number} [height=1] - The height of the texture.
   * @param {number} [depth=1] - The depth of the texture.
   */
  constructor(e = null, t = 1, n = 1, r = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: e, width: t, height: n, depth: r }, this.magFilter = 1003, this.minFilter = 1003, this.wrapR = 1001, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class xi {
  /**
   * Constructs a new bounding box.
   *
   * @param {Vector3} [min=(Infinity,Infinity,Infinity)] - A vector representing the lower boundary of the box.
   * @param {Vector3} [max=(-Infinity,-Infinity,-Infinity)] - A vector representing the upper boundary of the box.
   */
  constructor(e = new P(1 / 0, 1 / 0, 1 / 0), t = new P(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = e, this.max = t;
  }
  /**
   * Sets the lower and upper boundaries of this box.
   * Please note that this method only copies the values from the given objects.
   *
   * @param {Vector3} min - The lower boundary of the box.
   * @param {Vector3} max - The upper boundary of the box.
   * @return {Box3} A reference to this bounding box.
   */
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given array.
   *
   * @param {Array<number>} array - An array holding 3D position data.
   * @return {Box3} A reference to this bounding box.
   */
  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t += 3)
      this.expandByPoint(zt.fromArray(e, t));
    return this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - A buffer attribute holding 3D position data.
   * @return {Box3} A reference to this bounding box.
   */
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, n = e.count; t < n; t++)
      this.expandByPoint(zt.fromBufferAttribute(e, t));
    return this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given array.
   *
   * @param {Array<Vector3>} points - An array holding 3D position data as instances of {@link Vector3}.
   * @return {Box3} A reference to this bounding box.
   */
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++)
      this.expandByPoint(e[t]);
    return this;
  }
  /**
   * Centers this box on the given center vector and sets this box's width, height and
   * depth to the given size values.
   *
   * @param {Vector3} center - The center of the box.
   * @param {Vector3} size - The x, y and z dimensions of the box.
   * @return {Box3} A reference to this bounding box.
   */
  setFromCenterAndSize(e, t) {
    const n = zt.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
  }
  /**
   * Computes the world-axis-aligned bounding box for the given 3D object
   * (including its children), accounting for the object's, and children's,
   * world transforms. The function may result in a larger box than strictly necessary.
   *
   * @param {Object3D} object - The 3D object to compute the bounding box for.
   * @param {boolean} [precise=false] - If set to `true`, the method computes the smallest
   * world-axis-aligned bounding box at the expense of more computation.
   * @return {Box3} A reference to this bounding box.
   */
  setFromObject(e, t = !1) {
    return this.makeEmpty(), this.expandByObject(e, t);
  }
  /**
   * Returns a new box with copied values from this instance.
   *
   * @return {Box3} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given box to this instance.
   *
   * @param {Box3} box - The box to copy.
   * @return {Box3} A reference to this bounding box.
   */
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  /**
   * Makes this box empty which means in encloses a zero space in 3D.
   *
   * @return {Box3} A reference to this bounding box.
   */
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  /**
   * Returns true if this box includes zero points within its bounds.
   * Note that a box with equal lower and upper bounds still includes one
   * point, the one both bounds share.
   *
   * @return {boolean} Whether this box is empty or not.
   */
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  /**
   * Returns the center point of this box.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The center point.
   */
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  /**
   * Returns the dimensions of this box.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The size.
   */
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  /**
   * Expands the boundaries of this box to include the given point.
   *
   * @param {Vector3} point - The point that should be included by the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  /**
   * Expands this box equilaterally by the given vector. The width of this
   * box will be expanded by the x component of the vector in both
   * directions. The height of this box will be expanded by the y component of
   * the vector in both directions. The depth of this box will be
   * expanded by the z component of the vector in both directions.
   *
   * @param {Vector3} vector - The vector that should expand the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  /**
   * Expands each dimension of the box by the given scalar. If negative, the
   * dimensions of the box will be contracted.
   *
   * @param {number} scalar - The scalar value that should expand the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  /**
   * Expands the boundaries of this box to include the given 3D object and
   * its children, accounting for the object's, and children's, world
   * transforms. The function may result in a larger box than strictly
   * necessary (unless the precise parameter is set to true).
   *
   * @param {Object3D} object - The 3D object that should expand the bounding box.
   * @param {boolean} precise - If set to `true`, the method expands the bounding box
   * as little as necessary at the expense of more computation.
   * @return {Box3} A reference to this bounding box.
   */
  expandByObject(e, t = !1) {
    e.updateWorldMatrix(!1, !1);
    const n = e.geometry;
    if (n !== void 0) {
      const s = n.getAttribute("position");
      if (t === !0 && s !== void 0 && e.isInstancedMesh !== !0)
        for (let a = 0, o = s.count; a < o; a++)
          e.isMesh === !0 ? e.getVertexPosition(a, zt) : zt.fromBufferAttribute(s, a), zt.applyMatrix4(e.matrixWorld), this.expandByPoint(zt);
      else
        e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), Ti.copy(e.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), Ti.copy(n.boundingBox)), Ti.applyMatrix4(e.matrixWorld), this.union(Ti);
    }
    const r = e.children;
    for (let s = 0, a = r.length; s < a; s++)
      this.expandByObject(r[s], t);
    return this;
  }
  /**
   * Returns `true` if the given point lies within or on the boundaries of this box.
   *
   * @param {Vector3} point - The point to test.
   * @return {boolean} Whether the bounding box contains the given point or not.
   */
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }
  /**
   * Returns `true` if this bounding box includes the entirety of the given bounding box.
   * If this box and the given one are identical, this function also returns `true`.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the bounding box contains the given bounding box or not.
   */
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }
  /**
   * Returns a point as a proportion of this box's width, height and depth.
   *
   * @param {Vector3} point - A point in 3D space.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} A point as a proportion of this box's width, height and depth.
   */
  getParameter(e, t) {
    return t.set(
      (e.x - this.min.x) / (this.max.x - this.min.x),
      (e.y - this.min.y) / (this.max.y - this.min.y),
      (e.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  /**
   * Returns `true` if the given bounding box intersects with this bounding box.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the given bounding box intersects with this bounding box.
   */
  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
  }
  /**
   * Returns `true` if the given bounding sphere intersects with this bounding box.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the given bounding sphere intersects with this bounding box.
   */
  intersectsSphere(e) {
    return this.clampPoint(e.center, zt), zt.distanceToSquared(e.center) <= e.radius * e.radius;
  }
  /**
   * Returns `true` if the given plane intersects with this bounding box.
   *
   * @param {Plane} plane - The plane to test.
   * @return {boolean} Whether the given plane intersects with this bounding box.
   */
  intersectsPlane(e) {
    let t, n;
    return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
  }
  /**
   * Returns `true` if the given triangle intersects with this bounding box.
   *
   * @param {Triangle} triangle - The triangle to test.
   * @return {boolean} Whether the given triangle intersects with this bounding box.
   */
  intersectsTriangle(e) {
    if (this.isEmpty())
      return !1;
    this.getCenter(si), Ai.subVectors(this.max, si), Pn.subVectors(e.a, si), Dn.subVectors(e.b, si), Ln.subVectors(e.c, si), nn.subVectors(Dn, Pn), rn.subVectors(Ln, Dn), mn.subVectors(Pn, Ln);
    let t = [
      0,
      -nn.z,
      nn.y,
      0,
      -rn.z,
      rn.y,
      0,
      -mn.z,
      mn.y,
      nn.z,
      0,
      -nn.x,
      rn.z,
      0,
      -rn.x,
      mn.z,
      0,
      -mn.x,
      -nn.y,
      nn.x,
      0,
      -rn.y,
      rn.x,
      0,
      -mn.y,
      mn.x,
      0
    ];
    return !gr(t, Pn, Dn, Ln, Ai) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !gr(t, Pn, Dn, Ln, Ai)) ? !1 : (bi.crossVectors(nn, rn), t = [bi.x, bi.y, bi.z], gr(t, Pn, Dn, Ln, Ai));
  }
  /**
   * Clamps the given point within the bounds of this box.
   *
   * @param {Vector3} point - The point to clamp.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The clamped point.
   */
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  /**
   * Returns the euclidean distance from any edge of this box to the specified point. If
   * the given point lies inside of this box, the distance will be `0`.
   *
   * @param {Vector3} point - The point to compute the distance to.
   * @return {number} The euclidean distance.
   */
  distanceToPoint(e) {
    return this.clampPoint(e, zt).distanceTo(e);
  }
  /**
   * Returns a bounding sphere that encloses this bounding box.
   *
   * @param {Sphere} target - The target sphere that is used to store the method's result.
   * @return {Sphere} The bounding sphere that encloses this bounding box.
   */
  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(zt).length() * 0.5), e;
  }
  /**
   * Computes the intersection of this bounding box and the given one, setting the upper
   * bound of this box to the lesser of the two boxes' upper bounds and the
   * lower bound of this box to the greater of the two boxes' lower bounds. If
   * there's no overlap, makes this box empty.
   *
   * @param {Box3} box - The bounding box to intersect with.
   * @return {Box3} A reference to this bounding box.
   */
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  /**
   * Computes the union of this box and another and the given one, setting the upper
   * bound of this box to the greater of the two boxes' upper bounds and the
   * lower bound of this box to the lesser of the two boxes' lower bounds.
   *
   * @param {Box3} box - The bounding box that will be unioned with this instance.
   * @return {Box3} A reference to this bounding box.
   */
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  /**
   * Transforms this bounding box by the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @return {Box3} A reference to this bounding box.
   */
  applyMatrix4(e) {
    return this.isEmpty() ? this : (Kt[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), Kt[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), Kt[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), Kt[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), Kt[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), Kt[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), Kt[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), Kt[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(Kt), this);
  }
  /**
   * Adds the given offset to both the upper and lower bounds of this bounding box,
   * effectively moving it in 3D space.
   *
   * @param {Vector3} offset - The offset that should be used to translate the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  /**
   * Returns `true` if this bounding box is equal with the given one.
   *
   * @param {Box3} box - The box to test for equality.
   * @return {boolean} Whether this bounding box is equal with the given one.
   */
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
  /**
   * Returns a serialized structure of the bounding box.
   *
   * @return {Object} Serialized structure with fields representing the object state.
   */
  toJSON() {
    return {
      min: this.min.toArray(),
      max: this.max.toArray()
    };
  }
  /**
   * Returns a serialized structure of the bounding box.
   *
   * @param {Object} json - The serialized json to set the box from.
   * @return {Box3} A reference to this bounding box.
   */
  fromJSON(e) {
    return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
  }
}
const Kt = [
  /* @__PURE__ */ new P(),
  /* @__PURE__ */ new P(),
  /* @__PURE__ */ new P(),
  /* @__PURE__ */ new P(),
  /* @__PURE__ */ new P(),
  /* @__PURE__ */ new P(),
  /* @__PURE__ */ new P(),
  /* @__PURE__ */ new P()
], zt = /* @__PURE__ */ new P(), Ti = /* @__PURE__ */ new xi(), Pn = /* @__PURE__ */ new P(), Dn = /* @__PURE__ */ new P(), Ln = /* @__PURE__ */ new P(), nn = /* @__PURE__ */ new P(), rn = /* @__PURE__ */ new P(), mn = /* @__PURE__ */ new P(), si = /* @__PURE__ */ new P(), Ai = /* @__PURE__ */ new P(), bi = /* @__PURE__ */ new P(), gn = /* @__PURE__ */ new P();
function gr(i, e, t, n, r) {
  for (let s = 0, a = i.length - 3; s <= a; s += 3) {
    gn.fromArray(i, s);
    const o = r.x * Math.abs(gn.x) + r.y * Math.abs(gn.y) + r.z * Math.abs(gn.z), c = e.dot(gn), l = t.dot(gn), h = n.dot(gn);
    if (Math.max(-Math.max(c, l, h), Math.min(c, l, h)) > o)
      return !1;
  }
  return !0;
}
const Mo = /* @__PURE__ */ new xi(), ai = /* @__PURE__ */ new P(), _r = /* @__PURE__ */ new P();
class Mi {
  /**
   * Constructs a new sphere.
   *
   * @param {Vector3} [center=(0,0,0)] - The center of the sphere
   * @param {number} [radius=-1] - The radius of the sphere.
   */
  constructor(e = new P(), t = -1) {
    this.isSphere = !0, this.center = e, this.radius = t;
  }
  /**
   * Sets the sphere's components by copying the given values.
   *
   * @param {Vector3} center - The center.
   * @param {number} radius - The radius.
   * @return {Sphere} A reference to this sphere.
   */
  set(e, t) {
    return this.center.copy(e), this.radius = t, this;
  }
  /**
   * Computes the minimum bounding sphere for list of points.
   * If the optional center point is given, it is used as the sphere's
   * center. Otherwise, the center of the axis-aligned bounding box
   * encompassing the points is calculated.
   *
   * @param {Array<Vector3>} points - A list of points in 3D space.
   * @param {Vector3} [optionalCenter] - The center of the sphere.
   * @return {Sphere} A reference to this sphere.
   */
  setFromPoints(e, t) {
    const n = this.center;
    t !== void 0 ? n.copy(t) : Mo.setFromPoints(e).getCenter(n);
    let r = 0;
    for (let s = 0, a = e.length; s < a; s++)
      r = Math.max(r, n.distanceToSquared(e[s]));
    return this.radius = Math.sqrt(r), this;
  }
  /**
   * Copies the values of the given sphere to this instance.
   *
   * @param {Sphere} sphere - The sphere to copy.
   * @return {Sphere} A reference to this sphere.
   */
  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }
  /**
   * Returns `true` if the sphere is empty (the radius set to a negative number).
   *
   * Spheres with a radius of `0` contain only their center point and are not
   * considered to be empty.
   *
   * @return {boolean} Whether this sphere is empty or not.
   */
  isEmpty() {
    return this.radius < 0;
  }
  /**
   * Makes this sphere empty which means in encloses a zero space in 3D.
   *
   * @return {Sphere} A reference to this sphere.
   */
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  /**
   * Returns `true` if this sphere contains the given point inclusive of
   * the surface of the sphere.
   *
   * @param {Vector3} point - The point to check.
   * @return {boolean} Whether this sphere contains the given point or not.
   */
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  /**
   * Returns the closest distance from the boundary of the sphere to the
   * given point. If the sphere contains the point, the distance will
   * be negative.
   *
   * @param {Vector3} point - The point to compute the distance to.
   * @return {number} The distance to the point.
   */
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  /**
   * Returns `true` if this sphere intersects with the given one.
   *
   * @param {Sphere} sphere - The sphere to test.
   * @return {boolean} Whether this sphere intersects with the given one or not.
   */
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  /**
   * Returns `true` if this sphere intersects with the given box.
   *
   * @param {Box3} box - The box to test.
   * @return {boolean} Whether this sphere intersects with the given box or not.
   */
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  /**
   * Returns `true` if this sphere intersects with the given plane.
   *
   * @param {Plane} plane - The plane to test.
   * @return {boolean} Whether this sphere intersects with the given plane or not.
   */
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  /**
   * Clamps a point within the sphere. If the point is outside the sphere, it
   * will clamp it to the closest point on the edge of the sphere. Points
   * already inside the sphere will not be affected.
   *
   * @param {Vector3} point - The plane to clamp.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The clamped point.
   */
  clampPoint(e, t) {
    const n = this.center.distanceToSquared(e);
    return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
  }
  /**
   * Returns a bounding box that encloses this sphere.
   *
   * @param {Box3} target - The target box that is used to store the method's result.
   * @return {Box3} The bounding box that encloses this sphere.
   */
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  /**
   * Transforms this sphere with the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @return {Sphere} A reference to this sphere.
   */
  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }
  /**
   * Translates the sphere's center by the given offset.
   *
   * @param {Vector3} offset - The offset.
   * @return {Sphere} A reference to this sphere.
   */
  translate(e) {
    return this.center.add(e), this;
  }
  /**
   * Expands the boundaries of this sphere to include the given point.
   *
   * @param {Vector3} point - The point to include.
   * @return {Sphere} A reference to this sphere.
   */
  expandByPoint(e) {
    if (this.isEmpty())
      return this.center.copy(e), this.radius = 0, this;
    ai.subVectors(e, this.center);
    const t = ai.lengthSq();
    if (t > this.radius * this.radius) {
      const n = Math.sqrt(t), r = (n - this.radius) * 0.5;
      this.center.addScaledVector(ai, r / n), this.radius += r;
    }
    return this;
  }
  /**
   * Expands this sphere to enclose both the original sphere and the given sphere.
   *
   * @param {Sphere} sphere - The sphere to include.
   * @return {Sphere} A reference to this sphere.
   */
  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (_r.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(ai.copy(e.center).add(_r)), this.expandByPoint(ai.copy(e.center).sub(_r))), this);
  }
  /**
   * Returns `true` if this sphere is equal with the given one.
   *
   * @param {Sphere} sphere - The sphere to test for equality.
   * @return {boolean} Whether this bounding sphere is equal with the given one.
   */
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  /**
   * Returns a new sphere with copied values from this instance.
   *
   * @return {Sphere} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Returns a serialized structure of the bounding sphere.
   *
   * @return {Object} Serialized structure with fields representing the object state.
   */
  toJSON() {
    return {
      radius: this.radius,
      center: this.center.toArray()
    };
  }
  /**
   * Returns a serialized structure of the bounding sphere.
   *
   * @param {Object} json - The serialized json to set the sphere from.
   * @return {Box3} A reference to this bounding sphere.
   */
  fromJSON(e) {
    return this.radius = e.radius, this.center.fromArray(e.center), this;
  }
}
const Zt = /* @__PURE__ */ new P(), vr = /* @__PURE__ */ new P(), wi = /* @__PURE__ */ new P(), sn = /* @__PURE__ */ new P(), xr = /* @__PURE__ */ new P(), Ri = /* @__PURE__ */ new P(), Mr = /* @__PURE__ */ new P();
class or {
  /**
   * Constructs a new ray.
   *
   * @param {Vector3} [origin=(0,0,0)] - The origin of the ray.
   * @param {Vector3} [direction=(0,0,-1)] - The (normalized) direction of the ray.
   */
  constructor(e = new P(), t = new P(0, 0, -1)) {
    this.origin = e, this.direction = t;
  }
  /**
   * Sets the ray's components by copying the given values.
   *
   * @param {Vector3} origin - The origin.
   * @param {Vector3} direction - The direction.
   * @return {Ray} A reference to this ray.
   */
  set(e, t) {
    return this.origin.copy(e), this.direction.copy(t), this;
  }
  /**
   * Copies the values of the given ray to this instance.
   *
   * @param {Ray} ray - The ray to copy.
   * @return {Ray} A reference to this ray.
   */
  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }
  /**
   * Returns a vector that is located at a given distance along this ray.
   *
   * @param {number} t - The distance along the ray to retrieve a position for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} A position on the ray.
   */
  at(e, t) {
    return t.copy(this.origin).addScaledVector(this.direction, e);
  }
  /**
   * Adjusts the direction of the ray to point at the given vector in world space.
   *
   * @param {Vector3} v - The target position.
   * @return {Ray} A reference to this ray.
   */
  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }
  /**
   * Shift the origin of this ray along its direction by the given distance.
   *
   * @param {number} t - The distance along the ray to interpolate.
   * @return {Ray} A reference to this ray.
   */
  recast(e) {
    return this.origin.copy(this.at(e, Zt)), this;
  }
  /**
   * Returns the point along this ray that is closest to the given point.
   *
   * @param {Vector3} point - A point in 3D space to get the closet location on the ray for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The closest point on this ray.
   */
  closestPointToPoint(e, t) {
    t.subVectors(e, this.origin);
    const n = t.dot(this.direction);
    return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
  }
  /**
   * Returns the distance of the closest approach between this ray and the given point.
   *
   * @param {Vector3} point - A point in 3D space to compute the distance to.
   * @return {number} The distance.
   */
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  /**
   * Returns the squared distance of the closest approach between this ray and the given point.
   *
   * @param {Vector3} point - A point in 3D space to compute the distance to.
   * @return {number} The squared distance.
   */
  distanceSqToPoint(e) {
    const t = Zt.subVectors(e, this.origin).dot(this.direction);
    return t < 0 ? this.origin.distanceToSquared(e) : (Zt.copy(this.origin).addScaledVector(this.direction, t), Zt.distanceToSquared(e));
  }
  /**
   * Returns the squared distance between this ray and the given line segment.
   *
   * @param {Vector3} v0 - The start point of the line segment.
   * @param {Vector3} v1 - The end point of the line segment.
   * @param {Vector3} [optionalPointOnRay] - When provided, it receives the point on this ray that is closest to the segment.
   * @param {Vector3} [optionalPointOnSegment] - When provided, it receives the point on the line segment that is closest to this ray.
   * @return {number} The squared distance.
   */
  distanceSqToSegment(e, t, n, r) {
    vr.copy(e).add(t).multiplyScalar(0.5), wi.copy(t).sub(e).normalize(), sn.copy(this.origin).sub(vr);
    const s = e.distanceTo(t) * 0.5, a = -this.direction.dot(wi), o = sn.dot(this.direction), c = -sn.dot(wi), l = sn.lengthSq(), h = Math.abs(1 - a * a);
    let f, d, p, g;
    if (h > 0)
      if (f = a * c - o, d = a * o - c, g = s * h, f >= 0)
        if (d >= -g)
          if (d <= g) {
            const _ = 1 / h;
            f *= _, d *= _, p = f * (f + a * d + 2 * o) + d * (a * f + d + 2 * c) + l;
          } else
            d = s, f = Math.max(0, -(a * d + o)), p = -f * f + d * (d + 2 * c) + l;
        else
          d = -s, f = Math.max(0, -(a * d + o)), p = -f * f + d * (d + 2 * c) + l;
      else
        d <= -g ? (f = Math.max(0, -(-a * s + o)), d = f > 0 ? -s : Math.min(Math.max(-s, -c), s), p = -f * f + d * (d + 2 * c) + l) : d <= g ? (f = 0, d = Math.min(Math.max(-s, -c), s), p = d * (d + 2 * c) + l) : (f = Math.max(0, -(a * s + o)), d = f > 0 ? s : Math.min(Math.max(-s, -c), s), p = -f * f + d * (d + 2 * c) + l);
    else
      d = a > 0 ? -s : s, f = Math.max(0, -(a * d + o)), p = -f * f + d * (d + 2 * c) + l;
    return n && n.copy(this.origin).addScaledVector(this.direction, f), r && r.copy(vr).addScaledVector(wi, d), p;
  }
  /**
   * Intersects this ray with the given sphere, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Sphere} sphere - The sphere to intersect.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectSphere(e, t) {
    Zt.subVectors(e.center, this.origin);
    const n = Zt.dot(this.direction), r = Zt.dot(Zt) - n * n, s = e.radius * e.radius;
    if (r > s) return null;
    const a = Math.sqrt(s - r), o = n - a, c = n + a;
    return c < 0 ? null : o < 0 ? this.at(c, t) : this.at(o, t);
  }
  /**
   * Returns `true` if this ray intersects with the given sphere.
   *
   * @param {Sphere} sphere - The sphere to intersect.
   * @return {boolean} Whether this ray intersects with the given sphere or not.
   */
  intersectsSphere(e) {
    return e.radius < 0 ? !1 : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  /**
   * Computes the distance from the ray's origin to the given plane. Returns `null` if the ray
   * does not intersect with the plane.
   *
   * @param {Plane} plane - The plane to compute the distance to.
   * @return {?number} Whether this ray intersects with the given sphere or not.
   */
  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (t === 0)
      return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(e.normal) + e.constant) / t;
    return n >= 0 ? n : null;
  }
  /**
   * Intersects this ray with the given plane, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Plane} plane - The plane to intersect.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectPlane(e, t) {
    const n = this.distanceToPlane(e);
    return n === null ? null : this.at(n, t);
  }
  /**
   * Returns `true` if this ray intersects with the given plane.
   *
   * @param {Plane} plane - The plane to intersect.
   * @return {boolean} Whether this ray intersects with the given plane or not.
   */
  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return t === 0 || e.normal.dot(this.direction) * t < 0;
  }
  /**
   * Intersects this ray with the given bounding box, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Box3} box - The box to intersect.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectBox(e, t) {
    let n, r, s, a, o, c;
    const l = 1 / this.direction.x, h = 1 / this.direction.y, f = 1 / this.direction.z, d = this.origin;
    return l >= 0 ? (n = (e.min.x - d.x) * l, r = (e.max.x - d.x) * l) : (n = (e.max.x - d.x) * l, r = (e.min.x - d.x) * l), h >= 0 ? (s = (e.min.y - d.y) * h, a = (e.max.y - d.y) * h) : (s = (e.max.y - d.y) * h, a = (e.min.y - d.y) * h), n > a || s > r || ((s > n || isNaN(n)) && (n = s), (a < r || isNaN(r)) && (r = a), f >= 0 ? (o = (e.min.z - d.z) * f, c = (e.max.z - d.z) * f) : (o = (e.max.z - d.z) * f, c = (e.min.z - d.z) * f), n > c || o > r) || ((o > n || n !== n) && (n = o), (c < r || r !== r) && (r = c), r < 0) ? null : this.at(n >= 0 ? n : r, t);
  }
  /**
   * Returns `true` if this ray intersects with the given box.
   *
   * @param {Box3} box - The box to intersect.
   * @return {boolean} Whether this ray intersects with the given box or not.
   */
  intersectsBox(e) {
    return this.intersectBox(e, Zt) !== null;
  }
  /**
   * Intersects this ray with the given triangle, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Vector3} a - The first vertex of the triangle.
   * @param {Vector3} b - The second vertex of the triangle.
   * @param {Vector3} c - The third vertex of the triangle.
   * @param {boolean} backfaceCulling - Whether to use backface culling or not.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectTriangle(e, t, n, r, s) {
    xr.subVectors(t, e), Ri.subVectors(n, e), Mr.crossVectors(xr, Ri);
    let a = this.direction.dot(Mr), o;
    if (a > 0) {
      if (r) return null;
      o = 1;
    } else if (a < 0)
      o = -1, a = -a;
    else
      return null;
    sn.subVectors(this.origin, e);
    const c = o * this.direction.dot(Ri.crossVectors(sn, Ri));
    if (c < 0)
      return null;
    const l = o * this.direction.dot(xr.cross(sn));
    if (l < 0 || c + l > a)
      return null;
    const h = -o * sn.dot(Mr);
    return h < 0 ? null : this.at(h / a, s);
  }
  /**
   * Transforms this ray with the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix4 - The transformation matrix.
   * @return {Ray} A reference to this ray.
   */
  applyMatrix4(e) {
    return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
  }
  /**
   * Returns `true` if this ray is equal with the given one.
   *
   * @param {Ray} ray - The ray to test for equality.
   * @return {boolean} Whether this ray is equal with the given one.
   */
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
  /**
   * Returns a new ray with copied values from this instance.
   *
   * @return {Ray} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
class Qe {
  /**
   * Constructs a new 4x4 matrix. The arguments are supposed to be
   * in row-major order. If no arguments are provided, the constructor
   * initializes the matrix as an identity matrix.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n14] - 1-4 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n24] - 2-4 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @param {number} [n34] - 3-4 matrix element.
   * @param {number} [n41] - 4-1 matrix element.
   * @param {number} [n42] - 4-2 matrix element.
   * @param {number} [n43] - 4-3 matrix element.
   * @param {number} [n44] - 4-4 matrix element.
   */
  constructor(e, t, n, r, s, a, o, c, l, h, f, d, p, g, _, m) {
    Qe.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, n, r, s, a, o, c, l, h, f, d, p, g, _, m);
  }
  /**
   * Sets the elements of the matrix.The arguments are supposed to be
   * in row-major order.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n14] - 1-4 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n24] - 2-4 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @param {number} [n34] - 3-4 matrix element.
   * @param {number} [n41] - 4-1 matrix element.
   * @param {number} [n42] - 4-2 matrix element.
   * @param {number} [n43] - 4-3 matrix element.
   * @param {number} [n44] - 4-4 matrix element.
   * @return {Matrix4} A reference to this matrix.
   */
  set(e, t, n, r, s, a, o, c, l, h, f, d, p, g, _, m) {
    const u = this.elements;
    return u[0] = e, u[4] = t, u[8] = n, u[12] = r, u[1] = s, u[5] = a, u[9] = o, u[13] = c, u[2] = l, u[6] = h, u[10] = f, u[14] = d, u[3] = p, u[7] = g, u[11] = _, u[15] = m, this;
  }
  /**
   * Sets this matrix to the 4x4 identity matrix.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Returns a matrix with copied values from this instance.
   *
   * @return {Matrix4} A clone of this instance.
   */
  clone() {
    return new Qe().fromArray(this.elements);
  }
  /**
   * Copies the values of the given matrix to this instance.
   *
   * @param {Matrix4} m - The matrix to copy.
   * @return {Matrix4} A reference to this matrix.
   */
  copy(e) {
    const t = this.elements, n = e.elements;
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
  }
  /**
   * Copies the translation component of the given matrix
   * into this matrix's translation component.
   *
   * @param {Matrix4} m - The matrix to copy the translation component.
   * @return {Matrix4} A reference to this matrix.
   */
  copyPosition(e) {
    const t = this.elements, n = e.elements;
    return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
  }
  /**
   * Set the upper 3x3 elements of this matrix to the values of given 3x3 matrix.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  setFromMatrix3(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[3],
      t[6],
      0,
      t[1],
      t[4],
      t[7],
      0,
      t[2],
      t[5],
      t[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Extracts the basis of this matrix into the three axis vectors provided.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  extractBasis(e, t, n) {
    return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  /**
   * Sets the given basis vectors to this matrix.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeBasis(e, t, n) {
    return this.set(
      e.x,
      t.x,
      n.x,
      0,
      e.y,
      t.y,
      n.y,
      0,
      e.z,
      t.z,
      n.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Extracts the rotation component of the given matrix
   * into this matrix's rotation component.
   *
   * Note: This method does not support reflection matrices.
   *
   * @param {Matrix4} m - The matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  extractRotation(e) {
    const t = this.elements, n = e.elements, r = 1 / Un.setFromMatrixColumn(e, 0).length(), s = 1 / Un.setFromMatrixColumn(e, 1).length(), a = 1 / Un.setFromMatrixColumn(e, 2).length();
    return t[0] = n[0] * r, t[1] = n[1] * r, t[2] = n[2] * r, t[3] = 0, t[4] = n[4] * s, t[5] = n[5] * s, t[6] = n[6] * s, t[7] = 0, t[8] = n[8] * a, t[9] = n[9] * a, t[10] = n[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  /**
   * Sets the rotation component (the upper left 3x3 matrix) of this matrix to
   * the rotation specified by the given Euler angles. The rest of
   * the matrix is set to the identity. Depending on the {@link Euler#order},
   * there are six possible outcomes. See [this page]{@link https://en.wikipedia.org/wiki/Euler_angles#Rotation_matrix}
   * for a complete list.
   *
   * @param {Euler} euler - The Euler angles.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationFromEuler(e) {
    const t = this.elements, n = e.x, r = e.y, s = e.z, a = Math.cos(n), o = Math.sin(n), c = Math.cos(r), l = Math.sin(r), h = Math.cos(s), f = Math.sin(s);
    if (e.order === "XYZ") {
      const d = a * h, p = a * f, g = o * h, _ = o * f;
      t[0] = c * h, t[4] = -c * f, t[8] = l, t[1] = p + g * l, t[5] = d - _ * l, t[9] = -o * c, t[2] = _ - d * l, t[6] = g + p * l, t[10] = a * c;
    } else if (e.order === "YXZ") {
      const d = c * h, p = c * f, g = l * h, _ = l * f;
      t[0] = d + _ * o, t[4] = g * o - p, t[8] = a * l, t[1] = a * f, t[5] = a * h, t[9] = -o, t[2] = p * o - g, t[6] = _ + d * o, t[10] = a * c;
    } else if (e.order === "ZXY") {
      const d = c * h, p = c * f, g = l * h, _ = l * f;
      t[0] = d - _ * o, t[4] = -a * f, t[8] = g + p * o, t[1] = p + g * o, t[5] = a * h, t[9] = _ - d * o, t[2] = -a * l, t[6] = o, t[10] = a * c;
    } else if (e.order === "ZYX") {
      const d = a * h, p = a * f, g = o * h, _ = o * f;
      t[0] = c * h, t[4] = g * l - p, t[8] = d * l + _, t[1] = c * f, t[5] = _ * l + d, t[9] = p * l - g, t[2] = -l, t[6] = o * c, t[10] = a * c;
    } else if (e.order === "YZX") {
      const d = a * c, p = a * l, g = o * c, _ = o * l;
      t[0] = c * h, t[4] = _ - d * f, t[8] = g * f + p, t[1] = f, t[5] = a * h, t[9] = -o * h, t[2] = -l * h, t[6] = p * f + g, t[10] = d - _ * f;
    } else if (e.order === "XZY") {
      const d = a * c, p = a * l, g = o * c, _ = o * l;
      t[0] = c * h, t[4] = -f, t[8] = l * h, t[1] = d * f + _, t[5] = a * h, t[9] = p * f - g, t[2] = g * f - p, t[6] = o * h, t[10] = _ * f + d;
    }
    return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  /**
   * Sets the rotation component of this matrix to the rotation specified by
   * the given Quaternion as outlined [here]{@link https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion}
   * The rest of the matrix is set to the identity.
   *
   * @param {Quaternion} q - The Quaternion.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationFromQuaternion(e) {
    return this.compose(So, e, yo);
  }
  /**
   * Sets the rotation component of the transformation matrix, looking from `eye` towards
   * `target`, and oriented by the up-direction.
   *
   * @param {Vector3} eye - The eye vector.
   * @param {Vector3} target - The target vector.
   * @param {Vector3} up - The up vector.
   * @return {Matrix4} A reference to this matrix.
   */
  lookAt(e, t, n) {
    const r = this.elements;
    return Lt.subVectors(e, t), Lt.lengthSq() === 0 && (Lt.z = 1), Lt.normalize(), an.crossVectors(n, Lt), an.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Lt.x += 1e-4 : Lt.z += 1e-4, Lt.normalize(), an.crossVectors(n, Lt)), an.normalize(), Ci.crossVectors(Lt, an), r[0] = an.x, r[4] = Ci.x, r[8] = Lt.x, r[1] = an.y, r[5] = Ci.y, r[9] = Lt.y, r[2] = an.z, r[6] = Ci.z, r[10] = Lt.z, this;
  }
  /**
   * Post-multiplies this matrix by the given 4x4 matrix.
   *
   * @param {Matrix4} m - The matrix to multiply with.
   * @return {Matrix4} A reference to this matrix.
   */
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  /**
   * Pre-multiplies this matrix by the given 4x4 matrix.
   *
   * @param {Matrix4} m - The matrix to multiply with.
   * @return {Matrix4} A reference to this matrix.
   */
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  /**
   * Multiples the given 4x4 matrices and stores the result
   * in this matrix.
   *
   * @param {Matrix4} a - The first matrix.
   * @param {Matrix4} b - The second matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  multiplyMatrices(e, t) {
    const n = e.elements, r = t.elements, s = this.elements, a = n[0], o = n[4], c = n[8], l = n[12], h = n[1], f = n[5], d = n[9], p = n[13], g = n[2], _ = n[6], m = n[10], u = n[14], A = n[3], E = n[7], M = n[11], C = n[15], R = r[0], L = r[4], F = r[8], y = r[12], S = r[1], b = r[5], q = r[9], V = r[13], H = r[2], Z = r[6], X = r[10], ee = r[14], z = r[3], se = r[7], he = r[11], Ee = r[15];
    return s[0] = a * R + o * S + c * H + l * z, s[4] = a * L + o * b + c * Z + l * se, s[8] = a * F + o * q + c * X + l * he, s[12] = a * y + o * V + c * ee + l * Ee, s[1] = h * R + f * S + d * H + p * z, s[5] = h * L + f * b + d * Z + p * se, s[9] = h * F + f * q + d * X + p * he, s[13] = h * y + f * V + d * ee + p * Ee, s[2] = g * R + _ * S + m * H + u * z, s[6] = g * L + _ * b + m * Z + u * se, s[10] = g * F + _ * q + m * X + u * he, s[14] = g * y + _ * V + m * ee + u * Ee, s[3] = A * R + E * S + M * H + C * z, s[7] = A * L + E * b + M * Z + C * se, s[11] = A * F + E * q + M * X + C * he, s[15] = A * y + E * V + M * ee + C * Ee, this;
  }
  /**
   * Multiplies every component of the matrix by the given scalar.
   *
   * @param {number} s - The scalar.
   * @return {Matrix4} A reference to this matrix.
   */
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
  }
  /**
   * Computes and returns the determinant of this matrix.
   *
   * Based on the method outlined [here]{@link http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.html}.
   *
   * @return {number} The determinant.
   */
  determinant() {
    const e = this.elements, t = e[0], n = e[4], r = e[8], s = e[12], a = e[1], o = e[5], c = e[9], l = e[13], h = e[2], f = e[6], d = e[10], p = e[14], g = e[3], _ = e[7], m = e[11], u = e[15];
    return g * (+s * c * f - r * l * f - s * o * d + n * l * d + r * o * p - n * c * p) + _ * (+t * c * p - t * l * d + s * a * d - r * a * p + r * l * h - s * c * h) + m * (+t * l * f - t * o * p - s * a * f + n * a * p + s * o * h - n * l * h) + u * (-r * o * h - t * c * f + t * o * d + r * a * f - n * a * d + n * c * h);
  }
  /**
   * Transposes this matrix in place.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  transpose() {
    const e = this.elements;
    let t;
    return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
  }
  /**
   * Sets the position component for this matrix from the given vector,
   * without affecting the rest of the matrix.
   *
   * @param {number|Vector3} x - The x component of the vector or alternatively the vector object.
   * @param {number} y - The y component of the vector.
   * @param {number} z - The z component of the vector.
   * @return {Matrix4} A reference to this matrix.
   */
  setPosition(e, t, n) {
    const r = this.elements;
    return e.isVector3 ? (r[12] = e.x, r[13] = e.y, r[14] = e.z) : (r[12] = e, r[13] = t, r[14] = n), this;
  }
  /**
   * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
   * You can not invert with a determinant of zero. If you attempt this, the method produces
   * a zero matrix instead.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  invert() {
    const e = this.elements, t = e[0], n = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = e[9], d = e[10], p = e[11], g = e[12], _ = e[13], m = e[14], u = e[15], A = f * m * l - _ * d * l + _ * c * p - o * m * p - f * c * u + o * d * u, E = g * d * l - h * m * l - g * c * p + a * m * p + h * c * u - a * d * u, M = h * _ * l - g * f * l + g * o * p - a * _ * p - h * o * u + a * f * u, C = g * f * c - h * _ * c - g * o * d + a * _ * d + h * o * m - a * f * m, R = t * A + n * E + r * M + s * C;
    if (R === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const L = 1 / R;
    return e[0] = A * L, e[1] = (_ * d * s - f * m * s - _ * r * p + n * m * p + f * r * u - n * d * u) * L, e[2] = (o * m * s - _ * c * s + _ * r * l - n * m * l - o * r * u + n * c * u) * L, e[3] = (f * c * s - o * d * s - f * r * l + n * d * l + o * r * p - n * c * p) * L, e[4] = E * L, e[5] = (h * m * s - g * d * s + g * r * p - t * m * p - h * r * u + t * d * u) * L, e[6] = (g * c * s - a * m * s - g * r * l + t * m * l + a * r * u - t * c * u) * L, e[7] = (a * d * s - h * c * s + h * r * l - t * d * l - a * r * p + t * c * p) * L, e[8] = M * L, e[9] = (g * f * s - h * _ * s - g * n * p + t * _ * p + h * n * u - t * f * u) * L, e[10] = (a * _ * s - g * o * s + g * n * l - t * _ * l - a * n * u + t * o * u) * L, e[11] = (h * o * s - a * f * s - h * n * l + t * f * l + a * n * p - t * o * p) * L, e[12] = C * L, e[13] = (h * _ * r - g * f * r + g * n * d - t * _ * d - h * n * m + t * f * m) * L, e[14] = (g * o * r - a * _ * r - g * n * c + t * _ * c + a * n * m - t * o * m) * L, e[15] = (a * f * r - h * o * r + h * n * c - t * f * c - a * n * d + t * o * d) * L, this;
  }
  /**
   * Multiplies the columns of this matrix by the given vector.
   *
   * @param {Vector3} v - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  scale(e) {
    const t = this.elements, n = e.x, r = e.y, s = e.z;
    return t[0] *= n, t[4] *= r, t[8] *= s, t[1] *= n, t[5] *= r, t[9] *= s, t[2] *= n, t[6] *= r, t[10] *= s, t[3] *= n, t[7] *= r, t[11] *= s, this;
  }
  /**
   * Gets the maximum scale value of the three axes.
   *
   * @return {number} The maximum scale.
   */
  getMaxScaleOnAxis() {
    const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, n, r));
  }
  /**
   * Sets this matrix as a translation transform from the given vector.
   *
   * @param {number|Vector3} x - The amount to translate in the X axis or alternatively a translation vector.
   * @param {number} y - The amount to translate in the Y axis.
   * @param {number} z - The amount to translate in the z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeTranslation(e, t, n) {
    return e.isVector3 ? this.set(
      1,
      0,
      0,
      e.x,
      0,
      1,
      0,
      e.y,
      0,
      0,
      1,
      e.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      e,
      0,
      1,
      0,
      t,
      0,
      0,
      1,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the X axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationX(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      t,
      -n,
      0,
      0,
      n,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the Y axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationY(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      0,
      n,
      0,
      0,
      1,
      0,
      0,
      -n,
      0,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the Z axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationZ(e) {
    const t = Math.cos(e), n = Math.sin(e);
    return this.set(
      t,
      -n,
      0,
      0,
      n,
      t,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the given axis by
   * the given angle.
   *
   * This is a somewhat controversial but mathematically sound alternative to
   * rotating via Quaternions. See the discussion [here]{@link https://www.gamedev.net/articles/programming/math-and-physics/do-we-really-need-quaternions-r1199}.
   *
   * @param {Vector3} axis - The normalized rotation axis.
   * @param {number} angle - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationAxis(e, t) {
    const n = Math.cos(t), r = Math.sin(t), s = 1 - n, a = e.x, o = e.y, c = e.z, l = s * a, h = s * o;
    return this.set(
      l * a + n,
      l * o - r * c,
      l * c + r * o,
      0,
      l * o + r * c,
      h * o + n,
      h * c - r * a,
      0,
      l * c - r * o,
      h * c + r * a,
      s * c * c + n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a scale transformation.
   *
   * @param {number} x - The amount to scale in the X axis.
   * @param {number} y - The amount to scale in the Y axis.
   * @param {number} z - The amount to scale in the Z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeScale(e, t, n) {
    return this.set(
      e,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a shear transformation.
   *
   * @param {number} xy - The amount to shear X by Y.
   * @param {number} xz - The amount to shear X by Z.
   * @param {number} yx - The amount to shear Y by X.
   * @param {number} yz - The amount to shear Y by Z.
   * @param {number} zx - The amount to shear Z by X.
   * @param {number} zy - The amount to shear Z by Y.
   * @return {Matrix4} A reference to this matrix.
   */
  makeShear(e, t, n, r, s, a) {
    return this.set(
      1,
      n,
      s,
      0,
      e,
      1,
      a,
      0,
      t,
      r,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix to the transformation composed of the given position,
   * rotation (Quaternion) and scale.
   *
   * @param {Vector3} position - The position vector.
   * @param {Quaternion} quaternion - The rotation as a Quaternion.
   * @param {Vector3} scale - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  compose(e, t, n) {
    const r = this.elements, s = t._x, a = t._y, o = t._z, c = t._w, l = s + s, h = a + a, f = o + o, d = s * l, p = s * h, g = s * f, _ = a * h, m = a * f, u = o * f, A = c * l, E = c * h, M = c * f, C = n.x, R = n.y, L = n.z;
    return r[0] = (1 - (_ + u)) * C, r[1] = (p + M) * C, r[2] = (g - E) * C, r[3] = 0, r[4] = (p - M) * R, r[5] = (1 - (d + u)) * R, r[6] = (m + A) * R, r[7] = 0, r[8] = (g + E) * L, r[9] = (m - A) * L, r[10] = (1 - (d + _)) * L, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this;
  }
  /**
   * Decomposes this matrix into its position, rotation and scale components
   * and provides the result in the given objects.
   *
   * Note: Not all matrices are decomposable in this way. For example, if an
   * object has a non-uniformly scaled parent, then the object's world matrix
   * may not be decomposable, and this method may not be appropriate.
   *
   * @param {Vector3} position - The position vector.
   * @param {Quaternion} quaternion - The rotation as a Quaternion.
   * @param {Vector3} scale - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  decompose(e, t, n) {
    const r = this.elements;
    let s = Un.set(r[0], r[1], r[2]).length();
    const a = Un.set(r[4], r[5], r[6]).length(), o = Un.set(r[8], r[9], r[10]).length();
    this.determinant() < 0 && (s = -s), e.x = r[12], e.y = r[13], e.z = r[14], Gt.copy(this);
    const l = 1 / s, h = 1 / a, f = 1 / o;
    return Gt.elements[0] *= l, Gt.elements[1] *= l, Gt.elements[2] *= l, Gt.elements[4] *= h, Gt.elements[5] *= h, Gt.elements[6] *= h, Gt.elements[8] *= f, Gt.elements[9] *= f, Gt.elements[10] *= f, t.setFromRotationMatrix(Gt), n.x = s, n.y = a, n.z = o, this;
  }
  /**
  	 * Creates a perspective projection matrix. This is used internally by
  	 * {@link PerspectiveCamera#updateProjectionMatrix}.
  
  	 * @param {number} left - Left boundary of the viewing frustum at the near plane.
  	 * @param {number} right - Right boundary of the viewing frustum at the near plane.
  	 * @param {number} top - Top boundary of the viewing frustum at the near plane.
  	 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
  	 * @param {number} near - The distance from the camera to the near plane.
  	 * @param {number} far - The distance from the camera to the far plane.
  	 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
  	 * @param {boolean} [reversedDepth=false] - Whether to use a reversed depth.
  	 * @return {Matrix4} A reference to this matrix.
  	 */
  makePerspective(e, t, n, r, s, a, o = 2e3, c = !1) {
    const l = this.elements, h = 2 * s / (t - e), f = 2 * s / (n - r), d = (t + e) / (t - e), p = (n + r) / (n - r);
    let g, _;
    if (c)
      g = s / (a - s), _ = a * s / (a - s);
    else if (o === 2e3)
      g = -(a + s) / (a - s), _ = -2 * a * s / (a - s);
    else if (o === 2001)
      g = -a / (a - s), _ = -a * s / (a - s);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return l[0] = h, l[4] = 0, l[8] = d, l[12] = 0, l[1] = 0, l[5] = f, l[9] = p, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = g, l[14] = _, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  /**
  	 * Creates a orthographic projection matrix. This is used internally by
  	 * {@link OrthographicCamera#updateProjectionMatrix}.
  
  	 * @param {number} left - Left boundary of the viewing frustum at the near plane.
  	 * @param {number} right - Right boundary of the viewing frustum at the near plane.
  	 * @param {number} top - Top boundary of the viewing frustum at the near plane.
  	 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
  	 * @param {number} near - The distance from the camera to the near plane.
  	 * @param {number} far - The distance from the camera to the far plane.
  	 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
  	 * @param {boolean} [reversedDepth=false] - Whether to use a reversed depth.
  	 * @return {Matrix4} A reference to this matrix.
  	 */
  makeOrthographic(e, t, n, r, s, a, o = 2e3, c = !1) {
    const l = this.elements, h = 2 / (t - e), f = 2 / (n - r), d = -(t + e) / (t - e), p = -(n + r) / (n - r);
    let g, _;
    if (c)
      g = 1 / (a - s), _ = a / (a - s);
    else if (o === 2e3)
      g = -2 / (a - s), _ = -(a + s) / (a - s);
    else if (o === 2001)
      g = -1 / (a - s), _ = -s / (a - s);
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return l[0] = h, l[4] = 0, l[8] = 0, l[12] = d, l[1] = 0, l[5] = f, l[9] = 0, l[13] = p, l[2] = 0, l[6] = 0, l[10] = g, l[14] = _, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
  }
  /**
   * Returns `true` if this matrix is equal with the given one.
   *
   * @param {Matrix4} matrix - The matrix to test for equality.
   * @return {boolean} Whether this matrix is equal with the given one.
   */
  equals(e) {
    const t = this.elements, n = e.elements;
    for (let r = 0; r < 16; r++)
      if (t[r] !== n[r]) return !1;
    return !0;
  }
  /**
   * Sets the elements of the matrix from the given array.
   *
   * @param {Array<number>} array - The matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Matrix4} A reference to this matrix.
   */
  fromArray(e, t = 0) {
    for (let n = 0; n < 16; n++)
      this.elements[n] = e[n + t];
    return this;
  }
  /**
   * Writes the elements of this matrix to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The matrix elements in column-major order.
   */
  toArray(e = [], t = 0) {
    const n = this.elements;
    return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
  }
}
const Un = /* @__PURE__ */ new P(), Gt = /* @__PURE__ */ new Qe(), So = /* @__PURE__ */ new P(0, 0, 0), yo = /* @__PURE__ */ new P(1, 1, 1), an = /* @__PURE__ */ new P(), Ci = /* @__PURE__ */ new P(), Lt = /* @__PURE__ */ new P(), ps = /* @__PURE__ */ new Qe(), ms = /* @__PURE__ */ new wn();
class qt {
  /**
   * Constructs a new euler instance.
   *
   * @param {number} [x=0] - The angle of the x axis in radians.
   * @param {number} [y=0] - The angle of the y axis in radians.
   * @param {number} [z=0] - The angle of the z axis in radians.
   * @param {string} [order=Euler.DEFAULT_ORDER] - A string representing the order that the rotations are applied.
   */
  constructor(e = 0, t = 0, n = 0, r = qt.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = e, this._y = t, this._z = n, this._order = r;
  }
  /**
   * The angle of the x axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  /**
   * The angle of the y axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  /**
   * The angle of the z axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  /**
   * A string representing the order that the rotations are applied.
   *
   * @type {string}
   * @default 'XYZ'
   */
  get order() {
    return this._order;
  }
  set order(e) {
    this._order = e, this._onChangeCallback();
  }
  /**
   * Sets the Euler components.
   *
   * @param {number} x - The angle of the x axis in radians.
   * @param {number} y - The angle of the y axis in radians.
   * @param {number} z - The angle of the z axis in radians.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  set(e, t, n, r = this._order) {
    return this._x = e, this._y = t, this._z = n, this._order = r, this._onChangeCallback(), this;
  }
  /**
   * Returns a new Euler instance with copied values from this instance.
   *
   * @return {Euler} A clone of this instance.
   */
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  /**
   * Copies the values of the given Euler instance to this instance.
   *
   * @param {Euler} euler - The Euler instance to copy.
   * @return {Euler} A reference to this Euler instance.
   */
  copy(e) {
    return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
  }
  /**
   * Sets the angles of this Euler instance from a pure rotation matrix.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromRotationMatrix(e, t = this._order, n = !0) {
    const r = e.elements, s = r[0], a = r[4], o = r[8], c = r[1], l = r[5], h = r[9], f = r[2], d = r[6], p = r[10];
    switch (t) {
      case "XYZ":
        this._y = Math.asin(He(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, p), this._z = Math.atan2(-a, s)) : (this._x = Math.atan2(d, l), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-He(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, p), this._z = Math.atan2(c, l)) : (this._y = Math.atan2(-f, s), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(He(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-f, p), this._z = Math.atan2(-a, l)) : (this._y = 0, this._z = Math.atan2(c, s));
        break;
      case "ZYX":
        this._y = Math.asin(-He(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._x = Math.atan2(d, p), this._z = Math.atan2(c, s)) : (this._x = 0, this._z = Math.atan2(-a, l));
        break;
      case "YZX":
        this._z = Math.asin(He(c, -1, 1)), Math.abs(c) < 0.9999999 ? (this._x = Math.atan2(-h, l), this._y = Math.atan2(-f, s)) : (this._x = 0, this._y = Math.atan2(o, p));
        break;
      case "XZY":
        this._z = Math.asin(-He(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(d, l), this._y = Math.atan2(o, s)) : (this._x = Math.atan2(-h, p), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
    }
    return this._order = t, n === !0 && this._onChangeCallback(), this;
  }
  /**
   * Sets the angles of this Euler instance from a normalized quaternion.
   *
   * @param {Quaternion} q - A normalized Quaternion.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromQuaternion(e, t, n) {
    return ps.makeRotationFromQuaternion(e), this.setFromRotationMatrix(ps, t, n);
  }
  /**
   * Sets the angles of this Euler instance from the given vector.
   *
   * @param {Vector3} v - The vector.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromVector3(e, t = this._order) {
    return this.set(e.x, e.y, e.z, t);
  }
  /**
   * Resets the euler angle with a new order by creating a quaternion from this
   * euler angle and then setting this euler angle with the quaternion and the
   * new order.
   *
   * Warning: This discards revolution information.
   *
   * @param {string} [newOrder] - A string representing the new order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  reorder(e) {
    return ms.setFromEuler(this), this.setFromQuaternion(ms, e);
  }
  /**
   * Returns `true` if this Euler instance is equal with the given one.
   *
   * @param {Euler} euler - The Euler instance to test for equality.
   * @return {boolean} Whether this Euler instance is equal with the given one.
   */
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }
  /**
   * Sets this Euler instance's components to values from the given array. The first three
   * entries of the array are assign to the x,y and z components. An optional fourth entry
   * defines the Euler order.
   *
   * @param {Array<number,number,number,?string>} array - An array holding the Euler component values.
   * @return {Euler} A reference to this Euler instance.
   */
  fromArray(e) {
    return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
  }
  /**
   * Writes the components of this Euler instance to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number,number,number,string>} [array=[]] - The target array holding the Euler components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number,number,number,string>} The Euler components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
qt.DEFAULT_ORDER = "XYZ";
class jr {
  /**
   * Constructs a new layers instance, with membership
   * initially set to layer `0`.
   */
  constructor() {
    this.mask = 1;
  }
  /**
   * Sets membership to the given layer, and remove membership all other layers.
   *
   * @param {number} layer - The layer to set.
   */
  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }
  /**
   * Adds membership of the given layer.
   *
   * @param {number} layer - The layer to enable.
   */
  enable(e) {
    this.mask |= 1 << e | 0;
  }
  /**
   * Adds membership to all layers.
   */
  enableAll() {
    this.mask = -1;
  }
  /**
   * Toggles the membership of the given layer.
   *
   * @param {number} layer - The layer to toggle.
   */
  toggle(e) {
    this.mask ^= 1 << e | 0;
  }
  /**
   * Removes membership of the given layer.
   *
   * @param {number} layer - The layer to enable.
   */
  disable(e) {
    this.mask &= ~(1 << e | 0);
  }
  /**
   * Removes the membership from all layers.
   */
  disableAll() {
    this.mask = 0;
  }
  /**
   * Returns `true` if this and the given layers object have at least one
   * layer in common.
   *
   * @param {Layers} layers - The layers to test.
   * @return {boolean } Whether this and the given layers object have at least one layer in common or not.
   */
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  /**
   * Returns `true` if the given layer is enabled.
   *
   * @param {number} layer - The layer to test.
   * @return {boolean } Whether the given layer is enabled or not.
   */
  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}
let Eo = 0;
const gs = /* @__PURE__ */ new P(), In = /* @__PURE__ */ new wn(), $t = /* @__PURE__ */ new Qe(), Pi = /* @__PURE__ */ new P(), oi = /* @__PURE__ */ new P(), To = /* @__PURE__ */ new P(), Ao = /* @__PURE__ */ new wn(), _s = /* @__PURE__ */ new P(1, 0, 0), vs = /* @__PURE__ */ new P(0, 1, 0), xs = /* @__PURE__ */ new P(0, 0, 1), Ms = { type: "added" }, bo = { type: "removed" }, Fn = { type: "childadded", child: null }, Sr = { type: "childremoved", child: null };
class ft extends ti {
  /**
   * Constructs a new 3D object.
   */
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: Eo++ }), this.uuid = en(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = ft.DEFAULT_UP.clone();
    const e = new P(), t = new qt(), n = new wn(), r = new P(1, 1, 1);
    function s() {
      n.setFromEuler(t, !1);
    }
    function a() {
      t.setFromQuaternion(n, void 0, !1);
    }
    t._onChange(s), n._onChange(a), Object.defineProperties(this, {
      /**
       * Represents the object's local position.
       *
       * @name Object3D#position
       * @type {Vector3}
       * @default (0,0,0)
       */
      position: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      /**
       * Represents the object's local rotation as Euler angles, in radians.
       *
       * @name Object3D#rotation
       * @type {Euler}
       * @default (0,0,0)
       */
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      /**
       * Represents the object's local rotation as Quaternions.
       *
       * @name Object3D#quaternion
       * @type {Quaternion}
       */
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      /**
       * Represents the object's local scale.
       *
       * @name Object3D#scale
       * @type {Vector3}
       * @default (1,1,1)
       */
      scale: {
        configurable: !0,
        enumerable: !0,
        value: r
      },
      /**
       * Represents the object's model-view matrix.
       *
       * @name Object3D#modelViewMatrix
       * @type {Matrix4}
       */
      modelViewMatrix: {
        value: new Qe()
      },
      /**
       * Represents the object's normal matrix.
       *
       * @name Object3D#normalMatrix
       * @type {Matrix3}
       */
      normalMatrix: {
        value: new Ne()
      }
    }), this.matrix = new Qe(), this.matrixWorld = new Qe(), this.matrixAutoUpdate = ft.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new jr(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.userData = {};
  }
  /**
   * A callback that is executed immediately before a 3D object is rendered to a shadow map.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {Camera} shadowCamera - The shadow camera.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} depthMaterial - The depth material.
   * @param {Object} group - The geometry group data.
   */
  onBeforeShadow() {
  }
  /**
   * A callback that is executed immediately after a 3D object is rendered to a shadow map.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {Camera} shadowCamera - The shadow camera.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} depthMaterial - The depth material.
   * @param {Object} group - The geometry group data.
   */
  onAfterShadow() {
  }
  /**
   * A callback that is executed immediately before a 3D object is rendered.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} material - The 3D object's material.
   * @param {Object} group - The geometry group data.
   */
  onBeforeRender() {
  }
  /**
   * A callback that is executed immediately after a 3D object is rendered.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} material - The 3D object's material.
   * @param {Object} group - The geometry group data.
   */
  onAfterRender() {
  }
  /**
   * Applies the given transformation matrix to the object and updates the object's position,
   * rotation and scale.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   */
  applyMatrix4(e) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  /**
   * Applies a rotation represented by given the quaternion to the 3D object.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Object3D} A reference to this instance.
   */
  applyQuaternion(e) {
    return this.quaternion.premultiply(e), this;
  }
  /**
   * Sets the given rotation represented as an axis/angle couple to the 3D object.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   */
  setRotationFromAxisAngle(e, t) {
    this.quaternion.setFromAxisAngle(e, t);
  }
  /**
   * Sets the given rotation represented as Euler angles to the 3D object.
   *
   * @param {Euler} euler - The Euler angles.
   */
  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, !0);
  }
  /**
   * Sets the given rotation represented as rotation matrix to the 3D object.
   *
   * @param {Matrix4} m - Although a 4x4 matrix is expected, the upper 3x3 portion must be
   * a pure rotation matrix (i.e, unscaled).
   */
  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }
  /**
   * Sets the given rotation represented as a Quaternion to the 3D object.
   *
   * @param {Quaternion} q - The Quaternion
   */
  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }
  /**
   * Rotates the 3D object along an axis in local space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateOnAxis(e, t) {
    return In.setFromAxisAngle(e, t), this.quaternion.multiply(In), this;
  }
  /**
   * Rotates the 3D object along an axis in world space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateOnWorldAxis(e, t) {
    return In.setFromAxisAngle(e, t), this.quaternion.premultiply(In), this;
  }
  /**
   * Rotates the 3D object around its X axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateX(e) {
    return this.rotateOnAxis(_s, e);
  }
  /**
   * Rotates the 3D object around its Y axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateY(e) {
    return this.rotateOnAxis(vs, e);
  }
  /**
   * Rotates the 3D object around its Z axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateZ(e) {
    return this.rotateOnAxis(xs, e);
  }
  /**
   * Translate the 3D object by a distance along the given axis in local space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateOnAxis(e, t) {
    return gs.copy(e).applyQuaternion(this.quaternion), this.position.add(gs.multiplyScalar(t)), this;
  }
  /**
   * Translate the 3D object by a distance along its X-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateX(e) {
    return this.translateOnAxis(_s, e);
  }
  /**
   * Translate the 3D object by a distance along its Y-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateY(e) {
    return this.translateOnAxis(vs, e);
  }
  /**
   * Translate the 3D object by a distance along its Z-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateZ(e) {
    return this.translateOnAxis(xs, e);
  }
  /**
   * Converts the given vector from this 3D object's local space to world space.
   *
   * @param {Vector3} vector - The vector to convert.
   * @return {Vector3} The converted vector.
   */
  localToWorld(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
  }
  /**
   * Converts the given vector from this 3D object's word space to local space.
   *
   * @param {Vector3} vector - The vector to convert.
   * @return {Vector3} The converted vector.
   */
  worldToLocal(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4($t.copy(this.matrixWorld).invert());
  }
  /**
   * Rotates the object to face a point in world space.
   *
   * This method does not support objects having non-uniformly-scaled parent(s).
   *
   * @param {number|Vector3} x - The x coordinate in world space. Alternatively, a vector representing a position in world space
   * @param {number} [y] - The y coordinate in world space.
   * @param {number} [z] - The z coordinate in world space.
   */
  lookAt(e, t, n) {
    e.isVector3 ? Pi.copy(e) : Pi.set(e, t, n);
    const r = this.parent;
    this.updateWorldMatrix(!0, !1), oi.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? $t.lookAt(oi, Pi, this.up) : $t.lookAt(Pi, oi, this.up), this.quaternion.setFromRotationMatrix($t), r && ($t.extractRotation(r.matrixWorld), In.setFromRotationMatrix($t), this.quaternion.premultiply(In.invert()));
  }
  /**
   * Adds the given 3D object as a child to this 3D object. An arbitrary number of
   * objects may be added. Any current parent on an object passed in here will be
   * removed, since an object can have at most one parent.
   *
   * @fires Object3D#added
   * @fires Object3D#childadded
   * @param {Object3D} object - The 3D object to add.
   * @return {Object3D} A reference to this instance.
   */
  add(e) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++)
        this.add(arguments[t]);
      return this;
    }
    return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(Ms), Fn.child = e, this.dispatchEvent(Fn), Fn.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
  }
  /**
   * Removes the given 3D object as child from this 3D object.
   * An arbitrary number of objects may be removed.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @param {Object3D} object - The 3D object to remove.
   * @return {Object3D} A reference to this instance.
   */
  remove(e) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const t = this.children.indexOf(e);
    return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(bo), Sr.child = e, this.dispatchEvent(Sr), Sr.child = null), this;
  }
  /**
   * Removes this 3D object from its current parent.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @return {Object3D} A reference to this instance.
   */
  removeFromParent() {
    const e = this.parent;
    return e !== null && e.remove(this), this;
  }
  /**
   * Removes all child objects.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @return {Object3D} A reference to this instance.
   */
  clear() {
    return this.remove(...this.children);
  }
  /**
   * Adds the given 3D object as a child of this 3D object, while maintaining the object's world
   * transform. This method does not support scene graphs having non-uniformly-scaled nodes(s).
   *
   * @fires Object3D#added
   * @fires Object3D#childadded
   * @param {Object3D} object - The 3D object to attach.
   * @return {Object3D} A reference to this instance.
   */
  attach(e) {
    return this.updateWorldMatrix(!0, !1), $t.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), $t.multiply(e.parent.matrixWorld)), e.applyMatrix4($t), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(Ms), Fn.child = e, this.dispatchEvent(Fn), Fn.child = null, this;
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching ID.
   *
   * @param {number} id - The id.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching name.
   *
   * @param {string} name - The name.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching property value.
   *
   * @param {string} name - The name of the property.
   * @param {any} value - The value.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectByProperty(e, t) {
    if (this[e] === t) return this;
    for (let n = 0, r = this.children.length; n < r; n++) {
      const a = this.children[n].getObjectByProperty(e, t);
      if (a !== void 0)
        return a;
    }
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns all 3D objects with a matching property value.
   *
   * @param {string} name - The name of the property.
   * @param {any} value - The value.
   * @param {Array<Object3D>} result - The method stores the result in this array.
   * @return {Array<Object3D>} The found 3D objects.
   */
  getObjectsByProperty(e, t, n = []) {
    this[e] === t && n.push(this);
    const r = this.children;
    for (let s = 0, a = r.length; s < a; s++)
      r[s].getObjectsByProperty(e, t, n);
    return n;
  }
  /**
   * Returns a vector representing the position of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's position in world space.
   */
  getWorldPosition(e) {
    return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
  }
  /**
   * Returns a Quaternion representing the position of the 3D object in world space.
   *
   * @param {Quaternion} target - The target Quaternion the result is stored to.
   * @return {Quaternion} The 3D object's rotation in world space.
   */
  getWorldQuaternion(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(oi, e, To), e;
  }
  /**
   * Returns a vector representing the scale of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's scale in world space.
   */
  getWorldScale(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(oi, Ao, e), e;
  }
  /**
   * Returns a vector representing the ("look") direction of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's direction in world space.
   */
  getWorldDirection(e) {
    this.updateWorldMatrix(!0, !1);
    const t = this.matrixWorld.elements;
    return e.set(t[8], t[9], t[10]).normalize();
  }
  /**
   * Abstract method to get intersections between a casted ray and this
   * 3D object. Renderable 3D objects such as {@link Mesh}, {@link Line} or {@link Points}
   * implement this method in order to use raycasting.
   *
   * @abstract
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - An array holding the result of the method.
   */
  raycast() {
  }
  /**
   * Executes the callback on this 3D object and all descendants.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverse(e) {
    e(this);
    const t = this.children;
    for (let n = 0, r = t.length; n < r; n++)
      t[n].traverse(e);
  }
  /**
   * Like {@link Object3D#traverse}, but the callback will only be executed for visible 3D objects.
   * Descendants of invisible 3D objects are not traversed.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverseVisible(e) {
    if (this.visible === !1) return;
    e(this);
    const t = this.children;
    for (let n = 0, r = t.length; n < r; n++)
      t[n].traverseVisible(e);
  }
  /**
   * Like {@link Object3D#traverse}, but the callback will only be executed for all ancestors.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverseAncestors(e) {
    const t = this.parent;
    t !== null && (e(t), t.traverseAncestors(e));
  }
  /**
   * Updates the transformation matrix in local space by computing it from the current
   * position, rotation and scale values.
   */
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  /**
   * Updates the transformation matrix in world space of this 3D objects and its descendants.
   *
   * To ensure correct results, this method also recomputes the 3D object's transformation matrix in
   * local space. The computation of the local and world matrix can be controlled with the
   * {@link Object3D#matrixAutoUpdate} and {@link Object3D#matrixWorldAutoUpdate} flags which are both
   * `true` by default.  Set these flags to `false` if you need more control over the update matrix process.
   *
   * @param {boolean} [force=false] - When set to `true`, a recomputation of world matrices is forced even
   * when {@link Object3D#matrixWorldAutoUpdate} is set to `false`.
   */
  updateMatrixWorld(e) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
    const t = this.children;
    for (let n = 0, r = t.length; n < r; n++)
      t[n].updateMatrixWorld(e);
  }
  /**
   * An alternative version of {@link Object3D#updateMatrixWorld} with more control over the
   * update of ancestor and descendant nodes.
   *
   * @param {boolean} [updateParents=false] Whether ancestor nodes should be updated or not.
   * @param {boolean} [updateChildren=false] Whether descendant nodes should be updated or not.
   */
  updateWorldMatrix(e, t) {
    const n = this.parent;
    if (e === !0 && n !== null && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t === !0) {
      const r = this.children;
      for (let s = 0, a = r.length; s < a; s++)
        r[s].updateWorldMatrix(!1, !0);
    }
  }
  /**
   * Serializes the 3D object into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized 3D object.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(e) {
    const t = e === void 0 || typeof e == "string", n = {};
    t && (e = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.7,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const r = {};
    r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.castShadow === !0 && (r.castShadow = !0), this.receiveShadow === !0 && (r.receiveShadow = !0), this.visible === !1 && (r.visible = !1), this.frustumCulled === !1 && (r.frustumCulled = !1), this.renderOrder !== 0 && (r.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.geometryInfo = this._geometryInfo.map((o) => ({
      ...o,
      boundingBox: o.boundingBox ? o.boundingBox.toJSON() : void 0,
      boundingSphere: o.boundingSphere ? o.boundingSphere.toJSON() : void 0
    })), r.instanceInfo = this._instanceInfo.map((o) => ({ ...o })), r.availableInstanceIds = this._availableInstanceIds.slice(), r.availableGeometryIds = this._availableGeometryIds.slice(), r.nextIndexStart = this._nextIndexStart, r.nextVertexStart = this._nextVertexStart, r.geometryCount = this._geometryCount, r.maxInstanceCount = this._maxInstanceCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.matricesTexture = this._matricesTexture.toJSON(e), r.indirectTexture = this._indirectTexture.toJSON(e), this._colorsTexture !== null && (r.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (r.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (r.boundingBox = this.boundingBox.toJSON()));
    function s(o, c) {
      return o[c.uuid] === void 0 && (o[c.uuid] = c.toJSON(e)), c.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(e).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      r.geometry = s(e.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const c = o.shapes;
        if (Array.isArray(c))
          for (let l = 0, h = c.length; l < h; l++) {
            const f = c[l];
            s(e.shapes, f);
          }
        else
          s(e.shapes, c);
      }
    }
    if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (s(e.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let c = 0, l = this.material.length; c < l; c++)
          o.push(s(e.materials, this.material[c]));
        r.material = o;
      } else
        r.material = s(e.materials, this.material);
    if (this.children.length > 0) {
      r.children = [];
      for (let o = 0; o < this.children.length; o++)
        r.children.push(this.children[o].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      r.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const c = this.animations[o];
        r.animations.push(s(e.animations, c));
      }
    }
    if (t) {
      const o = a(e.geometries), c = a(e.materials), l = a(e.textures), h = a(e.images), f = a(e.shapes), d = a(e.skeletons), p = a(e.animations), g = a(e.nodes);
      o.length > 0 && (n.geometries = o), c.length > 0 && (n.materials = c), l.length > 0 && (n.textures = l), h.length > 0 && (n.images = h), f.length > 0 && (n.shapes = f), d.length > 0 && (n.skeletons = d), p.length > 0 && (n.animations = p), g.length > 0 && (n.nodes = g);
    }
    return n.object = r, n;
    function a(o) {
      const c = [];
      for (const l in o) {
        const h = o[l];
        delete h.metadata, c.push(h);
      }
      return c;
    }
  }
  /**
   * Returns a new 3D object with copied values from this instance.
   *
   * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are also cloned.
   * @return {Object3D} A clone of this instance.
   */
  clone(e) {
    return new this.constructor().copy(this, e);
  }
  /**
   * Copies the values of the given 3D object to this instance.
   *
   * @param {Object3D} source - The 3D object to copy.
   * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are cloned.
   * @return {Object3D} A reference to this instance.
   */
  copy(e, t = !0) {
    if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0)
      for (let n = 0; n < e.children.length; n++) {
        const r = e.children[n];
        this.add(r.clone());
      }
    return this;
  }
}
ft.DEFAULT_UP = /* @__PURE__ */ new P(0, 1, 0);
ft.DEFAULT_MATRIX_AUTO_UPDATE = !0;
ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const Vt = /* @__PURE__ */ new P(), jt = /* @__PURE__ */ new P(), yr = /* @__PURE__ */ new P(), Jt = /* @__PURE__ */ new P(), Nn = /* @__PURE__ */ new P(), Bn = /* @__PURE__ */ new P(), Ss = /* @__PURE__ */ new P(), Er = /* @__PURE__ */ new P(), Tr = /* @__PURE__ */ new P(), Ar = /* @__PURE__ */ new P(), br = /* @__PURE__ */ new ht(), wr = /* @__PURE__ */ new ht(), Rr = /* @__PURE__ */ new ht();
class Ot {
  /**
   * Constructs a new triangle.
   *
   * @param {Vector3} [a=(0,0,0)] - The first corner of the triangle.
   * @param {Vector3} [b=(0,0,0)] - The second corner of the triangle.
   * @param {Vector3} [c=(0,0,0)] - The third corner of the triangle.
   */
  constructor(e = new P(), t = new P(), n = new P()) {
    this.a = e, this.b = t, this.c = n;
  }
  /**
   * Computes the normal vector of a triangle.
   *
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The triangle's normal.
   */
  static getNormal(e, t, n, r) {
    r.subVectors(n, t), Vt.subVectors(e, t), r.cross(Vt);
    const s = r.lengthSq();
    return s > 0 ? r.multiplyScalar(1 / Math.sqrt(s)) : r.set(0, 0, 0);
  }
  /**
   * Computes a barycentric coordinates from the given vector.
   * Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - A point in 3D space.
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The barycentric coordinates for the given point
   */
  static getBarycoord(e, t, n, r, s) {
    Vt.subVectors(r, t), jt.subVectors(n, t), yr.subVectors(e, t);
    const a = Vt.dot(Vt), o = Vt.dot(jt), c = Vt.dot(yr), l = jt.dot(jt), h = jt.dot(yr), f = a * l - o * o;
    if (f === 0)
      return s.set(0, 0, 0), null;
    const d = 1 / f, p = (l * c - o * h) * d, g = (a * h - o * c) * d;
    return s.set(1 - p - g, g, p);
  }
  /**
   * Returns `true` if the given point, when projected onto the plane of the
   * triangle, lies within the triangle.
   *
   * @param {Vector3} point - The point in 3D space to test.
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @return {boolean} Whether the given point, when projected onto the plane of the
   * triangle, lies within the triangle or not.
   */
  static containsPoint(e, t, n, r) {
    return this.getBarycoord(e, t, n, r, Jt) === null ? !1 : Jt.x >= 0 && Jt.y >= 0 && Jt.x + Jt.y <= 1;
  }
  /**
   * Computes the value barycentrically interpolated for the given point on the
   * triangle. Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - Position of interpolated point.
   * @param {Vector3} p1 - The first corner of the triangle.
   * @param {Vector3} p2 - The second corner of the triangle.
   * @param {Vector3} p3 - The third corner of the triangle.
   * @param {Vector3} v1 - Value to interpolate of first vertex.
   * @param {Vector3} v2 - Value to interpolate of second vertex.
   * @param {Vector3} v3 - Value to interpolate of third vertex.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The interpolated value.
   */
  static getInterpolation(e, t, n, r, s, a, o, c) {
    return this.getBarycoord(e, t, n, r, Jt) === null ? (c.x = 0, c.y = 0, "z" in c && (c.z = 0), "w" in c && (c.w = 0), null) : (c.setScalar(0), c.addScaledVector(s, Jt.x), c.addScaledVector(a, Jt.y), c.addScaledVector(o, Jt.z), c);
  }
  /**
   * Computes the value barycentrically interpolated for the given attribute and indices.
   *
   * @param {BufferAttribute} attr - The attribute to interpolate.
   * @param {number} i1 - Index of first vertex.
   * @param {number} i2 - Index of second vertex.
   * @param {number} i3 - Index of third vertex.
   * @param {Vector3} barycoord - The barycoordinate value to use to interpolate.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The interpolated attribute value.
   */
  static getInterpolatedAttribute(e, t, n, r, s, a) {
    return br.setScalar(0), wr.setScalar(0), Rr.setScalar(0), br.fromBufferAttribute(e, t), wr.fromBufferAttribute(e, n), Rr.fromBufferAttribute(e, r), a.setScalar(0), a.addScaledVector(br, s.x), a.addScaledVector(wr, s.y), a.addScaledVector(Rr, s.z), a;
  }
  /**
   * Returns `true` if the triangle is oriented towards the given direction.
   *
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @param {Vector3} direction - The (normalized) direction vector.
   * @return {boolean} Whether the triangle is oriented towards the given direction or not.
   */
  static isFrontFacing(e, t, n, r) {
    return Vt.subVectors(n, t), jt.subVectors(e, t), Vt.cross(jt).dot(r) < 0;
  }
  /**
   * Sets the triangle's vertices by copying the given values.
   *
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @return {Triangle} A reference to this triangle.
   */
  set(e, t, n) {
    return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
  }
  /**
   * Sets the triangle's vertices by copying the given array values.
   *
   * @param {Array<Vector3>} points - An array with 3D points.
   * @param {number} i0 - The array index representing the first corner of the triangle.
   * @param {number} i1 - The array index representing the second corner of the triangle.
   * @param {number} i2 - The array index representing the third corner of the triangle.
   * @return {Triangle} A reference to this triangle.
   */
  setFromPointsAndIndices(e, t, n, r) {
    return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[r]), this;
  }
  /**
   * Sets the triangle's vertices by copying the given attribute values.
   *
   * @param {BufferAttribute} attribute - A buffer attribute with 3D points data.
   * @param {number} i0 - The attribute index representing the first corner of the triangle.
   * @param {number} i1 - The attribute index representing the second corner of the triangle.
   * @param {number} i2 - The attribute index representing the third corner of the triangle.
   * @return {Triangle} A reference to this triangle.
   */
  setFromAttributeAndIndices(e, t, n, r) {
    return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, r), this;
  }
  /**
   * Returns a new triangle with copied values from this instance.
   *
   * @return {Triangle} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given triangle to this instance.
   *
   * @param {Triangle} triangle - The triangle to copy.
   * @return {Triangle} A reference to this triangle.
   */
  copy(e) {
    return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
  }
  /**
   * Computes the area of the triangle.
   *
   * @return {number} The triangle's area.
   */
  getArea() {
    return Vt.subVectors(this.c, this.b), jt.subVectors(this.a, this.b), Vt.cross(jt).length() * 0.5;
  }
  /**
   * Computes the midpoint of the triangle.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The triangle's midpoint.
   */
  getMidpoint(e) {
    return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  /**
   * Computes the normal of the triangle.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The triangle's normal.
   */
  getNormal(e) {
    return Ot.getNormal(this.a, this.b, this.c, e);
  }
  /**
   * Computes a plane the triangle lies within.
   *
   * @param {Plane} target - The target vector that is used to store the method's result.
   * @return {Plane} The plane the triangle lies within.
   */
  getPlane(e) {
    return e.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  /**
   * Computes a barycentric coordinates from the given vector.
   * Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - A point in 3D space.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The barycentric coordinates for the given point
   */
  getBarycoord(e, t) {
    return Ot.getBarycoord(e, this.a, this.b, this.c, t);
  }
  /**
   * Computes the value barycentrically interpolated for the given point on the
   * triangle. Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - Position of interpolated point.
   * @param {Vector3} v1 - Value to interpolate of first vertex.
   * @param {Vector3} v2 - Value to interpolate of second vertex.
   * @param {Vector3} v3 - Value to interpolate of third vertex.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The interpolated value.
   */
  getInterpolation(e, t, n, r, s) {
    return Ot.getInterpolation(e, this.a, this.b, this.c, t, n, r, s);
  }
  /**
   * Returns `true` if the given point, when projected onto the plane of the
   * triangle, lies within the triangle.
   *
   * @param {Vector3} point - The point in 3D space to test.
   * @return {boolean} Whether the given point, when projected onto the plane of the
   * triangle, lies within the triangle or not.
   */
  containsPoint(e) {
    return Ot.containsPoint(e, this.a, this.b, this.c);
  }
  /**
   * Returns `true` if the triangle is oriented towards the given direction.
   *
   * @param {Vector3} direction - The (normalized) direction vector.
   * @return {boolean} Whether the triangle is oriented towards the given direction or not.
   */
  isFrontFacing(e) {
    return Ot.isFrontFacing(this.a, this.b, this.c, e);
  }
  /**
   * Returns `true` if this triangle intersects with the given box.
   *
   * @param {Box3} box - The box to intersect.
   * @return {boolean} Whether this triangle intersects with the given box or not.
   */
  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }
  /**
   * Returns the closest point on the triangle to the given point.
   *
   * @param {Vector3} p - The point to compute the closest point for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The closest point on the triangle.
   */
  closestPointToPoint(e, t) {
    const n = this.a, r = this.b, s = this.c;
    let a, o;
    Nn.subVectors(r, n), Bn.subVectors(s, n), Er.subVectors(e, n);
    const c = Nn.dot(Er), l = Bn.dot(Er);
    if (c <= 0 && l <= 0)
      return t.copy(n);
    Tr.subVectors(e, r);
    const h = Nn.dot(Tr), f = Bn.dot(Tr);
    if (h >= 0 && f <= h)
      return t.copy(r);
    const d = c * f - h * l;
    if (d <= 0 && c >= 0 && h <= 0)
      return a = c / (c - h), t.copy(n).addScaledVector(Nn, a);
    Ar.subVectors(e, s);
    const p = Nn.dot(Ar), g = Bn.dot(Ar);
    if (g >= 0 && p <= g)
      return t.copy(s);
    const _ = p * l - c * g;
    if (_ <= 0 && l >= 0 && g <= 0)
      return o = l / (l - g), t.copy(n).addScaledVector(Bn, o);
    const m = h * g - p * f;
    if (m <= 0 && f - h >= 0 && p - g >= 0)
      return Ss.subVectors(s, r), o = (f - h) / (f - h + (p - g)), t.copy(r).addScaledVector(Ss, o);
    const u = 1 / (m + _ + d);
    return a = _ * u, o = d * u, t.copy(n).addScaledVector(Nn, a).addScaledVector(Bn, o);
  }
  /**
   * Returns `true` if this triangle is equal with the given one.
   *
   * @param {Triangle} triangle - The triangle to test for equality.
   * @return {boolean} Whether this triangle is equal with the given one.
   */
  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
const ya = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, on = { h: 0, s: 0, l: 0 }, Di = { h: 0, s: 0, l: 0 };
function Cr(i, e, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? i + (e - i) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? i + (e - i) * 6 * (2 / 3 - t) : i;
}
class Se {
  /**
   * Constructs a new color.
   *
   * Note that standard method of specifying color in three.js is with a hexadecimal triplet,
   * and that method is used throughout the rest of the documentation.
   *
   * @param {(number|string|Color)} [r] - The red component of the color. If `g` and `b` are
   * not provided, it can be hexadecimal triplet, a CSS-style string or another `Color` instance.
   * @param {number} [g] - The green component.
   * @param {number} [b] - The blue component.
   */
  constructor(e, t, n) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
  }
  /**
   * Sets the colors's components from the given values.
   *
   * @param {(number|string|Color)} [r] - The red component of the color. If `g` and `b` are
   * not provided, it can be hexadecimal triplet, a CSS-style string or another `Color` instance.
   * @param {number} [g] - The green component.
   * @param {number} [b] - The blue component.
   * @return {Color} A reference to this color.
   */
  set(e, t, n) {
    if (t === void 0 && n === void 0) {
      const r = e;
      r && r.isColor ? this.copy(r) : typeof r == "number" ? this.setHex(r) : typeof r == "string" && this.setStyle(r);
    } else
      this.setRGB(e, t, n);
    return this;
  }
  /**
   * Sets the colors's components to the given scalar value.
   *
   * @param {number} scalar - The scalar value.
   * @return {Color} A reference to this color.
   */
  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }
  /**
   * Sets this color from a hexadecimal value.
   *
   * @param {number} hex - The hexadecimal value.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setHex(e, t = bt) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, We.colorSpaceToWorking(this, t), this;
  }
  /**
   * Sets this color from RGB values.
   *
   * @param {number} r - Red channel value between `0.0` and `1.0`.
   * @param {number} g - Green channel value between `0.0` and `1.0`.
   * @param {number} b - Blue channel value between `0.0` and `1.0`.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setRGB(e, t, n, r = We.workingColorSpace) {
    return this.r = e, this.g = t, this.b = n, We.colorSpaceToWorking(this, r), this;
  }
  /**
   * Sets this color from RGB values.
   *
   * @param {number} h - Hue value between `0.0` and `1.0`.
   * @param {number} s - Saturation value between `0.0` and `1.0`.
   * @param {number} l - Lightness value between `0.0` and `1.0`.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setHSL(e, t, n, r = We.workingColorSpace) {
    if (e = Zr(e, 1), t = He(t, 0, 1), n = He(n, 0, 1), t === 0)
      this.r = this.g = this.b = n;
    else {
      const s = n <= 0.5 ? n * (1 + t) : n + t - n * t, a = 2 * n - s;
      this.r = Cr(a, s, e + 1 / 3), this.g = Cr(a, s, e), this.b = Cr(a, s, e - 1 / 3);
    }
    return We.colorSpaceToWorking(this, r), this;
  }
  /**
   * Sets this color from a CSS-style string. For example, `rgb(250, 0,0)`,
   * `rgb(100%, 0%, 0%)`, `hsl(0, 100%, 50%)`, `#ff0000`, `#f00`, or `red` ( or
   * any [X11 color name]{@link https://en.wikipedia.org/wiki/X11_color_names#Color_name_chart} -
   * all 140 color names are supported).
   *
   * @param {string} style - Color as a CSS-style string.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setStyle(e, t = bt) {
    function n(s) {
      s !== void 0 && parseFloat(s) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
    }
    let r;
    if (r = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let s;
      const a = r[1], o = r[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (s = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(s[4]), this.setRGB(
              Math.min(255, parseInt(s[1], 10)) / 255,
              Math.min(255, parseInt(s[2], 10)) / 255,
              Math.min(255, parseInt(s[3], 10)) / 255,
              t
            );
          if (s = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(s[4]), this.setRGB(
              Math.min(100, parseInt(s[1], 10)) / 100,
              Math.min(100, parseInt(s[2], 10)) / 100,
              Math.min(100, parseInt(s[3], 10)) / 100,
              t
            );
          break;
        case "hsl":
        case "hsla":
          if (s = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(s[4]), this.setHSL(
              parseFloat(s[1]) / 360,
              parseFloat(s[2]) / 100,
              parseFloat(s[3]) / 100,
              t
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + e);
      }
    } else if (r = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const s = r[1], a = s.length;
      if (a === 3)
        return this.setRGB(
          parseInt(s.charAt(0), 16) / 15,
          parseInt(s.charAt(1), 16) / 15,
          parseInt(s.charAt(2), 16) / 15,
          t
        );
      if (a === 6)
        return this.setHex(parseInt(s, 16), t);
      console.warn("THREE.Color: Invalid hex color " + e);
    } else if (e && e.length > 0)
      return this.setColorName(e, t);
    return this;
  }
  /**
   * Sets this color from a color name. Faster than {@link Color#setStyle} if
   * you don't need the other CSS-style formats.
   *
   * For convenience, the list of names is exposed in `Color.NAMES` as a hash.
   * ```js
   * Color.NAMES.aliceblue // returns 0xF0F8FF
   * ```
   *
   * @param {string} style - The color name.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setColorName(e, t = bt) {
    const n = ya[e.toLowerCase()];
    return n !== void 0 ? this.setHex(n, t) : console.warn("THREE.Color: Unknown color " + e), this;
  }
  /**
   * Returns a new color with copied values from this instance.
   *
   * @return {Color} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  /**
   * Copies the values of the given color to this instance.
   *
   * @param {Color} color - The color to copy.
   * @return {Color} A reference to this color.
   */
  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  /**
   * Copies the given color into this color, and then converts this color from
   * `SRGBColorSpace` to `LinearSRGBColorSpace`.
   *
   * @param {Color} color - The color to copy/convert.
   * @return {Color} A reference to this color.
   */
  copySRGBToLinear(e) {
    return this.r = tn(e.r), this.g = tn(e.g), this.b = tn(e.b), this;
  }
  /**
   * Copies the given color into this color, and then converts this color from
   * `LinearSRGBColorSpace` to `SRGBColorSpace`.
   *
   * @param {Color} color - The color to copy/convert.
   * @return {Color} A reference to this color.
   */
  copyLinearToSRGB(e) {
    return this.r = $n(e.r), this.g = $n(e.g), this.b = $n(e.b), this;
  }
  /**
   * Converts this color from `SRGBColorSpace` to `LinearSRGBColorSpace`.
   *
   * @return {Color} A reference to this color.
   */
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  /**
   * Converts this color from `LinearSRGBColorSpace` to `SRGBColorSpace`.
   *
   * @return {Color} A reference to this color.
   */
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  /**
   * Returns the hexadecimal value of this color.
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {number} The hexadecimal value.
   */
  getHex(e = bt) {
    return We.workingToColorSpace(yt.copy(this), e), Math.round(He(yt.r * 255, 0, 255)) * 65536 + Math.round(He(yt.g * 255, 0, 255)) * 256 + Math.round(He(yt.b * 255, 0, 255));
  }
  /**
   * Returns the hexadecimal value of this color as a string (for example, 'FFFFFF').
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {string} The hexadecimal value as a string.
   */
  getHexString(e = bt) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  /**
   * Converts the colors RGB values into the HSL format and stores them into the
   * given target object.
   *
   * @param {{h:number,s:number,l:number}} target - The target object that is used to store the method's result.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {{h:number,s:number,l:number}} The HSL representation of this color.
   */
  getHSL(e, t = We.workingColorSpace) {
    We.workingToColorSpace(yt.copy(this), t);
    const n = yt.r, r = yt.g, s = yt.b, a = Math.max(n, r, s), o = Math.min(n, r, s);
    let c, l;
    const h = (o + a) / 2;
    if (o === a)
      c = 0, l = 0;
    else {
      const f = a - o;
      switch (l = h <= 0.5 ? f / (a + o) : f / (2 - a - o), a) {
        case n:
          c = (r - s) / f + (r < s ? 6 : 0);
          break;
        case r:
          c = (s - n) / f + 2;
          break;
        case s:
          c = (n - r) / f + 4;
          break;
      }
      c /= 6;
    }
    return e.h = c, e.s = l, e.l = h, e;
  }
  /**
   * Returns the RGB values of this color and stores them into the given target object.
   *
   * @param {Color} target - The target color that is used to store the method's result.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} The RGB representation of this color.
   */
  getRGB(e, t = We.workingColorSpace) {
    return We.workingToColorSpace(yt.copy(this), t), e.r = yt.r, e.g = yt.g, e.b = yt.b, e;
  }
  /**
   * Returns the value of this color as a CSS style string. Example: `rgb(255,0,0)`.
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {string} The CSS representation of this color.
   */
  getStyle(e = bt) {
    We.workingToColorSpace(yt.copy(this), e);
    const t = yt.r, n = yt.g, r = yt.b;
    return e !== bt ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(r * 255)})`;
  }
  /**
   * Adds the given HSL values to this color's values.
   * Internally, this converts the color's RGB values to HSL, adds HSL
   * and then converts the color back to RGB.
   *
   * @param {number} h - Hue value between `0.0` and `1.0`.
   * @param {number} s - Saturation value between `0.0` and `1.0`.
   * @param {number} l - Lightness value between `0.0` and `1.0`.
   * @return {Color} A reference to this color.
   */
  offsetHSL(e, t, n) {
    return this.getHSL(on), this.setHSL(on.h + e, on.s + t, on.l + n);
  }
  /**
   * Adds the RGB values of the given color to the RGB values of this color.
   *
   * @param {Color} color - The color to add.
   * @return {Color} A reference to this color.
   */
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  /**
   * Adds the RGB values of the given colors and stores the result in this instance.
   *
   * @param {Color} color1 - The first color.
   * @param {Color} color2 - The second color.
   * @return {Color} A reference to this color.
   */
  addColors(e, t) {
    return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
  }
  /**
   * Adds the given scalar value to the RGB values of this color.
   *
   * @param {number} s - The scalar to add.
   * @return {Color} A reference to this color.
   */
  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }
  /**
   * Subtracts the RGB values of the given color from the RGB values of this color.
   *
   * @param {Color} color - The color to subtract.
   * @return {Color} A reference to this color.
   */
  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }
  /**
   * Multiplies the RGB values of the given color with the RGB values of this color.
   *
   * @param {Color} color - The color to multiply.
   * @return {Color} A reference to this color.
   */
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  /**
   * Multiplies the given scalar value with the RGB values of this color.
   *
   * @param {number} s - The scalar to multiply.
   * @return {Color} A reference to this color.
   */
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  /**
   * Linearly interpolates this color's RGB values toward the RGB values of the
   * given color. The alpha argument can be thought of as the ratio between
   * the two colors, where `0.0` is this color and `1.0` is the first argument.
   *
   * @param {Color} color - The color to converge on.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerp(e, t) {
    return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
  }
  /**
   * Linearly interpolates between the given colors and stores the result in this instance.
   * The alpha argument can be thought of as the ratio between the two colors, where `0.0`
   * is the first and `1.0` is the second color.
   *
   * @param {Color} color1 - The first color.
   * @param {Color} color2 - The second color.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerpColors(e, t, n) {
    return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
  }
  /**
   * Linearly interpolates this color's HSL values toward the HSL values of the
   * given color. It differs from {@link Color#lerp} by not interpolating straight
   * from one color to the other, but instead going through all the hues in between
   * those two colors. The alpha argument can be thought of as the ratio between
   * the two colors, where 0.0 is this color and 1.0 is the first argument.
   *
   * @param {Color} color - The color to converge on.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerpHSL(e, t) {
    this.getHSL(on), e.getHSL(Di);
    const n = gi(on.h, Di.h, t), r = gi(on.s, Di.s, t), s = gi(on.l, Di.l, t);
    return this.setHSL(n, r, s), this;
  }
  /**
   * Sets the color's RGB components from the given 3D vector.
   *
   * @param {Vector3} v - The vector to set.
   * @return {Color} A reference to this color.
   */
  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }
  /**
   * Transforms this color with the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix.
   * @return {Color} A reference to this color.
   */
  applyMatrix3(e) {
    const t = this.r, n = this.g, r = this.b, s = e.elements;
    return this.r = s[0] * t + s[3] * n + s[6] * r, this.g = s[1] * t + s[4] * n + s[7] * r, this.b = s[2] * t + s[5] * n + s[8] * r, this;
  }
  /**
   * Returns `true` if this color is equal with the given one.
   *
   * @param {Color} c - The color to test for equality.
   * @return {boolean} Whether this bounding color is equal with the given one.
   */
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  /**
   * Sets this color's RGB components from the given array.
   *
   * @param {Array<number>} array - An array holding the RGB values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Color} A reference to this color.
   */
  fromArray(e, t = 0) {
    return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
  }
  /**
   * Writes the RGB components of this color to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the color components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The color components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
  }
  /**
   * Sets the components of this color from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding color data.
   * @param {number} index - The index into the attribute.
   * @return {Color} A reference to this color.
   */
  fromBufferAttribute(e, t) {
    return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
  }
  /**
   * This methods defines the serialization result of this class. Returns the color
   * as a hexadecimal value.
   *
   * @return {number} The hexadecimal value.
   */
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const yt = /* @__PURE__ */ new Se();
Se.NAMES = ya;
let wo = 0;
class dn extends ti {
  /**
   * Constructs a new material.
   */
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: wo++ }), this.uuid = en(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Se(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = 7680, this.stencilZFail = 7680, this.stencilZPass = 7680, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.allowOverride = !0, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  /**
   * Sets the alpha value to be used when running an alpha test. The material
   * will not be rendered if the opacity is lower than this value.
   *
   * @type {number}
   * @readonly
   * @default 0
   */
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
  }
  /**
   * An optional callback that is executed immediately before the material is used to render a 3D object.
   *
   * This method can only be used when rendering with {@link WebGLRenderer}.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Scene} scene - The scene.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Object3D} object - The 3D object.
   * @param {Object} group - The geometry group data.
   */
  onBeforeRender() {
  }
  /**
   * An optional callback that is executed immediately before the shader
   * program is compiled. This function is called with the shader source code
   * as a parameter. Useful for the modification of built-in materials.
   *
   * This method can only be used when rendering with {@link WebGLRenderer}. The
   * recommended approach when customizing materials is to use `WebGPURenderer` with the new
   * Node Material system and [TSL]{@link https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language}.
   *
   * @param {{vertexShader:string,fragmentShader:string,uniforms:Object}} shaderobject - The object holds the uniforms and the vertex and fragment shader source.
   * @param {WebGLRenderer} renderer - A reference to the renderer.
   */
  onBeforeCompile() {
  }
  /**
   * In case {@link Material#onBeforeCompile} is used, this callback can be used to identify
   * values of settings used in `onBeforeCompile()`, so three.js can reuse a cached
   * shader or recompile the shader for this material as needed.
   *
   * This method can only be used when rendering with {@link WebGLRenderer}.
   *
   * @return {string} The custom program cache key.
   */
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  /**
   * This method can be used to set default values from parameter objects.
   * It is a generic implementation so it can be used with different types
   * of materials.
   *
   * @param {Object} [values] - The material values to set.
   */
  setValues(e) {
    if (e !== void 0)
      for (const t in e) {
        const n = e[t];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const r = this[t];
        if (r === void 0) {
          console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
          continue;
        }
        r && r.isColor ? r.set(n) : r && r.isVector3 && n && n.isVector3 ? r.copy(n) : this[t] = n;
      }
  }
  /**
   * Serializes the material into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized material.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    t && (e = {
      textures: {},
      images: {}
    });
    const n = {
      metadata: {
        version: 4.7,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== 1 && (n.blending = this.blending), this.side !== 0 && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== 204 && (n.blendSrc = this.blendSrc), this.blendDst !== 205 && (n.blendDst = this.blendDst), this.blendEquation !== 100 && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== 3 && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== 519 && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== 7680 && (n.stencilFail = this.stencilFail), this.stencilZFail !== 7680 && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== 7680 && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function r(s) {
      const a = [];
      for (const o in s) {
        const c = s[o];
        delete c.metadata, a.push(c);
      }
      return a;
    }
    if (t) {
      const s = r(e.textures), a = r(e.images);
      s.length > 0 && (n.textures = s), a.length > 0 && (n.images = a);
    }
    return n;
  }
  /**
   * Returns a new material with copied values from this instance.
   *
   * @return {Material} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given material to this instance.
   *
   * @param {Material} source - The material to copy.
   * @return {Material} A reference to this instance.
   */
  copy(e) {
    this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
    const t = e.clippingPlanes;
    let n = null;
    if (t !== null) {
      const r = t.length;
      n = new Array(r);
      for (let s = 0; s !== r; ++s)
        n[s] = t[s].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires Material#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  /**
   * Setting this property to `true` indicates the engine the material
   * needs to be recompiled.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
}
class jn extends dn {
  /**
   * Constructs a new mesh basic material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Se(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new qt(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
  }
}
const pt = /* @__PURE__ */ new P(), Li = /* @__PURE__ */ new we();
let Ro = 0;
class Ve {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {TypedArray} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(e, t, n = !1) {
    if (Array.isArray(e))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, Object.defineProperty(this, "id", { value: Ro++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = n, this.usage = 35044, this.updateRanges = [], this.gpuType = 1015, this.version = 0;
  }
  /**
   * A callback function that is executed after the renderer has transferred the attribute
   * array data to the GPU.
   */
  onUploadCallback() {
  }
  /**
   * Flag to indicate that this attribute has changed and should be re-sent to
   * the GPU. Set this to `true` when you modify the value of the array.
   *
   * @type {number}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  /**
   * Sets the usage of this buffer attribute.
   *
   * @param {(StaticDrawUsage|DynamicDrawUsage|StreamDrawUsage|StaticReadUsage|DynamicReadUsage|StreamReadUsage|StaticCopyUsage|DynamicCopyUsage|StreamCopyUsage)} value - The usage to set.
   * @return {BufferAttribute} A reference to this buffer attribute.
   */
  setUsage(e) {
    return this.usage = e, this;
  }
  /**
   * Adds a range of data in the data array to be updated on the GPU.
   *
   * @param {number} start - Position at which to start update.
   * @param {number} count - The number of components to update.
   */
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  /**
   * Clears the update ranges.
   */
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  /**
   * Copies the values of the given buffer attribute to this instance.
   *
   * @param {BufferAttribute} source - The buffer attribute to copy.
   * @return {BufferAttribute} A reference to this instance.
   */
  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }
  /**
   * Copies a vector from the given buffer attribute to this one. The start
   * and destination position in the attribute buffers are represented by the
   * given indices.
   *
   * @param {number} index1 - The destination index into this buffer attribute.
   * @param {BufferAttribute} attribute - The buffer attribute to copy from.
   * @param {number} index2 - The source index into the given buffer attribute.
   * @return {BufferAttribute} A reference to this instance.
   */
  copyAt(e, t, n) {
    e *= this.itemSize, n *= t.itemSize;
    for (let r = 0, s = this.itemSize; r < s; r++)
      this.array[e + r] = t.array[n + r];
    return this;
  }
  /**
   * Copies the given array data into this buffer attribute.
   *
   * @param {(TypedArray|Array)} array - The array to copy.
   * @return {BufferAttribute} A reference to this instance.
   */
  copyArray(e) {
    return this.array.set(e), this;
  }
  /**
   * Applies the given 3x3 matrix to the given attribute. Works with
   * item size `2` and `3`.
   *
   * @param {Matrix3} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyMatrix3(e) {
    if (this.itemSize === 2)
      for (let t = 0, n = this.count; t < n; t++)
        Li.fromBufferAttribute(this, t), Li.applyMatrix3(e), this.setXY(t, Li.x, Li.y);
    else if (this.itemSize === 3)
      for (let t = 0, n = this.count; t < n; t++)
        pt.fromBufferAttribute(this, t), pt.applyMatrix3(e), this.setXYZ(t, pt.x, pt.y, pt.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyMatrix4(e) {
    for (let t = 0, n = this.count; t < n; t++)
      pt.fromBufferAttribute(this, t), pt.applyMatrix4(e), this.setXYZ(t, pt.x, pt.y, pt.z);
    return this;
  }
  /**
   * Applies the given 3x3 normal matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix3} m - The normal matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      pt.fromBufferAttribute(this, t), pt.applyNormalMatrix(e), this.setXYZ(t, pt.x, pt.y, pt.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3` and with direction vectors.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      pt.fromBufferAttribute(this, t), pt.transformDirection(e), this.setXYZ(t, pt.x, pt.y, pt.z);
    return this;
  }
  /**
   * Sets the given array data in the buffer attribute.
   *
   * @param {(TypedArray|Array)} value - The array data to set.
   * @param {number} [offset=0] - The offset in this buffer attribute's array.
   * @return {BufferAttribute} A reference to this instance.
   */
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  /**
   * Returns the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @return {number} The returned value.
   */
  getComponent(e, t) {
    let n = this.array[e * this.itemSize + t];
    return this.normalized && (n = Ht(n, this.array)), n;
  }
  /**
   * Sets the given value to the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @param {number} value - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setComponent(e, t, n) {
    return this.normalized && (n = Ze(n, this.array)), this.array[e * this.itemSize + t] = n, this;
  }
  /**
   * Returns the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The x component.
   */
  getX(e) {
    let t = this.array[e * this.itemSize];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Sets the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setX(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.array[e * this.itemSize] = t, this;
  }
  /**
   * Returns the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The y component.
   */
  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Sets the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} y - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setY(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
  }
  /**
   * Returns the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The z component.
   */
  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Sets the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} z - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setZ(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
  }
  /**
   * Returns the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The w component.
   */
  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Sets the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} w - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setW(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
  }
  /**
   * Sets the x and y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXY(e, t, n) {
    return e *= this.itemSize, this.normalized && (t = Ze(t, this.array), n = Ze(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
  }
  /**
   * Sets the x, y and z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXYZ(e, t, n, r) {
    return e *= this.itemSize, this.normalized && (t = Ze(t, this.array), n = Ze(n, this.array), r = Ze(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this;
  }
  /**
   * Sets the x, y, z and w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @param {number} w - The value for the w component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXYZW(e, t, n, r, s) {
    return e *= this.itemSize, this.normalized && (t = Ze(t, this.array), n = Ze(n, this.array), r = Ze(r, this.array), s = Ze(s, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this.array[e + 3] = s, this;
  }
  /**
   * Sets the given callback function that is executed after the Renderer has transferred
   * the attribute array data to the GPU. Can be used to perform clean-up operations after
   * the upload when attribute data are not needed anymore on the CPU side.
   *
   * @param {Function} callback - The `onUpload()` callback.
   * @return {BufferAttribute} A reference to this instance.
   */
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  /**
   * Returns a new buffer attribute with copied values from this instance.
   *
   * @return {BufferAttribute} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  /**
   * Serializes the buffer attribute into JSON.
   *
   * @return {Object} A JSON object representing the serialized buffer attribute.
   */
  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (e.name = this.name), this.usage !== 35044 && (e.usage = this.usage), e;
  }
}
class Ea extends Ve {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {(Array<number>|Uint16Array)} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(e, t, n) {
    super(new Uint16Array(e), t, n);
  }
}
class Ta extends Ve {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {(Array<number>|Uint32Array)} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(e, t, n) {
    super(new Uint32Array(e), t, n);
  }
}
class at extends Ve {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {(Array<number>|Float32Array)} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(e, t, n) {
    super(new Float32Array(e), t, n);
  }
}
let Co = 0;
const Nt = /* @__PURE__ */ new Qe(), Pr = /* @__PURE__ */ new ft(), On = /* @__PURE__ */ new P(), Ut = /* @__PURE__ */ new xi(), li = /* @__PURE__ */ new xi(), Mt = /* @__PURE__ */ new P();
class st extends ti {
  /**
   * Constructs a new geometry.
   */
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Co++ }), this.uuid = en(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  /**
   * Returns the index of this geometry.
   *
   * @return {?BufferAttribute} The index. Returns `null` if no index is defined.
   */
  getIndex() {
    return this.index;
  }
  /**
   * Sets the given index to this geometry.
   *
   * @param {Array<number>|BufferAttribute} index - The index to set.
   * @return {BufferGeometry} A reference to this instance.
   */
  setIndex(e) {
    return Array.isArray(e) ? this.index = new (Ma(e) ? Ta : Ea)(e, 1) : this.index = e, this;
  }
  /**
   * Sets the given indirect attribute to this geometry.
   *
   * @param {BufferAttribute} indirect - The attribute holding indirect draw calls.
   * @return {BufferGeometry} A reference to this instance.
   */
  setIndirect(e) {
    return this.indirect = e, this;
  }
  /**
   * Returns the indirect attribute of this geometry.
   *
   * @return {?BufferAttribute} The indirect attribute. Returns `null` if no indirect attribute is defined.
   */
  getIndirect() {
    return this.indirect;
  }
  /**
   * Returns the buffer attribute for the given name.
   *
   * @param {string} name - The attribute name.
   * @return {BufferAttribute|InterleavedBufferAttribute|undefined} The buffer attribute.
   * Returns `undefined` if not attribute has been found.
   */
  getAttribute(e) {
    return this.attributes[e];
  }
  /**
   * Sets the given attribute for the given name.
   *
   * @param {string} name - The attribute name.
   * @param {BufferAttribute|InterleavedBufferAttribute} attribute - The attribute to set.
   * @return {BufferGeometry} A reference to this instance.
   */
  setAttribute(e, t) {
    return this.attributes[e] = t, this;
  }
  /**
   * Deletes the attribute for the given name.
   *
   * @param {string} name - The attribute name to delete.
   * @return {BufferGeometry} A reference to this instance.
   */
  deleteAttribute(e) {
    return delete this.attributes[e], this;
  }
  /**
   * Returns `true` if this geometry has an attribute for the given name.
   *
   * @param {string} name - The attribute name.
   * @return {boolean} Whether this geometry has an attribute for the given name or not.
   */
  hasAttribute(e) {
    return this.attributes[e] !== void 0;
  }
  /**
   * Adds a group to this geometry.
   *
   * @param {number} start - The first element in this draw call. That is the first
   * vertex for non-indexed geometry, otherwise the first triangle index.
   * @param {number} count - Specifies how many vertices (or indices) are part of this group.
   * @param {number} [materialIndex=0] - The material array index to use.
   */
  addGroup(e, t, n = 0) {
    this.groups.push({
      start: e,
      count: t,
      materialIndex: n
    });
  }
  /**
   * Clears all groups.
   */
  clearGroups() {
    this.groups = [];
  }
  /**
   * Sets the draw range for this geometry.
   *
   * @param {number} start - The first vertex for non-indexed geometry, otherwise the first triangle index.
   * @param {number} count - For non-indexed BufferGeometry, `count` is the number of vertices to render.
   * For indexed BufferGeometry, `count` is the number of indices to render.
   */
  setDrawRange(e, t) {
    this.drawRange.start = e, this.drawRange.count = t;
  }
  /**
   * Applies the given 4x4 transformation matrix to the geometry.
   *
   * @param {Matrix4} matrix - The matrix to apply.
   * @return {BufferGeometry} A reference to this instance.
   */
  applyMatrix4(e) {
    const t = this.attributes.position;
    t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const s = new Ne().getNormalMatrix(e);
      n.applyNormalMatrix(s), n.needsUpdate = !0;
    }
    const r = this.attributes.tangent;
    return r !== void 0 && (r.transformDirection(e), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  /**
   * Applies the rotation represented by the Quaternion to the geometry.
   *
   * @param {Quaternion} q - The Quaternion to apply.
   * @return {BufferGeometry} A reference to this instance.
   */
  applyQuaternion(e) {
    return Nt.makeRotationFromQuaternion(e), this.applyMatrix4(Nt), this;
  }
  /**
   * Rotates the geometry about the X axis. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#rotation} for typical
   * real-time mesh rotation.
   *
   * @param {number} angle - The angle in radians.
   * @return {BufferGeometry} A reference to this instance.
   */
  rotateX(e) {
    return Nt.makeRotationX(e), this.applyMatrix4(Nt), this;
  }
  /**
   * Rotates the geometry about the Y axis. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#rotation} for typical
   * real-time mesh rotation.
   *
   * @param {number} angle - The angle in radians.
   * @return {BufferGeometry} A reference to this instance.
   */
  rotateY(e) {
    return Nt.makeRotationY(e), this.applyMatrix4(Nt), this;
  }
  /**
   * Rotates the geometry about the Z axis. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#rotation} for typical
   * real-time mesh rotation.
   *
   * @param {number} angle - The angle in radians.
   * @return {BufferGeometry} A reference to this instance.
   */
  rotateZ(e) {
    return Nt.makeRotationZ(e), this.applyMatrix4(Nt), this;
  }
  /**
   * Translates the geometry. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#position} for typical
   * real-time mesh rotation.
   *
   * @param {number} x - The x offset.
   * @param {number} y - The y offset.
   * @param {number} z - The z offset.
   * @return {BufferGeometry} A reference to this instance.
   */
  translate(e, t, n) {
    return Nt.makeTranslation(e, t, n), this.applyMatrix4(Nt), this;
  }
  /**
   * Scales the geometry. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#scale} for typical
   * real-time mesh rotation.
   *
   * @param {number} x - The x scale.
   * @param {number} y - The y scale.
   * @param {number} z - The z scale.
   * @return {BufferGeometry} A reference to this instance.
   */
  scale(e, t, n) {
    return Nt.makeScale(e, t, n), this.applyMatrix4(Nt), this;
  }
  /**
   * Rotates the geometry to face a point in 3D space. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#lookAt} for typical
   * real-time mesh rotation.
   *
   * @param {Vector3} vector - The target point.
   * @return {BufferGeometry} A reference to this instance.
   */
  lookAt(e) {
    return Pr.lookAt(e), Pr.updateMatrix(), this.applyMatrix4(Pr.matrix), this;
  }
  /**
   * Center the geometry based on its bounding box.
   *
   * @return {BufferGeometry} A reference to this instance.
   */
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(On).negate(), this.translate(On.x, On.y, On.z), this;
  }
  /**
   * Defines a geometry by creating a `position` attribute based on the given array of points. The array
   * can hold 2D or 3D vectors. When using two-dimensional data, the `z` coordinate for all vertices is
   * set to `0`.
   *
   * If the method is used with an existing `position` attribute, the vertex data are overwritten with the
   * data from the array. The length of the array must match the vertex count.
   *
   * @param {Array<Vector2>|Array<Vector3>} points - The points.
   * @return {BufferGeometry} A reference to this instance.
   */
  setFromPoints(e) {
    const t = this.getAttribute("position");
    if (t === void 0) {
      const n = [];
      for (let r = 0, s = e.length; r < s; r++) {
        const a = e[r];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new at(n, 3));
    } else {
      const n = Math.min(e.length, t.count);
      for (let r = 0; r < n; r++) {
        const s = e[r];
        t.setXYZ(r, s.x, s.y, s.z || 0);
      }
      e.length > t.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), t.needsUpdate = !0;
    }
    return this;
  }
  /**
   * Computes the bounding box of the geometry, and updates the `boundingBox` member.
   * The bounding box is not computed by the engine; it must be computed by your app.
   * You may need to recompute the bounding box if the geometry vertices are modified.
   */
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new xi());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new P(-1 / 0, -1 / 0, -1 / 0),
        new P(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (e !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(e), t)
        for (let n = 0, r = t.length; n < r; n++) {
          const s = t[n];
          Ut.setFromBufferAttribute(s), this.morphTargetsRelative ? (Mt.addVectors(this.boundingBox.min, Ut.min), this.boundingBox.expandByPoint(Mt), Mt.addVectors(this.boundingBox.max, Ut.max), this.boundingBox.expandByPoint(Mt)) : (this.boundingBox.expandByPoint(Ut.min), this.boundingBox.expandByPoint(Ut.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  /**
   * Computes the bounding sphere of the geometry, and updates the `boundingSphere` member.
   * The engine automatically computes the bounding sphere when it is needed, e.g., for ray casting or view frustum culling.
   * You may need to recompute the bounding sphere if the geometry vertices are modified.
   */
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Mi());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new P(), 1 / 0);
      return;
    }
    if (e) {
      const n = this.boundingSphere.center;
      if (Ut.setFromBufferAttribute(e), t)
        for (let s = 0, a = t.length; s < a; s++) {
          const o = t[s];
          li.setFromBufferAttribute(o), this.morphTargetsRelative ? (Mt.addVectors(Ut.min, li.min), Ut.expandByPoint(Mt), Mt.addVectors(Ut.max, li.max), Ut.expandByPoint(Mt)) : (Ut.expandByPoint(li.min), Ut.expandByPoint(li.max));
        }
      Ut.getCenter(n);
      let r = 0;
      for (let s = 0, a = e.count; s < a; s++)
        Mt.fromBufferAttribute(e, s), r = Math.max(r, n.distanceToSquared(Mt));
      if (t)
        for (let s = 0, a = t.length; s < a; s++) {
          const o = t[s], c = this.morphTargetsRelative;
          for (let l = 0, h = o.count; l < h; l++)
            Mt.fromBufferAttribute(o, l), c && (On.fromBufferAttribute(e, l), Mt.add(On)), r = Math.max(r, n.distanceToSquared(Mt));
        }
      this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  /**
   * Calculates and adds a tangent attribute to this geometry.
   *
   * The computation is only supported for indexed geometries and if position, normal, and uv attributes
   * are defined. When using a tangent space normal map, prefer the MikkTSpace algorithm provided by
   * {@link BufferGeometryUtils#computeMikkTSpaceTangents} instead.
   */
  computeTangents() {
    const e = this.index, t = this.attributes;
    if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = t.position, r = t.normal, s = t.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new Ve(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"), o = [], c = [];
    for (let F = 0; F < n.count; F++)
      o[F] = new P(), c[F] = new P();
    const l = new P(), h = new P(), f = new P(), d = new we(), p = new we(), g = new we(), _ = new P(), m = new P();
    function u(F, y, S) {
      l.fromBufferAttribute(n, F), h.fromBufferAttribute(n, y), f.fromBufferAttribute(n, S), d.fromBufferAttribute(s, F), p.fromBufferAttribute(s, y), g.fromBufferAttribute(s, S), h.sub(l), f.sub(l), p.sub(d), g.sub(d);
      const b = 1 / (p.x * g.y - g.x * p.y);
      isFinite(b) && (_.copy(h).multiplyScalar(g.y).addScaledVector(f, -p.y).multiplyScalar(b), m.copy(f).multiplyScalar(p.x).addScaledVector(h, -g.x).multiplyScalar(b), o[F].add(_), o[y].add(_), o[S].add(_), c[F].add(m), c[y].add(m), c[S].add(m));
    }
    let A = this.groups;
    A.length === 0 && (A = [{
      start: 0,
      count: e.count
    }]);
    for (let F = 0, y = A.length; F < y; ++F) {
      const S = A[F], b = S.start, q = S.count;
      for (let V = b, H = b + q; V < H; V += 3)
        u(
          e.getX(V + 0),
          e.getX(V + 1),
          e.getX(V + 2)
        );
    }
    const E = new P(), M = new P(), C = new P(), R = new P();
    function L(F) {
      C.fromBufferAttribute(r, F), R.copy(C);
      const y = o[F];
      E.copy(y), E.sub(C.multiplyScalar(C.dot(y))).normalize(), M.crossVectors(R, y);
      const b = M.dot(c[F]) < 0 ? -1 : 1;
      a.setXYZW(F, E.x, E.y, E.z, b);
    }
    for (let F = 0, y = A.length; F < y; ++F) {
      const S = A[F], b = S.start, q = S.count;
      for (let V = b, H = b + q; V < H; V += 3)
        L(e.getX(V + 0)), L(e.getX(V + 1)), L(e.getX(V + 2));
    }
  }
  /**
   * Computes vertex normals for the given vertex data. For indexed geometries, the method sets
   * each vertex normal to be the average of the face normals of the faces that share that vertex.
   * For non-indexed geometries, vertices are not shared, and the method sets each vertex normal
   * to be the same as the face normal.
   */
  computeVertexNormals() {
    const e = this.index, t = this.getAttribute("position");
    if (t !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new Ve(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let d = 0, p = n.count; d < p; d++)
          n.setXYZ(d, 0, 0, 0);
      const r = new P(), s = new P(), a = new P(), o = new P(), c = new P(), l = new P(), h = new P(), f = new P();
      if (e)
        for (let d = 0, p = e.count; d < p; d += 3) {
          const g = e.getX(d + 0), _ = e.getX(d + 1), m = e.getX(d + 2);
          r.fromBufferAttribute(t, g), s.fromBufferAttribute(t, _), a.fromBufferAttribute(t, m), h.subVectors(a, s), f.subVectors(r, s), h.cross(f), o.fromBufferAttribute(n, g), c.fromBufferAttribute(n, _), l.fromBufferAttribute(n, m), o.add(h), c.add(h), l.add(h), n.setXYZ(g, o.x, o.y, o.z), n.setXYZ(_, c.x, c.y, c.z), n.setXYZ(m, l.x, l.y, l.z);
        }
      else
        for (let d = 0, p = t.count; d < p; d += 3)
          r.fromBufferAttribute(t, d + 0), s.fromBufferAttribute(t, d + 1), a.fromBufferAttribute(t, d + 2), h.subVectors(a, s), f.subVectors(r, s), h.cross(f), n.setXYZ(d + 0, h.x, h.y, h.z), n.setXYZ(d + 1, h.x, h.y, h.z), n.setXYZ(d + 2, h.x, h.y, h.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }
  /**
   * Ensures every normal vector in a geometry will have a magnitude of `1`. This will
   * correct lighting on the geometry surfaces.
   */
  normalizeNormals() {
    const e = this.attributes.normal;
    for (let t = 0, n = e.count; t < n; t++)
      Mt.fromBufferAttribute(e, t), Mt.normalize(), e.setXYZ(t, Mt.x, Mt.y, Mt.z);
  }
  /**
   * Return a new non-index version of this indexed geometry. If the geometry
   * is already non-indexed, the method is a NOOP.
   *
   * @return {BufferGeometry} The non-indexed version of this indexed geometry.
   */
  toNonIndexed() {
    function e(o, c) {
      const l = o.array, h = o.itemSize, f = o.normalized, d = new l.constructor(c.length * h);
      let p = 0, g = 0;
      for (let _ = 0, m = c.length; _ < m; _++) {
        o.isInterleavedBufferAttribute ? p = c[_] * o.data.stride + o.offset : p = c[_] * h;
        for (let u = 0; u < h; u++)
          d[g++] = l[p++];
      }
      return new Ve(d, h, f);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const t = new st(), n = this.index.array, r = this.attributes;
    for (const o in r) {
      const c = r[o], l = e(c, n);
      t.setAttribute(o, l);
    }
    const s = this.morphAttributes;
    for (const o in s) {
      const c = [], l = s[o];
      for (let h = 0, f = l.length; h < f; h++) {
        const d = l[h], p = e(d, n);
        c.push(p);
      }
      t.morphAttributes[o] = c;
    }
    t.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, c = a.length; o < c; o++) {
      const l = a[o];
      t.addGroup(l.start, l.count, l.materialIndex);
    }
    return t;
  }
  /**
   * Serializes the geometry into JSON.
   *
   * @return {Object} A JSON object representing the serialized geometry.
   */
  toJSON() {
    const e = {
      metadata: {
        version: 4.7,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
      const c = this.parameters;
      for (const l in c)
        c[l] !== void 0 && (e[l] = c[l]);
      return e;
    }
    e.data = { attributes: {} };
    const t = this.index;
    t !== null && (e.data.index = {
      type: t.array.constructor.name,
      array: Array.prototype.slice.call(t.array)
    });
    const n = this.attributes;
    for (const c in n) {
      const l = n[c];
      e.data.attributes[c] = l.toJSON(e.data);
    }
    const r = {};
    let s = !1;
    for (const c in this.morphAttributes) {
      const l = this.morphAttributes[c], h = [];
      for (let f = 0, d = l.length; f < d; f++) {
        const p = l[f];
        h.push(p.toJSON(e.data));
      }
      h.length > 0 && (r[c] = h, s = !0);
    }
    s && (e.data.morphAttributes = r, e.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (e.data.boundingSphere = o.toJSON()), e;
  }
  /**
   * Returns a new geometry with copied values from this instance.
   *
   * @return {BufferGeometry} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given geometry to this instance.
   *
   * @param {BufferGeometry} source - The geometry to copy.
   * @return {BufferGeometry} A reference to this instance.
   */
  copy(e) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const t = {};
    this.name = e.name;
    const n = e.index;
    n !== null && this.setIndex(n.clone());
    const r = e.attributes;
    for (const l in r) {
      const h = r[l];
      this.setAttribute(l, h.clone(t));
    }
    const s = e.morphAttributes;
    for (const l in s) {
      const h = [], f = s[l];
      for (let d = 0, p = f.length; d < p; d++)
        h.push(f[d].clone(t));
      this.morphAttributes[l] = h;
    }
    this.morphTargetsRelative = e.morphTargetsRelative;
    const a = e.groups;
    for (let l = 0, h = a.length; l < h; l++) {
      const f = a[l];
      this.addGroup(f.start, f.count, f.materialIndex);
    }
    const o = e.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const c = e.boundingSphere;
    return c !== null && (this.boundingSphere = c.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires BufferGeometry#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const ys = /* @__PURE__ */ new Qe(), _n = /* @__PURE__ */ new or(), Ui = /* @__PURE__ */ new Mi(), Es = /* @__PURE__ */ new P(), Ii = /* @__PURE__ */ new P(), Fi = /* @__PURE__ */ new P(), Ni = /* @__PURE__ */ new P(), Dr = /* @__PURE__ */ new P(), Bi = /* @__PURE__ */ new P(), Ts = /* @__PURE__ */ new P(), Oi = /* @__PURE__ */ new P();
class wt extends ft {
  /**
   * Constructs a new mesh.
   *
   * @param {BufferGeometry} [geometry] - The mesh geometry.
   * @param {Material|Array<Material>} [material] - The mesh material.
   */
  constructor(e = new st(), t = new jn()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  /**
   * Sets the values of {@link Mesh#morphTargetDictionary} and {@link Mesh#morphTargetInfluences}
   * to make sure existing morph targets can influence this 3D object.
   */
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const r = t[n[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
        }
      }
    }
  }
  /**
   * Returns the local-space position of the vertex at the given index, taking into
   * account the current animation state of both morph targets and skinning.
   *
   * @param {number} index - The vertex index.
   * @param {Vector3} target - The target object that is used to store the method's result.
   * @return {Vector3} The vertex position in local space.
   */
  getVertexPosition(e, t) {
    const n = this.geometry, r = n.attributes.position, s = n.morphAttributes.position, a = n.morphTargetsRelative;
    t.fromBufferAttribute(r, e);
    const o = this.morphTargetInfluences;
    if (s && o) {
      Bi.set(0, 0, 0);
      for (let c = 0, l = s.length; c < l; c++) {
        const h = o[c], f = s[c];
        h !== 0 && (Dr.fromBufferAttribute(f, e), a ? Bi.addScaledVector(Dr, h) : Bi.addScaledVector(Dr.sub(t), h));
      }
      t.add(Bi);
    }
    return t;
  }
  /**
   * Computes intersection points between a casted ray and this line.
   *
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - The target array that holds the intersection points.
   */
  raycast(e, t) {
    const n = this.geometry, r = this.material, s = this.matrixWorld;
    r !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), Ui.copy(n.boundingSphere), Ui.applyMatrix4(s), _n.copy(e.ray).recast(e.near), !(Ui.containsPoint(_n.origin) === !1 && (_n.intersectSphere(Ui, Es) === null || _n.origin.distanceToSquared(Es) > (e.far - e.near) ** 2)) && (ys.copy(s).invert(), _n.copy(e.ray).applyMatrix4(ys), !(n.boundingBox !== null && _n.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(e, t, _n)));
  }
  _computeIntersections(e, t, n) {
    let r;
    const s = this.geometry, a = this.material, o = s.index, c = s.attributes.position, l = s.attributes.uv, h = s.attributes.uv1, f = s.attributes.normal, d = s.groups, p = s.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let g = 0, _ = d.length; g < _; g++) {
          const m = d[g], u = a[m.materialIndex], A = Math.max(m.start, p.start), E = Math.min(o.count, Math.min(m.start + m.count, p.start + p.count));
          for (let M = A, C = E; M < C; M += 3) {
            const R = o.getX(M), L = o.getX(M + 1), F = o.getX(M + 2);
            r = zi(this, u, e, n, l, h, f, R, L, F), r && (r.faceIndex = Math.floor(M / 3), r.face.materialIndex = m.materialIndex, t.push(r));
          }
        }
      else {
        const g = Math.max(0, p.start), _ = Math.min(o.count, p.start + p.count);
        for (let m = g, u = _; m < u; m += 3) {
          const A = o.getX(m), E = o.getX(m + 1), M = o.getX(m + 2);
          r = zi(this, a, e, n, l, h, f, A, E, M), r && (r.faceIndex = Math.floor(m / 3), t.push(r));
        }
      }
    else if (c !== void 0)
      if (Array.isArray(a))
        for (let g = 0, _ = d.length; g < _; g++) {
          const m = d[g], u = a[m.materialIndex], A = Math.max(m.start, p.start), E = Math.min(c.count, Math.min(m.start + m.count, p.start + p.count));
          for (let M = A, C = E; M < C; M += 3) {
            const R = M, L = M + 1, F = M + 2;
            r = zi(this, u, e, n, l, h, f, R, L, F), r && (r.faceIndex = Math.floor(M / 3), r.face.materialIndex = m.materialIndex, t.push(r));
          }
        }
      else {
        const g = Math.max(0, p.start), _ = Math.min(c.count, p.start + p.count);
        for (let m = g, u = _; m < u; m += 3) {
          const A = m, E = m + 1, M = m + 2;
          r = zi(this, a, e, n, l, h, f, A, E, M), r && (r.faceIndex = Math.floor(m / 3), t.push(r));
        }
      }
  }
}
function Po(i, e, t, n, r, s, a, o) {
  let c;
  if (e.side === 1 ? c = n.intersectTriangle(a, s, r, !0, o) : c = n.intersectTriangle(r, s, a, e.side === 0, o), c === null) return null;
  Oi.copy(o), Oi.applyMatrix4(i.matrixWorld);
  const l = t.ray.origin.distanceTo(Oi);
  return l < t.near || l > t.far ? null : {
    distance: l,
    point: Oi.clone(),
    object: i
  };
}
function zi(i, e, t, n, r, s, a, o, c, l) {
  i.getVertexPosition(o, Ii), i.getVertexPosition(c, Fi), i.getVertexPosition(l, Ni);
  const h = Po(i, e, t, n, Ii, Fi, Ni, Ts);
  if (h) {
    const f = new P();
    Ot.getBarycoord(Ts, Ii, Fi, Ni, f), r && (h.uv = Ot.getInterpolatedAttribute(r, o, c, l, f, new we())), s && (h.uv1 = Ot.getInterpolatedAttribute(s, o, c, l, f, new we())), a && (h.normal = Ot.getInterpolatedAttribute(a, o, c, l, f, new P()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const d = {
      a: o,
      b: c,
      c: l,
      normal: new P(),
      materialIndex: 0
    };
    Ot.getNormal(Ii, Fi, Ni, d.normal), h.face = d, h.barycoord = f;
  }
  return h;
}
class Si extends st {
  /**
   * Constructs a new box geometry.
   *
   * @param {number} [width=1] - The width. That is, the length of the edges parallel to the X axis.
   * @param {number} [height=1] - The height. That is, the length of the edges parallel to the Y axis.
   * @param {number} [depth=1] - The depth. That is, the length of the edges parallel to the Z axis.
   * @param {number} [widthSegments=1] - Number of segmented rectangular faces along the width of the sides.
   * @param {number} [heightSegments=1] - Number of segmented rectangular faces along the height of the sides.
   * @param {number} [depthSegments=1] - Number of segmented rectangular faces along the depth of the sides.
   */
  constructor(e = 1, t = 1, n = 1, r = 1, s = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: e,
      height: t,
      depth: n,
      widthSegments: r,
      heightSegments: s,
      depthSegments: a
    };
    const o = this;
    r = Math.floor(r), s = Math.floor(s), a = Math.floor(a);
    const c = [], l = [], h = [], f = [];
    let d = 0, p = 0;
    g("z", "y", "x", -1, -1, n, t, e, a, s, 0), g("z", "y", "x", 1, -1, n, t, -e, a, s, 1), g("x", "z", "y", 1, 1, e, n, t, r, a, 2), g("x", "z", "y", 1, -1, e, n, -t, r, a, 3), g("x", "y", "z", 1, -1, e, t, n, r, s, 4), g("x", "y", "z", -1, -1, e, t, -n, r, s, 5), this.setIndex(c), this.setAttribute("position", new at(l, 3)), this.setAttribute("normal", new at(h, 3)), this.setAttribute("uv", new at(f, 2));
    function g(_, m, u, A, E, M, C, R, L, F, y) {
      const S = M / L, b = C / F, q = M / 2, V = C / 2, H = R / 2, Z = L + 1, X = F + 1;
      let ee = 0, z = 0;
      const se = new P();
      for (let he = 0; he < X; he++) {
        const Ee = he * b - V;
        for (let Oe = 0; Oe < Z; Oe++) {
          const it = Oe * S - q;
          se[_] = it * A, se[m] = Ee * E, se[u] = H, l.push(se.x, se.y, se.z), se[_] = 0, se[m] = 0, se[u] = R > 0 ? 1 : -1, h.push(se.x, se.y, se.z), f.push(Oe / L), f.push(1 - he / F), ee += 1;
        }
      }
      for (let he = 0; he < F; he++)
        for (let Ee = 0; Ee < L; Ee++) {
          const Oe = d + Ee + Z * he, it = d + Ee + Z * (he + 1), je = d + (Ee + 1) + Z * (he + 1), W = d + (Ee + 1) + Z * he;
          c.push(Oe, it, W), c.push(it, je, W), z += 6;
        }
      o.addGroup(p, z, y), p += z, d += ee;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {BoxGeometry} A new instance.
   */
  static fromJSON(e) {
    return new Si(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
  }
}
function Qn(i) {
  const e = {};
  for (const t in i) {
    e[t] = {};
    for (const n in i[t]) {
      const r = i[t][n];
      r && (r.isColor || r.isMatrix3 || r.isMatrix4 || r.isVector2 || r.isVector3 || r.isVector4 || r.isTexture || r.isQuaternion) ? r.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][n] = null) : e[t][n] = r.clone() : Array.isArray(r) ? e[t][n] = r.slice() : e[t][n] = r;
    }
  }
  return e;
}
function At(i) {
  const e = {};
  for (let t = 0; t < i.length; t++) {
    const n = Qn(i[t]);
    for (const r in n)
      e[r] = n[r];
  }
  return e;
}
function Do(i) {
  const e = [];
  for (let t = 0; t < i.length; t++)
    e.push(i[t].clone());
  return e;
}
function Aa(i) {
  const e = i.getRenderTarget();
  return e === null ? i.outputColorSpace : e.isXRRenderTarget === !0 ? e.texture.colorSpace : We.workingColorSpace;
}
const vi = { clone: Qn, merge: At };
var Lo = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Uo = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class gt extends dn {
  /**
   * Constructs a new shader material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Lo, this.fragmentShader = Uo, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = Qn(e.uniforms), this.uniformsGroups = Do(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    t.glslVersion = this.glslVersion, t.uniforms = {};
    for (const r in this.uniforms) {
      const a = this.uniforms[r].value;
      a && a.isTexture ? t.uniforms[r] = {
        type: "t",
        value: a.toJSON(e).uuid
      } : a && a.isColor ? t.uniforms[r] = {
        type: "c",
        value: a.getHex()
      } : a && a.isVector2 ? t.uniforms[r] = {
        type: "v2",
        value: a.toArray()
      } : a && a.isVector3 ? t.uniforms[r] = {
        type: "v3",
        value: a.toArray()
      } : a && a.isVector4 ? t.uniforms[r] = {
        type: "v4",
        value: a.toArray()
      } : a && a.isMatrix3 ? t.uniforms[r] = {
        type: "m3",
        value: a.toArray()
      } : a && a.isMatrix4 ? t.uniforms[r] = {
        type: "m4",
        value: a.toArray()
      } : t.uniforms[r] = {
        value: a
      };
    }
    Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
    const n = {};
    for (const r in this.extensions)
      this.extensions[r] === !0 && (n[r] = !0);
    return Object.keys(n).length > 0 && (t.extensions = n), t;
  }
}
class ba extends ft {
  /**
   * Constructs a new camera.
   */
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Qe(), this.projectionMatrix = new Qe(), this.projectionMatrixInverse = new Qe(), this.coordinateSystem = 2e3, this._reversedDepth = !1;
  }
  /**
   * The flag that indicates whether the camera uses a reversed depth buffer.
   *
   * @type {boolean}
   * @default false
   */
  get reversedDepth() {
    return this._reversedDepth;
  }
  copy(e, t) {
    return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
  }
  /**
   * Returns a vector representing the ("look") direction of the 3D object in world space.
   *
   * This method is overwritten since cameras have a different forward vector compared to other
   * 3D objects. A camera looks down its local, negative z-axis by default.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's direction in world space.
   */
  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(e, t) {
    super.updateWorldMatrix(e, t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const ln = /* @__PURE__ */ new P(), As = /* @__PURE__ */ new we(), bs = /* @__PURE__ */ new we();
class Bt extends ba {
  /**
   * Constructs a new perspective camera.
   *
   * @param {number} [fov=50] - The vertical field of view.
   * @param {number} [aspect=1] - The aspect ratio.
   * @param {number} [near=0.1] - The camera's near plane.
   * @param {number} [far=2000] - The camera's far plane.
   */
  constructor(e = 50, t = 1, n = 0.1, r = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = r, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current {@link PerspectiveCamera#filmGauge}.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * @param {number} focalLength - Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(e) {
    const t = 0.5 * this.getFilmHeight() / e;
    this.fov = _i * 2 * Math.atan(t), this.updateProjectionMatrix();
  }
  /**
   * Returns the focal length from the current {@link PerspectiveCamera#fov} and
   * {@link PerspectiveCamera#filmGauge}.
   *
   * @return {number} The computed focal length.
   */
  getFocalLength() {
    const e = Math.tan(mi * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / e;
  }
  /**
   * Returns the current vertical field of view angle in degrees considering {@link PerspectiveCamera#zoom}.
   *
   * @return {number} The effective FOV.
   */
  getEffectiveFOV() {
    return _i * 2 * Math.atan(
      Math.tan(mi * 0.5 * this.fov) / this.zoom
    );
  }
  /**
   * Returns the width of the image on the film. If {@link PerspectiveCamera#aspect} is greater than or
   * equal to one (landscape format), the result equals {@link PerspectiveCamera#filmGauge}.
   *
   * @return {number} The film width.
   */
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  /**
   * Returns the height of the image on the film. If {@link PerspectiveCamera#aspect} is greater than or
   * equal to one (landscape format), the result equals {@link PerspectiveCamera#filmGauge}.
   *
   * @return {number} The film width.
   */
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
   * Sets `minTarget` and `maxTarget` to the coordinates of the lower-left and upper-right corners of the view rectangle.
   *
   * @param {number} distance - The viewing distance.
   * @param {Vector2} minTarget - The lower-left corner of the view rectangle is written into this vector.
   * @param {Vector2} maxTarget - The upper-right corner of the view rectangle is written into this vector.
   */
  getViewBounds(e, t, n) {
    ln.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t.set(ln.x, ln.y).multiplyScalar(-e / ln.z), ln.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(ln.x, ln.y).multiplyScalar(-e / ln.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   *
   * @param {number} distance - The viewing distance.
   * @param {Vector2} target - The target vector that is used to store result where x is width and y is height.
   * @returns {Vector2} The view size.
   */
  getViewSize(e, t) {
    return this.getViewBounds(e, As, bs), t.subVectors(bs, As);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *```
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *```
   * then for each monitor you would call it like this:
   *```js
   * const w = 1920;
   * const h = 1080;
   * const fullWidth = w * 3;
   * const fullHeight = h * 2;
   *
   * // --A--
   * camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   * // --B--
   * camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   * // --C--
   * camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   * // --D--
   * camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   * // --E--
   * camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   * // --F--
   * camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   * ```
   *
   * Note there is no reason monitors have to be the same size or in a grid.
   *
   * @param {number} fullWidth - The full width of multiview setup.
   * @param {number} fullHeight - The full height of multiview setup.
   * @param {number} x - The horizontal offset of the subcamera.
   * @param {number} y - The vertical offset of the subcamera.
   * @param {number} width - The width of subcamera.
   * @param {number} height - The height of subcamera.
   */
  setViewOffset(e, t, n, r, s, a) {
    this.aspect = e / t, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
  }
  /**
   * Removes the view offset from the projection matrix.
   */
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  /**
   * Updates the camera's projection matrix. Must be called after any change of
   * camera properties.
   */
  updateProjectionMatrix() {
    const e = this.near;
    let t = e * Math.tan(mi * 0.5 * this.fov) / this.zoom, n = 2 * t, r = this.aspect * n, s = -0.5 * r;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const c = a.fullWidth, l = a.fullHeight;
      s += a.offsetX * r / c, t -= a.offsetY * n / l, r *= a.width / c, n *= a.height / l;
    }
    const o = this.filmOffset;
    o !== 0 && (s += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(s, s + r, t, t - n, e, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
  }
}
const zn = -90, Gn = 1;
class Io extends ft {
  /**
   * Constructs a new cube camera.
   *
   * @param {number} near - The camera's near plane.
   * @param {number} far - The camera's far plane.
   * @param {WebGLCubeRenderTarget} renderTarget - The cube render target.
   */
  constructor(e, t, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const r = new Bt(zn, Gn, e, t);
    r.layers = this.layers, this.add(r);
    const s = new Bt(zn, Gn, e, t);
    s.layers = this.layers, this.add(s);
    const a = new Bt(zn, Gn, e, t);
    a.layers = this.layers, this.add(a);
    const o = new Bt(zn, Gn, e, t);
    o.layers = this.layers, this.add(o);
    const c = new Bt(zn, Gn, e, t);
    c.layers = this.layers, this.add(c);
    const l = new Bt(zn, Gn, e, t);
    l.layers = this.layers, this.add(l);
  }
  /**
   * Must be called when the coordinate system of the cube camera is changed.
   */
  updateCoordinateSystem() {
    const e = this.coordinateSystem, t = this.children.concat(), [n, r, s, a, o, c] = t;
    for (const l of t) this.remove(l);
    if (e === 2e3)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), r.up.set(0, 1, 0), r.lookAt(-1, 0, 0), s.up.set(0, 0, -1), s.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), c.up.set(0, 1, 0), c.lookAt(0, 0, -1);
    else if (e === 2001)
      n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), r.up.set(0, -1, 0), r.lookAt(1, 0, 0), s.up.set(0, 0, 1), s.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), c.up.set(0, -1, 0), c.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const l of t)
      this.add(l), l.updateMatrixWorld();
  }
  /**
   * Calling this method will render the given scene with the given renderer
   * into the cube render target of the camera.
   *
   * @param {(Renderer|WebGLRenderer)} renderer - The renderer.
   * @param {Scene} scene - The scene to render.
   */
  update(e, t) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: r } = this;
    this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
    const [s, a, o, c, l, h] = this.children, f = e.getRenderTarget(), d = e.getActiveCubeFace(), p = e.getActiveMipmapLevel(), g = e.xr.enabled;
    e.xr.enabled = !1;
    const _ = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1, e.setRenderTarget(n, 0, r), e.render(t, s), e.setRenderTarget(n, 1, r), e.render(t, a), e.setRenderTarget(n, 2, r), e.render(t, o), e.setRenderTarget(n, 3, r), e.render(t, c), e.setRenderTarget(n, 4, r), e.render(t, l), n.texture.generateMipmaps = _, e.setRenderTarget(n, 5, r), e.render(t, h), e.setRenderTarget(f, d, p), e.xr.enabled = g, n.texture.needsPMREMUpdate = !0;
  }
}
class wa extends Rt {
  /**
   * Constructs a new cube texture.
   *
   * @param {Array<Image>} [images=[]] - An array holding a image for each side of a cube.
   * @param {number} [mapping=CubeReflectionMapping] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {string} [colorSpace=NoColorSpace] - The color space value.
   */
  constructor(e = [], t = 301, n, r, s, a, o, c, l, h) {
    super(e, t, n, r, s, a, o, c, l, h), this.isCubeTexture = !0, this.flipY = !1;
  }
  /**
   * Alias for {@link CubeTexture#image}.
   *
   * @type {Array<Image>}
   */
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class Fo extends kt {
  /**
   * Constructs a new cube render target.
   *
   * @param {number} [size=1] - The size of the render target.
   * @param {RenderTarget~Options} [options] - The configuration object.
   */
  constructor(e = 1, t = {}) {
    super(e, e, t), this.isWebGLCubeRenderTarget = !0;
    const n = { width: e, height: e, depth: 1 }, r = [n, n, n, n, n, n];
    this.texture = new wa(r), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
  }
  /**
   * Converts the given equirectangular texture to a cube map.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Texture} texture - The equirectangular texture.
   * @return {WebGLCubeRenderTarget} A reference to this cube render target.
   */
  fromEquirectangularTexture(e, t) {
    this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
    const n = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, r = new Si(5, 5, 5), s = new gt({
      name: "CubemapFromEquirect",
      uniforms: Qn(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: 1,
      blending: 0
    });
    s.uniforms.tEquirect.value = t;
    const a = new wt(r, s), o = t.minFilter;
    return t.minFilter === 1008 && (t.minFilter = 1006), new Io(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  /**
   * Clears this cube render target.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {boolean} [color=true] - Whether the color buffer should be cleared or not.
   * @param {boolean} [depth=true] - Whether the depth buffer should be cleared or not.
   * @param {boolean} [stencil=true] - Whether the stencil buffer should be cleared or not.
   */
  clear(e, t = !0, n = !0, r = !0) {
    const s = e.getRenderTarget();
    for (let a = 0; a < 6; a++)
      e.setRenderTarget(this, a), e.clear(t, n, r);
    e.setRenderTarget(s);
  }
}
class Qt extends ft {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const No = { type: "move" };
class Lr {
  /**
   * Constructs a new XR controller.
   */
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  /**
   * Returns a group representing the hand space of the XR controller.
   *
   * @return {Group} A group representing the hand space of the XR controller.
   */
  getHandSpace() {
    return this._hand === null && (this._hand = new Qt(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  /**
   * Returns a group representing the target ray space of the XR controller.
   *
   * @return {Group} A group representing the target ray space of the XR controller.
   */
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new Qt(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new P(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new P()), this._targetRay;
  }
  /**
   * Returns a group representing the grip space of the XR controller.
   *
   * @return {Group} A group representing the grip space of the XR controller.
   */
  getGripSpace() {
    return this._grip === null && (this._grip = new Qt(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new P(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new P()), this._grip;
  }
  /**
   * Dispatches the given event to the groups representing
   * the different coordinate spaces of the XR controller.
   *
   * @param {Object} event - The event to dispatch.
   * @return {WebXRController} A reference to this instance.
   */
  dispatchEvent(e) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
  }
  /**
   * Connects the controller with the given XR input source.
   *
   * @param {XRInputSource} inputSource - The input source.
   * @return {WebXRController} A reference to this instance.
   */
  connect(e) {
    if (e && e.hand) {
      const t = this._hand;
      if (t)
        for (const n of e.hand.values())
          this._getHandJoint(t, n);
    }
    return this.dispatchEvent({ type: "connected", data: e }), this;
  }
  /**
   * Disconnects the controller from the given XR input source.
   *
   * @param {XRInputSource} inputSource - The input source.
   * @return {WebXRController} A reference to this instance.
   */
  disconnect(e) {
    return this.dispatchEvent({ type: "disconnected", data: e }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  /**
   * Updates the controller with the given input source, XR frame and reference space.
   * This updates the transformations of the groups that represent the different
   * coordinate systems of the controller.
   *
   * @param {XRInputSource} inputSource - The input source.
   * @param {XRFrame} frame - The XR frame.
   * @param {XRReferenceSpace} referenceSpace - The reference space.
   * @return {WebXRController} A reference to this instance.
   */
  update(e, t, n) {
    let r = null, s = null, a = null;
    const o = this._targetRay, c = this._grip, l = this._hand;
    if (e && t.session.visibilityState !== "visible-blurred") {
      if (l && e.hand) {
        a = !0;
        for (const _ of e.hand.values()) {
          const m = t.getJointPose(_, n), u = this._getHandJoint(l, _);
          m !== null && (u.matrix.fromArray(m.transform.matrix), u.matrix.decompose(u.position, u.rotation, u.scale), u.matrixWorldNeedsUpdate = !0, u.jointRadius = m.radius), u.visible = m !== null;
        }
        const h = l.joints["index-finger-tip"], f = l.joints["thumb-tip"], d = h.position.distanceTo(f.position), p = 0.02, g = 5e-3;
        l.inputState.pinching && d > p + g ? (l.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: e.handedness,
          target: this
        })) : !l.inputState.pinching && d <= p - g && (l.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: e.handedness,
          target: this
        }));
      } else
        c !== null && e.gripSpace && (s = t.getPose(e.gripSpace, n), s !== null && (c.matrix.fromArray(s.transform.matrix), c.matrix.decompose(c.position, c.rotation, c.scale), c.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (c.hasLinearVelocity = !0, c.linearVelocity.copy(s.linearVelocity)) : c.hasLinearVelocity = !1, s.angularVelocity ? (c.hasAngularVelocity = !0, c.angularVelocity.copy(s.angularVelocity)) : c.hasAngularVelocity = !1));
      o !== null && (r = t.getPose(e.targetRaySpace, n), r === null && s !== null && (r = s), r !== null && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(No)));
    }
    return o !== null && (o.visible = r !== null), c !== null && (c.visible = s !== null), l !== null && (l.visible = a !== null), this;
  }
  /**
   * Returns a group representing the hand joint for the given input joint.
   *
   * @private
   * @param {Group} hand - The group representing the hand space.
   * @param {XRJointSpace} inputjoint - The hand joint data.
   * @return {Group} A group representing the hand joint for the given input joint.
   */
  _getHandJoint(e, t) {
    if (e.joints[t.jointName] === void 0) {
      const n = new Qt();
      n.matrixAutoUpdate = !1, n.visible = !1, e.joints[t.jointName] = n, e.add(n);
    }
    return e.joints[t.jointName];
  }
}
class Bo extends ft {
  /**
   * Constructs a new scene.
   */
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new qt(), this.environmentIntensity = 1, this.environmentRotation = new qt(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(e, t) {
    return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
  }
}
class Oo {
  /**
   * Constructs a new interleaved buffer.
   *
   * @param {TypedArray} array - A typed array with a shared buffer storing attribute data.
   * @param {number} stride - The number of typed-array elements per vertex.
   */
  constructor(e, t) {
    this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = 35044, this.updateRanges = [], this.version = 0, this.uuid = en();
  }
  /**
   * A callback function that is executed after the renderer has transferred the attribute array
   * data to the GPU.
   */
  onUploadCallback() {
  }
  /**
   * Flag to indicate that this attribute has changed and should be re-sent to
   * the GPU. Set this to `true` when you modify the value of the array.
   *
   * @type {number}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  /**
   * Sets the usage of this interleaved buffer.
   *
   * @param {(StaticDrawUsage|DynamicDrawUsage|StreamDrawUsage|StaticReadUsage|DynamicReadUsage|StreamReadUsage|StaticCopyUsage|DynamicCopyUsage|StreamCopyUsage)} value - The usage to set.
   * @return {InterleavedBuffer} A reference to this interleaved buffer.
   */
  setUsage(e) {
    return this.usage = e, this;
  }
  /**
   * Adds a range of data in the data array to be updated on the GPU.
   *
   * @param {number} start - Position at which to start update.
   * @param {number} count - The number of components to update.
   */
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  /**
   * Clears the update ranges.
   */
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  /**
   * Copies the values of the given interleaved buffer to this instance.
   *
   * @param {InterleavedBuffer} source - The interleaved buffer to copy.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  copy(e) {
    return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
  }
  /**
   * Copies a vector from the given interleaved buffer to this one. The start
   * and destination position in the attribute buffers are represented by the
   * given indices.
   *
   * @param {number} index1 - The destination index into this interleaved buffer.
   * @param {InterleavedBuffer} interleavedBuffer - The interleaved buffer to copy from.
   * @param {number} index2 - The source index into the given interleaved buffer.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  copyAt(e, t, n) {
    e *= this.stride, n *= t.stride;
    for (let r = 0, s = this.stride; r < s; r++)
      this.array[e + r] = t.array[n + r];
    return this;
  }
  /**
   * Sets the given array data in the interleaved buffer.
   *
   * @param {(TypedArray|Array)} value - The array data to set.
   * @param {number} [offset=0] - The offset in this interleaved buffer's array.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  /**
   * Returns a new interleaved buffer with copied values from this instance.
   *
   * @param {Object} [data] - An object with shared array buffers that allows to retain shared structures.
   * @return {InterleavedBuffer} A clone of this instance.
   */
  clone(e) {
    e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = en()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
    return n.setUsage(this.usage), n;
  }
  /**
   * Sets the given callback function that is executed after the Renderer has transferred
   * the array data to the GPU. Can be used to perform clean-up operations after
   * the upload when data are not needed anymore on the CPU side.
   *
   * @param {Function} callback - The `onUpload()` callback.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  /**
   * Serializes the interleaved buffer into JSON.
   *
   * @param {Object} [data] - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized interleaved buffer.
   */
  toJSON(e) {
    return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = en()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
      uuid: this.uuid,
      buffer: this.array.buffer._uuid,
      type: this.array.constructor.name,
      stride: this.stride
    };
  }
}
const Tt = /* @__PURE__ */ new P();
class rr {
  /**
   * Constructs a new interleaved buffer attribute.
   *
   * @param {InterleavedBuffer} interleavedBuffer - The buffer holding the interleaved data.
   * @param {number} itemSize - The item size.
   * @param {number} offset - The attribute offset into the buffer.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(e, t, n, r = !1) {
    this.isInterleavedBufferAttribute = !0, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = r;
  }
  /**
   * The item count of this buffer attribute.
   *
   * @type {number}
   * @readonly
   */
  get count() {
    return this.data.count;
  }
  /**
   * The array holding the interleaved buffer attribute data.
   *
   * @type {TypedArray}
   */
  get array() {
    return this.data.array;
  }
  /**
   * Flag to indicate that this attribute has changed and should be re-sent to
   * the GPU. Set this to `true` when you modify the value of the array.
   *
   * @type {number}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    this.data.needsUpdate = e;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  applyMatrix4(e) {
    for (let t = 0, n = this.data.count; t < n; t++)
      Tt.fromBufferAttribute(this, t), Tt.applyMatrix4(e), this.setXYZ(t, Tt.x, Tt.y, Tt.z);
    return this;
  }
  /**
   * Applies the given 3x3 normal matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix3} m - The normal matrix to apply.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      Tt.fromBufferAttribute(this, t), Tt.applyNormalMatrix(e), this.setXYZ(t, Tt.x, Tt.y, Tt.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3` and with direction vectors.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      Tt.fromBufferAttribute(this, t), Tt.transformDirection(e), this.setXYZ(t, Tt.x, Tt.y, Tt.z);
    return this;
  }
  /**
   * Returns the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @return {number} The returned value.
   */
  getComponent(e, t) {
    let n = this.array[e * this.data.stride + this.offset + t];
    return this.normalized && (n = Ht(n, this.array)), n;
  }
  /**
   * Sets the given value to the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @param {number} value - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setComponent(e, t, n) {
    return this.normalized && (n = Ze(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
  }
  /**
   * Sets the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setX(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
  }
  /**
   * Sets the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} y - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setY(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
  }
  /**
   * Sets the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} z - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setZ(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
  }
  /**
   * Sets the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} w - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setW(e, t) {
    return this.normalized && (t = Ze(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
  }
  /**
   * Returns the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The x component.
   */
  getX(e) {
    let t = this.data.array[e * this.data.stride + this.offset];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Returns the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The y component.
   */
  getY(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 1];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Returns the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The z component.
   */
  getZ(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 2];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Returns the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The w component.
   */
  getW(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 3];
    return this.normalized && (t = Ht(t, this.array)), t;
  }
  /**
   * Sets the x and y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setXY(e, t, n) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = Ze(t, this.array), n = Ze(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
  }
  /**
   * Sets the x, y and z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setXYZ(e, t, n, r) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = Ze(t, this.array), n = Ze(n, this.array), r = Ze(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this;
  }
  /**
   * Sets the x, y, z and w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @param {number} w - The value for the w component to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setXYZW(e, t, n, r, s) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = Ze(t, this.array), n = Ze(n, this.array), r = Ze(r, this.array), s = Ze(s, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this.data.array[e + 3] = s, this;
  }
  /**
   * Returns a new buffer attribute with copied values from this instance.
   *
   * If no parameter is provided, cloning an interleaved buffer attribute will de-interleave buffer data.
   *
   * @param {Object} [data] - An object with interleaved buffers that allows to retain the interleaved property.
   * @return {BufferAttribute|InterleavedBufferAttribute} A clone of this instance.
   */
  clone(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const r = n * this.data.stride + this.offset;
        for (let s = 0; s < this.itemSize; s++)
          t.push(this.data.array[r + s]);
      }
      return new Ve(new this.array.constructor(t), this.itemSize, this.normalized);
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new rr(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  /**
   * Serializes the buffer attribute into JSON.
   *
   * If no parameter is provided, cloning an interleaved buffer attribute will de-interleave buffer data.
   *
   * @param {Object} [data] - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized buffer attribute.
   */
  toJSON(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const r = n * this.data.stride + this.offset;
        for (let s = 0; s < this.itemSize; s++)
          t.push(this.data.array[r + s]);
      }
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: t,
        normalized: this.normalized
      };
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
        isInterleavedBufferAttribute: !0,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
  }
}
class Wr extends dn {
  /**
   * Constructs a new sprite material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isSpriteMaterial = !0, this.type = "SpriteMaterial", this.color = new Se(16777215), this.map = null, this.alphaMap = null, this.rotation = 0, this.sizeAttenuation = !0, this.transparent = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.rotation = e.rotation, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
let Vn;
const ci = /* @__PURE__ */ new P(), Hn = /* @__PURE__ */ new P(), kn = /* @__PURE__ */ new P(), Wn = /* @__PURE__ */ new we(), hi = /* @__PURE__ */ new we(), Ra = /* @__PURE__ */ new Qe(), Gi = /* @__PURE__ */ new P(), ui = /* @__PURE__ */ new P(), Vi = /* @__PURE__ */ new P(), ws = /* @__PURE__ */ new we(), Ur = /* @__PURE__ */ new we(), Rs = /* @__PURE__ */ new we();
class Cs extends ft {
  /**
   * Constructs a new sprite.
   *
   * @param {SpriteMaterial} [material] - The sprite material.
   */
  constructor(e = new Wr()) {
    if (super(), this.isSprite = !0, this.type = "Sprite", Vn === void 0) {
      Vn = new st();
      const t = new Float32Array([
        -0.5,
        -0.5,
        0,
        0,
        0,
        0.5,
        -0.5,
        0,
        1,
        0,
        0.5,
        0.5,
        0,
        1,
        1,
        -0.5,
        0.5,
        0,
        0,
        1
      ]), n = new Oo(t, 5);
      Vn.setIndex([0, 1, 2, 0, 2, 3]), Vn.setAttribute("position", new rr(n, 3, 0, !1)), Vn.setAttribute("uv", new rr(n, 2, 3, !1));
    }
    this.geometry = Vn, this.material = e, this.center = new we(0.5, 0.5), this.count = 1;
  }
  /**
   * Computes intersection points between a casted ray and this sprite.
   *
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - The target array that holds the intersection points.
   */
  raycast(e, t) {
    e.camera === null && console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'), Hn.setFromMatrixScale(this.matrixWorld), Ra.copy(e.camera.matrixWorld), this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse, this.matrixWorld), kn.setFromMatrixPosition(this.modelViewMatrix), e.camera.isPerspectiveCamera && this.material.sizeAttenuation === !1 && Hn.multiplyScalar(-kn.z);
    const n = this.material.rotation;
    let r, s;
    n !== 0 && (s = Math.cos(n), r = Math.sin(n));
    const a = this.center;
    Hi(Gi.set(-0.5, -0.5, 0), kn, a, Hn, r, s), Hi(ui.set(0.5, -0.5, 0), kn, a, Hn, r, s), Hi(Vi.set(0.5, 0.5, 0), kn, a, Hn, r, s), ws.set(0, 0), Ur.set(1, 0), Rs.set(1, 1);
    let o = e.ray.intersectTriangle(Gi, ui, Vi, !1, ci);
    if (o === null && (Hi(ui.set(-0.5, 0.5, 0), kn, a, Hn, r, s), Ur.set(0, 1), o = e.ray.intersectTriangle(Gi, Vi, ui, !1, ci), o === null))
      return;
    const c = e.ray.origin.distanceTo(ci);
    c < e.near || c > e.far || t.push({
      distance: c,
      point: ci.clone(),
      uv: Ot.getInterpolation(ci, Gi, ui, Vi, ws, Ur, Rs, new we()),
      face: null,
      object: this
    });
  }
  copy(e, t) {
    return super.copy(e, t), e.center !== void 0 && this.center.copy(e.center), this.material = e.material, this;
  }
}
function Hi(i, e, t, n, r, s) {
  Wn.subVectors(i, t).addScalar(0.5).multiply(n), r !== void 0 ? (hi.x = s * Wn.x - r * Wn.y, hi.y = r * Wn.x + s * Wn.y) : hi.copy(Wn), i.copy(e), i.x += hi.x, i.y += hi.y, i.applyMatrix4(Ra);
}
const Ir = /* @__PURE__ */ new P(), zo = /* @__PURE__ */ new P(), Go = /* @__PURE__ */ new Ne();
class yn {
  /**
   * Constructs a new plane.
   *
   * @param {Vector3} [normal=(1,0,0)] - A unit length vector defining the normal of the plane.
   * @param {number} [constant=0] - The signed distance from the origin to the plane.
   */
  constructor(e = new P(1, 0, 0), t = 0) {
    this.isPlane = !0, this.normal = e, this.constant = t;
  }
  /**
   * Sets the plane components by copying the given values.
   *
   * @param {Vector3} normal - The normal.
   * @param {number} constant - The constant.
   * @return {Plane} A reference to this plane.
   */
  set(e, t) {
    return this.normal.copy(e), this.constant = t, this;
  }
  /**
   * Sets the plane components by defining `x`, `y`, `z` as the
   * plane normal and `w` as the constant.
   *
   * @param {number} x - The value for the normal's x component.
   * @param {number} y - The value for the normal's y component.
   * @param {number} z - The value for the normal's z component.
   * @param {number} w - The constant value.
   * @return {Plane} A reference to this plane.
   */
  setComponents(e, t, n, r) {
    return this.normal.set(e, t, n), this.constant = r, this;
  }
  /**
   * Sets the plane from the given normal and coplanar point (that is a point
   * that lies onto the plane).
   *
   * @param {Vector3} normal - The normal.
   * @param {Vector3} point - A coplanar point.
   * @return {Plane} A reference to this plane.
   */
  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
  }
  /**
   * Sets the plane from three coplanar points. The winding order is
   * assumed to be counter-clockwise, and determines the direction of
   * the plane normal.
   *
   * @param {Vector3} a - The first coplanar point.
   * @param {Vector3} b - The second coplanar point.
   * @param {Vector3} c - The third coplanar point.
   * @return {Plane} A reference to this plane.
   */
  setFromCoplanarPoints(e, t, n) {
    const r = Ir.subVectors(n, t).cross(zo.subVectors(e, t)).normalize();
    return this.setFromNormalAndCoplanarPoint(r, e), this;
  }
  /**
   * Copies the values of the given plane to this instance.
   *
   * @param {Plane} plane - The plane to copy.
   * @return {Plane} A reference to this plane.
   */
  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }
  /**
   * Normalizes the plane normal and adjusts the constant accordingly.
   *
   * @return {Plane} A reference to this plane.
   */
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }
  /**
   * Negates both the plane normal and the constant.
   *
   * @return {Plane} A reference to this plane.
   */
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  /**
   * Returns the signed distance from the given point to this plane.
   *
   * @param {Vector3} point - The point to compute the distance for.
   * @return {number} The signed distance.
   */
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  /**
   * Returns the signed distance from the given sphere to this plane.
   *
   * @param {Sphere} sphere - The sphere to compute the distance for.
   * @return {number} The signed distance.
   */
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  /**
   * Projects a the given point onto the plane.
   *
   * @param {Vector3} point - The point to project.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The projected point on the plane.
   */
  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  /**
   * Returns the intersection point of the passed line and the plane. Returns
   * `null` if the line does not intersect. Returns the line's starting point if
   * the line is coplanar with the plane.
   *
   * @param {Line3} line - The line to compute the intersection for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectLine(e, t) {
    const n = e.delta(Ir), r = this.normal.dot(n);
    if (r === 0)
      return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const s = -(e.start.dot(this.normal) + this.constant) / r;
    return s < 0 || s > 1 ? null : t.copy(e.start).addScaledVector(n, s);
  }
  /**
   * Returns `true` if the given line segment intersects with (passes through) the plane.
   *
   * @param {Line3} line - The line to test.
   * @return {boolean} Whether the given line segment intersects with the plane or not.
   */
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
    return t < 0 && n > 0 || n < 0 && t > 0;
  }
  /**
   * Returns `true` if the given bounding box intersects with the plane.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the given bounding box intersects with the plane or not.
   */
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  /**
   * Returns `true` if the given bounding sphere intersects with the plane.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the given bounding sphere intersects with the plane or not.
   */
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  /**
   * Returns a coplanar vector to the plane, by calculating the
   * projection of the normal at the origin onto the plane.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The coplanar point.
   */
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  /**
   * Apply a 4x4 matrix to the plane. The matrix must be an affine, homogeneous transform.
   *
   * The optional normal matrix can be pre-computed like so:
   * ```js
   * const optionalNormalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );
   * ```
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @param {Matrix4} [optionalNormalMatrix] - A pre-computed normal matrix.
   * @return {Plane} A reference to this plane.
   */
  applyMatrix4(e, t) {
    const n = t || Go.getNormalMatrix(e), r = this.coplanarPoint(Ir).applyMatrix4(e), s = this.normal.applyMatrix3(n).normalize();
    return this.constant = -r.dot(s), this;
  }
  /**
   * Translates the plane by the distance defined by the given offset vector.
   * Note that this only affects the plane constant and will not affect the normal vector.
   *
   * @param {Vector3} offset - The offset vector.
   * @return {Plane} A reference to this plane.
   */
  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }
  /**
   * Returns `true` if this plane is equal with the given one.
   *
   * @param {Plane} plane - The plane to test for equality.
   * @return {boolean} Whether this plane is equal with the given one.
   */
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  /**
   * Returns a new plane with copied values from this instance.
   *
   * @return {Plane} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
const vn = /* @__PURE__ */ new Mi(), Vo = /* @__PURE__ */ new we(0.5, 0.5), ki = /* @__PURE__ */ new P();
class Jr {
  /**
   * Constructs a new frustum.
   *
   * @param {Plane} [p0] - The first plane that encloses the frustum.
   * @param {Plane} [p1] - The second plane that encloses the frustum.
   * @param {Plane} [p2] - The third plane that encloses the frustum.
   * @param {Plane} [p3] - The fourth plane that encloses the frustum.
   * @param {Plane} [p4] - The fifth plane that encloses the frustum.
   * @param {Plane} [p5] - The sixth plane that encloses the frustum.
   */
  constructor(e = new yn(), t = new yn(), n = new yn(), r = new yn(), s = new yn(), a = new yn()) {
    this.planes = [e, t, n, r, s, a];
  }
  /**
   * Sets the frustum planes by copying the given planes.
   *
   * @param {Plane} [p0] - The first plane that encloses the frustum.
   * @param {Plane} [p1] - The second plane that encloses the frustum.
   * @param {Plane} [p2] - The third plane that encloses the frustum.
   * @param {Plane} [p3] - The fourth plane that encloses the frustum.
   * @param {Plane} [p4] - The fifth plane that encloses the frustum.
   * @param {Plane} [p5] - The sixth plane that encloses the frustum.
   * @return {Frustum} A reference to this frustum.
   */
  set(e, t, n, r, s, a) {
    const o = this.planes;
    return o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(r), o[4].copy(s), o[5].copy(a), this;
  }
  /**
   * Copies the values of the given frustum to this instance.
   *
   * @param {Frustum} frustum - The frustum to copy.
   * @return {Frustum} A reference to this frustum.
   */
  copy(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++)
      t[n].copy(e.planes[n]);
    return this;
  }
  /**
   * Sets the frustum planes from the given projection matrix.
   *
   * @param {Matrix4} m - The projection matrix.
   * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} coordinateSystem - The coordinate system.
   * @param {boolean} [reversedDepth=false] - Whether to use a reversed depth.
   * @return {Frustum} A reference to this frustum.
   */
  setFromProjectionMatrix(e, t = 2e3, n = !1) {
    const r = this.planes, s = e.elements, a = s[0], o = s[1], c = s[2], l = s[3], h = s[4], f = s[5], d = s[6], p = s[7], g = s[8], _ = s[9], m = s[10], u = s[11], A = s[12], E = s[13], M = s[14], C = s[15];
    if (r[0].setComponents(l - a, p - h, u - g, C - A).normalize(), r[1].setComponents(l + a, p + h, u + g, C + A).normalize(), r[2].setComponents(l + o, p + f, u + _, C + E).normalize(), r[3].setComponents(l - o, p - f, u - _, C - E).normalize(), n)
      r[4].setComponents(c, d, m, M).normalize(), r[5].setComponents(l - c, p - d, u - m, C - M).normalize();
    else if (r[4].setComponents(l - c, p - d, u - m, C - M).normalize(), t === 2e3)
      r[5].setComponents(l + c, p + d, u + m, C + M).normalize();
    else if (t === 2001)
      r[5].setComponents(c, d, m, M).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
    return this;
  }
  /**
   * Returns `true` if the 3D object's bounding sphere is intersecting this frustum.
   *
   * Note that the 3D object must have a geometry so that the bounding sphere can be calculated.
   *
   * @param {Object3D} object - The 3D object to test.
   * @return {boolean} Whether the 3D object's bounding sphere is intersecting this frustum or not.
   */
  intersectsObject(e) {
    if (e.boundingSphere !== void 0)
      e.boundingSphere === null && e.computeBoundingSphere(), vn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
    else {
      const t = e.geometry;
      t.boundingSphere === null && t.computeBoundingSphere(), vn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
    }
    return this.intersectsSphere(vn);
  }
  /**
   * Returns `true` if the given sprite is intersecting this frustum.
   *
   * @param {Sprite} sprite - The sprite to test.
   * @return {boolean} Whether the sprite is intersecting this frustum or not.
   */
  intersectsSprite(e) {
    vn.center.set(0, 0, 0);
    const t = Vo.distanceTo(e.center);
    return vn.radius = 0.7071067811865476 + t, vn.applyMatrix4(e.matrixWorld), this.intersectsSphere(vn);
  }
  /**
   * Returns `true` if the given bounding sphere is intersecting this frustum.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the bounding sphere is intersecting this frustum or not.
   */
  intersectsSphere(e) {
    const t = this.planes, n = e.center, r = -e.radius;
    for (let s = 0; s < 6; s++)
      if (t[s].distanceToPoint(n) < r)
        return !1;
    return !0;
  }
  /**
   * Returns `true` if the given bounding box is intersecting this frustum.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the bounding box is intersecting this frustum or not.
   */
  intersectsBox(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) {
      const r = t[n];
      if (ki.x = r.normal.x > 0 ? e.max.x : e.min.x, ki.y = r.normal.y > 0 ? e.max.y : e.min.y, ki.z = r.normal.z > 0 ? e.max.z : e.min.z, r.distanceToPoint(ki) < 0)
        return !1;
    }
    return !0;
  }
  /**
   * Returns `true` if the given point lies within the frustum.
   *
   * @param {Vector3} point - The point to test.
   * @return {boolean} Whether the point lies within this frustum or not.
   */
  containsPoint(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++)
      if (t[n].distanceToPoint(e) < 0)
        return !1;
    return !0;
  }
  /**
   * Returns a new frustum with copied values from this instance.
   *
   * @return {Frustum} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
class fi extends dn {
  /**
   * Constructs a new line basic material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new Se(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
  }
}
const sr = /* @__PURE__ */ new P(), ar = /* @__PURE__ */ new P(), Ps = /* @__PURE__ */ new Qe(), di = /* @__PURE__ */ new or(), Wi = /* @__PURE__ */ new Mi(), Fr = /* @__PURE__ */ new P(), Ds = /* @__PURE__ */ new P();
class Ca extends ft {
  /**
   * Constructs a new line.
   *
   * @param {BufferGeometry} [geometry] - The line geometry.
   * @param {Material|Array<Material>} [material] - The line material.
   */
  constructor(e = new st(), t = new fi()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  /**
   * Computes an array of distance values which are necessary for rendering dashed lines.
   * For each vertex in the geometry, the method calculates the cumulative length from the
   * current point to the very beginning of the line.
   *
   * @return {Line} A reference to this line.
   */
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [0];
      for (let r = 1, s = t.count; r < s; r++)
        sr.fromBufferAttribute(t, r - 1), ar.fromBufferAttribute(t, r), n[r] = n[r - 1], n[r] += sr.distanceTo(ar);
      e.setAttribute("lineDistance", new at(n, 1));
    } else
      console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  /**
   * Computes intersection points between a casted ray and this line.
   *
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - The target array that holds the intersection points.
   */
  raycast(e, t) {
    const n = this.geometry, r = this.matrixWorld, s = e.params.Line.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), Wi.copy(n.boundingSphere), Wi.applyMatrix4(r), Wi.radius += s, e.ray.intersectsSphere(Wi) === !1) return;
    Ps.copy(r).invert(), di.copy(e.ray).applyMatrix4(Ps);
    const o = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = o * o, l = this.isLineSegments ? 2 : 1, h = n.index, d = n.attributes.position;
    if (h !== null) {
      const p = Math.max(0, a.start), g = Math.min(h.count, a.start + a.count);
      for (let _ = p, m = g - 1; _ < m; _ += l) {
        const u = h.getX(_), A = h.getX(_ + 1), E = Xi(this, e, di, c, u, A, _);
        E && t.push(E);
      }
      if (this.isLineLoop) {
        const _ = h.getX(g - 1), m = h.getX(p), u = Xi(this, e, di, c, _, m, g - 1);
        u && t.push(u);
      }
    } else {
      const p = Math.max(0, a.start), g = Math.min(d.count, a.start + a.count);
      for (let _ = p, m = g - 1; _ < m; _ += l) {
        const u = Xi(this, e, di, c, _, _ + 1, _);
        u && t.push(u);
      }
      if (this.isLineLoop) {
        const _ = Xi(this, e, di, c, g - 1, p, g - 1);
        _ && t.push(_);
      }
    }
  }
  /**
   * Sets the values of {@link Line#morphTargetDictionary} and {@link Line#morphTargetInfluences}
   * to make sure existing morph targets can influence this 3D object.
   */
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const r = t[n[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
        }
      }
    }
  }
}
function Xi(i, e, t, n, r, s, a) {
  const o = i.geometry.attributes.position;
  if (sr.fromBufferAttribute(o, r), ar.fromBufferAttribute(o, s), t.distanceSqToSegment(sr, ar, Fr, Ds) > n) return;
  Fr.applyMatrix4(i.matrixWorld);
  const l = e.ray.origin.distanceTo(Fr);
  if (!(l < e.near || l > e.far))
    return {
      distance: l,
      // What do we want? intersection point on the ray or on the segment??
      // point: raycaster.ray.at( distance ),
      point: Ds.clone().applyMatrix4(i.matrixWorld),
      index: a,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: i
    };
}
const Ls = /* @__PURE__ */ new P(), Us = /* @__PURE__ */ new P();
class Nr extends Ca {
  /**
   * Constructs a new line segments.
   *
   * @param {BufferGeometry} [geometry] - The line geometry.
   * @param {Material|Array<Material>} [material] - The line material.
   */
  constructor(e, t) {
    super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position, n = [];
      for (let r = 0, s = t.count; r < s; r += 2)
        Ls.fromBufferAttribute(t, r), Us.fromBufferAttribute(t, r + 1), n[r] = r === 0 ? 0 : n[r - 1], n[r + 1] = n[r] + Ls.distanceTo(Us);
      e.setAttribute("lineDistance", new at(n, 1));
    } else
      console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class Ho extends Ca {
  /**
   * Constructs a new line loop.
   *
   * @param {BufferGeometry} [geometry] - The line geometry.
   * @param {Material|Array<Material>} [material] - The line material.
   */
  constructor(e, t) {
    super(e, t), this.isLineLoop = !0, this.type = "LineLoop";
  }
}
class un extends dn {
  /**
   * Constructs a new points material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new Se(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
const Is = /* @__PURE__ */ new Qe(), Xr = /* @__PURE__ */ new or(), qi = /* @__PURE__ */ new Mi(), Yi = /* @__PURE__ */ new P();
class cn extends ft {
  /**
   * Constructs a new point cloud.
   *
   * @param {BufferGeometry} [geometry] - The points geometry.
   * @param {Material|Array<Material>} [material] - The points material.
   */
  constructor(e = new st(), t = new un()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  /**
   * Computes intersection points between a casted ray and this point cloud.
   *
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - The target array that holds the intersection points.
   */
  raycast(e, t) {
    const n = this.geometry, r = this.matrixWorld, s = e.params.Points.threshold, a = n.drawRange;
    if (n.boundingSphere === null && n.computeBoundingSphere(), qi.copy(n.boundingSphere), qi.applyMatrix4(r), qi.radius += s, e.ray.intersectsSphere(qi) === !1) return;
    Is.copy(r).invert(), Xr.copy(e.ray).applyMatrix4(Is);
    const o = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = o * o, l = n.index, f = n.attributes.position;
    if (l !== null) {
      const d = Math.max(0, a.start), p = Math.min(l.count, a.start + a.count);
      for (let g = d, _ = p; g < _; g++) {
        const m = l.getX(g);
        Yi.fromBufferAttribute(f, m), Fs(Yi, m, c, r, e, t, this);
      }
    } else {
      const d = Math.max(0, a.start), p = Math.min(f.count, a.start + a.count);
      for (let g = d, _ = p; g < _; g++)
        Yi.fromBufferAttribute(f, g), Fs(Yi, g, c, r, e, t, this);
    }
  }
  /**
   * Sets the values of {@link Points#morphTargetDictionary} and {@link Points#morphTargetInfluences}
   * to make sure existing morph targets can influence this 3D object.
   */
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, n = Object.keys(t);
    if (n.length > 0) {
      const r = t[n[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
        }
      }
    }
  }
}
function Fs(i, e, t, n, r, s, a) {
  const o = Xr.distanceSqToPoint(i);
  if (o < t) {
    const c = new P();
    Xr.closestPointToPoint(i, c), c.applyMatrix4(n);
    const l = r.ray.origin.distanceTo(c);
    if (l < r.near || l > r.far) return;
    s.push({
      distance: l,
      distanceToRay: Math.sqrt(o),
      point: c,
      index: e,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: a
    });
  }
}
class Pa extends Rt {
  /**
   * Constructs a new texture.
   *
   * @param {HTMLCanvasElement} [canvas] - The HTML canvas element.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   */
  constructor(e, t, n, r, s, a, o, c, l) {
    super(e, t, n, r, s, a, o, c, l), this.isCanvasTexture = !0, this.needsUpdate = !0;
  }
}
class Da extends Rt {
  /**
   * Constructs a new depth texture.
   *
   * @param {number} width - The width of the texture.
   * @param {number} height - The height of the texture.
   * @param {number} [type=UnsignedIntType] - The texture type.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearFilter] - The min filter value.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {number} [format=DepthFormat] - The texture format.
   * @param {number} [depth=1] - The depth of the texture.
   */
  constructor(e, t, n = 1014, r, s, a, o = 1003, c = 1003, l, h = 1026, f = 1) {
    if (h !== 1026 && h !== 1027)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    const d = { width: e, height: t, depth: f };
    super(d, r, s, a, o, c, h, n, l), this.isDepthTexture = !0, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.source = new $r(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
  }
}
class lr extends st {
  /**
   * Constructs a new plane geometry.
   *
   * @param {number} [width=1] - The width along the X axis.
   * @param {number} [height=1] - The height along the Y axis
   * @param {number} [widthSegments=1] - The number of segments along the X axis.
   * @param {number} [heightSegments=1] - The number of segments along the Y axis.
   */
  constructor(e = 1, t = 1, n = 1, r = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: e,
      height: t,
      widthSegments: n,
      heightSegments: r
    };
    const s = e / 2, a = t / 2, o = Math.floor(n), c = Math.floor(r), l = o + 1, h = c + 1, f = e / o, d = t / c, p = [], g = [], _ = [], m = [];
    for (let u = 0; u < h; u++) {
      const A = u * d - a;
      for (let E = 0; E < l; E++) {
        const M = E * f - s;
        g.push(M, -A, 0), _.push(0, 0, 1), m.push(E / o), m.push(1 - u / c);
      }
    }
    for (let u = 0; u < c; u++)
      for (let A = 0; A < o; A++) {
        const E = A + l * u, M = A + l * (u + 1), C = A + 1 + l * (u + 1), R = A + 1 + l * u;
        p.push(E, M, R), p.push(M, C, R);
      }
    this.setIndex(p), this.setAttribute("position", new at(g, 3)), this.setAttribute("normal", new at(_, 3)), this.setAttribute("uv", new at(m, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {PlaneGeometry} A new instance.
   */
  static fromJSON(e) {
    return new lr(e.width, e.height, e.widthSegments, e.heightSegments);
  }
}
class Yn extends st {
  /**
   * Constructs a new sphere geometry.
   *
   * @param {number} [radius=1] - The sphere radius.
   * @param {number} [widthSegments=32] - The number of horizontal segments. Minimum value is `3`.
   * @param {number} [heightSegments=16] - The number of vertical segments. Minimum value is `2`.
   * @param {number} [phiStart=0] - The horizontal starting angle in radians.
   * @param {number} [phiLength=Math.PI*2] - The horizontal sweep angle size.
   * @param {number} [thetaStart=0] - The vertical starting angle in radians.
   * @param {number} [thetaLength=Math.PI] - The vertical sweep angle size.
   */
  constructor(e = 1, t = 32, n = 16, r = 0, s = Math.PI * 2, a = 0, o = Math.PI) {
    super(), this.type = "SphereGeometry", this.parameters = {
      radius: e,
      widthSegments: t,
      heightSegments: n,
      phiStart: r,
      phiLength: s,
      thetaStart: a,
      thetaLength: o
    }, t = Math.max(3, Math.floor(t)), n = Math.max(2, Math.floor(n));
    const c = Math.min(a + o, Math.PI);
    let l = 0;
    const h = [], f = new P(), d = new P(), p = [], g = [], _ = [], m = [];
    for (let u = 0; u <= n; u++) {
      const A = [], E = u / n;
      let M = 0;
      u === 0 && a === 0 ? M = 0.5 / t : u === n && c === Math.PI && (M = -0.5 / t);
      for (let C = 0; C <= t; C++) {
        const R = C / t;
        f.x = -e * Math.cos(r + R * s) * Math.sin(a + E * o), f.y = e * Math.cos(a + E * o), f.z = e * Math.sin(r + R * s) * Math.sin(a + E * o), g.push(f.x, f.y, f.z), d.copy(f).normalize(), _.push(d.x, d.y, d.z), m.push(R + M, 1 - E), A.push(l++);
      }
      h.push(A);
    }
    for (let u = 0; u < n; u++)
      for (let A = 0; A < t; A++) {
        const E = h[u][A + 1], M = h[u][A], C = h[u + 1][A], R = h[u + 1][A + 1];
        (u !== 0 || a > 0) && p.push(E, M, R), (u !== n - 1 || c < Math.PI) && p.push(M, C, R);
      }
    this.setIndex(p), this.setAttribute("position", new at(g, 3)), this.setAttribute("normal", new at(_, 3)), this.setAttribute("uv", new at(m, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {SphereGeometry} A new instance.
   */
  static fromJSON(e) {
    return new Yn(e.radius, e.widthSegments, e.heightSegments, e.phiStart, e.phiLength, e.thetaStart, e.thetaLength);
  }
}
class ko extends gt {
  /**
   * Constructs a new raw shader material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(e), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
  }
}
class Wo extends dn {
  /**
   * Constructs a new mesh standard material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new Se(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Se(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new we(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new qt(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
  }
}
class Xo extends dn {
  /**
   * Constructs a new mesh depth material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = 3200, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
  }
}
class qo extends dn {
  /**
   * Constructs a new mesh distance material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(e) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
  }
}
class La extends ft {
  /**
   * Constructs a new light.
   *
   * @param {(number|Color|string)} [color=0xffffff] - The light's color.
   * @param {number} [intensity=1] - The light's strength/intensity.
   */
  constructor(e, t = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Se(e), this.intensity = t;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   */
  dispose() {
  }
  copy(e, t) {
    return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, this.groundColor !== void 0 && (t.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (t.object.distance = this.distance), this.angle !== void 0 && (t.object.angle = this.angle), this.decay !== void 0 && (t.object.decay = this.decay), this.penumbra !== void 0 && (t.object.penumbra = this.penumbra), this.shadow !== void 0 && (t.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (t.object.target = this.target.uuid), t;
  }
}
class Yo extends La {
  /**
   * Constructs a new hemisphere light.
   *
   * @param {(number|Color|string)} [skyColor=0xffffff] - The light's sky color.
   * @param {(number|Color|string)} [groundColor=0xffffff] - The light's ground color.
   * @param {number} [intensity=1] - The light's strength/intensity.
   */
  constructor(e, t, n) {
    super(e, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(ft.DEFAULT_UP), this.updateMatrix(), this.groundColor = new Se(t);
  }
  copy(e, t) {
    return super.copy(e, t), this.groundColor.copy(e.groundColor), this;
  }
}
const Br = /* @__PURE__ */ new Qe(), Ns = /* @__PURE__ */ new P(), Bs = /* @__PURE__ */ new P();
class Ko {
  /**
   * Constructs a new light shadow.
   *
   * @param {Camera} camera - The light's view of the world.
   */
  constructor(e) {
    this.camera = e, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new we(512, 512), this.mapType = 1009, this.map = null, this.mapPass = null, this.matrix = new Qe(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new Jr(), this._frameExtents = new we(1, 1), this._viewportCount = 1, this._viewports = [
      new ht(0, 0, 1, 1)
    ];
  }
  /**
   * Used internally by the renderer to get the number of viewports that need
   * to be rendered for this shadow.
   *
   * @return {number} The viewport count.
   */
  getViewportCount() {
    return this._viewportCount;
  }
  /**
   * Gets the shadow cameras frustum. Used internally by the renderer to cull objects.
   *
   * @return {Frustum} The shadow camera frustum.
   */
  getFrustum() {
    return this._frustum;
  }
  /**
   * Update the matrices for the camera and shadow, used internally by the renderer.
   *
   * @param {Light} light - The light for which the shadow is being rendered.
   */
  updateMatrices(e) {
    const t = this.camera, n = this.matrix;
    Ns.setFromMatrixPosition(e.matrixWorld), t.position.copy(Ns), Bs.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(Bs), t.updateMatrixWorld(), Br.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Br, t.coordinateSystem, t.reversedDepth), t.reversedDepth ? n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ) : n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), n.multiply(Br);
  }
  /**
   * Returns a viewport definition for the given viewport index.
   *
   * @param {number} viewportIndex - The viewport index.
   * @return {Vector4} The viewport.
   */
  getViewport(e) {
    return this._viewports[e];
  }
  /**
   * Returns the frame extends.
   *
   * @return {Vector2} The frame extends.
   */
  getFrameExtents() {
    return this._frameExtents;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   */
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  /**
   * Copies the values of the given light shadow instance to this instance.
   *
   * @param {LightShadow} source - The light shadow to copy.
   * @return {LightShadow} A reference to this light shadow instance.
   */
  copy(e) {
    return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.autoUpdate = e.autoUpdate, this.needsUpdate = e.needsUpdate, this.normalBias = e.normalBias, this.blurSamples = e.blurSamples, this.mapSize.copy(e.mapSize), this;
  }
  /**
   * Returns a new light shadow instance with copied values from this instance.
   *
   * @return {LightShadow} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Serializes the light shadow into JSON.
   *
   * @return {Object} A JSON object representing the serialized light shadow.
   * @see {@link ObjectLoader#parse}
   */
  toJSON() {
    const e = {};
    return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
  }
}
class Qr extends ba {
  /**
   * Constructs a new orthographic camera.
   *
   * @param {number} [left=-1] - The left plane of the camera's frustum.
   * @param {number} [right=1] - The right plane of the camera's frustum.
   * @param {number} [top=1] - The top plane of the camera's frustum.
   * @param {number} [bottom=-1] - The bottom plane of the camera's frustum.
   * @param {number} [near=0.1] - The camera's near plane.
   * @param {number} [far=2000] - The camera's far plane.
   */
  constructor(e = -1, t = 1, n = 1, r = -1, s = 0.1, a = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = r, this.near = s, this.far = a, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * @param {number} fullWidth - The full width of multiview setup.
   * @param {number} fullHeight - The full height of multiview setup.
   * @param {number} x - The horizontal offset of the subcamera.
   * @param {number} y - The vertical offset of the subcamera.
   * @param {number} width - The width of subcamera.
   * @param {number} height - The height of subcamera.
   * @see {@link PerspectiveCamera#setViewOffset}
   */
  setViewOffset(e, t, n, r, s, a) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
  }
  /**
   * Removes the view offset from the projection matrix.
   */
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  /**
   * Updates the camera's projection matrix. Must be called after any change of
   * camera properties.
   */
  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, r = (this.top + this.bottom) / 2;
    let s = n - e, a = n + e, o = r + t, c = r - t;
    if (this.view !== null && this.view.enabled) {
      const l = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      s += l * this.view.offsetX, a = s + l * this.view.width, o -= h * this.view.offsetY, c = o - h * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(s, a, o, c, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
  }
}
class Zo extends Ko {
  /**
   * Constructs a new directional light shadow.
   */
  constructor() {
    super(new Qr(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class $o extends La {
  /**
   * Constructs a new directional light.
   *
   * @param {(number|Color|string)} [color=0xffffff] - The light's color.
   * @param {number} [intensity=1] - The light's strength/intensity.
   */
  constructor(e, t) {
    super(e, t), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(ft.DEFAULT_UP), this.updateMatrix(), this.target = new ft(), this.shadow = new Zo();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e) {
    return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
}
class jo extends Bt {
  /**
   * Constructs a new array camera.
   *
   * @param {Array<PerspectiveCamera>} [array=[]] - An array of perspective sub cameras.
   */
  constructor(e = []) {
    super(), this.isArrayCamera = !0, this.isMultiViewCamera = !1, this.cameras = e;
  }
}
class Ua {
  /**
   * Constructs a new clock.
   *
   * @param {boolean} [autoStart=true] - Whether to automatically start the clock when
   * `getDelta()` is called for the first time.
   */
  constructor(e = !0) {
    this.autoStart = e, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1;
  }
  /**
   * Starts the clock. When `autoStart` is set to `true`, the method is automatically
   * called by the class.
   */
  start() {
    this.startTime = performance.now(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = !0;
  }
  /**
   * Stops the clock.
   */
  stop() {
    this.getElapsedTime(), this.running = !1, this.autoStart = !1;
  }
  /**
   * Returns the elapsed time in seconds.
   *
   * @return {number} The elapsed time.
   */
  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }
  /**
   * Returns the delta time in seconds.
   *
   * @return {number} The delta time.
   */
  getDelta() {
    let e = 0;
    if (this.autoStart && !this.running)
      return this.start(), 0;
    if (this.running) {
      const t = performance.now();
      e = (t - this.oldTime) / 1e3, this.oldTime = t, this.elapsedTime += e;
    }
    return e;
  }
}
const Os = /* @__PURE__ */ new Qe();
class Jo {
  /**
   * Constructs a new raycaster.
   *
   * @param {Vector3} origin - The origin vector where the ray casts from.
   * @param {Vector3} direction - The (normalized) direction vector that gives direction to the ray.
   * @param {number} [near=0] - All results returned are further away than near. Near can't be negative.
   * @param {number} [far=Infinity] - All results returned are closer than far. Far can't be lower than near.
   */
  constructor(e, t, n = 0, r = 1 / 0) {
    this.ray = new or(e, t), this.near = n, this.far = r, this.camera = null, this.layers = new jr(), this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      LOD: {},
      Points: { threshold: 1 },
      Sprite: {}
    };
  }
  /**
   * Updates the ray with a new origin and direction by copying the values from the arguments.
   *
   * @param {Vector3} origin - The origin vector where the ray casts from.
   * @param {Vector3} direction - The (normalized) direction vector that gives direction to the ray.
   */
  set(e, t) {
    this.ray.set(e, t);
  }
  /**
   * Uses the given coordinates and camera to compute a new origin and direction for the internal ray.
   *
   * @param {Vector2} coords - 2D coordinates of the mouse, in normalized device coordinates (NDC).
   * X and Y components should be between `-1` and `1`.
   * @param {Camera} camera - The camera from which the ray should originate.
   */
  setFromCamera(e, t) {
    t.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, 0.5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, (t.near + t.far) / (t.near - t.far)).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : console.error("THREE.Raycaster: Unsupported camera type: " + t.type);
  }
  /**
   * Uses the given WebXR controller to compute a new origin and direction for the internal ray.
   *
   * @param {WebXRController} controller - The controller to copy the position and direction from.
   * @return {Raycaster} A reference to this raycaster.
   */
  setFromXRController(e) {
    return Os.identity().extractRotation(e.matrixWorld), this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(Os), this;
  }
  /**
   * The intersection point of a raycaster intersection test.
   * @typedef {Object} Raycaster~Intersection
   * @property {number} distance - The distance from the ray's origin to the intersection point.
   * @property {number} distanceToRay -  Some 3D objects e.g. {@link Points} provide the distance of the
   * intersection to the nearest point on the ray. For other objects it will be `undefined`.
   * @property {Vector3} point - The intersection point, in world coordinates.
   * @property {Object} face - The face that has been intersected.
   * @property {number} faceIndex - The face index.
   * @property {Object3D} object - The 3D object that has been intersected.
   * @property {Vector2} uv - U,V coordinates at point of intersection.
   * @property {Vector2} uv1 - Second set of U,V coordinates at point of intersection.
   * @property {Vector3} uv1 - Interpolated normal vector at point of intersection.
   * @property {number} instanceId - The index number of the instance where the ray
   * intersects the {@link InstancedMesh}.
   */
  /**
   * Checks all intersection between the ray and the object with or without the
   * descendants. Intersections are returned sorted by distance, closest first.
   *
   * `Raycaster` delegates to the `raycast()` method of the passed 3D object, when
   * evaluating whether the ray intersects the object or not. This allows meshes to respond
   * differently to ray casting than lines or points.
   *
   * Note that for meshes, faces must be pointed towards the origin of the ray in order
   * to be detected; intersections of the ray passing through the back of a face will not
   * be detected. To raycast against both faces of an object, you'll want to set  {@link Material#side}
   * to `THREE.DoubleSide`.
   *
   * @param {Object3D} object - The 3D object to check for intersection with the ray.
   * @param {boolean} [recursive=true] - If set to `true`, it also checks all descendants.
   * Otherwise it only checks intersection with the object.
   * @param {Array<Raycaster~Intersection>} [intersects=[]] The target array that holds the result of the method.
   * @return {Array<Raycaster~Intersection>} An array holding the intersection points.
   */
  intersectObject(e, t = !0, n = []) {
    return qr(e, this, n, t), n.sort(zs), n;
  }
  /**
   * Checks all intersection between the ray and the objects with or without
   * the descendants. Intersections are returned sorted by distance, closest first.
   *
   * @param {Array<Object3D>} objects - The 3D objects to check for intersection with the ray.
   * @param {boolean} [recursive=true] - If set to `true`, it also checks all descendants.
   * Otherwise it only checks intersection with the object.
   * @param {Array<Raycaster~Intersection>} [intersects=[]] The target array that holds the result of the method.
   * @return {Array<Raycaster~Intersection>} An array holding the intersection points.
   */
  intersectObjects(e, t = !0, n = []) {
    for (let r = 0, s = e.length; r < s; r++)
      qr(e[r], this, n, t);
    return n.sort(zs), n;
  }
}
function zs(i, e) {
  return i.distance - e.distance;
}
function qr(i, e, t, n) {
  let r = !0;
  if (i.layers.test(e.layers) && i.raycast(e, t) === !1 && (r = !1), r === !0 && n === !0) {
    const s = i.children;
    for (let a = 0, o = s.length; a < o; a++)
      qr(s[a], e, t, !0);
  }
}
function Gs(i, e, t, n) {
  const r = Qo(n);
  switch (t) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case 1021:
      return i * e;
    case 1028:
      return i * e / r.components * r.byteLength;
    case 1029:
      return i * e / r.components * r.byteLength;
    case 1030:
      return i * e * 2 / r.components * r.byteLength;
    case 1031:
      return i * e * 2 / r.components * r.byteLength;
    case 1022:
      return i * e * 3 / r.components * r.byteLength;
    case 1023:
      return i * e * 4 / r.components * r.byteLength;
    case 1033:
      return i * e * 4 / r.components * r.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case 33776:
    case 33777:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case 33778:
    case 33779:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case 35841:
    case 35843:
      return Math.max(i, 16) * Math.max(e, 8) / 4;
    case 35840:
    case 35842:
      return Math.max(i, 8) * Math.max(e, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case 36196:
    case 37492:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case 37496:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case 37808:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case 37809:
      return Math.floor((i + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case 37810:
      return Math.floor((i + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case 37811:
      return Math.floor((i + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case 37812:
      return Math.floor((i + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case 37813:
      return Math.floor((i + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case 37814:
      return Math.floor((i + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case 37815:
      return Math.floor((i + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case 37816:
      return Math.floor((i + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case 37817:
      return Math.floor((i + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case 37818:
      return Math.floor((i + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case 37819:
      return Math.floor((i + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case 37820:
      return Math.floor((i + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case 37821:
      return Math.floor((i + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case 36492:
    case 36494:
    case 36495:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case 36283:
    case 36284:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 8;
    case 36285:
    case 36286:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${t} format.`
  );
}
function Qo(i) {
  switch (i) {
    case 1009:
    case 1010:
      return { byteLength: 1, components: 1 };
    case 1012:
    case 1011:
    case 1016:
      return { byteLength: 2, components: 1 };
    case 1017:
    case 1018:
      return { byteLength: 2, components: 4 };
    case 1014:
    case 1013:
    case 1015:
      return { byteLength: 4, components: 1 };
    case 35902:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: "179"
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = "179");
function Ia() {
  let i = null, e = !1, t = null, n = null;
  function r(s, a) {
    t(s, a), n = i.requestAnimationFrame(r);
  }
  return {
    start: function() {
      e !== !0 && t !== null && (n = i.requestAnimationFrame(r), e = !0);
    },
    stop: function() {
      i.cancelAnimationFrame(n), e = !1;
    },
    setAnimationLoop: function(s) {
      t = s;
    },
    setContext: function(s) {
      i = s;
    }
  };
}
function el(i) {
  const e = /* @__PURE__ */ new WeakMap();
  function t(o, c) {
    const l = o.array, h = o.usage, f = l.byteLength, d = i.createBuffer();
    i.bindBuffer(c, d), i.bufferData(c, l, h), o.onUploadCallback();
    let p;
    if (l instanceof Float32Array)
      p = i.FLOAT;
    else if (typeof Float16Array < "u" && l instanceof Float16Array)
      p = i.HALF_FLOAT;
    else if (l instanceof Uint16Array)
      o.isFloat16BufferAttribute ? p = i.HALF_FLOAT : p = i.UNSIGNED_SHORT;
    else if (l instanceof Int16Array)
      p = i.SHORT;
    else if (l instanceof Uint32Array)
      p = i.UNSIGNED_INT;
    else if (l instanceof Int32Array)
      p = i.INT;
    else if (l instanceof Int8Array)
      p = i.BYTE;
    else if (l instanceof Uint8Array)
      p = i.UNSIGNED_BYTE;
    else if (l instanceof Uint8ClampedArray)
      p = i.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + l);
    return {
      buffer: d,
      type: p,
      bytesPerElement: l.BYTES_PER_ELEMENT,
      version: o.version,
      size: f
    };
  }
  function n(o, c, l) {
    const h = c.array, f = c.updateRanges;
    if (i.bindBuffer(l, o), f.length === 0)
      i.bufferSubData(l, 0, h);
    else {
      f.sort((p, g) => p.start - g.start);
      let d = 0;
      for (let p = 1; p < f.length; p++) {
        const g = f[d], _ = f[p];
        _.start <= g.start + g.count + 1 ? g.count = Math.max(
          g.count,
          _.start + _.count - g.start
        ) : (++d, f[d] = _);
      }
      f.length = d + 1;
      for (let p = 0, g = f.length; p < g; p++) {
        const _ = f[p];
        i.bufferSubData(
          l,
          _.start * h.BYTES_PER_ELEMENT,
          h,
          _.start,
          _.count
        );
      }
      c.clearUpdateRanges();
    }
    c.onUploadCallback();
  }
  function r(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), e.get(o);
  }
  function s(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const c = e.get(o);
    c && (i.deleteBuffer(c.buffer), e.delete(o));
  }
  function a(o, c) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const h = e.get(o);
      (!h || h.version < o.version) && e.set(o, {
        buffer: o.buffer,
        type: o.type,
        bytesPerElement: o.elementSize,
        version: o.version
      });
      return;
    }
    const l = e.get(o);
    if (l === void 0)
      e.set(o, t(o, c));
    else if (l.version < o.version) {
      if (l.size !== o.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(l.buffer, o, c), l.version = o.version;
    }
  }
  return {
    get: r,
    remove: s,
    update: a
  };
}
var tl = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, nl = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, il = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, rl = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, sl = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, al = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, ol = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, ll = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, cl = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, hl = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, ul = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, dl = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, fl = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, pl = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, ml = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, gl = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, _l = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, vl = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, xl = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Ml = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, Sl = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, yl = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, El = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, Tl = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, Al = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, bl = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, wl = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, Rl = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, Cl = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, Pl = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Dl = "gl_FragColor = linearToOutputTexel( gl_FragColor );", Ll = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, Ul = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, Il = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, Fl = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, Nl = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, Bl = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, Ol = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, zl = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, Gl = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, Vl = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, Hl = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, kl = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, Wl = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, Xl = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, ql = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Yl = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, Kl = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, Zl = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, $l = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, jl = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Jl = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, Ql = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, ec = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, tc = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, nc = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, ic = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, rc = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, sc = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, ac = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, oc = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, lc = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, cc = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, hc = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, uc = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, dc = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, fc = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, pc = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, mc = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, gc = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, _c = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, vc = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, xc = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, Mc = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Sc = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, yc = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, Ec = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, Tc = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, Ac = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, bc = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, wc = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, Rc = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, Cc = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, Pc = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Dc = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, Lc = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, Uc = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, Ic = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, Fc = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, Nc = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, Bc = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, Oc = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, zc = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, Gc = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, Vc = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, Hc = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, kc = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, Wc = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, Xc = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, qc = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, Yc = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, Kc = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, Zc = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, $c = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, jc = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Jc = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, Qc = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const eh = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, th = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, nh = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, ih = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, rh = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, sh = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, ah = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, oh = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, lh = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, ch = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, hh = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, uh = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, dh = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, fh = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, ph = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, mh = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, gh = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, _h = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, vh = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, xh = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Mh = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, Sh = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, yh = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Eh = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Th = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, Ah = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, bh = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, wh = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Rh = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, Ch = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Ph = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Dh = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Lh = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Uh = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Be = {
  alphahash_fragment: tl,
  alphahash_pars_fragment: nl,
  alphamap_fragment: il,
  alphamap_pars_fragment: rl,
  alphatest_fragment: sl,
  alphatest_pars_fragment: al,
  aomap_fragment: ol,
  aomap_pars_fragment: ll,
  batching_pars_vertex: cl,
  batching_vertex: hl,
  begin_vertex: ul,
  beginnormal_vertex: dl,
  bsdfs: fl,
  iridescence_fragment: pl,
  bumpmap_pars_fragment: ml,
  clipping_planes_fragment: gl,
  clipping_planes_pars_fragment: _l,
  clipping_planes_pars_vertex: vl,
  clipping_planes_vertex: xl,
  color_fragment: Ml,
  color_pars_fragment: Sl,
  color_pars_vertex: yl,
  color_vertex: El,
  common: Tl,
  cube_uv_reflection_fragment: Al,
  defaultnormal_vertex: bl,
  displacementmap_pars_vertex: wl,
  displacementmap_vertex: Rl,
  emissivemap_fragment: Cl,
  emissivemap_pars_fragment: Pl,
  colorspace_fragment: Dl,
  colorspace_pars_fragment: Ll,
  envmap_fragment: Ul,
  envmap_common_pars_fragment: Il,
  envmap_pars_fragment: Fl,
  envmap_pars_vertex: Nl,
  envmap_physical_pars_fragment: Yl,
  envmap_vertex: Bl,
  fog_vertex: Ol,
  fog_pars_vertex: zl,
  fog_fragment: Gl,
  fog_pars_fragment: Vl,
  gradientmap_pars_fragment: Hl,
  lightmap_pars_fragment: kl,
  lights_lambert_fragment: Wl,
  lights_lambert_pars_fragment: Xl,
  lights_pars_begin: ql,
  lights_toon_fragment: Kl,
  lights_toon_pars_fragment: Zl,
  lights_phong_fragment: $l,
  lights_phong_pars_fragment: jl,
  lights_physical_fragment: Jl,
  lights_physical_pars_fragment: Ql,
  lights_fragment_begin: ec,
  lights_fragment_maps: tc,
  lights_fragment_end: nc,
  logdepthbuf_fragment: ic,
  logdepthbuf_pars_fragment: rc,
  logdepthbuf_pars_vertex: sc,
  logdepthbuf_vertex: ac,
  map_fragment: oc,
  map_pars_fragment: lc,
  map_particle_fragment: cc,
  map_particle_pars_fragment: hc,
  metalnessmap_fragment: uc,
  metalnessmap_pars_fragment: dc,
  morphinstance_vertex: fc,
  morphcolor_vertex: pc,
  morphnormal_vertex: mc,
  morphtarget_pars_vertex: gc,
  morphtarget_vertex: _c,
  normal_fragment_begin: vc,
  normal_fragment_maps: xc,
  normal_pars_fragment: Mc,
  normal_pars_vertex: Sc,
  normal_vertex: yc,
  normalmap_pars_fragment: Ec,
  clearcoat_normal_fragment_begin: Tc,
  clearcoat_normal_fragment_maps: Ac,
  clearcoat_pars_fragment: bc,
  iridescence_pars_fragment: wc,
  opaque_fragment: Rc,
  packing: Cc,
  premultiplied_alpha_fragment: Pc,
  project_vertex: Dc,
  dithering_fragment: Lc,
  dithering_pars_fragment: Uc,
  roughnessmap_fragment: Ic,
  roughnessmap_pars_fragment: Fc,
  shadowmap_pars_fragment: Nc,
  shadowmap_pars_vertex: Bc,
  shadowmap_vertex: Oc,
  shadowmask_pars_fragment: zc,
  skinbase_vertex: Gc,
  skinning_pars_vertex: Vc,
  skinning_vertex: Hc,
  skinnormal_vertex: kc,
  specularmap_fragment: Wc,
  specularmap_pars_fragment: Xc,
  tonemapping_fragment: qc,
  tonemapping_pars_fragment: Yc,
  transmission_fragment: Kc,
  transmission_pars_fragment: Zc,
  uv_pars_fragment: $c,
  uv_pars_vertex: jc,
  uv_vertex: Jc,
  worldpos_vertex: Qc,
  background_vert: eh,
  background_frag: th,
  backgroundCube_vert: nh,
  backgroundCube_frag: ih,
  cube_vert: rh,
  cube_frag: sh,
  depth_vert: ah,
  depth_frag: oh,
  distanceRGBA_vert: lh,
  distanceRGBA_frag: ch,
  equirect_vert: hh,
  equirect_frag: uh,
  linedashed_vert: dh,
  linedashed_frag: fh,
  meshbasic_vert: ph,
  meshbasic_frag: mh,
  meshlambert_vert: gh,
  meshlambert_frag: _h,
  meshmatcap_vert: vh,
  meshmatcap_frag: xh,
  meshnormal_vert: Mh,
  meshnormal_frag: Sh,
  meshphong_vert: yh,
  meshphong_frag: Eh,
  meshphysical_vert: Th,
  meshphysical_frag: Ah,
  meshtoon_vert: bh,
  meshtoon_frag: wh,
  points_vert: Rh,
  points_frag: Ch,
  shadow_vert: Ph,
  shadow_frag: Dh,
  sprite_vert: Lh,
  sprite_frag: Uh
}, re = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Se(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new Ne() },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Ne() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Ne() },
    normalScale: { value: /* @__PURE__ */ new we(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Ne() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Ne() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Se(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Se(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Ne() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Se(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new we(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Ne() },
    alphaTest: { value: 0 }
  }
}, Xt = {
  basic: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.specularmap,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.fog
    ]),
    vertexShader: Be.meshbasic_vert,
    fragmentShader: Be.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.specularmap,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) }
      }
    ]),
    vertexShader: Be.meshlambert_vert,
    fragmentShader: Be.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.specularmap,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) },
        specular: { value: /* @__PURE__ */ new Se(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: Be.meshphong_vert,
    fragmentShader: Be.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.envmap,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.roughnessmap,
      re.metalnessmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Be.meshphysical_vert,
    fragmentShader: Be.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.aomap,
      re.lightmap,
      re.emissivemap,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.gradientmap,
      re.fog,
      re.lights,
      {
        emissive: { value: /* @__PURE__ */ new Se(0) }
      }
    ]),
    vertexShader: Be.meshtoon_vert,
    fragmentShader: Be.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      re.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: Be.meshmatcap_vert,
    fragmentShader: Be.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ At([
      re.points,
      re.fog
    ]),
    vertexShader: Be.points_vert,
    fragmentShader: Be.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Be.linedashed_vert,
    fragmentShader: Be.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.displacementmap
    ]),
    vertexShader: Be.depth_vert,
    fragmentShader: Be.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.bumpmap,
      re.normalmap,
      re.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Be.meshnormal_vert,
    fragmentShader: Be.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ At([
      re.sprite,
      re.fog
    ]),
    vertexShader: Be.sprite_vert,
    fragmentShader: Be.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Ne() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Be.background_vert,
    fragmentShader: Be.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new Ne() }
    },
    vertexShader: Be.backgroundCube_vert,
    fragmentShader: Be.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Be.cube_vert,
    fragmentShader: Be.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: Be.equirect_vert,
    fragmentShader: Be.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ At([
      re.common,
      re.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new P() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Be.distanceRGBA_vert,
    fragmentShader: Be.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ At([
      re.lights,
      re.fog,
      {
        color: { value: /* @__PURE__ */ new Se(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Be.shadow_vert,
    fragmentShader: Be.shadow_frag
  }
};
Xt.physical = {
  uniforms: /* @__PURE__ */ At([
    Xt.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new Ne() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Ne() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new we(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Ne() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new Ne() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Ne() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Se(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new Ne() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Ne() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new Ne() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new we() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new Ne() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Se(0) },
      specularColor: { value: /* @__PURE__ */ new Se(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new Ne() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new Ne() },
      anisotropyVector: { value: /* @__PURE__ */ new we() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new Ne() }
    }
  ]),
  vertexShader: Be.meshphysical_vert,
  fragmentShader: Be.meshphysical_frag
};
const Ki = { r: 0, b: 0, g: 0 }, xn = /* @__PURE__ */ new qt(), Ih = /* @__PURE__ */ new Qe();
function Fh(i, e, t, n, r, s, a) {
  const o = new Se(0);
  let c = s === !0 ? 0 : 1, l, h, f = null, d = 0, p = null;
  function g(E) {
    let M = E.isScene === !0 ? E.background : null;
    return M && M.isTexture && (M = (E.backgroundBlurriness > 0 ? t : e).get(M)), M;
  }
  function _(E) {
    let M = !1;
    const C = g(E);
    C === null ? u(o, c) : C && C.isColor && (u(C, 1), M = !0);
    const R = i.xr.getEnvironmentBlendMode();
    R === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : R === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (i.autoClear || M) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function m(E, M) {
    const C = g(M);
    C && (C.isCubeTexture || C.mapping === 306) ? (h === void 0 && (h = new wt(
      new Si(1, 1, 1),
      new gt({
        name: "BackgroundCubeMaterial",
        uniforms: Qn(Xt.backgroundCube.uniforms),
        vertexShader: Xt.backgroundCube.vertexShader,
        fragmentShader: Xt.backgroundCube.fragmentShader,
        side: 1,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        allowOverride: !1
      })
    ), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(R, L, F) {
      this.matrixWorld.copyPosition(F.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), r.update(h)), xn.copy(M.backgroundRotation), xn.x *= -1, xn.y *= -1, xn.z *= -1, C.isCubeTexture && C.isRenderTargetTexture === !1 && (xn.y *= -1, xn.z *= -1), h.material.uniforms.envMap.value = C, h.material.uniforms.flipEnvMap.value = C.isCubeTexture && C.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = M.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = M.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ih.makeRotationFromEuler(xn)), h.material.toneMapped = We.getTransfer(C.colorSpace) !== Ke, (f !== C || d !== C.version || p !== i.toneMapping) && (h.material.needsUpdate = !0, f = C, d = C.version, p = i.toneMapping), h.layers.enableAll(), E.unshift(h, h.geometry, h.material, 0, 0, null)) : C && C.isTexture && (l === void 0 && (l = new wt(
      new lr(2, 2),
      new gt({
        name: "BackgroundMaterial",
        uniforms: Qn(Xt.background.uniforms),
        vertexShader: Xt.background.vertexShader,
        fragmentShader: Xt.background.fragmentShader,
        side: 0,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        allowOverride: !1
      })
    ), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), r.update(l)), l.material.uniforms.t2D.value = C, l.material.uniforms.backgroundIntensity.value = M.backgroundIntensity, l.material.toneMapped = We.getTransfer(C.colorSpace) !== Ke, C.matrixAutoUpdate === !0 && C.updateMatrix(), l.material.uniforms.uvTransform.value.copy(C.matrix), (f !== C || d !== C.version || p !== i.toneMapping) && (l.material.needsUpdate = !0, f = C, d = C.version, p = i.toneMapping), l.layers.enableAll(), E.unshift(l, l.geometry, l.material, 0, 0, null));
  }
  function u(E, M) {
    E.getRGB(Ki, Aa(i)), n.buffers.color.setClear(Ki.r, Ki.g, Ki.b, M, a);
  }
  function A() {
    h !== void 0 && (h.geometry.dispose(), h.material.dispose(), h = void 0), l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0);
  }
  return {
    getClearColor: function() {
      return o;
    },
    setClearColor: function(E, M = 1) {
      o.set(E), c = M, u(o, c);
    },
    getClearAlpha: function() {
      return c;
    },
    setClearAlpha: function(E) {
      c = E, u(o, c);
    },
    render: _,
    addToRenderList: m,
    dispose: A
  };
}
function Nh(i, e) {
  const t = i.getParameter(i.MAX_VERTEX_ATTRIBS), n = {}, r = d(null);
  let s = r, a = !1;
  function o(S, b, q, V, H) {
    let Z = !1;
    const X = f(V, q, b);
    s !== X && (s = X, l(s.object)), Z = p(S, V, q, H), Z && g(S, V, q, H), H !== null && e.update(H, i.ELEMENT_ARRAY_BUFFER), (Z || a) && (a = !1, M(S, b, q, V), H !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, e.get(H).buffer));
  }
  function c() {
    return i.createVertexArray();
  }
  function l(S) {
    return i.bindVertexArray(S);
  }
  function h(S) {
    return i.deleteVertexArray(S);
  }
  function f(S, b, q) {
    const V = q.wireframe === !0;
    let H = n[S.id];
    H === void 0 && (H = {}, n[S.id] = H);
    let Z = H[b.id];
    Z === void 0 && (Z = {}, H[b.id] = Z);
    let X = Z[V];
    return X === void 0 && (X = d(c()), Z[V] = X), X;
  }
  function d(S) {
    const b = [], q = [], V = [];
    for (let H = 0; H < t; H++)
      b[H] = 0, q[H] = 0, V[H] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: b,
      enabledAttributes: q,
      attributeDivisors: V,
      object: S,
      attributes: {},
      index: null
    };
  }
  function p(S, b, q, V) {
    const H = s.attributes, Z = b.attributes;
    let X = 0;
    const ee = q.getAttributes();
    for (const z in ee)
      if (ee[z].location >= 0) {
        const he = H[z];
        let Ee = Z[z];
        if (Ee === void 0 && (z === "instanceMatrix" && S.instanceMatrix && (Ee = S.instanceMatrix), z === "instanceColor" && S.instanceColor && (Ee = S.instanceColor)), he === void 0 || he.attribute !== Ee || Ee && he.data !== Ee.data) return !0;
        X++;
      }
    return s.attributesNum !== X || s.index !== V;
  }
  function g(S, b, q, V) {
    const H = {}, Z = b.attributes;
    let X = 0;
    const ee = q.getAttributes();
    for (const z in ee)
      if (ee[z].location >= 0) {
        let he = Z[z];
        he === void 0 && (z === "instanceMatrix" && S.instanceMatrix && (he = S.instanceMatrix), z === "instanceColor" && S.instanceColor && (he = S.instanceColor));
        const Ee = {};
        Ee.attribute = he, he && he.data && (Ee.data = he.data), H[z] = Ee, X++;
      }
    s.attributes = H, s.attributesNum = X, s.index = V;
  }
  function _() {
    const S = s.newAttributes;
    for (let b = 0, q = S.length; b < q; b++)
      S[b] = 0;
  }
  function m(S) {
    u(S, 0);
  }
  function u(S, b) {
    const q = s.newAttributes, V = s.enabledAttributes, H = s.attributeDivisors;
    q[S] = 1, V[S] === 0 && (i.enableVertexAttribArray(S), V[S] = 1), H[S] !== b && (i.vertexAttribDivisor(S, b), H[S] = b);
  }
  function A() {
    const S = s.newAttributes, b = s.enabledAttributes;
    for (let q = 0, V = b.length; q < V; q++)
      b[q] !== S[q] && (i.disableVertexAttribArray(q), b[q] = 0);
  }
  function E(S, b, q, V, H, Z, X) {
    X === !0 ? i.vertexAttribIPointer(S, b, q, H, Z) : i.vertexAttribPointer(S, b, q, V, H, Z);
  }
  function M(S, b, q, V) {
    _();
    const H = V.attributes, Z = q.getAttributes(), X = b.defaultAttributeValues;
    for (const ee in Z) {
      const z = Z[ee];
      if (z.location >= 0) {
        let se = H[ee];
        if (se === void 0 && (ee === "instanceMatrix" && S.instanceMatrix && (se = S.instanceMatrix), ee === "instanceColor" && S.instanceColor && (se = S.instanceColor)), se !== void 0) {
          const he = se.normalized, Ee = se.itemSize, Oe = e.get(se);
          if (Oe === void 0) continue;
          const it = Oe.buffer, je = Oe.type, W = Oe.bytesPerElement, ae = je === i.INT || je === i.UNSIGNED_INT || se.gpuType === 1013;
          if (se.isInterleavedBufferAttribute) {
            const ne = se.data, Re = ne.stride, Ce = se.offset;
            if (ne.isInstancedInterleavedBuffer) {
              for (let Ue = 0; Ue < z.locationSize; Ue++)
                u(z.location + Ue, ne.meshPerAttribute);
              S.isInstancedMesh !== !0 && V._maxInstanceCount === void 0 && (V._maxInstanceCount = ne.meshPerAttribute * ne.count);
            } else
              for (let Ue = 0; Ue < z.locationSize; Ue++)
                m(z.location + Ue);
            i.bindBuffer(i.ARRAY_BUFFER, it);
            for (let Ue = 0; Ue < z.locationSize; Ue++)
              E(
                z.location + Ue,
                Ee / z.locationSize,
                je,
                he,
                Re * W,
                (Ce + Ee / z.locationSize * Ue) * W,
                ae
              );
          } else {
            if (se.isInstancedBufferAttribute) {
              for (let ne = 0; ne < z.locationSize; ne++)
                u(z.location + ne, se.meshPerAttribute);
              S.isInstancedMesh !== !0 && V._maxInstanceCount === void 0 && (V._maxInstanceCount = se.meshPerAttribute * se.count);
            } else
              for (let ne = 0; ne < z.locationSize; ne++)
                m(z.location + ne);
            i.bindBuffer(i.ARRAY_BUFFER, it);
            for (let ne = 0; ne < z.locationSize; ne++)
              E(
                z.location + ne,
                Ee / z.locationSize,
                je,
                he,
                Ee * W,
                Ee / z.locationSize * ne * W,
                ae
              );
          }
        } else if (X !== void 0) {
          const he = X[ee];
          if (he !== void 0)
            switch (he.length) {
              case 2:
                i.vertexAttrib2fv(z.location, he);
                break;
              case 3:
                i.vertexAttrib3fv(z.location, he);
                break;
              case 4:
                i.vertexAttrib4fv(z.location, he);
                break;
              default:
                i.vertexAttrib1fv(z.location, he);
            }
        }
      }
    }
    A();
  }
  function C() {
    F();
    for (const S in n) {
      const b = n[S];
      for (const q in b) {
        const V = b[q];
        for (const H in V)
          h(V[H].object), delete V[H];
        delete b[q];
      }
      delete n[S];
    }
  }
  function R(S) {
    if (n[S.id] === void 0) return;
    const b = n[S.id];
    for (const q in b) {
      const V = b[q];
      for (const H in V)
        h(V[H].object), delete V[H];
      delete b[q];
    }
    delete n[S.id];
  }
  function L(S) {
    for (const b in n) {
      const q = n[b];
      if (q[S.id] === void 0) continue;
      const V = q[S.id];
      for (const H in V)
        h(V[H].object), delete V[H];
      delete q[S.id];
    }
  }
  function F() {
    y(), a = !0, s !== r && (s = r, l(s.object));
  }
  function y() {
    r.geometry = null, r.program = null, r.wireframe = !1;
  }
  return {
    setup: o,
    reset: F,
    resetDefaultState: y,
    dispose: C,
    releaseStatesOfGeometry: R,
    releaseStatesOfProgram: L,
    initAttributes: _,
    enableAttribute: m,
    disableUnusedAttributes: A
  };
}
function Bh(i, e, t) {
  let n;
  function r(l) {
    n = l;
  }
  function s(l, h) {
    i.drawArrays(n, l, h), t.update(h, n, 1);
  }
  function a(l, h, f) {
    f !== 0 && (i.drawArraysInstanced(n, l, h, f), t.update(h, n, f));
  }
  function o(l, h, f) {
    if (f === 0) return;
    e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, l, 0, h, 0, f);
    let p = 0;
    for (let g = 0; g < f; g++)
      p += h[g];
    t.update(p, n, 1);
  }
  function c(l, h, f, d) {
    if (f === 0) return;
    const p = e.get("WEBGL_multi_draw");
    if (p === null)
      for (let g = 0; g < l.length; g++)
        a(l[g], h[g], d[g]);
    else {
      p.multiDrawArraysInstancedWEBGL(n, l, 0, h, 0, d, 0, f);
      let g = 0;
      for (let _ = 0; _ < f; _++)
        g += h[_] * d[_];
      t.update(g, n, 1);
    }
  }
  this.setMode = r, this.render = s, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = c;
}
function Oh(i, e, t, n) {
  let r;
  function s() {
    if (r !== void 0) return r;
    if (e.has("EXT_texture_filter_anisotropic") === !0) {
      const L = e.get("EXT_texture_filter_anisotropic");
      r = i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      r = 0;
    return r;
  }
  function a(L) {
    return !(L !== 1023 && n.convert(L) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(L) {
    const F = L === 1016 && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(L !== 1009 && n.convert(L) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    L !== 1015 && !F);
  }
  function c(L) {
    if (L === "highp") {
      if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0)
        return "highp";
      L = "mediump";
    }
    return L === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let l = t.precision !== void 0 ? t.precision : "highp";
  const h = c(l);
  h !== l && (console.warn("THREE.WebGLRenderer:", l, "not supported, using", h, "instead."), l = h);
  const f = t.logarithmicDepthBuffer === !0, d = t.reversedDepthBuffer === !0 && e.has("EXT_clip_control"), p = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _ = i.getParameter(i.MAX_TEXTURE_SIZE), m = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), u = i.getParameter(i.MAX_VERTEX_ATTRIBS), A = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), E = i.getParameter(i.MAX_VARYING_VECTORS), M = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), C = g > 0, R = i.getParameter(i.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: s,
    getMaxPrecision: c,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: l,
    logarithmicDepthBuffer: f,
    reversedDepthBuffer: d,
    maxTextures: p,
    maxVertexTextures: g,
    maxTextureSize: _,
    maxCubemapSize: m,
    maxAttributes: u,
    maxVertexUniforms: A,
    maxVaryings: E,
    maxFragmentUniforms: M,
    vertexTextures: C,
    maxSamples: R
  };
}
function zh(i) {
  const e = this;
  let t = null, n = 0, r = !1, s = !1;
  const a = new yn(), o = new Ne(), c = { value: null, needsUpdate: !1 };
  this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(f, d) {
    const p = f.length !== 0 || d || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    n !== 0 || r;
    return r = d, n = f.length, p;
  }, this.beginShadows = function() {
    s = !0, h(null);
  }, this.endShadows = function() {
    s = !1;
  }, this.setGlobalState = function(f, d) {
    t = h(f, d, 0);
  }, this.setState = function(f, d, p) {
    const g = f.clippingPlanes, _ = f.clipIntersection, m = f.clipShadows, u = i.get(f);
    if (!r || g === null || g.length === 0 || s && !m)
      s ? h(null) : l();
    else {
      const A = s ? 0 : n, E = A * 4;
      let M = u.clippingState || null;
      c.value = M, M = h(g, d, E, p);
      for (let C = 0; C !== E; ++C)
        M[C] = t[C];
      u.clippingState = M, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += A;
    }
  };
  function l() {
    c.value !== t && (c.value = t, c.needsUpdate = n > 0), e.numPlanes = n, e.numIntersection = 0;
  }
  function h(f, d, p, g) {
    const _ = f !== null ? f.length : 0;
    let m = null;
    if (_ !== 0) {
      if (m = c.value, g !== !0 || m === null) {
        const u = p + _ * 4, A = d.matrixWorldInverse;
        o.getNormalMatrix(A), (m === null || m.length < u) && (m = new Float32Array(u));
        for (let E = 0, M = p; E !== _; ++E, M += 4)
          a.copy(f[E]).applyMatrix4(A, o), a.normal.toArray(m, M), m[M + 3] = a.constant;
      }
      c.value = m, c.needsUpdate = !0;
    }
    return e.numPlanes = _, e.numIntersection = 0, m;
  }
}
function Gh(i) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(a, o) {
    return o === 303 ? a.mapping = 301 : o === 304 && (a.mapping = 302), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === 303 || o === 304)
        if (e.has(a)) {
          const c = e.get(a).texture;
          return t(c, a.mapping);
        } else {
          const c = a.image;
          if (c && c.height > 0) {
            const l = new Fo(c.height);
            return l.fromEquirectangularTexture(i, a), e.set(a, l), a.addEventListener("dispose", r), t(l.texture, a.mapping);
          } else
            return null;
        }
    }
    return a;
  }
  function r(a) {
    const o = a.target;
    o.removeEventListener("dispose", r);
    const c = e.get(o);
    c !== void 0 && (e.delete(o), c.dispose());
  }
  function s() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: s
  };
}
const Kn = 4, Vs = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], bn = 20, Or = /* @__PURE__ */ new Qr(), Hs = /* @__PURE__ */ new Se();
let zr = null, Gr = 0, Vr = 0, Hr = !1;
const En = (1 + Math.sqrt(5)) / 2, Xn = 1 / En, ks = [
  /* @__PURE__ */ new P(-En, Xn, 0),
  /* @__PURE__ */ new P(En, Xn, 0),
  /* @__PURE__ */ new P(-Xn, 0, En),
  /* @__PURE__ */ new P(Xn, 0, En),
  /* @__PURE__ */ new P(0, En, -Xn),
  /* @__PURE__ */ new P(0, En, Xn),
  /* @__PURE__ */ new P(-1, 1, -1),
  /* @__PURE__ */ new P(1, 1, -1),
  /* @__PURE__ */ new P(-1, 1, 1),
  /* @__PURE__ */ new P(1, 1, 1)
], Vh = /* @__PURE__ */ new P();
class Ws {
  /**
   * Constructs a new PMREM generator.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   */
  constructor(e) {
    this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety.
   *
   * @param {Scene} scene - The scene to be captured.
   * @param {number} [sigma=0] - The blur radius in radians.
   * @param {number} [near=0.1] - The near plane distance.
   * @param {number} [far=100] - The far plane distance.
   * @param {Object} [options={}] - The configuration options.
   * @param {number} [options.size=256] - The texture size of the PMREM.
   * @param {Vector3} [options.renderTarget=origin] - The position of the internal cube camera that renders the scene.
   * @return {WebGLRenderTarget} The resulting PMREM.
   */
  fromScene(e, t = 0, n = 0.1, r = 100, s = {}) {
    const {
      size: a = 256,
      position: o = Vh
    } = s;
    zr = this._renderer.getRenderTarget(), Gr = this._renderer.getActiveCubeFace(), Vr = this._renderer.getActiveMipmapLevel(), Hr = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(a);
    const c = this._allocateTargets();
    return c.depthBuffer = !0, this._sceneToCubeUV(e, n, r, c, o), t > 0 && this._blur(c, 0, 0, t), this._applyPMREM(c), this._cleanup(c), c;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   *
   * @param {Texture} equirectangular - The equirectangular texture to be converted.
   * @param {?WebGLRenderTarget} [renderTarget=null] - The render target to use.
   * @return {WebGLRenderTarget} The resulting PMREM.
   */
  fromEquirectangular(e, t = null) {
    return this._fromTexture(e, t);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   *
   * @param {Texture} cubemap - The cubemap texture to be converted.
   * @param {?WebGLRenderTarget} [renderTarget=null] - The render target to use.
   * @return {WebGLRenderTarget} The resulting PMREM.
   */
  fromCubemap(e, t = null) {
    return this._fromTexture(e, t);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = Ys(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = qs(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(e) {
    this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let e = 0; e < this._lodPlanes.length; e++)
      this._lodPlanes[e].dispose();
  }
  _cleanup(e) {
    this._renderer.setRenderTarget(zr, Gr, Vr), this._renderer.xr.enabled = Hr, e.scissorTest = !1, Zi(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e, t) {
    e.mapping === 301 || e.mapping === 302 ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), zr = this._renderer.getRenderTarget(), Gr = this._renderer.getActiveCubeFace(), Vr = this._renderer.getActiveMipmapLevel(), Hr = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const n = t || this._allocateTargets();
    return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
      magFilter: 1006,
      minFilter: 1006,
      generateMipmaps: !1,
      type: 1016,
      format: 1023,
      colorSpace: Jn,
      depthBuffer: !1
    }, r = Xs(e, t, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Xs(e, t, n);
      const { _lodMax: s } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Hh(s)), this._blurMaterial = kh(s, e, t);
    }
    return r;
  }
  _compileMaterial(e) {
    const t = new wt(this._lodPlanes[0], e);
    this._renderer.compile(t, Or);
  }
  _sceneToCubeUV(e, t, n, r, s) {
    const c = new Bt(90, 1, t, n), l = [1, -1, 1, 1, 1, 1], h = [1, 1, 1, -1, -1, -1], f = this._renderer, d = f.autoClear, p = f.toneMapping;
    f.getClearColor(Hs), f.toneMapping = 0, f.autoClear = !1, f.state.buffers.depth.getReversed() && (f.setRenderTarget(r), f.clearDepth(), f.setRenderTarget(null));
    const _ = new jn({
      name: "PMREM.Background",
      side: 1,
      depthWrite: !1,
      depthTest: !1
    }), m = new wt(new Si(), _);
    let u = !1;
    const A = e.background;
    A ? A.isColor && (_.color.copy(A), e.background = null, u = !0) : (_.color.copy(Hs), u = !0);
    for (let E = 0; E < 6; E++) {
      const M = E % 3;
      M === 0 ? (c.up.set(0, l[E], 0), c.position.set(s.x, s.y, s.z), c.lookAt(s.x + h[E], s.y, s.z)) : M === 1 ? (c.up.set(0, 0, l[E]), c.position.set(s.x, s.y, s.z), c.lookAt(s.x, s.y + h[E], s.z)) : (c.up.set(0, l[E], 0), c.position.set(s.x, s.y, s.z), c.lookAt(s.x, s.y, s.z + h[E]));
      const C = this._cubeSize;
      Zi(r, M * C, E > 2 ? C : 0, C, C), f.setRenderTarget(r), u && f.render(m, c), f.render(e, c);
    }
    m.geometry.dispose(), m.material.dispose(), f.toneMapping = p, f.autoClear = d, e.background = A;
  }
  _textureToCubeUV(e, t) {
    const n = this._renderer, r = e.mapping === 301 || e.mapping === 302;
    r ? (this._cubemapMaterial === null && (this._cubemapMaterial = Ys()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = qs());
    const s = r ? this._cubemapMaterial : this._equirectMaterial, a = new wt(this._lodPlanes[0], s), o = s.uniforms;
    o.envMap.value = e;
    const c = this._cubeSize;
    Zi(t, 0, 0, 3 * c, 2 * c), n.setRenderTarget(t), n.render(a, Or);
  }
  _applyPMREM(e) {
    const t = this._renderer, n = t.autoClear;
    t.autoClear = !1;
    const r = this._lodPlanes.length;
    for (let s = 1; s < r; s++) {
      const a = Math.sqrt(this._sigmas[s] * this._sigmas[s] - this._sigmas[s - 1] * this._sigmas[s - 1]), o = ks[(r - s - 1) % ks.length];
      this._blur(e, s - 1, s, a, o);
    }
    t.autoClear = n;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   *
   * @private
   * @param {WebGLRenderTarget} cubeUVRenderTarget
   * @param {number} lodIn
   * @param {number} lodOut
   * @param {number} sigma
   * @param {Vector3} [poleAxis]
   */
  _blur(e, t, n, r, s) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(
      e,
      a,
      t,
      n,
      r,
      "latitudinal",
      s
    ), this._halfBlur(
      a,
      e,
      n,
      n,
      r,
      "longitudinal",
      s
    );
  }
  _halfBlur(e, t, n, r, s, a, o) {
    const c = this._renderer, l = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const h = 3, f = new wt(this._lodPlanes[r], l), d = l.uniforms, p = this._sizeLods[n] - 1, g = isFinite(s) ? Math.PI / (2 * p) : 2 * Math.PI / (2 * bn - 1), _ = s / g, m = isFinite(s) ? 1 + Math.floor(h * _) : bn;
    m > bn && console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${bn}`);
    const u = [];
    let A = 0;
    for (let L = 0; L < bn; ++L) {
      const F = L / _, y = Math.exp(-F * F / 2);
      u.push(y), L === 0 ? A += y : L < m && (A += 2 * y);
    }
    for (let L = 0; L < u.length; L++)
      u[L] = u[L] / A;
    d.envMap.value = e.texture, d.samples.value = m, d.weights.value = u, d.latitudinal.value = a === "latitudinal", o && (d.poleAxis.value = o);
    const { _lodMax: E } = this;
    d.dTheta.value = g, d.mipInt.value = E - n;
    const M = this._sizeLods[r], C = 3 * M * (r > E - Kn ? r - E + Kn : 0), R = 4 * (this._cubeSize - M);
    Zi(t, C, R, 3 * M, 2 * M), c.setRenderTarget(t), c.render(f, Or);
  }
}
function Hh(i) {
  const e = [], t = [], n = [];
  let r = i;
  const s = i - Kn + 1 + Vs.length;
  for (let a = 0; a < s; a++) {
    const o = Math.pow(2, r);
    t.push(o);
    let c = 1 / o;
    a > i - Kn ? c = Vs[a - i + Kn - 1] : a === 0 && (c = 0), n.push(c);
    const l = 1 / (o - 2), h = -l, f = 1 + l, d = [h, h, f, h, f, f, h, h, f, f, h, f], p = 6, g = 6, _ = 3, m = 2, u = 1, A = new Float32Array(_ * g * p), E = new Float32Array(m * g * p), M = new Float32Array(u * g * p);
    for (let R = 0; R < p; R++) {
      const L = R % 3 * 2 / 3 - 1, F = R > 2 ? 0 : -1, y = [
        L,
        F,
        0,
        L + 2 / 3,
        F,
        0,
        L + 2 / 3,
        F + 1,
        0,
        L,
        F,
        0,
        L + 2 / 3,
        F + 1,
        0,
        L,
        F + 1,
        0
      ];
      A.set(y, _ * g * R), E.set(d, m * g * R);
      const S = [R, R, R, R, R, R];
      M.set(S, u * g * R);
    }
    const C = new st();
    C.setAttribute("position", new Ve(A, _)), C.setAttribute("uv", new Ve(E, m)), C.setAttribute("faceIndex", new Ve(M, u)), e.push(C), r > Kn && r--;
  }
  return { lodPlanes: e, sizeLods: t, sigmas: n };
}
function Xs(i, e, t) {
  const n = new kt(i, e, t);
  return n.texture.mapping = 306, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function Zi(i, e, t, n, r) {
  i.viewport.set(e, t, n, r), i.scissor.set(e, t, n, r);
}
function kh(i, e, t) {
  const n = new Float32Array(bn), r = new P(0, 1, 0);
  return new gt({
    name: "SphericalGaussianBlur",
    defines: {
      n: bn,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / t,
      CUBEUV_MAX_MIP: `${i}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: r }
    },
    vertexShader: es(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function qs() {
  return new gt({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: es(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function Ys() {
  return new gt({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: es(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: 0,
    depthTest: !1,
    depthWrite: !1
  });
}
function es() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function Wh(i) {
  let e = /* @__PURE__ */ new WeakMap(), t = null;
  function n(o) {
    if (o && o.isTexture) {
      const c = o.mapping, l = c === 303 || c === 304, h = c === 301 || c === 302;
      if (l || h) {
        let f = e.get(o);
        const d = f !== void 0 ? f.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== d)
          return t === null && (t = new Ws(i)), f = l ? t.fromEquirectangular(o, f) : t.fromCubemap(o, f), f.texture.pmremVersion = o.pmremVersion, e.set(o, f), f.texture;
        if (f !== void 0)
          return f.texture;
        {
          const p = o.image;
          return l && p && p.height > 0 || h && p && r(p) ? (t === null && (t = new Ws(i)), f = l ? t.fromEquirectangular(o) : t.fromCubemap(o), f.texture.pmremVersion = o.pmremVersion, e.set(o, f), o.addEventListener("dispose", s), f.texture) : null;
        }
      }
    }
    return o;
  }
  function r(o) {
    let c = 0;
    const l = 6;
    for (let h = 0; h < l; h++)
      o[h] !== void 0 && c++;
    return c === l;
  }
  function s(o) {
    const c = o.target;
    c.removeEventListener("dispose", s);
    const l = e.get(c);
    l !== void 0 && (e.delete(c), l.dispose());
  }
  function a() {
    e = /* @__PURE__ */ new WeakMap(), t !== null && (t.dispose(), t = null);
  }
  return {
    get: n,
    dispose: a
  };
}
function Xh(i) {
  const e = {};
  function t(n) {
    if (e[n] !== void 0)
      return e[n];
    let r;
    switch (n) {
      case "WEBGL_depth_texture":
        r = i.getExtension("WEBGL_depth_texture") || i.getExtension("MOZ_WEBGL_depth_texture") || i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        r = i.getExtension("EXT_texture_filter_anisotropic") || i.getExtension("MOZ_EXT_texture_filter_anisotropic") || i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        r = i.getExtension("WEBGL_compressed_texture_s3tc") || i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        r = i.getExtension("WEBGL_compressed_texture_pvrtc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        r = i.getExtension(n);
    }
    return e[n] = r, r;
  }
  return {
    has: function(n) {
      return t(n) !== null;
    },
    init: function() {
      t("EXT_color_buffer_float"), t("WEBGL_clip_cull_distance"), t("OES_texture_float_linear"), t("EXT_color_buffer_half_float"), t("WEBGL_multisampled_render_to_texture"), t("WEBGL_render_shared_exponent");
    },
    get: function(n) {
      const r = t(n);
      return r === null && Zn("THREE.WebGLRenderer: " + n + " extension not supported."), r;
    }
  };
}
function qh(i, e, t, n) {
  const r = {}, s = /* @__PURE__ */ new WeakMap();
  function a(f) {
    const d = f.target;
    d.index !== null && e.remove(d.index);
    for (const g in d.attributes)
      e.remove(d.attributes[g]);
    d.removeEventListener("dispose", a), delete r[d.id];
    const p = s.get(d);
    p && (e.remove(p), s.delete(d)), n.releaseStatesOfGeometry(d), d.isInstancedBufferGeometry === !0 && delete d._maxInstanceCount, t.memory.geometries--;
  }
  function o(f, d) {
    return r[d.id] === !0 || (d.addEventListener("dispose", a), r[d.id] = !0, t.memory.geometries++), d;
  }
  function c(f) {
    const d = f.attributes;
    for (const p in d)
      e.update(d[p], i.ARRAY_BUFFER);
  }
  function l(f) {
    const d = [], p = f.index, g = f.attributes.position;
    let _ = 0;
    if (p !== null) {
      const A = p.array;
      _ = p.version;
      for (let E = 0, M = A.length; E < M; E += 3) {
        const C = A[E + 0], R = A[E + 1], L = A[E + 2];
        d.push(C, R, R, L, L, C);
      }
    } else if (g !== void 0) {
      const A = g.array;
      _ = g.version;
      for (let E = 0, M = A.length / 3 - 1; E < M; E += 3) {
        const C = E + 0, R = E + 1, L = E + 2;
        d.push(C, R, R, L, L, C);
      }
    } else
      return;
    const m = new (Ma(d) ? Ta : Ea)(d, 1);
    m.version = _;
    const u = s.get(f);
    u && e.remove(u), s.set(f, m);
  }
  function h(f) {
    const d = s.get(f);
    if (d) {
      const p = f.index;
      p !== null && d.version < p.version && l(f);
    } else
      l(f);
    return s.get(f);
  }
  return {
    get: o,
    update: c,
    getWireframeAttribute: h
  };
}
function Yh(i, e, t) {
  let n;
  function r(d) {
    n = d;
  }
  let s, a;
  function o(d) {
    s = d.type, a = d.bytesPerElement;
  }
  function c(d, p) {
    i.drawElements(n, p, s, d * a), t.update(p, n, 1);
  }
  function l(d, p, g) {
    g !== 0 && (i.drawElementsInstanced(n, p, s, d * a, g), t.update(p, n, g));
  }
  function h(d, p, g) {
    if (g === 0) return;
    e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, p, 0, s, d, 0, g);
    let m = 0;
    for (let u = 0; u < g; u++)
      m += p[u];
    t.update(m, n, 1);
  }
  function f(d, p, g, _) {
    if (g === 0) return;
    const m = e.get("WEBGL_multi_draw");
    if (m === null)
      for (let u = 0; u < d.length; u++)
        l(d[u] / a, p[u], _[u]);
    else {
      m.multiDrawElementsInstancedWEBGL(n, p, 0, s, d, 0, _, 0, g);
      let u = 0;
      for (let A = 0; A < g; A++)
        u += p[A] * _[A];
      t.update(u, n, 1);
    }
  }
  this.setMode = r, this.setIndex = o, this.render = c, this.renderInstances = l, this.renderMultiDraw = h, this.renderMultiDrawInstances = f;
}
function Kh(i) {
  const e = {
    geometries: 0,
    textures: 0
  }, t = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(s, a, o) {
    switch (t.calls++, a) {
      case i.TRIANGLES:
        t.triangles += o * (s / 3);
        break;
      case i.LINES:
        t.lines += o * (s / 2);
        break;
      case i.LINE_STRIP:
        t.lines += o * (s - 1);
        break;
      case i.LINE_LOOP:
        t.lines += o * s;
        break;
      case i.POINTS:
        t.points += o * s;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function r() {
    t.calls = 0, t.triangles = 0, t.points = 0, t.lines = 0;
  }
  return {
    memory: e,
    render: t,
    programs: null,
    autoReset: !0,
    reset: r,
    update: n
  };
}
function Zh(i, e, t) {
  const n = /* @__PURE__ */ new WeakMap(), r = new ht();
  function s(a, o, c) {
    const l = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, f = h !== void 0 ? h.length : 0;
    let d = n.get(o);
    if (d === void 0 || d.count !== f) {
      let y = function() {
        L.dispose(), n.delete(o), o.removeEventListener("dispose", y);
      };
      d !== void 0 && d.texture.dispose();
      const p = o.morphAttributes.position !== void 0, g = o.morphAttributes.normal !== void 0, _ = o.morphAttributes.color !== void 0, m = o.morphAttributes.position || [], u = o.morphAttributes.normal || [], A = o.morphAttributes.color || [];
      let E = 0;
      p === !0 && (E = 1), g === !0 && (E = 2), _ === !0 && (E = 3);
      let M = o.attributes.position.count * E, C = 1;
      M > e.maxTextureSize && (C = Math.ceil(M / e.maxTextureSize), M = e.maxTextureSize);
      const R = new Float32Array(M * C * 4 * f), L = new Sa(R, M, C, f);
      L.type = 1015, L.needsUpdate = !0;
      const F = E * 4;
      for (let S = 0; S < f; S++) {
        const b = m[S], q = u[S], V = A[S], H = M * C * 4 * S;
        for (let Z = 0; Z < b.count; Z++) {
          const X = Z * F;
          p === !0 && (r.fromBufferAttribute(b, Z), R[H + X + 0] = r.x, R[H + X + 1] = r.y, R[H + X + 2] = r.z, R[H + X + 3] = 0), g === !0 && (r.fromBufferAttribute(q, Z), R[H + X + 4] = r.x, R[H + X + 5] = r.y, R[H + X + 6] = r.z, R[H + X + 7] = 0), _ === !0 && (r.fromBufferAttribute(V, Z), R[H + X + 8] = r.x, R[H + X + 9] = r.y, R[H + X + 10] = r.z, R[H + X + 11] = V.itemSize === 4 ? r.w : 1);
        }
      }
      d = {
        count: f,
        texture: L,
        size: new we(M, C)
      }, n.set(o, d), o.addEventListener("dispose", y);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      c.getUniforms().setValue(i, "morphTexture", a.morphTexture, t);
    else {
      let p = 0;
      for (let _ = 0; _ < l.length; _++)
        p += l[_];
      const g = o.morphTargetsRelative ? 1 : 1 - p;
      c.getUniforms().setValue(i, "morphTargetBaseInfluence", g), c.getUniforms().setValue(i, "morphTargetInfluences", l);
    }
    c.getUniforms().setValue(i, "morphTargetsTexture", d.texture, t), c.getUniforms().setValue(i, "morphTargetsTextureSize", d.size);
  }
  return {
    update: s
  };
}
function $h(i, e, t, n) {
  let r = /* @__PURE__ */ new WeakMap();
  function s(c) {
    const l = n.render.frame, h = c.geometry, f = e.get(c, h);
    if (r.get(f) !== l && (e.update(f), r.set(f, l)), c.isInstancedMesh && (c.hasEventListener("dispose", o) === !1 && c.addEventListener("dispose", o), r.get(c) !== l && (t.update(c.instanceMatrix, i.ARRAY_BUFFER), c.instanceColor !== null && t.update(c.instanceColor, i.ARRAY_BUFFER), r.set(c, l))), c.isSkinnedMesh) {
      const d = c.skeleton;
      r.get(d) !== l && (d.update(), r.set(d, l));
    }
    return f;
  }
  function a() {
    r = /* @__PURE__ */ new WeakMap();
  }
  function o(c) {
    const l = c.target;
    l.removeEventListener("dispose", o), t.remove(l.instanceMatrix), l.instanceColor !== null && t.remove(l.instanceColor);
  }
  return {
    update: s,
    dispose: a
  };
}
const Fa = /* @__PURE__ */ new Rt(), Ks = /* @__PURE__ */ new Da(1, 1), Na = /* @__PURE__ */ new Sa(), Ba = /* @__PURE__ */ new xo(), Oa = /* @__PURE__ */ new wa(), Zs = [], $s = [], js = new Float32Array(16), Js = new Float32Array(9), Qs = new Float32Array(4);
function ni(i, e, t) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const r = e * t;
  let s = Zs[r];
  if (s === void 0 && (s = new Float32Array(r), Zs[r] = s), e !== 0) {
    n.toArray(s, 0);
    for (let a = 1, o = 0; a !== e; ++a)
      o += t, i[a].toArray(s, o);
  }
  return s;
}
function _t(i, e) {
  if (i.length !== e.length) return !1;
  for (let t = 0, n = i.length; t < n; t++)
    if (i[t] !== e[t]) return !1;
  return !0;
}
function vt(i, e) {
  for (let t = 0, n = e.length; t < n; t++)
    i[t] = e[t];
}
function cr(i, e) {
  let t = $s[e];
  t === void 0 && (t = new Int32Array(e), $s[e] = t);
  for (let n = 0; n !== e; ++n)
    t[n] = i.allocateTextureUnit();
  return t;
}
function jh(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1f(this.addr, e), t[0] = e);
}
function Jh(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (i.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (_t(t, e)) return;
    i.uniform2fv(this.addr, e), vt(t, e);
  }
}
function Qh(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else if (e.r !== void 0)
    (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) && (i.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
  else {
    if (_t(t, e)) return;
    i.uniform3fv(this.addr, e), vt(t, e);
  }
}
function eu(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (_t(t, e)) return;
    i.uniform4fv(this.addr, e), vt(t, e);
  }
}
function tu(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (_t(t, e)) return;
    i.uniformMatrix2fv(this.addr, !1, e), vt(t, e);
  } else {
    if (_t(t, n)) return;
    Qs.set(n), i.uniformMatrix2fv(this.addr, !1, Qs), vt(t, n);
  }
}
function nu(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (_t(t, e)) return;
    i.uniformMatrix3fv(this.addr, !1, e), vt(t, e);
  } else {
    if (_t(t, n)) return;
    Js.set(n), i.uniformMatrix3fv(this.addr, !1, Js), vt(t, n);
  }
}
function iu(i, e) {
  const t = this.cache, n = e.elements;
  if (n === void 0) {
    if (_t(t, e)) return;
    i.uniformMatrix4fv(this.addr, !1, e), vt(t, e);
  } else {
    if (_t(t, n)) return;
    js.set(n), i.uniformMatrix4fv(this.addr, !1, js), vt(t, n);
  }
}
function ru(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1i(this.addr, e), t[0] = e);
}
function su(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (i.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (_t(t, e)) return;
    i.uniform2iv(this.addr, e), vt(t, e);
  }
}
function au(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (_t(t, e)) return;
    i.uniform3iv(this.addr, e), vt(t, e);
  }
}
function ou(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (_t(t, e)) return;
    i.uniform4iv(this.addr, e), vt(t, e);
  }
}
function lu(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1ui(this.addr, e), t[0] = e);
}
function cu(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (i.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (_t(t, e)) return;
    i.uniform2uiv(this.addr, e), vt(t, e);
  }
}
function hu(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (i.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (_t(t, e)) return;
    i.uniform3uiv(this.addr, e), vt(t, e);
  }
}
function uu(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (i.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (_t(t, e)) return;
    i.uniform4uiv(this.addr, e), vt(t, e);
  }
}
function du(i, e, t) {
  const n = this.cache, r = t.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r);
  let s;
  this.type === i.SAMPLER_2D_SHADOW ? (Ks.compareFunction = 515, s = Ks) : s = Fa, t.setTexture2D(e || s, r);
}
function fu(i, e, t) {
  const n = this.cache, r = t.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), t.setTexture3D(e || Ba, r);
}
function pu(i, e, t) {
  const n = this.cache, r = t.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), t.setTextureCube(e || Oa, r);
}
function mu(i, e, t) {
  const n = this.cache, r = t.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), t.setTexture2DArray(e || Na, r);
}
function gu(i) {
  switch (i) {
    case 5126:
      return jh;
    // FLOAT
    case 35664:
      return Jh;
    // _VEC2
    case 35665:
      return Qh;
    // _VEC3
    case 35666:
      return eu;
    // _VEC4
    case 35674:
      return tu;
    // _MAT2
    case 35675:
      return nu;
    // _MAT3
    case 35676:
      return iu;
    // _MAT4
    case 5124:
    case 35670:
      return ru;
    // INT, BOOL
    case 35667:
    case 35671:
      return su;
    // _VEC2
    case 35668:
    case 35672:
      return au;
    // _VEC3
    case 35669:
    case 35673:
      return ou;
    // _VEC4
    case 5125:
      return lu;
    // UINT
    case 36294:
      return cu;
    // _VEC2
    case 36295:
      return hu;
    // _VEC3
    case 36296:
      return uu;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return du;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return fu;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return pu;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return mu;
  }
}
function _u(i, e) {
  i.uniform1fv(this.addr, e);
}
function vu(i, e) {
  const t = ni(e, this.size, 2);
  i.uniform2fv(this.addr, t);
}
function xu(i, e) {
  const t = ni(e, this.size, 3);
  i.uniform3fv(this.addr, t);
}
function Mu(i, e) {
  const t = ni(e, this.size, 4);
  i.uniform4fv(this.addr, t);
}
function Su(i, e) {
  const t = ni(e, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, t);
}
function yu(i, e) {
  const t = ni(e, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, t);
}
function Eu(i, e) {
  const t = ni(e, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, t);
}
function Tu(i, e) {
  i.uniform1iv(this.addr, e);
}
function Au(i, e) {
  i.uniform2iv(this.addr, e);
}
function bu(i, e) {
  i.uniform3iv(this.addr, e);
}
function wu(i, e) {
  i.uniform4iv(this.addr, e);
}
function Ru(i, e) {
  i.uniform1uiv(this.addr, e);
}
function Cu(i, e) {
  i.uniform2uiv(this.addr, e);
}
function Pu(i, e) {
  i.uniform3uiv(this.addr, e);
}
function Du(i, e) {
  i.uniform4uiv(this.addr, e);
}
function Lu(i, e, t) {
  const n = this.cache, r = e.length, s = cr(t, r);
  _t(n, s) || (i.uniform1iv(this.addr, s), vt(n, s));
  for (let a = 0; a !== r; ++a)
    t.setTexture2D(e[a] || Fa, s[a]);
}
function Uu(i, e, t) {
  const n = this.cache, r = e.length, s = cr(t, r);
  _t(n, s) || (i.uniform1iv(this.addr, s), vt(n, s));
  for (let a = 0; a !== r; ++a)
    t.setTexture3D(e[a] || Ba, s[a]);
}
function Iu(i, e, t) {
  const n = this.cache, r = e.length, s = cr(t, r);
  _t(n, s) || (i.uniform1iv(this.addr, s), vt(n, s));
  for (let a = 0; a !== r; ++a)
    t.setTextureCube(e[a] || Oa, s[a]);
}
function Fu(i, e, t) {
  const n = this.cache, r = e.length, s = cr(t, r);
  _t(n, s) || (i.uniform1iv(this.addr, s), vt(n, s));
  for (let a = 0; a !== r; ++a)
    t.setTexture2DArray(e[a] || Na, s[a]);
}
function Nu(i) {
  switch (i) {
    case 5126:
      return _u;
    // FLOAT
    case 35664:
      return vu;
    // _VEC2
    case 35665:
      return xu;
    // _VEC3
    case 35666:
      return Mu;
    // _VEC4
    case 35674:
      return Su;
    // _MAT2
    case 35675:
      return yu;
    // _MAT3
    case 35676:
      return Eu;
    // _MAT4
    case 5124:
    case 35670:
      return Tu;
    // INT, BOOL
    case 35667:
    case 35671:
      return Au;
    // _VEC2
    case 35668:
    case 35672:
      return bu;
    // _VEC3
    case 35669:
    case 35673:
      return wu;
    // _VEC4
    case 5125:
      return Ru;
    // UINT
    case 36294:
      return Cu;
    // _VEC2
    case 36295:
      return Pu;
    // _VEC3
    case 36296:
      return Du;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return Lu;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return Uu;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return Iu;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return Fu;
  }
}
class Bu {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = gu(t.type);
  }
}
class Ou {
  constructor(e, t, n) {
    this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = Nu(t.type);
  }
}
class zu {
  constructor(e) {
    this.id = e, this.seq = [], this.map = {};
  }
  setValue(e, t, n) {
    const r = this.seq;
    for (let s = 0, a = r.length; s !== a; ++s) {
      const o = r[s];
      o.setValue(e, t[o.id], n);
    }
  }
}
const kr = /(\w+)(\])?(\[|\.)?/g;
function ea(i, e) {
  i.seq.push(e), i.map[e.id] = e;
}
function Gu(i, e, t) {
  const n = i.name, r = n.length;
  for (kr.lastIndex = 0; ; ) {
    const s = kr.exec(n), a = kr.lastIndex;
    let o = s[1];
    const c = s[2] === "]", l = s[3];
    if (c && (o = o | 0), l === void 0 || l === "[" && a + 2 === r) {
      ea(t, l === void 0 ? new Bu(o, i, e) : new Ou(o, i, e));
      break;
    } else {
      let f = t.map[o];
      f === void 0 && (f = new zu(o), ea(t, f)), t = f;
    }
  }
}
class er {
  constructor(e, t) {
    this.seq = [], this.map = {};
    const n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let r = 0; r < n; ++r) {
      const s = e.getActiveUniform(t, r), a = e.getUniformLocation(t, s.name);
      Gu(s, a, this);
    }
  }
  setValue(e, t, n, r) {
    const s = this.map[t];
    s !== void 0 && s.setValue(e, n, r);
  }
  setOptional(e, t, n) {
    const r = t[n];
    r !== void 0 && this.setValue(e, n, r);
  }
  static upload(e, t, n, r) {
    for (let s = 0, a = t.length; s !== a; ++s) {
      const o = t[s], c = n[o.id];
      c.needsUpdate !== !1 && o.setValue(e, c.value, r);
    }
  }
  static seqWithValue(e, t) {
    const n = [];
    for (let r = 0, s = e.length; r !== s; ++r) {
      const a = e[r];
      a.id in t && n.push(a);
    }
    return n;
  }
}
function ta(i, e, t) {
  const n = i.createShader(e);
  return i.shaderSource(n, t), i.compileShader(n), n;
}
const Vu = 37297;
let Hu = 0;
function ku(i, e) {
  const t = i.split(`
`), n = [], r = Math.max(e - 6, 0), s = Math.min(e + 6, t.length);
  for (let a = r; a < s; a++) {
    const o = a + 1;
    n.push(`${o === e ? ">" : " "} ${o}: ${t[a]}`);
  }
  return n.join(`
`);
}
const na = /* @__PURE__ */ new Ne();
function Wu(i) {
  We._getMatrix(na, We.workingColorSpace, i);
  const e = `mat3( ${na.elements.map((t) => t.toFixed(4))} )`;
  switch (We.getTransfer(i)) {
    case nr:
      return [e, "LinearTransferOETF"];
    case Ke:
      return [e, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space: ", i), [e, "LinearTransferOETF"];
  }
}
function ia(i, e, t) {
  const n = i.getShaderParameter(e, i.COMPILE_STATUS), s = (i.getShaderInfoLog(e) || "").trim();
  if (n && s === "") return "";
  const a = /ERROR: 0:(\d+)/.exec(s);
  if (a) {
    const o = parseInt(a[1]);
    return t.toUpperCase() + `

` + s + `

` + ku(i.getShaderSource(e), o);
  } else
    return s;
}
function Xu(i, e) {
  const t = Wu(e);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
function qu(i, e) {
  let t;
  switch (e) {
    case 1:
      t = "Linear";
      break;
    case 2:
      t = "Reinhard";
      break;
    case 3:
      t = "Cineon";
      break;
    case 4:
      t = "ACESFilmic";
      break;
    case 6:
      t = "AgX";
      break;
    case 7:
      t = "Neutral";
      break;
    case 5:
      t = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), t = "Linear";
  }
  return "vec3 " + i + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
}
const $i = /* @__PURE__ */ new P();
function Yu() {
  We.getLuminanceCoefficients($i);
  const i = $i.x.toFixed(4), e = $i.y.toFixed(4), t = $i.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function Ku(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(pi).join(`
`);
}
function Zu(i) {
  const e = [];
  for (const t in i) {
    const n = i[t];
    n !== !1 && e.push("#define " + t + " " + n);
  }
  return e.join(`
`);
}
function $u(i, e) {
  const t = {}, n = i.getProgramParameter(e, i.ACTIVE_ATTRIBUTES);
  for (let r = 0; r < n; r++) {
    const s = i.getActiveAttrib(e, r), a = s.name;
    let o = 1;
    s.type === i.FLOAT_MAT2 && (o = 2), s.type === i.FLOAT_MAT3 && (o = 3), s.type === i.FLOAT_MAT4 && (o = 4), t[a] = {
      type: s.type,
      location: i.getAttribLocation(e, a),
      locationSize: o
    };
  }
  return t;
}
function pi(i) {
  return i !== "";
}
function ra(i, e) {
  const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function sa(i, e) {
  return i.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
}
const ju = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Yr(i) {
  return i.replace(ju, Qu);
}
const Ju = /* @__PURE__ */ new Map();
function Qu(i, e) {
  let t = Be[e];
  if (t === void 0) {
    const n = Ju.get(e);
    if (n !== void 0)
      t = Be[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, n);
    else
      throw new Error("Can not resolve #include <" + e + ">");
  }
  return Yr(t);
}
const ed = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function aa(i) {
  return i.replace(ed, td);
}
function td(i, e, t, n) {
  let r = "";
  for (let s = parseInt(e); s < parseInt(t); s++)
    r += n.replace(/\[\s*i\s*\]/g, "[ " + s + " ]").replace(/UNROLLED_LOOP_INDEX/g, s);
  return r;
}
function oa(i) {
  let e = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return i.precision === "highp" ? e += `
#define HIGH_PRECISION` : i.precision === "mediump" ? e += `
#define MEDIUM_PRECISION` : i.precision === "lowp" && (e += `
#define LOW_PRECISION`), e;
}
function nd(i) {
  let e = "SHADOWMAP_TYPE_BASIC";
  return i.shadowMapType === 1 ? e = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === 2 ? e = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === 3 && (e = "SHADOWMAP_TYPE_VSM"), e;
}
function id(i) {
  let e = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case 301:
      case 302:
        e = "ENVMAP_TYPE_CUBE";
        break;
      case 306:
        e = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return e;
}
function rd(i) {
  let e = "ENVMAP_MODE_REFLECTION";
  return i.envMap && i.envMapMode === 302 && (e = "ENVMAP_MODE_REFRACTION"), e;
}
function sd(i) {
  let e = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case 0:
        e = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case 1:
        e = "ENVMAP_BLENDING_MIX";
        break;
      case 2:
        e = "ENVMAP_BLENDING_ADD";
        break;
    }
  return e;
}
function ad(i) {
  const e = i.envMapCubeUVHeight;
  if (e === null) return null;
  const t = Math.log2(e) - 2, n = 1 / e;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 112)), texelHeight: n, maxMip: t };
}
function od(i, e, t, n) {
  const r = i.getContext(), s = t.defines;
  let a = t.vertexShader, o = t.fragmentShader;
  const c = nd(t), l = id(t), h = rd(t), f = sd(t), d = ad(t), p = Ku(t), g = Zu(s), _ = r.createProgram();
  let m, u, A = t.glslVersion ? "#version " + t.glslVersion + `
` : "";
  t.isRawShaderMaterial ? (m = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g
  ].filter(pi).join(`
`), m.length > 0 && (m += `
`), u = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g
  ].filter(pi).join(`
`), u.length > 0 && (u += `
`)) : (m = [
    oa(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g,
    t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    t.batching ? "#define USE_BATCHING" : "",
    t.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    t.instancing ? "#define USE_INSTANCING" : "",
    t.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.map ? "#define USE_MAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + h : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    t.mapUv ? "#define MAP_UV " + t.mapUv : "",
    t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "",
    t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "",
    t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "",
    t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "",
    t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "",
    t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "",
    t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "",
    t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "",
    t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "",
    t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "",
    t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "",
    t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "",
    t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "",
    t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "",
    t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "",
    t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "",
    t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "",
    t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "",
    t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "",
    t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "",
    t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "",
    t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "",
    //
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexColors ? "#define USE_COLOR" : "",
    t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.skinning ? "#define USE_SKINNING" : "",
    t.morphTargets ? "#define USE_MORPHTARGETS" : "",
    t.morphNormals && t.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    t.morphColors ? "#define USE_MORPHCOLORS" : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + c : "",
    t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    t.reversedDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(pi).join(`
`), u = [
    oa(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    g,
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    t.map ? "#define USE_MAP" : "",
    t.matcap ? "#define USE_MATCAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + l : "",
    t.envMap ? "#define " + h : "",
    t.envMap ? "#define " + f : "",
    d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "",
    d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "",
    d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoat ? "#define USE_CLEARCOAT" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.dispersion ? "#define USE_DISPERSION" : "",
    t.iridescence ? "#define USE_IRIDESCENCE" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaTest ? "#define USE_ALPHATEST" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.sheen ? "#define USE_SHEEN" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexColors || t.instancingColor || t.batchingColor ? "#define USE_COLOR" : "",
    t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.gradientMap ? "#define USE_GRADIENTMAP" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + c : "",
    t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    t.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    t.reversedDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    t.toneMapping !== 0 ? "#define TONE_MAPPING" : "",
    t.toneMapping !== 0 ? Be.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    t.toneMapping !== 0 ? qu("toneMapping", t.toneMapping) : "",
    t.dithering ? "#define DITHERING" : "",
    t.opaque ? "#define OPAQUE" : "",
    Be.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    Xu("linearToOutputTexel", t.outputColorSpace),
    Yu(),
    t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "",
    `
`
  ].filter(pi).join(`
`)), a = Yr(a), a = ra(a, t), a = sa(a, t), o = Yr(o), o = ra(o, t), o = sa(o, t), a = aa(a), o = aa(o), t.isRawShaderMaterial !== !0 && (A = `#version 300 es
`, m = [
    p,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + m, u = [
    "#define varying in",
    t.glslVersion === ls ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    t.glslVersion === ls ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + u);
  const E = A + m + a, M = A + u + o, C = ta(r, r.VERTEX_SHADER, E), R = ta(r, r.FRAGMENT_SHADER, M);
  r.attachShader(_, C), r.attachShader(_, R), t.index0AttributeName !== void 0 ? r.bindAttribLocation(_, 0, t.index0AttributeName) : t.morphTargets === !0 && r.bindAttribLocation(_, 0, "position"), r.linkProgram(_);
  function L(b) {
    if (i.debug.checkShaderErrors) {
      const q = r.getProgramInfoLog(_) || "", V = r.getShaderInfoLog(C) || "", H = r.getShaderInfoLog(R) || "", Z = q.trim(), X = V.trim(), ee = H.trim();
      let z = !0, se = !0;
      if (r.getProgramParameter(_, r.LINK_STATUS) === !1)
        if (z = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(r, _, C, R);
        else {
          const he = ia(r, C, "vertex"), Ee = ia(r, R, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + r.getError() + " - VALIDATE_STATUS " + r.getProgramParameter(_, r.VALIDATE_STATUS) + `

Material Name: ` + b.name + `
Material Type: ` + b.type + `

Program Info Log: ` + Z + `
` + he + `
` + Ee
          );
        }
      else Z !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", Z) : (X === "" || ee === "") && (se = !1);
      se && (b.diagnostics = {
        runnable: z,
        programLog: Z,
        vertexShader: {
          log: X,
          prefix: m
        },
        fragmentShader: {
          log: ee,
          prefix: u
        }
      });
    }
    r.deleteShader(C), r.deleteShader(R), F = new er(r, _), y = $u(r, _);
  }
  let F;
  this.getUniforms = function() {
    return F === void 0 && L(this), F;
  };
  let y;
  this.getAttributes = function() {
    return y === void 0 && L(this), y;
  };
  let S = t.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return S === !1 && (S = r.getProgramParameter(_, Vu)), S;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), r.deleteProgram(_), this.program = void 0;
  }, this.type = t.shaderType, this.name = t.shaderName, this.id = Hu++, this.cacheKey = e, this.usedTimes = 1, this.program = _, this.vertexShader = C, this.fragmentShader = R, this;
}
let ld = 0;
class cd {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(e) {
    const t = e.vertexShader, n = e.fragmentShader, r = this._getShaderStage(t), s = this._getShaderStage(n), a = this._getShaderCacheForMaterial(e);
    return a.has(r) === !1 && (a.add(r), r.usedTimes++), a.has(s) === !1 && (a.add(s), s.usedTimes++), this;
  }
  remove(e) {
    const t = this.materialCache.get(e);
    for (const n of t)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(e), this;
  }
  getVertexShaderID(e) {
    return this._getShaderStage(e.vertexShader).id;
  }
  getFragmentShaderID(e) {
    return this._getShaderStage(e.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(e) {
    const t = this.materialCache;
    let n = t.get(e);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
  }
  _getShaderStage(e) {
    const t = this.shaderCache;
    let n = t.get(e);
    return n === void 0 && (n = new hd(e), t.set(e, n)), n;
  }
}
class hd {
  constructor(e) {
    this.id = ld++, this.code = e, this.usedTimes = 0;
  }
}
function ud(i, e, t, n, r, s, a) {
  const o = new jr(), c = new cd(), l = /* @__PURE__ */ new Set(), h = [], f = r.logarithmicDepthBuffer, d = r.vertexTextures;
  let p = r.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function _(y) {
    return l.add(y), y === 0 ? "uv" : `uv${y}`;
  }
  function m(y, S, b, q, V) {
    const H = q.fog, Z = V.geometry, X = y.isMeshStandardMaterial ? q.environment : null, ee = (y.isMeshStandardMaterial ? t : e).get(y.envMap || X), z = ee && ee.mapping === 306 ? ee.image.height : null, se = g[y.type];
    y.precision !== null && (p = r.getMaxPrecision(y.precision), p !== y.precision && console.warn("THREE.WebGLProgram.getParameters:", y.precision, "not supported, using", p, "instead."));
    const he = Z.morphAttributes.position || Z.morphAttributes.normal || Z.morphAttributes.color, Ee = he !== void 0 ? he.length : 0;
    let Oe = 0;
    Z.morphAttributes.position !== void 0 && (Oe = 1), Z.morphAttributes.normal !== void 0 && (Oe = 2), Z.morphAttributes.color !== void 0 && (Oe = 3);
    let it, je, W, ae;
    if (se) {
      const Ye = Xt[se];
      it = Ye.vertexShader, je = Ye.fragmentShader;
    } else
      it = y.vertexShader, je = y.fragmentShader, c.update(y), W = c.getVertexShaderID(y), ae = c.getFragmentShaderID(y);
    const ne = i.getRenderTarget(), Re = i.state.buffers.depth.getReversed(), Ce = V.isInstancedMesh === !0, Ue = V.isBatchedMesh === !0, ut = !!y.map, ke = !!y.matcap, w = !!ee, et = !!y.aoMap, Ae = !!y.lightMap, qe = !!y.bumpMap, ye = !!y.normalMap, rt = !!y.displacementMap, fe = !!y.emissiveMap, ze = !!y.metalnessMap, xt = !!y.roughnessMap, dt = y.anisotropy > 0, T = y.clearcoat > 0, v = y.dispersion > 0, N = y.iridescence > 0, k = y.sheen > 0, K = y.transmission > 0, G = dt && !!y.anisotropyMap, Me = T && !!y.clearcoatMap, te = T && !!y.clearcoatNormalMap, ge = T && !!y.clearcoatRoughnessMap, _e = N && !!y.iridescenceMap, J = N && !!y.iridescenceThicknessMap, ce = k && !!y.sheenColorMap, De = k && !!y.sheenRoughnessMap, ve = !!y.specularMap, oe = !!y.specularColorMap, Fe = !!y.specularIntensityMap, D = K && !!y.transmissionMap, Q = K && !!y.thicknessMap, ie = !!y.gradientMap, de = !!y.alphaMap, $ = y.alphaTest > 0, Y = !!y.alphaHash, me = !!y.extensions;
    let Ie = 0;
    y.toneMapped && (ne === null || ne.isXRRenderTarget === !0) && (Ie = i.toneMapping);
    const tt = {
      shaderID: se,
      shaderType: y.type,
      shaderName: y.name,
      vertexShader: it,
      fragmentShader: je,
      defines: y.defines,
      customVertexShaderID: W,
      customFragmentShaderID: ae,
      isRawShaderMaterial: y.isRawShaderMaterial === !0,
      glslVersion: y.glslVersion,
      precision: p,
      batching: Ue,
      batchingColor: Ue && V._colorsTexture !== null,
      instancing: Ce,
      instancingColor: Ce && V.instanceColor !== null,
      instancingMorph: Ce && V.morphTexture !== null,
      supportsVertexTextures: d,
      outputColorSpace: ne === null ? i.outputColorSpace : ne.isXRRenderTarget === !0 ? ne.texture.colorSpace : Jn,
      alphaToCoverage: !!y.alphaToCoverage,
      map: ut,
      matcap: ke,
      envMap: w,
      envMapMode: w && ee.mapping,
      envMapCubeUVHeight: z,
      aoMap: et,
      lightMap: Ae,
      bumpMap: qe,
      normalMap: ye,
      displacementMap: d && rt,
      emissiveMap: fe,
      normalMapObjectSpace: ye && y.normalMapType === 1,
      normalMapTangentSpace: ye && y.normalMapType === 0,
      metalnessMap: ze,
      roughnessMap: xt,
      anisotropy: dt,
      anisotropyMap: G,
      clearcoat: T,
      clearcoatMap: Me,
      clearcoatNormalMap: te,
      clearcoatRoughnessMap: ge,
      dispersion: v,
      iridescence: N,
      iridescenceMap: _e,
      iridescenceThicknessMap: J,
      sheen: k,
      sheenColorMap: ce,
      sheenRoughnessMap: De,
      specularMap: ve,
      specularColorMap: oe,
      specularIntensityMap: Fe,
      transmission: K,
      transmissionMap: D,
      thicknessMap: Q,
      gradientMap: ie,
      opaque: y.transparent === !1 && y.blending === 1 && y.alphaToCoverage === !1,
      alphaMap: de,
      alphaTest: $,
      alphaHash: Y,
      combine: y.combine,
      //
      mapUv: ut && _(y.map.channel),
      aoMapUv: et && _(y.aoMap.channel),
      lightMapUv: Ae && _(y.lightMap.channel),
      bumpMapUv: qe && _(y.bumpMap.channel),
      normalMapUv: ye && _(y.normalMap.channel),
      displacementMapUv: rt && _(y.displacementMap.channel),
      emissiveMapUv: fe && _(y.emissiveMap.channel),
      metalnessMapUv: ze && _(y.metalnessMap.channel),
      roughnessMapUv: xt && _(y.roughnessMap.channel),
      anisotropyMapUv: G && _(y.anisotropyMap.channel),
      clearcoatMapUv: Me && _(y.clearcoatMap.channel),
      clearcoatNormalMapUv: te && _(y.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: ge && _(y.clearcoatRoughnessMap.channel),
      iridescenceMapUv: _e && _(y.iridescenceMap.channel),
      iridescenceThicknessMapUv: J && _(y.iridescenceThicknessMap.channel),
      sheenColorMapUv: ce && _(y.sheenColorMap.channel),
      sheenRoughnessMapUv: De && _(y.sheenRoughnessMap.channel),
      specularMapUv: ve && _(y.specularMap.channel),
      specularColorMapUv: oe && _(y.specularColorMap.channel),
      specularIntensityMapUv: Fe && _(y.specularIntensityMap.channel),
      transmissionMapUv: D && _(y.transmissionMap.channel),
      thicknessMapUv: Q && _(y.thicknessMap.channel),
      alphaMapUv: de && _(y.alphaMap.channel),
      //
      vertexTangents: !!Z.attributes.tangent && (ye || dt),
      vertexColors: y.vertexColors,
      vertexAlphas: y.vertexColors === !0 && !!Z.attributes.color && Z.attributes.color.itemSize === 4,
      pointsUvs: V.isPoints === !0 && !!Z.attributes.uv && (ut || de),
      fog: !!H,
      useFog: y.fog === !0,
      fogExp2: !!H && H.isFogExp2,
      flatShading: y.flatShading === !0 && y.wireframe === !1,
      sizeAttenuation: y.sizeAttenuation === !0,
      logarithmicDepthBuffer: f,
      reversedDepthBuffer: Re,
      skinning: V.isSkinnedMesh === !0,
      morphTargets: Z.morphAttributes.position !== void 0,
      morphNormals: Z.morphAttributes.normal !== void 0,
      morphColors: Z.morphAttributes.color !== void 0,
      morphTargetsCount: Ee,
      morphTextureStride: Oe,
      numDirLights: S.directional.length,
      numPointLights: S.point.length,
      numSpotLights: S.spot.length,
      numSpotLightMaps: S.spotLightMap.length,
      numRectAreaLights: S.rectArea.length,
      numHemiLights: S.hemi.length,
      numDirLightShadows: S.directionalShadowMap.length,
      numPointLightShadows: S.pointShadowMap.length,
      numSpotLightShadows: S.spotShadowMap.length,
      numSpotLightShadowsWithMaps: S.numSpotLightShadowsWithMaps,
      numLightProbes: S.numLightProbes,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: y.dithering,
      shadowMapEnabled: i.shadowMap.enabled && b.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: Ie,
      decodeVideoTexture: ut && y.map.isVideoTexture === !0 && We.getTransfer(y.map.colorSpace) === Ke,
      decodeVideoTextureEmissive: fe && y.emissiveMap.isVideoTexture === !0 && We.getTransfer(y.emissiveMap.colorSpace) === Ke,
      premultipliedAlpha: y.premultipliedAlpha,
      doubleSided: y.side === 2,
      flipSided: y.side === 1,
      useDepthPacking: y.depthPacking >= 0,
      depthPacking: y.depthPacking || 0,
      index0AttributeName: y.index0AttributeName,
      extensionClipCullDistance: me && y.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (me && y.extensions.multiDraw === !0 || Ue) && n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: y.customProgramCacheKey()
    };
    return tt.vertexUv1s = l.has(1), tt.vertexUv2s = l.has(2), tt.vertexUv3s = l.has(3), l.clear(), tt;
  }
  function u(y) {
    const S = [];
    if (y.shaderID ? S.push(y.shaderID) : (S.push(y.customVertexShaderID), S.push(y.customFragmentShaderID)), y.defines !== void 0)
      for (const b in y.defines)
        S.push(b), S.push(y.defines[b]);
    return y.isRawShaderMaterial === !1 && (A(S, y), E(S, y), S.push(i.outputColorSpace)), S.push(y.customProgramCacheKey), S.join();
  }
  function A(y, S) {
    y.push(S.precision), y.push(S.outputColorSpace), y.push(S.envMapMode), y.push(S.envMapCubeUVHeight), y.push(S.mapUv), y.push(S.alphaMapUv), y.push(S.lightMapUv), y.push(S.aoMapUv), y.push(S.bumpMapUv), y.push(S.normalMapUv), y.push(S.displacementMapUv), y.push(S.emissiveMapUv), y.push(S.metalnessMapUv), y.push(S.roughnessMapUv), y.push(S.anisotropyMapUv), y.push(S.clearcoatMapUv), y.push(S.clearcoatNormalMapUv), y.push(S.clearcoatRoughnessMapUv), y.push(S.iridescenceMapUv), y.push(S.iridescenceThicknessMapUv), y.push(S.sheenColorMapUv), y.push(S.sheenRoughnessMapUv), y.push(S.specularMapUv), y.push(S.specularColorMapUv), y.push(S.specularIntensityMapUv), y.push(S.transmissionMapUv), y.push(S.thicknessMapUv), y.push(S.combine), y.push(S.fogExp2), y.push(S.sizeAttenuation), y.push(S.morphTargetsCount), y.push(S.morphAttributeCount), y.push(S.numDirLights), y.push(S.numPointLights), y.push(S.numSpotLights), y.push(S.numSpotLightMaps), y.push(S.numHemiLights), y.push(S.numRectAreaLights), y.push(S.numDirLightShadows), y.push(S.numPointLightShadows), y.push(S.numSpotLightShadows), y.push(S.numSpotLightShadowsWithMaps), y.push(S.numLightProbes), y.push(S.shadowMapType), y.push(S.toneMapping), y.push(S.numClippingPlanes), y.push(S.numClipIntersection), y.push(S.depthPacking);
  }
  function E(y, S) {
    o.disableAll(), S.supportsVertexTextures && o.enable(0), S.instancing && o.enable(1), S.instancingColor && o.enable(2), S.instancingMorph && o.enable(3), S.matcap && o.enable(4), S.envMap && o.enable(5), S.normalMapObjectSpace && o.enable(6), S.normalMapTangentSpace && o.enable(7), S.clearcoat && o.enable(8), S.iridescence && o.enable(9), S.alphaTest && o.enable(10), S.vertexColors && o.enable(11), S.vertexAlphas && o.enable(12), S.vertexUv1s && o.enable(13), S.vertexUv2s && o.enable(14), S.vertexUv3s && o.enable(15), S.vertexTangents && o.enable(16), S.anisotropy && o.enable(17), S.alphaHash && o.enable(18), S.batching && o.enable(19), S.dispersion && o.enable(20), S.batchingColor && o.enable(21), S.gradientMap && o.enable(22), y.push(o.mask), o.disableAll(), S.fog && o.enable(0), S.useFog && o.enable(1), S.flatShading && o.enable(2), S.logarithmicDepthBuffer && o.enable(3), S.reversedDepthBuffer && o.enable(4), S.skinning && o.enable(5), S.morphTargets && o.enable(6), S.morphNormals && o.enable(7), S.morphColors && o.enable(8), S.premultipliedAlpha && o.enable(9), S.shadowMapEnabled && o.enable(10), S.doubleSided && o.enable(11), S.flipSided && o.enable(12), S.useDepthPacking && o.enable(13), S.dithering && o.enable(14), S.transmission && o.enable(15), S.sheen && o.enable(16), S.opaque && o.enable(17), S.pointsUvs && o.enable(18), S.decodeVideoTexture && o.enable(19), S.decodeVideoTextureEmissive && o.enable(20), S.alphaToCoverage && o.enable(21), y.push(o.mask);
  }
  function M(y) {
    const S = g[y.type];
    let b;
    if (S) {
      const q = Xt[S];
      b = vi.clone(q.uniforms);
    } else
      b = y.uniforms;
    return b;
  }
  function C(y, S) {
    let b;
    for (let q = 0, V = h.length; q < V; q++) {
      const H = h[q];
      if (H.cacheKey === S) {
        b = H, ++b.usedTimes;
        break;
      }
    }
    return b === void 0 && (b = new od(i, S, y, s), h.push(b)), b;
  }
  function R(y) {
    if (--y.usedTimes === 0) {
      const S = h.indexOf(y);
      h[S] = h[h.length - 1], h.pop(), y.destroy();
    }
  }
  function L(y) {
    c.remove(y);
  }
  function F() {
    c.dispose();
  }
  return {
    getParameters: m,
    getProgramCacheKey: u,
    getUniforms: M,
    acquireProgram: C,
    releaseProgram: R,
    releaseShaderCache: L,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: h,
    dispose: F
  };
}
function dd() {
  let i = /* @__PURE__ */ new WeakMap();
  function e(a) {
    return i.has(a);
  }
  function t(a) {
    let o = i.get(a);
    return o === void 0 && (o = {}, i.set(a, o)), o;
  }
  function n(a) {
    i.delete(a);
  }
  function r(a, o, c) {
    i.get(a)[o] = c;
  }
  function s() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: e,
    get: t,
    remove: n,
    update: r,
    dispose: s
  };
}
function fd(i, e) {
  return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.material.id !== e.material.id ? i.material.id - e.material.id : i.z !== e.z ? i.z - e.z : i.id - e.id;
}
function la(i, e) {
  return i.groupOrder !== e.groupOrder ? i.groupOrder - e.groupOrder : i.renderOrder !== e.renderOrder ? i.renderOrder - e.renderOrder : i.z !== e.z ? e.z - i.z : i.id - e.id;
}
function ca() {
  const i = [];
  let e = 0;
  const t = [], n = [], r = [];
  function s() {
    e = 0, t.length = 0, n.length = 0, r.length = 0;
  }
  function a(f, d, p, g, _, m) {
    let u = i[e];
    return u === void 0 ? (u = {
      id: f.id,
      object: f,
      geometry: d,
      material: p,
      groupOrder: g,
      renderOrder: f.renderOrder,
      z: _,
      group: m
    }, i[e] = u) : (u.id = f.id, u.object = f, u.geometry = d, u.material = p, u.groupOrder = g, u.renderOrder = f.renderOrder, u.z = _, u.group = m), e++, u;
  }
  function o(f, d, p, g, _, m) {
    const u = a(f, d, p, g, _, m);
    p.transmission > 0 ? n.push(u) : p.transparent === !0 ? r.push(u) : t.push(u);
  }
  function c(f, d, p, g, _, m) {
    const u = a(f, d, p, g, _, m);
    p.transmission > 0 ? n.unshift(u) : p.transparent === !0 ? r.unshift(u) : t.unshift(u);
  }
  function l(f, d) {
    t.length > 1 && t.sort(f || fd), n.length > 1 && n.sort(d || la), r.length > 1 && r.sort(d || la);
  }
  function h() {
    for (let f = e, d = i.length; f < d; f++) {
      const p = i[f];
      if (p.id === null) break;
      p.id = null, p.object = null, p.geometry = null, p.material = null, p.group = null;
    }
  }
  return {
    opaque: t,
    transmissive: n,
    transparent: r,
    init: s,
    push: o,
    unshift: c,
    finish: h,
    sort: l
  };
}
function pd() {
  let i = /* @__PURE__ */ new WeakMap();
  function e(n, r) {
    const s = i.get(n);
    let a;
    return s === void 0 ? (a = new ca(), i.set(n, [a])) : r >= s.length ? (a = new ca(), s.push(a)) : a = s[r], a;
  }
  function t() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: t
  };
}
function md() {
  const i = {};
  return {
    get: function(e) {
      if (i[e.id] !== void 0)
        return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            direction: new P(),
            color: new Se()
          };
          break;
        case "SpotLight":
          t = {
            position: new P(),
            direction: new P(),
            color: new Se(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          t = {
            position: new P(),
            color: new Se(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          t = {
            direction: new P(),
            skyColor: new Se(),
            groundColor: new Se()
          };
          break;
        case "RectAreaLight":
          t = {
            color: new Se(),
            position: new P(),
            halfWidth: new P(),
            halfHeight: new P()
          };
          break;
      }
      return i[e.id] = t, t;
    }
  };
}
function gd() {
  const i = {};
  return {
    get: function(e) {
      if (i[e.id] !== void 0)
        return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new we()
          };
          break;
        case "SpotLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new we()
          };
          break;
        case "PointLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new we(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return i[e.id] = t, t;
    }
  };
}
let _d = 0;
function vd(i, e) {
  return (e.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (i.map ? 1 : 0);
}
function xd(i) {
  const e = new md(), t = gd(), n = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let l = 0; l < 9; l++) n.probe.push(new P());
  const r = new P(), s = new Qe(), a = new Qe();
  function o(l) {
    let h = 0, f = 0, d = 0;
    for (let y = 0; y < 9; y++) n.probe[y].set(0, 0, 0);
    let p = 0, g = 0, _ = 0, m = 0, u = 0, A = 0, E = 0, M = 0, C = 0, R = 0, L = 0;
    l.sort(vd);
    for (let y = 0, S = l.length; y < S; y++) {
      const b = l[y], q = b.color, V = b.intensity, H = b.distance, Z = b.shadow && b.shadow.map ? b.shadow.map.texture : null;
      if (b.isAmbientLight)
        h += q.r * V, f += q.g * V, d += q.b * V;
      else if (b.isLightProbe) {
        for (let X = 0; X < 9; X++)
          n.probe[X].addScaledVector(b.sh.coefficients[X], V);
        L++;
      } else if (b.isDirectionalLight) {
        const X = e.get(b);
        if (X.color.copy(b.color).multiplyScalar(b.intensity), b.castShadow) {
          const ee = b.shadow, z = t.get(b);
          z.shadowIntensity = ee.intensity, z.shadowBias = ee.bias, z.shadowNormalBias = ee.normalBias, z.shadowRadius = ee.radius, z.shadowMapSize = ee.mapSize, n.directionalShadow[p] = z, n.directionalShadowMap[p] = Z, n.directionalShadowMatrix[p] = b.shadow.matrix, A++;
        }
        n.directional[p] = X, p++;
      } else if (b.isSpotLight) {
        const X = e.get(b);
        X.position.setFromMatrixPosition(b.matrixWorld), X.color.copy(q).multiplyScalar(V), X.distance = H, X.coneCos = Math.cos(b.angle), X.penumbraCos = Math.cos(b.angle * (1 - b.penumbra)), X.decay = b.decay, n.spot[_] = X;
        const ee = b.shadow;
        if (b.map && (n.spotLightMap[C] = b.map, C++, ee.updateMatrices(b), b.castShadow && R++), n.spotLightMatrix[_] = ee.matrix, b.castShadow) {
          const z = t.get(b);
          z.shadowIntensity = ee.intensity, z.shadowBias = ee.bias, z.shadowNormalBias = ee.normalBias, z.shadowRadius = ee.radius, z.shadowMapSize = ee.mapSize, n.spotShadow[_] = z, n.spotShadowMap[_] = Z, M++;
        }
        _++;
      } else if (b.isRectAreaLight) {
        const X = e.get(b);
        X.color.copy(q).multiplyScalar(V), X.halfWidth.set(b.width * 0.5, 0, 0), X.halfHeight.set(0, b.height * 0.5, 0), n.rectArea[m] = X, m++;
      } else if (b.isPointLight) {
        const X = e.get(b);
        if (X.color.copy(b.color).multiplyScalar(b.intensity), X.distance = b.distance, X.decay = b.decay, b.castShadow) {
          const ee = b.shadow, z = t.get(b);
          z.shadowIntensity = ee.intensity, z.shadowBias = ee.bias, z.shadowNormalBias = ee.normalBias, z.shadowRadius = ee.radius, z.shadowMapSize = ee.mapSize, z.shadowCameraNear = ee.camera.near, z.shadowCameraFar = ee.camera.far, n.pointShadow[g] = z, n.pointShadowMap[g] = Z, n.pointShadowMatrix[g] = b.shadow.matrix, E++;
        }
        n.point[g] = X, g++;
      } else if (b.isHemisphereLight) {
        const X = e.get(b);
        X.skyColor.copy(b.color).multiplyScalar(V), X.groundColor.copy(b.groundColor).multiplyScalar(V), n.hemi[u] = X, u++;
      }
    }
    m > 0 && (i.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = re.LTC_FLOAT_1, n.rectAreaLTC2 = re.LTC_FLOAT_2) : (n.rectAreaLTC1 = re.LTC_HALF_1, n.rectAreaLTC2 = re.LTC_HALF_2)), n.ambient[0] = h, n.ambient[1] = f, n.ambient[2] = d;
    const F = n.hash;
    (F.directionalLength !== p || F.pointLength !== g || F.spotLength !== _ || F.rectAreaLength !== m || F.hemiLength !== u || F.numDirectionalShadows !== A || F.numPointShadows !== E || F.numSpotShadows !== M || F.numSpotMaps !== C || F.numLightProbes !== L) && (n.directional.length = p, n.spot.length = _, n.rectArea.length = m, n.point.length = g, n.hemi.length = u, n.directionalShadow.length = A, n.directionalShadowMap.length = A, n.pointShadow.length = E, n.pointShadowMap.length = E, n.spotShadow.length = M, n.spotShadowMap.length = M, n.directionalShadowMatrix.length = A, n.pointShadowMatrix.length = E, n.spotLightMatrix.length = M + C - R, n.spotLightMap.length = C, n.numSpotLightShadowsWithMaps = R, n.numLightProbes = L, F.directionalLength = p, F.pointLength = g, F.spotLength = _, F.rectAreaLength = m, F.hemiLength = u, F.numDirectionalShadows = A, F.numPointShadows = E, F.numSpotShadows = M, F.numSpotMaps = C, F.numLightProbes = L, n.version = _d++);
  }
  function c(l, h) {
    let f = 0, d = 0, p = 0, g = 0, _ = 0;
    const m = h.matrixWorldInverse;
    for (let u = 0, A = l.length; u < A; u++) {
      const E = l[u];
      if (E.isDirectionalLight) {
        const M = n.directional[f];
        M.direction.setFromMatrixPosition(E.matrixWorld), r.setFromMatrixPosition(E.target.matrixWorld), M.direction.sub(r), M.direction.transformDirection(m), f++;
      } else if (E.isSpotLight) {
        const M = n.spot[p];
        M.position.setFromMatrixPosition(E.matrixWorld), M.position.applyMatrix4(m), M.direction.setFromMatrixPosition(E.matrixWorld), r.setFromMatrixPosition(E.target.matrixWorld), M.direction.sub(r), M.direction.transformDirection(m), p++;
      } else if (E.isRectAreaLight) {
        const M = n.rectArea[g];
        M.position.setFromMatrixPosition(E.matrixWorld), M.position.applyMatrix4(m), a.identity(), s.copy(E.matrixWorld), s.premultiply(m), a.extractRotation(s), M.halfWidth.set(E.width * 0.5, 0, 0), M.halfHeight.set(0, E.height * 0.5, 0), M.halfWidth.applyMatrix4(a), M.halfHeight.applyMatrix4(a), g++;
      } else if (E.isPointLight) {
        const M = n.point[d];
        M.position.setFromMatrixPosition(E.matrixWorld), M.position.applyMatrix4(m), d++;
      } else if (E.isHemisphereLight) {
        const M = n.hemi[_];
        M.direction.setFromMatrixPosition(E.matrixWorld), M.direction.transformDirection(m), _++;
      }
    }
  }
  return {
    setup: o,
    setupView: c,
    state: n
  };
}
function ha(i) {
  const e = new xd(i), t = [], n = [];
  function r(h) {
    l.camera = h, t.length = 0, n.length = 0;
  }
  function s(h) {
    t.push(h);
  }
  function a(h) {
    n.push(h);
  }
  function o() {
    e.setup(t);
  }
  function c(h) {
    e.setupView(t, h);
  }
  const l = {
    lightsArray: t,
    shadowsArray: n,
    camera: null,
    lights: e,
    transmissionRenderTarget: {}
  };
  return {
    init: r,
    state: l,
    setupLights: o,
    setupLightsView: c,
    pushLight: s,
    pushShadow: a
  };
}
function Md(i) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(r, s = 0) {
    const a = e.get(r);
    let o;
    return a === void 0 ? (o = new ha(i), e.set(r, [o])) : s >= a.length ? (o = new ha(i), a.push(o)) : o = a[s], o;
  }
  function n() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: n
  };
}
const Sd = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, yd = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function Ed(i, e, t) {
  let n = new Jr();
  const r = new we(), s = new we(), a = new ht(), o = new Xo({ depthPacking: 3201 }), c = new qo(), l = {}, h = t.maxTextureSize, f = { 0: 1, 1: 0, 2: 2 }, d = new gt({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new we() },
      radius: { value: 4 }
    },
    vertexShader: Sd,
    fragmentShader: yd
  }), p = d.clone();
  p.defines.HORIZONTAL_PASS = 1;
  const g = new st();
  g.setAttribute(
    "position",
    new Ve(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const _ = new wt(g, d), m = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
  let u = this.type;
  this.render = function(R, L, F) {
    if (m.enabled === !1 || m.autoUpdate === !1 && m.needsUpdate === !1 || R.length === 0) return;
    const y = i.getRenderTarget(), S = i.getActiveCubeFace(), b = i.getActiveMipmapLevel(), q = i.state;
    q.setBlending(0), q.buffers.depth.getReversed() ? q.buffers.color.setClear(0, 0, 0, 0) : q.buffers.color.setClear(1, 1, 1, 1), q.buffers.depth.setTest(!0), q.setScissorTest(!1);
    const V = u !== 3 && this.type === 3, H = u === 3 && this.type !== 3;
    for (let Z = 0, X = R.length; Z < X; Z++) {
      const ee = R[Z], z = ee.shadow;
      if (z === void 0) {
        console.warn("THREE.WebGLShadowMap:", ee, "has no shadow.");
        continue;
      }
      if (z.autoUpdate === !1 && z.needsUpdate === !1) continue;
      r.copy(z.mapSize);
      const se = z.getFrameExtents();
      if (r.multiply(se), s.copy(z.mapSize), (r.x > h || r.y > h) && (r.x > h && (s.x = Math.floor(h / se.x), r.x = s.x * se.x, z.mapSize.x = s.x), r.y > h && (s.y = Math.floor(h / se.y), r.y = s.y * se.y, z.mapSize.y = s.y)), z.map === null || V === !0 || H === !0) {
        const Ee = this.type !== 3 ? { minFilter: 1003, magFilter: 1003 } : {};
        z.map !== null && z.map.dispose(), z.map = new kt(r.x, r.y, Ee), z.map.texture.name = ee.name + ".shadowMap", z.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(z.map), i.clear();
      const he = z.getViewportCount();
      for (let Ee = 0; Ee < he; Ee++) {
        const Oe = z.getViewport(Ee);
        a.set(
          s.x * Oe.x,
          s.y * Oe.y,
          s.x * Oe.z,
          s.y * Oe.w
        ), q.viewport(a), z.updateMatrices(ee, Ee), n = z.getFrustum(), M(L, F, z.camera, ee, this.type);
      }
      z.isPointLightShadow !== !0 && this.type === 3 && A(z, F), z.needsUpdate = !1;
    }
    u = this.type, m.needsUpdate = !1, i.setRenderTarget(y, S, b);
  };
  function A(R, L) {
    const F = e.update(_);
    d.defines.VSM_SAMPLES !== R.blurSamples && (d.defines.VSM_SAMPLES = R.blurSamples, p.defines.VSM_SAMPLES = R.blurSamples, d.needsUpdate = !0, p.needsUpdate = !0), R.mapPass === null && (R.mapPass = new kt(r.x, r.y)), d.uniforms.shadow_pass.value = R.map.texture, d.uniforms.resolution.value = R.mapSize, d.uniforms.radius.value = R.radius, i.setRenderTarget(R.mapPass), i.clear(), i.renderBufferDirect(L, null, F, d, _, null), p.uniforms.shadow_pass.value = R.mapPass.texture, p.uniforms.resolution.value = R.mapSize, p.uniforms.radius.value = R.radius, i.setRenderTarget(R.map), i.clear(), i.renderBufferDirect(L, null, F, p, _, null);
  }
  function E(R, L, F, y) {
    let S = null;
    const b = F.isPointLight === !0 ? R.customDistanceMaterial : R.customDepthMaterial;
    if (b !== void 0)
      S = b;
    else if (S = F.isPointLight === !0 ? c : o, i.localClippingEnabled && L.clipShadows === !0 && Array.isArray(L.clippingPlanes) && L.clippingPlanes.length !== 0 || L.displacementMap && L.displacementScale !== 0 || L.alphaMap && L.alphaTest > 0 || L.map && L.alphaTest > 0 || L.alphaToCoverage === !0) {
      const q = S.uuid, V = L.uuid;
      let H = l[q];
      H === void 0 && (H = {}, l[q] = H);
      let Z = H[V];
      Z === void 0 && (Z = S.clone(), H[V] = Z, L.addEventListener("dispose", C)), S = Z;
    }
    if (S.visible = L.visible, S.wireframe = L.wireframe, y === 3 ? S.side = L.shadowSide !== null ? L.shadowSide : L.side : S.side = L.shadowSide !== null ? L.shadowSide : f[L.side], S.alphaMap = L.alphaMap, S.alphaTest = L.alphaToCoverage === !0 ? 0.5 : L.alphaTest, S.map = L.map, S.clipShadows = L.clipShadows, S.clippingPlanes = L.clippingPlanes, S.clipIntersection = L.clipIntersection, S.displacementMap = L.displacementMap, S.displacementScale = L.displacementScale, S.displacementBias = L.displacementBias, S.wireframeLinewidth = L.wireframeLinewidth, S.linewidth = L.linewidth, F.isPointLight === !0 && S.isMeshDistanceMaterial === !0) {
      const q = i.properties.get(S);
      q.light = F;
    }
    return S;
  }
  function M(R, L, F, y, S) {
    if (R.visible === !1) return;
    if (R.layers.test(L.layers) && (R.isMesh || R.isLine || R.isPoints) && (R.castShadow || R.receiveShadow && S === 3) && (!R.frustumCulled || n.intersectsObject(R))) {
      R.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse, R.matrixWorld);
      const V = e.update(R), H = R.material;
      if (Array.isArray(H)) {
        const Z = V.groups;
        for (let X = 0, ee = Z.length; X < ee; X++) {
          const z = Z[X], se = H[z.materialIndex];
          if (se && se.visible) {
            const he = E(R, se, y, S);
            R.onBeforeShadow(i, R, L, F, V, he, z), i.renderBufferDirect(F, null, V, he, R, z), R.onAfterShadow(i, R, L, F, V, he, z);
          }
        }
      } else if (H.visible) {
        const Z = E(R, H, y, S);
        R.onBeforeShadow(i, R, L, F, V, Z, null), i.renderBufferDirect(F, null, V, Z, R, null), R.onAfterShadow(i, R, L, F, V, Z, null);
      }
    }
    const q = R.children;
    for (let V = 0, H = q.length; V < H; V++)
      M(q[V], L, F, y, S);
  }
  function C(R) {
    R.target.removeEventListener("dispose", C);
    for (const F in l) {
      const y = l[F], S = R.target.uuid;
      S in y && (y[S].dispose(), delete y[S]);
    }
  }
}
const Td = {
  0: 1,
  2: 6,
  4: 7,
  3: 5,
  1: 0,
  6: 2,
  7: 4,
  5: 3
};
function Ad(i, e) {
  function t() {
    let D = !1;
    const Q = new ht();
    let ie = null;
    const de = new ht(0, 0, 0, 0);
    return {
      setMask: function($) {
        ie !== $ && !D && (i.colorMask($, $, $, $), ie = $);
      },
      setLocked: function($) {
        D = $;
      },
      setClear: function($, Y, me, Ie, tt) {
        tt === !0 && ($ *= Ie, Y *= Ie, me *= Ie), Q.set($, Y, me, Ie), de.equals(Q) === !1 && (i.clearColor($, Y, me, Ie), de.copy(Q));
      },
      reset: function() {
        D = !1, ie = null, de.set(-1, 0, 0, 0);
      }
    };
  }
  function n() {
    let D = !1, Q = !1, ie = null, de = null, $ = null;
    return {
      setReversed: function(Y) {
        if (Q !== Y) {
          const me = e.get("EXT_clip_control");
          Y ? me.clipControlEXT(me.LOWER_LEFT_EXT, me.ZERO_TO_ONE_EXT) : me.clipControlEXT(me.LOWER_LEFT_EXT, me.NEGATIVE_ONE_TO_ONE_EXT), Q = Y;
          const Ie = $;
          $ = null, this.setClear(Ie);
        }
      },
      getReversed: function() {
        return Q;
      },
      setTest: function(Y) {
        Y ? ne(i.DEPTH_TEST) : Re(i.DEPTH_TEST);
      },
      setMask: function(Y) {
        ie !== Y && !D && (i.depthMask(Y), ie = Y);
      },
      setFunc: function(Y) {
        if (Q && (Y = Td[Y]), de !== Y) {
          switch (Y) {
            case 0:
              i.depthFunc(i.NEVER);
              break;
            case 1:
              i.depthFunc(i.ALWAYS);
              break;
            case 2:
              i.depthFunc(i.LESS);
              break;
            case 3:
              i.depthFunc(i.LEQUAL);
              break;
            case 4:
              i.depthFunc(i.EQUAL);
              break;
            case 5:
              i.depthFunc(i.GEQUAL);
              break;
            case 6:
              i.depthFunc(i.GREATER);
              break;
            case 7:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          de = Y;
        }
      },
      setLocked: function(Y) {
        D = Y;
      },
      setClear: function(Y) {
        $ !== Y && (Q && (Y = 1 - Y), i.clearDepth(Y), $ = Y);
      },
      reset: function() {
        D = !1, ie = null, de = null, $ = null, Q = !1;
      }
    };
  }
  function r() {
    let D = !1, Q = null, ie = null, de = null, $ = null, Y = null, me = null, Ie = null, tt = null;
    return {
      setTest: function(Ye) {
        D || (Ye ? ne(i.STENCIL_TEST) : Re(i.STENCIL_TEST));
      },
      setMask: function(Ye) {
        Q !== Ye && !D && (i.stencilMask(Ye), Q = Ye);
      },
      setFunc: function(Ye, Yt, Wt) {
        (ie !== Ye || de !== Yt || $ !== Wt) && (i.stencilFunc(Ye, Yt, Wt), ie = Ye, de = Yt, $ = Wt);
      },
      setOp: function(Ye, Yt, Wt) {
        (Y !== Ye || me !== Yt || Ie !== Wt) && (i.stencilOp(Ye, Yt, Wt), Y = Ye, me = Yt, Ie = Wt);
      },
      setLocked: function(Ye) {
        D = Ye;
      },
      setClear: function(Ye) {
        tt !== Ye && (i.clearStencil(Ye), tt = Ye);
      },
      reset: function() {
        D = !1, Q = null, ie = null, de = null, $ = null, Y = null, me = null, Ie = null, tt = null;
      }
    };
  }
  const s = new t(), a = new n(), o = new r(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
  let h = {}, f = {}, d = /* @__PURE__ */ new WeakMap(), p = [], g = null, _ = !1, m = null, u = null, A = null, E = null, M = null, C = null, R = null, L = new Se(0, 0, 0), F = 0, y = !1, S = null, b = null, q = null, V = null, H = null;
  const Z = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let X = !1, ee = 0;
  const z = i.getParameter(i.VERSION);
  z.indexOf("WebGL") !== -1 ? (ee = parseFloat(/^WebGL (\d)/.exec(z)[1]), X = ee >= 1) : z.indexOf("OpenGL ES") !== -1 && (ee = parseFloat(/^OpenGL ES (\d)/.exec(z)[1]), X = ee >= 2);
  let se = null, he = {};
  const Ee = i.getParameter(i.SCISSOR_BOX), Oe = i.getParameter(i.VIEWPORT), it = new ht().fromArray(Ee), je = new ht().fromArray(Oe);
  function W(D, Q, ie, de) {
    const $ = new Uint8Array(4), Y = i.createTexture();
    i.bindTexture(D, Y), i.texParameteri(D, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(D, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let me = 0; me < ie; me++)
      D === i.TEXTURE_3D || D === i.TEXTURE_2D_ARRAY ? i.texImage3D(Q, 0, i.RGBA, 1, 1, de, 0, i.RGBA, i.UNSIGNED_BYTE, $) : i.texImage2D(Q + me, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, $);
    return Y;
  }
  const ae = {};
  ae[i.TEXTURE_2D] = W(i.TEXTURE_2D, i.TEXTURE_2D, 1), ae[i.TEXTURE_CUBE_MAP] = W(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), ae[i.TEXTURE_2D_ARRAY] = W(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), ae[i.TEXTURE_3D] = W(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1), s.setClear(0, 0, 0, 1), a.setClear(1), o.setClear(0), ne(i.DEPTH_TEST), a.setFunc(3), qe(!1), ye(1), ne(i.CULL_FACE), et(0);
  function ne(D) {
    h[D] !== !0 && (i.enable(D), h[D] = !0);
  }
  function Re(D) {
    h[D] !== !1 && (i.disable(D), h[D] = !1);
  }
  function Ce(D, Q) {
    return f[D] !== Q ? (i.bindFramebuffer(D, Q), f[D] = Q, D === i.DRAW_FRAMEBUFFER && (f[i.FRAMEBUFFER] = Q), D === i.FRAMEBUFFER && (f[i.DRAW_FRAMEBUFFER] = Q), !0) : !1;
  }
  function Ue(D, Q) {
    let ie = p, de = !1;
    if (D) {
      ie = d.get(Q), ie === void 0 && (ie = [], d.set(Q, ie));
      const $ = D.textures;
      if (ie.length !== $.length || ie[0] !== i.COLOR_ATTACHMENT0) {
        for (let Y = 0, me = $.length; Y < me; Y++)
          ie[Y] = i.COLOR_ATTACHMENT0 + Y;
        ie.length = $.length, de = !0;
      }
    } else
      ie[0] !== i.BACK && (ie[0] = i.BACK, de = !0);
    de && i.drawBuffers(ie);
  }
  function ut(D) {
    return g !== D ? (i.useProgram(D), g = D, !0) : !1;
  }
  const ke = {
    100: i.FUNC_ADD,
    101: i.FUNC_SUBTRACT,
    102: i.FUNC_REVERSE_SUBTRACT
  };
  ke[103] = i.MIN, ke[104] = i.MAX;
  const w = {
    200: i.ZERO,
    201: i.ONE,
    202: i.SRC_COLOR,
    204: i.SRC_ALPHA,
    210: i.SRC_ALPHA_SATURATE,
    208: i.DST_COLOR,
    206: i.DST_ALPHA,
    203: i.ONE_MINUS_SRC_COLOR,
    205: i.ONE_MINUS_SRC_ALPHA,
    209: i.ONE_MINUS_DST_COLOR,
    207: i.ONE_MINUS_DST_ALPHA,
    211: i.CONSTANT_COLOR,
    212: i.ONE_MINUS_CONSTANT_COLOR,
    213: i.CONSTANT_ALPHA,
    214: i.ONE_MINUS_CONSTANT_ALPHA
  };
  function et(D, Q, ie, de, $, Y, me, Ie, tt, Ye) {
    if (D === 0) {
      _ === !0 && (Re(i.BLEND), _ = !1);
      return;
    }
    if (_ === !1 && (ne(i.BLEND), _ = !0), D !== 5) {
      if (D !== m || Ye !== y) {
        if ((u !== 100 || M !== 100) && (i.blendEquation(i.FUNC_ADD), u = 100, M = 100), Ye)
          switch (D) {
            case 1:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case 3:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case 4:
              i.blendFuncSeparate(i.DST_COLOR, i.ONE_MINUS_SRC_ALPHA, i.ZERO, i.ONE);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", D);
              break;
          }
        else
          switch (D) {
            case 1:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case 2:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE, i.ONE, i.ONE);
              break;
            case 3:
              console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
              break;
            case 4:
              console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", D);
              break;
          }
        A = null, E = null, C = null, R = null, L.set(0, 0, 0), F = 0, m = D, y = Ye;
      }
      return;
    }
    $ = $ || Q, Y = Y || ie, me = me || de, (Q !== u || $ !== M) && (i.blendEquationSeparate(ke[Q], ke[$]), u = Q, M = $), (ie !== A || de !== E || Y !== C || me !== R) && (i.blendFuncSeparate(w[ie], w[de], w[Y], w[me]), A = ie, E = de, C = Y, R = me), (Ie.equals(L) === !1 || tt !== F) && (i.blendColor(Ie.r, Ie.g, Ie.b, tt), L.copy(Ie), F = tt), m = D, y = !1;
  }
  function Ae(D, Q) {
    D.side === 2 ? Re(i.CULL_FACE) : ne(i.CULL_FACE);
    let ie = D.side === 1;
    Q && (ie = !ie), qe(ie), D.blending === 1 && D.transparent === !1 ? et(0) : et(D.blending, D.blendEquation, D.blendSrc, D.blendDst, D.blendEquationAlpha, D.blendSrcAlpha, D.blendDstAlpha, D.blendColor, D.blendAlpha, D.premultipliedAlpha), a.setFunc(D.depthFunc), a.setTest(D.depthTest), a.setMask(D.depthWrite), s.setMask(D.colorWrite);
    const de = D.stencilWrite;
    o.setTest(de), de && (o.setMask(D.stencilWriteMask), o.setFunc(D.stencilFunc, D.stencilRef, D.stencilFuncMask), o.setOp(D.stencilFail, D.stencilZFail, D.stencilZPass)), fe(D.polygonOffset, D.polygonOffsetFactor, D.polygonOffsetUnits), D.alphaToCoverage === !0 ? ne(i.SAMPLE_ALPHA_TO_COVERAGE) : Re(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function qe(D) {
    S !== D && (D ? i.frontFace(i.CW) : i.frontFace(i.CCW), S = D);
  }
  function ye(D) {
    D !== 0 ? (ne(i.CULL_FACE), D !== b && (D === 1 ? i.cullFace(i.BACK) : D === 2 ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : Re(i.CULL_FACE), b = D;
  }
  function rt(D) {
    D !== q && (X && i.lineWidth(D), q = D);
  }
  function fe(D, Q, ie) {
    D ? (ne(i.POLYGON_OFFSET_FILL), (V !== Q || H !== ie) && (i.polygonOffset(Q, ie), V = Q, H = ie)) : Re(i.POLYGON_OFFSET_FILL);
  }
  function ze(D) {
    D ? ne(i.SCISSOR_TEST) : Re(i.SCISSOR_TEST);
  }
  function xt(D) {
    D === void 0 && (D = i.TEXTURE0 + Z - 1), se !== D && (i.activeTexture(D), se = D);
  }
  function dt(D, Q, ie) {
    ie === void 0 && (se === null ? ie = i.TEXTURE0 + Z - 1 : ie = se);
    let de = he[ie];
    de === void 0 && (de = { type: void 0, texture: void 0 }, he[ie] = de), (de.type !== D || de.texture !== Q) && (se !== ie && (i.activeTexture(ie), se = ie), i.bindTexture(D, Q || ae[D]), de.type = D, de.texture = Q);
  }
  function T() {
    const D = he[se];
    D !== void 0 && D.type !== void 0 && (i.bindTexture(D.type, null), D.type = void 0, D.texture = void 0);
  }
  function v() {
    try {
      i.compressedTexImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function N() {
    try {
      i.compressedTexImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function k() {
    try {
      i.texSubImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function K() {
    try {
      i.texSubImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function G() {
    try {
      i.compressedTexSubImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Me() {
    try {
      i.compressedTexSubImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function te() {
    try {
      i.texStorage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function ge() {
    try {
      i.texStorage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function _e() {
    try {
      i.texImage2D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function J() {
    try {
      i.texImage3D(...arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function ce(D) {
    it.equals(D) === !1 && (i.scissor(D.x, D.y, D.z, D.w), it.copy(D));
  }
  function De(D) {
    je.equals(D) === !1 && (i.viewport(D.x, D.y, D.z, D.w), je.copy(D));
  }
  function ve(D, Q) {
    let ie = l.get(Q);
    ie === void 0 && (ie = /* @__PURE__ */ new WeakMap(), l.set(Q, ie));
    let de = ie.get(D);
    de === void 0 && (de = i.getUniformBlockIndex(Q, D.name), ie.set(D, de));
  }
  function oe(D, Q) {
    const de = l.get(Q).get(D);
    c.get(Q) !== de && (i.uniformBlockBinding(Q, de, D.__bindingPointIndex), c.set(Q, de));
  }
  function Fe() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.depthMask(!0), i.depthFunc(i.LESS), a.setReversed(!1), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), h = {}, se = null, he = {}, f = {}, d = /* @__PURE__ */ new WeakMap(), p = [], g = null, _ = !1, m = null, u = null, A = null, E = null, M = null, C = null, R = null, L = new Se(0, 0, 0), F = 0, y = !1, S = null, b = null, q = null, V = null, H = null, it.set(0, 0, i.canvas.width, i.canvas.height), je.set(0, 0, i.canvas.width, i.canvas.height), s.reset(), a.reset(), o.reset();
  }
  return {
    buffers: {
      color: s,
      depth: a,
      stencil: o
    },
    enable: ne,
    disable: Re,
    bindFramebuffer: Ce,
    drawBuffers: Ue,
    useProgram: ut,
    setBlending: et,
    setMaterial: Ae,
    setFlipSided: qe,
    setCullFace: ye,
    setLineWidth: rt,
    setPolygonOffset: fe,
    setScissorTest: ze,
    activeTexture: xt,
    bindTexture: dt,
    unbindTexture: T,
    compressedTexImage2D: v,
    compressedTexImage3D: N,
    texImage2D: _e,
    texImage3D: J,
    updateUBOMapping: ve,
    uniformBlockBinding: oe,
    texStorage2D: te,
    texStorage3D: ge,
    texSubImage2D: k,
    texSubImage3D: K,
    compressedTexSubImage2D: G,
    compressedTexSubImage3D: Me,
    scissor: ce,
    viewport: De,
    reset: Fe
  };
}
function bd(i, e, t, n, r, s, a) {
  const o = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, c = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), l = new we(), h = /* @__PURE__ */ new WeakMap();
  let f;
  const d = /* @__PURE__ */ new WeakMap();
  let p = !1;
  try {
    p = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(T, v) {
    return p ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(T, v)
    ) : ir("canvas");
  }
  function _(T, v, N) {
    let k = 1;
    const K = dt(T);
    if ((K.width > N || K.height > N) && (k = N / Math.max(K.width, K.height)), k < 1)
      if (typeof HTMLImageElement < "u" && T instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && T instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && T instanceof ImageBitmap || typeof VideoFrame < "u" && T instanceof VideoFrame) {
        const G = Math.floor(k * K.width), Me = Math.floor(k * K.height);
        f === void 0 && (f = g(G, Me));
        const te = v ? g(G, Me) : f;
        return te.width = G, te.height = Me, te.getContext("2d").drawImage(T, 0, 0, G, Me), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + K.width + "x" + K.height + ") to (" + G + "x" + Me + ")."), te;
      } else
        return "data" in T && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + K.width + "x" + K.height + ")."), T;
    return T;
  }
  function m(T) {
    return T.generateMipmaps;
  }
  function u(T) {
    i.generateMipmap(T);
  }
  function A(T) {
    return T.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : T.isWebGL3DRenderTarget ? i.TEXTURE_3D : T.isWebGLArrayRenderTarget || T.isCompressedArrayTexture ? i.TEXTURE_2D_ARRAY : i.TEXTURE_2D;
  }
  function E(T, v, N, k, K = !1) {
    if (T !== null) {
      if (i[T] !== void 0) return i[T];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + T + "'");
    }
    let G = v;
    if (v === i.RED && (N === i.FLOAT && (G = i.R32F), N === i.HALF_FLOAT && (G = i.R16F), N === i.UNSIGNED_BYTE && (G = i.R8)), v === i.RED_INTEGER && (N === i.UNSIGNED_BYTE && (G = i.R8UI), N === i.UNSIGNED_SHORT && (G = i.R16UI), N === i.UNSIGNED_INT && (G = i.R32UI), N === i.BYTE && (G = i.R8I), N === i.SHORT && (G = i.R16I), N === i.INT && (G = i.R32I)), v === i.RG && (N === i.FLOAT && (G = i.RG32F), N === i.HALF_FLOAT && (G = i.RG16F), N === i.UNSIGNED_BYTE && (G = i.RG8)), v === i.RG_INTEGER && (N === i.UNSIGNED_BYTE && (G = i.RG8UI), N === i.UNSIGNED_SHORT && (G = i.RG16UI), N === i.UNSIGNED_INT && (G = i.RG32UI), N === i.BYTE && (G = i.RG8I), N === i.SHORT && (G = i.RG16I), N === i.INT && (G = i.RG32I)), v === i.RGB_INTEGER && (N === i.UNSIGNED_BYTE && (G = i.RGB8UI), N === i.UNSIGNED_SHORT && (G = i.RGB16UI), N === i.UNSIGNED_INT && (G = i.RGB32UI), N === i.BYTE && (G = i.RGB8I), N === i.SHORT && (G = i.RGB16I), N === i.INT && (G = i.RGB32I)), v === i.RGBA_INTEGER && (N === i.UNSIGNED_BYTE && (G = i.RGBA8UI), N === i.UNSIGNED_SHORT && (G = i.RGBA16UI), N === i.UNSIGNED_INT && (G = i.RGBA32UI), N === i.BYTE && (G = i.RGBA8I), N === i.SHORT && (G = i.RGBA16I), N === i.INT && (G = i.RGBA32I)), v === i.RGB && N === i.UNSIGNED_INT_5_9_9_9_REV && (G = i.RGB9_E5), v === i.RGBA) {
      const Me = K ? nr : We.getTransfer(k);
      N === i.FLOAT && (G = i.RGBA32F), N === i.HALF_FLOAT && (G = i.RGBA16F), N === i.UNSIGNED_BYTE && (G = Me === Ke ? i.SRGB8_ALPHA8 : i.RGBA8), N === i.UNSIGNED_SHORT_4_4_4_4 && (G = i.RGBA4), N === i.UNSIGNED_SHORT_5_5_5_1 && (G = i.RGB5_A1);
    }
    return (G === i.R16F || G === i.R32F || G === i.RG16F || G === i.RG32F || G === i.RGBA16F || G === i.RGBA32F) && e.get("EXT_color_buffer_float"), G;
  }
  function M(T, v) {
    let N;
    return T ? v === null || v === 1014 || v === 1020 ? N = i.DEPTH24_STENCIL8 : v === 1015 ? N = i.DEPTH32F_STENCIL8 : v === 1012 && (N = i.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : v === null || v === 1014 || v === 1020 ? N = i.DEPTH_COMPONENT24 : v === 1015 ? N = i.DEPTH_COMPONENT32F : v === 1012 && (N = i.DEPTH_COMPONENT16), N;
  }
  function C(T, v) {
    return m(T) === !0 || T.isFramebufferTexture && T.minFilter !== 1003 && T.minFilter !== 1006 ? Math.log2(Math.max(v.width, v.height)) + 1 : T.mipmaps !== void 0 && T.mipmaps.length > 0 ? T.mipmaps.length : T.isCompressedTexture && Array.isArray(T.image) ? v.mipmaps.length : 1;
  }
  function R(T) {
    const v = T.target;
    v.removeEventListener("dispose", R), F(v), v.isVideoTexture && h.delete(v);
  }
  function L(T) {
    const v = T.target;
    v.removeEventListener("dispose", L), S(v);
  }
  function F(T) {
    const v = n.get(T);
    if (v.__webglInit === void 0) return;
    const N = T.source, k = d.get(N);
    if (k) {
      const K = k[v.__cacheKey];
      K.usedTimes--, K.usedTimes === 0 && y(T), Object.keys(k).length === 0 && d.delete(N);
    }
    n.remove(T);
  }
  function y(T) {
    const v = n.get(T);
    i.deleteTexture(v.__webglTexture);
    const N = T.source, k = d.get(N);
    delete k[v.__cacheKey], a.memory.textures--;
  }
  function S(T) {
    const v = n.get(T);
    if (T.depthTexture && (T.depthTexture.dispose(), n.remove(T.depthTexture)), T.isWebGLCubeRenderTarget)
      for (let k = 0; k < 6; k++) {
        if (Array.isArray(v.__webglFramebuffer[k]))
          for (let K = 0; K < v.__webglFramebuffer[k].length; K++) i.deleteFramebuffer(v.__webglFramebuffer[k][K]);
        else
          i.deleteFramebuffer(v.__webglFramebuffer[k]);
        v.__webglDepthbuffer && i.deleteRenderbuffer(v.__webglDepthbuffer[k]);
      }
    else {
      if (Array.isArray(v.__webglFramebuffer))
        for (let k = 0; k < v.__webglFramebuffer.length; k++) i.deleteFramebuffer(v.__webglFramebuffer[k]);
      else
        i.deleteFramebuffer(v.__webglFramebuffer);
      if (v.__webglDepthbuffer && i.deleteRenderbuffer(v.__webglDepthbuffer), v.__webglMultisampledFramebuffer && i.deleteFramebuffer(v.__webglMultisampledFramebuffer), v.__webglColorRenderbuffer)
        for (let k = 0; k < v.__webglColorRenderbuffer.length; k++)
          v.__webglColorRenderbuffer[k] && i.deleteRenderbuffer(v.__webglColorRenderbuffer[k]);
      v.__webglDepthRenderbuffer && i.deleteRenderbuffer(v.__webglDepthRenderbuffer);
    }
    const N = T.textures;
    for (let k = 0, K = N.length; k < K; k++) {
      const G = n.get(N[k]);
      G.__webglTexture && (i.deleteTexture(G.__webglTexture), a.memory.textures--), n.remove(N[k]);
    }
    n.remove(T);
  }
  let b = 0;
  function q() {
    b = 0;
  }
  function V() {
    const T = b;
    return T >= r.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + T + " texture units while this GPU supports only " + r.maxTextures), b += 1, T;
  }
  function H(T) {
    const v = [];
    return v.push(T.wrapS), v.push(T.wrapT), v.push(T.wrapR || 0), v.push(T.magFilter), v.push(T.minFilter), v.push(T.anisotropy), v.push(T.internalFormat), v.push(T.format), v.push(T.type), v.push(T.generateMipmaps), v.push(T.premultiplyAlpha), v.push(T.flipY), v.push(T.unpackAlignment), v.push(T.colorSpace), v.join();
  }
  function Z(T, v) {
    const N = n.get(T);
    if (T.isVideoTexture && ze(T), T.isRenderTargetTexture === !1 && T.isExternalTexture !== !0 && T.version > 0 && N.__version !== T.version) {
      const k = T.image;
      if (k === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (k.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        ae(N, T, v);
        return;
      }
    } else T.isExternalTexture && (N.__webglTexture = T.sourceTexture ? T.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D, N.__webglTexture, i.TEXTURE0 + v);
  }
  function X(T, v) {
    const N = n.get(T);
    if (T.isRenderTargetTexture === !1 && T.version > 0 && N.__version !== T.version) {
      ae(N, T, v);
      return;
    }
    t.bindTexture(i.TEXTURE_2D_ARRAY, N.__webglTexture, i.TEXTURE0 + v);
  }
  function ee(T, v) {
    const N = n.get(T);
    if (T.isRenderTargetTexture === !1 && T.version > 0 && N.__version !== T.version) {
      ae(N, T, v);
      return;
    }
    t.bindTexture(i.TEXTURE_3D, N.__webglTexture, i.TEXTURE0 + v);
  }
  function z(T, v) {
    const N = n.get(T);
    if (T.version > 0 && N.__version !== T.version) {
      ne(N, T, v);
      return;
    }
    t.bindTexture(i.TEXTURE_CUBE_MAP, N.__webglTexture, i.TEXTURE0 + v);
  }
  const se = {
    1e3: i.REPEAT,
    1001: i.CLAMP_TO_EDGE,
    1002: i.MIRRORED_REPEAT
  }, he = {
    1003: i.NEAREST,
    1004: i.NEAREST_MIPMAP_NEAREST,
    1005: i.NEAREST_MIPMAP_LINEAR,
    1006: i.LINEAR,
    1007: i.LINEAR_MIPMAP_NEAREST,
    1008: i.LINEAR_MIPMAP_LINEAR
  }, Ee = {
    512: i.NEVER,
    519: i.ALWAYS,
    513: i.LESS,
    515: i.LEQUAL,
    514: i.EQUAL,
    518: i.GEQUAL,
    516: i.GREATER,
    517: i.NOTEQUAL
  };
  function Oe(T, v) {
    if (v.type === 1015 && e.has("OES_texture_float_linear") === !1 && (v.magFilter === 1006 || v.magFilter === 1007 || v.magFilter === 1005 || v.magFilter === 1008 || v.minFilter === 1006 || v.minFilter === 1007 || v.minFilter === 1005 || v.minFilter === 1008) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(T, i.TEXTURE_WRAP_S, se[v.wrapS]), i.texParameteri(T, i.TEXTURE_WRAP_T, se[v.wrapT]), (T === i.TEXTURE_3D || T === i.TEXTURE_2D_ARRAY) && i.texParameteri(T, i.TEXTURE_WRAP_R, se[v.wrapR]), i.texParameteri(T, i.TEXTURE_MAG_FILTER, he[v.magFilter]), i.texParameteri(T, i.TEXTURE_MIN_FILTER, he[v.minFilter]), v.compareFunction && (i.texParameteri(T, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(T, i.TEXTURE_COMPARE_FUNC, Ee[v.compareFunction])), e.has("EXT_texture_filter_anisotropic") === !0) {
      if (v.magFilter === 1003 || v.minFilter !== 1005 && v.minFilter !== 1008 || v.type === 1015 && e.has("OES_texture_float_linear") === !1) return;
      if (v.anisotropy > 1 || n.get(v).__currentAnisotropy) {
        const N = e.get("EXT_texture_filter_anisotropic");
        i.texParameterf(T, N.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(v.anisotropy, r.getMaxAnisotropy())), n.get(v).__currentAnisotropy = v.anisotropy;
      }
    }
  }
  function it(T, v) {
    let N = !1;
    T.__webglInit === void 0 && (T.__webglInit = !0, v.addEventListener("dispose", R));
    const k = v.source;
    let K = d.get(k);
    K === void 0 && (K = {}, d.set(k, K));
    const G = H(v);
    if (G !== T.__cacheKey) {
      K[G] === void 0 && (K[G] = {
        texture: i.createTexture(),
        usedTimes: 0
      }, a.memory.textures++, N = !0), K[G].usedTimes++;
      const Me = K[T.__cacheKey];
      Me !== void 0 && (K[T.__cacheKey].usedTimes--, Me.usedTimes === 0 && y(v)), T.__cacheKey = G, T.__webglTexture = K[G].texture;
    }
    return N;
  }
  function je(T, v, N) {
    return Math.floor(Math.floor(T / N) / v);
  }
  function W(T, v, N, k) {
    const G = T.updateRanges;
    if (G.length === 0)
      t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, v.width, v.height, N, k, v.data);
    else {
      G.sort((J, ce) => J.start - ce.start);
      let Me = 0;
      for (let J = 1; J < G.length; J++) {
        const ce = G[Me], De = G[J], ve = ce.start + ce.count, oe = je(De.start, v.width, 4), Fe = je(ce.start, v.width, 4);
        De.start <= ve + 1 && oe === Fe && je(De.start + De.count - 1, v.width, 4) === oe ? ce.count = Math.max(
          ce.count,
          De.start + De.count - ce.start
        ) : (++Me, G[Me] = De);
      }
      G.length = Me + 1;
      const te = i.getParameter(i.UNPACK_ROW_LENGTH), ge = i.getParameter(i.UNPACK_SKIP_PIXELS), _e = i.getParameter(i.UNPACK_SKIP_ROWS);
      i.pixelStorei(i.UNPACK_ROW_LENGTH, v.width);
      for (let J = 0, ce = G.length; J < ce; J++) {
        const De = G[J], ve = Math.floor(De.start / 4), oe = Math.ceil(De.count / 4), Fe = ve % v.width, D = Math.floor(ve / v.width), Q = oe, ie = 1;
        i.pixelStorei(i.UNPACK_SKIP_PIXELS, Fe), i.pixelStorei(i.UNPACK_SKIP_ROWS, D), t.texSubImage2D(i.TEXTURE_2D, 0, Fe, D, Q, ie, N, k, v.data);
      }
      T.clearUpdateRanges(), i.pixelStorei(i.UNPACK_ROW_LENGTH, te), i.pixelStorei(i.UNPACK_SKIP_PIXELS, ge), i.pixelStorei(i.UNPACK_SKIP_ROWS, _e);
    }
  }
  function ae(T, v, N) {
    let k = i.TEXTURE_2D;
    (v.isDataArrayTexture || v.isCompressedArrayTexture) && (k = i.TEXTURE_2D_ARRAY), v.isData3DTexture && (k = i.TEXTURE_3D);
    const K = it(T, v), G = v.source;
    t.bindTexture(k, T.__webglTexture, i.TEXTURE0 + N);
    const Me = n.get(G);
    if (G.version !== Me.__version || K === !0) {
      t.activeTexture(i.TEXTURE0 + N);
      const te = We.getPrimaries(We.workingColorSpace), ge = v.colorSpace === "" ? null : We.getPrimaries(v.colorSpace), _e = v.colorSpace === "" || te === ge ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, v.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, v.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, _e);
      let J = _(v.image, !1, r.maxTextureSize);
      J = xt(v, J);
      const ce = s.convert(v.format, v.colorSpace), De = s.convert(v.type);
      let ve = E(v.internalFormat, ce, De, v.colorSpace, v.isVideoTexture);
      Oe(k, v);
      let oe;
      const Fe = v.mipmaps, D = v.isVideoTexture !== !0, Q = Me.__version === void 0 || K === !0, ie = G.dataReady, de = C(v, J);
      if (v.isDepthTexture)
        ve = M(v.format === 1027, v.type), Q && (D ? t.texStorage2D(i.TEXTURE_2D, 1, ve, J.width, J.height) : t.texImage2D(i.TEXTURE_2D, 0, ve, J.width, J.height, 0, ce, De, null));
      else if (v.isDataTexture)
        if (Fe.length > 0) {
          D && Q && t.texStorage2D(i.TEXTURE_2D, de, ve, Fe[0].width, Fe[0].height);
          for (let $ = 0, Y = Fe.length; $ < Y; $++)
            oe = Fe[$], D ? ie && t.texSubImage2D(i.TEXTURE_2D, $, 0, 0, oe.width, oe.height, ce, De, oe.data) : t.texImage2D(i.TEXTURE_2D, $, ve, oe.width, oe.height, 0, ce, De, oe.data);
          v.generateMipmaps = !1;
        } else
          D ? (Q && t.texStorage2D(i.TEXTURE_2D, de, ve, J.width, J.height), ie && W(v, J, ce, De)) : t.texImage2D(i.TEXTURE_2D, 0, ve, J.width, J.height, 0, ce, De, J.data);
      else if (v.isCompressedTexture)
        if (v.isCompressedArrayTexture) {
          D && Q && t.texStorage3D(i.TEXTURE_2D_ARRAY, de, ve, Fe[0].width, Fe[0].height, J.depth);
          for (let $ = 0, Y = Fe.length; $ < Y; $++)
            if (oe = Fe[$], v.format !== 1023)
              if (ce !== null)
                if (D) {
                  if (ie)
                    if (v.layerUpdates.size > 0) {
                      const me = Gs(oe.width, oe.height, v.format, v.type);
                      for (const Ie of v.layerUpdates) {
                        const tt = oe.data.subarray(
                          Ie * me / oe.data.BYTES_PER_ELEMENT,
                          (Ie + 1) * me / oe.data.BYTES_PER_ELEMENT
                        );
                        t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, $, 0, 0, Ie, oe.width, oe.height, 1, ce, tt);
                      }
                      v.clearLayerUpdates();
                    } else
                      t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, $, 0, 0, 0, oe.width, oe.height, J.depth, ce, oe.data);
                } else
                  t.compressedTexImage3D(i.TEXTURE_2D_ARRAY, $, ve, oe.width, oe.height, J.depth, 0, oe.data, 0, 0);
              else
                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              D ? ie && t.texSubImage3D(i.TEXTURE_2D_ARRAY, $, 0, 0, 0, oe.width, oe.height, J.depth, ce, De, oe.data) : t.texImage3D(i.TEXTURE_2D_ARRAY, $, ve, oe.width, oe.height, J.depth, 0, ce, De, oe.data);
        } else {
          D && Q && t.texStorage2D(i.TEXTURE_2D, de, ve, Fe[0].width, Fe[0].height);
          for (let $ = 0, Y = Fe.length; $ < Y; $++)
            oe = Fe[$], v.format !== 1023 ? ce !== null ? D ? ie && t.compressedTexSubImage2D(i.TEXTURE_2D, $, 0, 0, oe.width, oe.height, ce, oe.data) : t.compressedTexImage2D(i.TEXTURE_2D, $, ve, oe.width, oe.height, 0, oe.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : D ? ie && t.texSubImage2D(i.TEXTURE_2D, $, 0, 0, oe.width, oe.height, ce, De, oe.data) : t.texImage2D(i.TEXTURE_2D, $, ve, oe.width, oe.height, 0, ce, De, oe.data);
        }
      else if (v.isDataArrayTexture)
        if (D) {
          if (Q && t.texStorage3D(i.TEXTURE_2D_ARRAY, de, ve, J.width, J.height, J.depth), ie)
            if (v.layerUpdates.size > 0) {
              const $ = Gs(J.width, J.height, v.format, v.type);
              for (const Y of v.layerUpdates) {
                const me = J.data.subarray(
                  Y * $ / J.data.BYTES_PER_ELEMENT,
                  (Y + 1) * $ / J.data.BYTES_PER_ELEMENT
                );
                t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, Y, J.width, J.height, 1, ce, De, me);
              }
              v.clearLayerUpdates();
            } else
              t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, J.width, J.height, J.depth, ce, De, J.data);
        } else
          t.texImage3D(i.TEXTURE_2D_ARRAY, 0, ve, J.width, J.height, J.depth, 0, ce, De, J.data);
      else if (v.isData3DTexture)
        D ? (Q && t.texStorage3D(i.TEXTURE_3D, de, ve, J.width, J.height, J.depth), ie && t.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, J.width, J.height, J.depth, ce, De, J.data)) : t.texImage3D(i.TEXTURE_3D, 0, ve, J.width, J.height, J.depth, 0, ce, De, J.data);
      else if (v.isFramebufferTexture) {
        if (Q)
          if (D)
            t.texStorage2D(i.TEXTURE_2D, de, ve, J.width, J.height);
          else {
            let $ = J.width, Y = J.height;
            for (let me = 0; me < de; me++)
              t.texImage2D(i.TEXTURE_2D, me, ve, $, Y, 0, ce, De, null), $ >>= 1, Y >>= 1;
          }
      } else if (Fe.length > 0) {
        if (D && Q) {
          const $ = dt(Fe[0]);
          t.texStorage2D(i.TEXTURE_2D, de, ve, $.width, $.height);
        }
        for (let $ = 0, Y = Fe.length; $ < Y; $++)
          oe = Fe[$], D ? ie && t.texSubImage2D(i.TEXTURE_2D, $, 0, 0, ce, De, oe) : t.texImage2D(i.TEXTURE_2D, $, ve, ce, De, oe);
        v.generateMipmaps = !1;
      } else if (D) {
        if (Q) {
          const $ = dt(J);
          t.texStorage2D(i.TEXTURE_2D, de, ve, $.width, $.height);
        }
        ie && t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, ce, De, J);
      } else
        t.texImage2D(i.TEXTURE_2D, 0, ve, ce, De, J);
      m(v) && u(k), Me.__version = G.version, v.onUpdate && v.onUpdate(v);
    }
    T.__version = v.version;
  }
  function ne(T, v, N) {
    if (v.image.length !== 6) return;
    const k = it(T, v), K = v.source;
    t.bindTexture(i.TEXTURE_CUBE_MAP, T.__webglTexture, i.TEXTURE0 + N);
    const G = n.get(K);
    if (K.version !== G.__version || k === !0) {
      t.activeTexture(i.TEXTURE0 + N);
      const Me = We.getPrimaries(We.workingColorSpace), te = v.colorSpace === "" ? null : We.getPrimaries(v.colorSpace), ge = v.colorSpace === "" || Me === te ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, v.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, v.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, v.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, ge);
      const _e = v.isCompressedTexture || v.image[0].isCompressedTexture, J = v.image[0] && v.image[0].isDataTexture, ce = [];
      for (let Y = 0; Y < 6; Y++)
        !_e && !J ? ce[Y] = _(v.image[Y], !0, r.maxCubemapSize) : ce[Y] = J ? v.image[Y].image : v.image[Y], ce[Y] = xt(v, ce[Y]);
      const De = ce[0], ve = s.convert(v.format, v.colorSpace), oe = s.convert(v.type), Fe = E(v.internalFormat, ve, oe, v.colorSpace), D = v.isVideoTexture !== !0, Q = G.__version === void 0 || k === !0, ie = K.dataReady;
      let de = C(v, De);
      Oe(i.TEXTURE_CUBE_MAP, v);
      let $;
      if (_e) {
        D && Q && t.texStorage2D(i.TEXTURE_CUBE_MAP, de, Fe, De.width, De.height);
        for (let Y = 0; Y < 6; Y++) {
          $ = ce[Y].mipmaps;
          for (let me = 0; me < $.length; me++) {
            const Ie = $[me];
            v.format !== 1023 ? ve !== null ? D ? ie && t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me, 0, 0, Ie.width, Ie.height, ve, Ie.data) : t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me, Fe, Ie.width, Ie.height, 0, Ie.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : D ? ie && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me, 0, 0, Ie.width, Ie.height, ve, oe, Ie.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me, Fe, Ie.width, Ie.height, 0, ve, oe, Ie.data);
          }
        }
      } else {
        if ($ = v.mipmaps, D && Q) {
          $.length > 0 && de++;
          const Y = dt(ce[0]);
          t.texStorage2D(i.TEXTURE_CUBE_MAP, de, Fe, Y.width, Y.height);
        }
        for (let Y = 0; Y < 6; Y++)
          if (J) {
            D ? ie && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, 0, 0, ce[Y].width, ce[Y].height, ve, oe, ce[Y].data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, Fe, ce[Y].width, ce[Y].height, 0, ve, oe, ce[Y].data);
            for (let me = 0; me < $.length; me++) {
              const tt = $[me].image[Y].image;
              D ? ie && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me + 1, 0, 0, tt.width, tt.height, ve, oe, tt.data) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me + 1, Fe, tt.width, tt.height, 0, ve, oe, tt.data);
            }
          } else {
            D ? ie && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, 0, 0, ve, oe, ce[Y]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, 0, Fe, ve, oe, ce[Y]);
            for (let me = 0; me < $.length; me++) {
              const Ie = $[me];
              D ? ie && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me + 1, 0, 0, ve, oe, Ie.image[Y]) : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + Y, me + 1, Fe, ve, oe, Ie.image[Y]);
            }
          }
      }
      m(v) && u(i.TEXTURE_CUBE_MAP), G.__version = K.version, v.onUpdate && v.onUpdate(v);
    }
    T.__version = v.version;
  }
  function Re(T, v, N, k, K, G) {
    const Me = s.convert(N.format, N.colorSpace), te = s.convert(N.type), ge = E(N.internalFormat, Me, te, N.colorSpace), _e = n.get(v), J = n.get(N);
    if (J.__renderTarget = v, !_e.__hasExternalTextures) {
      const ce = Math.max(1, v.width >> G), De = Math.max(1, v.height >> G);
      K === i.TEXTURE_3D || K === i.TEXTURE_2D_ARRAY ? t.texImage3D(K, G, ge, ce, De, v.depth, 0, Me, te, null) : t.texImage2D(K, G, ge, ce, De, 0, Me, te, null);
    }
    t.bindFramebuffer(i.FRAMEBUFFER, T), fe(v) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, k, K, J.__webglTexture, 0, rt(v)) : (K === i.TEXTURE_2D || K >= i.TEXTURE_CUBE_MAP_POSITIVE_X && K <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, k, K, J.__webglTexture, G), t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function Ce(T, v, N) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, T), v.depthBuffer) {
      const k = v.depthTexture, K = k && k.isDepthTexture ? k.type : null, G = M(v.stencilBuffer, K), Me = v.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, te = rt(v);
      fe(v) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, te, G, v.width, v.height) : N ? i.renderbufferStorageMultisample(i.RENDERBUFFER, te, G, v.width, v.height) : i.renderbufferStorage(i.RENDERBUFFER, G, v.width, v.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, Me, i.RENDERBUFFER, T);
    } else {
      const k = v.textures;
      for (let K = 0; K < k.length; K++) {
        const G = k[K], Me = s.convert(G.format, G.colorSpace), te = s.convert(G.type), ge = E(G.internalFormat, Me, te, G.colorSpace), _e = rt(v);
        N && fe(v) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, _e, ge, v.width, v.height) : fe(v) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, _e, ge, v.width, v.height) : i.renderbufferStorage(i.RENDERBUFFER, ge, v.width, v.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function Ue(T, v) {
    if (v && v.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (t.bindFramebuffer(i.FRAMEBUFFER, T), !(v.depthTexture && v.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const k = n.get(v.depthTexture);
    k.__renderTarget = v, (!k.__webglTexture || v.depthTexture.image.width !== v.width || v.depthTexture.image.height !== v.height) && (v.depthTexture.image.width = v.width, v.depthTexture.image.height = v.height, v.depthTexture.needsUpdate = !0), Z(v.depthTexture, 0);
    const K = k.__webglTexture, G = rt(v);
    if (v.depthTexture.format === 1026)
      fe(v) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, K, 0, G) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, K, 0);
    else if (v.depthTexture.format === 1027)
      fe(v) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, K, 0, G) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, K, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function ut(T) {
    const v = n.get(T), N = T.isWebGLCubeRenderTarget === !0;
    if (v.__boundDepthTexture !== T.depthTexture) {
      const k = T.depthTexture;
      if (v.__depthDisposeCallback && v.__depthDisposeCallback(), k) {
        const K = () => {
          delete v.__boundDepthTexture, delete v.__depthDisposeCallback, k.removeEventListener("dispose", K);
        };
        k.addEventListener("dispose", K), v.__depthDisposeCallback = K;
      }
      v.__boundDepthTexture = k;
    }
    if (T.depthTexture && !v.__autoAllocateDepthBuffer) {
      if (N) throw new Error("target.depthTexture not supported in Cube render targets");
      const k = T.texture.mipmaps;
      k && k.length > 0 ? Ue(v.__webglFramebuffer[0], T) : Ue(v.__webglFramebuffer, T);
    } else if (N) {
      v.__webglDepthbuffer = [];
      for (let k = 0; k < 6; k++)
        if (t.bindFramebuffer(i.FRAMEBUFFER, v.__webglFramebuffer[k]), v.__webglDepthbuffer[k] === void 0)
          v.__webglDepthbuffer[k] = i.createRenderbuffer(), Ce(v.__webglDepthbuffer[k], T, !1);
        else {
          const K = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, G = v.__webglDepthbuffer[k];
          i.bindRenderbuffer(i.RENDERBUFFER, G), i.framebufferRenderbuffer(i.FRAMEBUFFER, K, i.RENDERBUFFER, G);
        }
    } else {
      const k = T.texture.mipmaps;
      if (k && k.length > 0 ? t.bindFramebuffer(i.FRAMEBUFFER, v.__webglFramebuffer[0]) : t.bindFramebuffer(i.FRAMEBUFFER, v.__webglFramebuffer), v.__webglDepthbuffer === void 0)
        v.__webglDepthbuffer = i.createRenderbuffer(), Ce(v.__webglDepthbuffer, T, !1);
      else {
        const K = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, G = v.__webglDepthbuffer;
        i.bindRenderbuffer(i.RENDERBUFFER, G), i.framebufferRenderbuffer(i.FRAMEBUFFER, K, i.RENDERBUFFER, G);
      }
    }
    t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function ke(T, v, N) {
    const k = n.get(T);
    v !== void 0 && Re(k.__webglFramebuffer, T, T.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), N !== void 0 && ut(T);
  }
  function w(T) {
    const v = T.texture, N = n.get(T), k = n.get(v);
    T.addEventListener("dispose", L);
    const K = T.textures, G = T.isWebGLCubeRenderTarget === !0, Me = K.length > 1;
    if (Me || (k.__webglTexture === void 0 && (k.__webglTexture = i.createTexture()), k.__version = v.version, a.memory.textures++), G) {
      N.__webglFramebuffer = [];
      for (let te = 0; te < 6; te++)
        if (v.mipmaps && v.mipmaps.length > 0) {
          N.__webglFramebuffer[te] = [];
          for (let ge = 0; ge < v.mipmaps.length; ge++)
            N.__webglFramebuffer[te][ge] = i.createFramebuffer();
        } else
          N.__webglFramebuffer[te] = i.createFramebuffer();
    } else {
      if (v.mipmaps && v.mipmaps.length > 0) {
        N.__webglFramebuffer = [];
        for (let te = 0; te < v.mipmaps.length; te++)
          N.__webglFramebuffer[te] = i.createFramebuffer();
      } else
        N.__webglFramebuffer = i.createFramebuffer();
      if (Me)
        for (let te = 0, ge = K.length; te < ge; te++) {
          const _e = n.get(K[te]);
          _e.__webglTexture === void 0 && (_e.__webglTexture = i.createTexture(), a.memory.textures++);
        }
      if (T.samples > 0 && fe(T) === !1) {
        N.__webglMultisampledFramebuffer = i.createFramebuffer(), N.__webglColorRenderbuffer = [], t.bindFramebuffer(i.FRAMEBUFFER, N.__webglMultisampledFramebuffer);
        for (let te = 0; te < K.length; te++) {
          const ge = K[te];
          N.__webglColorRenderbuffer[te] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, N.__webglColorRenderbuffer[te]);
          const _e = s.convert(ge.format, ge.colorSpace), J = s.convert(ge.type), ce = E(ge.internalFormat, _e, J, ge.colorSpace, T.isXRRenderTarget === !0), De = rt(T);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, De, ce, T.width, T.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + te, i.RENDERBUFFER, N.__webglColorRenderbuffer[te]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), T.depthBuffer && (N.__webglDepthRenderbuffer = i.createRenderbuffer(), Ce(N.__webglDepthRenderbuffer, T, !0)), t.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (G) {
      t.bindTexture(i.TEXTURE_CUBE_MAP, k.__webglTexture), Oe(i.TEXTURE_CUBE_MAP, v);
      for (let te = 0; te < 6; te++)
        if (v.mipmaps && v.mipmaps.length > 0)
          for (let ge = 0; ge < v.mipmaps.length; ge++)
            Re(N.__webglFramebuffer[te][ge], T, v, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + te, ge);
        else
          Re(N.__webglFramebuffer[te], T, v, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + te, 0);
      m(v) && u(i.TEXTURE_CUBE_MAP), t.unbindTexture();
    } else if (Me) {
      for (let te = 0, ge = K.length; te < ge; te++) {
        const _e = K[te], J = n.get(_e);
        let ce = i.TEXTURE_2D;
        (T.isWebGL3DRenderTarget || T.isWebGLArrayRenderTarget) && (ce = T.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), t.bindTexture(ce, J.__webglTexture), Oe(ce, _e), Re(N.__webglFramebuffer, T, _e, i.COLOR_ATTACHMENT0 + te, ce, 0), m(_e) && u(ce);
      }
      t.unbindTexture();
    } else {
      let te = i.TEXTURE_2D;
      if ((T.isWebGL3DRenderTarget || T.isWebGLArrayRenderTarget) && (te = T.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), t.bindTexture(te, k.__webglTexture), Oe(te, v), v.mipmaps && v.mipmaps.length > 0)
        for (let ge = 0; ge < v.mipmaps.length; ge++)
          Re(N.__webglFramebuffer[ge], T, v, i.COLOR_ATTACHMENT0, te, ge);
      else
        Re(N.__webglFramebuffer, T, v, i.COLOR_ATTACHMENT0, te, 0);
      m(v) && u(te), t.unbindTexture();
    }
    T.depthBuffer && ut(T);
  }
  function et(T) {
    const v = T.textures;
    for (let N = 0, k = v.length; N < k; N++) {
      const K = v[N];
      if (m(K)) {
        const G = A(T), Me = n.get(K).__webglTexture;
        t.bindTexture(G, Me), u(G), t.unbindTexture();
      }
    }
  }
  const Ae = [], qe = [];
  function ye(T) {
    if (T.samples > 0) {
      if (fe(T) === !1) {
        const v = T.textures, N = T.width, k = T.height;
        let K = i.COLOR_BUFFER_BIT;
        const G = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, Me = n.get(T), te = v.length > 1;
        if (te)
          for (let _e = 0; _e < v.length; _e++)
            t.bindFramebuffer(i.FRAMEBUFFER, Me.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + _e, i.RENDERBUFFER, null), t.bindFramebuffer(i.FRAMEBUFFER, Me.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + _e, i.TEXTURE_2D, null, 0);
        t.bindFramebuffer(i.READ_FRAMEBUFFER, Me.__webglMultisampledFramebuffer);
        const ge = T.texture.mipmaps;
        ge && ge.length > 0 ? t.bindFramebuffer(i.DRAW_FRAMEBUFFER, Me.__webglFramebuffer[0]) : t.bindFramebuffer(i.DRAW_FRAMEBUFFER, Me.__webglFramebuffer);
        for (let _e = 0; _e < v.length; _e++) {
          if (T.resolveDepthBuffer && (T.depthBuffer && (K |= i.DEPTH_BUFFER_BIT), T.stencilBuffer && T.resolveStencilBuffer && (K |= i.STENCIL_BUFFER_BIT)), te) {
            i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, Me.__webglColorRenderbuffer[_e]);
            const J = n.get(v[_e]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, J, 0);
          }
          i.blitFramebuffer(0, 0, N, k, 0, 0, N, k, K, i.NEAREST), c === !0 && (Ae.length = 0, qe.length = 0, Ae.push(i.COLOR_ATTACHMENT0 + _e), T.depthBuffer && T.resolveDepthBuffer === !1 && (Ae.push(G), qe.push(G), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, qe)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, Ae));
        }
        if (t.bindFramebuffer(i.READ_FRAMEBUFFER, null), t.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), te)
          for (let _e = 0; _e < v.length; _e++) {
            t.bindFramebuffer(i.FRAMEBUFFER, Me.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + _e, i.RENDERBUFFER, Me.__webglColorRenderbuffer[_e]);
            const J = n.get(v[_e]).__webglTexture;
            t.bindFramebuffer(i.FRAMEBUFFER, Me.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + _e, i.TEXTURE_2D, J, 0);
          }
        t.bindFramebuffer(i.DRAW_FRAMEBUFFER, Me.__webglMultisampledFramebuffer);
      } else if (T.depthBuffer && T.resolveDepthBuffer === !1 && c) {
        const v = T.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [v]);
      }
    }
  }
  function rt(T) {
    return Math.min(r.maxSamples, T.samples);
  }
  function fe(T) {
    const v = n.get(T);
    return T.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === !0 && v.__useRenderToTexture !== !1;
  }
  function ze(T) {
    const v = a.render.frame;
    h.get(T) !== v && (h.set(T, v), T.update());
  }
  function xt(T, v) {
    const N = T.colorSpace, k = T.format, K = T.type;
    return T.isCompressedTexture === !0 || T.isVideoTexture === !0 || N !== Jn && N !== "" && (We.getTransfer(N) === Ke ? (k !== 1023 || K !== 1009) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", N)), v;
  }
  function dt(T) {
    return typeof HTMLImageElement < "u" && T instanceof HTMLImageElement ? (l.width = T.naturalWidth || T.width, l.height = T.naturalHeight || T.height) : typeof VideoFrame < "u" && T instanceof VideoFrame ? (l.width = T.displayWidth, l.height = T.displayHeight) : (l.width = T.width, l.height = T.height), l;
  }
  this.allocateTextureUnit = V, this.resetTextureUnits = q, this.setTexture2D = Z, this.setTexture2DArray = X, this.setTexture3D = ee, this.setTextureCube = z, this.rebindTextures = ke, this.setupRenderTarget = w, this.updateRenderTargetMipmap = et, this.updateMultisampleRenderTarget = ye, this.setupDepthRenderbuffer = ut, this.setupFrameBufferTexture = Re, this.useMultisampledRTT = fe;
}
function wd(i, e) {
  function t(n, r = "") {
    let s;
    const a = We.getTransfer(r);
    if (n === 1009) return i.UNSIGNED_BYTE;
    if (n === 1017) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === 1018) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === 35902) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === 1010) return i.BYTE;
    if (n === 1011) return i.SHORT;
    if (n === 1012) return i.UNSIGNED_SHORT;
    if (n === 1013) return i.INT;
    if (n === 1014) return i.UNSIGNED_INT;
    if (n === 1015) return i.FLOAT;
    if (n === 1016) return i.HALF_FLOAT;
    if (n === 1021) return i.ALPHA;
    if (n === 1022) return i.RGB;
    if (n === 1023) return i.RGBA;
    if (n === 1026) return i.DEPTH_COMPONENT;
    if (n === 1027) return i.DEPTH_STENCIL;
    if (n === 1028) return i.RED;
    if (n === 1029) return i.RED_INTEGER;
    if (n === 1030) return i.RG;
    if (n === 1031) return i.RG_INTEGER;
    if (n === 1033) return i.RGBA_INTEGER;
    if (n === 33776 || n === 33777 || n === 33778 || n === 33779)
      if (a === Ke)
        if (s = e.get("WEBGL_compressed_texture_s3tc_srgb"), s !== null) {
          if (n === 33776) return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === 33777) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === 33778) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === 33779) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (s = e.get("WEBGL_compressed_texture_s3tc"), s !== null) {
        if (n === 33776) return s.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === 33777) return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === 33778) return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === 33779) return s.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (n === 35840 || n === 35841 || n === 35842 || n === 35843)
      if (s = e.get("WEBGL_compressed_texture_pvrtc"), s !== null) {
        if (n === 35840) return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === 35841) return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === 35842) return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === 35843) return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (n === 36196 || n === 37492 || n === 37496)
      if (s = e.get("WEBGL_compressed_texture_etc"), s !== null) {
        if (n === 36196 || n === 37492) return a === Ke ? s.COMPRESSED_SRGB8_ETC2 : s.COMPRESSED_RGB8_ETC2;
        if (n === 37496) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : s.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (n === 37808 || n === 37809 || n === 37810 || n === 37811 || n === 37812 || n === 37813 || n === 37814 || n === 37815 || n === 37816 || n === 37817 || n === 37818 || n === 37819 || n === 37820 || n === 37821)
      if (s = e.get("WEBGL_compressed_texture_astc"), s !== null) {
        if (n === 37808) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : s.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === 37809) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : s.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === 37810) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : s.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === 37811) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : s.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === 37812) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : s.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === 37813) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : s.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === 37814) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : s.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === 37815) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : s.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === 37816) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : s.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === 37817) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : s.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === 37818) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : s.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === 37819) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : s.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === 37820) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : s.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === 37821) return a === Ke ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : s.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (n === 36492 || n === 36494 || n === 36495)
      if (s = e.get("EXT_texture_compression_bptc"), s !== null) {
        if (n === 36492) return a === Ke ? s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : s.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === 36494) return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === 36495) return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (n === 36283 || n === 36284 || n === 36285 || n === 36286)
      if (s = e.get("EXT_texture_compression_rgtc"), s !== null) {
        if (n === 36492) return s.COMPRESSED_RED_RGTC1_EXT;
        if (n === 36284) return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === 36285) return s.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === 36286) return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return n === 1020 ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: t };
}
class za extends Rt {
  /**
   * Creates a new raw texture.
   *
   * @param {?WebGLTexture} [sourceTexture=null] - The external texture.
   */
  constructor(e = null) {
    super(), this.sourceTexture = e, this.isExternalTexture = !0;
  }
}
const Rd = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, Cd = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class Pd {
  /**
   * Constructs a new depth sensing module.
   */
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  /**
   * Inits the depth sensing module
   *
   * @param {XRWebGLDepthInformation} depthData - The XR depth data.
   * @param {XRRenderState} renderState - The XR render state.
   */
  init(e, t) {
    if (this.texture === null) {
      const n = new za(e.texture);
      (e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
    }
  }
  /**
   * Returns a plane mesh that visualizes the depth texture.
   *
   * @param {ArrayCamera} cameraXR - The XR camera.
   * @return {?Mesh} The plane mesh.
   */
  getMesh(e) {
    if (this.texture !== null && this.mesh === null) {
      const t = e.cameras[0].viewport, n = new gt({
        vertexShader: Rd,
        fragmentShader: Cd,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: t.z },
          depthHeight: { value: t.w }
        }
      });
      this.mesh = new wt(new lr(20, 20), n);
    }
    return this.mesh;
  }
  /**
   * Resets the module
   */
  reset() {
    this.texture = null, this.mesh = null;
  }
  /**
   * Returns a texture representing the depth of the user's environment.
   *
   * @return {?ExternalTexture} The depth texture.
   */
  getDepthTexture() {
    return this.texture;
  }
}
class Dd extends ti {
  /**
   * Constructs a new WebGL renderer.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGL2RenderingContext} gl - The rendering context.
   */
  constructor(e, t) {
    super();
    const n = this;
    let r = null, s = 1, a = null, o = "local-floor", c = 1, l = null, h = null, f = null, d = null, p = null, g = null;
    const _ = new Pd(), m = {}, u = t.getContextAttributes();
    let A = null, E = null;
    const M = [], C = [], R = new we();
    let L = null;
    const F = new Bt();
    F.viewport = new ht();
    const y = new Bt();
    y.viewport = new ht();
    const S = [F, y], b = new jo();
    let q = null, V = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(W) {
      let ae = M[W];
      return ae === void 0 && (ae = new Lr(), M[W] = ae), ae.getTargetRaySpace();
    }, this.getControllerGrip = function(W) {
      let ae = M[W];
      return ae === void 0 && (ae = new Lr(), M[W] = ae), ae.getGripSpace();
    }, this.getHand = function(W) {
      let ae = M[W];
      return ae === void 0 && (ae = new Lr(), M[W] = ae), ae.getHandSpace();
    };
    function H(W) {
      const ae = C.indexOf(W.inputSource);
      if (ae === -1)
        return;
      const ne = M[ae];
      ne !== void 0 && (ne.update(W.inputSource, W.frame, l || a), ne.dispatchEvent({ type: W.type, data: W.inputSource }));
    }
    function Z() {
      r.removeEventListener("select", H), r.removeEventListener("selectstart", H), r.removeEventListener("selectend", H), r.removeEventListener("squeeze", H), r.removeEventListener("squeezestart", H), r.removeEventListener("squeezeend", H), r.removeEventListener("end", Z), r.removeEventListener("inputsourceschange", X);
      for (let W = 0; W < M.length; W++) {
        const ae = C[W];
        ae !== null && (C[W] = null, M[W].disconnect(ae));
      }
      q = null, V = null, _.reset();
      for (const W in m)
        delete m[W];
      e.setRenderTarget(A), p = null, d = null, f = null, r = null, E = null, je.stop(), n.isPresenting = !1, e.setPixelRatio(L), e.setSize(R.width, R.height, !1), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(W) {
      s = W, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(W) {
      o = W, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return l || a;
    }, this.setReferenceSpace = function(W) {
      l = W;
    }, this.getBaseLayer = function() {
      return d !== null ? d : p;
    }, this.getBinding = function() {
      return f;
    }, this.getFrame = function() {
      return g;
    }, this.getSession = function() {
      return r;
    }, this.setSession = async function(W) {
      if (r = W, r !== null) {
        if (A = e.getRenderTarget(), r.addEventListener("select", H), r.addEventListener("selectstart", H), r.addEventListener("selectend", H), r.addEventListener("squeeze", H), r.addEventListener("squeezestart", H), r.addEventListener("squeezeend", H), r.addEventListener("end", Z), r.addEventListener("inputsourceschange", X), u.xrCompatible !== !0 && await t.makeXRCompatible(), L = e.getPixelRatio(), e.getSize(R), typeof XRWebGLBinding < "u" && (f = new XRWebGLBinding(r, t)), f !== null && "createProjectionLayer" in XRWebGLBinding.prototype) {
          let ne = null, Re = null, Ce = null;
          u.depth && (Ce = u.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, ne = u.stencil ? 1027 : 1026, Re = u.stencil ? 1020 : 1014);
          const Ue = {
            colorFormat: t.RGBA8,
            depthFormat: Ce,
            scaleFactor: s
          };
          d = f.createProjectionLayer(Ue), r.updateRenderState({ layers: [d] }), e.setPixelRatio(1), e.setSize(d.textureWidth, d.textureHeight, !1), E = new kt(
            d.textureWidth,
            d.textureHeight,
            {
              format: 1023,
              type: 1009,
              depthTexture: new Da(d.textureWidth, d.textureHeight, Re, void 0, void 0, void 0, void 0, void 0, void 0, ne),
              stencilBuffer: u.stencil,
              colorSpace: e.outputColorSpace,
              samples: u.antialias ? 4 : 0,
              resolveDepthBuffer: d.ignoreDepthValues === !1,
              resolveStencilBuffer: d.ignoreDepthValues === !1
            }
          );
        } else {
          const ne = {
            antialias: u.antialias,
            alpha: !0,
            depth: u.depth,
            stencil: u.stencil,
            framebufferScaleFactor: s
          };
          p = new XRWebGLLayer(r, t, ne), r.updateRenderState({ baseLayer: p }), e.setPixelRatio(1), e.setSize(p.framebufferWidth, p.framebufferHeight, !1), E = new kt(
            p.framebufferWidth,
            p.framebufferHeight,
            {
              format: 1023,
              type: 1009,
              colorSpace: e.outputColorSpace,
              stencilBuffer: u.stencil,
              resolveDepthBuffer: p.ignoreDepthValues === !1,
              resolveStencilBuffer: p.ignoreDepthValues === !1
            }
          );
        }
        E.isXRRenderTarget = !0, this.setFoveation(c), l = null, a = await r.requestReferenceSpace(o), je.setContext(r), je.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (r !== null)
        return r.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return _.getDepthTexture();
    };
    function X(W) {
      for (let ae = 0; ae < W.removed.length; ae++) {
        const ne = W.removed[ae], Re = C.indexOf(ne);
        Re >= 0 && (C[Re] = null, M[Re].disconnect(ne));
      }
      for (let ae = 0; ae < W.added.length; ae++) {
        const ne = W.added[ae];
        let Re = C.indexOf(ne);
        if (Re === -1) {
          for (let Ue = 0; Ue < M.length; Ue++)
            if (Ue >= C.length) {
              C.push(ne), Re = Ue;
              break;
            } else if (C[Ue] === null) {
              C[Ue] = ne, Re = Ue;
              break;
            }
          if (Re === -1) break;
        }
        const Ce = M[Re];
        Ce && Ce.connect(ne);
      }
    }
    const ee = new P(), z = new P();
    function se(W, ae, ne) {
      ee.setFromMatrixPosition(ae.matrixWorld), z.setFromMatrixPosition(ne.matrixWorld);
      const Re = ee.distanceTo(z), Ce = ae.projectionMatrix.elements, Ue = ne.projectionMatrix.elements, ut = Ce[14] / (Ce[10] - 1), ke = Ce[14] / (Ce[10] + 1), w = (Ce[9] + 1) / Ce[5], et = (Ce[9] - 1) / Ce[5], Ae = (Ce[8] - 1) / Ce[0], qe = (Ue[8] + 1) / Ue[0], ye = ut * Ae, rt = ut * qe, fe = Re / (-Ae + qe), ze = fe * -Ae;
      if (ae.matrixWorld.decompose(W.position, W.quaternion, W.scale), W.translateX(ze), W.translateZ(fe), W.matrixWorld.compose(W.position, W.quaternion, W.scale), W.matrixWorldInverse.copy(W.matrixWorld).invert(), Ce[10] === -1)
        W.projectionMatrix.copy(ae.projectionMatrix), W.projectionMatrixInverse.copy(ae.projectionMatrixInverse);
      else {
        const xt = ut + fe, dt = ke + fe, T = ye - ze, v = rt + (Re - ze), N = w * ke / dt * xt, k = et * ke / dt * xt;
        W.projectionMatrix.makePerspective(T, v, N, k, xt, dt), W.projectionMatrixInverse.copy(W.projectionMatrix).invert();
      }
    }
    function he(W, ae) {
      ae === null ? W.matrixWorld.copy(W.matrix) : W.matrixWorld.multiplyMatrices(ae.matrixWorld, W.matrix), W.matrixWorldInverse.copy(W.matrixWorld).invert();
    }
    this.updateCamera = function(W) {
      if (r === null) return;
      let ae = W.near, ne = W.far;
      _.texture !== null && (_.depthNear > 0 && (ae = _.depthNear), _.depthFar > 0 && (ne = _.depthFar)), b.near = y.near = F.near = ae, b.far = y.far = F.far = ne, (q !== b.near || V !== b.far) && (r.updateRenderState({
        depthNear: b.near,
        depthFar: b.far
      }), q = b.near, V = b.far), b.layers.mask = W.layers.mask | 6, F.layers.mask = b.layers.mask & 3, y.layers.mask = b.layers.mask & 5;
      const Re = W.parent, Ce = b.cameras;
      he(b, Re);
      for (let Ue = 0; Ue < Ce.length; Ue++)
        he(Ce[Ue], Re);
      Ce.length === 2 ? se(b, F, y) : b.projectionMatrix.copy(F.projectionMatrix), Ee(W, b, Re);
    };
    function Ee(W, ae, ne) {
      ne === null ? W.matrix.copy(ae.matrixWorld) : (W.matrix.copy(ne.matrixWorld), W.matrix.invert(), W.matrix.multiply(ae.matrixWorld)), W.matrix.decompose(W.position, W.quaternion, W.scale), W.updateMatrixWorld(!0), W.projectionMatrix.copy(ae.projectionMatrix), W.projectionMatrixInverse.copy(ae.projectionMatrixInverse), W.isPerspectiveCamera && (W.fov = _i * 2 * Math.atan(1 / W.projectionMatrix.elements[5]), W.zoom = 1);
    }
    this.getCamera = function() {
      return b;
    }, this.getFoveation = function() {
      if (!(d === null && p === null))
        return c;
    }, this.setFoveation = function(W) {
      c = W, d !== null && (d.fixedFoveation = W), p !== null && p.fixedFoveation !== void 0 && (p.fixedFoveation = W);
    }, this.hasDepthSensing = function() {
      return _.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return _.getMesh(b);
    }, this.getCameraTexture = function(W) {
      return m[W];
    };
    let Oe = null;
    function it(W, ae) {
      if (h = ae.getViewerPose(l || a), g = ae, h !== null) {
        const ne = h.views;
        p !== null && (e.setRenderTargetFramebuffer(E, p.framebuffer), e.setRenderTarget(E));
        let Re = !1;
        ne.length !== b.cameras.length && (b.cameras.length = 0, Re = !0);
        for (let ke = 0; ke < ne.length; ke++) {
          const w = ne[ke];
          let et = null;
          if (p !== null)
            et = p.getViewport(w);
          else {
            const qe = f.getViewSubImage(d, w);
            et = qe.viewport, ke === 0 && (e.setRenderTargetTextures(
              E,
              qe.colorTexture,
              qe.depthStencilTexture
            ), e.setRenderTarget(E));
          }
          let Ae = S[ke];
          Ae === void 0 && (Ae = new Bt(), Ae.layers.enable(ke), Ae.viewport = new ht(), S[ke] = Ae), Ae.matrix.fromArray(w.transform.matrix), Ae.matrix.decompose(Ae.position, Ae.quaternion, Ae.scale), Ae.projectionMatrix.fromArray(w.projectionMatrix), Ae.projectionMatrixInverse.copy(Ae.projectionMatrix).invert(), Ae.viewport.set(et.x, et.y, et.width, et.height), ke === 0 && (b.matrix.copy(Ae.matrix), b.matrix.decompose(b.position, b.quaternion, b.scale)), Re === !0 && b.cameras.push(Ae);
        }
        const Ce = r.enabledFeatures;
        if (Ce && Ce.includes("depth-sensing") && r.depthUsage == "gpu-optimized" && f) {
          const ke = f.getDepthInformation(ne[0]);
          ke && ke.isValid && ke.texture && _.init(ke, r.renderState);
        }
        if (Ce && Ce.includes("camera-access") && (e.state.unbindTexture(), f))
          for (let ke = 0; ke < ne.length; ke++) {
            const w = ne[ke].camera;
            if (w) {
              let et = m[w];
              et || (et = new za(), m[w] = et);
              const Ae = f.getCameraImage(w);
              et.sourceTexture = Ae;
            }
          }
      }
      for (let ne = 0; ne < M.length; ne++) {
        const Re = C[ne], Ce = M[ne];
        Re !== null && Ce !== void 0 && Ce.update(Re, ae, l || a);
      }
      Oe && Oe(W, ae), ae.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: ae }), g = null;
    }
    const je = new Ia();
    je.setAnimationLoop(it), this.setAnimationLoop = function(W) {
      Oe = W;
    }, this.dispose = function() {
    };
  }
}
const Mn = /* @__PURE__ */ new qt(), Ld = /* @__PURE__ */ new Qe();
function Ud(i, e) {
  function t(m, u) {
    m.matrixAutoUpdate === !0 && m.updateMatrix(), u.value.copy(m.matrix);
  }
  function n(m, u) {
    u.color.getRGB(m.fogColor.value, Aa(i)), u.isFog ? (m.fogNear.value = u.near, m.fogFar.value = u.far) : u.isFogExp2 && (m.fogDensity.value = u.density);
  }
  function r(m, u, A, E, M) {
    u.isMeshBasicMaterial || u.isMeshLambertMaterial ? s(m, u) : u.isMeshToonMaterial ? (s(m, u), f(m, u)) : u.isMeshPhongMaterial ? (s(m, u), h(m, u)) : u.isMeshStandardMaterial ? (s(m, u), d(m, u), u.isMeshPhysicalMaterial && p(m, u, M)) : u.isMeshMatcapMaterial ? (s(m, u), g(m, u)) : u.isMeshDepthMaterial ? s(m, u) : u.isMeshDistanceMaterial ? (s(m, u), _(m, u)) : u.isMeshNormalMaterial ? s(m, u) : u.isLineBasicMaterial ? (a(m, u), u.isLineDashedMaterial && o(m, u)) : u.isPointsMaterial ? c(m, u, A, E) : u.isSpriteMaterial ? l(m, u) : u.isShadowMaterial ? (m.color.value.copy(u.color), m.opacity.value = u.opacity) : u.isShaderMaterial && (u.uniformsNeedUpdate = !1);
  }
  function s(m, u) {
    m.opacity.value = u.opacity, u.color && m.diffuse.value.copy(u.color), u.emissive && m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity), u.map && (m.map.value = u.map, t(u.map, m.mapTransform)), u.alphaMap && (m.alphaMap.value = u.alphaMap, t(u.alphaMap, m.alphaMapTransform)), u.bumpMap && (m.bumpMap.value = u.bumpMap, t(u.bumpMap, m.bumpMapTransform), m.bumpScale.value = u.bumpScale, u.side === 1 && (m.bumpScale.value *= -1)), u.normalMap && (m.normalMap.value = u.normalMap, t(u.normalMap, m.normalMapTransform), m.normalScale.value.copy(u.normalScale), u.side === 1 && m.normalScale.value.negate()), u.displacementMap && (m.displacementMap.value = u.displacementMap, t(u.displacementMap, m.displacementMapTransform), m.displacementScale.value = u.displacementScale, m.displacementBias.value = u.displacementBias), u.emissiveMap && (m.emissiveMap.value = u.emissiveMap, t(u.emissiveMap, m.emissiveMapTransform)), u.specularMap && (m.specularMap.value = u.specularMap, t(u.specularMap, m.specularMapTransform)), u.alphaTest > 0 && (m.alphaTest.value = u.alphaTest);
    const A = e.get(u), E = A.envMap, M = A.envMapRotation;
    E && (m.envMap.value = E, Mn.copy(M), Mn.x *= -1, Mn.y *= -1, Mn.z *= -1, E.isCubeTexture && E.isRenderTargetTexture === !1 && (Mn.y *= -1, Mn.z *= -1), m.envMapRotation.value.setFromMatrix4(Ld.makeRotationFromEuler(Mn)), m.flipEnvMap.value = E.isCubeTexture && E.isRenderTargetTexture === !1 ? -1 : 1, m.reflectivity.value = u.reflectivity, m.ior.value = u.ior, m.refractionRatio.value = u.refractionRatio), u.lightMap && (m.lightMap.value = u.lightMap, m.lightMapIntensity.value = u.lightMapIntensity, t(u.lightMap, m.lightMapTransform)), u.aoMap && (m.aoMap.value = u.aoMap, m.aoMapIntensity.value = u.aoMapIntensity, t(u.aoMap, m.aoMapTransform));
  }
  function a(m, u) {
    m.diffuse.value.copy(u.color), m.opacity.value = u.opacity, u.map && (m.map.value = u.map, t(u.map, m.mapTransform));
  }
  function o(m, u) {
    m.dashSize.value = u.dashSize, m.totalSize.value = u.dashSize + u.gapSize, m.scale.value = u.scale;
  }
  function c(m, u, A, E) {
    m.diffuse.value.copy(u.color), m.opacity.value = u.opacity, m.size.value = u.size * A, m.scale.value = E * 0.5, u.map && (m.map.value = u.map, t(u.map, m.uvTransform)), u.alphaMap && (m.alphaMap.value = u.alphaMap, t(u.alphaMap, m.alphaMapTransform)), u.alphaTest > 0 && (m.alphaTest.value = u.alphaTest);
  }
  function l(m, u) {
    m.diffuse.value.copy(u.color), m.opacity.value = u.opacity, m.rotation.value = u.rotation, u.map && (m.map.value = u.map, t(u.map, m.mapTransform)), u.alphaMap && (m.alphaMap.value = u.alphaMap, t(u.alphaMap, m.alphaMapTransform)), u.alphaTest > 0 && (m.alphaTest.value = u.alphaTest);
  }
  function h(m, u) {
    m.specular.value.copy(u.specular), m.shininess.value = Math.max(u.shininess, 1e-4);
  }
  function f(m, u) {
    u.gradientMap && (m.gradientMap.value = u.gradientMap);
  }
  function d(m, u) {
    m.metalness.value = u.metalness, u.metalnessMap && (m.metalnessMap.value = u.metalnessMap, t(u.metalnessMap, m.metalnessMapTransform)), m.roughness.value = u.roughness, u.roughnessMap && (m.roughnessMap.value = u.roughnessMap, t(u.roughnessMap, m.roughnessMapTransform)), u.envMap && (m.envMapIntensity.value = u.envMapIntensity);
  }
  function p(m, u, A) {
    m.ior.value = u.ior, u.sheen > 0 && (m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen), m.sheenRoughness.value = u.sheenRoughness, u.sheenColorMap && (m.sheenColorMap.value = u.sheenColorMap, t(u.sheenColorMap, m.sheenColorMapTransform)), u.sheenRoughnessMap && (m.sheenRoughnessMap.value = u.sheenRoughnessMap, t(u.sheenRoughnessMap, m.sheenRoughnessMapTransform))), u.clearcoat > 0 && (m.clearcoat.value = u.clearcoat, m.clearcoatRoughness.value = u.clearcoatRoughness, u.clearcoatMap && (m.clearcoatMap.value = u.clearcoatMap, t(u.clearcoatMap, m.clearcoatMapTransform)), u.clearcoatRoughnessMap && (m.clearcoatRoughnessMap.value = u.clearcoatRoughnessMap, t(u.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)), u.clearcoatNormalMap && (m.clearcoatNormalMap.value = u.clearcoatNormalMap, t(u.clearcoatNormalMap, m.clearcoatNormalMapTransform), m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale), u.side === 1 && m.clearcoatNormalScale.value.negate())), u.dispersion > 0 && (m.dispersion.value = u.dispersion), u.iridescence > 0 && (m.iridescence.value = u.iridescence, m.iridescenceIOR.value = u.iridescenceIOR, m.iridescenceThicknessMinimum.value = u.iridescenceThicknessRange[0], m.iridescenceThicknessMaximum.value = u.iridescenceThicknessRange[1], u.iridescenceMap && (m.iridescenceMap.value = u.iridescenceMap, t(u.iridescenceMap, m.iridescenceMapTransform)), u.iridescenceThicknessMap && (m.iridescenceThicknessMap.value = u.iridescenceThicknessMap, t(u.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))), u.transmission > 0 && (m.transmission.value = u.transmission, m.transmissionSamplerMap.value = A.texture, m.transmissionSamplerSize.value.set(A.width, A.height), u.transmissionMap && (m.transmissionMap.value = u.transmissionMap, t(u.transmissionMap, m.transmissionMapTransform)), m.thickness.value = u.thickness, u.thicknessMap && (m.thicknessMap.value = u.thicknessMap, t(u.thicknessMap, m.thicknessMapTransform)), m.attenuationDistance.value = u.attenuationDistance, m.attenuationColor.value.copy(u.attenuationColor)), u.anisotropy > 0 && (m.anisotropyVector.value.set(u.anisotropy * Math.cos(u.anisotropyRotation), u.anisotropy * Math.sin(u.anisotropyRotation)), u.anisotropyMap && (m.anisotropyMap.value = u.anisotropyMap, t(u.anisotropyMap, m.anisotropyMapTransform))), m.specularIntensity.value = u.specularIntensity, m.specularColor.value.copy(u.specularColor), u.specularColorMap && (m.specularColorMap.value = u.specularColorMap, t(u.specularColorMap, m.specularColorMapTransform)), u.specularIntensityMap && (m.specularIntensityMap.value = u.specularIntensityMap, t(u.specularIntensityMap, m.specularIntensityMapTransform));
  }
  function g(m, u) {
    u.matcap && (m.matcap.value = u.matcap);
  }
  function _(m, u) {
    const A = e.get(u).light;
    m.referencePosition.value.setFromMatrixPosition(A.matrixWorld), m.nearDistance.value = A.shadow.camera.near, m.farDistance.value = A.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: r
  };
}
function Id(i, e, t, n) {
  let r = {}, s = {}, a = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function c(A, E) {
    const M = E.program;
    n.uniformBlockBinding(A, M);
  }
  function l(A, E) {
    let M = r[A.id];
    M === void 0 && (g(A), M = h(A), r[A.id] = M, A.addEventListener("dispose", m));
    const C = E.program;
    n.updateUBOMapping(A, C);
    const R = e.render.frame;
    s[A.id] !== R && (d(A), s[A.id] = R);
  }
  function h(A) {
    const E = f();
    A.__bindingPointIndex = E;
    const M = i.createBuffer(), C = A.__size, R = A.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, M), i.bufferData(i.UNIFORM_BUFFER, C, R), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, E, M), M;
  }
  function f() {
    for (let A = 0; A < o; A++)
      if (a.indexOf(A) === -1)
        return a.push(A), A;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function d(A) {
    const E = r[A.id], M = A.uniforms, C = A.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, E);
    for (let R = 0, L = M.length; R < L; R++) {
      const F = Array.isArray(M[R]) ? M[R] : [M[R]];
      for (let y = 0, S = F.length; y < S; y++) {
        const b = F[y];
        if (p(b, R, y, C) === !0) {
          const q = b.__offset, V = Array.isArray(b.value) ? b.value : [b.value];
          let H = 0;
          for (let Z = 0; Z < V.length; Z++) {
            const X = V[Z], ee = _(X);
            typeof X == "number" || typeof X == "boolean" ? (b.__data[0] = X, i.bufferSubData(i.UNIFORM_BUFFER, q + H, b.__data)) : X.isMatrix3 ? (b.__data[0] = X.elements[0], b.__data[1] = X.elements[1], b.__data[2] = X.elements[2], b.__data[3] = 0, b.__data[4] = X.elements[3], b.__data[5] = X.elements[4], b.__data[6] = X.elements[5], b.__data[7] = 0, b.__data[8] = X.elements[6], b.__data[9] = X.elements[7], b.__data[10] = X.elements[8], b.__data[11] = 0) : (X.toArray(b.__data, H), H += ee.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, q, b.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function p(A, E, M, C) {
    const R = A.value, L = E + "_" + M;
    if (C[L] === void 0)
      return typeof R == "number" || typeof R == "boolean" ? C[L] = R : C[L] = R.clone(), !0;
    {
      const F = C[L];
      if (typeof R == "number" || typeof R == "boolean") {
        if (F !== R)
          return C[L] = R, !0;
      } else if (F.equals(R) === !1)
        return F.copy(R), !0;
    }
    return !1;
  }
  function g(A) {
    const E = A.uniforms;
    let M = 0;
    const C = 16;
    for (let L = 0, F = E.length; L < F; L++) {
      const y = Array.isArray(E[L]) ? E[L] : [E[L]];
      for (let S = 0, b = y.length; S < b; S++) {
        const q = y[S], V = Array.isArray(q.value) ? q.value : [q.value];
        for (let H = 0, Z = V.length; H < Z; H++) {
          const X = V[H], ee = _(X), z = M % C, se = z % ee.boundary, he = z + se;
          M += se, he !== 0 && C - he < ee.storage && (M += C - he), q.__data = new Float32Array(ee.storage / Float32Array.BYTES_PER_ELEMENT), q.__offset = M, M += ee.storage;
        }
      }
    }
    const R = M % C;
    return R > 0 && (M += C - R), A.__size = M, A.__cache = {}, this;
  }
  function _(A) {
    const E = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof A == "number" || typeof A == "boolean" ? (E.boundary = 4, E.storage = 4) : A.isVector2 ? (E.boundary = 8, E.storage = 8) : A.isVector3 || A.isColor ? (E.boundary = 16, E.storage = 12) : A.isVector4 ? (E.boundary = 16, E.storage = 16) : A.isMatrix3 ? (E.boundary = 48, E.storage = 48) : A.isMatrix4 ? (E.boundary = 64, E.storage = 64) : A.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", A), E;
  }
  function m(A) {
    const E = A.target;
    E.removeEventListener("dispose", m);
    const M = a.indexOf(E.__bindingPointIndex);
    a.splice(M, 1), i.deleteBuffer(r[E.id]), delete r[E.id], delete s[E.id];
  }
  function u() {
    for (const A in r)
      i.deleteBuffer(r[A]);
    a = [], r = {}, s = {};
  }
  return {
    bind: c,
    update: l,
    dispose: u
  };
}
class Fd {
  /**
   * Constructs a new WebGL renderer.
   *
   * @param {WebGLRenderer~Options} [parameters] - The configuration parameter.
   */
  constructor(e = {}) {
    const {
      canvas: t = uo(),
      context: n = null,
      depth: r = !0,
      stencil: s = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: c = !0,
      preserveDrawingBuffer: l = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: f = !1,
      reversedDepthBuffer: d = !1
    } = e;
    this.isWebGLRenderer = !0;
    let p;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      p = n.getContextAttributes().alpha;
    } else
      p = a;
    const g = new Uint32Array(4), _ = new Int32Array(4);
    let m = null, u = null;
    const A = [], E = [];
    this.domElement = t, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled.
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
    const M = this;
    let C = !1;
    this._outputColorSpace = bt;
    let R = 0, L = 0, F = null, y = -1, S = null;
    const b = new ht(), q = new ht();
    let V = null;
    const H = new Se(0);
    let Z = 0, X = t.width, ee = t.height, z = 1, se = null, he = null;
    const Ee = new ht(0, 0, X, ee), Oe = new ht(0, 0, X, ee);
    let it = !1;
    const je = new Jr();
    let W = !1, ae = !1;
    const ne = new Qe(), Re = new P(), Ce = new ht(), Ue = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let ut = !1;
    function ke() {
      return F === null ? z : 1;
    }
    let w = n;
    function et(x, U) {
      return t.getContext(x, U);
    }
    try {
      const x = {
        alpha: !0,
        depth: r,
        stencil: s,
        antialias: o,
        premultipliedAlpha: c,
        preserveDrawingBuffer: l,
        powerPreference: h,
        failIfMajorPerformanceCaveat: f
      };
      if ("setAttribute" in t && t.setAttribute("data-engine", "three.js r179"), t.addEventListener("webglcontextlost", ie, !1), t.addEventListener("webglcontextrestored", de, !1), t.addEventListener("webglcontextcreationerror", $, !1), w === null) {
        const U = "webgl2";
        if (w = et(U, x), w === null)
          throw et(U) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (x) {
      throw console.error("THREE.WebGLRenderer: " + x.message), x;
    }
    let Ae, qe, ye, rt, fe, ze, xt, dt, T, v, N, k, K, G, Me, te, ge, _e, J, ce, De, ve, oe, Fe;
    function D() {
      Ae = new Xh(w), Ae.init(), ve = new wd(w, Ae), qe = new Oh(w, Ae, e, ve), ye = new Ad(w, Ae), qe.reversedDepthBuffer && d && ye.buffers.depth.setReversed(!0), rt = new Kh(w), fe = new dd(), ze = new bd(w, Ae, ye, fe, qe, ve, rt), xt = new Gh(M), dt = new Wh(M), T = new el(w), oe = new Nh(w, T), v = new qh(w, T, rt, oe), N = new $h(w, v, T, rt), J = new Zh(w, qe, ze), te = new zh(fe), k = new ud(M, xt, dt, Ae, qe, oe, te), K = new Ud(M, fe), G = new pd(), Me = new Md(Ae), _e = new Fh(M, xt, dt, ye, N, p, c), ge = new Ed(M, N, qe), Fe = new Id(w, rt, qe, ye), ce = new Bh(w, Ae, rt), De = new Yh(w, Ae, rt), rt.programs = k.programs, M.capabilities = qe, M.extensions = Ae, M.properties = fe, M.renderLists = G, M.shadowMap = ge, M.state = ye, M.info = rt;
    }
    D();
    const Q = new Dd(M, w);
    this.xr = Q, this.getContext = function() {
      return w;
    }, this.getContextAttributes = function() {
      return w.getContextAttributes();
    }, this.forceContextLoss = function() {
      const x = Ae.get("WEBGL_lose_context");
      x && x.loseContext();
    }, this.forceContextRestore = function() {
      const x = Ae.get("WEBGL_lose_context");
      x && x.restoreContext();
    }, this.getPixelRatio = function() {
      return z;
    }, this.setPixelRatio = function(x) {
      x !== void 0 && (z = x, this.setSize(X, ee, !1));
    }, this.getSize = function(x) {
      return x.set(X, ee);
    }, this.setSize = function(x, U, B = !0) {
      if (Q.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      X = x, ee = U, t.width = Math.floor(x * z), t.height = Math.floor(U * z), B === !0 && (t.style.width = x + "px", t.style.height = U + "px"), this.setViewport(0, 0, x, U);
    }, this.getDrawingBufferSize = function(x) {
      return x.set(X * z, ee * z).floor();
    }, this.setDrawingBufferSize = function(x, U, B) {
      X = x, ee = U, z = B, t.width = Math.floor(x * B), t.height = Math.floor(U * B), this.setViewport(0, 0, x, U);
    }, this.getCurrentViewport = function(x) {
      return x.copy(b);
    }, this.getViewport = function(x) {
      return x.copy(Ee);
    }, this.setViewport = function(x, U, B, O) {
      x.isVector4 ? Ee.set(x.x, x.y, x.z, x.w) : Ee.set(x, U, B, O), ye.viewport(b.copy(Ee).multiplyScalar(z).round());
    }, this.getScissor = function(x) {
      return x.copy(Oe);
    }, this.setScissor = function(x, U, B, O) {
      x.isVector4 ? Oe.set(x.x, x.y, x.z, x.w) : Oe.set(x, U, B, O), ye.scissor(q.copy(Oe).multiplyScalar(z).round());
    }, this.getScissorTest = function() {
      return it;
    }, this.setScissorTest = function(x) {
      ye.setScissorTest(it = x);
    }, this.setOpaqueSort = function(x) {
      se = x;
    }, this.setTransparentSort = function(x) {
      he = x;
    }, this.getClearColor = function(x) {
      return x.copy(_e.getClearColor());
    }, this.setClearColor = function() {
      _e.setClearColor(...arguments);
    }, this.getClearAlpha = function() {
      return _e.getClearAlpha();
    }, this.setClearAlpha = function() {
      _e.setClearAlpha(...arguments);
    }, this.clear = function(x = !0, U = !0, B = !0) {
      let O = 0;
      if (x) {
        let I = !1;
        if (F !== null) {
          const j = F.texture.format;
          I = j === 1033 || j === 1031 || j === 1029;
        }
        if (I) {
          const j = F.texture.type, le = j === 1009 || j === 1014 || j === 1012 || j === 1020 || j === 1017 || j === 1018, pe = _e.getClearColor(), ue = _e.getClearAlpha(), Pe = pe.r, Le = pe.g, Te = pe.b;
          le ? (g[0] = Pe, g[1] = Le, g[2] = Te, g[3] = ue, w.clearBufferuiv(w.COLOR, 0, g)) : (_[0] = Pe, _[1] = Le, _[2] = Te, _[3] = ue, w.clearBufferiv(w.COLOR, 0, _));
        } else
          O |= w.COLOR_BUFFER_BIT;
      }
      U && (O |= w.DEPTH_BUFFER_BIT), B && (O |= w.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), w.clear(O);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      t.removeEventListener("webglcontextlost", ie, !1), t.removeEventListener("webglcontextrestored", de, !1), t.removeEventListener("webglcontextcreationerror", $, !1), _e.dispose(), G.dispose(), Me.dispose(), fe.dispose(), xt.dispose(), dt.dispose(), N.dispose(), oe.dispose(), Fe.dispose(), k.dispose(), Q.dispose(), Q.removeEventListener("sessionstart", Wt), Q.removeEventListener("sessionend", ns), fn.stop();
    };
    function ie(x) {
      x.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), C = !0;
    }
    function de() {
      console.log("THREE.WebGLRenderer: Context Restored."), C = !1;
      const x = rt.autoReset, U = ge.enabled, B = ge.autoUpdate, O = ge.needsUpdate, I = ge.type;
      D(), rt.autoReset = x, ge.enabled = U, ge.autoUpdate = B, ge.needsUpdate = O, ge.type = I;
    }
    function $(x) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", x.statusMessage);
    }
    function Y(x) {
      const U = x.target;
      U.removeEventListener("dispose", Y), me(U);
    }
    function me(x) {
      Ie(x), fe.remove(x);
    }
    function Ie(x) {
      const U = fe.get(x).programs;
      U !== void 0 && (U.forEach(function(B) {
        k.releaseProgram(B);
      }), x.isShaderMaterial && k.releaseShaderCache(x));
    }
    this.renderBufferDirect = function(x, U, B, O, I, j) {
      U === null && (U = Ue);
      const le = I.isMesh && I.matrixWorld.determinant() < 0, pe = Va(x, U, B, O, I);
      ye.setMaterial(O, le);
      let ue = B.index, Pe = 1;
      if (O.wireframe === !0) {
        if (ue = v.getWireframeAttribute(B), ue === void 0) return;
        Pe = 2;
      }
      const Le = B.drawRange, Te = B.attributes.position;
      let Ge = Le.start * Pe, $e = (Le.start + Le.count) * Pe;
      j !== null && (Ge = Math.max(Ge, j.start * Pe), $e = Math.min($e, (j.start + j.count) * Pe)), ue !== null ? (Ge = Math.max(Ge, 0), $e = Math.min($e, ue.count)) : Te != null && (Ge = Math.max(Ge, 0), $e = Math.min($e, Te.count));
      const ct = $e - Ge;
      if (ct < 0 || ct === 1 / 0) return;
      oe.setup(I, O, pe, B, ue);
      let nt, Je = ce;
      if (ue !== null && (nt = T.get(ue), Je = De, Je.setIndex(nt)), I.isMesh)
        O.wireframe === !0 ? (ye.setLineWidth(O.wireframeLinewidth * ke()), Je.setMode(w.LINES)) : Je.setMode(w.TRIANGLES);
      else if (I.isLine) {
        let be = O.linewidth;
        be === void 0 && (be = 1), ye.setLineWidth(be * ke()), I.isLineSegments ? Je.setMode(w.LINES) : I.isLineLoop ? Je.setMode(w.LINE_LOOP) : Je.setMode(w.LINE_STRIP);
      } else I.isPoints ? Je.setMode(w.POINTS) : I.isSprite && Je.setMode(w.TRIANGLES);
      if (I.isBatchedMesh)
        if (I._multiDrawInstances !== null)
          Zn("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."), Je.renderMultiDrawInstances(I._multiDrawStarts, I._multiDrawCounts, I._multiDrawCount, I._multiDrawInstances);
        else if (Ae.get("WEBGL_multi_draw"))
          Je.renderMultiDraw(I._multiDrawStarts, I._multiDrawCounts, I._multiDrawCount);
        else {
          const be = I._multiDrawStarts, ot = I._multiDrawCounts, Xe = I._multiDrawCount, Pt = ue ? T.get(ue).bytesPerElement : 1, Rn = fe.get(O).currentProgram.getUniforms();
          for (let Dt = 0; Dt < Xe; Dt++)
            Rn.setValue(w, "_gl_DrawID", Dt), Je.render(be[Dt] / Pt, ot[Dt]);
        }
      else if (I.isInstancedMesh)
        Je.renderInstances(Ge, ct, I.count);
      else if (B.isInstancedBufferGeometry) {
        const be = B._maxInstanceCount !== void 0 ? B._maxInstanceCount : 1 / 0, ot = Math.min(B.instanceCount, be);
        Je.renderInstances(Ge, ct, ot);
      } else
        Je.render(Ge, ct);
    };
    function tt(x, U, B) {
      x.transparent === !0 && x.side === 2 && x.forceSinglePass === !1 ? (x.side = 1, x.needsUpdate = !0, Ei(x, U, B), x.side = 0, x.needsUpdate = !0, Ei(x, U, B), x.side = 2) : Ei(x, U, B);
    }
    this.compile = function(x, U, B = null) {
      B === null && (B = x), u = Me.get(B), u.init(U), E.push(u), B.traverseVisible(function(I) {
        I.isLight && I.layers.test(U.layers) && (u.pushLight(I), I.castShadow && u.pushShadow(I));
      }), x !== B && x.traverseVisible(function(I) {
        I.isLight && I.layers.test(U.layers) && (u.pushLight(I), I.castShadow && u.pushShadow(I));
      }), u.setupLights();
      const O = /* @__PURE__ */ new Set();
      return x.traverse(function(I) {
        if (!(I.isMesh || I.isPoints || I.isLine || I.isSprite))
          return;
        const j = I.material;
        if (j)
          if (Array.isArray(j))
            for (let le = 0; le < j.length; le++) {
              const pe = j[le];
              tt(pe, B, I), O.add(pe);
            }
          else
            tt(j, B, I), O.add(j);
      }), u = E.pop(), O;
    }, this.compileAsync = function(x, U, B = null) {
      const O = this.compile(x, U, B);
      return new Promise((I) => {
        function j() {
          if (O.forEach(function(le) {
            fe.get(le).currentProgram.isReady() && O.delete(le);
          }), O.size === 0) {
            I(x);
            return;
          }
          setTimeout(j, 10);
        }
        Ae.get("KHR_parallel_shader_compile") !== null ? j() : setTimeout(j, 10);
      });
    };
    let Ye = null;
    function Yt(x) {
      Ye && Ye(x);
    }
    function Wt() {
      fn.stop();
    }
    function ns() {
      fn.start();
    }
    const fn = new Ia();
    fn.setAnimationLoop(Yt), typeof self < "u" && fn.setContext(self), this.setAnimationLoop = function(x) {
      Ye = x, Q.setAnimationLoop(x), x === null ? fn.stop() : fn.start();
    }, Q.addEventListener("sessionstart", Wt), Q.addEventListener("sessionend", ns), this.render = function(x, U) {
      if (U !== void 0 && U.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (C === !0) return;
      if (x.matrixWorldAutoUpdate === !0 && x.updateMatrixWorld(), U.parent === null && U.matrixWorldAutoUpdate === !0 && U.updateMatrixWorld(), Q.enabled === !0 && Q.isPresenting === !0 && (Q.cameraAutoUpdate === !0 && Q.updateCamera(U), U = Q.getCamera()), x.isScene === !0 && x.onBeforeRender(M, x, U, F), u = Me.get(x, E.length), u.init(U), E.push(u), ne.multiplyMatrices(U.projectionMatrix, U.matrixWorldInverse), je.setFromProjectionMatrix(ne, 2e3, U.reversedDepth), ae = this.localClippingEnabled, W = te.init(this.clippingPlanes, ae), m = G.get(x, A.length), m.init(), A.push(m), Q.enabled === !0 && Q.isPresenting === !0) {
        const j = M.xr.getDepthSensingMesh();
        j !== null && hr(j, U, -1 / 0, M.sortObjects);
      }
      hr(x, U, 0, M.sortObjects), m.finish(), M.sortObjects === !0 && m.sort(se, he), ut = Q.enabled === !1 || Q.isPresenting === !1 || Q.hasDepthSensing() === !1, ut && _e.addToRenderList(m, x), this.info.render.frame++, W === !0 && te.beginShadows();
      const B = u.state.shadowsArray;
      ge.render(B, x, U), W === !0 && te.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const O = m.opaque, I = m.transmissive;
      if (u.setupLights(), U.isArrayCamera) {
        const j = U.cameras;
        if (I.length > 0)
          for (let le = 0, pe = j.length; le < pe; le++) {
            const ue = j[le];
            rs(O, I, x, ue);
          }
        ut && _e.render(x);
        for (let le = 0, pe = j.length; le < pe; le++) {
          const ue = j[le];
          is(m, x, ue, ue.viewport);
        }
      } else
        I.length > 0 && rs(O, I, x, U), ut && _e.render(x), is(m, x, U);
      F !== null && L === 0 && (ze.updateMultisampleRenderTarget(F), ze.updateRenderTargetMipmap(F)), x.isScene === !0 && x.onAfterRender(M, x, U), oe.resetDefaultState(), y = -1, S = null, E.pop(), E.length > 0 ? (u = E[E.length - 1], W === !0 && te.setGlobalState(M.clippingPlanes, u.state.camera)) : u = null, A.pop(), A.length > 0 ? m = A[A.length - 1] : m = null;
    };
    function hr(x, U, B, O) {
      if (x.visible === !1) return;
      if (x.layers.test(U.layers)) {
        if (x.isGroup)
          B = x.renderOrder;
        else if (x.isLOD)
          x.autoUpdate === !0 && x.update(U);
        else if (x.isLight)
          u.pushLight(x), x.castShadow && u.pushShadow(x);
        else if (x.isSprite) {
          if (!x.frustumCulled || je.intersectsSprite(x)) {
            O && Ce.setFromMatrixPosition(x.matrixWorld).applyMatrix4(ne);
            const le = N.update(x), pe = x.material;
            pe.visible && m.push(x, le, pe, B, Ce.z, null);
          }
        } else if ((x.isMesh || x.isLine || x.isPoints) && (!x.frustumCulled || je.intersectsObject(x))) {
          const le = N.update(x), pe = x.material;
          if (O && (x.boundingSphere !== void 0 ? (x.boundingSphere === null && x.computeBoundingSphere(), Ce.copy(x.boundingSphere.center)) : (le.boundingSphere === null && le.computeBoundingSphere(), Ce.copy(le.boundingSphere.center)), Ce.applyMatrix4(x.matrixWorld).applyMatrix4(ne)), Array.isArray(pe)) {
            const ue = le.groups;
            for (let Pe = 0, Le = ue.length; Pe < Le; Pe++) {
              const Te = ue[Pe], Ge = pe[Te.materialIndex];
              Ge && Ge.visible && m.push(x, le, Ge, B, Ce.z, Te);
            }
          } else pe.visible && m.push(x, le, pe, B, Ce.z, null);
        }
      }
      const j = x.children;
      for (let le = 0, pe = j.length; le < pe; le++)
        hr(j[le], U, B, O);
    }
    function is(x, U, B, O) {
      const I = x.opaque, j = x.transmissive, le = x.transparent;
      u.setupLightsView(B), W === !0 && te.setGlobalState(M.clippingPlanes, B), O && ye.viewport(b.copy(O)), I.length > 0 && yi(I, U, B), j.length > 0 && yi(j, U, B), le.length > 0 && yi(le, U, B), ye.buffers.depth.setTest(!0), ye.buffers.depth.setMask(!0), ye.buffers.color.setMask(!0), ye.setPolygonOffset(!1);
    }
    function rs(x, U, B, O) {
      if ((B.isScene === !0 ? B.overrideMaterial : null) !== null)
        return;
      u.state.transmissionRenderTarget[O.id] === void 0 && (u.state.transmissionRenderTarget[O.id] = new kt(1, 1, {
        generateMipmaps: !0,
        type: Ae.has("EXT_color_buffer_half_float") || Ae.has("EXT_color_buffer_float") ? 1016 : 1009,
        minFilter: 1008,
        samples: 4,
        stencilBuffer: s,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1,
        colorSpace: We.workingColorSpace
      }));
      const j = u.state.transmissionRenderTarget[O.id], le = O.viewport || b;
      j.setSize(le.z * M.transmissionResolutionScale, le.w * M.transmissionResolutionScale);
      const pe = M.getRenderTarget(), ue = M.getActiveCubeFace(), Pe = M.getActiveMipmapLevel();
      M.setRenderTarget(j), M.getClearColor(H), Z = M.getClearAlpha(), Z < 1 && M.setClearColor(16777215, 0.5), M.clear(), ut && _e.render(B);
      const Le = M.toneMapping;
      M.toneMapping = 0;
      const Te = O.viewport;
      if (O.viewport !== void 0 && (O.viewport = void 0), u.setupLightsView(O), W === !0 && te.setGlobalState(M.clippingPlanes, O), yi(x, B, O), ze.updateMultisampleRenderTarget(j), ze.updateRenderTargetMipmap(j), Ae.has("WEBGL_multisampled_render_to_texture") === !1) {
        let Ge = !1;
        for (let $e = 0, ct = U.length; $e < ct; $e++) {
          const nt = U[$e], Je = nt.object, be = nt.geometry, ot = nt.material, Xe = nt.group;
          if (ot.side === 2 && Je.layers.test(O.layers)) {
            const Pt = ot.side;
            ot.side = 1, ot.needsUpdate = !0, ss(Je, B, O, be, ot, Xe), ot.side = Pt, ot.needsUpdate = !0, Ge = !0;
          }
        }
        Ge === !0 && (ze.updateMultisampleRenderTarget(j), ze.updateRenderTargetMipmap(j));
      }
      M.setRenderTarget(pe, ue, Pe), M.setClearColor(H, Z), Te !== void 0 && (O.viewport = Te), M.toneMapping = Le;
    }
    function yi(x, U, B) {
      const O = U.isScene === !0 ? U.overrideMaterial : null;
      for (let I = 0, j = x.length; I < j; I++) {
        const le = x[I], pe = le.object, ue = le.geometry, Pe = le.group;
        let Le = le.material;
        Le.allowOverride === !0 && O !== null && (Le = O), pe.layers.test(B.layers) && ss(pe, U, B, ue, Le, Pe);
      }
    }
    function ss(x, U, B, O, I, j) {
      x.onBeforeRender(M, U, B, O, I, j), x.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse, x.matrixWorld), x.normalMatrix.getNormalMatrix(x.modelViewMatrix), I.onBeforeRender(M, U, B, O, x, j), I.transparent === !0 && I.side === 2 && I.forceSinglePass === !1 ? (I.side = 1, I.needsUpdate = !0, M.renderBufferDirect(B, U, O, I, x, j), I.side = 0, I.needsUpdate = !0, M.renderBufferDirect(B, U, O, I, x, j), I.side = 2) : M.renderBufferDirect(B, U, O, I, x, j), x.onAfterRender(M, U, B, O, I, j);
    }
    function Ei(x, U, B) {
      U.isScene !== !0 && (U = Ue);
      const O = fe.get(x), I = u.state.lights, j = u.state.shadowsArray, le = I.state.version, pe = k.getParameters(x, I.state, j, U, B), ue = k.getProgramCacheKey(pe);
      let Pe = O.programs;
      O.environment = x.isMeshStandardMaterial ? U.environment : null, O.fog = U.fog, O.envMap = (x.isMeshStandardMaterial ? dt : xt).get(x.envMap || O.environment), O.envMapRotation = O.environment !== null && x.envMap === null ? U.environmentRotation : x.envMapRotation, Pe === void 0 && (x.addEventListener("dispose", Y), Pe = /* @__PURE__ */ new Map(), O.programs = Pe);
      let Le = Pe.get(ue);
      if (Le !== void 0) {
        if (O.currentProgram === Le && O.lightsStateVersion === le)
          return os(x, pe), Le;
      } else
        pe.uniforms = k.getUniforms(x), x.onBeforeCompile(pe, M), Le = k.acquireProgram(pe, ue), Pe.set(ue, Le), O.uniforms = pe.uniforms;
      const Te = O.uniforms;
      return (!x.isShaderMaterial && !x.isRawShaderMaterial || x.clipping === !0) && (Te.clippingPlanes = te.uniform), os(x, pe), O.needsLights = ka(x), O.lightsStateVersion = le, O.needsLights && (Te.ambientLightColor.value = I.state.ambient, Te.lightProbe.value = I.state.probe, Te.directionalLights.value = I.state.directional, Te.directionalLightShadows.value = I.state.directionalShadow, Te.spotLights.value = I.state.spot, Te.spotLightShadows.value = I.state.spotShadow, Te.rectAreaLights.value = I.state.rectArea, Te.ltc_1.value = I.state.rectAreaLTC1, Te.ltc_2.value = I.state.rectAreaLTC2, Te.pointLights.value = I.state.point, Te.pointLightShadows.value = I.state.pointShadow, Te.hemisphereLights.value = I.state.hemi, Te.directionalShadowMap.value = I.state.directionalShadowMap, Te.directionalShadowMatrix.value = I.state.directionalShadowMatrix, Te.spotShadowMap.value = I.state.spotShadowMap, Te.spotLightMatrix.value = I.state.spotLightMatrix, Te.spotLightMap.value = I.state.spotLightMap, Te.pointShadowMap.value = I.state.pointShadowMap, Te.pointShadowMatrix.value = I.state.pointShadowMatrix), O.currentProgram = Le, O.uniformsList = null, Le;
    }
    function as(x) {
      if (x.uniformsList === null) {
        const U = x.currentProgram.getUniforms();
        x.uniformsList = er.seqWithValue(U.seq, x.uniforms);
      }
      return x.uniformsList;
    }
    function os(x, U) {
      const B = fe.get(x);
      B.outputColorSpace = U.outputColorSpace, B.batching = U.batching, B.batchingColor = U.batchingColor, B.instancing = U.instancing, B.instancingColor = U.instancingColor, B.instancingMorph = U.instancingMorph, B.skinning = U.skinning, B.morphTargets = U.morphTargets, B.morphNormals = U.morphNormals, B.morphColors = U.morphColors, B.morphTargetsCount = U.morphTargetsCount, B.numClippingPlanes = U.numClippingPlanes, B.numIntersection = U.numClipIntersection, B.vertexAlphas = U.vertexAlphas, B.vertexTangents = U.vertexTangents, B.toneMapping = U.toneMapping;
    }
    function Va(x, U, B, O, I) {
      U.isScene !== !0 && (U = Ue), ze.resetTextureUnits();
      const j = U.fog, le = O.isMeshStandardMaterial ? U.environment : null, pe = F === null ? M.outputColorSpace : F.isXRRenderTarget === !0 ? F.texture.colorSpace : Jn, ue = (O.isMeshStandardMaterial ? dt : xt).get(O.envMap || le), Pe = O.vertexColors === !0 && !!B.attributes.color && B.attributes.color.itemSize === 4, Le = !!B.attributes.tangent && (!!O.normalMap || O.anisotropy > 0), Te = !!B.morphAttributes.position, Ge = !!B.morphAttributes.normal, $e = !!B.morphAttributes.color;
      let ct = 0;
      O.toneMapped && (F === null || F.isXRRenderTarget === !0) && (ct = M.toneMapping);
      const nt = B.morphAttributes.position || B.morphAttributes.normal || B.morphAttributes.color, Je = nt !== void 0 ? nt.length : 0, be = fe.get(O), ot = u.state.lights;
      if (W === !0 && (ae === !0 || x !== S)) {
        const Et = x === S && O.id === y;
        te.setState(O, x, Et);
      }
      let Xe = !1;
      O.version === be.__version ? (be.needsLights && be.lightsStateVersion !== ot.state.version || be.outputColorSpace !== pe || I.isBatchedMesh && be.batching === !1 || !I.isBatchedMesh && be.batching === !0 || I.isBatchedMesh && be.batchingColor === !0 && I.colorTexture === null || I.isBatchedMesh && be.batchingColor === !1 && I.colorTexture !== null || I.isInstancedMesh && be.instancing === !1 || !I.isInstancedMesh && be.instancing === !0 || I.isSkinnedMesh && be.skinning === !1 || !I.isSkinnedMesh && be.skinning === !0 || I.isInstancedMesh && be.instancingColor === !0 && I.instanceColor === null || I.isInstancedMesh && be.instancingColor === !1 && I.instanceColor !== null || I.isInstancedMesh && be.instancingMorph === !0 && I.morphTexture === null || I.isInstancedMesh && be.instancingMorph === !1 && I.morphTexture !== null || be.envMap !== ue || O.fog === !0 && be.fog !== j || be.numClippingPlanes !== void 0 && (be.numClippingPlanes !== te.numPlanes || be.numIntersection !== te.numIntersection) || be.vertexAlphas !== Pe || be.vertexTangents !== Le || be.morphTargets !== Te || be.morphNormals !== Ge || be.morphColors !== $e || be.toneMapping !== ct || be.morphTargetsCount !== Je) && (Xe = !0) : (Xe = !0, be.__version = O.version);
      let Pt = be.currentProgram;
      Xe === !0 && (Pt = Ei(O, U, I));
      let Rn = !1, Dt = !1, ri = !1;
      const lt = Pt.getUniforms(), It = be.uniforms;
      if (ye.useProgram(Pt.program) && (Rn = !0, Dt = !0, ri = !0), O.id !== y && (y = O.id, Dt = !0), Rn || S !== x) {
        ye.buffers.depth.getReversed() && x.reversedDepth !== !0 && (x._reversedDepth = !0, x.updateProjectionMatrix()), lt.setValue(w, "projectionMatrix", x.projectionMatrix), lt.setValue(w, "viewMatrix", x.matrixWorldInverse);
        const Ct = lt.map.cameraPosition;
        Ct !== void 0 && Ct.setValue(w, Re.setFromMatrixPosition(x.matrixWorld)), qe.logarithmicDepthBuffer && lt.setValue(
          w,
          "logDepthBufFC",
          2 / (Math.log(x.far + 1) / Math.LN2)
        ), (O.isMeshPhongMaterial || O.isMeshToonMaterial || O.isMeshLambertMaterial || O.isMeshBasicMaterial || O.isMeshStandardMaterial || O.isShaderMaterial) && lt.setValue(w, "isOrthographic", x.isOrthographicCamera === !0), S !== x && (S = x, Dt = !0, ri = !0);
      }
      if (I.isSkinnedMesh) {
        lt.setOptional(w, I, "bindMatrix"), lt.setOptional(w, I, "bindMatrixInverse");
        const Et = I.skeleton;
        Et && (Et.boneTexture === null && Et.computeBoneTexture(), lt.setValue(w, "boneTexture", Et.boneTexture, ze));
      }
      I.isBatchedMesh && (lt.setOptional(w, I, "batchingTexture"), lt.setValue(w, "batchingTexture", I._matricesTexture, ze), lt.setOptional(w, I, "batchingIdTexture"), lt.setValue(w, "batchingIdTexture", I._indirectTexture, ze), lt.setOptional(w, I, "batchingColorTexture"), I._colorsTexture !== null && lt.setValue(w, "batchingColorTexture", I._colorsTexture, ze));
      const Ft = B.morphAttributes;
      if ((Ft.position !== void 0 || Ft.normal !== void 0 || Ft.color !== void 0) && J.update(I, B, Pt), (Dt || be.receiveShadow !== I.receiveShadow) && (be.receiveShadow = I.receiveShadow, lt.setValue(w, "receiveShadow", I.receiveShadow)), O.isMeshGouraudMaterial && O.envMap !== null && (It.envMap.value = ue, It.flipEnvMap.value = ue.isCubeTexture && ue.isRenderTargetTexture === !1 ? -1 : 1), O.isMeshStandardMaterial && O.envMap === null && U.environment !== null && (It.envMapIntensity.value = U.environmentIntensity), Dt && (lt.setValue(w, "toneMappingExposure", M.toneMappingExposure), be.needsLights && Ha(It, ri), j && O.fog === !0 && K.refreshFogUniforms(It, j), K.refreshMaterialUniforms(It, O, z, ee, u.state.transmissionRenderTarget[x.id]), er.upload(w, as(be), It, ze)), O.isShaderMaterial && O.uniformsNeedUpdate === !0 && (er.upload(w, as(be), It, ze), O.uniformsNeedUpdate = !1), O.isSpriteMaterial && lt.setValue(w, "center", I.center), lt.setValue(w, "modelViewMatrix", I.modelViewMatrix), lt.setValue(w, "normalMatrix", I.normalMatrix), lt.setValue(w, "modelMatrix", I.matrixWorld), O.isShaderMaterial || O.isRawShaderMaterial) {
        const Et = O.uniformsGroups;
        for (let Ct = 0, ur = Et.length; Ct < ur; Ct++) {
          const pn = Et[Ct];
          Fe.update(pn, Pt), Fe.bind(pn, Pt);
        }
      }
      return Pt;
    }
    function Ha(x, U) {
      x.ambientLightColor.needsUpdate = U, x.lightProbe.needsUpdate = U, x.directionalLights.needsUpdate = U, x.directionalLightShadows.needsUpdate = U, x.pointLights.needsUpdate = U, x.pointLightShadows.needsUpdate = U, x.spotLights.needsUpdate = U, x.spotLightShadows.needsUpdate = U, x.rectAreaLights.needsUpdate = U, x.hemisphereLights.needsUpdate = U;
    }
    function ka(x) {
      return x.isMeshLambertMaterial || x.isMeshToonMaterial || x.isMeshPhongMaterial || x.isMeshStandardMaterial || x.isShadowMaterial || x.isShaderMaterial && x.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return R;
    }, this.getActiveMipmapLevel = function() {
      return L;
    }, this.getRenderTarget = function() {
      return F;
    }, this.setRenderTargetTextures = function(x, U, B) {
      const O = fe.get(x);
      O.__autoAllocateDepthBuffer = x.resolveDepthBuffer === !1, O.__autoAllocateDepthBuffer === !1 && (O.__useRenderToTexture = !1), fe.get(x.texture).__webglTexture = U, fe.get(x.depthTexture).__webglTexture = O.__autoAllocateDepthBuffer ? void 0 : B, O.__hasExternalTextures = !0;
    }, this.setRenderTargetFramebuffer = function(x, U) {
      const B = fe.get(x);
      B.__webglFramebuffer = U, B.__useDefaultFramebuffer = U === void 0;
    };
    const Wa = w.createFramebuffer();
    this.setRenderTarget = function(x, U = 0, B = 0) {
      F = x, R = U, L = B;
      let O = !0, I = null, j = !1, le = !1;
      if (x) {
        const ue = fe.get(x);
        if (ue.__useDefaultFramebuffer !== void 0)
          ye.bindFramebuffer(w.FRAMEBUFFER, null), O = !1;
        else if (ue.__webglFramebuffer === void 0)
          ze.setupRenderTarget(x);
        else if (ue.__hasExternalTextures)
          ze.rebindTextures(x, fe.get(x.texture).__webglTexture, fe.get(x.depthTexture).__webglTexture);
        else if (x.depthBuffer) {
          const Te = x.depthTexture;
          if (ue.__boundDepthTexture !== Te) {
            if (Te !== null && fe.has(Te) && (x.width !== Te.image.width || x.height !== Te.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            ze.setupDepthRenderbuffer(x);
          }
        }
        const Pe = x.texture;
        (Pe.isData3DTexture || Pe.isDataArrayTexture || Pe.isCompressedArrayTexture) && (le = !0);
        const Le = fe.get(x).__webglFramebuffer;
        x.isWebGLCubeRenderTarget ? (Array.isArray(Le[U]) ? I = Le[U][B] : I = Le[U], j = !0) : x.samples > 0 && ze.useMultisampledRTT(x) === !1 ? I = fe.get(x).__webglMultisampledFramebuffer : Array.isArray(Le) ? I = Le[B] : I = Le, b.copy(x.viewport), q.copy(x.scissor), V = x.scissorTest;
      } else
        b.copy(Ee).multiplyScalar(z).floor(), q.copy(Oe).multiplyScalar(z).floor(), V = it;
      if (B !== 0 && (I = Wa), ye.bindFramebuffer(w.FRAMEBUFFER, I) && O && ye.drawBuffers(x, I), ye.viewport(b), ye.scissor(q), ye.setScissorTest(V), j) {
        const ue = fe.get(x.texture);
        w.framebufferTexture2D(w.FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_CUBE_MAP_POSITIVE_X + U, ue.__webglTexture, B);
      } else if (le) {
        const ue = U;
        for (let Pe = 0; Pe < x.textures.length; Pe++) {
          const Le = fe.get(x.textures[Pe]);
          w.framebufferTextureLayer(w.FRAMEBUFFER, w.COLOR_ATTACHMENT0 + Pe, Le.__webglTexture, B, ue);
        }
      } else if (x !== null && B !== 0) {
        const ue = fe.get(x.texture);
        w.framebufferTexture2D(w.FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_2D, ue.__webglTexture, B);
      }
      y = -1;
    }, this.readRenderTargetPixels = function(x, U, B, O, I, j, le, pe = 0) {
      if (!(x && x.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let ue = fe.get(x).__webglFramebuffer;
      if (x.isWebGLCubeRenderTarget && le !== void 0 && (ue = ue[le]), ue) {
        ye.bindFramebuffer(w.FRAMEBUFFER, ue);
        try {
          const Pe = x.textures[pe], Le = Pe.format, Te = Pe.type;
          if (!qe.textureFormatReadable(Le)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!qe.textureTypeReadable(Te)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          U >= 0 && U <= x.width - O && B >= 0 && B <= x.height - I && (x.textures.length > 1 && w.readBuffer(w.COLOR_ATTACHMENT0 + pe), w.readPixels(U, B, O, I, ve.convert(Le), ve.convert(Te), j));
        } finally {
          const Pe = F !== null ? fe.get(F).__webglFramebuffer : null;
          ye.bindFramebuffer(w.FRAMEBUFFER, Pe);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(x, U, B, O, I, j, le, pe = 0) {
      if (!(x && x.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let ue = fe.get(x).__webglFramebuffer;
      if (x.isWebGLCubeRenderTarget && le !== void 0 && (ue = ue[le]), ue)
        if (U >= 0 && U <= x.width - O && B >= 0 && B <= x.height - I) {
          ye.bindFramebuffer(w.FRAMEBUFFER, ue);
          const Pe = x.textures[pe], Le = Pe.format, Te = Pe.type;
          if (!qe.textureFormatReadable(Le))
            throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
          if (!qe.textureTypeReadable(Te))
            throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
          const Ge = w.createBuffer();
          w.bindBuffer(w.PIXEL_PACK_BUFFER, Ge), w.bufferData(w.PIXEL_PACK_BUFFER, j.byteLength, w.STREAM_READ), x.textures.length > 1 && w.readBuffer(w.COLOR_ATTACHMENT0 + pe), w.readPixels(U, B, O, I, ve.convert(Le), ve.convert(Te), 0);
          const $e = F !== null ? fe.get(F).__webglFramebuffer : null;
          ye.bindFramebuffer(w.FRAMEBUFFER, $e);
          const ct = w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return w.flush(), await fo(w, ct, 4), w.bindBuffer(w.PIXEL_PACK_BUFFER, Ge), w.getBufferSubData(w.PIXEL_PACK_BUFFER, 0, j), w.deleteBuffer(Ge), w.deleteSync(ct), j;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
    }, this.copyFramebufferToTexture = function(x, U = null, B = 0) {
      const O = Math.pow(2, -B), I = Math.floor(x.image.width * O), j = Math.floor(x.image.height * O), le = U !== null ? U.x : 0, pe = U !== null ? U.y : 0;
      ze.setTexture2D(x, 0), w.copyTexSubImage2D(w.TEXTURE_2D, B, 0, 0, le, pe, I, j), ye.unbindTexture();
    };
    const Xa = w.createFramebuffer(), qa = w.createFramebuffer();
    this.copyTextureToTexture = function(x, U, B = null, O = null, I = 0, j = null) {
      j === null && (I !== 0 ? (Zn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."), j = I, I = 0) : j = 0);
      let le, pe, ue, Pe, Le, Te, Ge, $e, ct;
      const nt = x.isCompressedTexture ? x.mipmaps[j] : x.image;
      if (B !== null)
        le = B.max.x - B.min.x, pe = B.max.y - B.min.y, ue = B.isBox3 ? B.max.z - B.min.z : 1, Pe = B.min.x, Le = B.min.y, Te = B.isBox3 ? B.min.z : 0;
      else {
        const Ft = Math.pow(2, -I);
        le = Math.floor(nt.width * Ft), pe = Math.floor(nt.height * Ft), x.isDataArrayTexture ? ue = nt.depth : x.isData3DTexture ? ue = Math.floor(nt.depth * Ft) : ue = 1, Pe = 0, Le = 0, Te = 0;
      }
      O !== null ? (Ge = O.x, $e = O.y, ct = O.z) : (Ge = 0, $e = 0, ct = 0);
      const Je = ve.convert(U.format), be = ve.convert(U.type);
      let ot;
      U.isData3DTexture ? (ze.setTexture3D(U, 0), ot = w.TEXTURE_3D) : U.isDataArrayTexture || U.isCompressedArrayTexture ? (ze.setTexture2DArray(U, 0), ot = w.TEXTURE_2D_ARRAY) : (ze.setTexture2D(U, 0), ot = w.TEXTURE_2D), w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL, U.flipY), w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL, U.premultiplyAlpha), w.pixelStorei(w.UNPACK_ALIGNMENT, U.unpackAlignment);
      const Xe = w.getParameter(w.UNPACK_ROW_LENGTH), Pt = w.getParameter(w.UNPACK_IMAGE_HEIGHT), Rn = w.getParameter(w.UNPACK_SKIP_PIXELS), Dt = w.getParameter(w.UNPACK_SKIP_ROWS), ri = w.getParameter(w.UNPACK_SKIP_IMAGES);
      w.pixelStorei(w.UNPACK_ROW_LENGTH, nt.width), w.pixelStorei(w.UNPACK_IMAGE_HEIGHT, nt.height), w.pixelStorei(w.UNPACK_SKIP_PIXELS, Pe), w.pixelStorei(w.UNPACK_SKIP_ROWS, Le), w.pixelStorei(w.UNPACK_SKIP_IMAGES, Te);
      const lt = x.isDataArrayTexture || x.isData3DTexture, It = U.isDataArrayTexture || U.isData3DTexture;
      if (x.isDepthTexture) {
        const Ft = fe.get(x), Et = fe.get(U), Ct = fe.get(Ft.__renderTarget), ur = fe.get(Et.__renderTarget);
        ye.bindFramebuffer(w.READ_FRAMEBUFFER, Ct.__webglFramebuffer), ye.bindFramebuffer(w.DRAW_FRAMEBUFFER, ur.__webglFramebuffer);
        for (let pn = 0; pn < ue; pn++)
          lt && (w.framebufferTextureLayer(w.READ_FRAMEBUFFER, w.COLOR_ATTACHMENT0, fe.get(x).__webglTexture, I, Te + pn), w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER, w.COLOR_ATTACHMENT0, fe.get(U).__webglTexture, j, ct + pn)), w.blitFramebuffer(Pe, Le, le, pe, Ge, $e, le, pe, w.DEPTH_BUFFER_BIT, w.NEAREST);
        ye.bindFramebuffer(w.READ_FRAMEBUFFER, null), ye.bindFramebuffer(w.DRAW_FRAMEBUFFER, null);
      } else if (I !== 0 || x.isRenderTargetTexture || fe.has(x)) {
        const Ft = fe.get(x), Et = fe.get(U);
        ye.bindFramebuffer(w.READ_FRAMEBUFFER, Xa), ye.bindFramebuffer(w.DRAW_FRAMEBUFFER, qa);
        for (let Ct = 0; Ct < ue; Ct++)
          lt ? w.framebufferTextureLayer(w.READ_FRAMEBUFFER, w.COLOR_ATTACHMENT0, Ft.__webglTexture, I, Te + Ct) : w.framebufferTexture2D(w.READ_FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_2D, Ft.__webglTexture, I), It ? w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER, w.COLOR_ATTACHMENT0, Et.__webglTexture, j, ct + Ct) : w.framebufferTexture2D(w.DRAW_FRAMEBUFFER, w.COLOR_ATTACHMENT0, w.TEXTURE_2D, Et.__webglTexture, j), I !== 0 ? w.blitFramebuffer(Pe, Le, le, pe, Ge, $e, le, pe, w.COLOR_BUFFER_BIT, w.NEAREST) : It ? w.copyTexSubImage3D(ot, j, Ge, $e, ct + Ct, Pe, Le, le, pe) : w.copyTexSubImage2D(ot, j, Ge, $e, Pe, Le, le, pe);
        ye.bindFramebuffer(w.READ_FRAMEBUFFER, null), ye.bindFramebuffer(w.DRAW_FRAMEBUFFER, null);
      } else
        It ? x.isDataTexture || x.isData3DTexture ? w.texSubImage3D(ot, j, Ge, $e, ct, le, pe, ue, Je, be, nt.data) : U.isCompressedArrayTexture ? w.compressedTexSubImage3D(ot, j, Ge, $e, ct, le, pe, ue, Je, nt.data) : w.texSubImage3D(ot, j, Ge, $e, ct, le, pe, ue, Je, be, nt) : x.isDataTexture ? w.texSubImage2D(w.TEXTURE_2D, j, Ge, $e, le, pe, Je, be, nt.data) : x.isCompressedTexture ? w.compressedTexSubImage2D(w.TEXTURE_2D, j, Ge, $e, nt.width, nt.height, Je, nt.data) : w.texSubImage2D(w.TEXTURE_2D, j, Ge, $e, le, pe, Je, be, nt);
      w.pixelStorei(w.UNPACK_ROW_LENGTH, Xe), w.pixelStorei(w.UNPACK_IMAGE_HEIGHT, Pt), w.pixelStorei(w.UNPACK_SKIP_PIXELS, Rn), w.pixelStorei(w.UNPACK_SKIP_ROWS, Dt), w.pixelStorei(w.UNPACK_SKIP_IMAGES, ri), j === 0 && U.generateMipmaps && w.generateMipmap(ot), ye.unbindTexture();
    }, this.copyTextureToTexture3D = function(x, U, B = null, O = null, I = 0) {
      return Zn('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'), this.copyTextureToTexture(x, U, B, O, I);
    }, this.initRenderTarget = function(x) {
      fe.get(x).__webglFramebuffer === void 0 && ze.setupRenderTarget(x);
    }, this.initTexture = function(x) {
      x.isCubeTexture ? ze.setTextureCube(x, 0) : x.isData3DTexture ? ze.setTexture3D(x, 0) : x.isDataArrayTexture || x.isCompressedArrayTexture ? ze.setTexture2DArray(x, 0) : ze.setTexture2D(x, 0), ye.unbindTexture();
    }, this.resetState = function() {
      R = 0, L = 0, F = null, ye.reset(), oe.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  /**
   * Defines the coordinate system of the renderer.
   *
   * In `WebGLRenderer`, the value is always `WebGLCoordinateSystem`.
   *
   * @type {WebGLCoordinateSystem|WebGPUCoordinateSystem}
   * @default WebGLCoordinateSystem
   * @readonly
   */
  get coordinateSystem() {
    return 2e3;
  }
  /**
   * Defines the output color space of the renderer.
   *
   * @type {SRGBColorSpace|LinearSRGBColorSpace}
   * @default SRGBColorSpace
   */
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const t = this.getContext();
    t.drawingBufferColorSpace = We._getDrawingBufferColorSpace(e), t.unpackColorSpace = We._getUnpackColorSpace();
  }
}
class ua extends ft {
  /**
   * Constructs a new CSS2D object.
   *
   * @param {DOMElement} [element] - The DOM element.
   */
  constructor(e = document.createElement("div")) {
    super(), this.isCSS2DObject = !0, this.element = e, this.element.style.position = "absolute", this.element.style.userSelect = "none", this.element.setAttribute("draggable", !1), this.center = new we(0.5, 0.5), this.addEventListener("removed", function() {
      this.traverse(function(t) {
        t.element instanceof t.element.ownerDocument.defaultView.Element && t.element.parentNode !== null && t.element.remove();
      });
    });
  }
  copy(e, t) {
    return super.copy(e, t), this.element = e.element.cloneNode(!0), this.center = e.center, this;
  }
}
const qn = new P(), da = new Qe(), fa = new Qe(), pa = new P(), ma = new P();
class Nd {
  /**
   * Constructs a new CSS2D renderer.
   *
   * @param {CSS2DRenderer~Parameters} [parameters] - The parameters.
   */
  constructor(e = {}) {
    const t = this;
    let n, r, s, a;
    const o = {
      objects: /* @__PURE__ */ new WeakMap()
    }, c = e.element !== void 0 ? e.element : document.createElement("div");
    c.style.overflow = "hidden", this.domElement = c, this.getSize = function() {
      return {
        width: n,
        height: r
      };
    }, this.render = function(g, _) {
      g.matrixWorldAutoUpdate === !0 && g.updateMatrixWorld(), _.parent === null && _.matrixWorldAutoUpdate === !0 && _.updateMatrixWorld(), da.copy(_.matrixWorldInverse), fa.multiplyMatrices(_.projectionMatrix, da), h(g, g, _), p(g);
    }, this.setSize = function(g, _) {
      n = g, r = _, s = n / 2, a = r / 2, c.style.width = g + "px", c.style.height = _ + "px";
    };
    function l(g) {
      g.isCSS2DObject && (g.element.style.display = "none");
      for (let _ = 0, m = g.children.length; _ < m; _++)
        l(g.children[_]);
    }
    function h(g, _, m) {
      if (g.visible === !1) {
        l(g);
        return;
      }
      if (g.isCSS2DObject) {
        qn.setFromMatrixPosition(g.matrixWorld), qn.applyMatrix4(fa);
        const u = qn.z >= -1 && qn.z <= 1 && g.layers.test(m.layers) === !0, A = g.element;
        A.style.display = u === !0 ? "" : "none", u === !0 && (g.onBeforeRender(t, _, m), A.style.transform = "translate(" + -100 * g.center.x + "%," + -100 * g.center.y + "%)translate(" + (qn.x * s + s) + "px," + (-qn.y * a + a) + "px)", A.parentNode !== c && c.appendChild(A), g.onAfterRender(t, _, m));
        const E = {
          distanceToCameraSquared: f(m, g)
        };
        o.objects.set(g, E);
      }
      for (let u = 0, A = g.children.length; u < A; u++)
        h(g.children[u], _, m);
    }
    function f(g, _) {
      return pa.setFromMatrixPosition(g.matrixWorld), ma.setFromMatrixPosition(_.matrixWorld), pa.distanceToSquared(ma);
    }
    function d(g) {
      const _ = [];
      return g.traverseVisible(function(m) {
        m.isCSS2DObject && _.push(m);
      }), _;
    }
    function p(g) {
      const _ = d(g).sort(function(u, A) {
        if (u.renderOrder !== A.renderOrder)
          return A.renderOrder - u.renderOrder;
        const E = o.objects.get(u).distanceToCameraSquared, M = o.objects.get(A).distanceToCameraSquared;
        return E - M;
      }), m = _.length;
      for (let u = 0, A = _.length; u < A; u++)
        _[u].element.style.zIndex = m - u;
    }
  }
}
const tr = {
  name: "CopyShader",
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`
  )
};
class ii {
  /**
   * Constructs a new pass.
   */
  constructor() {
    this.isPass = !0, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.renderToScreen = !1;
  }
  /**
   * Sets the size of the pass.
   *
   * @abstract
   * @param {number} width - The width to set.
   * @param {number} height - The height to set.
   */
  setSize() {
  }
  /**
   * This method holds the render logic of a pass. It must be implemented in all derived classes.
   *
   * @abstract
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
   * destination for the pass.
   * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
   * previous pass from this buffer.
   * @param {number} deltaTime - The delta time in seconds.
   * @param {boolean} maskActive - Whether masking is active or not.
   */
  render() {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever the pass is no longer used in your app.
   *
   * @abstract
   */
  dispose() {
  }
}
const Bd = new Qr(-1, 1, 1, -1, 0, 1);
class Od extends st {
  constructor() {
    super(), this.setAttribute("position", new at([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new at([0, 2, 0, 0, 2, 0], 2));
  }
}
const zd = new Od();
class ts {
  /**
   * Constructs a new full screen quad.
   *
   * @param {?Material} material - The material to render te full screen quad with.
   */
  constructor(e) {
    this._mesh = new wt(zd, e);
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever the instance is no longer used in your app.
   */
  dispose() {
    this._mesh.geometry.dispose();
  }
  /**
   * Renders the full screen quad.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   */
  render(e) {
    e.render(this._mesh, Bd);
  }
  /**
   * The quad's material.
   *
   * @type {?Material}
   */
  get material() {
    return this._mesh.material;
  }
  set material(e) {
    this._mesh.material = e;
  }
}
class Gd extends ii {
  /**
   * Constructs a new shader pass.
   *
   * @param {Object|ShaderMaterial} [shader] - A shader object holding vertex and fragment shader as well as
   * defines and uniforms. It's also valid to pass a custom shader material.
   * @param {string} [textureID='tDiffuse'] - The name of the texture uniform that should sample
   * the read buffer.
   */
  constructor(e, t = "tDiffuse") {
    super(), this.textureID = t, this.uniforms = null, this.material = null, e instanceof gt ? (this.uniforms = e.uniforms, this.material = e) : e && (this.uniforms = vi.clone(e.uniforms), this.material = new gt({
      name: e.name !== void 0 ? e.name : "unspecified",
      defines: Object.assign({}, e.defines),
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    })), this._fsQuad = new ts(this.material);
  }
  /**
   * Performs the shader pass.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
   * destination for the pass.
   * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
   * previous pass from this buffer.
   * @param {number} deltaTime - The delta time in seconds.
   * @param {boolean} maskActive - Whether masking is active or not.
   */
  render(e, t, n) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = n.texture), this._fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this._fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this._fsQuad.render(e));
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever the pass is no longer used in your app.
   */
  dispose() {
    this.material.dispose(), this._fsQuad.dispose();
  }
}
class ga extends ii {
  /**
   * Constructs a new mask pass.
   *
   * @param {Scene} scene - The 3D objects in this scene will define the mask.
   * @param {Camera} camera - The camera.
   */
  constructor(e, t) {
    super(), this.scene = e, this.camera = t, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  /**
   * Performs a mask pass with the configured scene and camera.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
   * destination for the pass.
   * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
   * previous pass from this buffer.
   * @param {number} deltaTime - The delta time in seconds.
   * @param {boolean} maskActive - Whether masking is active or not.
   */
  render(e, t, n) {
    const r = e.getContext(), s = e.state;
    s.buffers.color.setMask(!1), s.buffers.depth.setMask(!1), s.buffers.color.setLocked(!0), s.buffers.depth.setLocked(!0);
    let a, o;
    this.inverse ? (a = 0, o = 1) : (a = 1, o = 0), s.buffers.stencil.setTest(!0), s.buffers.stencil.setOp(r.REPLACE, r.REPLACE, r.REPLACE), s.buffers.stencil.setFunc(r.ALWAYS, a, 4294967295), s.buffers.stencil.setClear(o), s.buffers.stencil.setLocked(!0), e.setRenderTarget(n), this.clear && e.clear(), e.render(this.scene, this.camera), e.setRenderTarget(t), this.clear && e.clear(), e.render(this.scene, this.camera), s.buffers.color.setLocked(!1), s.buffers.depth.setLocked(!1), s.buffers.color.setMask(!0), s.buffers.depth.setMask(!0), s.buffers.stencil.setLocked(!1), s.buffers.stencil.setFunc(r.EQUAL, 1, 4294967295), s.buffers.stencil.setOp(r.KEEP, r.KEEP, r.KEEP), s.buffers.stencil.setLocked(!0);
  }
}
class Vd extends ii {
  /**
   * Constructs a new clear mask pass.
   */
  constructor() {
    super(), this.needsSwap = !1;
  }
  /**
   * Performs the clear of the currently defined mask.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
   * destination for the pass.
   * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
   * previous pass from this buffer.
   * @param {number} deltaTime - The delta time in seconds.
   * @param {boolean} maskActive - Whether masking is active or not.
   */
  render(e) {
    e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
  }
}
class Hd {
  /**
   * Constructs a new effect composer.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} [renderTarget] - This render target and a clone will
   * be used as the internal read and write buffers. If not given, the composer creates
   * the buffers automatically.
   */
  constructor(e, t) {
    if (this.renderer = e, this._pixelRatio = e.getPixelRatio(), t === void 0) {
      const n = e.getSize(new we());
      this._width = n.width, this._height = n.height, t = new kt(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: 1016 }), t.texture.name = "EffectComposer.rt1";
    } else
      this._width = t.width, this._height = t.height;
    this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new Gd(tr), this.copyPass.material.blending = 0, this.clock = new Ua();
  }
  /**
   * Swaps the internal read/write buffers.
   */
  swapBuffers() {
    const e = this.readBuffer;
    this.readBuffer = this.writeBuffer, this.writeBuffer = e;
  }
  /**
   * Adds the given pass to the pass chain.
   *
   * @param {Pass} pass - The pass to add.
   */
  addPass(e) {
    this.passes.push(e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  /**
   * Inserts the given pass at a given index.
   *
   * @param {Pass} pass - The pass to insert.
   * @param {number} index - The index into the pass chain.
   */
  insertPass(e, t) {
    this.passes.splice(t, 0, e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  /**
   * Removes the given pass from the pass chain.
   *
   * @param {Pass} pass - The pass to remove.
   */
  removePass(e) {
    const t = this.passes.indexOf(e);
    t !== -1 && this.passes.splice(t, 1);
  }
  /**
   * Returns `true` if the pass for the given index is the last enabled pass in the pass chain.
   *
   * @param {number} passIndex - The pass index.
   * @return {boolean} Whether the pass for the given index is the last pass in the pass chain.
   */
  isLastEnabledPass(e) {
    for (let t = e + 1; t < this.passes.length; t++)
      if (this.passes[t].enabled)
        return !1;
    return !0;
  }
  /**
   * Executes all enabled post-processing passes in order to produce the final frame.
   *
   * @param {number} deltaTime - The delta time in seconds. If not given, the composer computes
   * its own time delta value.
   */
  render(e) {
    e === void 0 && (e = this.clock.getDelta());
    const t = this.renderer.getRenderTarget();
    let n = !1;
    for (let r = 0, s = this.passes.length; r < s; r++) {
      const a = this.passes[r];
      if (a.enabled !== !1) {
        if (a.renderToScreen = this.renderToScreen && this.isLastEnabledPass(r), a.render(this.renderer, this.writeBuffer, this.readBuffer, e, n), a.needsSwap) {
          if (n) {
            const o = this.renderer.getContext(), c = this.renderer.state.buffers.stencil;
            c.setFunc(o.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e), c.setFunc(o.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        ga !== void 0 && (a instanceof ga ? n = !0 : a instanceof Vd && (n = !1));
      }
    }
    this.renderer.setRenderTarget(t);
  }
  /**
   * Resets the internal state of the EffectComposer.
   *
   * @param {WebGLRenderTarget} [renderTarget] - This render target has the same purpose like
   * the one from the constructor. If set, it is used to setup the read and write buffers.
   */
  reset(e) {
    if (e === void 0) {
      const t = this.renderer.getSize(new we());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = t.width, this._height = t.height, e = this.renderTarget1.clone(), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = e, this.renderTarget2 = e.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  /**
   * Resizes the internal read and write buffers as well as all passes. Similar to {@link WebGLRenderer#setSize},
   * this method honors the current pixel ration.
   *
   * @param {number} width - The width in logical pixels.
   * @param {number} height - The height in logical pixels.
   */
  setSize(e, t) {
    this._width = e, this._height = t;
    const n = this._width * this._pixelRatio, r = this._height * this._pixelRatio;
    this.renderTarget1.setSize(n, r), this.renderTarget2.setSize(n, r);
    for (let s = 0; s < this.passes.length; s++)
      this.passes[s].setSize(n, r);
  }
  /**
   * Sets device pixel ratio. This is usually used for HiDPI device to prevent blurring output.
   * Setting the pixel ratio will automatically resize the composer.
   *
   * @param {number} pixelRatio - The pixel ratio to set.
   */
  setPixelRatio(e) {
    this._pixelRatio = e, this.setSize(this._width, this._height);
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever the composer is no longer used in your app.
   */
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
const ji = {
  name: "OutputShader",
  uniforms: {
    tDiffuse: { value: null },
    toneMappingExposure: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`
  )
};
class kd extends ii {
  /**
   * Constructs a new output pass.
   */
  constructor() {
    super(), this.uniforms = vi.clone(ji.uniforms), this.material = new ko({
      name: ji.name,
      uniforms: this.uniforms,
      vertexShader: ji.vertexShader,
      fragmentShader: ji.fragmentShader
    }), this._fsQuad = new ts(this.material), this._outputColorSpace = null, this._toneMapping = null;
  }
  /**
   * Performs the output pass.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
   * destination for the pass.
   * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
   * previous pass from this buffer.
   * @param {number} deltaTime - The delta time in seconds.
   * @param {boolean} maskActive - Whether masking is active or not.
   */
  render(e, t, n) {
    this.uniforms.tDiffuse.value = n.texture, this.uniforms.toneMappingExposure.value = e.toneMappingExposure, (this._outputColorSpace !== e.outputColorSpace || this._toneMapping !== e.toneMapping) && (this._outputColorSpace = e.outputColorSpace, this._toneMapping = e.toneMapping, this.material.defines = {}, We.getTransfer(this._outputColorSpace) === Ke && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === 1 ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === 2 ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === 3 ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === 4 ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === 6 ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === 7 ? this.material.defines.NEUTRAL_TONE_MAPPING = "" : this._toneMapping === 5 && (this.material.defines.CUSTOM_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (e.setRenderTarget(null), this._fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this._fsQuad.render(e));
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever the pass is no longer used in your app.
   */
  dispose() {
    this.material.dispose(), this._fsQuad.dispose();
  }
}
class Wd extends ii {
  /**
   * Constructs a new render pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera.
   * @param {?Material} [overrideMaterial=null] - The override material. If set, this material is used
   * for all objects in the scene.
   * @param {?(number|Color|string)} [clearColor=null] - The clear color of the render pass.
   * @param {?number} [clearAlpha=null] - The clear alpha of the render pass.
   */
  constructor(e, t, n = null, r = null, s = null) {
    super(), this.scene = e, this.camera = t, this.overrideMaterial = n, this.clearColor = r, this.clearAlpha = s, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new Se();
  }
  /**
   * Performs a beauty pass with the configured scene and camera.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
   * destination for the pass.
   * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
   * previous pass from this buffer.
   * @param {number} deltaTime - The delta time in seconds.
   * @param {boolean} maskActive - Whether masking is active or not.
   */
  render(e, t, n) {
    const r = e.autoClear;
    e.autoClear = !1;
    let s, a;
    this.overrideMaterial !== null && (a = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())), this.clearAlpha !== null && (s = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : n), this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor !== null && e.setClearColor(this._oldClearColor), this.clearAlpha !== null && e.setClearAlpha(s), this.overrideMaterial !== null && (this.scene.overrideMaterial = a), e.autoClear = r;
  }
}
const Xd = {
  uniforms: {
    tDiffuse: { value: null },
    luminosityThreshold: { value: 1 },
    smoothWidth: { value: 1 },
    defaultColor: { value: new Se(0) },
    defaultOpacity: { value: 0 }
  },
  vertexShader: (
    /* glsl */
    `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`
  )
};
class ei extends ii {
  /**
   * Constructs a new Unreal Bloom pass.
   *
   * @param {Vector2} [resolution] - The effect's resolution.
   * @param {number} [strength=1] - The Bloom strength.
   * @param {number} radius - The Bloom radius.
   * @param {number} threshold - The luminance threshold limits which bright areas contribute to the Bloom effect.
   */
  constructor(e, t = 1, n, r) {
    super(), this.strength = t, this.radius = n, this.threshold = r, this.resolution = e !== void 0 ? new we(e.x, e.y) : new we(256, 256), this.clearColor = new Se(0, 0, 0), this.needsSwap = !1, this.renderTargetsHorizontal = [], this.renderTargetsVertical = [], this.nMips = 5;
    let s = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
    this.renderTargetBright = new kt(s, a, { type: 1016 }), this.renderTargetBright.texture.name = "UnrealBloomPass.bright", this.renderTargetBright.texture.generateMipmaps = !1;
    for (let h = 0; h < this.nMips; h++) {
      const f = new kt(s, a, { type: 1016 });
      f.texture.name = "UnrealBloomPass.h" + h, f.texture.generateMipmaps = !1, this.renderTargetsHorizontal.push(f);
      const d = new kt(s, a, { type: 1016 });
      d.texture.name = "UnrealBloomPass.v" + h, d.texture.generateMipmaps = !1, this.renderTargetsVertical.push(d), s = Math.round(s / 2), a = Math.round(a / 2);
    }
    const o = Xd;
    this.highPassUniforms = vi.clone(o.uniforms), this.highPassUniforms.luminosityThreshold.value = r, this.highPassUniforms.smoothWidth.value = 0.01, this.materialHighPassFilter = new gt({
      uniforms: this.highPassUniforms,
      vertexShader: o.vertexShader,
      fragmentShader: o.fragmentShader
    }), this.separableBlurMaterials = [];
    const c = [3, 5, 7, 9, 11];
    s = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
    for (let h = 0; h < this.nMips; h++)
      this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[h])), this.separableBlurMaterials[h].uniforms.invSize.value = new we(1 / s, 1 / a), s = Math.round(s / 2), a = Math.round(a / 2);
    this.compositeMaterial = this._getCompositeMaterial(this.nMips), this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture, this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture, this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture, this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture, this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture, this.compositeMaterial.uniforms.bloomStrength.value = t, this.compositeMaterial.uniforms.bloomRadius.value = 0.1;
    const l = [1, 0.8, 0.6, 0.4, 0.2];
    this.compositeMaterial.uniforms.bloomFactors.value = l, this.bloomTintColors = [new P(1, 1, 1), new P(1, 1, 1), new P(1, 1, 1), new P(1, 1, 1), new P(1, 1, 1)], this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, this.copyUniforms = vi.clone(tr.uniforms), this.blendMaterial = new gt({
      uniforms: this.copyUniforms,
      vertexShader: tr.vertexShader,
      fragmentShader: tr.fragmentShader,
      blending: 2,
      depthTest: !1,
      depthWrite: !1,
      transparent: !0
    }), this._oldClearColor = new Se(), this._oldClearAlpha = 1, this._basic = new jn(), this._fsQuad = new ts(null);
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever the pass is no longer used in your app.
   */
  dispose() {
    for (let e = 0; e < this.renderTargetsHorizontal.length; e++)
      this.renderTargetsHorizontal[e].dispose();
    for (let e = 0; e < this.renderTargetsVertical.length; e++)
      this.renderTargetsVertical[e].dispose();
    this.renderTargetBright.dispose();
    for (let e = 0; e < this.separableBlurMaterials.length; e++)
      this.separableBlurMaterials[e].dispose();
    this.compositeMaterial.dispose(), this.blendMaterial.dispose(), this._basic.dispose(), this._fsQuad.dispose();
  }
  /**
   * Sets the size of the pass.
   *
   * @param {number} width - The width to set.
   * @param {number} height - The height to set.
   */
  setSize(e, t) {
    let n = Math.round(e / 2), r = Math.round(t / 2);
    this.renderTargetBright.setSize(n, r);
    for (let s = 0; s < this.nMips; s++)
      this.renderTargetsHorizontal[s].setSize(n, r), this.renderTargetsVertical[s].setSize(n, r), this.separableBlurMaterials[s].uniforms.invSize.value = new we(1 / n, 1 / r), n = Math.round(n / 2), r = Math.round(r / 2);
  }
  /**
   * Performs the Bloom pass.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
   * destination for the pass.
   * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
   * previous pass from this buffer.
   * @param {number} deltaTime - The delta time in seconds.
   * @param {boolean} maskActive - Whether masking is active or not.
   */
  render(e, t, n, r, s) {
    e.getClearColor(this._oldClearColor), this._oldClearAlpha = e.getClearAlpha();
    const a = e.autoClear;
    e.autoClear = !1, e.setClearColor(this.clearColor, 0), s && e.state.buffers.stencil.setTest(!1), this.renderToScreen && (this._fsQuad.material = this._basic, this._basic.map = n.texture, e.setRenderTarget(null), e.clear(), this._fsQuad.render(e)), this.highPassUniforms.tDiffuse.value = n.texture, this.highPassUniforms.luminosityThreshold.value = this.threshold, this._fsQuad.material = this.materialHighPassFilter, e.setRenderTarget(this.renderTargetBright), e.clear(), this._fsQuad.render(e);
    let o = this.renderTargetBright;
    for (let c = 0; c < this.nMips; c++)
      this._fsQuad.material = this.separableBlurMaterials[c], this.separableBlurMaterials[c].uniforms.colorTexture.value = o.texture, this.separableBlurMaterials[c].uniforms.direction.value = ei.BlurDirectionX, e.setRenderTarget(this.renderTargetsHorizontal[c]), e.clear(), this._fsQuad.render(e), this.separableBlurMaterials[c].uniforms.colorTexture.value = this.renderTargetsHorizontal[c].texture, this.separableBlurMaterials[c].uniforms.direction.value = ei.BlurDirectionY, e.setRenderTarget(this.renderTargetsVertical[c]), e.clear(), this._fsQuad.render(e), o = this.renderTargetsVertical[c];
    this._fsQuad.material = this.compositeMaterial, this.compositeMaterial.uniforms.bloomStrength.value = this.strength, this.compositeMaterial.uniforms.bloomRadius.value = this.radius, this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, e.setRenderTarget(this.renderTargetsHorizontal[0]), e.clear(), this._fsQuad.render(e), this._fsQuad.material = this.blendMaterial, this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture, s && e.state.buffers.stencil.setTest(!0), this.renderToScreen ? (e.setRenderTarget(null), this._fsQuad.render(e)) : (e.setRenderTarget(n), this._fsQuad.render(e)), e.setClearColor(this._oldClearColor, this._oldClearAlpha), e.autoClear = a;
  }
  // internals
  _getSeparableBlurMaterial(e) {
    const t = [];
    for (let n = 0; n < e; n++)
      t.push(0.39894 * Math.exp(-0.5 * n * n / (e * e)) / e);
    return new gt({
      defines: {
        KERNEL_RADIUS: e
      },
      uniforms: {
        colorTexture: { value: null },
        invSize: { value: new we(0.5, 0.5) },
        // inverse texture size
        direction: { value: new we(0.5, 0.5) },
        gaussianCoefficients: { value: t }
        // precomputed Gaussian coefficients
      },
      vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
      fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
    });
  }
  _getCompositeMaterial(e) {
    return new gt({
      defines: {
        NUM_MIPS: e
      },
      uniforms: {
        blurTexture1: { value: null },
        blurTexture2: { value: null },
        blurTexture3: { value: null },
        blurTexture4: { value: null },
        blurTexture5: { value: null },
        bloomStrength: { value: 1 },
        bloomFactors: { value: null },
        bloomTintColors: { value: null },
        bloomRadius: { value: 0 }
      },
      vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
      fragmentShader: `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
    });
  }
}
ei.BlurDirectionX = new we(1, 0);
ei.BlurDirectionY = new we(0, 1);
const Tn = 3.66, _a = [9428223, 7441919, 11108607, 15370214, 7463135, 12886527], va = [10930687, 7837423, 10984937, 13869246, 8239298, 12430553], qd = 16749020, Yd = 14852293, xa = new Se(15791355);
function Kd(i) {
  return i - Math.floor(i);
}
function hn(i, e, t) {
  return Kd(Math.sin(i * 127.1 + e * 311.7 + t * 74.7) * 43758.5453123) * 2 - 1;
}
function Zd(i, e, t) {
  const n = Math.floor(i), r = Math.floor(e), s = Math.floor(t), a = i - n, o = e - r, c = t - s, l = a * a * (3 - 2 * a), h = o * o * (3 - 2 * o), f = c * c * (3 - 2 * c), d = mt.lerp(hn(n, r, s), hn(n + 1, r, s), l), p = mt.lerp(hn(n, r + 1, s), hn(n + 1, r + 1, s), l), g = mt.lerp(hn(n, r, s + 1), hn(n + 1, r, s + 1), l), _ = mt.lerp(hn(n, r + 1, s + 1), hn(n + 1, r + 1, s + 1), l), m = mt.lerp(d, p, h), u = mt.lerp(g, _, h);
  return mt.lerp(m, u, f);
}
function Ji(i, e) {
  let t = i.x * e + 11.7, n = i.y * e - 4.3, r = i.z * e + 7.9, s = 0.56, a = 0, o = 0;
  for (let c = 0; c < 4; c += 1)
    a += Zd(t, n, r) * s, o += s, t = t * 1.93 + 3.1, n = n * 2.07 - 1.7, r = r * 1.89 + 2.4, s *= 0.5;
  return a / o;
}
function $d() {
  let i = 2211636641;
  const e = () => (i = Math.imul(i ^ i >>> 15, 1 | i), i ^= i + Math.imul(i ^ i >>> 7, 61 | i), ((i ^ i >>> 14) >>> 0) / 4294967296), t = [], n = 19;
  for (let r = 0; r < n; r += 1) {
    const s = r < 7 ? 0.22 + e() * 0.76 : e() * 2 - 1, a = e() * Math.PI * 2, o = Math.sqrt(Math.max(0, 1 - s * s)), c = new P(Math.cos(a) * o, Math.sin(a) * o, s).normalize(), l = new P().crossVectors(c, Math.abs(c.y) > 0.9 ? new P(1, 0, 0) : new P(0, 1, 0)).normalize(), h = new P().crossVectors(c, l).normalize(), f = r < 2 ? 0.46 : r < 7 ? 0.25 : 0.11, d = r < 2 ? 0.12 : r < 7 ? 0.18 : 0.16, p = f + e() * d, g = 0.045 + p * (0.17 + e() * 0.14);
    t.push({
      center: c,
      tangentA: l,
      tangentB: h,
      angularRadius: p,
      rimWidth: 0.11 + e() * 0.1,
      rimHeight: 0.045 + p * (0.17 + e() * 0.12),
      basinDepth: g,
      peakHeight: e() > 0.68 ? g * (0.28 + e() * 0.5) : 0,
      phase: e() * Math.PI * 2,
      harmonics: 3 + Math.floor(e() * 5)
    });
  }
  return t;
}
const Ga = $d();
function An(i) {
  const e = Ji(i, 1.45), t = Ji(i, 4.8), n = Ji(i, 11.5);
  let r = e * 0.14 + t * 0.057 + n * 0.022, s = Math.max(0, Math.abs(t) * 0.18 + Math.abs(n) * 0.1);
  for (const a of Ga) {
    const o = mt.clamp(i.dot(a.center), -1, 1);
    if (o < Math.cos(a.angularRadius * 1.42)) continue;
    const c = Math.acos(o), l = Math.atan2(i.dot(a.tangentB), i.dot(a.tangentA)), h = Ji(i, 8.2), f = 1 + Math.sin(l * a.harmonics + a.phase) * 0.09 + Math.sin(l * (a.harmonics + 3) - a.phase * 0.7) * 0.045 + h * 0.055, d = c / (a.angularRadius * f), p = (d - 1) / a.rimWidth, g = Math.exp(-p * p), _ = Math.sin(l * (a.harmonics - 1) - a.phase * 1.4) + Math.sin(l * (a.harmonics + 2) + a.phase) * 0.42 + h * 1.35, m = 0.04 + mt.smoothstep(_, -0.12, 0.68) * 0.96, u = g * m, A = d < 1 ? Math.pow(1 - d, 1.55) : 0, E = a.peakHeight > 0 ? Math.exp(-Math.pow(d / 0.19, 2)) * a.peakHeight : 0;
    r += u * a.rimHeight - A * a.basinDepth + E, s = Math.max(s, u * (0.76 + a.rimHeight * 2.4), A * 0.14);
  }
  return {
    displacement: mt.clamp(r, -0.29, 0.36),
    ridge: mt.clamp(s, 0, 1)
  };
}
function Qi(i) {
  return Tn + An(i).displacement;
}
const jd = [
  new P(0.45, -0.12, 2.9),
  new P(-1.85, 1.05, 2.15),
  new P(1.75, 1.35, 1.9),
  new P(-1.65, -1.45, 1.85),
  new P(1.75, -1.25, 1.6),
  new P(0.05, 2.45, 1.15),
  new P(-0.15, -2.5, 1.05),
  new P(2.6, 0.15, 0.65)
].map((i) => i.normalize());
function Sn(i) {
  let e = i >>> 0;
  return () => {
    e += 1831565813;
    let t = e;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function Jd(i = 128) {
  const e = document.createElement("canvas");
  e.width = i, e.height = i;
  const t = e.getContext("2d"), n = t.createRadialGradient(i / 2, i / 2, 0, i / 2, i / 2, i / 2);
  n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(0.12, "rgba(255,255,255,.96)"), n.addColorStop(0.36, "rgba(255,255,255,.34)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = n, t.fillRect(0, 0, i, i);
  const r = new Pa(e);
  return r.colorSpace = bt, r.generateMipmaps = !1, r.minFilter = 1006, r.magFilter = 1006, r;
}
function Qd(i = 192) {
  const e = document.createElement("canvas");
  e.width = i, e.height = i;
  const t = e.getContext("2d"), n = i / 2, r = t.createRadialGradient(n, n, 0, n, n, i * 0.24);
  r.addColorStop(0, "rgba(255,255,255,1)"), r.addColorStop(0.12, "rgba(255,255,255,.9)"), r.addColorStop(0.3, "rgba(255,255,255,.38)"), r.addColorStop(0.58, "rgba(255,255,255,.08)"), r.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = r, t.fillRect(0, 0, i, i), t.strokeStyle = "rgba(255,255,255,.86)", t.lineWidth = i * 0.01, t.beginPath(), t.arc(n, n, i * 0.235, 0, Math.PI * 2), t.stroke(), t.strokeStyle = "rgba(255,255,255,.34)", t.lineWidth = i * 7e-3, t.beginPath(), t.arc(n, n, i * 0.36, 0, Math.PI * 2), t.stroke();
  const s = new Pa(e);
  return s.colorSpace = bt, s.generateMipmaps = !1, s.minFilter = 1006, s.magFilter = 1006, s;
}
function ef(i) {
  return i.replace(/^\d+[.]?\s*/, "") || "Заметки";
}
class tf {
  constructor(e) {
    xe(this, "canvas");
    xe(this, "scene", new Bo());
    xe(this, "camera", new Bt(42, 1, 0.1, 100));
    xe(this, "renderer");
    xe(this, "composer");
    xe(this, "bloomPass");
    xe(this, "labelRenderer", new Nd());
    xe(this, "root", new Qt());
    xe(this, "networkRoot", new Qt());
    xe(this, "raycaster", new Jo());
    xe(this, "pointer", new we());
    xe(this, "clock", new Ua());
    xe(this, "glowTexture", Jd());
    xe(this, "nodeMarkerTexture", Qd());
    xe(this, "animatedMaterials", []);
    xe(this, "styledPointClouds", []);
    xe(this, "styledLineMaterials", []);
    xe(this, "terrainSurface");
    xe(this, "calmSurfaceMaterial");
    xe(this, "radiantSurfaceMaterial");
    xe(this, "atmosphere");
    xe(this, "calmAtmosphereMaterial");
    xe(this, "radiantAtmosphereMaterial");
    xe(this, "orbitingMotes");
    xe(this, "orbitingMoteCalmColors");
    xe(this, "orbitingMoteRadiantColors");
    xe(this, "sphereStyle", "radiant");
    xe(this, "labelMode", "important");
    xe(this, "nodeVisuals", []);
    xe(this, "hitMeshes", []);
    xe(this, "degrees", /* @__PURE__ */ new Map());
    xe(this, "tempWorld", new P());
    xe(this, "tempNormal", new P());
    xe(this, "tempCameraDirection", new P());
    xe(this, "selectedId", null);
    xe(this, "hoveredId", null);
    xe(this, "primaryNode", null);
    xe(this, "search", "");
    xe(this, "dragging", !1);
    xe(this, "moved", !1);
    xe(this, "lastX", 0);
    xe(this, "lastY", 0);
    xe(this, "velocityX", 0);
    xe(this, "velocityY", 0);
    xe(this, "autoRotate");
    xe(this, "focusStart", new wn());
    xe(this, "focusEnd", new wn());
    xe(this, "focusElapsed", 0);
    xe(this, "focusDuration", 0);
    xe(this, "focusing", !1);
    xe(this, "animationFrame", 0);
    xe(this, "resizeObserver");
    xe(this, "onSelect", () => {
    });
    xe(this, "onHover", () => {
    });
    xe(this, "reducedMotion");
    xe(this, "animate", () => {
      const e = Math.min(this.clock.getDelta(), 0.05), t = this.clock.elapsedTime, n = this.reducedMotion ? 0 : t;
      if (this.animatedMaterials.forEach((r) => {
        const s = r.uniforms.uTime;
        s && (s.value = n);
      }), !this.reducedMotion && this.orbitingMotes) {
        const r = this.sphereStyle === "radiant" ? 1 : 0.58;
        this.orbitingMotes.rotation.y += e * 0.011 * r, this.orbitingMotes.rotation.x = Math.sin(t * 0.19) * 9e-3 * r, this.orbitingMotes.rotation.z = Math.cos(t * 0.14) * 6e-3 * r;
      }
      if (!this.dragging)
        if (this.focusing) {
          this.focusElapsed = Math.min(this.focusElapsed + e, this.focusDuration);
          const r = this.focusElapsed / this.focusDuration, s = r * r * r * (r * (r * 6 - 15) + 10);
          this.root.quaternion.slerpQuaternions(this.focusStart, this.focusEnd, s), r >= 1 && (this.focusing = !1);
        } else
          this.root.rotation.y += this.autoRotate ? e * 0.035 : this.velocityY, this.root.rotation.x += this.velocityX, this.velocityX *= 0.92, this.velocityY *= 0.92;
      this.updateNodeVisuals(t, e), this.composer.render(), this.labelMode !== "none" && this.labelRenderer.render(this.scene, this.camera), this.animationFrame = window.requestAnimationFrame(this.animate);
    });
    this.canvas = e, this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches, this.autoRotate = !this.reducedMotion, this.renderer = new Fd({ canvas: e, antialias: !0, alpha: !1, powerPreference: "high-performance" }), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8)), this.renderer.outputColorSpace = bt, this.renderer.toneMapping = 4, this.renderer.toneMappingExposure = 0.96, this.renderer.setClearColor(131595, 1), this.camera.position.set(0, 0, 12), this.composer = new Hd(this.renderer), this.composer.addPass(new Wd(this.scene, this.camera)), this.bloomPass = new ei(new we(1, 1), 0.82, 0.5, 0.62), this.composer.addPass(this.bloomPass), this.composer.addPass(new kd()), this.labelRenderer.domElement.className = "graph-label-layer", (e.parentElement ?? document.body).appendChild(this.labelRenderer.domElement), this.scene.add(this.createStarfield()), this.scene.add(new Yo(9091839, 393748, 0.34));
    const t = new $o(14412031, 2.9);
    t.position.set(-4.5, 6.5, 8), this.scene.add(t), this.scene.add(this.root), this.terrainSurface = this.createTerrainSurface(), this.atmosphere = this.createAtmosphere(), this.root.add(this.terrainSurface), this.root.add(this.atmosphere), this.root.add(this.createShellDust()), this.root.add(this.createTerrainAccents()), this.root.add(this.createSparkleShell()), this.root.add(this.createInnerDust()), this.orbitingMotes = this.createOrbitingMotes(), this.root.add(this.orbitingMotes), this.root.add(this.networkRoot), this.root.rotation.set(-0.035, -0.12, 0.015), this.setSphereStyle("radiant"), this.bindEvents(), this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(e.parentElement ?? e), this.resize(), this.animate();
  }
  setHandlers(e, t) {
    this.onSelect = e, this.onHover = t;
  }
  setLabelMode(e) {
    this.labelMode = e;
    const t = e === "none";
    this.labelRenderer.domElement.classList.toggle("is-hidden", t), this.labelRenderer.domElement.setAttribute("aria-hidden", String(t));
  }
  getPrimaryNode() {
    return this.primaryNode;
  }
  setSphereStyle(e) {
    this.sphereStyle = e;
    const t = e === "radiant";
    this.terrainSurface.material = t ? this.radiantSurfaceMaterial : this.calmSurfaceMaterial, this.atmosphere.material = t ? this.radiantAtmosphereMaterial : this.calmAtmosphereMaterial, this.renderer.toneMappingExposure = t ? 0.96 : 0.97, this.bloomPass.strength = t ? 0.82 : 0.86, this.bloomPass.radius = t ? 0.5 : 0.46, this.bloomPass.threshold = t ? 0.62 : 0.5, this.styledPointClouds.forEach((n) => {
      n.points.geometry.setAttribute("color", t ? n.radiantColors : n.calmColors), n.points.material.opacity = t ? n.radiantOpacity : n.calmOpacity, n.points.material.size = t ? n.radiantSize : n.calmSize, n.points.material.needsUpdate = !0;
    }), this.orbitingMotes && (this.orbitingMotes.geometry.setAttribute("color", t ? this.orbitingMoteRadiantColors : this.orbitingMoteCalmColors), this.orbitingMotes.material.uniforms.uOpacity.value = t ? 0.88 : 0.62, this.orbitingMotes.material.uniforms.uPointSize.value = t ? 0.031 : 0.024, this.orbitingMotes.material.uniforms.uMotionScale.value = t ? 1 : 0.64), this.applyNodePalette();
  }
  applyNodePalette() {
    const e = this.sphereStyle === "radiant";
    this.nodeVisuals.forEach((t) => {
      const n = e ? t.radiantColor : t.calmColor;
      t.core.material.color.copy(n), t.inner.material.color.copy(n).lerp(xa, t.node.kind === "cluster" ? 0.76 : 0.64), t.marker.material.color.copy(n), t.glow.material.color.copy(n);
    }), this.styledLineMaterials.forEach((t) => {
      t.material.color.copy(e ? t.radiantColor : t.calmColor);
    });
  }
  setData(e) {
    this.selectedId = null, this.hoveredId = null, this.primaryNode = null, this.focusing = !1, this.degrees.clear(), e.nodes.forEach((h) => this.degrees.set(h.id, 0)), e.edges.forEach((h) => {
      this.degrees.set(h.source, (this.degrees.get(h.source) ?? 0) + 1), this.degrees.set(h.target, (this.degrees.get(h.target) ?? 0) + 1);
    }), this.clearNetwork();
    const t = /* @__PURE__ */ new Map();
    e.nodes.forEach((h) => t.set(h.group, [...t.get(h.group) ?? [], h]));
    const n = [...t.entries()].sort(([h, f], [d, p]) => {
      const g = /project|проект/i.test(h) ? 1 : 0;
      return (/project|проект/i.test(d) ? 1 : 0) - g || p.length - f.length;
    }), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = [];
    n.forEach(([h, f], d) => {
      const p = (jd[d] ?? this.fibonacciDirection(d, n.length)).clone(), g = {
        id: `@cluster/${h}`,
        title: ef(h),
        path: `${f.length} заметок в кластере`,
        group: h,
        kind: "cluster",
        noteCount: f.length
      }, _ = d === 0 ? qd : _a[(d - 1) % _a.length], m = d === 0 ? Yd : va[(d - 1) % va.length];
      s.set(h, _), a.set(h, m), o.push(g), r.set(g.id, p.clone().multiplyScalar(Qi(p) + 0.045)), d === 0 && (this.primaryNode = g);
      const u = new P().crossVectors(p, Math.abs(p.y) > 0.88 ? new P(1, 0, 0) : new P(0, 1, 0)).normalize(), A = new P().crossVectors(p, u).normalize();
      f.forEach((E, M) => {
        const C = M * Math.PI * (3 - Math.sqrt(5)), R = Math.min(1.08, 0.22 + Math.sqrt(M + 0.2) * 0.18), L = p.clone().addScaledVector(u, Math.cos(C) * R).addScaledVector(A, Math.sin(C) * R).normalize(), F = L.multiplyScalar(Qi(L) + 0.035 + (M % 3 - 1) * 0.022);
        r.set(E.id, F);
      });
    }), this.networkRoot.add(this.createAmbientNetwork()), this.networkRoot.add(this.createGraphLines(e, n, o, r, s));
    const c = [...e.nodes].sort((h, f) => (this.degrees.get(f.id) ?? 0) - (this.degrees.get(h.id) ?? 0)).slice(0, Math.min(15, Math.max(8, Math.round(Math.sqrt(e.nodes.length) * 2.8)))), l = new Set(c.map((h) => h.id));
    o.forEach((h, f) => {
      const d = this.createNodeVisual(
        h,
        r.get(h.id),
        s.get(h.group),
        a.get(h.group),
        !0,
        !0
      );
      this.nodeVisuals.push(d), this.networkRoot.add(d.group), f === 0 && this.networkRoot.add(this.createHubRings(
        r.get(h.id),
        s.get(h.group),
        a.get(h.group)
      ));
    }), e.nodes.forEach((h) => {
      const f = this.createNodeVisual(
        h,
        r.get(h.id),
        s.get(h.group),
        a.get(h.group),
        !1,
        l.has(h.id)
      );
      this.nodeVisuals.push(f), this.networkRoot.add(f.group);
    }), this.applyNodePalette(), this.applyVisualState();
  }
  setSearch(e) {
    this.search = e.trim().toLocaleLowerCase(), this.applyVisualState();
  }
  focusNode(e) {
    const t = this.nodeVisuals.find((a) => a.node.id === e);
    if (!t) return;
    this.selectedId = e, this.autoRotate = !1, this.velocityX = 0, this.velocityY = 0;
    const n = t.group.position.clone().normalize(), r = new P(0.08, -0.02, 1).normalize();
    this.focusStart.copy(this.root.quaternion), this.focusEnd.setFromUnitVectors(n, r);
    const s = this.focusStart.angleTo(this.focusEnd);
    this.focusElapsed = 0, this.focusDuration = mt.clamp(0.52 + s * 0.3, 0.68, 1.38), this.focusing = !this.reducedMotion && s > 2e-3, this.focusing || this.root.quaternion.copy(this.focusEnd), this.applyVisualState();
  }
  createStarfield() {
    const e = Sn(18), t = window.innerWidth < 720 ? 700 : 1500, n = new Float32Array(t * 3), r = new Float32Array(t * 3);
    for (let a = 0; a < t; a += 1) {
      const o = 14 + e() * 18, c = e() * Math.PI * 2, l = Math.acos(2 * e() - 1);
      n[a * 3] = o * Math.sin(l) * Math.cos(c), n[a * 3 + 1] = o * Math.cos(l), n[a * 3 + 2] = o * Math.sin(l) * Math.sin(c) - 5;
      const h = 0.35 + e() * 0.65;
      r[a * 3] = 0.55 * h, r[a * 3 + 1] = 0.67 * h, r[a * 3 + 2] = h;
    }
    const s = new st();
    return s.setAttribute("position", new Ve(n, 3)), s.setAttribute("color", new Ve(r, 3)), new cn(s, new un({
      size: 0.06,
      map: this.glowTexture,
      transparent: !0,
      opacity: 0.86,
      vertexColors: !0,
      depthWrite: !1,
      blending: 2,
      alphaTest: 0.01
    }));
  }
  createTerrainGeometry(e, t) {
    const n = new Yn(Tn, e, t), r = n.getAttribute("position"), s = new P();
    for (let a = 0; a < r.count; a += 1) {
      s.fromBufferAttribute(r, a).normalize();
      const o = Qi(s);
      r.setXYZ(a, s.x * o, s.y * o, s.z * o);
    }
    return r.needsUpdate = !0, n.computeVertexNormals(), n;
  }
  createTerrainSurface() {
    const e = this.createTerrainGeometry(128, 96), t = e.getAttribute("position"), n = new Float32Array(t.count), r = new Float32Array(t.count), s = new Float32Array(t.count * 3), a = new Float32Array(t.count * 3), o = new P();
    for (let l = 0; l < t.count; l += 1) {
      o.fromBufferAttribute(t, l).normalize();
      const h = An(o);
      n[l] = mt.clamp((h.displacement + 0.29) / 0.65, 0, 1), r[l] = h.ridge, s.set([o.x, o.y, o.z], l * 3), a[l * 3] = 0.055 + n[l] * 0.07 + h.ridge * 0.12, a[l * 3 + 1] = 0.08 + n[l] * 0.1 + h.ridge * 0.14, a[l * 3 + 2] = 0.16 + n[l] * 0.18 + h.ridge * 0.22;
    }
    e.setAttribute("color", new Ve(a, 3)), e.setAttribute("aElevation", new Ve(n, 1)), e.setAttribute("aRidge", new Ve(r, 1)), e.setAttribute("aDirection", new Ve(s, 3)), this.calmSurfaceMaterial = new Wo({
      vertexColors: !0,
      transparent: !0,
      opacity: 0.66,
      roughness: 0.94,
      metalness: 0.06,
      emissive: 198419,
      emissiveIntensity: 0.28,
      depthWrite: !1,
      side: 0
    }), this.radiantSurfaceMaterial = new gt({
      transparent: !0,
      depthWrite: !1,
      side: 0,
      uniforms: {
        uTime: { value: 0 },
        uDeepIndigo: { value: new Se(525869) },
        uElectricBlue: { value: new Se(2649599) },
        uCyan: { value: new Se(5627391) },
        uViolet: { value: new Se(9130239) },
        uMagenta: { value: new Se(16732882) },
        uHot: { value: new Se(15923199) }
      },
      vertexShader: `
        attribute float aElevation;
        attribute float aRidge;
        attribute vec3 aDirection;
        varying float vElevation;
        varying float vRidge;
        varying vec3 vDirection;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        void main() {
          vElevation = aElevation;
          vRidge = aRidge;
          vDirection = aDirection;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uDeepIndigo;
        uniform vec3 uElectricBlue;
        uniform vec3 uCyan;
        uniform vec3 uViolet;
        uniform vec3 uMagenta;
        uniform vec3 uHot;
        varying float vElevation;
        varying float vRidge;
        varying vec3 vDirection;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        float hash31(vec3 p) {
          p = fract(p * 0.1031);
          p += dot(p, p.yzx + 33.33);
          return fract((p.x + p.y) * p.z);
        }

        float noise3(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash31(i), hash31(i + vec3(1, 0, 0)), f.x),
                mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), f.x), f.y),
            mix(mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), f.x),
                mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.54;
          for (int i = 0; i < 5; i++) {
            value += noise3(p) * amplitude;
            p = p * 2.03 + vec3(1.7, -2.3, 0.9);
            amplitude *= 0.48;
          }
          return value;
        }

        void main() {
          vec3 direction = normalize(vDirection);
          float flowTime = uTime * 0.035;
          float broad = fbm(direction * 1.75 + vec3(flowTime, -flowTime * 0.7, flowTime * 0.45));
          float fold = fbm(direction * 3.6 + vec3(broad * 2.25, -broad * 1.4, broad * 1.8));
          float fine = fbm(direction * 7.8 + vec3(fold * 1.65));

          float contourPhase = broad * 3.3 + fold * 1.15 + direction.y * 0.26 + direction.x * 0.12;
          float contour = 1.0 - abs(fract(contourPhase) - 0.5) * 2.0;
          float ribbons = smoothstep(0.48, 0.9, contour) * smoothstep(0.32, 0.78, fold);
          float vein = smoothstep(0.68, 0.94, fine + contour * 0.18);
          float reliefGlow = smoothstep(0.18, 0.72, vRidge + ribbons * 0.44);

          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float facing = max(dot(normalize(vWorldNormal), viewDirection), 0.0);
          float fresnel = pow(1.0 - facing, 2.45);
          float light = 0.35 + max(dot(normalize(vWorldNormal), normalize(vec3(-0.36, 0.68, 0.94))), 0.0) * 0.65;

          float chroma = clamp(fbm(direction * 2.55 + vec3(-1.2, 2.4, 0.6)) * 1.25 - 0.12, 0.0, 1.0);
          vec3 coolFlow = mix(uElectricBlue, uCyan, smoothstep(0.2, 0.78, chroma));
          vec3 warmFlow = mix(uViolet, uMagenta, smoothstep(0.34, 0.76, fold));
          vec3 ribbonColor = mix(coolFlow, warmFlow, smoothstep(0.3, 0.7, broad + direction.x * 0.13));

          vec3 color = uDeepIndigo * (0.62 + light * 0.76);
          color += mix(uElectricBlue, uViolet, chroma) * (0.09 + vElevation * 0.18 + broad * 0.12);
          color += ribbonColor * ribbons * (0.4 + reliefGlow * 0.46);
          color += mix(uCyan, uMagenta, broad) * vein * (0.12 + vRidge * 0.32);
          color += mix(uCyan, uMagenta, fold) * fresnel * (0.28 + ribbons * 0.32);

          float hotCore = pow(clamp(ribbons * 0.58 + vein * 0.18 + vRidge * 0.34, 0.0, 1.0), 7.0);
          color = mix(color, uHot * 1.18 + ribbonColor * 0.28, hotCore * 0.24);
          float alpha = 0.71 + vElevation * 0.07 + ribbons * 0.07 + fresnel * 0.08;
          color = clamp(color, vec3(0.0), vec3(1.35));
          gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
        }
      `
    }), this.animatedMaterials.push(this.radiantSurfaceMaterial);
    const c = new wt(e, this.radiantSurfaceMaterial);
    return c.renderOrder = -2, c;
  }
  createAtmosphere() {
    const e = this.createTerrainGeometry(96, 72), t = `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vDirection;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vDirection = normalize(position);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `;
    this.calmAtmosphereMaterial = new gt({
      transparent: !0,
      depthWrite: !1,
      blending: 2,
      side: 0,
      uniforms: { glowColor: { value: new Se(4286120) } },
      vertexShader: t,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float rim = pow(1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0), 3.2);
          float haze = pow(1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0), 1.4) * 0.055;
          gl_FragColor = vec4(glowColor, clamp(rim * 0.22 + haze * 0.45, 0.0, 1.0));
        }
      `
    }), this.radiantAtmosphereMaterial = new gt({
      transparent: !0,
      depthWrite: !1,
      blending: 2,
      side: 0,
      uniforms: { uTime: { value: 0 } },
      vertexShader: t,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vDirection;
        float pattern(vec3 p) {
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float rim = pow(1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0), 2.55);
          float hueNoise = pattern(floor(vDirection * 7.0 + uTime * 0.025));
          vec3 cyan = vec3(0.25, 0.78, 1.0);
          vec3 violet = vec3(0.55, 0.27, 1.0);
          vec3 magenta = vec3(1.0, 0.38, 0.82);
          vec3 rimColor = mix(cyan, violet, smoothstep(0.15, 0.78, vDirection.y * 0.5 + 0.5));
          rimColor = mix(rimColor, magenta, smoothstep(0.7, 0.96, hueNoise) * 0.58);
          float energy = pow(rim, 1.65) * 0.52 + pow(rim, 4.8) * 0.72;
          gl_FragColor = vec4(clamp(rimColor * energy, vec3(0.0), vec3(1.35)), clamp(rim * 0.17, 0.0, 1.0));
        }
      `
    }), this.animatedMaterials.push(this.radiantAtmosphereMaterial);
    const n = new wt(e, this.radiantAtmosphereMaterial);
    return n.scale.setScalar(1.012), n.renderOrder = -1, n;
  }
  registerStyledPointCloud(e, t, n, r, s, a, o) {
    return this.styledPointClouds.push({
      points: e,
      calmColors: t,
      radiantColors: n,
      calmOpacity: r,
      radiantOpacity: s,
      calmSize: a,
      radiantSize: o
    }), e;
  }
  createShellDust() {
    const e = Sn(91), t = window.innerWidth < 720 ? 6500 : 16800, n = new Float32Array(t * 3), r = new Float32Array(t * 3), s = new Float32Array(t * 3);
    for (let h = 0; h < t; h += 1) {
      const f = this.randomDirection(e), d = An(f), p = Tn + d.displacement + (e() - 0.5) * (0.055 + d.ridge * 0.08);
      n[h * 3] = f.x * p, n[h * 3 + 1] = f.y * p, n[h * 3 + 2] = f.z * p;
      const g = e(), _ = mt.clamp((d.displacement + 0.29) / 0.65, 0, 1), m = g > 0.78, u = g < 0.3, A = m ? [0.78, 0.23, 0.9] : u ? [0.2, 0.7, 1] : [0.3, 0.34, 1], E = 0.42 + _ * 0.24 + d.ridge * 0.88;
      r[h * 3] = A[0] * E, r[h * 3 + 1] = A[1] * E, r[h * 3 + 2] = A[2] * E, s[h * 3] = 0.11 + g * 0.08 + _ * 0.12 + d.ridge * 0.48, s[h * 3 + 1] = 0.16 + g * 0.1 + _ * 0.17 + d.ridge * 0.43, s[h * 3 + 2] = 0.34 + g * 0.13 + _ * 0.23 + d.ridge * 0.4;
    }
    const a = new st();
    a.setAttribute("position", new Ve(n, 3));
    const o = new Ve(r, 3), c = new Ve(s, 3);
    a.setAttribute("color", o);
    const l = new cn(a, new un({
      size: 0.02,
      map: this.glowTexture,
      transparent: !0,
      opacity: 0.82,
      vertexColors: !0,
      depthWrite: !1,
      blending: 2,
      alphaTest: 0.01
    }));
    return this.registerStyledPointCloud(l, c, o, 0.72, 0.82, 0.018, 0.02);
  }
  createTerrainAccents() {
    const e = Sn(1312), t = [], n = [], r = [], s = window.innerWidth < 720 ? 0.38 : 1, a = (d) => {
      const p = An(d), g = Math.pow(e(), 5.2) * (0.035 + p.ridge * 0.19) + (e() - 0.5) * 0.025, _ = Tn + p.displacement + g;
      t.push(d.x * _, d.y * _, d.z * _);
      const m = e(), u = e(), A = m > 0.955, E = u < 0.22 + p.ridge * 0.34, M = mt.clamp((p.displacement + 0.29) / 0.65, 0, 1), C = e(), R = 0.28 + M * 0.15 + p.ridge * 0.6 + C * 0.2, L = A ? [0.96, 1, 1.08] : E ? [0.96, 0.3, 0.88] : [0.28, 0.72, 1];
      n.push(L[0] * R, L[1] * R, L[2] * R);
      const F = m > 0.975, y = u < 0.13 + p.ridge * 0.28, S = 0.2 + M * 0.14 + p.ridge * 0.58 + C * 0.18, b = F ? [0.9, 0.92, 1] : y ? [0.78, 0.43, 0.75] : [0.38, 0.57, 0.94];
      r.push(b[0] * S, b[1] * S, b[2] * S);
    };
    for (const d of Ga) {
      const p = Math.round((620 + d.angularRadius * 2550) * s);
      for (let g = 0; g < p; g += 1) {
        const _ = e() * Math.PI * 2, m = Math.pow(e(), 0.62) * 1.28, u = d.angularRadius * m, A = d.tangentA.clone().multiplyScalar(Math.cos(_)).addScaledVector(d.tangentB, Math.sin(_)), E = d.center.clone().multiplyScalar(Math.cos(u)).addScaledVector(A, Math.sin(u)).normalize();
        a(E);
      }
    }
    const o = Math.round(5200 * s);
    for (let d = 0; d < o; d += 1) {
      const p = this.randomDirection(e), g = An(p);
      e() < 0.38 + g.ridge * 0.58 && a(p);
    }
    const c = new st();
    c.setAttribute("position", new at(t, 3));
    const l = new at(n, 3), h = new at(r, 3);
    c.setAttribute("color", l);
    const f = new cn(c, new un({
      size: 0.034,
      map: this.glowTexture,
      transparent: !0,
      opacity: 0.9,
      vertexColors: !0,
      depthWrite: !1,
      blending: 2,
      alphaTest: 0.012,
      toneMapped: !1
    }));
    return this.registerStyledPointCloud(f, h, l, 0.9, 0.9, 0.034, 0.034);
  }
  createInnerDust() {
    const e = Sn(309), t = window.innerWidth < 720 ? 500 : 1100, n = new Float32Array(t * 3), r = new Float32Array(t * 3), s = new Float32Array(t * 3);
    for (let h = 0; h < t; h += 1) {
      const f = this.randomDirection(e), d = Tn * Math.cbrt(e()) * 0.96;
      n[h * 3] = f.x * d, n[h * 3 + 1] = f.y * d, n[h * 3 + 2] = f.z * d;
      const p = e();
      r[h * 3] = 0.24 + p * 0.46, r[h * 3 + 1] = 0.31 + (1 - p) * 0.28, r[h * 3 + 2] = 0.78 + p * 0.32, s[h * 3] = 0.27 + p * 0.27, s[h * 3 + 1] = 0.3 + p * 0.19, s[h * 3 + 2] = 0.64 + p * 0.24;
    }
    const a = new st();
    a.setAttribute("position", new Ve(n, 3));
    const o = new Ve(r, 3), c = new Ve(s, 3);
    a.setAttribute("color", o);
    const l = new cn(a, new un({
      size: 0.019,
      map: this.glowTexture,
      transparent: !0,
      opacity: 0.54,
      vertexColors: !0,
      depthWrite: !1,
      blending: 2,
      alphaTest: 0.01
    }));
    return this.registerStyledPointCloud(l, c, o, 0.41, 0.54, 0.019, 0.019);
  }
  createSparkleShell() {
    const e = Sn(777), t = window.innerWidth < 720 ? 900 : 2800, n = new Float32Array(t * 3), r = new Float32Array(t * 3), s = new Float32Array(t * 3);
    for (let h = 0; h < t; h += 1) {
      const f = this.randomDirection(e), d = An(f), p = Tn + d.displacement + (e() - 0.5) * (0.13 + d.ridge * 0.12);
      n[h * 3] = f.x * p, n[h * 3 + 1] = f.y * p, n[h * 3 + 2] = f.z * p;
      const g = e() > 0.74, _ = e() > 0.95, m = 0.58 + d.ridge * 0.48 + e() * 0.3, u = _ ? [0.96, 1, 1.08] : g ? [0.96, 0.34, 0.86] : [0.32, 0.76, 1];
      r[h * 3] = u[0] * m, r[h * 3 + 1] = u[1] * m, r[h * 3 + 2] = u[2] * m;
      const A = 0.48 + d.ridge * 0.34 + Math.max(0, m - 0.58 - d.ridge * 0.48) * 0.6;
      s[h * 3] = (g ? 0.76 : 0.52) * A, s[h * 3 + 1] = (g ? 0.5 : 0.66) * A, s[h * 3 + 2] = (g ? 0.74 : 0.92) * A;
    }
    const a = new st();
    a.setAttribute("position", new Ve(n, 3));
    const o = new Ve(r, 3), c = new Ve(s, 3);
    a.setAttribute("color", o);
    const l = new cn(a, new un({
      size: 0.032,
      map: this.glowTexture,
      transparent: !0,
      opacity: 0.9,
      vertexColors: !0,
      depthWrite: !1,
      blending: 2,
      alphaTest: 0.015,
      toneMapped: !1
    }));
    return this.registerStyledPointCloud(l, c, o, 0.9, 0.9, 0.032, 0.032);
  }
  createOrbitingMotes() {
    const e = Sn(2468), t = window.innerWidth < 720 ? 760 : 2200, n = new Float32Array(t * 3), r = new Float32Array(t * 3), s = new Float32Array(t * 3), a = new Float32Array(t), o = new Float32Array(t), c = new Float32Array(t), l = new Float32Array(t), h = new Float32Array(t);
    for (let g = 0; g < t; g += 1) {
      const _ = this.randomDirection(e), m = An(_), u = -0.012 + Math.pow(e(), 1.7) * (0.16 + m.ridge * 0.14), A = Tn + m.displacement + u;
      n[g * 3] = _.x * A, n[g * 3 + 1] = _.y * A, n[g * 3 + 2] = _.z * A;
      const E = e(), M = 0.58 + e() * 0.5 + m.ridge * 0.32, C = E < 0.38 ? [0.3, 0.84, 1.08] : E < 0.73 ? [0.64, 0.38, 1.04] : E < 0.94 ? [1.02, 0.34, 0.86] : [1.08, 1.12, 1.2], R = E < 0.5 ? [0.48, 0.64, 0.94] : E < 0.88 ? [0.62, 0.55, 0.9] : [0.82, 0.75, 0.9];
      r[g * 3] = C[0] * M, r[g * 3 + 1] = C[1] * M, r[g * 3 + 2] = C[2] * M, s[g * 3] = R[0] * M * 0.72, s[g * 3 + 1] = R[1] * M * 0.72, s[g * 3 + 2] = R[2] * M * 0.72, a[g] = e() * Math.PI * 2, o[g] = 0.34 + e() * 0.72, c[g] = 0.018 + Math.pow(e(), 1.6) * 0.075, l[g] = 0.012 + e() * 0.052, h[g] = 0.62 + Math.pow(e(), 2.2) * 1.42;
    }
    const f = new st();
    f.setAttribute("position", new Ve(n, 3)), this.orbitingMoteRadiantColors = new Ve(r, 3), this.orbitingMoteCalmColors = new Ve(s, 3), f.setAttribute("color", this.orbitingMoteRadiantColors), f.setAttribute("aPhase", new Ve(a, 1)), f.setAttribute("aSpeed", new Ve(o, 1)), f.setAttribute("aDrift", new Ve(c, 1)), f.setAttribute("aLift", new Ve(l, 1)), f.setAttribute("aSize", new Ve(h, 1));
    const d = new gt({
      transparent: !0,
      depthWrite: !1,
      depthTest: !0,
      blending: 2,
      vertexColors: !0,
      toneMapped: !1,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.88 },
        uPointSize: { value: 0.031 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.8) },
        uMotionScale: { value: 1 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPointSize;
        uniform float uPixelRatio;
        uniform float uMotionScale;
        attribute float aPhase;
        attribute float aSpeed;
        attribute float aDrift;
        attribute float aLift;
        attribute float aSize;
        varying vec3 vColor;
        varying float vFacing;
        varying float vTwinkle;

        void main() {
          vec3 direction = normalize(position);
          vec3 guide = abs(direction.y) > 0.86 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
          vec3 tangent = normalize(cross(direction, guide));
          vec3 bitangent = normalize(cross(direction, tangent));
          float time = uTime * aSpeed + aPhase;
          float primary = sin(time);
          float secondary = cos(time * 0.73 + aPhase * 1.71);
          float radial = sin(time * 0.57 + aPhase * 0.43);
          vec3 displaced = position
            + tangent * primary * aDrift * uMotionScale
            + bitangent * secondary * aDrift * 0.58 * uMotionScale
            + direction * radial * aLift * uMotionScale;

          vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
          vec3 worldDirection = normalize(mat3(modelMatrix) * direction);
          vec3 viewDirection = normalize(cameraPosition - worldPosition.xyz);
          vFacing = smoothstep(-0.2, 0.24, dot(worldDirection, viewDirection));
          vTwinkle = 0.72 + sin(time * 1.43 + aPhase * 2.2) * 0.28;
          vColor = color;

          vec4 viewPosition = viewMatrix * worldPosition;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = max(1.0, uPointSize * aSize * uPixelRatio * (300.0 / max(1.0, -viewPosition.z)));
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vFacing;
        varying float vTwinkle;

        void main() {
          vec2 centered = gl_PointCoord - vec2(0.5);
          float distanceToCenter = length(centered) * 2.0;
          float halo = 1.0 - smoothstep(0.12, 1.0, distanceToCenter);
          float core = 1.0 - smoothstep(0.0, 0.34, distanceToCenter);
          float alpha = (halo * 0.7 + core * 0.3) * uOpacity * vFacing * vTwinkle;
          if (alpha < 0.018) discard;
          vec3 color = vColor * (0.62 + core * 0.74);
          gl_FragColor = vec4(clamp(color, vec3(0.0), vec3(1.4)), alpha);
        }
      `
    });
    this.animatedMaterials.push(d);
    const p = new cn(f, d);
    return p.renderOrder = 1, p;
  }
  createAmbientNetwork() {
    const e = new Qt(), t = Sn(2026), n = window.innerWidth < 720 ? 120 : 320, r = [], s = new Float32Array(n * 3), a = new Float32Array(n * 3), o = [], c = [];
    for (let g = 0; g < n; g += 1) {
      const _ = this.fibonacciDirection(g, n), m = Qi(_) - 0.035 - t() * 0.055, u = _.multiplyScalar(m);
      r.push(u), s.set([u.x, u.y, u.z], g * 3);
      const E = t() > 0.72 ? [0.76, 0.46, 0.72] : [0.42, 0.58, 0.88];
      a.set(E, g * 3), g % 5 === 0 && (o.push(u.x, u.y, u.z), c.push(...E));
    }
    const l = new st();
    l.setAttribute("position", new Ve(s, 3)), l.setAttribute("color", new Ve(a, 3)), e.add(new cn(l, new un({
      size: 0.065,
      map: this.glowTexture,
      transparent: !0,
      opacity: 0.88,
      vertexColors: !0,
      depthWrite: !1,
      blending: 2,
      toneMapped: !1,
      alphaTest: 0.01
    })));
    const h = new st();
    h.setAttribute("position", new at(o, 3)), h.setAttribute("color", new at(c, 3)), e.add(new cn(h, new un({
      size: 0.115,
      map: this.nodeMarkerTexture,
      transparent: !0,
      opacity: 0.9,
      vertexColors: !0,
      depthWrite: !1,
      blending: 2,
      alphaTest: 0.015,
      toneMapped: !1
    })));
    const f = [], d = [];
    r.forEach((g, _) => {
      [r[(_ + 13) % n], r[(_ + 34) % n]].forEach((u, A) => {
        if (g.distanceTo(u) > (A === 0 ? 2.15 : 1.5)) return;
        f.push(g.x, g.y, g.z, u.x, u.y, u.z);
        const E = A === 0 ? [0.3, 0.43, 0.72] : [0.53, 0.42, 0.7];
        d.push(...E, ...E);
      });
    });
    const p = new st();
    return p.setAttribute("position", new at(f, 3)), p.setAttribute("color", new at(d, 3)), e.add(new Nr(p, new fi({
      vertexColors: !0,
      transparent: !0,
      opacity: 0.17,
      depthWrite: !1,
      blending: 2
    }))), e;
  }
  createGraphLines(e, t, n, r, s) {
    const a = [], o = [], c = (d, p, g, _) => {
      a.push(d.x, d.y, d.z, p.x, p.y, p.z), o.push(g.r, g.g, g.b, _.r, _.g, _.b);
    };
    t.forEach(([d, p], g) => {
      const _ = n[g], m = r.get(_.id), u = new Se(s.get(d));
      p.forEach((A) => c(m, r.get(A.id), u, u));
    });
    const l = new Map(e.nodes.map((d) => [d.id, d]));
    e.edges.forEach((d) => {
      const p = r.get(d.source), g = r.get(d.target), _ = l.get(d.source), m = l.get(d.target);
      !p || !g || !_ || !m || c(p, g, new Se(s.get(_.group)), new Se(s.get(m.group)));
    });
    const h = new st();
    h.setAttribute("position", new at(a, 3)), h.setAttribute("color", new at(o, 3));
    const f = new Nr(h, new fi({
      vertexColors: !0,
      transparent: !0,
      opacity: 0.25,
      depthWrite: !1,
      blending: 2
    }));
    return f.userData.kind = "graph-lines", f;
  }
  createNodeVisual(e, t, n, r, s, a) {
    const o = new Qt();
    o.position.copy(t);
    const c = e.kind === "cluster" ? e.noteCount ?? 1 : this.degrees.get(e.id) ?? 0, l = s ? 0.11 + Math.min(c, 28) * 21e-4 : 0.03 + Math.sqrt(Math.min(c, 16)) * 0.018, h = new Se(n), f = new Se(r), d = (this.sphereStyle === "radiant" ? h : f).clone(), p = d.clone().lerp(xa, s ? 0.76 : 0.64), g = new wt(
      new Yn(l, 24, 18),
      new jn({ color: d, transparent: !0, opacity: 0.9 })
    ), _ = new wt(
      new Yn(l * (s ? 0.21 : 0.18), 18, 12),
      new jn({ color: p, transparent: !0, opacity: s ? 0.96 : 0.86 })
    ), m = new Cs(new Wr({
      map: this.nodeMarkerTexture,
      color: d,
      transparent: !0,
      opacity: s ? 0.92 : 0.78,
      depthWrite: !1,
      blending: 2,
      toneMapped: !1,
      alphaTest: 0.012
    })), u = new Cs(new Wr({
      map: this.glowTexture,
      color: d,
      transparent: !0,
      opacity: s ? 0.58 : 0.36,
      depthWrite: !1,
      blending: 2,
      toneMapped: !1,
      alphaTest: 0.012
    }));
    m.scale.setScalar(l * (s ? 5.6 : 5));
    const A = l * (s ? 6.4 : 5.8);
    u.scale.setScalar(A), o.add(u, m, g, _);
    const E = new wt(
      new Yn(Math.max(l * 2.1, 0.15), 10, 8),
      new jn({ transparent: !0, opacity: 0, depthWrite: !1 })
    );
    E.userData.node = e, o.add(E), this.hitMeshes.push(E);
    const M = document.createElement("span");
    M.className = s ? "graph-label graph-label--cluster" : "graph-label", M.textContent = e.title;
    const C = new ua(M);
    return C.position.set(l * 1.5, s ? -0.22 : -0.13, 0), o.add(C), {
      node: e,
      group: o,
      hit: E,
      core: g,
      inner: _,
      marker: m,
      glow: u,
      label: C,
      importantLabel: a,
      baseScale: s ? 1.06 : 1,
      calmColor: f,
      radiantColor: h
    };
  }
  createHubRings(e, t, n) {
    const r = new Qt();
    r.position.copy(e), r.quaternion.setFromUnitVectors(new P(0, 0, 1), e.clone().normalize()), [0.22, 0.34, 0.48, 0.63].forEach((c, l) => {
      const h = Array.from({ length: 72 }, (p, g) => {
        const _ = g / 72 * Math.PI * 2;
        return new P(Math.cos(_) * c, Math.sin(_) * c, 0);
      }), f = new fi({
        color: this.sphereStyle === "radiant" ? t : n,
        transparent: !0,
        opacity: 0.48 - l * 0.085,
        depthWrite: !1,
        blending: 2
      });
      this.styledLineMaterials.push({
        material: f,
        calmColor: new Se(n),
        radiantColor: new Se(t)
      });
      const d = new Ho(
        new st().setFromPoints(h),
        f
      );
      r.add(d);
    });
    const s = [];
    for (let c = 0; c < 20; c += 1) {
      const l = c / 20 * Math.PI * 2;
      s.push(0, 0, 0, Math.cos(l) * 0.64, Math.sin(l) * 0.64, 0);
    }
    const a = new fi({
      color: this.sphereStyle === "radiant" ? t : n,
      transparent: !0,
      opacity: 0.18,
      depthWrite: !1,
      blending: 2
    });
    this.styledLineMaterials.push({
      material: a,
      calmColor: new Se(n),
      radiantColor: new Se(t)
    });
    const o = new Nr(
      new st().setAttribute("position", new at(s, 3)),
      a
    );
    return r.add(o), r;
  }
  applyVisualState() {
    for (const e of this.nodeVisuals) {
      const { node: t, group: n, label: r } = e, s = !this.search || t.title.toLocaleLowerCase().includes(this.search) || t.path.toLocaleLowerCase().includes(this.search) || t.group.toLocaleLowerCase().includes(this.search), a = t.id === this.selectedId, o = t.id === this.hoveredId;
      if (n.userData.visualState = { matches: s, selected: a, hovered: o }, n.userData.targetScale = e.baseScale * (a ? 1.48 : o ? 1.25 : 1), r) {
        const c = r.element;
        c.classList.toggle("is-selected", a), c.dataset.searchMatch = s ? "true" : "false";
      }
    }
  }
  updateNodeVisuals(e, t) {
    this.root.updateMatrixWorld(!0);
    for (const n of this.nodeVisuals) {
      const { node: r, group: s, core: a, inner: o, marker: c, glow: l, label: h } = n, f = s.userData.visualState, d = f?.matches ?? !0, p = f?.selected ?? !1, g = f?.hovered ?? !1;
      s.getWorldPosition(this.tempWorld), this.tempNormal.copy(s.position).normalize().transformDirection(this.root.matrixWorld), this.tempCameraDirection.copy(this.camera.position).sub(this.tempWorld).normalize();
      const _ = this.tempNormal.dot(this.tempCameraDirection), m = 0.24 + mt.smoothstep(_, -0.42, 0.38) * 0.76, u = (d ? 1 : 0.075) * m, A = r.kind === "cluster", E = this.sphereStyle === "radiant", M = E ? 1 : 0.9, C = E ? 1 : 0.84, R = E ? 1 : 0.68;
      a.material.opacity = u * (A ? 0.92 : 0.78) * M, o.material.opacity = u * (A ? 0.98 : 0.88) * M, c.material.opacity = u * (p || g ? 1 : A ? 0.88 : 0.72) * C, l.material.opacity = u * (p || g ? 0.78 : A ? 0.5 : 0.3) * R;
      const L = p && !this.reducedMotion ? 1 + Math.sin(e * 2.4) * 0.022 : 1, F = (s.userData.targetScale ?? n.baseScale) * L, y = this.reducedMotion ? 1 : 1 - Math.exp(-t * 13);
      if (s.scale.setScalar(mt.lerp(s.scale.x, F, y)), h) {
        const S = h.element.dataset.searchMatch !== "false", q = (this.labelMode === "all" || this.labelMode === "important" && (n.importantLabel || p || g || this.search.length > 0 && S)) && S ? mt.smoothstep(_, -0.12, 0.34) : 0;
        h.element.style.opacity = String(q), h.element.style.visibility = q < 0.06 ? "hidden" : "visible";
      }
    }
  }
  bindEvents() {
    this.canvas.addEventListener("pointerdown", (e) => {
      this.dragging = !0, this.moved = !1, this.focusing = !1, this.lastX = e.clientX, this.lastY = e.clientY, this.velocityX = 0, this.velocityY = 0, this.autoRotate = !1, this.canvas.setPointerCapture(e.pointerId);
    }), this.canvas.addEventListener("pointermove", (e) => {
      if (this.dragging) {
        const s = e.clientX - this.lastX, a = e.clientY - this.lastY;
        Math.abs(s) + Math.abs(a) > 2 && (this.moved = !0), this.velocityY = s * 35e-4, this.velocityX = a * 35e-4, this.root.rotation.y += this.velocityY, this.root.rotation.x += this.velocityX, this.lastX = e.clientX, this.lastY = e.clientY;
      }
      this.updatePointer(e);
      const n = this.pickNode()?.userData.node, r = n?.id ?? null;
      r !== this.hoveredId && (this.hoveredId = r, this.canvas.classList.toggle("is-hovering-node", !!r), this.applyVisualState()), this.onHover(n ?? null, e.clientX, e.clientY);
    }), this.canvas.addEventListener("pointerup", (e) => {
      if (this.dragging = !1, this.canvas.releasePointerCapture(e.pointerId), this.moved) return;
      this.updatePointer(e);
      const n = this.pickNode()?.userData.node;
      n ? this.focusNode(n.id) : (this.selectedId = null, this.applyVisualState()), this.onSelect(n ?? null);
    }), this.canvas.addEventListener("pointerleave", () => {
      this.dragging = !1, this.hoveredId = null, this.canvas.classList.remove("is-hovering-node"), this.applyVisualState(), this.onHover(null, 0, 0);
    }), this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault(), this.camera.position.z = mt.clamp(this.camera.position.z + e.deltaY * 7e-3, 7.1, 26), this.autoRotate = !1, this.focusing = !1;
    }, { passive: !1 });
  }
  updatePointer(e) {
    const t = this.canvas.getBoundingClientRect();
    this.pointer.x = (e.clientX - t.left) / t.width * 2 - 1, this.pointer.y = -((e.clientY - t.top) / t.height) * 2 + 1;
  }
  pickNode() {
    return this.raycaster.setFromCamera(this.pointer, this.camera), this.raycaster.intersectObjects(this.hitMeshes, !1)[0]?.object;
  }
  resize() {
    const e = this.canvas.parentElement ?? this.canvas, t = Math.max(e.clientWidth, 1), n = Math.max(e.clientHeight, 1);
    this.camera.aspect = t / n, this.camera.position.z = t < 720 ? 21.5 : 12, this.camera.updateProjectionMatrix(), this.renderer.setSize(t, n, !1), this.composer.setSize(t, n), this.labelRenderer.setSize(t, n), this.orbitingMotes && (this.orbitingMotes.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.8));
  }
  fibonacciDirection(e, t) {
    const n = Math.max(t, 1), r = 1 - (e + 0.5) / n * 2, s = Math.sqrt(Math.max(0, 1 - r * r)), a = Math.PI * (3 - Math.sqrt(5)) * e;
    return new P(Math.cos(a) * s, r, Math.sin(a) * s);
  }
  randomDirection(e) {
    const t = e() * 2 - 1, n = e() * Math.PI * 2, r = Math.sqrt(1 - t * t);
    return new P(Math.cos(n) * r, t, Math.sin(n) * r);
  }
  clearNetwork() {
    this.nodeVisuals.length = 0, this.hitMeshes.length = 0, this.styledLineMaterials.length = 0, this.networkRoot.traverse((e) => {
      e instanceof ua && e.element.remove();
      const t = e;
      t.geometry?.dispose(), Array.isArray(t.material) ? t.material.forEach((n) => n.dispose()) : t.material?.dispose();
    }), this.networkRoot.clear();
  }
  destroy() {
    cancelAnimationFrame(this.animationFrame), this.resizeObserver.disconnect(), this.clearNetwork(), this.labelRenderer.domElement.remove(), this.glowTexture.dispose(), this.nodeMarkerTexture.dispose(), this.composer.dispose(), this.renderer.dispose();
  }
}
const nf = [
  ["home", "Карта знаний", "00. Files/Карта знаний.md", "Files"],
  ["day", "Проведение дня", "20. Areas/20.30 AI Career/20.01 Проведение дня.md", "Areas"],
  ["morning", "Утро", "20. Areas/20.10 Привычки/01 Утро.md", "Areas"],
  ["blog", "Ведение IT Блога", "10. Projects/10.30 Блог/Ведение IT Блога.md", "Projects"],
  ["tiktok", "ТикТок Идеи", "10. Projects/10.30 Блог/ТикТок Идеи.md", "Projects"],
  ["polls", "Anonym Polls Web Application", "10. Projects/10.20 IT Проекты/Anonym Polls Web Application.md", "Projects"],
  ["database", "Подключение базы данных", "10. Projects/10.20 IT Проекты/Подключение базы данных.md", "Projects"],
  ["indigo", "Indigo Education", "10. Projects/10.20 IT Проекты/Indigo Education.md", "Projects"],
  ["business", "Бизнес-план", "10. Projects/10.20 IT Проекты/Бизнес-план.md", "Projects"],
  ["media", "Indigo Media", "10. Projects/10.40 Indigo Media/Indigo Media.md", "Projects"],
  ["sales", "Продажи", "10. Projects/10.40 Indigo Media/Продажи.md", "Projects"],
  ["ads", "Реклама", "10. Projects/10.40 Indigo Media/Реклама.md", "Projects"],
  ["aes", "Aes Way - Telegram", "10. Projects/10.50 Aes Way/Aes Way - Telegram.md", "Projects"],
  ["productivity", "Повышение продуктивности", "30. Resources/Аспекты саморазвития/Повышение продуктивности.md", "Resources"],
  ["feynman", "Метод Фейнмана", "30. Resources/Аспекты саморазвития/Метод Фейнмана.md", "Resources"],
  ["learning", "Учиться меньше, но быстрее", "30. Resources/Аспекты саморазвития/Учиться меньше, но быстрее.md", "Resources"],
  ["speed", "Скорочтение", "30. Resources/Аспекты саморазвития/Скорочтение.md", "Resources"],
  ["talent", "Код таланта", "30. Resources/Книги/Код таланта/01 Введение.md", "Resources"],
  ["nvc", "Язык Жизни ННО", "30. Resources/Книги/Язык Жизни ННО/001 ННО.md", "Resources"],
  ["people", "Читать человека как книгу", "30. Resources/Книги/Читать человека как книгу.md", "Resources"],
  ["benefit", "Чистая выгода", "30. Resources/Книги/ЧЧКК - Чистая выгода.md", "Resources"],
  ["logic", "Логик и эмоционал", "30. Resources/Книги/ЧЧКК - Логик и эмоционал.md", "Resources"],
  ["books", "Книги", "40. Archive/Книги/001 Саморазвитие, Бизнес-литература.md", "Archive"],
  ["fiction", "Художественные", "40. Archive/Книги/002 Художественные.md", "Archive"]
], Kr = {
  nodes: nf.map(([i, e, t, n]) => ({ id: i, title: e, path: t, group: n })),
  edges: [
    ["home", "day"],
    ["home", "blog"],
    ["home", "polls"],
    ["home", "productivity"],
    ["day", "morning"],
    ["day", "productivity"],
    ["morning", "learning"],
    ["blog", "tiktok"],
    ["blog", "aes"],
    ["tiktok", "ads"],
    ["polls", "database"],
    ["polls", "indigo"],
    ["indigo", "business"],
    ["indigo", "media"],
    ["media", "sales"],
    ["media", "ads"],
    ["productivity", "feynman"],
    ["productivity", "learning"],
    ["learning", "speed"],
    ["learning", "talent"],
    ["learning", "nvc"],
    ["people", "benefit"],
    ["people", "logic"],
    ["books", "people"],
    ["books", "talent"],
    ["books", "fiction"],
    ["nvc", "logic"],
    ["feynman", "talent"]
  ].map(([i, e]) => ({ source: i, target: e }))
};
function sf(i, e = {}) {
  const t = new tf(i);
  return t.setSphereStyle("radiant"), t.setLabelMode("important"), t.setHandlers(
    (n) => e.onSelect?.(n),
    (n, r, s) => e.onHover?.(n, r, s)
  ), t.setData(Kr), t;
}
const af = {
  notes: Kr.nodes.length,
  edges: Kr.edges.length
};
export {
  sf as mount,
  af as stats
};
