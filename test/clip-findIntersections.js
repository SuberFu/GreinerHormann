var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')


describe('Find Intersections', function() {

  it ('should find intersections for identical degenerated polygons', function() {
    var points = [
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ]
    var p1 = new Polygon(points)
    var p2 = new Polygon(points)

    p1.findIntersections(p2)
    p1.setRelativePositions(p2)
    p2.setRelativePositions(p1)


    expect(p1.vertices).to.equal(4)
    expect(p2.vertices).to.equal(4)

    expect(p1.first._isIntersection).to.be.true
    expect(p1.first.next._isIntersection).to.be.true
    expect(p1.first.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next._isIntersection).to.be.true

    expect(p2.first._isIntersection).to.be.true
    expect(p2.first.next._isIntersection).to.be.true
    expect(p2.first.next.next._isIntersection).to.be.true
    expect(p2.first.next.next.next._isIntersection).to.be.true

    expect(p1.first._relativePosition).to.equal('on')
    expect(p1.first.next._relativePosition).to.equal('on')
    expect(p1.first.next.next._relativePosition).to.equal('on')
    expect(p1.first.next.next.next._relativePosition).to.equal('on')

    expect(p2.first._relativePosition).to.equal('on')
    expect(p2.first.next._relativePosition).to.equal('on')
    expect(p2.first.next.next._relativePosition).to.equal('on')
    expect(p2.first.next.next.next._relativePosition).to.equal('on')

    expect(p1.first._corresponding).to.deep.equal(p2.first)
    expect(p1.first.next._corresponding).to.deep.equal(p2.first.next)
    expect(p1.first.next.next._corresponding).to.deep.equal(p2.first.next.next)
    expect(p1.first.next.next.next._corresponding).to.deep.equal(p2.first.next.next.next)

    expect(p2.first._corresponding).to.deep.equal(p1.first)
    expect(p2.first.next._corresponding).to.deep.equal(p1.first.next)
    expect(p2.first.next.next._corresponding).to.deep.equal(p1.first.next.next)
    expect(p2.first.next.next.next._corresponding).to.deep.equal(p1.first.next.next.next)
  })

  it ('should find intersections for overlapping degenerated polygons', function() {
    var p1 = new Polygon([
      [-2, -1],
      [1, -1],
      [1, 1],
      [-2, 1]
    ])
    var p2 = new Polygon([
      [-1, -1],
      [2, -1],
      [2, 1],
      [-1, 1]
    ])

    p1.findIntersections(p2)
    p1.setRelativePositions(p2)
    p2.setRelativePositions(p1)


    expect(p1.vertices).to.equal(6)
    expect(p2.vertices).to.equal(6)

    expect(p1.getPoints()).to.deep.equal([
      [ -2, -1 ],
      [ -1, -1 ],
      [  1, -1 ],
      [  1,  1 ],
      [ -1,  1 ],
      [ -2,  1 ]
    ])
    expect(p2.getPoints()).to.deep.equal([
      [ -1, -1 ],
      [  1, -1 ],
      [  2, -1 ],
      [  2,  1 ],
      [  1,  1 ],
      [ -1,  1 ]
    ])

    expect(p1.first._isIntersection).to.be.false
    expect(p1.first.next._isIntersection).to.be.true
    expect(p1.first.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next.next.next._isIntersection).to.be.false

    expect(p2.first._isIntersection).to.be.true
    expect(p2.first.next._isIntersection).to.be.true
    expect(p2.first.next.next._isIntersection).to.be.false
    expect(p2.first.next.next.next._isIntersection).to.be.false
    expect(p2.first.next.next.next.next._isIntersection).to.be.true
    expect(p2.first.next.next.next.next.next._isIntersection).to.be.true

    expect(p1.first._relativePosition).not.to.equal('on')
    expect(p1.first.next._relativePosition).to.equal('on')
    expect(p1.first.next.next._relativePosition).to.equal('on')
    expect(p1.first.next.next.next._relativePosition).to.equal('on')
    expect(p1.first.next.next.next.next._relativePosition).to.equal('on')
    expect(p1.first.next.next.next.next.next._relativePosition).not.to.equal('on')

    expect(p2.first._relativePosition).to.equal('on')
    expect(p2.first.next._relativePosition).to.equal('on')
    expect(p2.first.next.next._relativePosition).not.to.equal('on')
    expect(p2.first.next.next.next._relativePosition).not.to.equal('on')
    expect(p2.first.next.next.next.next._relativePosition).to.equal('on')
    expect(p2.first.next.next.next.next.next._relativePosition).to.equal('on')

    expect(p1.first._corresponding).to.deep.equal(null)
    expect(p1.first.next._corresponding).to.deep.equal(p2.first)
    expect(p1.first.next.next._corresponding).to.deep.equal(p2.first.next)
    expect(p1.first.next.next.next._corresponding).to.deep.equal(p2.first.next.next.next.next)
    expect(p1.first.next.next.next.next._corresponding).to.deep.equal(p2.first.next.next.next.next.next)
    expect(p1.first.next.next.next.next.next._corresponding).to.deep.equal(null)

    expect(p2.first._corresponding).to.deep.equal(p1.first.next)
    expect(p2.first.next._corresponding).to.deep.equal(p1.first.next.next)
    expect(p2.first.next.next._corresponding).to.deep.equal(null)
    expect(p2.first.next.next.next._corresponding).to.deep.equal(null)
    expect(p2.first.next.next.next.next._corresponding).to.deep.equal(p1.first.next.next.next)
    expect(p2.first.next.next.next.next.next._corresponding).to.deep.equal(p1.first.next.next.next.next)
  })

  it('should find intersections for inherent degenerated polygons', function() {
    var p1 = new Polygon([
      [ -5, -2.7 ],
      [  3, -2.7 ],
      [  3,  2.7 ],
      [ -5,  2.7 ]
    ])
    var p2 = new Polygon([
      [ -1, -2.7 ],
      [  3, -2.7 ],
      [  3,  2.7 ],
      [ -1,  2.7 ]
    ])

    p1.findIntersections(p2)
    p1.setRelativePositions(p2)
    p2.setRelativePositions(p1)

    expect(p1.vertices).to.equal(6)
    expect(p2.vertices).to.equal(4)

    expect(p1.getPoints()).to.deep.equal([
      [ -5, -2.7 ],
      [ -1, -2.7 ],
      [  3, -2.7 ],
      [  3,  2.7 ],
      [ -1,  2.7 ],
      [ -5,  2.7 ]
    ])
    expect(p2.getPoints()).to.deep.equal([
      [ -1, -2.7 ],
      [  3, -2.7 ],
      [  3,  2.7 ],
      [ -1,  2.7 ]
    ])

    expect(p1.first._isIntersection).to.be.false
    expect(p1.first.next._isIntersection).to.be.true
    expect(p1.first.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next.next.next._isIntersection).to.be.false

    expect(p2.first._isIntersection).to.be.true
    expect(p2.first.next._isIntersection).to.be.true
    expect(p2.first.next.next._isIntersection).to.be.true
    expect(p2.first.next.next.next._isIntersection).to.be.true

    expect(p1.first._relativePosition).not.to.equal('on')
    expect(p1.first.next._relativePosition).to.equal('on')
    expect(p1.first.next.next._relativePosition).to.equal('on')
    expect(p1.first.next.next.next._relativePosition).to.equal('on')
    expect(p1.first.next.next.next.next._relativePosition).to.equal('on')
    expect(p1.first.next.next.next.next.next._relativePosition).not.to.equal('on')

    expect(p2.first._relativePosition).to.equal('on')
    expect(p2.first.next._relativePosition).to.equal('on')
    expect(p2.first.next.next._relativePosition).to.equal('on')
    expect(p2.first.next.next.next._relativePosition).to.equal('on')

    expect(p1.first._corresponding).to.deep.equal(null)
    expect(p1.first.next._corresponding).to.deep.equal(p2.first)
    expect(p1.first.next.next._corresponding).to.deep.equal(p2.first.next)
    expect(p1.first.next.next.next._corresponding).to.deep.equal(p2.first.next.next)
    expect(p1.first.next.next.next.next._corresponding).to.deep.equal(p2.first.next.next.next)
    expect(p1.first.next.next.next.next.next._corresponding).to.deep.equal(null)

    expect(p2.first._corresponding).to.deep.equal(p1.first.next)
    expect(p2.first.next._corresponding).to.deep.equal(p1.first.next.next)
    expect(p2.first.next.next._corresponding).to.deep.equal(p1.first.next.next.next)
    expect(p2.first.next.next.next._corresponding).to.deep.equal(p1.first.next.next.next.next)
  })

  it('should find intersections for just in one point intersecting degenerated polygons', function() {
    var p1 = new Polygon([
      [ -1, 1 ],
      [  1, 1 ],
      [  0, 2 ]
    ])
    var p2 = new Polygon([
      [ -1, 0 ],
      [  1, 0 ],
      [  0, 1 ]
    ])

    p1.findIntersections(p2)
    p1.setRelativePositions(p2)
    p2.setRelativePositions(p1)


    expect(p1.vertices).to.equal(4)
    expect(p2.vertices).to.equal(3)

    expect(p1.getPoints()).to.deep.equal([
      [ -1, 1 ],
      [  0, 1 ],
      [  1, 1 ],
      [  0, 2 ]
    ])
    expect(p2.getPoints()).to.deep.equal([
      [ -1, 0 ],
      [  1, 0 ],
      [  0, 1 ]
    ])

    expect(p1.first._isIntersection).to.be.false
    expect(p1.first.next._isIntersection).to.be.true
    expect(p1.first.next.next._isIntersection).to.be.false
    expect(p1.first.next.next.next._isIntersection).to.be.false

    expect(p2.first._isIntersection).to.be.false
    expect(p2.first.next._isIntersection).to.be.false
    expect(p2.first.next.next._isIntersection).to.be.true

    expect(p1.first._relativePosition).not.to.equal('on')
    expect(p1.first.next._relativePosition).to.equal('on')
    expect(p1.first.next.next._relativePosition).not.to.equal('on')
    expect(p1.first.next.next.next._relativePosition).not.to.equal('on')

    expect(p2.first._relativePosition).not.to.equal('on')
    expect(p2.first.next._relativePosition).not.to.equal('on')
    expect(p2.first.next.next._relativePosition).to.equal('on')

    expect(p1.first._corresponding).to.deep.equal(null)
    expect(p1.first.next._corresponding).to.deep.equal(p2.first.next.next)
    expect(p1.first.next.next._corresponding).to.deep.equal(null)
    expect(p1.first.next.next.next._corresponding).to.deep.equal(null)

    expect(p2.first._corresponding).to.deep.equal(null)
    expect(p2.first.next._corresponding).to.deep.equal(null)
    expect(p2.first.next.next._corresponding).to.deep.equal(p1.first.next)

  })

})
