import Time from "./Time/src/time.ts"
let countdown = require("countdown")

class WhatsnextStatic {
    schedule_base: Object;
    date: Date
    constructor(schedule_base: Object, date: Date){
        this.date = date
        
        if(schedule_base instanceof Promise){
            schedule_base.then((base) => this.schedule_base = base)
        }else{
            this.schedule_base = schedule_base
        }
    }

    get now(){
        return this.date
    }

    get tomorrow(){
        return new Date(this.now.setDate(this.now.getDate()+1))
    }

    get time(){
        return Time.fromDate(this.now)
    }

    private _day(){
        return this.day.slice(0, 3).toLowerCase()
    }

    get day(){
        let days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let day = ""
        let intDay = this.now.getDay()
        day = days_of_the_week[intDay]

        if(this.schedule_base){
            
            // search this.schedule_base["minimum_days"] for this.now
            for(let entry of this.schedule_base["minimum_days"]){
                if(entry.hasOwnProperty("date") && entry.date.toDateString() == this.now.toDateString()){
                    day = "Minimum"
                }
            }
        }

        return day
    }

    get schedule(){
        if(!this.schedule_base) return null
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

            if(now < start){ // if it is before start
                return period
            }
        }
        return null
    }

    enumerateNextClass(){
        if(!this.schedule_base) return null
        let nextClass = this.nextClass()
        if(!nextClass){
            let tomorrowMidnight = new Date(new Date(this.tomorrow.setHours(0)).setMinutes(0))
            let whatsnextTomorrow = new WhatsnextStatic(this.schedule_base, tomorrowMidnight)
            nextClass = whatsnextTomorrow.enumerateNextClass()
        }else{
            for(let field in nextClass){
                if(nextClass[field] instanceof Time){
                    nextClass[field] = Time.fromDate(nextClass[field].toDate(this.now))
                }
            }
        }
        return nextClass
    }

    weekend(){
        if(!this.schedule_base) return null
        // find the end of the last day of the week
        let date = this.now
        let incr = (date) => new Date(date.setDate(date.getDate()+1))
        while(date.getDay() != 5){ // in `Date` speak, 5 is friday (ref the array in day())
            date = incr(date)
        }
        let schedule = new WhatsnextStatic(this.schedule_base, date).schedule
        if(schedule){
            return Time.fromDate(schedule.end.toDate(date))
        } 
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

    enumerateNextClassCountdown(callback: (ts) => void){
        return () => {
            let nextClass = this.enumerateNextClass()
            let ts = null
            if(nextClass){
                ts = countdown(this.now, nextClass.start.toDate())
            }
            callback(ts)
        }
    }

    endOfSchoolCountdown(callback: (ts) => void){
        return () => {
            let ts = null
            if(this.schedule){ 
                let end = this.schedule["end"].toDate(this.now)
                if(this.now < end){
                    ts = countdown(this.now, end)
                }
            }
            callback(ts)
        }
    }

    weekendCountdown(callback: (ts) => void){
        return () => {
            let ts = null
            let weekendDate = this.weekend()
            if(weekendDate){ 
                let weekend = weekendDate.toDate()
                if(this.now){
                    ts = countdown(this.now, weekend)
                }
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
        let diff = (this.multiplier*60 || 1)*(new Date().valueOf() - this.start.valueOf()) // get the time since instantiation and multiply by 
        let newDate = new Date(this.date.valueOf() + diff)
        let seconds = this.date.getSeconds() // or this.start.getSeconds() or 0
        let withseconds = new Date(newDate.setSeconds(seconds))
        return withseconds
    }
}

export default WhatsnextStatic;
export {WhatsnextStatic, Whatsnext, WhatsnextSim};
