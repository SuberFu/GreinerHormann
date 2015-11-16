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

    expect(polygon.vertices).to.equal(4)

    var v = Vertex.createIntersection(1, 0.5, 0.5)
    var oldVertex = polygon.first.next.next
    polygon.insertVertex(v, polygon.first, polygon.first.next.next)

    expect(polygon.vertices).to.equal(5)
    expect(polygon.first.next.next.equals(v)).to.be.true
    expect(polygon.first.next.next.next.equals(oldVertex)).to.be.true
  })

  it('should insert multiple vertices', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    expect(polygon.vertices).to.equal(4)

    var v1 = Vertex.createIntersection(0, 0.7, 0.3)
    var v2 = Vertex.createIntersection(0, 0.5, 0.5)
    var v3 = Vertex.createIntersection(0, 0.1, 0.9)
    var subsequentVertex = polygon.first
    var previousVertex = polygon.first.prev
    polygon.insertVertex(v1, previousVertex, subsequentVertex)
    polygon.insertVertex(v2, previousVertex, subsequentVertex)
    polygon.insertVertex(v3, previousVertex, subsequentVertex)

    expect(polygon.vertices).to.equal(7)
    expect(polygon.first.prev.equals(v3)).to.be.true
    expect(polygon.first.prev.prev.equals(v2)).to.be.true
    expect(polygon.first.prev.prev.prev.equals(v1)).to.be.true
    expect(polygon.first.prev.prev.prev.prev.equals(previousVertex)).to.be.true
  })

  it('should insert multiple vertices in reversed order', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    expect(polygon.vertices).to.equal(4)

    var v1 = Vertex.createIntersection(0, 0.7, 0.3)
    var v2 = Vertex.createIntersection(0, 0.5, 0.5)
    var v3 = Vertex.createIntersection(0, 0.1, 0.9)
    var subsequentVertex = polygon.first
    var previousVertex = polygon.first.prev
    polygon.insertVertex(v3, previousVertex, subsequentVertex)
    polygon.insertVertex(v2, previousVertex, subsequentVertex)
    polygon.insertVertex(v1, previousVertex, subsequentVertex)

    expect(polygon.vertices).to.equal(7)
    expect(polygon.first.prev.equals(v3)).to.be.true
    expect(polygon.first.prev.prev.equals(v2)).to.be.true
    expect(polygon.first.prev.prev.prev.equals(v1)).to.be.true
    expect(polygon.first.prev.prev.prev.prev.equals(previousVertex)).to.be.true
  })

  it('should give next non-intersection point', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    var v1 = Vertex.createIntersection(0, 0.7, 0.3)
    var v2 = Vertex.createIntersection(0, 0.5, 0.5)
    var v3 = Vertex.createIntersection(0, 0.1, 0.9)
    var subsequentVertex = polygon.first
    var previousVertex = polygon.first.prev
    polygon.insertVertex(v3, previousVertex, subsequentVertex)
    polygon.insertVertex(v2, previousVertex, subsequentVertex)
    polygon.insertVertex(v1, previousVertex, subsequentVertex)

    expect(polygon.getNext(v1).equals(polygon.first)).to.be.true
    expect(polygon.getNext(v2).equals(polygon.first)).to.be.true
    expect(polygon.getNext(v3).equals(polygon.first)).to.be.true
  })

  it('should give the first unvisited intersection', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    var v1 = Vertex.createIntersection(0, 0.7, 0.3)
    var v2 = Vertex.createIntersection(0, 0.5, 0.5)
    var v3 = Vertex.createIntersection(0, 0.1, 0.9)
    var subsequentVertex = polygon.first
    var previousVertex = polygon.first.prev
    polygon.insertVertex(v3, previousVertex, subsequentVertex)
    polygon.insertVertex(v2, previousVertex, subsequentVertex)
    polygon.insertVertex(v1, previousVertex, subsequentVertex)

    expect(polygon.getFirstIntersection().equals(v1)).to.be.true
    v1.visit()
    expect(polygon.getFirstIntersection().equals(v2)).to.be.true
    v2.visit()
    expect(polygon.getFirstIntersection().equals(v3)).to.be.true
    v3.visit()
    expect(polygon.getFirstIntersection().equals(polygon.first)).to.be.true


  })

})
