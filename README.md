# JsRVMS
Random variates in js. Includes cdf, idf, and pdf. Also a website for visually displaying them using vue.js and d3.js

# Quick Usage Guide 
```js
import "jsrvms" 

// Seeding the random number generator
JsRVMS.setSeed{123456789}

// Select a stream (default is 0)
JsRVMS.

// Generste a random variate (idf) 
JsRVMS.Geometric(0.2)

// Apply transformations
JsRVMS.Bound(0,3).Geometric(0.2)

// Use cdf
JsRVMS.cdf.Geometric(0.2,1)

// To use a custom base random number generator
// just override JsRVMS.Random
JsRVMS.Random = function() {...} 

```
# Variates
