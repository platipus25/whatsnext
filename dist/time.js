var Time = /** @class */ (function () {
    function Time(hour, minute) {
        // default to now
        if (hour == undefined) {
            hour = new Date();
        }
        // parse date
        if (typeof hour === "object") {
            if (hour.getHours != undefined && hour.getMinutes != undefined) {
                minute = hour.getMinutes();
                hour = hour.getHours();
            }
        }
        this.hour = hour;
        this.minute = minute;
        //console.log(`${hour}:${minute}`)
    }
    Time.prototype.toDate = function () {
        // get new date, set hour, then sed minute
        return new Date(new Date((new Date()).setHours(this.hour)).setMinutes(this.minute));
    };
    Time.prototype.toString = function () {
        var hour = (this.hour > 12 ? this.hour - 12 : this.hour); // make 12-hour
        return hour + ":" + this.minute;
    };
    Time.prototype.toCompare = function () {
        return (this.hour * 100) + this.minute;
    };
    return Time;
}());
export default Time;
//# sourceMappingURL=time.js.map