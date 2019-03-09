import Time from "./time.ts"
import ky from "ky"


var request = ky("schedule2018-19.json").json()


let schedule_base = (request.then((data) => {
    for(let day in data){
        for(let periodIndex in data[day]){
            let period = data[day][periodIndex]
            data[day][periodIndex].start = Time.fromTs(period.start)
            data[day][periodIndex].end = Time.fromTs(period.end)
        }
    }
    //console.log(data)
    return data;
}))

export default schedule_base;