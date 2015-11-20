var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')

describe('Degeneracies Clipping', function() {

  beforeEach(function() {
    var equal = { small: null, big: null}

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
  }


  describe('#equal', function() {
    it('should detect the smaller polygon as intersection - big clip small', function() {
      var result = equal.big.clip(equal.small, true, true)
      expect(result.length).to.equal(1)
      expect(result[1]).to.deep.equal(equal.small.getPoints())
    })

    it('should detect the smaller polygon as intersection - small clip big', function() {
      var result = equal.small.clip(equal.big, true, true)
      expect(result.length).to.equal(1)
      expect(result[1]).to.deep.equal(equal.small.getPoints())
    })

    it('should return the bigger polygon as the union result - big clip small', function() {
      var result = equal.big.clip(equal.small, false, false)
      expect(result.length).to.equal(1)
      expect(result[1]).to.deep.equal(equal.big.getPoints())
    })

    it('should return the bigger polygon as the union result - small clip big', function() {
      var result = equal.small.clip(equal.big, false, false)
      expect(result.length).to.equal(1)
      expect(result[1]).to.deep.equal(equal.big.getPoints())
    })

    it('should diff the smaller polygon from the bigger one', function() {
      var result = equal.big.clip(equal.small, false, true)
      expect(result.length).to.equal(1)
      expect(result[1]).to.deep.equal([
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



  })


  describe('#on-point', function() {



  })

})
