var util = {
  equal: function (a, b, threshold) {
    if (undefined === threshold) {
      threshold = 0.00000000000001
    }

    return Math.abs(a - b) <= threshold
  },

  equalPoint: function (p1, p2) {
    return util.equal(p1.x, p2.x) && util.equal(p1.y, p2.y)
  },

  between: function (value, border1, border2) {
    var max = Math.max(border1, border2)
    var min = Math.min(border1, border2)

    return min <= value && value <= max
  },

  /**
   * Test if two lines have a start or end point in common and return their
   * relation.
   * @param {Vertex|Object} s1 - Source start point containing x, y keys
   * @param {Vertex|Object} s2 - Source end point containing x, y keys
   * @param {Vertex|Object} c1 - Clip start point containing x, y keys
   * @param {Vertex|Object} c2 - Clip end point containing x, y keys
   */
  pointInCommon: function (s1, s2, c1, c2) {
    // try all combinations
    if (util.equalPoint(s1, c1)) {
      return {
        toSource: 0,
        toClip: 0
      }
    }

    if (util.equalPoint(s1, c2)) {
      return {
        toSource: 0,
        toClip: 1
      }
    }

    if (util.equalPoint(s2, c1)) {
      return {
        toSource: 1,
        toClip: 0
      }
    }

    if (util.equalPoint(s2, c2)) {
      return {
        toSource: 1,
        toClip: 1
      }
    }

    // no intersection found
    return false
  },

  /**
   * Given a line by points a1 and a2,
   * Test wether p is between a1 and a2
   * @param {Vertex} a1
   * @param {Vertex} a2
   * @param {Vertex} p
   * @return {Boolean} true if p is between a1 and a2
   */
  pointOnLine: function (a1, a2, p) {
    var direction = {
      x: a2.x - a1.x,
      y: a2.y - a1.y
    }

    // vertical line
    if (util.equal(direction.x, 0) && util.equal(a1.x, p.x)) {
      return util.between(p.y, a1.y, a2.y)
    }

    // horizontal line
    if (util.equal(direction.y, 0) && util.equal(a1.y, p.y)) {
      return util.between(p.x, a1.x, a2.x)
    }

    // solve linear equation for t
    // a1 + t * direction = p ?
    // -> a1.x + t * direction.x = p.x
    // -> a1.y + t * direction.y = p.y
    // -> (p.x - a1.x) / direction.x = t
    // -> (p.y - a1.y) / direction.y = t
    var t1 = (p.x - a1.x) / direction.x
    var t2 = (p.y - a1.y) / direction.y

    return util.equal(t1, t2) && // p on line a1 -> a2
           util.between(p.x, a1.x, a2.x) && // p between a1, a2 on the line
           util.between(p.y, a1.y, a2.y)
  },

  pointOnLineDistance: function(a1, a2, p) {
    // we know p is between a1 and a2 on line a2-a1
    var direction =  {
      x: a2.x - a1.x,
      y: a2.y - a1.y
    }

    // p == a1
    if (util.equalPoint(a1, p)) {
      return 0
    }

    // p == a2
    if (util.equalPoint(a2, p)) {
      return 1
    }

    // vertical line
    if (util.equal(direction.x, 0)) {
      return (p.y - a1.y) / direction.y
    }

    // arbitrary lines
    // or horizontal line
    return (p.x - a1.x) / direction.x
  }
}


module.exports = util
