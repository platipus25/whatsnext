import Time from "./time"
import Period from "./period"

function transformFromRaw(object: any){
    for(let nodeIndex in object){
        let node = object[nodeIndex]
        if(node != null) {

            let prototype = Object.getPrototypeOf(node)
            let isPlainObject = prototype == Object.prototype || prototype == Array.prototype
            let isTsTime = node.hasOwnProperty("hour") && node.hasOwnProperty("minute") && isPlainObject
            let isTsDate = node.hasOwnProperty("year") && node.hasOwnProperty("month") && node.hasOwnProperty("day") && isPlainObject
            let isPeriod = node.hasOwnProperty("start") && node.hasOwnProperty("end") && node.hasOwnProperty("name") && isPlainObject
            let shouldIterateOn = typeof node == "object" && node != null && isPlainObject;
            
            // if this instance can't fufill the change
            if(shouldIterateOn && !isTsTime && !isTsDate){ // checking if this instance can fulfill so as not to make extras
                object[nodeIndex] = transformFromRaw(node);
            }

            // at the end of the tree
            if(isTsTime){
                object[nodeIndex] = Time.fromTs(node)
            }else if(isTsDate){
                object[nodeIndex] = new Date(node.year, node.month, node.day)
            }else if(isPeriod){
                object[nodeIndex] = new Period(node)
            }
        }
    }
    return object
}

export { transformFromRaw }
export default transformFromRaw;

