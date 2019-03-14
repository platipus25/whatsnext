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

    get day(){
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
            let end = period.end.toCompare()
            let now = this.time().toCompare()

            console.log(start, now, end)

            if(end <= now && start <= now){ // if end is before or is now
                let nextPeriodIndex = periodIndex + 1;
                if(nextPeriodIndex < schedule.periods.length){ // is within bounds of array
                    return schedule.periods[nextPeriodIndex]
                }else{
                    break;
                }
            }
        }
        return null
    }

    thisClassCountdown(){
        console.log(countdown())
    }

    nextClassCountdown(){
        console.log(countdown())
    }

    endOfSchoolCountdown(){
        console.log(countdown())
    }

}

class WhatsnextUpdating extends Whatsnext {
    now(){
        return new Date()
    }
}

export default Whatsnext;
export {WhatsnextUpdating, Whatsnext};