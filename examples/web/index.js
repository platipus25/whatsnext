//import schedule_baseRaw from "./woodland2019.json"//"./schedule2018-19.json"

(async () => {

let schedule_baseRaw = {}
console.log(window.whatsnext)
for(let i in window.whatsnext){
    window[i] = window.whatsnext[i]
}
let transformFromTs = window.whatsnext.transformFromTs

let schedule_base = transformFromTs(schedule_baseRaw)



window.schedule_base = schedule_base
var whatsnext = new WhatsnextStatic(schedule_base, new Date(2018, 9, 5, 7, 55))
whatsnext = new WhatsnextSim(schedule_base, 60/6, new Date(2019, 3, 8, 9, 20))
//whatsnext = new Whatsnext(schedule_base)

setInterval(() => {
    document.getElementById("nextClass").innerText = (whatsnext.nextClass() || {name:""}).name
    document.getElementById("thisClass").innerText = (whatsnext.thisClass() || {name:""}).name
    try {
        document.getElementById("endOfSchoolCountdown").innerHTML = whatsnext.endOfSchoolCountdown().toHTML()
        document.getElementById("thisClassCountdown").innerHTML = whatsnext.thisClassCountdown().toHTML()
        document.getElementById("nextClassCountdown").innerHTML = whatsnext.nextClassCountdown().toHTML()
    } catch {
        document.getElementById("endOfSchoolCountdown").innerHTML = null
        document.getElementById("thisClassCountdown").innerHTML = null
        document.getElementById("nextClassCountdown").innerHTML = null
    }
    console.log(
            whatsnext.day,
            whatsnext.schedule,
            whatsnext.thisClass(),
            whatsnext.enumerateNextClass(),
            whatsnext.time.toStringSeconds()
            )
        }, 1000)
})()