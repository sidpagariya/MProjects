function convertTime(time){
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/AM|PM/)[0];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours<10) sHours = "0" + sHours;
    if(minutes<10) sMinutes = "0" + sMinutes;
    return {hr:+sHours,min:+sMinutes};
}
function parseSchedule(){
    //var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children()[0];
    var tbody;
    if (!$('#ptifrmtgtframe')[0]){
        tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]').children()[0];
    } else {
        tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children()[0];
    }
    var termsched = tbody.firstElementChild.firstElementChild.firstElementChild.innerText
    var tbodymain = tbody.children[1].firstElementChild.firstElementChild.firstElementChild
    var jsonObj = {};
    jsonObj.term = termsched;
    var schedule = [];
    var offset = 0;
    if (tbodymain.children[0].children.length != 2){
        offset = 1;
    }
    for (var i=1; i<tbodymain.childElementCount; i++){
        item = {}
        var course = tbodymain.children[i].children[0+offset].firstElementChild.innerText.split('\n');
        classI = {}
        classI.class = course[0].split("-")[0];
        classI.sec = course[0].split("-")[1];
        classI.type = course[1].split(" ")[0];
        classI.nbr = course[1].split(" ")[1].slice(1, -1);
        item.course = classI;
        var sched = tbodymain.children[i].children[1+offset].firstElementChild.innerText.split('\n');
        fullSched = {};
        days = sched[0].split(" ")[0].split(/(?=[A-Z])/);
        fullSched.days = days.map(function(e){return e.toUpperCase()});
        time = {}
        time.from = convertTime(sched[0].split(" ")[1]);
        time.to = convertTime(sched[0].split(" ")[3]);
        fullSched.time = time;
        item.sched = fullSched;
        item.location = sched[1];
        schedule.push(item);
    }
    jsonObj.schedule = schedule;
    return jsonObj;
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.msg === 'get_userdata') {
        var jsonO = parseSchedule();
        sendResponse(jsonO);
    }
});