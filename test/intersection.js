var chai = require('chai')
var expect = chai.expect
var Intersection = require('../src/intersection')


describe('Intersection', function() {
  it('should compute intersection point for non-parallel intersecting lines', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 1},
      {x: 1, y: 0}
    )

    expect(i.isValid()).to.be.true
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
  })

  it('should compute invalid intersection for non-parallel, non-intersecting lines', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 2, y: 0.5},
      {x: 4, y: 0.5}
    )

    expect(i.isValid()).to.be.false
  })

  it('should compute invalid intersection for degenerated case', function() {
    var i = new Intersection(
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 1, y: 1},
      {x: 2, y: 2}
    )

    console.log(i)
    expect(i.isValid()).to.be.false
    expect(i.isDegenerated()).to.be.true
  })
})
