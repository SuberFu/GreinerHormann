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

    expect(p1.vertices).to.equal(4)
    expect(p1.first._isIntersection).to.be.true
    expect(p1.first.next._isIntersection).to.be.true
    expect(p1.first.next.next._isIntersection).to.be.true
    expect(p1.first.next.next.next._isIntersection).to.be.true
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

    expect(p1.vertices).to.equal(6)
    expect(p2.vertices).to.equal(6)
  })

})
