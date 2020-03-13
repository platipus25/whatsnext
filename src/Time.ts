// debug only
const util = require("util")

class Time {
    readonly year: number | null;
    readonly month: number | null;
    readonly day: number | null;

    readonly hour:number;
    readonly minute:number;
    readonly second: number;
    constructor(hour: number, 
                minute: number, 
                second: number = 0, 
                year: number | null = null, 
                month: number | null = null, 
                day: number | null = null){
        // assign to public variables
        this.hour = hour
        this.minute = minute
        this.second = second
        this.year = year
        this.month = month
        this.day = day
        //console.log(`${hour}:${minute}`)
    }

    static fromDate(date: Date): Time {
        // parse date
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds())
    }

    static fromDateFull(date: Date): Time {
        // parse date
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getFullYear(), date.getMonth(), date.getDate())
    }

    static fromMs(ms: number): Time {
        return Time.fromDate(new Date(ms))
    }

    static fromTs(ts: {hour: number, minute: number, second: number}): Time {
        return new Time(ts.hour, ts.minute, ts.second)
    }

    onDate(date: Date): Time {
        return new Time(this.hour, this.minute, this.second, date.getFullYear(), date.getMonth(), date.getDate())
    }

    toDate(now: Date = new Date()): Date {
        let year = this.year || now.getFullYear()
        let month = this.month || now.getMonth()
        let day = this.day || now.getDate()

        let date = new Date(year, month, day, this.hour, this.minute, this.second);
        return date
    }

    toString(): String {
        let hour = (this.hour > 12? this.hour-12: this.hour) // make 12-hour
        return `${hour}:${this.minute < 10? "0"+this.minute: this.minute}`
    }

    toStringSeconds(): String{
        return `${this.toString()}:${this.second < 10? "0"+this.second: this.second}`
    }

    toMs(date: Date = new Date()): number {
        return new Date(this.toDate(date)).valueOf()
    }

    valueOf(): number {
        return this.toMs()
    }

    // debug only
    [util.inspect.custom](depth, options) {
        return this.toString();
    }
}

export default Time;