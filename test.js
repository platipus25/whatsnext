import Whatsnext from './whatsnext.js'

const schedule_base_yaml = `
A_block: &A_block
  one: 9:30 - 10:45
  three: 11:00 - 12:15
  lunch: 12:15 - 13:05
  five: 13:05 - 14:20
  seven: 14:30 - 15:45


B_block: &B_block
  two: 9:30 - 10:45
  four: 11:00 - 12:15
  lunch: 12:15 - 13:05
  six: 13:05 - 14:20
  tutorial: 14:30 - 15:45


C: &C
  one: 9:30-10:00
  two: 10:10-10:40
  three: 10:50-11:20
  four: 11:30-12:00
  five: 13:00-13:30
  six: 13:40-14:10
  seven: 14:20-14:50


monday: *A_block
tuesday: *B_block
wednesday: *C
thursday: *A_block
friday: *B_block

"2020-08-21": *C
"2020-12-25": *A_block
`

let inst = new Whatsnext(schedule_base_yaml)
let iter = inst.classes(new Date(2020, 8, 14))

for (let i of iter) {
  console.log(i)
  console.log(inst.schedule_base)
  if (i.start > new Date(2020, 8, 20)) {
    break
  }
}
