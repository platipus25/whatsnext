import Time from "./time"
import Period from "./period"
import { parse } from "./generator"

class Config {
    readonly periods: Period[] = [];

    constructor(obj: [{name: string, start: string, end: string}]){
        for (const { name, start, end} of obj){
            this.periods.push(
                new Period(
                        name,
                        parse(start),
                        parse(end),
                    ))
        }

        this.periods.sort(Period.compare)
    }
}

export { Config }