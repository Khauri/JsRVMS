const { logBeta, logGamma } = require("./helpers")

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