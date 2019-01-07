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
    var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children()[0];
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
        subscheds = [];
        locs = [];
        for (var j=0; j<sched.length; j+=2){
            subschedObj = {};
            days = sched[j].split(" ")[0].split(/(?=[A-Z])/);
            subschedObj.days = days.map(function(e){return e.toUpperCase()});
            time = {}
            try {
                time.from = convertTime(sched[j].split(" ")[1]);
                time.to = convertTime(sched[j].split(" ")[3]);
            }
            catch(err) {
                // this means time is not provided
                continue;
            }
            subschedObj.time = time;
            subscheds.push(subschedObj)
            locs.push(sched[j+1]);
        }
        item.sched = subscheds;
        item.location = locs;
        schedule.push(item);
    }
    jsonObj.schedule = schedule;
    createICal(jsonObj);
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.msg === 'get_userdata') {
        var jsonO = parseSchedule();
        sendResponse(jsonO);
    }
});