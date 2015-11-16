[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
Greiner-Hormann polygon clipping (fork)
=======================================

 * Does AND, OR, XOR (intersection, union, difference, if you're human)
 * Plays nicely with [Leaflet](http://github.com/leaflet/leaflet/), comes with an adaptor for it
 * Handles non-convex polygons and multiple clipping areas
 * ~3kb compressed, no dependencies

## Changes in this fork

 * This fork implements the degeneracy problem fix as proposed by [Greiner/Hormann](http://www.inf.usi.ch/hormann/papers/Greiner.1998.ECO.pdf). It moves problematic points outwards by 0.000000001 units.
 * It also removes the polygon winding dependency of the algorithm by detecting the winding.

[Demo and documentation](http://w8r.github.io/GreinerHormann/)

## Install
```bash
$ npm install platener/GreinerHormann
```

Browserify
```js
var greinerHormann = require('greiner-hormann');
```

Browser
```html
<script src="path/to/greiner-hormann(.leaflet).min.js"></script>
```

## Use
```js
...
var intersection = greinerHormann.intersection(source, clip);
var union        = greinerHormann.union(source, clip);
var diff         = greinerHormann.diff(source, clip);

...

if(intersection){
    if(typeof intersection[0][0] === 'number'){ // single linear ring
        intersection = [intersection];
    }
    for(var i = 0, len = intersection.length; i < len; i++){
        L.polygon(intersection[i], {...}).addTo(map);
    }
}
```

## Format
Input and output can be `{x:x, y:y}` objects or `[x,y]` pairs. It will output the points in the same format you put in.
