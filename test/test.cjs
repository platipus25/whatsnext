let { Whatsnext } = require("../dist/whatsnext.js")
let fs = require('fs')
fs.readFile("mvla2020-21.yaml", "utf8", (err, schedule_base) => {

  let inst = new Whatsnext(schedule_base)
  let iter = inst.classes(new Date(2020, 7, 16, 14, 30))

  for (let i = 0; i<5; i++) {
    console.log(iter.next().value)
  }
})


