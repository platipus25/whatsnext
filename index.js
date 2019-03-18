import schedulePromise from "./whatsnext/generator.ts"
import {Whatsnext, WhatsnextUpdating, WhatsnextUpdatingIsh} from "./whatsnext/whatsnext.ts"
import data from "schedule2018-19.json"

schedulePromise.then((schedule_base) => {
    var whatsnext = new Whatsnext(schedule_base, new Date(2018, 9, 5, 9, 41))
    whatsnext = new WhatsnextUpdatingIsh(schedule_base, 0, new Date(2019, 3, 8, 9, 20))
    //whatsnext = new WhatsnextUpdatingIsh(schedule_base)
    var cancel = 0
    let printts = (ts) => console.log(ts.toString())
    whatsnext.endOfSchoolCountdown((ts) => {
        document.getElementById("endOfSchoolCountdown").innerHTML = ts.toHTML()
    })
    whatsnext.thisClassCountdown((ts) => {
        document.getElementById("thisClassCountdown").innerHTML = ts.toHTML()
    })
    whatsnext.nextClassCountdown((ts) => {
        document.getElementById("nextClassCountdown").innerHTML = ts.toHTML()
    })

    setInterval(() => {
        clearInterval(cancel)
        document.getElementById("nextClass").innerText = (whatsnext.nextClass() || {name:""}).name
        document.getElementById("thisClass").innerText = (whatsnext.thisClass() || {name:""}).name
        console.log(
                whatsnext.day,
                whatsnext.thisClass(),
                whatsnext.nextClass(),
                whatsnext.time().toString()
                )
            }, 1000)
})