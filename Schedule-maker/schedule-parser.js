injectJQ()

function injectJQ() {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
    script.onload = function() { performOps(); }
    head.appendChild(script);
}

function performOps() {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js";
    script.onload = function() { parseSchedule(); }
    head.appendChild(script);
}

function convertTime(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/AM|PM/);
    if (AMPM !== null && AMPM !== undefined) {
        AMPM = AMPM[0];
        if(AMPM == "PM" && hours<12) hours = hours+12;
        if(AMPM == "AM" && hours==12) hours = hours-12;
    }
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return { hr: +sHours, min: +sMinutes };
}

function parseSchedule() {
    var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children()[0];
    var termsched = tbody.firstElementChild.firstElementChild.firstElementChild.innerText
    var tbodymain = tbody.children[1].firstElementChild.firstElementChild.firstElementChild
    var jsonObj = {};
    jsonObj.term = termsched;
    var schedule = [];
    var offset = 0;
    if (tbodymain.children[0].children.length != 2) {
        offset = 1;
    }
    for (var i = 1; i < tbodymain.childElementCount; i++) {
        item = {}
        var course = tbodymain.children[i].children[0 + offset].firstElementChild.innerText.split('\n');
        classI = {}
        classI.class = course[0].split("-")[0];
        classI.sec = course[0].split("-")[1];
        classI.type = course[1].split(" ")[0];
        classI.nbr = course[1].split(" ")[1].slice(1, -1);
        item.course = classI;
        var sched = tbodymain.children[i].children[1 + offset].firstElementChild.innerText.split('\n');
        subscheds = [];
        locs = [];
        for (var j = 0; j < sched.length; j += 2) {
            subschedObj = {};
            days = sched[j].split(" ")[0].split(/(?=[A-Z])/);
            subschedObj.days = days.map(function(e) { return e.toUpperCase() });
            time = {}
            try {
                time.from = convertTime(sched[j].split(" ")[1]);
                time.to = convertTime(sched[j].split(" ")[3]);
            } catch (err) {
                // this means time is not provided
                continue;
            }
            subschedObj.time = time;
            subscheds.push(subschedObj)
            locs.push(sched[j + 1]);
        }
        item.sched = subscheds;
        item.location = locs;
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
`;

function weekMod(num) {
    return num % 7;
}

function createICal(jsonObj) {
    console.log(jsonObj);
    window.json = jsonObj;
    let vtimezoneComp = new ICAL.Component(ICAL.parse(vtimezone_str));
    let tzid = vtimezoneComp.getFirstPropertyValue('tzid');
    let timezone = new ICAL.Timezone({
        component: vtimezoneComp,
        tzid
    });
    let cal = new ICAL.Component(['vcalendar', [
            ["prodid", {}, "text", "-//SidPagariya.ML//UMich " + jsonObj['term'] + "//EN"],
            ["version", {}, "text", "2.0"],
            ["X-Apple-Calendar-Color", {}, "text", "#FFCD00"]
        ],
        []
    ]); //Or maybe just #002B64 :P
    arbor_time = 'America/Detroit';
    cal.updatePropertyWithValue('X-WR-TIMEZONE', arbor_time);
    cal.addSubcomponent(vtimezoneComp);

    // Need to change this every term :(
    var start_date = new Date(2019, 8, 3); //YEAR, MONTH, DAY. MONTH is 0...11
    var end_date = new Date(2019, 11, 11); //YEAR, MONTH, DAY. MONTH is 0...11

    for (course of jsonObj.schedule) {
        let classTitle = course.course.class;
        let classType = course.course.type;
        let classSec = course.course.sec;
        let classNbr = course.course.nbr;

        for (var i = 0; i < course.sched.length; i++) {
            let byday = course.sched[i].days;
            if (!course.sched[i].time) {
                continue;
            }
            let start_time = course.sched[i].time.from;
            let end_time = course.sched[i].time.to;

            // Need to change this every term :(
            let offset = 6; //Schedules starting on Monday: 7, Tuesday: 6, etc.
            //Fall 2019 ^

            let conversionO = { MO: weekMod(0 + offset), TU: weekMod(1 + offset), WE: weekMod(2 + offset), TH: weekMod(3 + offset), FR: weekMod(4 + offset), SA: weekMod(5 + offset), SU: weekMod(6 + offset) };
            var minDiff = 10;
            for (day of byday) {
                if (conversionO[day] < minDiff) {
                    minDiff = conversionO[day];
                }
            }
            let dtstart = new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate() + minDiff, start_time.hr, start_time.min, 0);
            let dtend = new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate() + minDiff, end_time.hr, end_time.min, 0);
            let location = course['location'][i];
            String.prototype.newFormat = function() {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function(match, number) {
                    return typeof args[number] != 'undefined' ?
                        args[number] :
                        match;
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
            if (classType != 'MID') {
                cal.addSubcomponent(vevent);
            }
        }
    }
    let calendar_str = cal.toString();
    let download_str_uri = 'data:text/calender;charset=utf-8,' + encodeURIComponent(calendar_str);
    console.log(download_str_uri);
    downloadURI(download_str_uri, jsonObj['term'] + '.ics');
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