let { Whatsnext, Time } = require("../../dist/whatsnext.node.js")
let schedule_base = require("../config_files/schedule2018-19.json")

let inst = new Whatsnext(schedule_base)
console.log(
    inst.now,
    inst.thisClass(),
    inst.enumerateNextClass(),
    inst.setTimeDate({date: Time.fromDate(new Date())}, new Date()),
    Time.fromDate(new Date())
)