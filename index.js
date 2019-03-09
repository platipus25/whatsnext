import Time from "./whatsnext/time.ts"
//import Period from "./whatsnext/period.js"
import schedule_base from "./whatsnext/generator.ts"
var now = Time.fromDate(new Date)
var now2 = new Time(14, 25)
console.log(now.toString(), now.toDate(), now.toCompare())
console.log(now2.toString(), now2.toDate(), now2.toCompare())

console.log(schedule_base)