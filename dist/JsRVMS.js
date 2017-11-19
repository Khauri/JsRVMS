var JsRVMS =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const TINY = 1e-10
const SQRT2PI = 2.506628274631
const {exp, abs, floor, log} = Math // Math functions

// returns natural log of gamma function
function logGamma(a){
    let sum = 1.000000000178 +
            76.180091729406 / a +
            -86.505320327112 / (a + 1.0) +
            24.014098222230 / (a + 2.0) +
            -1.231739516140 / (a + 3.0) +
            0.001208580030 / (a + 4.0) +
            -0.000005363820 / (a + 5.0)
    return (a - 0.5) * log(a + 4.5) - (a + 4.5) + log(SQRT2PI * sum)
}

function logBeta(a, b){
    return (logGamma(a) + logGamma(b) - logGamma(a+b))
}

/**
 * Evaluates the incomplete beta function.
 * @param {*} a 
 * @param {*} b 
 * @param {*} x 
 */
function inBeta(a, b, x){
    let t = 0.0, factor = 0.0, f = 1.0, g = 0.0, c = 0.0, 
        p = [0,1], q = [0,1], 
        swap = false, 
        n = 0

    if (x > (a + 1.0) / (a + b + 1.0)) 
    { /* to accelerate convergence   */
        swap = true                          /* complement x and swap a & b */
        x    = 1.0 - x
        t    = a
        a    = b
        b    = t
    }
    if (x > 0)
        factor = exp(a * log(x) + b * log(1.0 - x) - logBeta(a,b)) / a
    do 
    {                               /* recursively generate the continued */
        g = f                          /* fraction 'f' until two consecutive */
        n++                            /* values are small                   */
        if ((n % 2) > 0) {
            t = (n - 1) / 2
            c = -(a + t) * (a + b + t) * x / ((a + n - 1.0) * (a + n))
        }
        else 
        {
            t = n / 2
            c = t * (b - t) * x / ((a + n - 1.0) * (a + n))
        }
        p[2] = p[1] + c * p[0]
        q[2] = q[1] + c * q[0]
        if (q[2] != 0.0) 
        {                 /* rescale to avoid overflow */
            p[0] = p[1] / q[2]
            q[0] = q[1] / q[2]
            p[1] = p[2] / q[2]
            q[1] = 1.0
            f    = p[1]
        }
    } while ((abs(f - g) >= TINY) || (q[1] != 1.0))

    if (swap) 
        return (1.0 - factor * f)
    else
        return (factor * f)
}

function inGamma(a, x){
    let factor = 0.0, 
        f = 0.0 
 
    if (x > 0.0)
    {
        factor = exp(-x + a * log(x) - logGamma(a))
    }

    if (x < a + 1.0) 
    {                                  /* evaluate as an infinite series - */
        let t = a,                        /* A & S equation 6.5.29            */
            term = 1.0 / a,
            sum  = term

        while (term >= TINY * sum)
        {     /* sum until 'term' is small */
            t++
            term *= x / t
            sum  += term
        } 
        return factor * sum
    }
    else 
    {   
        /* evaluate as a continued fraction -
        A & S eqn 6.5.31 with the extended 
        pattern 2-a, 2, 3-a, 3, 4-a, 4,... 
        - see also A & S sec 3.10, eqn (3) */
        let p = [0, 1],
            q = [1, x],
            c = []
            f = 1 / x,
            n = 0
        do 
        {                             /* recursively generate the continued */
            g = f;                        /* fraction 'f' until two consecutive */
            n++;                           /* values are small                   */
            if ((n % 2) > 0) {
                c[0] = (floor(n + 1) / 2) - a
                c[1] = 1.0
            }
            else {
                c[0] = floor(n) / 2
                c[1] = x
            }
            p[2] = c[1] * p[1] + c[0] * p[0]
            q[2] = c[1] * q[1] + c[0] * q[0]
            if (q[2] != 0.0) 
            {             /* rescale to avoid overflow */
                p[0] = p[1] / q[2]
                q[0] = q[1] / q[2]
                p[1] = p[2] / q[2]
                q[1] = 1.0
                f = p[1]
            }
        } while ((abs(f - g) >= TINY) || (q[1] != 1.0))
    }
    return (1.0 - factor * f)
}

module.exports = {
    TINY,
    inBeta,
    inGamma,
    logBeta,
    logGamma
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Author : Khauri McClain
 * 
 * 
 */

const JsRVMS = function(){

}

// set default rng
__webpack_require__(2)(JsRVMS);
// set the pdfs
__webpack_require__(3)(JsRVMS);
// set cdfs
__webpack_require__(4)(JsRVMS);
// set the generators
__webpack_require__(5)(JsRVMS);

JsRVMS.setSeed(-1).setStream(51);

// Gets all the variates
for(prop in JsRVMS){
    // console.log(prop);
    if(["getSeed", "setSeed", "setStream", "cdf", "pdf", "random"].indexOf(prop) > -1)
        continue
    let a = (JsRVMS[prop] + '')
        .replace(/[/][/].*$/mg,'') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
        .replace(/=[^,]+/g, '') // strip any ES6 defaults  
        .split(',').filter(Boolean) // split & filter [""]
        .slice(0, -1);

    console.log(`Generating ${prop} variate using...`);
    a = a.map(arg=>{
        let val = 0;
        switch(arg){
            case "p":
                val = Math.random()
                break;
            case "a":
                val = 0
                break;
            case "b":
                val = 100
                break;
            case "n":
            case "m":
            case "s":
                val = 5
                break;
        }
        console.log(`${arg} = ${val}`)
        return val;
    })
    console.log(`Result: ${JsRVMS[prop].apply(null, a)}`)
}

// for(let i = 0; i < histogram.length; i++){
//     if(histogram[i])
//         console.log(`${i}: ${histogram[i]/1000000}`)
// }


// TODO: this doesn't quite match the c implementation
// for(let i = 0; i < 5; i++){
//     console.log(JsRVMS.random());
// }
// export the whole thang
module.exports = JsRVMS;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// Lehman RNG
module.exports = function(JsRVMS){
    const 
        MODULUS    = 2147483647, /* DON'T CHANGE THIS VALUE                  */
        MULTIPLIER = 48271,      /* DON'T CHANGE THIS VALUE                  */
        CHECK      = 399268537;  /* DON'T CHANGE THIS VALUE                  */
        STREAMNUM  = 256,        /* # of streams, DON'T CHANGE THIS VALUE    */
        A256       = 22925      /* jump multiplier, DON'T CHANGE THIS VALUE */
    ;

    let SEED    = 123456789,   /* initial seed, use 0 < DEFAULT < MODULUS  */
        STREAMS = [],
        STREAM  = 0;
    
    const random = function(){
        const
            Q = Math.floor(MODULUS / MULTIPLIER),
            R = MODULUS % MULTIPLIER
        ;
        // console.log(Q, R);
        let t = MULTIPLIER * (STREAMS[STREAM] % Q) - R * (STREAMS[STREAM] / Q);
        if (t > 0) 
          STREAMS[STREAM] = t;
        else 
          STREAMS[STREAM] = t + MODULUS;
        return (STREAMS[STREAM] / MODULUS);
    }

    random.setSeed = JsRVMS.setSeed = function(seed){
        const
            Q = Math.floor(MODULUS / A256),
            R = MODULUS % A256
        ;
        // clear the streams
        // put the seed
        if(seed < 0)
            seed = Date.now();
        else
            seed = Math.floor(seed) % MODULUS;
        // Reset all the stream values except for 1 value
        STREAMS = [seed];
        for(let i = 1; i < STREAMNUM; i++){
            let x = A256 * (STREAMS[i - 1] % Q) - R * (Math.floor(STREAMS[i - 1] / Q));
            if (x > 0)
              STREAMS[i] = x;
            else
              STREAMS[i] = x + MODULUS;
        }
        return this;
    }

    random.getSeed = JsRVMS.getSeed = function(){
        return SEED;
    }

    random.setStream = JsRVMS.setStream = function(s){
        STREAM = Math.floor(s) % STREAMNUM;
        return this;
    }

    random.setSeed(SEED);

    JsRVMS.random = random;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const { logBeta, logGamma } = __webpack_require__(0)

module.exports = function($){

    const {exp, abs, floor, log, sqrt} = Math

    const SQRT2PI = 2.506628274631

    function Chisquare(n, x){
        let s = n / 2
        return exp((s - 1.0) * log(x / 2.0) - (x / 2.0) - log(2.0) - logGamma(s))
    }

    function Erlang(n, b, x){
        let t = (n - 1) * log(x / b) - (x / b) - log(b) - logGamma(n)
        return exp(t)
    }

    function Standard(x){
        return exp(-.5 * x * x) / SQRT2PI
    }

    function Student(n, x){
        let s = -0.5 * (n + 1) * log(1.0 + ((x * x) / floor(n))),
            t = -logBeta(0.5, n / 2)
        return exp(s + t) / sqrt(floor(n))
    }

    $.pdf = {
        Chisquare,
        Erlang,
        Standard,
        Student
    }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const { inBeta, inGamma, logGamma } = __webpack_require__(0)

module.exports = function($){
    const TINY = 1e-10

    const SQRT2PI = 2.506628274631
    
    const {exp, abs, floor, log} = Math

    function Geometric(p, x){
        return (1.0 - exp((x + 1) * log(p)))
    }

    function Binomial(n, p, x){
        if(x < n)
            return 1 - inBeta(x+1, n-x, p)
        return 1
    }

    function Chisquare(n, x){
        return inGamma(n / 2, x / 2);
    }

    function Erlang(n, b, x){
        return inGamma(n, x / b);
    }

    function Pascal(n, p, x){
        return 1 - inBeta(x + 1, n, p);
    }

    function Poisson(m, x){
        return 1.0 - inGamma(x + 1, m);
    }

    function Standard(x){
        let t = inGamma(0.5, 0.5 * x * x)
        return x < 0 ? 
            (1 - t) / 2 : 
            (1 + t) / 2
    }

    function Student(n, x){
        let t = (x * x) / (n + x * x),
            s = inBeta(0.5, n / 2.0, t)
        return x >= 0 ? 
            (1 + s) / 2 : 
            (1 - s) / 2
    }

    $.cdf = {
        Binomial,
        Chisquare,
        Erlang,
        Geometric,
        Pascal,
        Poisson,
        Standard,
        Student
    }
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * 
 * The following notational conventions are used
 *                 x : possible value of the random variable
 *                 u : real variable (probability) between 0.0 and 1.0 
 *  a, b, n, p, m, s : distribution-specific parameters
 *
 * There are pdf's, cdf's and idf's for 6 discrete random variables
 *
 *      Random Variable    Range (x)  Mean         Variance
 *
 *      Bernoulli(p)       0..1       p            p*(1-p)
 *      Binomial(n, p)     0..n       n*p          n*p*(1-p)
 *      Equilikely(a, b)   a..b       (a+b)/2      ((b-a+1)*(b-a+1)-1)/12 
 *      Geometric(p)       0...       p/(1-p)      p/((1-p)*(1-p))
 *      Pascal(n, p)       0...       n*p/(1-p)    n*p/((1-p)*(1-p))
 *      Poisson(m)         0...       m            m
 *
 * and for 7 continuous random variables
 *
 *      Uniform(a, b)      a < x < b  (a+b)/2      (b-a)*(b-a)/12
 *      Exponential(m)     x > 0      m            m*m
 *      Erlang(n, b)       x > 0      n*b          n*b*b
 *      Normal(m, s)       all x      m            s*s
 *      Lognormal(a, b)    x > 0         see below
 *      Chisquare(n)       x > 0      n            2*n
 *      Student(n)         all x      0  (n > 1)   n/(n-2)   (n > 2)
 *
 * For the Lognormal(a, b), the mean and variance are
 *
 *                        mean = Exp(a + 0.5*b*b)
 *                    variance = (Exp(b*b) - 1)*Exp(2*a + b*b)
 *
 * Name            : rvms.c (Random Variable ModelS)
 * Author          : Khauri McClain
 * Author          : Steve Park & Dave Geyer
 * Language        : Javascript (ES6)
 */

module.exports = function($){
    const TINY = 1e-10
    // TODO: Test
    // Will this create significant overhead?
    // let random = ()=>$.random()
    let random = $.random
    
    const {exp, abs, floor, log} = Math

    // Continuous
    $.Uniform = function(a, b, u = random()){
        return (a + (b - a) * u)
    }

    $.Exponential = function(m, u = random()){
        return (-m * log(1.0 - u))
    }

    $.Erlang = function(n, b, u = random()){
        let t = 0.0,
            x = n * b
        do 
        {                                   /* use Newton-Raphson iteration */
            t = x
            x = t + (u - $.cdf.Erlang(n, b, t)) / $.pdf.Erlang(n, b, t)
            if (x <= 0.0)
                x = 0.5 * t
        }
        while (abs(x - t) >= TINY)
        return x
    }
    // This has to be before Normal, LogNormal
    $.Standard = function(u = random()){
        let t = 0.0, 
            x = 0.0                    /* initialize to the mean, then  */
        do 
        {                            /* use Newton-Raphson iteration  */
            t = x
            x = t + (u - $.cdf.Standard(t)) / $.pdf.Standard(t)
        } 
        while (abs(x - t) >= TINY)
        return x
    }

    $.Normal = function(m, s, u = random()){
        return (m + s * $.Standard(u))
    }

    $.Lognormal = function(a, b, u = random()){
        return exp(a + b * $.Standard(u))
    }

    $.Chisquare = function(n, u = random()){
        let t = 0.0, 
            x = n
        do 
        {                                     /* use Newton-Raphson iteration */
            t = x
            x = t + (u - $.cdf.Chisquare(n, t)) / $.pdf.Chisquare(n, t)
            if (x <= 0.0)
                x = 0.5 * t
        } 
        while (abs(x - t) >= TINY)
        return x
    }

    $.Student = function(n, u = random()){
        let t = 0.0, 
            x = 0.0                       /* initialize to the mean, then */
        do
        {                                     /* use Newton-Raphson iteration */
            t = x
            x = t + (u - $.cdf.Student(n, t)) / $.pdf.Student(n, t)
        } 
        while (abs(x - t) >= TINY)
        return x
    }

    // Discrete
    $.Bernoulli = function(p, u = random()){
        return u < (1 - p) ? 0 : 1
    }

    $.Binomial = function(n, p, u = random()){
        let x = floor(n * p)
        if($.cdf.Binomial(n, p, x) <= u)
        {
            do
            {
                x++
            }
            while($.cdf.Binomial(n, p, x) <= u)
        }
        else if ($.cdf.Binomial(n, p, 0) <= u)
        {
            while($.cdf.Binomial(n, p, x - 1) > u)
            {
                x--
            }
        }
        else
        {
            x = 0
        }
        return x
    }

    $.Equilikely = function(a, b, u = random()){
        return (a + floor(u * (b - a + 1)))
    }

    $.Geometric = function(p, u = random()){
        return floor((log(1.0 - u) / log(p)))
    }

    $.Pascal = function(n, p, u = random()){
        let x = floor(n * p / (1.0 - p))    /* start searching at the mean */
        
        if ($.cdf.Pascal(n, p, x) <= u)
        {
            do
            {
                x++
            }
            while ($.cdf.Pascal(n, p, x) <= u)
        }
        else if ($.cdf.Pascal(n, p, 0) <= u)
        {
            while ($.cdf.Pascal(n, p, x - 1) > u)
            {
                x--
            }    
        }
        else
        {
            x = 0
        }
        return x
    }

    $.Poisson = function(m, u = random()){
        let x = floor(m)                  /* start searching at the mean */
        
        if ($.cdf.Poisson(m, x) <= u)
        {
            do
            {
                x++
            }
            while ($.cdf.Poisson(m, x) <= u)
        }
        else if ($.cdf.Poisson(m, 0) <= u)
        {
            while ($.cdf.Poisson(m, x - 1) > u)
            {
                x--
            }
        }
        else
        {
            x = 0
        }
        return x
    }
}

/***/ })
/******/ ]);