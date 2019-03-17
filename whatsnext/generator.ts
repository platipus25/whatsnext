import Time from "./Time/src/time.ts"
import ky from "ky"


var request = ky("schedule2018-19.json").json()


let schedule_base = (request.then((data) => {
    for(let day in data){
        if(Array.isArray(data[day]) && data[day][0].hasOwnProperty("date")){
            for(let entry in data[day]){
                let date = data[day][entry].date
                data[day][entry].date = new Date(date.year, date.month, date.day)
            }
            continue;
        } 
        for(let periodIndex in data[day].periods){
            let period = data[day]["periods"][periodIndex]
            data[day]["periods"][periodIndex].start = Time.fromTs(period.start)
            data[day]["periods"][periodIndex].end = Time.fromTs(period.end)
            data[day]["periods"][periodIndex].class = {name: period.name}
        }
        data[day].start = Time.fromTs(data[day].start)
        data[day].end = Time.fromTs(data[day].end)
    }
    //console.log(data)
    return data;
}))

export default schedule_base;