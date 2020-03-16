let { Whatsnext, Time } = require("../../public/whatsnext.js")
let m = require("../..")
let schedule_base = require("../config_files/MVHS2019-20_new.json")

let inst = new Whatsnext(schedule_base)
const config_id = "B"

let cfg = inst.schedule_base.getTimeline(config_id)

console.log(
    inst,
    cfg
)

schedule_base[config_id][0] = {name:"A totally different name", start:"2:30", end:"4:5"}

console.log(inst.schedule_base.getTimeline(config_id), cfg)

console.log(
    Object.isFrozen(schedule_base)
)