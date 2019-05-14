(async () => {
    let schedule_base = await window.ky.default.get("/examples/config_files/schedule2018-19.json").json()
    let inst = new whatsnext.Whatsnext(schedule_base)
    window.instance = inst
    window.schedule_base = schedule_base
    setInterval(() => {
        $("#thisClassCountdown").text(instance.thisClassCountdown())
        $("#nextClassCountdown").text(instance.enumerateNextClassCountdown())
        $("#endOfSchoolCountdown").text(instance.endOfSchoolCountdown())
        let thisClass = instance.thisClass()
        let nextClass = instance.enumerateNextClass()
        $("#thisClass").text(thisClass? thisClass.name: "")
        $("#nextClass").text(nextClass? nextClass.name: "")
    }, 1000)
    console.log(schedule_base)
})()

$("#whatsnext_form").on("submit",function(event){
    event.preventDefault()
    console.log(event)
    let interval = $("#interval").val()
    let date = new Date(Date.parse($("#date").val()))
    console.log(interval, date)
    window.instance = new whatsnext.WhatsnextSim(window.schedule_base, interval, date)
    //updateFormDate()
})

window.updateFormDate = () => $("#date").val((new Date()).toLocaleString())
updateFormDate()