import Time from "./whatsnext/time.ts"
//import Period from "./whatsnext/period.js"
import schedulePromise from "./whatsnext/generator.ts"
import {Whatsnext, WhatsnextUpdating, WhatsnextUpdatingIsh} from "./whatsnext/whatsnext.ts"
var now = Time.fromDate(new Date())
var now2 = new Time(14, 25)
console.log(now.toString())
console.log(now2.toString())

schedulePromise.then((schedule_base) => {
    var whatsnext = new Whatsnext(schedule_base, new Date(2018, 9, 5, 9, 41))
    whatsnext = new WhatsnextUpdatingIsh(schedule_base, new Date(2018, 9, 5, 7, 0), 1)
    var cancel = 0
    setInterval(() => {
        clearInterval(cancel)
        console.log(whatsnext,
                whatsnext.day,
                whatsnext.schedule,
                cancel = whatsnext.thisClassCountdown((ts) => { 
                    console.log(`${ts}`)
                }),
                whatsnext.thisClass(),
                whatsnext.nextClass(),
                whatsnext.now()
                )
            }, 1000)
})