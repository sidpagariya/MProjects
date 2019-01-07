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

function weekMod(num){
    return num%7;
}
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
    ["version", {}, "text", "2.0"],
    ["X-Apple-Calendar-Color", {}, "text", "#FFCD00"]], []]); //Or maybe just #002B64 :P
    arbor_time = 'America/Detroit';
    cal.updatePropertyWithValue('X-WR-TIMEZONE', arbor_time);
    cal.addSubcomponent(vtimezoneComp);

    // Need to change this every term :(
    var start_date = new Date(2019, 0, 9); //YEAR, MONTH, DAY. MONTH is 0...11
    var end_date = new Date(2019, 3, 23); //YEAR, MONTH, DAY. MONTH is 0...11

    for(course of jsonObj.schedule) {
        let classTitle = course.course.class;
        let classType = course.course.type;
        let classSec = course.course.sec;
        let classNbr = course.course.nbr;

        for (var i=0; i<course.sched.length; i++){
            let byday = course.sched[i].days;
            if (!course.sched[i].time){
                continue;
            }
            let start_time = course.sched[i].time.from;
            let end_time = course.sched[i].time.to;

            // Need to change this every term :(
            let offset = 5; //Schedules starting on Monday: 7, Tuesday: 6, etc.
            //Winter 2019 ^

            let conversionO = {MO:weekMod(0+offset),TU:weekMod(1+offset),WE:weekMod(2+offset),TH:weekMod(3+offset),FR:weekMod(4+offset),SA:weekMod(5+offset),SU:weekMod(6+offset)};
            var minDiff = 10;
            for (day of byday){
                if (conversionO[day] < minDiff){
                    minDiff = conversionO[day];
                }
            }
            let dtstart = new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate()+minDiff, start_time.hr, start_time.min, 0);
            let dtend = new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate()+minDiff, end_time.hr, end_time.min, 0);
            let location = course['location'][i];
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
            if (classType != 'MID'){
                cal.addSubcomponent(vevent);
            }
        }
    }
    // let calendar_str = cal.toString();
    // let download_str_uri = 'data:text/calender;charset=utf-8,' + encodeURIComponent(calendar_str);
    // console.log(download_str_uri);
    return cal;
}

chrome.pageAction.onClicked.addListener(function (tab) {
    currentTab = tab;
    chrome.tabs.sendMessage(
        tab.id,
        {msg: 'get_userdata'},
        responseCallback=function(userdata) {
            calender = createICal(userdata, tab);
            let calendar_str = calender.toString();
            let download_str_uri = 'data:text/calender;charset=utf-8,' + encodeURIComponent(calendar_str);
            chrome.downloads.download({
                url: download_str_uri,
                filename: userdata.term+".ics",
                saveAs: true
            });
        }
    );
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'https://csprod.dsc.umich.edu/psp/csprodnonop/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});