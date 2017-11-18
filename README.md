# JsRVMS
Random variates in js. Includes cdf, idf, and pdf. Also a website for visually displaying them using vue.js and d3.js

# Quick Usage Guide 
```js
import "jsrvms" 
// Generste a random variate
// See the wiki for a list of variates 

JsRVMS.Bernoulli(0.2) // [0, 1]

// The i.d.f and variate functions are the same.
// u is an optional, last parameter of any variate

JsRBMS.Bernoulli(.5, .6) // 1

// Seeding the random number generator for 
// deterministic behavior

JsRVMS.setSeed(123456789)

// For non-deterministic you can set the seed using the clock

JsRVMS.setSeed(Date.now())

// or 

JsRVMS.setSeed(-1)

// Select an RNG stream (default is 0)

JsRVMS.setStream(51)

// The previous two commands can be chained

JsRVMS.setSeed(-1).setStream(51)

// The c.d.f's are provided and have their own forms

JsRVMS.cdf.Geometric(0.2, 1)

// The p.d.f's also are provided

JsRVMS.pdf.Geometric(0.2, 1)

// To use a custom base random number generator
// just override JsRVMS.Random
JsRVMS.Random = function() {...} 

```
# Variates
