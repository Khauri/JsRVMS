/**
 * Author : Khauri McClain
 * 
 * 
 */

const JsRVMS = function(){

}

// set default rng
require('./random')(JsRVMS);
// set the pdfs
require("./pdf")(JsRVMS);
// set cdfs
require("./cdf")(JsRVMS);
// set the generators
require('./variates')(JsRVMS);

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