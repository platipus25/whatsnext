
// this is probably going to be in yaml
let schedule_base = {
  //class_ids: ["one", "two", "three", "four", "lunch", "tutorial"],
  //schedule_ids: ["A_block", "B_block", "C"],

  /* Builtin schedules:
   *  monday
   *  tuesday
   *  wednesday
   *  thursday
   *  friday
   *  saturday?
   *  sunday?
   * Schedule ids can be replaced with iso dates
   * The value of a schedule can be replaced with the id of another schedule
   * */

  monday: "A_block",
  tuesday: "B_block",
  wednesday: "C",
  thursday: "A_block",
  friday: "B_block",

  //"9:30 - 10:45"
  //"9:30-10:45"
  //"9:30- 10:45"
  A_block: {
    one: "9:30 - 10:45",
    three: "11:00 - 12:15",
    lunch: "12:15 - 1:05",
    five: "1:05 - 2:20",
    seven: "2:30 - 3:45",
  },

  B_block: {
    two: "9:30 - 10:45",
    four: "11:00 - 12:15",
    lunch: "12:15 - 1:05",
    six: "1:05 - 2:20",
    tutorial: "2:30 - 3:45",
  },

  C: {
    one: "9:30-10:00",
    two: "10:10-10:40",
    three: "10:50-11:20",
    four: "11:30-12:00",
    five: "1:00-1:30",
    six: "1:40-2:10",
    seven: "2:20-2:50",
  },

  ["2020-08-21"]: "C",

}

const processed_schedule_base = {
  monday: {
    one: {start: {hour:9, minute:30}, end:{hour:10, minute:45}},
    three: {start:{hour:11, minute:0}, end:{hour:12, minute:15}},
    lunch: {start:{hour:12, minute:15}, end:{hour:13, minute:5}},
    five: {start: {hour:13, minute:5}, end: {hour:14, minute:20}},
    seven: {start:{hour:14, minute:30}, end: {hour:15, minute:45}},
  },

  tuesday: {
    two: {start:{hour:9, minute:30}, end: {hour:10, minute:45}},
    four: {start: {hour:11, minute:0}, end:{hour:12, minute:15}},
    lunch: {start: {hour:12, minute:15}, end:{hour:1, minute:5}},
    six: {start:{hour:13, minute:5}, end:{hour:14, minute:20}},
    tutorial: {start:{hour:14, minute:30}, end: {hour:15, minute:45}},
  },
  wednesday: {
    one: {start:{hour:9, minute:30}, end:{hour:10, minute:0}},
    two: {start:{hour:10, minute:10}, end:{hour:10, minute:40}},
    three: {start:{hour:10, minute:50}, end:{hour:11, minute:20}},
    four: {start:{hour:11, minute:30}, end:{hour:12, minute:0}},
    five: {start:{hour:13, minute:0}, end:{hour:13, minute:30}},
    six: {start:{hour:13, minute:40}, end:{hour:14, minute:10}},
    seven: {start:{hour:14, minute:20}, end:{hour:14, minute:50}},
  },
  thursday: {
    one: {start: {hour:9, minute:30}, end:{hour:10, minute:45}},
    three: {start:{hour:11, minute:0}, end:{hour:12, minute:15}},
    lunch: {start:{hour:12, minute:15}, end:{hour:13, minute:5}},
    five: {start: {hour:13, minute:5}, end: {hour:14, minute:20}},
    seven: {start:{hour:14, minute:30}, end: {hour:15, minute:45}},
  },
  friday: {
    two: {start:{hour:9, minute:30}, end: {hour:10, minute:45}},
    four: {start: {hour:11, minute:0}, end:{hour:12, minute:15}},
    lunch: {start: {hour:12, minute:15}, end:{hour:1, minute:5}},
    six: {start:{hour:13, minute:5}, end:{hour:14, minute:20}},
    tutorial: {start:{hour:14, minute:30}, end: {hour:15, minute:45}},
  },
  saturday: {},
  sunday: {},

  ["2020-11-21"]: {
    one: {start: {hour:9, minute:30}, end:{hour:10, minute:45}},
    three: {start:{hour:11, minute:0}, end:{hour:12, minute:15}},
    lunch: {start:{hour:12, minute:15}, end:{hour:13, minute:5}},
    wackywednesday: {start: {hour:13, minute:5}, end: {hour:14, minute:20}},
    seven: {start:{hour:14, minute:30}, end: {hour:15, minute:45}},
  },
}

class Whatsnext {
  constructor(date) {
    this.date = new Date(date)
    this.schedule = daily_classes(date)
    this.pointer = 0
  }

  next() {
    console.log(this.date.toString())
    let _class = this.schedule[this.pointer]
    this.pointer++;
    if (!_class) {
      this.date.setDate(this.date.getDate() + 1)
      this.schedule = daily_classes(this.date)
      this.pointer = 0
      return this.next()
    }
    return _class
  }

  prev() {
    console.log(this.date.toString())
    this.pointer--;
    let _class = this.schedule[this.pointer - 1] 
    if (!_class) {
      this.date.setDate(this.date.getDate() - 1)
      this.schedule = daily_classes(this.date)
      this.pointer = this.schedule.length - 1
      return this.next()
    }
    return _class
  }
}

