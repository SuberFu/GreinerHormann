var chai = require('chai')
var expect = chai.expect
var Vertex = require('../src/vertex')
var Polygon = require('../src/polygon')

describe('Vertex', function() {

  it('should create a vertex from x,y', function() {
    var v = new Vertex(3,5)
    expect(v.x).to.equal(3)
    expect(v.y).to.equal(5)
  })

  it('should create a vertex from [x,y]', function() {
    var v = new Vertex([3,5])
    expect(v.x).to.equal(3)
    expect(v.y).to.equal(5)
  })

  it('should create a vertex from {x,y}', function() {
    var v = new Vertex({x:3, y:5})
    expect(v.x).to.equal(3)
    expect(v.y).to.equal(5)
  })

  it('should create a non intersection vertex', function() {
    var v = new Vertex(3,5)

    expect(v._distance).to.equal(0)
    expect(v._isIntersection).to.be.false
    expect(v._isEntry).to.be.true
  })

  it('should create an intersection vertex', function() {
    var v = Vertex.createIntersection(3,5,10)

    expect(v.x).to.equal(3)
    expect(v.y).to.equal(5)
    expect(v._distance).to.equal(10)
    expect(v._isIntersection).to.be.true
    expect(v._isEntry).to.be.false
  })

  it('should detect two vertices as unequal', function() {
    var v1 = new Vertex(3,5)
    var v2 = new Vertex(4,5)

    expect(v1.equals(v2)).to.be.false
  })

  it('should detect two vertices as equal', function() {
    var v1 = new Vertex(3,5)
    var v2 = new Vertex(3,5)

    expect(v1.equals(v2)).to.be.true
  })

  it('should mark a vertex visited', function() {
    var v1 = new Vertex(3,5)

    expect(v1._visited).to.be.false

    v1.visit()

    expect(v1._visited).to.be.true
  })

  it('should mark the corresponding/ neighbouring vertex visited', function() {
    var v1 = new Vertex(3,5)
    var v2 = new Vertex(4,5)

    // link
    v1._corresponding = v2
    v2._corresponding = v1

    expect(v2._visited).to.be.false

    v1.visit()

    expect(v2._visited).to.be.true
  })

  it('should detect vertex inside', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    var v = new Vertex(0.5,0.5)

    expect(v.isInside(polygon)).to.be.true
  })

  it('should detect vertex outside', function() {
    var polygon = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    var v = new Vertex(2,0.5)

    expect(v.isInside(polygon)).to.be.false
  })
})
