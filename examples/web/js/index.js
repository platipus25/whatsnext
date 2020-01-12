//import { isRegExp } from "util";
const { HOURS, MINUTES, SECONDS, DAYS, WEEKS, MONTHS } = whatsnext.countdown;
whatsnext.countdown.setLabels(
	' ms|s| min| hr| day| week| month| year| decade| century| millennium',
    ' ms|s| min| hrs| days| weeks| months| years| decades| centuries| millennia',
	' and ',
	', ',
	'',
    (n) => {return n.toString(10).padStart(1, '0')});

const formatTimespan = (ts_in) => {
    let { seconds, minutes, hours, days, weeks } = ts_in
    let ts = { seconds, minutes, hours, days, weeks }
    for(i in ts){
        if(!ts[i]) ts[i] = 0
        ts[i] = ts[i].toString()
    }
    for(i of ["seconds", "minutes"]){
        ts[i] = ts[i].padStart(2, "0")
    }
    
    ({ seconds, minutes, hours, days, weeks } = ts)
    short = `${minutes}:${seconds}`
    if(hours != false){
        if(minutes == false){
            short = `${hours} hrs`
        }else{
            short = `${hours}:${short}`
        }
    }
    if(hours == false && minutes == false && seconds == false){
        short = ""
    }
    if(weeks != false){
        weeks = `${weeks} week`
        if(parseInt(ts.weeks) > 1){
            weeks += "s"
        }
        if(short != false){
            weeks += ", "
        }
    }else {
        weeks = ""
    }
    if(days != false){
        days = `${days} day`
        if(parseInt(ts.days) > 1){
            days += "s"
        }
        if(short != false){
            days += ", "
        }
    }else {
        days = ""
    }
    if(weeks != false && days != false){
        weeks += ", "
    }
    output = `${weeks}${days}${short}`
    //console.log(ts_in.toString(), output)
    return output
}

(async () => {
    let schedule_base = await $.getJSON("MVHS2019-20.json"); // /schedule2018-19.json
    window.schedule_base = {...schedule_base}

    schedule_base = applyPersonalizedClasses(schedule_base)
    
    /*
    //let nextSchool = new whatsnext.WhatsnextStatic(schedule_base, new Date()).enumerateNextClass().start.toDate()
    nextSchool = new Date(2018, 8, 5, 8, 30)

    console.log(nextSchool)
    window.inst = new whatsnext.WhatsnextSim(schedule_base, 0, nextSchool);//new Date(2019, 2, 8, 9, 30));*/
    
    window.inst = new whatsnext.Whatsnext(schedule_base);
    console.log(inst)
    updateFrame()

})()
console.log(whatsnext)

// pre-processing "methods"

const applyPersonalizedClasses = (base) => {
    periods = store.get("periodInfo")
    for(periodName in periods){
        let periodInfo = periods[periodName]
        let array = getAllInstancesOfClass(base, periodName)
        for(let instance of array){
            instance.class = {...instance.class, ...periodInfo}
            if(!$.trim(instance.class.name)){
                instance.class.name = periodName
            }
        }
    }

    return base
}

const getAllInstancesOfClass = (obj, periodName, found = []) => {
    if(!obj) return found
    let prototype = Object.getPrototypeOf(obj)
    if(prototype != Object.prototype && prototype != Array.prototype) return found
    //console.log(obj, periodName, found);
    for(fieldName in obj){
        let value = obj[fieldName]
        if(fieldName == "name" && value == periodName){
            found =  [...found, obj]
        }else {
            found = getAllInstancesOfClass(value, periodName, found)
        }
    }

    return found
} 

// frame handling "methods":

const numberToFancy = (num) => {
    let endings = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]
    num = Number(num)
    num = num.toFixed(0)
    let onesPlace = Number(num.charAt(num.length-1))
    let ending = endings[onesPlace]
    return `${num}${ending}`
}

const hasNumber = (str) => !isNaN(Number($.trim(str))) && $.trim(str) != ""

const countdown = (id, units = null, max = 2) => {
    let countdownUnits = units || SECONDS | MINUTES | HOURS | DAYS | WEEKS | MONTHS; // minutes | hours | days | weeks | months
    let value = inst[id](countdownUnits, max) || ""
    let node = $( `#${ id }` )
    let parent = node.parent()

    if(value){
        parent.show()
    }else{
        parent.hide()
    }
    
    if(value) value = formatTimespan(value, "number class='bold'")
    node.html(value)
}

const className = (id) => {
    let value = inst[id]() || ""
    let txt = ""
    let periodValue = ""
    let node = $( `#${ id }` )
    let periodNode = $( `#${ id }-period` )
    let parent = node.parent()

    if(value){
        parent.show()
    }else{
        parent.hide()
    }
    
    if(value) txt = value.class.name.toString()
    if(hasNumber(txt)){
        periodNode.hide()
        txt = numberToFancy(txt)
    }else if(hasNumber(value.name)){
        periodNode.show()
        periodValue = `<span class="grey">(</span>${value.name}<span class="grey">)</span>`
    }
    

    node.text(txt)
    periodNode.html(periodValue)
}

const nextDayOff = (id) => {
    let value = inst[id]() || ""
    let node = $( `#${ id }` )
    let parent = node.parent()
    
    if(value) value = value.name

    if(value){
        parent.show()
    }else{
        parent.hide()
    }

    node.text(value)
}

const classAttribute = (id, attrId) => {
    let value = inst[id]() || ""
    let node = $( `#${ id }-${ attrId }` )
    let parent = node.parent()
    
    if(value) value = value.class[attrId].toString()
    if(hasNumber(value)) value = numberToFancy(value)

    if(value){
        parent.show()
    }else{
        parent.hide()
    }

    node.text(value)
}

const percent = () => {
    let value = inst.percent || 0
    let node = $( "#percent" )
    let bar_node = $( "#percent_bar" )
    let parent = node.parent()

    bar_node.css("width", `${value}%`)
    bar_node.css("margin-left", `calc(50% - ${value/2}%)`)

    node.text(`${value.toFixed(1)}%`) // value.toFixed(0)

    if(value){
        parent.show()
    }else{
        parent.hide()
    }
}

const updateFrame = () => {
    //let inst = window.inst
    countdown("thisClassCountdown")
    countdown("enumerateNextClassCountdown")
    className("thisClass")
    className("enumerateNextClass")
    countdown("endOfSchoolCountdown")
    nextDayOff("nextDayOff")
    countdown("nextDayOffCountdown", HOURS | DAYS | WEEKS, 1)
    percent()
    
}

let frameUpdateId = setInterval(updateFrame, 1000)

// Chrome extension specific "methods"

const openOptions = () => {
    var chrome
    if(!!chrome && chrome["runtime"]){
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        }
    }else{
        window.open("options.html", "_self")
    }
}

$("#openOptions").on("click", openOptions)