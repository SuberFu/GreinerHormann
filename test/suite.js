var GreinerHormann = require('../src/greiner-hormann');

console.log(
    GreinerHormann.intersection([{
        x: 0,
        y: 0
    }, {
        x: 100,
        y: 0
    }, {
        x: 100,
        y: 100
    }, {
        x: 0,
        y: 100
    }, {
        x: 0,
        y: 0
    }], [{
        x: 10,
        y: 40
    }, {
        x: 110,
        y: 40
    }, {
        x: 110,
        y: 140
    }, {
        x: 10,
        y: 140
    }, {
        x: 10,
        y: 40
    }])
);

console.log(
    GreinerHormann.intersection([
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100],
        [0, 0]
    ], [
        [10, 40],
        [110, 40],
        [110, 140],
        [10, 140],
        [10, 40]
    ])
);

console.log(
  GreinerHormann.intersection([
      [0, 0],
      [100, 0],
      [100, 100],
      [0, 100],
      [0, 0]
  ], [
      [50, -5],
      [150, -5],
      [150, 105],
      [50, 105],
      [50, -5]
  ])
)

console.log(
  GreinerHormann.intersection([
      [0, 0],
      [100, 0],
      [100, 100],
      [0, 100]
  ], [
      [50, 0],
      [150, 0],
      [150, 100],
      [50, 100]
  ])
)
