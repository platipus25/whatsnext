import Time from "./time"
import { parse } from "./generator"

class Period { 
    readonly name: string;
    readonly start: Time;
    readonly end: Time;

    constructor(name: string, start: string, end: string)
    constructor(name: string, start: Time, end: Time)
    
    constructor(name: string, start: Time | string, end: Time | string) {
        this.name = name
        this.start = start instanceof Time? start: parse(start)
        this.end = end instanceof Time? end: parse(end)
    }

    percent(now: Date = new Date()): number | null {
        const lengthMs = this.end.toMs() - this.start.toMs()
        const timePass = now.valueOf() - this.start.toMs()
        const percent = (timePass / lengthMs) * 100

        return percent
    }

    static compare(a: Period, b: Period): number {
        if (a.start > b.start) {
            return 1; // a is greater than b
        } else if (a.start < b.start) {
            return -1; // a is less than b
        }
        return 0;
    }
}

export default Period;
