import Time from "./whatsnext/time.ts"
//import Period from "./whatsnext/period.js"
import schedulePromise from "./whatsnext/generator.ts"
import {Whatsnext, WhatsnextUpdating} from "./whatsnext/whatsnext.ts"
var now = Time.fromDate(new Date())
var now2 = new Time(14, 25)
console.log(now.toString())
console.log(now2.toString())

schedulePromise.then((schedule_base) => {
    var whatsnext = new Whatsnext(schedule_base, new Date())
    console.log(whatsnext)
})