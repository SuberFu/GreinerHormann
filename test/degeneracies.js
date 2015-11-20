var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')
var helpers = require('./helpers.js')
var wrapIntoObject = helpers.wrapIntoObject

describe('Degeneracies Clipping', function() {

  var overlapping = []
  beforeEach(function() {
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
  })

  describe('#equal', function() {



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



  })

})
