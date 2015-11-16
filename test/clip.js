var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')


describe('clip', function() {

  var disjoint = []
  var inherent = { in: null, out: null }
  var crossing = []
  beforeEach(function() {
    // setup disjoint polygons
    disjoint[0] = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])
    disjoint[1] = new Polygon([
      [5,0],
      [6,0],
      [6,1],
      [5,1]
    ])

    // setup inherent polygons
    inherent.in = new Polygon([
      [0.25,0.25],
      [0.75,0.25],
      [0.75,0.75],
      [0.25,0.75]
    ])
    inherent.out = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])

    // setup crossing rectangles
    crossing[0] = new Polygon([
      [-2,-1],
      [2,-1],
      [2,1],
      [-2,1]
    ])
    crossing[1] = new Polygon([
      [-1,-2],
      [1,-2],
      [1,2],
      [-1,2]
    ])
  })


  // ==== DISJOINT ====

  it('should find no intersection between two disjoint polygons', function() {
    var result = disjoint[0].clip(disjoint[1], true, true)

    expect(result).to.be.null
  })

  it('should find no union of two disjoint polygons', function() {
    var result = disjoint[0].clip(disjoint[1], false, false)

    expect(result).to.be.null
  })

  it('should diff two disjoint polygons', function() {
    var result = disjoint[0].clip(disjoint[1], false, true)

    expect(result).to.not.be.null
  })


  // ==== INHERENT ====

  it('should intersect two inherent polygons - out clip in', function() {
    var result = inherent.out.clip(inherent.in, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.getPoints())
  })

  it('should intersect two inherent polygons - in clip out', function() {
    var result = inherent.in.clip(inherent.out, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.getPoints())
  })

  it('should union two inherent polygons - out clip in', function() {
    var result = inherent.out.clip(inherent.in, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.getPoints())
  })

  it('should union two inherent polygons - in clip out', function() {
    var result = inherent.in.clip(inherent.out, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.getPoints())
  })


  // ==== CROSSING ====

  it('should union two crossing polygons', function() {
    var result = crossing[0].clip(crossing[1], false, false)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(12) // fails because of doubled first and last point
    expect(result[0]).to.deep.equal([
      [-1,-1],
      [-2,-1],
      [-2,1],
      [-1,1],
      [-1,2],
      [1,2],
      [1,1],
      [2,1],
      [2,-1],
      [1,-1],
      [1,-2],
      [-1,-2],
      [-1,-1]
    ])

  })

})
