import Time from "./Time/dist/time";
declare class WhatsnextStatic {
    schedule_base: Object;
    date: Date;
    constructor(schedule_base: Object, date: Date);
    readonly now: Date;
    readonly tomorrow: Date;
    readonly time: Time;
    private _day;
    readonly day: string;
    readonly schedule: any;
    thisClass(): any;
    nextClass(): any;
    enumerateNextClass(): any;
    weekend(): any;
    enumerateNextTime(): any;
    thisClassCountdown(): any;
    nextClassCountdown(): any;
    enumerateNextClassCountdown(): any;
    endOfSchoolCountdown(): any;
    weekendCountdown(): any;
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
