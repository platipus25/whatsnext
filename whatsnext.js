"use strict";

import YAML from 'yaml'

/*
 ******************************UTILS********************************
 */

const time_regex = /(\d+):(\d+)/
const iso_date = /\d{4}-\d+-\d+/
const weekday_mapping = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] // 0-6 (0 is Sunday)
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
 ******************************EXPORTS********************************
 */

class Whatsnext {

  constructor(schedule_base) {
    if (typeof schedule_base == "string") {
      this.schedule_base = YAML.parse(schedule_base)
    } else {
      this.schedule_base = {...schedule_base}
    }
  }

  schedule(_date) {
    const date = new Date(_date)

    const day_of_week = weekday_mapping[date.getDay()]
    const date_id = to_iso_date(date)

    const schedule = this.schedule_base[date_id] || this.schedule_base[day_of_week] || {}

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

  *classes(_date) {
    const date = new Date(_date)
    while(true) {
      for (const _class of this.schedule(date)) {
        yield _class
      }
      date.setDate(date.getDate() + 1)
    }
  }
}

export default Whatsnext
export { Whatsnext }
