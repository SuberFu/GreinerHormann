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
     * @type {Number}
     */
    this.x = 0.0;

    /**
     * @type {Number}
     */
    this.y = 0.0;

    /**
     * @type {Number}
     */
    this.toSource = 0.0;

    /**
     * @type {Number}
     */
    this.toClip = 0.0;

    // solving linear equation for intersection via determinants
    // Ax = b with xi = d(xi) / d
    var determinant = (c2.y - c1.y) * (s2.x - s1.x) - (c2.x - c1.x) * (s2.y - s1.y);
    // s12 parallel to c12?
    if (0 === determinant) {
        return;
    }

    /**
     * @type {Number}
     */
    var determinantSource = (c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)
    this.toSource = determinantSource / determinant;

    /**
     * @type {Number}
     */
    var determinantClip = (s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)
    this.toClip = determinantClip / determinant;

    if (this.valid()) {
      // linear equations
      this.x = s1.x + this.toSource * (s2.x - s1.x);
      this.y = s1.y + this.toSource * (s2.y - s1.y);
    }
};

/**
 * @return {Boolean}
 */
Intersection.prototype.valid = function() {
    return (0 < this.toSource && this.toSource < 1) && (0 < this.toClip && this.toClip < 1);
};

/**
 * @return {Boolean}
 */
Intersection.prototype.degenerated = function() {
    return (0 == this.toSource) && (0 <= this.toClip && this.toClip <= 1);
};

module.exports = Intersection;
