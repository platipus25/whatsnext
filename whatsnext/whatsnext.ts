import Time from "./time.ts"
let countdown = require("countdown")

class Whatsnext {
    schedule_base: Object;
    date: Date
    constructor(schedule_base: Object, date: Date){
        this.schedule_base = schedule_base
        this.date = date
    }

    now(){
        return this.date
    }

    time(){
        return Time.fromDate(this.now())
    }

    private _day(){
        return this.day.slice(0, 3).toLowerCase()
    }

    get day(){ // I don't like:
        let days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let day = ""
        let intDay = this.now().getDay()
        day = days_of_the_week[intDay]

        // search this.schedule_base["minimum_days"] for this.now()
        for(let entry of this.schedule_base["minimum_days"]){
            if(entry.hasOwnProperty("date") && entry.date.toDateString() == this.now().toDateString()){
                day = "Minimum"
            }
        }

        return day
    }

    get schedule(){
        return this.schedule_base[this._day()]
    }


    thisClass(){
        let schedule = this.schedule
        for(let period of schedule.periods){
            let start = period.start.toCompare()
            let end = period.end.toCompare()
            let now = this.time().toCompare()

            //console.log(start, now, end)

            if(start <= now && end >= now){ // if start is before or is now & end is later than or is now
                return period
            }
        }
        return null
    }

    nextClass(){
        let schedule = this.schedule

        for(let periodIndex in schedule.periods){
            let period = schedule.periods[periodIndex]
            let start = period.start.toCompare()
            //let end = period.end.toCompare()
            let now = this.time().toCompare()

            //console.log(start, now, end)

            if(now <= start){ // if it is before start
                return period
            }
        }
        return null
    }

    thisClassCountdown(callback: (ts) => void){
        let thisClass = this.thisClass()
        if(thisClass == null) return null

        return countdown(callback, thisClass.end.toDate())
    }

    nextClassCountdown(callback: (ts) => void){
        let nextClass = this.nextClass()
        if(nextClass == null) return null

        return countdown(callback, nextClass.start.toDate())
    }

    endOfSchoolCountdown(callback: (ts) => void){
        return countdown(callback, this.schedule_base["end"].toDate())
    }

}

class WhatsnextUpdating extends Whatsnext {
    now(){
        return new Date()
    }
}

class WhatsnextUpdatingIsh extends Whatsnext {
    start: Date;
    constructor(schedule_base: Object, date: Date){
        super(schedule_base, date)
        this.start = new Date()
    }

    now(){
        return new Date(this.date.valueOf() + (10*60)*(new Date().valueOf() - this.start.valueOf()))
    }
}

export default Whatsnext;
export {WhatsnextUpdating, Whatsnext, WhatsnextUpdatingIsh};