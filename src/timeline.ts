import Period from "./period"

class Timeline extends Array<Period> {
    constructor(obj: [{name: string, start: string, end: string}]){
        super()
        for (const { name, start, end} of obj){
            this.push(new Period(name, start, end))
        }
        this.sort(Period.compare)
    }
}

export default Timeline
export { Timeline }