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
    // TODO: Test
    // Will this create significant overhead?
    // let random = ()=>$.random();
    let random = $.random;

    // Continuous
    $.Uniform = function(u = random()){
        return (a + (b - a) * u);
    }

    $.Exponential = function(m, u = random()){

    }

    $.Erlang = function(n, b = random()){

    }

    $.Normal = function(m, s, u = random()){

    }

    $.Lognormal = function(a, b, u = random()){

    }

    $.Chisquare = function(n, u = random()){

    }

    $.Student = function(n, u = random()){

    }

    // Discrete
    $.Bernoulli = function(p, u = random()){
        return u < (1 - p) ? 0 : 1
    }

    $.Binomial = function(n, p, u = random()){
        let x = Math.floor(n * p);
        if($.cdf.Binomial(n, p, x) <= u){
            do{
                x++
            }while($.cdf.Binomial(n, p, x) <= u)
        }
        else if ($.cdf.Binomial(n, p, 0) <= u){
            while($.cdf.Binomial(n, p, x - 1) > u)
                x--;
        }
        else
            x = 0;
        return x;
    }

    $.Equilikely = function(a, b, u = random()){
        return (a + Math.floor(u * (b - a + 1)));
    }

    $.Geometric = function(p, u = random()){
        return Math.floor((Math.log(1.0 - u) / Math.log(p)));
    }

    $.Pascal = function(n, p, u = random()){

    }

    $.Poisson = function(m, u = random()){

    }
}