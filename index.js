import schedulePromise from "./whatsnext/generator.ts"
import {Whatsnext, WhatsnextUpdating, WhatsnextUpdatingIsh} from "./whatsnext/whatsnext.ts"
import data from "schedule2018-19.json"

schedulePromise.then((schedule_base) => {
    var whatsnext = new Whatsnext(schedule_base, new Date(2018, 9, 5, 9, 41))
    whatsnext = new WhatsnextUpdatingIsh(schedule_base, new Date(2018, 9, 5, 7, 0), 1)
    //whatsnext = new WhatsnextUpdating(schedule_base)
    var cancel = 0
    whatsnext.endOfSchoolCountdown((ts) => console.log(ts.toString()))
    setInterval(() => {
        clearInterval(cancel)
        
        console.log(
                whatsnext.day,
                whatsnext.thisClass(),
                whatsnext.nextClass(),
                whatsnext.time().toString()
                )
            }, 1000)
})