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

      expect(true).to.be.false
    })

  })


  describe('#on-point', function() {



  })

})
