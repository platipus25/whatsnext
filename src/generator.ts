import Time from "./Time/src/time.ts"

// EXAMPLE USAGE:

/*
    const ky = require("ky")["default"]
    var request = ky("schedule2018-19.json").json()

    let schedule_basePromise = request.then((data) => {
        data = transformFromTs(data)
        //console.log(data)
        return data;
    })
*/

function transformFromTs(object: any){
    for(let nodeIndex in object){
        let node = object[nodeIndex]
        let isTsTime = node.hasOwnProperty("hour") && node.hasOwnProperty("minute")
        let isTsDate = node.hasOwnProperty("year") && node.hasOwnProperty("month") && node.hasOwnProperty("day")
        let isIterable = typeof node == "object" && node != null;
        
        // if this instance can't fufill the change
        if(isIterable && !isTsTime && !isTsDate){ // checking if this instance can fulfill so as not to make extras
            object[nodeIndex] = transformFromTs(node);
        }

        // at the end of the tree
        if(isTsTime){
            object[nodeIndex] = Time.fromTs(node)
        }else if(isTsDate){
            object[nodeIndex] = new Date(node.year, node.month, node.day)
        }
    }
    return object
}


export { transformFromTs }
export default transformFromTs;

