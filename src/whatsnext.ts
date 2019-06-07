import Time from "../node_modules/time_ts/dist/time"
import transformFromRaw from "./generator.ts"
import Period from "./period.ts"
let countdown = require("countdown")

class WhatsnextStatic {
    schedule_base: any;
    date: Date
    constructor(schedule_base: any, date: Date){
        this.date = date

        if(schedule_base instanceof Promise){
            schedule_base.then((base) => {
                this.schedule_base = transformFromRaw(base)
                })
        }else{
            this.schedule_base = transformFromRaw(schedule_base)
        }
    }

    get now(): Date {
        return this.date
    }

    get yesterday(): Date {
        return new Date(new Date(new Date(this.now.setDate(this.now.getDate()-1)).setHours(0)).setMinutes(0))
    }

    get tomorrow(): Date {
        return new Date(new Date(new Date(this.now.setDate(this.now.getDate()+1)).setHours(0)).setMinutes(0))
    }

    get time(): Time {
        return Time.fromDate(this.now)
    }

    private setTimeDate(obj, date): any {
        let object = {... obj}
        for(let nodeIndex in object){
            let node = object[nodeIndex]
            let isIterable = typeof node == "object" && node != null && Object.getPrototypeOf(node) == Object.prototype;
            let isTime = node instanceof Time

            // if this instance can't fufill the change
            if(isIterable){
                object[nodeIndex] = this.setTimeDate(node, date);
            }

            // at the end of the tree
            if(isTime){
                object[nodeIndex] = node.setDate(date);
            }
        }
        return object
    }

    get percent(): number | null {
        let thisClass = this.thisClass()
        if(!thisClass) return null
        return thisClass.percent(this.now);
    }

    get specialOccuranceToday(): { name: string, date: Date, type: string} | null {
        let base = this.schedule_base
        if(!base || !base.hasOwnProperty("custom")) return null
        let occuranceToday = null
        for(let occurance of base["custom"]){
            let occuranceDate = occurance.date.toDateString()
            let isToday = occuranceDate == this.now.toDateString()
            if(isToday){
                occuranceToday = occurance
            }
        }
        return occuranceToday
    }

    private _day(): string {
        let days_of_the_week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        let day = ""
        let intDay = this.now.getDay()
        day = days_of_the_week[intDay]
        
        let occuranceToday = this.specialOccuranceToday
        if(occuranceToday){
            day = occuranceToday.type
        }

        return day
    }

    get day(): string {
        let days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let day = ""
        let intDay = this.now.getDay()
        day = days_of_the_week[intDay] 
        
        let occuranceToday = this.specialOccuranceToday
        if(occuranceToday){
            day = occuranceToday.name
        }

        return day
    }

    get schedule(): {start: Time, end: Time, periods: [Period]} | null {
        if(!this.schedule_base) return null
        let day = this._day()
        return this.schedule_base[day] || null
    }


    thisClass(): Period | null {
        let schedule = this.schedule
        if(!schedule) return null
        for(let period of schedule.periods){
            let start = period.start.toMs(this.now)
            let end = period.end.toMs(this.now)
            let now = this.time.toMs(this.now)

            if(start <= now && end >= now){ // if start is before or is now & end is later than or is now
                return period
            }
        }
        return null
    }

    nextClass(): Period | null {
        let schedule = this.schedule
        if(!schedule) return null
        for(let period of schedule.periods){
            let start = period.start.toMs(this.now)
            let now = this.time.toMs(this.now)

            if(now < start){ // if it is before start
                return period
            }
        }
        return null
    }

    lastClass(): Period | null {
        let schedule = this.schedule
        if(!schedule) return null
        let periods = schedule.periods
        for(let periodIndex = periods.length -1; periodIndex >= 0; periodIndex--){ // loop backwards
            let period = periods[periodIndex]
            let start = period.start.toMs(this.now)
            let end = period.end.toMs(this.now)
            let now = this.time.toMs(this.now)

            if(now > start && now > end){ // if it is before start
                return period
            }
        }
        return null
    }

    enumerateNextClass(): Period | null {
        if(!this.schedule_base) return null
        let nextClass = this.nextClass()
        if(!nextClass){
            let tomorrowMidnight = this.tomorrow
            let whatsnextTomorrow = new WhatsnextStatic(this.schedule_base, tomorrowMidnight)
            nextClass = whatsnextTomorrow.enumerateNextClass()
        }else{
            nextClass = new Period(this.setTimeDate(nextClass, this.now))
        }
        return nextClass
    }

    enumerateLastClass(): Period | null {
        if(!this.schedule_base) return null
        let lastClass = this.lastClass()
        if(!lastClass){
            let yesterdayMidnight = this.yesterday
            let yesterday = new Date(new Date(new Date(yesterdayMidnight.setHours(23)).setMinutes(59)).setSeconds(59))
            let whatsnextYesterday = new WhatsnextStatic(this.schedule_base, yesterday)
            lastClass = whatsnextYesterday.enumerateLastClass()
        }else{
            lastClass = new Period(this.setTimeDate(lastClass, this.now))
        }
        return lastClass
    }

    nextWeekend(): Time | null {
        if(!this.schedule_base) return null
        // find the end of the last day of the week
        let date = this.now
        let incr = (date) => new Date(date.setDate(date.getDate()+1))
        while(date.getDay() != 5){ // in `Date` speak, 5 is friday (ref the array in day())
            date = incr(date)
        }
        let schedule = new WhatsnextStatic(this.schedule_base, date).schedule
        if(schedule){
            return schedule.end.setDate(date)
        }
        return null
    }

    enumerateNextTime(): Period | null {
        let thisClass = this.thisClass()
        if(!thisClass) return null

        let foundClass: any = null

        let isThisClass = false
        let needle = thisClass.name
        let instance: WhatsnextStatic = this
        while(!isThisClass){
            let tomorrow = instance.tomorrow
            instance = new WhatsnextStatic(this.schedule_base, tomorrow)

            let schedule = instance.schedule
            if(!schedule) continue;

            for(let period of schedule.periods){
                let name = period.name

                if(name === needle){
                    foundClass = period
                    isThisClass = true;
                    break;
                }
            }
        }

        if(!foundClass) return null
        foundClass = new Period(this.setTimeDate(foundClass, instance.now))
        return foundClass
    }

    thisClassCountdown(): any {
        let thisClass = this.thisClass()
        let ts = null
        if(thisClass){
            ts = countdown(this.now, thisClass.end.toDate(this.now))
        }
        return ts
    }

    nextClassCountdown(): any {
        let nextClass = this.nextClass()
        let ts = null
        if(nextClass){
            ts = countdown(this.now, nextClass.start.toDate(this.now))
        }
        return ts
    }

    enumerateNextClassCountdown(): any {
        let nextClass = this.enumerateNextClass()
        let ts = null
        if(nextClass){
            ts = countdown(this.now, nextClass.start.toDate())
        }
        return ts
    }

    endOfSchoolCountdown(): any {
        let ts = null
        if(this.schedule){
            let end = this.schedule["end"].toDate(this.now)
            if(this.now < end){
                ts = countdown(this.now, end)
            }
        }
        return ts
    }

    nextWeekendCountdown(): any {
        let ts = null
        let weekendDate = this.nextWeekend()
        if(weekendDate){
            let weekend = weekendDate.toDate()
            if(this.now){
                ts = countdown(this.now, weekend)
            }
        }
        return ts
    }

    nextTimeCountdown(): any {
        let ts = null
        let nextTime = this.enumerateNextTime()
        if(nextTime){
            let nextTimeStart = nextTime.start.toDate()
            if(this.now){
                ts = countdown(this.now, nextTimeStart)
            }
        }
        return ts
    }

}

class Whatsnext extends WhatsnextStatic {
    get now(){
        return new Date()
    }

    constructor(schedule_base: Object){
        super(schedule_base, new Date())
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
        //let seconds = this.date.getSeconds() // or this.start.getSeconds() or 0
        //let withseconds = new Date(newDate.setSeconds(seconds))
        return newDate//withseconds
    }
}

export default WhatsnextStatic;
export {WhatsnextStatic, Whatsnext, WhatsnextSim};
export { Time }