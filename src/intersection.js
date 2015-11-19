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
    return;
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
  return (0 == this.toSource) && (0 <= this.toClip && this.toClip <= 1);
};

module.exports = Intersection;
