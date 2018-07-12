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