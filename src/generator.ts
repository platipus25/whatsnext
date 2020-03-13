import Time from "./time"
import Period from "./period"
import Timeline from "./timeline"
import { strictEqual } from "assert"

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

function isPeriod(obj: object){
    return (
        "start" in obj && 
        "end" in obj &&
        "name" in obj &&
        iso_time.test(obj["start"]) &&
        iso_time.test(obj["end"])
        )
}

class TimelineGenerator {
    schedule_base: object

    constructor(schedule_base_raw: object){
        // deep copy here?
        Object.assign(this.schedule_base, schedule_base_raw)
        Object.freeze(schedule_base_raw)
    }

    // add memoization
    getTimeline(config_id: string): Timeline {
        let value = this.schedule_base[config_id]

        if (!value)
            throw new Error(`Key "${config_id}" does not exist; it is not one of ${JSON.stringify(Object.keys(this.schedule_base))}`)

        if (!value.every(isPeriod))
            throw new SyntaxError(`The entry for "${config_id}" has impropper syntax`)
        
            // isRawPeriod returns true for Period objects; this is a problem!
        value = new Timeline(value)

        return value
    }

    getIdForDate(date: Time): string {
        

        return ""
    }
}

export default TimelineGenerator
export { parse, parseISODate, TimelineGenerator }