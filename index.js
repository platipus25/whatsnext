import Time from "./whatsnext/time.ts"
//import Period from "./whatsnext/period.js"
import schedulePromise from "./whatsnext/generator.ts"
import {Whatsnext, WhatsnextUpdating} from "./whatsnext/whatsnext.ts"
var now = Time.fromDate(new Date())
var now2 = new Time(14, 25)
console.log(now.toString())
console.log(now2.toString())

schedulePromise.then((schedule_base) => {
    var whatsnext = new Whatsnext(schedule_base, new Date(2018, 9, 5, 9, 41))
    //whatsnext = new WhatsnextUpdating(schedule_base)
    console.log(whatsnext,
                whatsnext.day,
                whatsnext.schedule,
                whatsnext.thisClassCountdown((ts) => { 
                    document.write(`${ts.toString()}</br>`)
                }),
                whatsnext.thisClass(),
                whatsnext.nextClass())
})