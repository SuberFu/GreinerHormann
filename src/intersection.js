var util = require('./util')

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


  // === is this a degenerated intersection ? ===

  var c1OnS = util.pointOnLine(s1, s2, c1)
  var c2OnS = util.pointOnLine(s1, s2, c2)
  var s1OnC = util.pointOnLine(c1, c2, s1)
  var s2OnC = util.pointOnLine(c1, c2, s2)
  this._isDegenerated = c1OnS || c2OnS || s1OnC || s2OnC
  this._onLine = {
    s1: s1OnC,
    s2: s2OnC,
    c1: c1OnS,
    c2: c2OnS
  }


  // === calculate alpha values ===

  // ===== point on line equations =====

  if (c1OnS) {
    this.toClip = 0
    this.toSource = util.pointOnLineDistance(s1, s2, c1)
  }

  if (c2OnS) {
    this.toClip = 1
    this.toSource = util.pointOnLineDistance(s1, s2, c2)
  }

  if (s1OnC) {
    this.toSource = 0
    this.toClip = util.pointOnLineDistance(c1, c2, s1)
  }

  if (s2OnC) {
    this.toSource = 1
    this.toClip = util.pointOnLineDistance(c1, c2, s2)
  }


  // ===== arbitrary intersection equations =====

  var denominator = (c2.y - c1.y) * (s2.x - s1.x) - (c2.x - c1.x) * (s2.y - s1.y)

  if (0 !== denominator) {
    var nominatorSource = (c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)
    var nominatorClip = (s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)

    this.toSource = nominatorSource / denominator
    this.toClip = nominatorClip / denominator
  }

  // === linear equations ===

  if (null !== this.toSource &&
      null !== this.toClip) {
    this.x = s1.x + this.toSource * (s2.x - s1.x)
    this.y = s1.y + this.toSource * (s2.y - s1.y)
  }
};

/**
 * Test wether the intersection is occuring inbetween both lines
 * @return {Boolean}
 */
Intersection.prototype.isValid = function() {
  return null !== this.toSource
    && null !== this.toClip
    && 0 < this.toSource && this.toSource < 1
    && 0 < this.toClip && this.toClip < 1
};


module.exports = Intersection;
