import schedulePromise from "./whatsnext/generator.ts"
import {Whatsnext, WhatsnextStatic, WhatsnextSim} from "./whatsnext/whatsnext.ts"
import data from "schedule2018-19.json"

schedulePromise.then((schedule_base) => {
    var whatsnext = new WhatsnextStatic(schedule_base, new Date(2018, 9, 5, 7, 55))
    whatsnext = new WhatsnextSim(schedule_base, 1, new Date(2019, 3, 8, 9, 20))
    //whatsnext = new WhatsnextSim(schedule_base)
    var cancel = 0
    let endOfSchoolCountdown = whatsnext.endOfSchoolCountdown((ts) => {
        document.getElementById("endOfSchoolCountdown").innerHTML = ts? ts.toHTML() : ""
    })
    let thisClassCountdown = whatsnext.thisClassCountdown((ts) => {
        document.getElementById("thisClassCountdown").innerHTML = ts? ts.toHTML() : ""
    })
    let nextClassCountdown = whatsnext.nextClassCountdown((ts) => {
        document.getElementById("nextClassCountdown").innerHTML = ts?ts.toHTML() : ""
    })

    setInterval(() => {
        clearInterval(cancel)
        document.getElementById("nextClass").innerText = (whatsnext.nextClass() || {name:""}).name
        document.getElementById("thisClass").innerText = (whatsnext.thisClass() || {name:""}).name
        endOfSchoolCountdown()
        thisClassCountdown()
        nextClassCountdown()
        console.log(
                whatsnext.day,
                whatsnext.thisClass(),
                whatsnext.nextClass(),
                whatsnext.time().toStringSeconds()
                )
            }, 1000)
})