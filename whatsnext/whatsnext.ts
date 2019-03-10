//import schedule_base from "./generator.ts"
import Time from "./time.ts"

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
}

class WhatsnextUpdating extends Whatsnext {
    now(){
        return new Date()
    }
}

export default Whatsnext;
export {WhatsnextUpdating, Whatsnext};