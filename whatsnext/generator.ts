import Time from "./time.js"


let days = {
    min: [
            ["1", new Time(7, 55), new Time(8, 26)],
            ["2", new Time(8, 29), new Time(8, 58)],
            ["3", new Time(9, 1), new Time(9, 30)],
            ["4", new Time(9, 33), new Time(10, 2)],
            ["Break", new Time(10, 2), new Time(10, 12)],
            ["5", new Time(10, 15), new Time(10, 44)],
            ["6", new Time(10, 47), new Time(11, 16)],
            ["7", new Time(11, 19), new Time(11, 48)],
            ["8", new Time(11, 51), new Time(12, 20)]
        ],
    mon: [
            ["1", new Time(9, 28), new Time(10, 0)],
            ["2", new Time(10, 3), new Time(10, 35)],
            ["3", new Time(10, 38), new Time(11, 10)],
            ["Break", new Time(11, 10), new Time(11, 20)],
            ["4", new Time(11, 23), new Time(11, 55)],
            ["5", new Time(11, 58), new Time(12, 30)],
            ["Lunch", new Time(12, 30), new Time(13, 10)],
            ["6", new Time(13, 13), new Time(13, 45)],
            ["7", new Time(13, 48), new Time(14, 20)],
            ["8", new Time(14, 23) ,new Time(14, 55)]
        ],
    tue: [
            ["2", new Time(7, 55), new Time(8, 59)],
            ["3", new Time(9, 2), new Time(10, 0)],
            ["Break", new Time(10, 0), new Time(10, 10)],
            ["4", new Time(10, 13), new Time(11, 11)],
            ["6", new Time(11, 14), new Time(12, 12)],
            ["Lunch", new Time(12, 12), new Time(12, 52)],
            ["7", new Time(12, 56), new Time(13, 54)],
            ["8", new Time(13, 57), new Time(14, 55)]
        ],
    wed: [
            ["1", new Time(7, 55), new Time(8, 59)],
            ["3", new Time(9, 2), new Time(10, 0)],
            ["Break", new Time(10, 0), new Time(10, 10)],
            ["4", new Time(10, 13), new Time(11, 11)],
            ["5", new Time(11, 14), new Time(12, 12)],
            ["Lunch", new Time(12, 12), new Time(12, 52)],
            ["7", new Time(12, 56), new Time(13, 54)],
            ["8", new Time(13, 57), new Time(14, 55)]
        ],
    thu: [
            ["1", new Time(7, 55), new Time(8, 59)],
            ["2", new Time(9, 2), new Time(10, 0)],
            ["Break", new Time(10, 0), new Time(10, 10)],
            ["4", new Time(10, 13), new Time(11, 11)],
            ["5", new Time(11, 14), new Time(12, 12)],
            ["Lunch", new Time(12, 12), new Time(12, 52)],
            ["7", new Time(12, 56), new Time(13, 54)],
            ["8", new Time(13, 57), new Time(14, 55)]
        ],
    fri: [
            ["1", new Time(7, 55), new Time(8, 59)],
            ["2", new Time(9, 2), new Time(10, 0)],
            ["Break", new Time(10, 0), new Time(10, 10)],
            ["3", new Time(10, 13), new Time(11, 11)],
            ["5", new Time(11, 14), new Time(12, 12)],
            ["Lunch", new Time(12, 12), new Time(12, 52)],
            ["6", new Time(12, 56), new Time(13, 54)],
            ["7", new Time(13, 57), new Time(14, 55)]
        ]
}

let schedule_base = {}
let counter: number;
for (let dayIndex in days){
    let day = days[dayIndex]
    schedule_base[dayIndex] = []
    for(let periodIndex in day){
        let period = day[periodIndex]
        schedule_base[dayIndex][periodIndex] = {
            start: period[1],
            end: period[2],
            name: period[0],
            class: {name: period[0]}
        }
    }
}

//console.log(schedule_base)

export default schedule_base;