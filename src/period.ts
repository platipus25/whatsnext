import Time from "./time"

class Period { 
    readonly name: string;
    readonly start: Time;
    readonly end: Time;
    constructor(name: string, start: Time, end: Time){
        this.name = name
        this.start = start
        this.end = end
    }

    percent(now: Date = new Date()): number | null {
        let lengthMs = this.end.toDate(now).valueOf() - this.start.toDate(now).valueOf()
        let timePass = now.valueOf() - this.start.toDate(now).valueOf()
        let percent = (timePass / lengthMs) * 100

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
