var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')
var helpers = require('./helpers.js')
var wrapIntoObject = helpers.wrapIntoObject

describe('Degeneracies Clipping', function() {

  var overlapping = []
  var equal = { small: null, big: null}
  var onPoint = { bigbase: null, smallbase: null,
    topTriangle: null, bottomTriangle: null}

  beforeEach(function() {

    equal.big = new Polygon([
      [0,0],
      [2,0],
      [2,1],
      [0,1]
    ])

    equal.small = new Polygon([
      [1,0],
      [2,0],
      [2,1],
      [1,1]
    ])

    overlapping = [
      new Polygon([
        [-2, -1],
        [1, -1],
        [1, 1],
        [-2, 1]
      ]),
      new Polygon([
        [-1, -1],
        [2, -1],
        [2, 1],
        [-1, 1]
      ])
    ]

    onPoint.bigbase = new Polygon([
      [0,0],
      [4,0],
      [4,4],
      [0,4]
    ])

    onPoint.smallbase = new Polygon([
      [0,0],
      [4,0],
      [4,1],
      [0,1]
    ])

    onPoint.topTriangle = new Polygon([
      [2,0],
      [3,2],
      [1,2]
    ])

    onPoint.bottomTriangle = new Polygon([
      [2,0],
      [1,-1],
      [3,-1]
    ])
  })


  describe('#equal', function() {
    it('should detect the smaller polygon as intersection - big clip small', function() {
      var result = equal.big.clip(equal.small, true, true)
      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(equal.small.getPoints())
    })

    it('should detect the smaller polygon as intersection - small clip big', function() {
      var result = equal.small.clip(equal.big, true, true)
      expect(result.length).to.equal(1)

      // TODO: somehow order is not preserved
      equal.small.reverse()
      expect(result[0].shape).to.deep.equal(equal.small.getPoints())
    })

    it.only('should return the bigger polygon as the union result - big clip small', function() {
      var result = equal.big.clip(equal.small, false, false)
      expect(result.length).to.equal(1)

      // TODO: some how order is not preserved
      console.log(result[0].shape)
      equal.big.reverse()
      console.log(equal.big.getPoints())
      expect(result[0].shape).to.deep.equal(equal.big.getPoints())
    })

    it('should return the bigger polygon as the union result - small clip big', function() {
      var result = equal.small.clip(equal.big, false, false)
      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(equal.big.getPoints())
    })

    it('should diff the smaller polygon from the bigger one', function() {
      var result = equal.big.clip(equal.small, false, true)
      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [0,0],
        [1,0],
        [1,1],
        [0,1]
      ])
    })

    it('should diff the big polygon from the smaller one and return empty result', function() {
      var result = equal.small.clip(equal.big, false, true)
      expect(result.length).to.equal(0)
    })

  })

  describe('#overlapping', function() {

    it('should union overlapping polygons', function() {
      var result = overlapping[0].clip(
        overlapping[1],
        false,
        false
      )

      expect(result.length).to.equal(1)
      expect(result[0].shape.length).to.equal(4)
      expect(result[0].shape).to.deep.equal([
        [-2, -1],
        [2, -1],
        [2, 1],
        [-2, 1]
      ])
    })

    it('should diff overlapping polygons', function() {
      var result = overlapping[0].clip(
        overlapping[1],
        false,
        true
      )

      expect(result.length).to.equal(1)
      expect(result[0].shape.length).to.equal(4)
      expect(result[0].shape).to.deep.equal([
        [-2, -1],
        [-1, -1],
        [-1, 1],
        [-2, 1]
      ])
    })

    it('should intersect overlapping polygons', function() {
      var result = overlapping[0].clip(
        overlapping[1],
        true,
        true
      )

      expect(result.length).to.equal(1)
      expect(result[0].shape.length).to.equal(4)
      expect(result[0].shape).to.deep.equal([
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1]
      ])
    })

  })


  describe('#on-point', function() {
    it('should intersect two except for one point disjoint polygons - smallbase clip bottomTriangle', function() {
      var result = onPoint.smallbase.clip(onPoint.bottomTriangle, true, true)

      expect(result.length).to.equal(0)
    })

    it('should intersect two except for one point disjoint polygons - bottomTriangle clip smallbase', function() {
      var result = onPoint.bottomTriangle.clip(onPoint.smallbase, true, true)

      expect(result.length).to.equal(0)
    })

    it('should intersect two inherent polygons - bigbase clip topTriangle', function() {
      var result = onPoint.bigbase.clip(onPoint.topTriangle, true, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(onPoint.topTriangle.getPoints())
    })

    it('should intersect two inherent polygons - topTriangle clip bigBase', function() {
      var result = onPoint.topTriangle.clip(onPoint.bigbase, true, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(onPoint.topTriangle.getPoints())
    })

    it('should intersect two on-point polygons - smallbase clip topTriangle', function() {
      var result = onPoint.smallbase.clip(onPoint.topTriangle, true, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [  2, 0],
        [1.5, 1],
        [2.5, 1]
      ])
    })

    it('should intersect two on-point polygons - topTriangle clip smallbase', function() {
      var result = onPoint.topTriangle.clip(onPoint.smallbase, true, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [  2, 0],
        [1.5, 1],
        [2.5, 1]
      ])
    })



    it('should union two inherent polygons - bigbase clip topTriangle', function() {
      var result = onPoint.bigbase.clip(onPoint.topTriangle, false, false)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(onPoint.bigbase.getPoints())
    })

    it('should union two inherent polygons - topTriangle clip bigbase', function() {
      var result = onPoint.topTriangle.clip(onPoint.bigbase, false, false)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(onPoint.bigBase.getPoints())
    })

    it('should union two polygons - smallbase clip topTriangle', function() {
      var result = onPoint.smallbase.clip(onPoint.topTriangle, false, false)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [  0, 0],
        [  4, 0],
        [  4, 1],
        [2.5, 1],
        [  3, 2],
        [  1, 2],
        [1.5, 1],
        [  0, 1]
      ])
    })

    it('should union two polygons - topTriangle clip smallbase', function() {
      var result = onPoint.topTriangle.clip(onPoint.smallbase, false, false)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [  0, 0],
        [  4, 0],
        [  4, 1],
        [2.5, 1],
        [  3, 2],
        [  1, 2],
        [1.5, 1],
        [  0, 1]
      ])
    })

    it('should union two except for one point disjoint polygons - smallbase clip bottomTriangle', function() {
      var result = onPoint.smallbase.clip(onPoint.bottomTriangle, false, false)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [0,  0],
        [2,  0],
        [1, -1],
        [3, -1],
        [2,  0],
        [4,  0],
        [4,  1],
        [0,  1]
      ])
    })

    it('should union two except for one point disjoint polygons - bottomTriangle clip smallbase', function() {
      var result = onPoint.bottomTriangle.clip(onPoint.smallbase, false, false)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [0,  0],
        [2,  0],
        [1, -1],
        [3, -1],
        [2,  0],
        [4,  0],
        [4,  1],
        [0,  1]
      ])
    })



    it('should diff two inherent polygons - bigbase clip topTriangle', function() {
      var result = onPoint.bigbase.clip(onPoint.topTriangle, false, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [0,0],
        [2,0],
        [1,2],
        [3,2],
        [2,0],
        [4,0],
        [4,4],
        [0,4]
      ])
    })

    it('should diff two inherent polygons - topTriangle clip bigbase', function() {
      var result = onPoint.topTriangle.clip(onPoint.bigbase, false, true)

      expect(result.length).to.equal(0)
    })

    it('should diff two polygons - smallbase clip topTriangle', function() {
      var result = onPoint.smallbase.clip(onPoint.topTriangle, false, true)

      expect(result.length).to.equal(2)
      expect(result[0].shape).to.deep.equal([
        [  0, 0],
        [  2, 0],
        [1.5, 1],
        [  0, 1]
      ])
      expect(result[1].shape).to.deep.equal([
        [  2, 0],
        [  4, 0],
        [  4, 1],
        [2.5, 1]
      ])
    })

    it('should diff two polygons - topTriangle clip smallbase', function() {
      var result = onPoint.topTriangle.clip(onPoint.smallbase, false, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal([
        [1.5, 1],
        [2.5, 1],
        [  3, 2],
        [  1, 2]
      ])
    })

    it('should diff except for one point disjunct polygons - smallbase clip bottomTriangle', function() {
      var result = onPoint.smallbase.clip(onPoint.bottomTriangle, false, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(onPoint.smallbase.getPoints())
    })

    it('should diff except for one point disjunct polygons - bottomTriangle clip smallbase', function() {
      var result = onPoint.bottomTriangle.clip(onPoint.smallbase, false, true)

      expect(result.length).to.equal(1)
      expect(result[0].shape).to.deep.equal(onPoint.bottomTriangle.getPoints())
    })


  })

})
