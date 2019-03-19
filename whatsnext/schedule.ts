
class ScheduleStatic {
    schedule_base: Object;
    private date: Date
    constructor(schedule_base: Object, date: Date){
        this.schedule_base = schedule_base
        this.date = date
    }

    get now(){
        return this.date
    }

    private _day(){
        return this.day.slice(0, 3).toLowerCase()
    }

    private get day(){ // I don't like:
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
}

class Schedule extends ScheduleStatic {
    get now(){
        return new Date()
    }
}

class ScheduleSim extends Schedule {
    start: Date;
    constructor(schedule_base: Object, public multiplier: number = 0, date: Date = new Date()){
        super(schedule_base, date)
        this.start = new Date()
    }

    get now(){
        return new Date(this.date.valueOf() + (this.multiplier*60 || 1)*(new Date().valueOf() - this.start.valueOf()))
    }
}

export default Schedule
export {Schedule, ScheduleSim, ScheduleStatic}