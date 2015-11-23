var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')

function testOnPolygon(polygon, testResult, testFunction) {
  var vertex = polygon.first
  var index = 0
  do {
    if (testFunction(vertex, testResult[index])) {
      index++
    }
    vertex = vertex.next
  } while (vertex != polygon.first)
}

describe('Labelling Phase', function() {
  var polygons = null
  beforeEach(function() {
    polygons = [
      new Polygon([
        [0, 0],
        [4, 0],
        [4, 2],
        [0, 2]
      ]),
      new Polygon([
        [1, -1],
        [3, -1],
        [3, 3],
        [1, 3]
      ])
    ]
  })

  it('should set relative positions correctly before labelling', function() {
    polygons[0].findIntersections(polygons[1])
    polygons[0].setRelativePositions(polygons[1])
    polygons[1].setRelativePositions(polygons[0])

    var testResults = [
      'out',
      'on',
      'on',
      'out',
      'out',
      'on',
      'on',
      'out'
    ]
    var testResults1 = [
      'out',
      'out',
      'on',
      'on',
      'out',
      'out',
      'on',
      'on'
    ]

    testOnPolygon(
      polygons[0],
      testResults,
      function(vertex, testResult) {
        expect(vertex._relativePosition).to.equal(testResult)
        return true
      }
    )
    testOnPolygon(
      polygons[1],
      testResults1,
      function(vertex, testResult) {
        expect(vertex._relativePosition).to.equal(testResult)
        return true
      }
    )
  })

  it('should contain correct intersections for labelling', function() {
    polygons[0].findIntersections(polygons[1])
    var testResults = [
      {x: 1, y: 0},
      {x: 3, y: 0},
      {x: 3, y: 2},
      {x: 1, y: 2}
    ]

    var testResults1 = [
      {x: 3, y: 0},
      {x: 3, y: 2},
      {x: 1, y: 2},
      {x: 1, y: 0}
    ]

    testOnPolygon(
      polygons[0],
      testResults,
      function(vertex, testResult) {
        if (vertex._isIntersection) {
          expect(vertex.equals(testResult)).to.be.true
          return true
        }
        return false
      }
    )
    testOnPolygon(
      polygons[1],
      testResults1,
      function(vertex, testResult) {
        if (vertex._isIntersection) {
          expect(vertex.equals(testResult)).to.be.true
          return true
        }
        return false
      }
    )
  })

  it('should label all nodes as entry before labbeling phase', function() {
    polygons[0].findIntersections(polygons[1])

    testOnPolygon(
      polygons[0],
      [],
      function(vertex, testResult) {
        expect(vertex._isEntry).to.be.true
        return false
      }
    )
    testOnPolygon(
      polygons[1],
      [],
      function(vertex, testResult) {
        expect(vertex._isEntry).to.be.true
        return false
      }
    )

  })

  it('should label intersections correctly', function() {
    var result = polygons[0].clip(polygons[1], true, true)
    var testResults = [
      true,
      false,
      true,
      false
    ]

    testOnPolygon(
      polygons[0],
      testResults,
      function(vertex, testResult) {
        if (vertex._isIntersection) {
          console.log(vertex.x, vertex.y, vertex._isEntry, 't', testResult)
          expect(vertex._isEntry).to.equal(testResult)
          return true
        }
        return false
      }
    )
  })
})
