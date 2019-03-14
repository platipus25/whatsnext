import Time from "./time.ts"

class Whatsnext {
    schedule_base: Object;
    date: Date
    constructor(schedule_base: Object, date: Date){
        this.schedule_base = schedule_base
        this.date = date
        console.log(this.day, this.schedule)
    }

    now(){
        return this.date
    }

    time(){
        return Time.fromDate(this.now())
    }

    private _day(){ 
        return this.day.slice(0, 3)
    }

    get day(){
        let days_of_the_week = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        let day = ""
        let intDay = this.now().getDay()
        day = days_of_the_week[intDay]

        // search this.schedule_base["minimum_days"] for this.now()
        for(let entry of this.schedule_base["minimum_days"]){
            if(entry.hasOwnProperty("date")){
                if(entry.date.toDateString() == this.now().toDateString()){
                    day = "minimum"
                }
            }
        }

        return day
    }

    get schedule(){
        return this.schedule_base[this._day()]
    }
}

class WhatsnextUpdating extends Whatsnext {
    now(){
        return new Date()
    }
}

export default Whatsnext;
export {WhatsnextUpdating, Whatsnext};