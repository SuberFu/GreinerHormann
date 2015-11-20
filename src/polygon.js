var Vertex = require('./vertex');
var Intersection = require('./intersection');
var area = require('area-polygon')


/**
 * Polygon representation
 * @param {Array.<Array.<Number>>} p
 * @param {Boolean=}               arrayVertices
 *
 * @constructor
 */
var Polygon = function(p, arrayVertices) {

    /**
     * @type {Vertex}
     */
    this.first = null;

    /**
     * @type {Number}
     */
    this.vertices = 0;

    /**
     * @type {Vertex}
     */
    this._lastUnprocessed = null;

    /**
     * Whether to handle input and output as [x,y] or {x:x,y:y}
     * @type {Boolean}
     */
    this._arrayVertices = (typeof arrayVertices === "undefined") ?
        Array.isArray(p[0]) :
        arrayVertices;

    for (var i = 0, len = p.length; i < len; i++) {
        this.addVertex(new Vertex(p[i]));
    }
};

/**
 * Add a vertex object to the polygon
 * (vertex is added at the 'end' of the list')
 *
 * @param vertex
 */
Polygon.prototype.addVertex = function(vertex) {
    if (this.first == null) {
        this.first = vertex;
        this.first.next = vertex;
        this.first.prev = vertex;
    } else {
        var next = this.first,
            prev = next.prev;

        next.prev = vertex;
        vertex.next = next;
        vertex.prev = prev;
        prev.next = vertex;
    }
    this.vertices++;
};

/**
 * Inserts a vertex inbetween start and end according to its distance.
 * This is only used for newly created intersections.
 * (sort-method from pseudocode in Figure 11 of http://www.inf.usi.ch/hormann/papers/Greiner.1998.ECO.pdf)
 *
 * @param {Vertex} vertex
 * @param {Vertex} start
 * @param {Vertex} end
 */
Polygon.prototype.insertVertex = function(vertex, start, end) {
    var prev, curr = start;

    while (!curr.equals(end) && curr._distance < vertex._distance) {
        curr = curr.next;
    }

    vertex.next = curr;
    prev = curr.prev;

    vertex.prev = prev;
    prev.next = vertex;
    curr.prev = vertex;

    this.vertices++;
};

/**
 * Get next non-intersection point
 * @param  {Vertex} v
 * @return {Vertex}
 */
Polygon.prototype.getNext = function(v) {
    var c = v;
    while (c._isIntersection) {
        c = c.next;
    }
    return c;
};

/**
 * Unvisited intersection
 * @return {Vertex}
 */
Polygon.prototype.getFirstIntersection = function() {
    var v = this._firstIntersect || this.first;

    do {
        if (v._isIntersection && !v._visited) {
            break;
        }

        v = v.next;
    } while (!v.equals(this.first));

    this._firstIntersect = v;
    return v;
};

/**
 * Does the polygon have unvisited vertices
 * @return {Boolean} [description]
 */
Polygon.prototype.hasUnprocessed = function() {
    var v = this._lastUnprocessed || this.first;
    do {
        if (v._isIntersection && !v._visited) {
            this._lastUnprocessed = v;
            return true;
        }

        v = v.next;
    } while (!v.equals(this.first));

    this._lastUnprocessed = null;
    return false;
};

/**
 * The output depends on what you put in, arrays or objects
 * @return {Array.<Array<Number>|Array.<Object>}
 */
Polygon.prototype.getPoints = function() {
    var points = [],
        v = this.first;

    if (this._arrayVertices) {
        do {
            points.push([v.x, v.y]);
            v = v.next;
        } while (v !== this.first);
    } else {
        do {
            points.push({
                x: v.x,
                y: v.y
            });
            v = v.next;
        } while (v !== this.first);
    }

    return points;
};

/**
 * Outputs true if the polygon has a CCW winding
 * @return {Boolean}
 */
Polygon.prototype.isCounterClockwise = function() {
  // calculate signed polygon area
  // if positive area --> counter clockwise winding
  return area(this.getPoints(), true) > 0
};

Polygon.prototype.findIntersections = function(clip) {
  var sourceVertex = this.first;
  var clipVertex = clip.first;

  do {
    if (!sourceVertex._isIntersection) {
      do {
        if (!clipVertex._isIntersection) {
          var intersection = new Intersection(
              sourceVertex,
              this.getNext(sourceVertex.next),
              clipVertex, clip.getNext(clipVertex.next));

          // test if both edges really intersect
          if (intersection.valid()) {
            // create intersection vertices
            var sourceIntersection = Vertex.createIntersection(
              intersection.x,
              intersection.y,
              intersection.toSource
            );
            var clipIntersection = Vertex.createIntersection(
              intersection.x,
              intersection.y,
              intersection.toClip
            );

            // link vertices
            sourceIntersection._corresponding = clipIntersection;
            clipIntersection._corresponding = sourceIntersection;

            // sort vertices into polygons
            this.insertVertex(
                sourceIntersection,
                sourceVertex,
                this.getNext(sourceVertex.next));
            clip.insertVertex(
                clipIntersection,
                clipVertex,
                clip.getNext(clipVertex.next));
          }
        }
        clipVertex = clipVertex.next;
      } while (!clipVertex.equals(clip.first));
    }

    sourceVertex = sourceVertex.next;
  } while (!sourceVertex.equals(this.first));
}

Polygon.prototype.labelEntriesAndExits = function(
  clip,
  sourceForwards,
  clipForwards
) {
  var sourceVertex = this.first;
  var clipVertex = clip.first;

  do {
    if (sourceVertex._isIntersection) {
        sourceVertex._isEntry = sourceForwards;
        sourceForwards = !sourceForwards;
    }
    sourceVertex = sourceVertex.next;
  } while (!sourceVertex.equals(this.first));

  do {
    if (clipVertex._isIntersection) {
        clipVertex._isEntry = clipForwards;
        clipForwards = !clipForwards;
    }
    clipVertex = clipVertex.next;
  } while (!clipVertex.equals(clip.first));
}

Polygon.prototype.buildListOfPolygons = function () {
  var list = [];

  while (this.hasUnprocessed()) {
      var current = this.getFirstIntersection(),
          // keep format
          clipped = new Polygon([], this._arrayVertices);

      clipped.addVertex(new Vertex(current.x, current.y));
      do {
          current.visit();
          if (current._isEntry) {
              do {
                  current = current.next;
                  clipped.addVertex(new Vertex(current.x, current.y));
              } while (!current._isIntersection);

          } else {
              do {
                  current = current.prev;
                  clipped.addVertex(new Vertex(current.x, current.y));
              } while (!current._isIntersection);
          }
          current = current._corresponding;
      } while (!current._visited);

      list.push(clipped.getPoints());
  }

  return list;
};

wrapIntoObject = function (listOfPoints, holes) {
  if (undefined === holes) {
    holes = []
  }

  return {
    shape: listOfPoints,
    holes: holes
  }
};


Polygon.prototype.reverse = function() {
  var vertex = this.first
  do {
    var tmp = vertex.next
    vertex.next = vertex.prev
    vertex.prev = tmp

    vertex = vertex.next
  } while (vertex != this.first)
}


/**
 * Clip polygon against another one.
 * Result depends on algorithm direction:
 *
 * Intersection: forwards forwards
 * Union:        backwars backwards
 * Diff:         backwards forwards
 *
 * @param {Polygon} clip
 * @param {Boolean} sourceForwards
 * @param {Boolean} clipForwards
 */
Polygon.prototype.clip = function(clip, sourceForwards, clipForwards) {
    var intersection = sourceForwards && clipForwards
    var union = !sourceForwards && !clipForwards
    var diff = !sourceForwards && clipForwards

    if (!this.isCounterClockwise()) {
        this.reverse()
    }
    if (!clip.isCounterClockwise()) {
        clip.reverse()
    }

    if (!intersection && !union && !diff) {
      throw new Error('this clipping directions are not permitted')
    }

    // calculate and mark intersections
    this.findIntersections(clip)

    // phase two - identify entry/exit points
    var sourceInClip = this.first.isInside(clip);
    var clipInSource = clip.first.isInside(this);

    // TODO: explain why
    sourceForwards ^= sourceInClip;
    clipForwards ^= clipInSource;

    this.labelEntriesAndExits(clip, sourceForwards, clipForwards)

    // phase three - construct a list of clipped polygons
    var list = this.buildListOfPolygons()

    if (list.length === 0) {

      // when no polygons are found
      // the inherent relation of source and clip
      // and the performed operation (union | diff | intersect)
      // indicate if source, clip or empty list is the expected return value

      if (sourceInClip) {
        if (union) {
          list.push(wrapIntoObject(clip.getPoints()))
        }

        if (intersection) {
          list.push(wrapIntoObject(this.getPoints()))
        }

        // on diff
        // list stays empty
      }

      else if (clipInSource) {
        if (union) {
          list.push(wrapIntoObject(this.getPoints()))
        }

        if (intersection) {
          list.push(wrapIntoObject(clip.getPoints()))
        }

        if (diff) {
          list.push(wrapIntoObject(this.getPoints(), [clip.getPoints()]))
        }
      }

      // source and clip are disjoint
      else {
        if (union) {
          list.push(wrapIntoObject(this.getPoints()))
          list.push(wrapIntoObject(clip.getPoints()))
        }

        // on intersection
        // list stays empty

        if (diff) {
          list.push(wrapIntoObject(this.getPoints()))
        }
      }

    }

    // remove doubled last element
    else {
      for (var i = 0; i < list.length; i++) {
        if (list[i][0][0] == list[i][list[i].length - 1][0] &&
          list[i][0][1] == list[i][list[i].length - 1][1]) {
          list[i].splice(-1, 1);
        }
      }
    }

    return list;
};

module.exports = Polygon;
