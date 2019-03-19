import Time from "./Time/src/time.ts"
let countdown = require("countdown")

class WhatsnextStatic {
    schedule_base: Object;
    date: Date
    constructor(schedule_base: Object, date: Date){
        this.schedule_base = schedule_base
        this.date = date
    }

    get now(){
        return this.date
    }

    get time(){
        return Time.fromDate(this.now)
    }

    private _day(){
        return this.day.slice(0, 3).toLowerCase()
    }

    get day(){ // I don't like:
        let days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let day = ""
        let intDay = this.now.getDay()
        day = days_of_the_week[intDay]

        // search this.schedule_base["minimum_days"] for this.now
        for(let entry of this.schedule_base["minimum_days"]){
            if(entry.hasOwnProperty("date") && entry.date.toDateString() == this.now.toDateString()){
                day = "Minimum"
            }
        }

        return day
    }

    get schedule(){
        return this.schedule_base[this._day()] || null
    }


    thisClass(){
        let schedule = this.schedule
        if(!schedule) return null
        for(let period of schedule.periods){
            let start = period.start.toCompare()
            let end = period.end.toCompare()
            let now = this.time.toCompare()

            if(start <= now && end >= now){ // if start is before or is now & end is later than or is now
                return period
            }
        }
        return null
    }

    nextClass(){
        let schedule = this.schedule
        if(!schedule) return null
        for(let period of schedule.periods){
            let start = period.start.toCompare()
            let now = this.time.toCompare()

            if(now <= start){ // if it is before start
                return period
            }
        }
        return null
    }

    thisClassCountdown(callback: (ts) => void){
        return () => {
            let thisClass = this.thisClass()
            let ts = null
            if(thisClass){
                ts = countdown(this.now, thisClass.end.toDate(this.now))
            }
            callback(ts)
        }
    }

    nextClassCountdown(callback: (ts) => void){
        return () => {
            let nextClass = this.nextClass()
            let ts = null
            if(nextClass){
                ts = countdown(this.now, nextClass.start.toDate(this.now))
            }
            callback(ts)
        }
    }

    endOfSchoolCountdown(callback: (ts) => void){
        return () => {
            let ts = null
            if(this.schedule){
                ts = countdown(this.now, this.schedule["end"].toDate(this.now))
            }
            callback(ts)
        }
    }

}

class Whatsnext extends WhatsnextStatic {
    get now(){
        return new Date()
    }
}

class WhatsnextSim extends Whatsnext {
    start: Date;
    constructor(schedule_base: Object, public multiplier: number = 0, date: Date = new Date()){
        super(schedule_base, date)
        this.start = new Date()
    }

    get now(){
        return new Date(this.date.valueOf() + (this.multiplier*60 || 1)*(new Date().valueOf() - this.start.valueOf()))
    }
}

export default WhatsnextStatic;
export {WhatsnextStatic, Whatsnext, WhatsnextSim};