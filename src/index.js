/**
 * Author : Khauri McClain
 * 
 * 
 */

const JsRVMS = function(){

}
JsRVMS.options = {}
// bind the output
JsRVMS.bound = function(a, b, type){
    return this;
}
// set default rng
require('./random')(JsRVMS);
// set cdfs
require("./cdf")(JsRVMS);
// set the generators
require('./variates')(JsRVMS);

JsRVMS.setSeed(-1).setStream(51);

// Test Discrete
let histogram = [];
for(let i = 0; i < 1000000; i++){
    let a = JsRVMS.Binomial(6, .7);
    if(!histogram[a])
        histogram[a] = 0;
    histogram[a]++
}

for(let i = 0; i < histogram.length; i++){
    if(histogram[i])
        console.log(`${i}: ${histogram[i]/1000000}`)
}


// TODO: this doesn't quite match the c implementation
// for(let i = 0; i < 5; i++){
//     console.log(JsRVMS.random());
// }
// export the whole thang
module.exports = JsRVMS;