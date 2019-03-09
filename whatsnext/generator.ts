import Time from "./time"
import ky from "ky"


let schedule_base = {};

(async () => { 
    var response = await ky("schedule2018-19.json").json()
    console.log(response)
})();
console.log(Time.fromDate(new Date()))

export default schedule_base;