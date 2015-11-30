var Vertex = require('./vertex');
var Intersection = require('./intersection');
var util = require('./util')
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
 * @param  {Vertex} vertex
 * @return {Vertex}
 */
Polygon.getNext = function(vertex) {
  var current = vertex.next
  while (!current._isOriginal) {
    current = current.next
    if (current == vertex) {
      break
    }
  }

  return current
};

Polygon.prototype.getNextOrFirst = function(vertex) {
  var next = vertex.next

  while(next._isIntersection && next != this.first) {
    next = next.next
  }

  return next
}

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


function linkVertices(v1, v2) {
  v1._corresponding = v2
  v2._corresponding = v1
}

function createIntersectionVertexFromPointOnLine(p, a1, a2) {
  var distanceSourceClip = Math.sqrt(
    Math.pow(p.x - a1.x, 2) +
    Math.pow(p.y - a1.y, 2)
  )
  var distanceClipClip = Math.sqrt(
    Math.pow(a2.x - a1.x, 2) +
    Math.pow(a2.y - a1.y, 2)
  )

  return Vertex.createIntersection(
    p.x,
    p.y,
    distanceSourceClip / distanceClipClip
  )
}

function insertDegeneratedIntersection(context) {
  if (
    context.isCurrentVertexOnLine &&
    !context.currentVertex._isIntersection
  ) {
    context.currentVertex._isIntersection = true

    if (
      context.isCorrespondingVertex1OnLine &&
      context.currentVertex.equals(context.correspondingVertex1)
    ) {
      context.correspondingVertex1._isIntersection = true

      linkVertices(
        context.currentVertex,
        context.correspondingVertex1
      )
    }

    else if (
      context.isCorrespondingVertex2OnLine &&
      context.currentVertex.equals(context.correspondingVertex2)) {
      context.correspondingVertex2._isIntersection = true

      linkVertices(
        context.currentVertex,
        context.correspondingVertex2
      )
    }

    // no point in common
    else {
      var intersectionVertex = createIntersectionVertexFromPointOnLine(
        context.currentVertex,
        context.correspondingVertex1,
        context.correspondingVertex2
      )

      linkVertices(
        context.currentVertex,
        intersectionVertex
      )

      // sort into polygon
      context.polygon.insertVertex(
        intersectionVertex,
        context.correspondingVertex1,
        context.correspondingVertex2
      )
    }
  }
}


/**
  == find intersections: source, clip ==

  for each vertex Si of source do
    for each vertex Cj of clip do
      if intersect(Si,Si+1,Cj,Cj+1,a,b)
        I1 <- CreateVertex(Si,Si+1,a)
        I2 <- CreateVertex(Cj,Cj+1,b)

        link intersection points I1 and I2

        if I1 is Si
          mark Si as intersection
        else if I1 is Si+1
          mark Si+1 as intersection
        else
          sort I1 into source
        endif

        if I2 is Cj
          mark Cj as intersection
        else if I2 is Cj+1
          mark Cj+1 as intersection
        else
          sort I2 into clip
        end if
      end if

      if degenrated
        compute degenerated intersection
        mark Si, Si+1, Cj, Cj+1 as intersection, if they intersect
      end if
    end for
  end for

  Traverse source and clip polygon and compute intersections.
  Insert intersections into polygons or mark points as intersections.
  @param {Polygon} source
  @param {Polygon} clip
  @return undefined -- mutates input
 */
function findIntersections(source, clip) {
  var sourceVertex = source.first
  var clipVertex = clip.first

  do {
    var sourceNext = Polygon.getNext(sourceVertex)

    do {
      var clipNext = Polygon.getNext(clipVertex)

      var intersection = new Intersection(
        sourceVertex,
        sourceNext,
        clipVertex,
        clipNext
      )

      // aribitrary intersection
      if (intersection.isValid()) {
        var sourceIntersection = Vertex.createIntersection(
          intersection.x,
          intersection.y,
          intersection.toSource // sort via distance
        )
        var clipIntersection = Vertex.createIntersection(
          intersection.x,
          intersection.y,
          intersection.toClip // sort via distance
        )

        // link vertices
        sourceIntersection._corresponding = clipIntersection
        clipIntersection._corresponding = sourceIntersection

        // sort vertices into polygons
        source.insertVertex(
          sourceIntersection,
          sourceVertex,
          sourceNext
        )
        clip.insertVertex(
          clipIntersection,
          clipVertex,
          clipNext
        )
      }

      // one or both of the points are on the line of the others
      if (intersection._isDegenerated) {

        insertDegeneratedIntersection({
          isCurrentVertexOnLine: intersection._onLine.s1,
          currentVertex: sourceVertex,
          isCorrespondingVertex1OnLine: intersection._onLine.c1,
          correspondingVertex1: clipVertex,
          isCorrespondingVertex2OnLine: intersection._onLine.c2,
          correspondingVertex2: clipNext,
          polygon: clip
        })

        insertDegeneratedIntersection({
          isCurrentVertexOnLine: intersection._onLine.s2,
          currentVertex: sourceNext,
          isCorrespondingVertex1OnLine: intersection._onLine.c1,
          correspondingVertex1: clipVertex,
          isCorrespondingVertex2OnLine: intersection._onLine.c2,
          correspondingVertex2: clipNext,
          polygon: clip
        })

        insertDegeneratedIntersection({
          isCurrentVertexOnLine: intersection._onLine.c1,
          currentVertex: clipVertex,
          isCorrespondingVertex1OnLine: intersection._onLine.s1,
          correspondingVertex1: sourceVertex,
          isCorrespondingVertex2OnLine: intersection._onLine.s2,
          correspondingVertex2: sourceNext,
          polygon: source
        })

        insertDegeneratedIntersection({
          isCurrentVertexOnLine: intersection._onLine.c2,
          currentVertex: clipNext,
          isCorrespondingVertex1OnLine: intersection._onLine.s1,
          correspondingVertex1: sourceVertex,
          isCorrespondingVertex2OnLine: intersection._onLine.s2,
          correspondingVertex2: sourceNext,
          polygon: source
        })

      }

      clipVertex = clip.getNextOrFirst(clipVertex)
    } while(clipVertex != clip.first)

    sourceVertex = source.getNextOrFirst(sourceVertex)
  } while (sourceVertex != source.first)
}

Polygon.prototype.findIntersections = function(clip) {
  findIntersections(this, clip)
}

function removeFromPolygon(vertex) {
  vertex._isRemoved = true;
  vertex._isIntersection = false;
  vertex._corresponding._isRemoved = true;
  vertex._corresponding._isIntersection = false;
}

/**
  == labelEntryOrExit: intersection_vertex ==

  pair <- intersection_vertex.relativePositionPair()

  if pair is one of 'on/out', 'in/on', 'in/out'
    intersection_vertex.label <- 'exit'
  else if pair is one of 'on/in', 'out/on', 'out/in'
    intersection_vertex.label <- 'entry'
  else if pair is one of 'on/on', 'in/in', 'out/out'
    npair <- intersection_vertex.neighbor.relativePositionPair()
    if npair is one of 'on/on', 'in/in', 'out/out'
      intersection_vertex.intersection <- false
    else if pair is 'in/in'
      intersection_vertex.label <- 'entry'
    else if pair is 'out/out'
      intersection_vertex.label <- 'exit'
    else if pair is 'on/on'
      intersection_vertex.label <- opposite of intersection_vertex.neighbor.label
    end if
  end if
*/
Polygon.prototype.labelEntryOrExit = function (vertex) {
  var currentPairing = vertex.getPairing();
  switch (currentPairing) {
    case 'in/out':
    case 'on/out':
    case 'in/on':
      vertex._isEntry = false;
      break;
    case 'out/in':
    case 'on/in':
    case 'out/on':
      vertex._isEntry = true;
      break;
    case 'out/out':
    case 'in/in':
    case 'on/on':
      var correspondingPairing = vertex._corresponding.getPairing();
      if (
        correspondingPairing === 'out/out'
        || correspondingPairing === 'in/in'
        || correspondingPairing === 'on/on'
      ) {
        removeFromPolygon(vertex)
      } else {
        if (currentPairing === 'out/out') {
          vertex._isEntry = false
        } else if (currentPairing == 'in/in') {
          vertex._isEntry = true
        } else if (currentPairing == 'on/on') {
          this.labelEntryOrExit(vertex._corresponding);
          vertex._isEntry = !vertex._corresponding._isEntry;
        }
      }
      break;
    default:
      // This shouldn't ever happen - It's here to confirm nothing stupid is happening.
      console.error('UNKNOWN TYPE', currentPairing);
  }
};

function setRelativePositions(polygon, relativePolygon) {
  var vertex = polygon.first
  do {
    if (vertex._isIntersection) {
      vertex._relativePosition = 'on'
    } else {
      vertex.setRelativePosition(relativePolygon)
    }
    vertex = vertex.next
  } while(vertex != polygon.first)
}

Polygon.prototype.setRelativePositions = function (polygon) {
  setRelativePositions(this, polygon)
}

/**
  == labelEntriesAndExits: source, clip ==
  = pre-condition: every vertex in source and clip is labelled as 'entry' =

  for each vertex Si of source do
    mark relative position of Si to clip
      // out -> Si outside of clip
      // in -> Si inside of clip
      // on -> Si is intersection
  end for

  for each vertex Cj of clip do
    mark relative position of Cj to clip
  end for

  for each vertex Si of source do
    if Si is intersection
      labelEntryOrExit Si
      labelEntryOrExit Si.neighbor

      if label of Si is 'entry' and label of Si.neighbor is 'entry'
        Si.intersection <- false
        mark relative position of Si as 'in'
        Si.neighbor.intersection <- false
        mark relative position of Si.neighbor as 'in'
      else if label of Si is 'exit' and label of Si.neighbor is 'exit'
        Si.intersection <- false
        mark relative position of Si as 'out'
        Si.neighbor.intersection <- false
        mark relative position of Si.neighbor as 'out'
      end if
    end if
  end for
 */
Polygon.prototype.labelEntriesAndExits = function(
  clip,
  sourceForwards,
  clipForwards
) {
  var vertex = this.first

  do {
    if (vertex._isIntersection) {
      this.labelEntryOrExit(vertex)
      this.labelEntryOrExit(vertex._corresponding)

      // pair en/en
      if (
        vertex._isEntry
        && vertex._corresponding._isEntry
      ) {
        vertex._isIntersection = false
        vertex._relativePosition = 'in'
        vertex._corresponding._isIntersection = false
        vertex._corresponding._relativePosition = 'in'
      }

      // pair ex/ex
      else if (
        !vertex._isEntry
        && !vertex._corresponding._isEntry
      ) {
        vertex._isIntersection = false
        vertex._relativePosition = 'out'
        vertex._corresponding._isIntersection = false
        vertex._corresponding._relativePosition = 'out'
      }
    }
    vertex = vertex.next
  } while (vertex != this.first)
}

Polygon.prototype.buildListOfPolygons = function (sourceForwards,
                                                  clipForwards) {
  var list = [];
  var sourceNext = sourceForwards ? 'next' : 'prev'
  var sourcePrev = sourceForwards ? 'prev' : 'next'
  var clipNext = clipForwards ? 'next' : 'prev'
  var clipPrev = clipForwards ? 'prev' : 'next'

  while (this.hasUnprocessed()) {
    var onClipped = false
    var current = this.getFirstIntersection(),
        // keep format
        clipped = new Polygon([], this._arrayVertices);

    clipped.addVertex(new Vertex(current.x, current.y));
    do {
      current.visit();
      if (current._isEntry) {
        do {
          current = current[onClipped ? clipNext : sourceNext];
          clipped.addVertex(new Vertex(current.x, current.y));
        } while (!current._isIntersection);
      } else {
        do {
          current = current[onClipped ? clipPrev : sourcePrev];
          clipped.addVertex(new Vertex(current.x, current.y));
        } while (!current._isIntersection);
      }

      current = current._corresponding;
      onClipped = !onClipped
    } while (!current._visited);

    list.push(wrapIntoObject(clipped.getPoints()));
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

Polygon.prototype.handleEdgeCases = function(list,
                                             clip,
                                             sourceInClip,
                                             clipInSource,
                                             union,
                                             diff,
                                             intersection) {
  if (list.length !== 0) {
    return
  }

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


/**
  == clip: source, clip, sourceForwards, clipForwards ==

  mode <- determineModeFrom sourceForwards, clipForwards

  if source is clockwise
    reverse source
  end if

  if clip is clockwise
    reverse clip
  end if

  findIntersections source, clip
  labelEntriesAndExits source, clip
  polygons <- buildPolygons source, clip, sourceForwards, clipForwards
  handleEdgeCases polygons, mode, source, clip
 **/
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

    // clockwise-winded polygons will be reversed to counter-clockwise
    // polygons
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
    this.setRelativePositions(clip)
    clip.setRelativePositions(this)

    var sourceInClip = this.first.isInside(clip);
    var clipInSource = clip.first.isInside(this);

    // TODO: explain why
    // sourceForwards ^= sourceInClip;
    // clipForwards ^= clipInSource;

    this.labelEntriesAndExits(clip, sourceForwards, clipForwards)

    // phase three - construct a list of clipped polygons
    var list = this.buildListOfPolygons(sourceForwards, clipForwards)
    this.handleEdgeCases(
      list,
      clip,
      sourceInClip,
      clipInSource,
      union,
      diff,
      intersection
    )

    // remove doubled last element
    for (var i = 0; i < list.length; i++) {
      var shape = list[i].shape
      var first = shape[0]
      var last = shape[shape.length -1]

      if (first[0] == last[0] && first[1] == last[1]) {
        shape.splice(-1, 1)
      }
    }

    return list;
};

module.exports = Polygon;
