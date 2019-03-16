import Time from "./time.ts";
import ky from "ky";
var request = ky("schedule2018-19.json").json();
var schedule_base = (request.then(function (data) {
    for (var day in data) {
        if (Array.isArray(data[day]) && data[day][0].hasOwnProperty("date")) {
            for (var entry in data[day]) {
                var date = data[day][entry].date;
                data[day][entry].date = new Date(date.year, date.month, date.day);
            }
            continue;
        }
        for (var periodIndex in data[day].periods) {
            var period = data[day]["periods"][periodIndex];
            data[day]["periods"][periodIndex].start = Time.fromTs(period.start);
            data[day]["periods"][periodIndex].end = Time.fromTs(period.end);
            data[day]["periods"][periodIndex].class = { name: period.name };
        }
        data[day].start = Time.fromTs(data[day].start);
        data[day].end = Time.fromTs(data[day].start);
    }
    //console.log(data)
    return data;
}));
export default schedule_base;
//# sourceMappingURL=generator.js.map