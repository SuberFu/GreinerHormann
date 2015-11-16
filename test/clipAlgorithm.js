var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')

describe('clipAlgorithm', function() {
  it('should intersect two disjoint polygons', function() {
    var polygon1 = new Polygon([
      [0,0],
      [1,0],
      [1,1],
      [0,1]
    ])
    var polygon2 = new Polygon([
      [5,0],
      [6,0],
      [6,1],
      [5,1]
    ])

    result = polygon1.clip(polygon2, true, true)

    expect(result == null).to.be.true
  })
})
