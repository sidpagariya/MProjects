function injectJQ()
{
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
    script.onload = function(){performOps();}
    head.appendChild(script);
}
injectJQ()
function performOps(){
    /*$('<script>')
    .attr('type', 'text/javascript')
    .attr('src', '//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js')
    .attr('onload', parseSchedule())
    .appendTo('head');*/
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js";
    script.onload = function(){parseSchedule();}
    head.appendChild(script);
}
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
    for (var i=1; i<tbodymain.childElementCount; i++){
        item = {}
        var course = tbodymain.children[i].children[0].firstElementChild.innerText.split('\n');
        classI = {}
        classI.class = course[0].split("-")[0];
        classI.sec = course[0].split("-")[1];
        classI.type = course[1].split(" ")[0];
        classI.nbr = course[1].split(" ")[1].slice(1, -1);
        item.course = classI;
        var sched = tbodymain.children[i].children[1].firstElementChild.innerText.split('\n');
        //item["sched"] = sched[0];
        fullSched = {};
        days = sched[0].split(" ")[0].split(/(?=[A-Z])/);
        fullSched.days = days.map(function(e){return e.toUpperCase()});
        time = {}
        time.from = convertTime(sched[0].split(" ")[1]);
        time.to = convertTime(sched[0].split(" ")[3]);
        //fullSched["time"] = sched[0].split(" ")[1] + " to " + sched[0].split(" ")[3];
        fullSched.time = time;
        item.sched = fullSched;
        item.location = sched[1];
        schedule.push(item);
    }
    jsonObj.schedule = schedule;
    createICal(jsonObj);
}
var vtimezone_str = `
BEGIN:VTIMEZONE
TZID:US-Eastern
LAST-MODIFIED:19870101T000000Z
BEGIN:STANDARD
DTSTART:19971026T020000
RDATE:19971026T020000
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19971026T020000
RDATE:19970406T020000
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
END:VTIMEZONE
`
function createICal(jsonObj){
    console.log(jsonObj);
    window.json = jsonObj;
    let vtimezoneComp = new ICAL.Component(ICAL.parse(vtimezone_str));
    let tzid = vtimezoneComp.getFirstPropertyValue('tzid');
    let timezone = new ICAL.Timezone({
        component: vtimezoneComp,
        tzid
    });
    let cal = new ICAL.Component(['vcalendar', [["prodid", {}, "text", "-//SidPagariya.ML//UMich "+jsonObj['term']+"//EN"],
    ["version", {}, "text", "2.0"]], []]);
    arbor_time = 'America/Detroit';
    cal.updatePropertyWithValue('X-WR-TIMEZONE', arbor_time);
    cal.addSubcomponent(vtimezoneComp);
    var start_date = new Date(2018, 8, 5);
    var end_date = new Date(2018, 11, 12);

    for(course of jsonObj.schedule) {
        let classTitle = course.course.class;
        let classType = course.course.type;
        let classSec = course.course.type;
        let classNbr = course.course.nbr;
        let byday = course.sched.days;
        let start_time = course.sched.time.from;
        let end_time = course.sched.time.to;
        let dtstart = new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate(), start_time.hr, start_time.min, 0);
        let dtend = new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate(), end_time.hr, end_time.min, 0);
        let location = course['location'];
        String.prototype.newFormat = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
            });
        };
        let event_name = "{0} - {1} ({2}, {3})".newFormat(classTitle, classType, classSec, classNbr);
        let vevent = new ICAL.Component('vevent'),
        event = new ICAL.Event(vevent);
        event.summary = event_name;
        event.startDate = ICAL.Time.fromJSDate(dtstart).convertToZone(timezone);
        event.endDate = ICAL.Time.fromJSDate(dtend).convertToZone(timezone);
        event['location'] = location;
        let rrule = new ICAL.Recur({
            'freq': 'WEEKLY',
            'until': ICAL.Time.fromJSDate(end_date).convertToZone(timezone),
            'byday': byday
        });
        vevent.updatePropertyWithValue('rrule', rrule);
        if (classSec != 'MID'){
            cal.addSubcomponent(vevent);
        }
    }
    //console.log(cal.toString());
    let calendar_str = cal.toString();
    let download_str_uri = 'data:text/calender;charset=utf-8,' + encodeURIComponent(calendar_str);
    console.log(download_str_uri);
    downloadURI(download_str_uri, jsonObj['term']+'.ics');
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}