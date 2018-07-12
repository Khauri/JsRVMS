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