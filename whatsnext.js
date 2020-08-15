"use strict";

import YAML from 'yaml'

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

const time_regex = /(\d+):(\d+)/
const iso_date = /\d{4}-\d+-\d+/
const weekday_mapping = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
const parse_time = str => {
  const result = time_regex.exec(str)
  const hour = parseInt(result[1], 10)
  const minute = parseInt(result[2], 10)
  return { hour, minute }
}
const parse_timespan = str => {
  const times = str.split("-")
  return {
    start:parse_time(times[0]),
    end: parse_time(times[1]),
  }
}
const to_date = (hourminuteobj, _date) =>  {
  let date = new Date(_date)
  date.setHours(hourminuteobj.hour, hourminuteobj.minute, 0, 0)
  return date
}

const to_iso_date = date => {
  const pad = (num) => num < 10? '0'+num: num
  return date.getFullYear() + '-' + pad(date.getMonth()) + '-' + pad(date.getDate())
}

/*
function preprocess(schedule_base_raw) {
  const schedule_base = {}

  const found_dates = Object.keys(schedule_base_raw).filter(key => iso_date.test(key))
  const weekdays = weekday_mapping

  for (const day of [...weekdays,...found_dates]) {
    const schedule = schedule_base_raw[day]
    schedule_base[day] = {}
    if (!schedule) continue
    for (const [class_id, value] of Object.entries(schedule)) {
      const [start, end] = value.split('-')
      schedule_base[day][class_id] = {
        start: parse_time(start),
        end: parse_time(end),
      }
    }
  }

  return schedule_base
}*/

const schedule_base = YAML.parse(schedule_base_yaml)
//const schedule_base = preprocess(schedule_base_raw)

/*
 * Only want at monday-friday and oneoff dates after processing
 */


function daily_classes(_date) {
  const date = new Date(_date)

  // 0-6 (0 is Sunday)
  const day_of_week = weekday_mapping[date.getDay()]
  const date_id = to_iso_date(date)

  const schedule = schedule_base[date_id] || schedule_base[day_of_week] || {}

  const classes = []
  for (const [class_id, value] of Object.entries(schedule)) {
    if (typeof value == "string") schedule[class_id] = parse_timespan(value)
    const {start, end} = schedule[class_id]
    classes.push({
      id: class_id,
      start: to_date(start, date),
      end: to_date(end, date),
    })
  }

  return classes
}

function* generate_classes(_date) {
  const date = new Date(_date)
  while(true) {
    for (const _class of daily_classes(date)) {
      yield _class
    }
    date.setDate(date.getDate() + 1)
  }
}


let classes = generate_classes(new Date(2020, 8, 14))



for (let i of classes) {
  console.log(i)
  if (i.start > new Date(2021, 0, 10)) {
    break
  }
}
