function equal(a, b, threshold) {
  if (undefined === threshold) {
    threshold = 0.00000000000001
  }

  return Math.abs(a - b) < threshold
}

function equalPoint(p1, p2) {
  return equal(p1.x, p2.x) && equal(p1.y, p2.y)
}

/**
 * Test if two lines have a start or end point in common and return their
 * relation.
 * @param {Vertex|Object} s1 - Source start point containing x, y keys
 * @param {Vertex|Object} s2 - Source end point containing x, y keys
 * @param {Vertex|Object} c1 - Clip start point containing x, y keys
 * @param {Vertex|Object} c2 - Clip end point containing x, y keys
 */
function pointInCommon(s1, s2, c1, c2) {
  // try all combinations
  if (equalPoint(s1, c1)) {
    return {
      toSource: 0,
      toClip: 0
    }
  }

  if (equalPoint(s1, c2)) {
    return {
      toSource: 0,
      toClip: 1
    }
  }

  if (equalPoint(s2, c1)) {
    return {
      toSource: 1,
      toClip: 0
    }
  }

  if (equalPoint(s2, c2)) {
    return {
      toSource: 1,
      toClip: 1
    }
  }

  // no intersection found
  return false
}

/**
 * Intersection
 * @param {Vertex} s1
 * @param {Vertex} s2
 * @param {Vertex} c1
 * @param {Vertex} c2
 * @constructor
 */
var Intersection = function(s1, s2, c1, c2) {

  /**
   * Horizontal Intersection Position
   * @type {Number}
   */
  this.x = 0.0;

  /**
   * Vertical Intersection Position
   * @type {Number}
   */
  this.y = 0.0;

  /**
   * Relative Position of intersection on source-line between start and end
   * 0 <= toSource <= 1 for valid intersection
   * @type {Number}
   */
  this.toSource = null;

  /**
   * Relative Position of intersection on clip-line between start and end
   * 0 <= toSource <= 1 for valid intersection
   * @type {Number}
   */
  this.toClip = null;


  // === calculate alpha values ===

  var denominator = (c2.y - c1.y) * (s2.x - s1.x) - (c2.x - c1.x) * (s2.y - s1.y);

  if (denominator === 0) {
    // do both lines have a point in common?
    var alphaValues = pointInCommon(s1, s2, c1, c2)
    if (alphaValues) {
      this.toSource = alphaValues.toSource
      this.toClip = alphaValues.toClip
      this.x = s1.x + this.toSource * (s2.x - s1.x);
      this.y = s1.y + this.toSource * (s2.y - s1.y);
    }

    return
  }

  var nominatorSource = (c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)
  var nominatorClip = (s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)

  this.toSource = nominatorSource / denominator;
  this.toClip = nominatorClip / denominator;


  // === approximate 0 and 1 due to floating errors ===

  if (-0.00000000000001 < this.toSource && this.toSource < 0.00000000000001) {
    this.toSource = 0
  }

  if (-0.00000000000001 < this.toClip && this.toClip < 0.00000000000001) {
    this.toClip = 0
  }

  if (0.99999999999999 < this.toSource && this.toSource < 1.00000000000001) {
    this.toSource = 1
  }

  if (0.99999999999999 < this.toClip && this.toClip < 1.00000000000001) {
    this.toClip = 1
  }


  // === linear equations ===

  this.x = s1.x + this.toSource * (s2.x - s1.x);
  this.y = s1.y + this.toSource * (s2.y - s1.y);
};

/**
 * Test wether the intersection is occuring inbetween both lines
 * @return {Boolean}
 */
Intersection.prototype.isValid = function() {
  return null !== this.toSource
    && null !== this.toClip
    && 0 <= this.toSource && this.toSource <= 1
    && 0 <= this.toClip && this.toClip <= 1;
};

/**
 * @return {Boolean}
 */
Intersection.prototype.isDegenerated = function() {
  return (this.toSource == 0 || this.toSource == 1)
    && (this.toClip == 0 || this.toClip == 1)
};

module.exports = Intersection;
