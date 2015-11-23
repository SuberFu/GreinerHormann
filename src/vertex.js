/**
 * Vertex representation
 *
 * @param {Number|Array.<Number>} x
 * @param {Number=}               y
 *
 * @constructor
 */
var Vertex = function(x, y) {

    if (arguments.length === 1) {
        // Coords
        if (Array.isArray(x)) {
            y = x[1];
            x = x[0];
        } else {
            y = x.y;
            x = x.x;
        }
    }

    /**
     * X coordinate
     * @type {Number}
     */
    this.x = x;

    /**
     * Y coordinate
     * @type {Number}
     */
    this.y = y;

    /**
     * Next node
     * @type {Vertex}
     */
    this.next = null;

    /**
     * Previous vertex
     * @type {Vertex}
     */
    this.prev = null;

    /**
     * Corresponding intersection in other polygon
     */
    this._corresponding = null;

    /**
     * Distance from previous
     */
    this._distance = 0.0;

    /**
     * Entry/exit point in another polygon
     * @type {Boolean}
     */
    // initially for the labelling phase
    // each vertex is marked as entry
    this._isEntry = true;

    /**
     * Intersection vertex flag
     * @type {Boolean}
     */
    this._isIntersection = false;

    /**
     * Relative position of this vertex to the corresponding polygon
     * @type {String} on | in | out
     */
    this._relativePosition = null;

    /**
     * Loop check
     * @type {Boolean}
     */
    this._visited = false;
};

/**
 * Creates intersection vertex
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} distance
 * @return {Vertex}
 */
Vertex.createIntersection = function(x, y, distance) {
    var vertex = new Vertex(x, y)
    vertex._distance = distance
    vertex._isIntersection = true
    vertex._isEntry = false
    return vertex
};

/**
 * Mark as visited
 */
Vertex.prototype.visit = function() {
    this._visited = true;
    if (this._corresponding !== null && !this._corresponding._visited) {
        this._corresponding.visit();
    }
};

/**
 * Convenience
 * @param  {Vertex}  v
 * @return {Boolean}
 */
Vertex.prototype.equals = function(v) {
    return this.x === v.x && this.y === v.y;
};

/**
 * Check if vertex is inside a polygon by odd-even rule:
 * If the number of intersections of a ray out of the point and polygon
 * segments is odd - the point is inside.
 * @param {Polygon} poly
 * @return {Boolean}
 */
Vertex.prototype.isInside = function(poly) {
  var oddNodes = false,
      vertex = poly.first,
      next = vertex.next,
      x = this.x,
      y = this.y;

  do {
    if (
      (vertex.y < y && next.y >= y || next.y < y && vertex.y >= y)
      && (vertex.x <= x || next.x <= x)
    ) {
      oddNodes ^= (vertex.x + (y - vertex.y) /
                  (next.y - vertex.y) * (next.x - vertex.x) < x);
    }

    vertex = vertex.next;
    next = vertex.next || poly.first;
  } while (!vertex.equals(poly.first));

  return !!oddNodes;
};

/**
 * Relative position is either 'in' or 'out'
 * because other wise it would be an intersection.
 * If it is an intersection, the relative position is set while
 * computing the intersection
 * (or converting an existing vertex to an intersection)
 *
 * @param {Polygon} poly - The polygon to set the position relative to
 */
Vertex.prototype.setRelativePosition = function (poly) {
  if (this.isInside(poly)) {
    this._relativePosition = 'in'
  } else {
    this._relativePosition = 'out'
  }
};

Vertex.prototype.getPairing = function () {
  return this.prev._relativePosition + '/' + this.next._relativePosition
};

module.exports = Vertex;
