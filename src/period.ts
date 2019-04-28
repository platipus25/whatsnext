import Time from "../node_modules/time_ts/dist/time"

class Period { 
    name: string;
    start: Time;
    end: Time;
    class: { name: string };
    constructor(obj: {name: string, start: Time, end: Time, class: Object | undefined}){
        this.name = obj.name
        this.start = obj.start
        this.end = obj.end
        this.class = { name: obj.name, ...obj.class }
    }
}

export default Period;
