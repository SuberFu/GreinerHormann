var chai = require('chai')
var expect = chai.expect
var util = require('../src/util')

describe('util', function() {

  describe('#equal', function() {
    it('should equal in epsilon environment', function() {
      expect(util.equal(5, 6, 2)).to.be.true
      expect(util.equal(5, 6, 1)).to.be.true
    })

    it('should not equal outside epsilon environment', function() {
      expect(util.equal(5, 6, 0)).to.be.false
    })
  })

  describe('#between', function() {
    it('should detect value in interval', function() {
      expect(util.between(3, 2, 4)).to.be.true
      expect(util.between(3, 4, 2)).to.be.true
      expect(util.between(3, 3, 3)).to.be.true
      expect(util.between(3, 4, 3)).to.be.true
    })

    it('should detect value outside interval', function() {
      expect(util.between(5, 3, 4)).to.be.false
    })
  })

  var p1 = {x: 0, y: 0}
  var p2 = {x: 2, y: 2}
  var p3 = {x: 1, y: 1}
  var p4 = {x: 0, y: 2}
  var p5 = {x: 2, y: 0}
  var p6 = {x: 1, y: 0}
  var p7 = {x: 0, y: 1}

  describe('#pointOnLine', function() {

    it('should detect point on arbitrary lines', function() {
      expect(util.pointOnLine(p1, p2, p3)).to.be.true
      expect(util.pointOnLine(p1, p2, p2)).to.be.true
      expect(util.pointOnLine(p4, p5, p3)).to.be.true
      expect(util.pointOnLine(p5, p4, p3)).to.be.true
    })

    it('should detect point off arbitrary lines', function() {
      expect(util.pointOnLine(p4, p3, p5)).to.be.false
      expect(util.pointOnLine(p4, p5, p1)).to.be.false
      expect(util.pointOnLine(
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1}
      )).to.be.false
      expect(util.pointOnLine(
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0}
      )).to.be.false
      expect(util.pointOnLine(
        {x: 1, y: 1},
        {x: 1, y: 0},
        {x: 0, y: 0}
      )).to.be.false
      expect(util.pointOnLine(
        {x: 1, y: 1},
        {x: 1, y: 0},
        {x: 0, y: 1}
      )).to.be.false
    })

    it('should detect point on horizontal lines', function() {
      expect(util.pointOnLine(p1, p5, p6)).to.be.true
      expect(util.pointOnLine(p1, p5, p5)).to.be.true
    })

    it('should detect point off horizontal lines', function() {
      expect(util.pointOnLine(p1, p5, {x:3, y:0})).to.be.false
    })

    it('should detect point on vertical lines', function() {
      expect(util.pointOnLine(p1, p4, p7)).to.be.true
      expect(util.pointOnLine(p1, p4, p4)).to.be.true
    })

    it('should detect point off vertical lines', function() {
      expect(util.pointOnLine(p1, p4, {x:0, y:3})).to.be.false
    })

    it('should not detect parallel lines on point', function() {
      expect(util.pointOnLine(
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1}
      )).to.be.false
    })
  })

  describe('#pointOnLineDistance', function() {
    it('should compute position for horizontal line', function() {
      expect(util.pointOnLineDistance(p1, p5, p6)).to.equal(0.5)
    })

    it('should compute position for vertical line', function() {
      expect(util.pointOnLineDistance(p1, p4, p7)).to.equal(0.5)
    })

    it('should compute position for arbitrary lines', function() {
      expect(util.pointOnLineDistance(p1, p2, p3)).to.equal(0.5)
    })

    it('should compute position when endpoints are equal', function() {
      // horizontal
      expect(util.pointOnLineDistance(p1, p5, p1)).to.equal(0)
      expect(util.pointOnLineDistance(p1, p5, p5)).to.equal(1)

      // vertical
      expect(util.pointOnLineDistance(p1, p4, p1)).to.equal(0)
      expect(util.pointOnLineDistance(p1, p4, p4)).to.equal(1)

      // arbitrary
      expect(util.pointOnLineDistance(p1, p2, p1)).to.equal(0)
      expect(util.pointOnLineDistance(p1, p2, p2)).to.equal(1)
    })
  })

})
