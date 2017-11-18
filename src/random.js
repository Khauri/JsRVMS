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