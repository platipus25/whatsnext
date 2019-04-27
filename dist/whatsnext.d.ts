import Time from "../node_modules/time_ts/dist/time";
declare class WhatsnextStatic {
    schedule_base: Object;
    date: Date;
    constructor(schedule_base: Object, date: Date);
    readonly now: Date;
    readonly tomorrow: Date;
    readonly time: Time;
    setTimeDate(obj: any, date: any): any;
    private _day;
    readonly day: string;
    readonly schedule: any;
    thisClass(): any;
    nextClass(): any;
    enumerateNextClass(): any;
    nextWeekend(): any;
    enumerateNextTime(): any;
    thisClassCountdown(): null;
    nextClassCountdown(): null;
    enumerateNextClassCountdown(): null;
    endOfSchoolCountdown(): null;
    nextWeekendCountdown(): null;
    nextTimeCountdown(): null;
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
