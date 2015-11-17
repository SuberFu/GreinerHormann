var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')


describe('clip', function() {

  var disjoint = []
  var inherent = { in: null, out: null }
  var crossing = []
  beforeEach(function() {
    // setup disjoint polygons
    disjoint[0] = {
      cw: new Polygon([
        [0,0],
        [1,0],
        [1,1],
        [0,1]
      ]),
      ccw: new Polygon([
        [0,0],
        [0,1],
        [1,1],
        [1,0],
      ])
    }

    disjoint[1] = {
      cw: new Polygon([
        [5,0],
        [6,0],
        [6,1],
        [5,1]
      ]),
      ccw: new Polygon([
        [5,0],
        [5,1],
        [6,1],
        [6,0]
      ])
    }

    // setup inherent polygons
    inherent.in = {
      cw: new Polygon([
        [0.25,0.25],
        [0.75,0.25],
        [0.75,0.75],
        [0.25,0.75]
      ]),
      ccw: new Polygon([
        [0.25,0.25],
        [0.25,0.75],
        [0.75,0.75],
        [0.75,0.25]
      ])
    }

    inherent.out = {
      cw: new Polygon([
        [0,0],
        [1,0],
        [1,1],
        [0,1]
      ]),
      ccw: new Polygon([
        [0,0],
        [0,1],
        [1,1],
        [1,0]
      ])
    }

    // setup crossing rectangles
    crossing[0] = {
      cw: new Polygon([
        [-2,-1],
        [2,-1],
        [2,1],
        [-2,1]
      ]),
      ccw: new Polygon([
        [-2,-1],
        [-2,1],
        [2,1],
        [2,-1]
      ])
    }

    crossing[1] = {
      cw: new Polygon([
        [-1,-2],
        [1,-2],
        [1,2],
        [-1,2]
      ]),
      ccw: new Polygon([
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,-2]
      ])
    }
  })


  // ==== DISJOINT ====

  it('should find no intersection between two disjoint polygons - cw, cw', function() {
    var result = disjoint[0].cw.clip(disjoint[1].cw, true, true)

    expect(result).to.be.null
  })

  it('should find no intersection between two disjoint polygons - cw, ccw', function() {
    var result = disjoint[0].cw.clip(disjoint[1].ccw, true, true)

    expect(result).to.be.null
  })

  it('should find no intersection between two disjoint polygons - ccw, cw', function() {
    var result = disjoint[0].ccw.clip(disjoint[1].cw, true, true)

    expect(result).to.be.null
  })

  it('should find no intersection between two disjoint polygons - ccw, ccw', function() {
    var result = disjoint[0].ccw.clip(disjoint[1].ccw, true, true)

    expect(result).to.be.null
  })



  it('should find no union of two disjoint polygons - cw, cw', function() {
    var result = disjoint[0].cw.clip(disjoint[1].cw, false, false)

    expect(result).to.be.null
  })

  it('should find no union of two disjoint polygons - cw, ccw', function() {
    var result = disjoint[0].cw.clip(disjoint[1].ccw, false, false)

    expect(result).to.be.null
  })

  it('should find no union of two disjoint polygons - ccw, cw', function() {
    var result = disjoint[0].ccw.clip(disjoint[1].cw, false, false)

    expect(result).to.be.null
  })

  it('should find no union of two disjoint polygons - ccw, ccw', function() {
    var result = disjoint[0].ccw.clip(disjoint[1].ccw, false, false)

    expect(result).to.be.null
  })



  it('should diff two disjoint polygons - cw, cw', function() {
    var result = disjoint[0].cw.clip(disjoint[1].cw, false, true)

    expect(result).to.not.be.null
  })

  it('should diff two disjoint polygons - cw, ccw', function() {
    var result = disjoint[0].cw.clip(disjoint[1].ccw, false, true)

    expect(result).to.not.be.null
  })

  it('should diff two disjoint polygons - ccw, cw', function() {
    var result = disjoint[0].ccw.clip(disjoint[1].cw, false, true)

    expect(result).to.not.be.null
  })

  it('should diff two disjoint polygons - ccw, ccw', function() {
    var result = disjoint[0].ccw.clip(disjoint[1].ccw, false, true)

    expect(result).to.not.be.null
  })


  // ==== INHERENT ====

  it('should intersect two inherent polygons - cw out clip cw in', function() {
    var result = inherent.out.cw.clip(inherent.in.cw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.cw.getPoints())
  })

  it('should intersect two inherent polygons - cw out clip ccw in', function() {
    var result = inherent.out.cw.clip(inherent.in.ccw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.ccw.getPoints())
  })

  it('should intersect two inherent polygons - ccw out clip cw in', function() {
    var result = inherent.out.ccw.clip(inherent.in.cw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.cw.getPoints())
  })

  it('should intersect two inherent polygons - ccw out clip ccw in', function() {
    var result = inherent.out.ccw.clip(inherent.in.ccw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.ccw.getPoints())
  })



  it('should intersect two inherent polygons - cw in clip cw out', function() {
    var result = inherent.in.cw.clip(inherent.out.cw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.cw.getPoints())
  })

  it('should intersect two inherent polygons - cc in clip ccw out', function() {
    var result = inherent.in.cw.clip(inherent.out.ccw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.cw.getPoints())
  })

  it('should intersect two inherent polygons - ccw in clip cw out', function() {
    var result = inherent.in.ccw.clip(inherent.out.cw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.ccw.getPoints())
  })

  it('should intersect two inherent polygons - ccw in clip ccw out', function() {
    var result = inherent.in.ccw.clip(inherent.out.ccw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.in.ccw.getPoints())
  })



  it('should union two inherent polygons - cw out clip cw in', function() {
    var result = inherent.out.cw.clip(inherent.in.cw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.cw.getPoints())
  })

  it('should union two inherent polygons - cw out clip ccw in', function() {
    var result = inherent.out.cw.clip(inherent.in.ccw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.cw.getPoints())
  })

  it('should union two inherent polygons - ccw out clip cw in', function() {
    var result = inherent.out.ccw.clip(inherent.in.cw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.ccw.getPoints())
  })

  it('should union two inherent polygons - ccw out clip ccw in', function() {
    var result = inherent.out.ccw.clip(inherent.in.ccw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.ccw.getPoints())
  })



  it('should union two inherent polygons - cw in clip cw out', function() {
    var result = inherent.in.cw.clip(inherent.out.cw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.cw.getPoints())
  })

  it('should union two inherent polygons - cw in clip ccw out', function() {
    var result = inherent.in.cw.clip(inherent.out.ccw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.ccw.getPoints())
  })

  it('should union two inherent polygons - ccw in clip cw out', function() {
    var result = inherent.in.ccw.clip(inherent.out.cw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.cw.getPoints())
  })

  it('should union two inherent polygons - ccw in clip ccw out', function() {
    var result = inherent.in.ccw.clip(inherent.out.ccw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0]).to.deep.equal(inherent.out.ccw.getPoints())
  })


  // ==== CROSSING ====

  it('should union two crossing polygons', function() {
    var result = crossing[0].cw.clip(crossing[1].cw, false, false)

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
