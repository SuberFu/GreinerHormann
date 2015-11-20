module.exports = {
  wrapIntoObject: function (shape, holes) {
    if (undefined === holes) {
      holes = []
    }

    return {
      shape: shape,
      holes: holes
    }
  }
}
