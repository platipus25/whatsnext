import Time from "./Time/src/time.ts"

interface Class {
    name:string;
}

interface Period { 
    name: string;
    start: Time;
    end: Time;
    class: Class;
}

export default Period;