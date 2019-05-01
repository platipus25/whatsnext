import Time from "../node_modules/time_ts/dist/time";
declare class Period {
    name: string;
    start: Time;
    end: Time;
    class: {
        name: string;
    };
    constructor(obj: {
        name: string;
        start: Time;
        end: Time;
        class: Object | undefined;
    });
}
export default Period;
