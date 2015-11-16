var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')
var Vertex = require('../src/vertex')


describe('Polygon', function() {
  it('should handle output as array vertices when boolean is given', function() {
    var polygon = new Polygon([], true)

    expect(polygon._arrayVertices).to.be.true
  })

  it('should handle output as object vertices when boolean is given', function() {
    var polygon = new Polygon([], false)

    expect(polygon._arrayVertices).to.be.false
  })

  it('should detect output as array vertices', function() {
    var polygon = new Polygon([[0,0]])

    expect(polygon._arrayVertices).to.be.true
  })

  it('should detect output as object vertices', function() {
    var polygon = new Polygon([{x: 0, y: 0}])

    expect(polygon._arrayVertices).to.be.false
  })

  it('should add vertices', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    // test values
    expect(polygon.vertices).to.equal(4)
    expect(polygon.first.equals({x:0,y:0})).to.be.true
    expect(polygon.first.next.equals({x:1,y:0})).to.be.true
    expect(polygon.first.next.next.equals({x:1,y:1})).to.be.true
    expect(polygon.first.next.next.next.equals({x:0,y:1})).to.be.true

    // test links
    expect(polygon.first.next.next.next.next.equals(polygon.first)).to.be.true
    expect(polygon.first.prev.prev.prev.prev.equals(polygon.first)).to.be.true
  })

  it('should insert a vertex', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    var v = new Vertex(2,2)
    var oldNext = polygon.first.next.next
    polygon.insertVertex(v, polygon.first.next, polygon.first.next.next)

    expect(polygon.vertices).to.equal(5)
    expect(polygon.first.next.next.equals(v)).to.be.true
    expect(polygon.first.next.next.next.equals(oldNext)).to.be.true

  })
})
