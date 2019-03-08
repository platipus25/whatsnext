import Time from "./time"

interface Class {
    name:string;
}

interface Period { 
    name: string;
    start: Time;
    end: Time;
    class: Class;
}