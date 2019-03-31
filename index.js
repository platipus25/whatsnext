import schedule_base from "./whatsnext/generator.ts"
import {Whatsnext, WhatsnextStatic, WhatsnextSim} from "./whatsnext/whatsnext.ts"


var whatsnext = new WhatsnextStatic(schedule_base, new Date(2018, 9, 5, 7, 55))
whatsnext = new WhatsnextSim(schedule_base, 60, new Date(2019, 3, 8, 9, 20))
//whatsnext = new Whatsnext(schedule_base)

setInterval(() => {
    document.getElementById("nextClass").innerText = (whatsnext.nextClass() || {name:""}).name
    document.getElementById("thisClass").innerText = (whatsnext.thisClass() || {name:""}).name
    whatsnext.endOfSchoolCountdown((ts) => {
        document.getElementById("endOfSchoolCountdown").innerHTML = ts? ts.toHTML() : ""
    })
    whatsnext.thisClassCountdown((ts) => {
        document.getElementById("thisClassCountdown").innerHTML = ts? ts.toHTML() : ""
    })
    whatsnext.nextClassCountdown((ts) => {
        document.getElementById("nextClassCountdown").innerHTML = ts?ts.toHTML() : ""
    })
    console.log(
            whatsnext.day,
            whatsnext.schedule,
            whatsnext.thisClass(),
            whatsnext.nextClass(),
            whatsnext.enumerateNextClass(),
            whatsnext.weekend().toDate(),
            whatsnext.time.toStringSeconds()
            )
        }, 1000)