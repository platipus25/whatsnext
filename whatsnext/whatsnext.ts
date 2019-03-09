import schedule_base from "./generator.js"
import Time from "./time.js"
import { NetworkInterfaceInfo } from "os";

class Whatsnext {
    schedule_base: Object;
    date: Date
    contructor(schedule_base, date: Date){
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