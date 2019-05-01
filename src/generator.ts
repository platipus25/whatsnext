import Time from "../node_modules/time_ts/dist/time"
import Period from "./period.ts"

function transformFromRaw(object: any){
    for(let nodeIndex in object){
        let node = object[nodeIndex]
        let isTsTime = node.hasOwnProperty("hour") && node.hasOwnProperty("minute")
        let isTsDate = node.hasOwnProperty("year") && node.hasOwnProperty("month") && node.hasOwnProperty("day")
        let isPeriod = node.hasOwnProperty("start") && node.hasOwnProperty("end") && node.hasOwnProperty("name")
        let isIterable = typeof node == "object" && node != null;
        
        // if this instance can't fufill the change
        if(isIterable && !isTsTime && !isTsDate){ // checking if this instance can fulfill so as not to make extras
            object[nodeIndex] = transformFromRaw(node);
        }

        // at the end of the tree
        if(isTsTime){
            object[nodeIndex] = Time.fromTs(node)
        }else if(isTsDate){
            object[nodeIndex] = new Time(0, 0, 0, node.year, node.month, node.day)
        }else if(isPeriod){
            object[nodeIndex] = new Period(node)
        }
    }
    return object
}

export { transformFromRaw }
export default transformFromRaw;

