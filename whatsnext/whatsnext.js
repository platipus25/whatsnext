"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var time_1 = require("./time");
var countdown = require("countdown");
var Whatsnext = /** @class */ (function () {
    function Whatsnext(schedule_base, date) {
        this.schedule_base = schedule_base;
        this.date = date;
    }
    Whatsnext.prototype.now = function () {
        return this.date;
    };
    Whatsnext.prototype.time = function () {
        return time_1["default"].fromDate(this.now());
    };
    Whatsnext.prototype._day = function () {
        return this.day.slice(0, 3).toLowerCase();
    };
    Object.defineProperty(Whatsnext.prototype, "day", {
        get: function () {
            var days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var day = "";
            var intDay = this.now().getDay();
            day = days_of_the_week[intDay];
            // search this.schedule_base["minimum_days"] for this.now()
            for (var _i = 0, _a = this.schedule_base["minimum_days"]; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.hasOwnProperty("date") && entry.date.toDateString() == this.now().toDateString()) {
                    day = "Minimum";
                }
            }
            return day;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Whatsnext.prototype, "schedule", {
        get: function () {
            return this.schedule_base[this._day()];
        },
        enumerable: true,
        configurable: true
    });
    Whatsnext.prototype.thisClass = function () {
        var schedule = this.schedule;
        for (var _i = 0, _a = schedule.periods; _i < _a.length; _i++) {
            var period = _a[_i];
            var start = period.start.toCompare();
            var end = period.end.toCompare();
            var now = this.time().toCompare();
            //console.log(start, now, end)
            if (start <= now && end >= now) { // if start is before or is now & end is later than or is now
                return period;
            }
        }
        return null;
    };
    Whatsnext.prototype.nextClass = function () {
        var schedule = this.schedule;
        for (var periodIndex in schedule.periods) {
            var period = schedule.periods[periodIndex];
            var start = period.start.toCompare();
            //let end = period.end.toCompare()
            var now = this.time().toCompare();
            //console.log(start, now, end)
            if (now <= start) { // if it is before start
                return period;
            }
        }
        return null;
    };
    Whatsnext.prototype.thisClassCountdown = function (callback) {
        var thisClass = this.thisClass();
        if (thisClass == null)
            return null;
        return setInterval(function () {
            var ts = countdown(null, thisClass.end.toDate());
            callback(ts);
        }, 1000);
    };
    Whatsnext.prototype.nextClassCountdown = function (callback) {
        var nextClass = this.nextClass();
        if (nextClass == null)
            return null;
        return setInterval(function () {
            var ts = countdown(null, nextClass.end.toDate());
            callback(ts);
        }, 1000);
    };
    Whatsnext.prototype.endOfSchoolCountdown = function (callback) {
        var _this = this;
        return setInterval(function () {
            var ts = countdown(null, _this.schedule_base["end"].toDate());
            callback(ts);
        }, 1000);
    };
    return Whatsnext;
}());
exports.Whatsnext = Whatsnext;
var WhatsnextUpdating = /** @class */ (function (_super) {
    __extends(WhatsnextUpdating, _super);
    function WhatsnextUpdating() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WhatsnextUpdating.prototype.now = function () {
        return new Date();
    };
    return WhatsnextUpdating;
}(Whatsnext));
exports.WhatsnextUpdating = WhatsnextUpdating;
var WhatsnextUpdatingIsh = /** @class */ (function (_super) {
    __extends(WhatsnextUpdatingIsh, _super);
    function WhatsnextUpdatingIsh(schedule_base, date, multiplier) {
        if (multiplier === void 0) { multiplier = 0; }
        var _this = _super.call(this, schedule_base, date) || this;
        _this.multiplier = multiplier;
        _this.start = new Date();
        return _this;
    }
    WhatsnextUpdatingIsh.prototype.now = function () {
        return new Date(this.date.valueOf() + (this.multiplier * 60 || 1) * (new Date().valueOf() - this.start.valueOf()));
    };
    return WhatsnextUpdatingIsh;
}(Whatsnext));
exports.WhatsnextUpdatingIsh = WhatsnextUpdatingIsh;
exports["default"] = Whatsnext;
