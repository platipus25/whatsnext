import Time from "./time"
import Period from "./period"

// should lazy load 

// Parse ISO dates and times
const iso_time = /(?<hour>\d+):(?<minute>\d+):?(?<second>\d*)/
const iso_date = /(?<year>\d{4})-(?<month>\d+)-(?<day>\d+)/

function parse(time: string): Time {
    if (!iso_time.test(time)) {
        throw new SyntaxError(`"${time}" is not proper ISO 8601 time format`)
    }

    const groups = time.match(iso_time)!.groups!
    
    const hour = parseInt(groups.hour)
    const minute = parseInt(groups.minute)
    let second = 0;
    if (groups.second) {
        second = parseInt(groups.second)
    }

    return new Time(hour, minute, second);
}

function parseISODate(date: string): Date {
    if (!iso_date.test(date)) {
        throw new SyntaxError(`"${date}" is not proper ISO 8601 date format`)
    }

    const groups = date.match(iso_date)!.groups!
    
    const year = parseInt(groups.year)
    let month = parseInt(groups.month) 
    const day = parseInt(groups.day)

    // Date months are zero indexed, 
    // ISO format dates are 1 indexed
    month -= 1;

    return new Date(year, month, day);
}
/*
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
*/
export { parse, parseISODate }