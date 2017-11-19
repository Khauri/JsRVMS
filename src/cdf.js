const { inBeta, inGamma, logGamma } = require("./helpers")

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