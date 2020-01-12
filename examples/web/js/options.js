window.periods = {
    "0": {},
    "1": {},
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "7": {},    
}


let load = (periodsList = periods) => {
    for(period in periodsList){
        $(`#${period}-teacher`).val(periodsList[period].teacher || "")
        $(`#${period}-subject`).val(periodsList[period].name || "")
    }
}

let get = (periodList = periods) => {
    let list = {...periodList}
    for(period in list){
        list[period].teacher = $(`#${period}-teacher`).val()
        list[period].name = $(`#${period}-subject`).val()
    }
    periodList = list
    return list
}


$("#classes").on("submit", (event) => {
    event.preventDefault()
    console.log(event)
    get()
    store.set("periodInfo", periods)

    
    window.history.back();
})

$(document).ready(() => {
    let periods_stored = store.get("periodInfo")
    console.log(periods_stored)
    if(periods_stored) periods = periods_stored
    $("#classes").append($("<input type='submit' id='submit-top'/>"))
    for(period in periods){
        let addon = $(`
            <div class="period">
                <h4>Period ${period}:</h4>
                <input id="${period}-subject" placeholder="Subject" value="${periods[period].name || ""}"/>
                <input id="${period}-teacher" placeholder="Teacher" value="${periods[period].teacher || ""}"/>
            </div>
        `)
    
        $("#classes").append(addon)
    }
    
    $("#classes").append($("<input type='submit' id='submit-bottom'/>"))

})

/*setInterval(() => {
    store.set("periodInfo", periods)
    load()
}, 5000)*/  // very annoying when trying to input data