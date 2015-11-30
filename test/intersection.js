var chai = require('chai')
var expect = chai.expect
var Intersection = require('../src/intersection')


describe('Intersection Object', function() {
  it('should compute intersection point for non-parallel intersecting lines', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 1},
      {x: 1, y: 0}
    )

    expect(i.isValid()).to.be.true
    expect(i._isDegenerated).to.be.false
    expect(i.x).to.equal(0.5)
    expect(i.y).to.equal(0.5)
    expect(i.toSource).to.equal(0.5)
    expect(i.toClip).to.equal(0.5)
  })

  it('should compute invalid intersection for parallel lines', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 1, y: 0}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.false
  })

  it('should compute invalid intersection for non-parallel, non-intersecting lines', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 2, y: 0.5},
      {x: 4, y: 0.5}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.false
  })

  it('should compute invalid intersection for degenerated case', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 2}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.true
  })

  it('should classify valid intersection between two identical lines with offset as degenerated', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 2, y: 0},
      {x: 1, y: 0},
      {x: 3, y: 0}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.true
    expect(i._onLine.s1).to.be.false
    expect(i._onLine.s2).to.be.true
    expect(i._onLine.c1).to.be.true
    expect(i._onLine.c2).to.be.false
    expect(i.toClip).to.equal(0.5)
    expect(i.toSource).to.equal(1)
  })

  it('should classify an intersection between to identical lines with more than one intersection point as inherent lines', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      {x: 1, y: 1}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.true

    var i2 = new Intersection(
      {x: 0, y: 0},
      {x: 2, y: 2},
      {x: 0.5, y: 0.5},
      {x: 1, y: 1}
    )

    expect(i2.isValid()).to.be.false
    expect(i2._isDegenerated).to.be.true
  })


  it('should set boolean flags for on-line intersections correctly', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 2, y: 2},
      {x: 3, y: 4},
      {x: 0.5, y: 0.5}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.true
    expect(i._onLine.s1).to.be.false
    expect(i._onLine.s2).to.be.false
    expect(i._onLine.c1).to.be.false
    expect(i._onLine.c2).to.be.true
  })

  describe('should set flags for two equal points', function() {

    it('s1 = c1', function() {
      var i = new Intersection(
        {x: 0, y: 0},
        {x: 2, y: 2},
        {x: 0, y: 0},
        {x: 3, y: 4}
      )

      expect(i.isValid()).to.be.false
      expect(i._isDegenerated).to.be.true
      expect(i._onLine.s1).to.be.true
      expect(i._onLine.s2).to.be.false
      expect(i._onLine.c1).to.be.true
      expect(i._onLine.c2).to.be.false
    })

    it('s1 = c2', function() {
      var i = new Intersection(
        {x: 0.5, y: 0.5},
        {x: 2, y: 2},
        {x: 3, y: 4},
        {x: 0.5, y: 0.5}
      )

      expect(i.isValid()).to.be.false
      expect(i._isDegenerated).to.be.true
      expect(i._onLine.s1).to.be.true
      expect(i._onLine.s2).to.be.false
      expect(i._onLine.c1).to.be.false
      expect(i._onLine.c2).to.be.true
    })


    it('s2 = c1', function() {
      var i = new Intersection(
        {x: 2, y: 2},
        {x: 5, y: 5},
        {x: 5, y: 5},
        {x: 3, y: 4}
      )

      expect(i.isValid()).to.be.false
      expect(i._isDegenerated).to.be.true
      expect(i._onLine.s1).to.be.false
      expect(i._onLine.s2).to.be.true
      expect(i._onLine.c1).to.be.true
      expect(i._onLine.c2).to.be.false
    })

    it('s2 = c2', function() {
      var i = new Intersection(
        {x: 2, y: 2},
        {x: 7, y: 25},
        {x: 3, y: 4},
        {x: 7, y: 25}
      )

      expect(i.isValid()).to.be.false
      expect(i._isDegenerated).to.be.true
      expect(i._onLine.s1).to.be.false
      expect(i._onLine.s2).to.be.true
      expect(i._onLine.c1).to.be.false
      expect(i._onLine.c2).to.be.true
    })

  })

  describe('should set flags for three on points on line', function() {

    it('s1 = c1 to s2', function() {
      var i = new Intersection(
        {x: 1, y: 1},
        {x: 2, y: 2},
        {x: 1, y: 1},
        {x: 4, y: 4}
      )

      expect(i.isValid()).to.be.false
      expect(i._isDegenerated).to.be.true
      expect(i._onLine.s1).to.be.true
      expect(i._onLine.s2).to.be.true
      expect(i._onLine.c1).to.be.true
      expect(i._onLine.c2).to.be.false
    })

    it('s1 = c2 to s2', function() {
      var i = new Intersection(
        {x: 2, y: 1},
        {x: 2, y: 4},
        {x: 2, y: 6},
        {x: 2, y: 1}
      )

      expect(i.isValid()).to.be.false
      expect(i._isDegenerated).to.be.true
      expect(i._onLine.s1).to.be.true
      expect(i._onLine.s2).to.be.true
      expect(i._onLine.c1).to.be.false
      expect(i._onLine.c2).to.be.true
    })

    it('c1 = s1 to c2', function() {
      var i = new Intersection(
        {x: 2, y: 6},
        {x: 2, y: 0},
        {x: 2, y: 6},
        {x: 2, y: 1}
      )

      expect(i.isValid()).to.be.false
      expect(i._isDegenerated).to.be.true
      expect(i._onLine.s1).to.be.true
      expect(i._onLine.s2).to.be.false
      expect(i._onLine.c1).to.be.true
      expect(i._onLine.c2).to.be.true
    })

  })

  it('should set flags for identical lines', function() {
    var i = new Intersection(
      {x: 2, y: 1},
      {x: 2, y: 4},
      {x: 2, y: 1},
      {x: 2, y: 4}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.true
    expect(i._onLine.s1).to.be.true
    expect(i._onLine.s2).to.be.true
    expect(i._onLine.c1).to.be.true
    expect(i._onLine.c2).to.be.true
  })

  it('should set flags for inherent parallel lines', function() {
    var i = new Intersection(
      {x: 2, y: 1},
      {x: 2, y: 4},
      {x: 2, y: 2},
      {x: 2, y: 3}
    )

    expect(i.isValid()).to.be.false
    expect(i._isDegenerated).to.be.true
    expect(i._onLine.s1).to.be.false
    expect(i._onLine.s2).to.be.false
    expect(i._onLine.c1).to.be.true
    expect(i._onLine.c2).to.be.true
  })

  it('should set flags for crossing lines', function() {
    var i = new Intersection(
      {x: 4, y: 1},
      {x: 1, y: 1},
      {x: 1, y: 2},
      {x: 2, y: 0}
    )

    expect(i.isValid()).to.be.true
    expect(i._isDegenerated).to.be.false
    expect(i._onLine.s1).to.be.false
    expect(i._onLine.s2).to.be.false
    expect(i._onLine.c1).to.be.false
    expect(i._onLine.c2).to.be.false
    expect(i.x).to.equal(1.5)
    expect(i.y).to.equal(1)
    expect(i.toSource).to.equal(0.8333333333333334)
    expect(i.toClip).to.equal(0.5)
  })

})
