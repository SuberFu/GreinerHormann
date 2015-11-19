var chai = require('chai')
var expect = chai.expect
var Polygon = require('../src/polygon')

function wrapIntoObject(shape, holes) {
  if (undefined === holes) {
    holes = []
  }

  return {
    shape: shape,
    holes: holes
  }
}


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

  describe('#disjoint', function() {

    // === INTERSECTION ===

    describe('#intersection', function() {

      function intersect(windingA, windingB) {
        var resultAB = disjoint[0][windingA].clip(
          disjoint[1][windingB],
          true,
          true
        )

        var resultBA = disjoint[1][windingB].clip(
          disjoint[0][windingA],
          true,
          true
        )

        expect(resultAB).to.be.empty
        expect(resultBA).to.be.empty
      }

      it('should find no intersection between two disjoint polygons - cw, cw', function() {
        intersect('cw', 'cw')
      })

      it('should find no intersection between two disjoint polygons - cw, ccw', function() {
        intersect('cw', 'ccw')
      })

      it('should find no intersection between two disjoint polygons - ccw, cw', function() {
        intersect('ccw', 'cw')
      })

      it('should find no intersection between two disjoint polygons - ccw, ccw', function() {
        intersect('ccw', 'ccw')
      })

    })

    // === UNION ===

    describe('#union', function() {

      function union(windingA, windingB) {
        var resultAB = disjoint[0][windingA].clip(
          disjoint[1][windingB],
          false,
          false
        )

        var resultBA = disjoint[1][windingB].clip(
          disjoint[0][windingA],
          false,
          false
        )

        expect(resultAB.length).to.equal(2)
        expect(resultAB[0]).to.deep.equal({
          shape: disjoint[0][windingA].getPoints(),
          holes: []
        })
        expect(resultAB[1]).to.deep.equal({
          shape: disjoint[1][windingB].getPoints(),
          holes: []
        })

        expect(resultBA.length).to.equal(2)
        expect(resultBA[0]).to.deep.equal({
          shape: disjoint[1][windingB].getPoints(),
          holes: []
        })
        expect(resultBA[1]).to.deep.equal({
          shape: disjoint[0][windingA].getPoints(),
          holes: []
        })
      }

      it('should find union of two disjoint polygons - cw, cw', function() {
        union('cw', 'cw')
      })

      it('should find union of two disjoint polygons - cw, ccw', function() {
        union('cw', 'ccw')
      })

      it('should find union of two disjoint polygons - ccw, cw', function() {
        union('ccw', 'cw')
      })

      it('should find union of two disjoint polygons - ccw, ccw', function() {
        union('ccw', 'ccw')
      })

    })

    // === DIFF ===

    describe('#diff', function() {

      function diff(windingA, windingB) {
        var resultAB = disjoint[0][windingA].clip(
          disjoint[1][windingB],
          false,
          true
        )

        var resultBA = disjoint[1][windingB].clip(
          disjoint[0][windingA],
          false,
          true
        )

        expect(resultAB.length).to.equal(1)
        expect(resultAB[0]).to.deep.equal({
          shape: disjoint[0][windingA].getPoints(),
          holes: []
        })

        expect(resultBA.length).to.equal(1)
        expect(resultBA[0]).to.deep.equal({
          shape: disjoint[1][windingB].getPoints(),
          holes: []
        })
      }

      it('should diff two disjoint polygons - cw, cw', function() {
        diff('cw', 'cw')
      })

      it('should diff two disjoint polygons - cw, ccw', function() {
        diff('cw', 'ccw')
      })

      it('should diff two disjoint polygons - ccw, cw', function() {
        diff('ccw', 'cw')
      })

      it('should diff two disjoint polygons - ccw, ccw', function() {
        diff('ccw', 'ccw')
      })

    })

  })


  // ==== INHERENT ====

  describe('#inherent', function() {

    // === INTERSECTION ===

    describe('#intersection', function() {

      // == SOURCE CONTAINS CLIP ==

      describe('#source-contains-clip', function() {

        function intersect(outerWinding, innerWinding) {
          var result = inherent.out[outerWinding].clip(
            inherent.in[innerWinding],
            true,
            true
          )

          expect(result.length).to.equal(1)
          expect(result[0]).to.deep.equal(
            wrapIntoObject(inherent.in[innerWinding].getPoints())
          )
        }

        it('should intersect cw cw', function() {
          intersect('cw', 'cw')
        })

        it('should intersect cw ccw', function() {
          intersect('cw', 'ccw')
        })

        it('should intersect ccw cw', function() {
          intersect('ccw', 'cw')
        })

        it('should intersect ccw ccw', function() {
          intersect('ccw', 'ccw')
        })

      })

      // == CLIP CONTAINS SOURCE

      describe('#clip-contains-source', function() {

        function intersect(innerWinding, outerWinding) {
          var result = inherent.in[innerWinding].clip(
            inherent.out[outerWinding],
            true,
            true
          )

          expect(result.length).to.equal(1)
          expect(result[0]).to.deep.equal(
            wrapIntoObject(inherent.in[innerWinding].getPoints())
          )
        }

        it('should intersect cw cw', function() {
          intersect('cw', 'cw')
        })

        it('should intersect cw ccw', function() {
          intersect('cw', 'ccw')
        })

        it('should intersect ccw cw', function() {
          intersect('ccw', 'cw')
        })

        it('should intersect ccw ccw', function() {
          intersect('ccw', 'ccw')
        })

      })

    })

    // === UNION ===

    describe('#union', function() {

      // == SOURCE CONTAINS CLIP ==

      describe('#source-contains-clip', function() {

        function union(outerWinding, innerWinding) {
          var result = inherent.out[outerWinding].clip(
            inherent.in[innerWinding],
            false,
            false
          )

          expect(result.length).to.equal(1)
          expect(result[0]).to.deep.equal(
            wrapIntoObject(inherent.out[outerWinding].getPoints())
          )
        }

        it('should union two polygons cw cw into source', function() {
          union('cw', 'cw')
        })

        it('should union two polygons cw ccw into source', function() {
          union('cw', 'ccw')
        })

        it('should union two polygons ccw cw into source', function() {
          union('ccw', 'cw')
        })

        it('should union two polygons ccw ccw into source', function() {
          union('ccw', 'ccw')
        })

      })

      // == CLIP CONTAINS SOURCE ==

      describe('#clip-contains-source', function() {

        function union(innerWinding, outerWinding) {
          var result = inherent.in[innerWinding].clip(
            inherent.out[outerWinding],
            false,
            false
          )

          expect(result.length).to.equal(1)
          expect(result[0]).to.deep.equal(
            wrapIntoObject(inherent.out[outerWinding].getPoints())
          )
        }

        it('should union two polygons cw cw', function() {
          union('cw', 'cw')
        })

        it('should union two polygons cw ccw', function() {
          union('cw', 'ccw')
        })

        it('should union two polygons ccw cw', function() {
          union('ccw', 'cw')
        })

        it('should union two polygons ccw ccw', function() {
          union('ccw', 'ccw')
        })

      })
    })

    // === DIFF ===

    describe('#diff', function() {

      // == SOURCE CONTAINS CLIP ==

      describe('#source-contains-clip', function() {

        function diff(outerWinding, innerWinding) {
          var result = inherent.out[outerWinding].clip(
            inherent.in[innerWinding],
            false,
            true
          )

          expect(result.length).to.equal(1)
          expect(result[0]).to.deep.equal(
            wrapIntoObject(
              inherent.out[outerWinding].getPoints(),
              [inherent.in[innerWinding].getPoints()]
            )
          )
        }

        it('should diff two polygons cw cw', function() {
          diff('cw', 'cw')
        })

        it('should diff two polygons cw ccw', function() {
          diff('cw', 'ccw')
        })

        it('should diff two polygons ccw cw', function() {
          diff('ccw', 'cw')
        })

        it('should diff two polygons ccw ccw', function() {
          diff('ccw', 'ccw')
        })

      })

      // == CLIP CONTAINS SOURCE ==

      describe('#clip-contains-source', function() {

        function diff(innerWinding, outerWinding) {
          var result = inherent.in[innerWinding].clip(
            inherent.out[outerWinding],
            false,
            true
          )

          expect(result).to.be.empty
        }

        it('should diff two polygons cw cw', function() {
          diff('cw', 'cw')
        })

        it('should diff two polygons cw ccw', function() {
          diff('cw', 'ccw')
        })

        it('should diff two polygons ccw cw', function() {
          diff('ccw', 'cw')
        })

        it('should diff two polygons ccw ccw', function() {
          diff('ccw', 'ccw')
        })

      })

    })
  })


  // ==== CROSSING ====

  it('should intersect two crossing polygons - cw, cw', function() {
    var result = crossing[0].cw.clip(crossing[1].cw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,-1],
      [1,-1],
      [1,1],
      [-1,1]
    ])
  })

  it('should intersect two crossing polygons - cw, ccw', function() {
    var result = crossing[0].cw.clip(crossing[1].ccw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,-1],
      [1,-1],
      [1,1],
      [-1,1]
    ])
  })

  it('should intersect two crossing polygons - ccw, cw', function() {
    var result = crossing[0].ccw.clip(crossing[1].cw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,1],
      [1,1],
      [1,-1],
      [-1,-1]
    ])
  })

  it('should intersect two crossing polygons - ccw, ccw', function() {
    var result = crossing[0].ccw.clip(crossing[1].ccw, true, true)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,1],
      [1,1],
      [1,-1],
      [-1,-1]
    ])
  })



  it('should union two crossing polygons - cw, cw', function() {
    var result = crossing[0].cw.clip(crossing[1].cw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(12)
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
      [-1,-2]
    ])

  })

  it('should union two crossing polygons - cw, ccw', function() {
    var result = crossing[0].cw.clip(crossing[1].ccw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(12)
    expect(false).to.be.true    // TODO: write expected result
    // expect(result[0]).to.deep.equal([
    //   [-1,-1],
    //   [-2,-1],
    //   [-2,1],
    //   [-1,1],
    //   [-1,2],
    //   [1,2],
    //   [1,1],
    //   [2,1],
    //   [2,-1],
    //   [1,-1],
    //   [1,-2],
    //   [-1,-2]
    // ])

  })

  it('should union two crossing polygons - ccw, cw', function() {
    var result = crossing[0].ccw.clip(crossing[1].cw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(12)
    expect(result[0]).to.deep.equal([
      [-1,1],
      [-2,1],
      [-2,-1],
      [-1,-1],
      [-1,-2],
      [1,-2],
      [1,-1],
      [2,-1],
      [2,1],
      [1,1],
      [1,2],
      [-1,2]
    ])

  })

  it('should union two crossing polygons - ccw, ccw', function() {
    var result = crossing[0].ccw.clip(crossing[1].ccw, false, false)

    expect(result.length).to.equal(1)
    expect(result[0].length).to.equal(12)
    expect(result[0]).to.deep.equal([
      [-1,1],
      [-2,1],
      [-2,-1],
      [-1,-1],
      [-1,-2],
      [1,-2],
      [1,-1],
      [2,-1],
      [2,1],
      [1,1],
      [1,2],
      [-1,2]
    ])

  })



  it('should diff two crossing polygons - cw first clip cw second', function() {
    var result = crossing[0].cw.clip(crossing[1].cw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,-1],
      [-2,-1],
      [-2,1],
      [-1,1],
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,-1],
      [2,-1],
      [2,1],
      [1,1]
    ])
  })

  it('should diff two crossing polygons - cw first clip ccw second', function() {
    var result = crossing[0].cw.clip(crossing[1].ccw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,-1],
      [-2,-1],
      [-2,1],
      [-1,1],
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,-1],
      [2,-1],
      [2,1],
      [1,1]
    ])
  })

  it('should diff two crossing polygons - ccw first clip cw second', function() {
    var result = crossing[0].ccw.clip(crossing[1].cw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,1],
      [-2,1],
      [-2,-1],
      [-1,-1]
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,1],
      [2,1],
      [2,-1],
      [1,-1]
    ])
  })

  it('should diff two crossing polygons - ccw first clip ccw second', function() {
    var result = crossing[0].ccw.clip(crossing[1].ccw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [-1,1],
      [-2,1],
      [-2,-1],
      [-1,-1]
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,1],
      [2,1],
      [2,-1],
      [1,-1]
    ])
  })


  it('should diff two crossing polygons - cw second clip cw first', function() {
    var result = crossing[1].cw.clip(crossing[0].cw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [1,-1],
      [1,-2],
      [-1,-2],
      [-1,-1]
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,1],
      [1,2],
      [-1,2],
      [-1,1]
    ])
  })

  it('should diff two crossing polygons - cw second clip ccw first', function() {
    var result = crossing[1].cw.clip(crossing[0].ccw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [1,-1],
      [1,-2],
      [-1,-2],
      [-1,-1]
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,1],
      [1,2],
      [-1,2],
      [-1,1]
    ])
  })

  it('should diff two crossing polygons - ccw second clip cw first', function() {
    var result = crossing[1].ccw.clip(crossing[0].cw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [1,-1],
      [1,-2],
      [-1,-2],
      [-1,-1]
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,1],
      [1,2],
      [-1,2],
      [-1,1]
    ])
  })

  it('should diff two crossing polygons - ccw second clip ccw first', function() {
    var result = crossing[1].ccw.clip(crossing[0].ccw, false, true)

    expect(result.length).to.equal(2)
    expect(result[0].length).to.equal(4)
    expect(result[0]).to.deep.equal([
      [1,-1],
      [1,-2],
      [-1,-2],
      [-1,-1]
    ])
    expect(result[1].length).to.equal(4)
    expect(result[1]).to.deep.equal([
      [1,1],
      [1,2],
      [-1,2],
      [-1,1]
    ])
  })


})
