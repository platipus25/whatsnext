declare class Time {
    year: number | null;
    month: number | null;
    day: number | null;
    hour: number;
    minute: number;
    second: number;
    constructor(hour: number, minute: number, second?: number | undefined, year?: number | null, month?: number | null, day?: number | null);
    static fromDate(date: Date): Time;
    static fromTs(ts: {
        hour: number;
        minute: number;
        second: number | undefined;
    }): Time;
    setDate(date: Date): void;
    toDate(date?: Date): Date;
    toString(): string;
    toStringSeconds(): string;
    toCompare(): number;
}
export default Time;
