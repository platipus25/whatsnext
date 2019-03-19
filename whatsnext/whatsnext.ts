import Time from "./Time/src/time"
import Schedule from "./schedule";
let countdown = require("countdown")

class Whatsnext {
    schedule: Schedule;
    constructor(schedule: Schedule){
        this.schedule = schedule
    }
    
    get time(): Time {
        return Time.fromDate(this.now)
    }

    get now(): Date {
        return new Date()
    }


    thisClass(){
        let schedule = this.schedule
        if(!schedule) return null
        for(let period of schedule.periods){
            let start = period.start.toCompare()
            let end = period.end.toCompare()
            let now = this.time.toCompare()

            //console.log(start, now, end)

            if(start <= now && end >= now){ // if start is before or is now & end is later than or is now
                return period
            }
        }
        return null
    }

    nextClass(){
        let schedule = this.schedule
        if(!schedule) return null
        for(let periodIndex in schedule.periods){
            let period = schedule.periods[periodIndex]
            let start = period.start.toCompare()
            //let end = period.end.toCompare()
            let now = this.time.toCompare()

            //console.log(start, now, end)

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

export default Whatsnext;