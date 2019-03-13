import Time from "./time.ts"
import ky from "ky"


var request = ky("schedule2018-19.json").json()


let schedule_base = (request.then((data) => {
    for(let day in data){
        for(let periodIndex in data[day].periods){
            let period = data[day]["periods"][periodIndex]
            data[day]["periods"][periodIndex].start = Time.fromTs(period.start)
            data[day]["periods"][periodIndex].end = Time.fromTs(period.end)
            data[day]["periods"][periodIndex].class = {name: period.name}
        }
        data[day].start = Time.fromTs(data[day].start)
        data[day].end = Time.fromTs(data[day].start)
    }
    //console.log(data)
    return data;
}))

export default schedule_base;