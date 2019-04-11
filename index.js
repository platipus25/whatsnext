import {Whatsnext, WhatsnextStatic, WhatsnextSim, transformFromTs} from "./src/whatsnext.ts"
import schedule_baseRaw from "./src/schedule2018-19.json"
let schedule_base = transformFromTs(schedule_baseRaw)

window.Whatsnext = Whatsnext
window.WhatsnextStatic = WhatsnextStatic
window.Whatsnext = WhatsnextSim
window.schedule_base = schedule_base
var whatsnext = new WhatsnextStatic(schedule_base, new Date(2018, 9, 5, 7, 55))
whatsnext = new WhatsnextSim(schedule_base, 1/60, new Date(2019, 3, 8, 9, 20))
//whatsnext = new Whatsnext(schedule_base)

setInterval(() => {
    document.getElementById("nextClass").innerText = (whatsnext.nextClass() || {name:""}).name
    document.getElementById("thisClass").innerText = (whatsnext.thisClass() || {name:""}).name
    //document.getElementById("endOfSchoolCountdown").innerHTML = ts? ts.toHTML() : "";whatsnext.endOfSchoolCountdown()
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
            whatsnext.enumerateNextClass(),
            whatsnext.time.toStringSeconds()
            )
        }, 1000)