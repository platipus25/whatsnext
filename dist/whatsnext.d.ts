import Time from "../node_modules/time_ts/dist/time";
import Period from "./period.ts";
declare class WhatsnextStatic {
    schedule_base: Object;
    date: Date;
    constructor(schedule_base: Object, date: Date);
    readonly now: Date;
    readonly tomorrow: Date;
    readonly time: Time;
    private setTimeDate;
    private _day;
    readonly day: string;
    readonly schedule: {
        start: Time;
        end: Time;
        periods: [Period];
    } | null;
    thisClass(): Period | null;
    nextClass(): Period | null;
    enumerateNextClass(): Period | null;
    nextWeekend(): Time | null;
    enumerateNextTime(): Period | null;
    thisClassCountdown(): any;
    nextClassCountdown(): any;
    enumerateNextClassCountdown(): any;
    endOfSchoolCountdown(): any;
    nextWeekendCountdown(): any;
    nextTimeCountdown(): any;
}
declare class Whatsnext extends WhatsnextStatic {
    readonly now: Date;
}
declare class WhatsnextSim extends Whatsnext {
    multiplier: number;
    start: Date;
    constructor(schedule_base: Object, multiplier?: number, date?: Date);
    readonly now: Date;
}
export default WhatsnextStatic;
export { WhatsnextStatic, Whatsnext, WhatsnextSim };
export * from "./generator.ts";
export { Time };
