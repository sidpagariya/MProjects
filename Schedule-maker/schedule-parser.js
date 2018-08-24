function injectJQ()
{
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
    script.onload = function(){
        performOps();
    }
    head.appendChild(script);
}
injectJQ()
function performOps(){
    $('<script>')
    .attr('type', 'text/javascript')
    .attr('src', '//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js')
    .appendTo('head');

    var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children()[0];
    var termsched = tbody.firstElementChild.firstElementChild.firstElementChild.innerText
    console.log(termsched);
    var tbodymain = tbody.children[1].firstElementChild.firstElementChild.firstElementChild

    jsonObj = []
    for (var i=1; i<tbodymain.childElementCount; i++){
        item = {}
        var course = tbodymain.children[i].children[0].firstElementChild.innerText.split('\n');
        item["class"] = course[0].split("-")[0]+" - "+course[1].split(" ")[0];
        var sched = tbodymain.children[i].children[1].firstElementChild.innerText.split('\n');
        item["sched"] = sched[0];
        item["location"] = sched[1];
        jsonObj.push(item);
    }
    createICal(jsonObj);
}
function createICal(jsonObj){
    console.log(jsonObj);
    var start_date = new Date(2018, 8, 5);
    var end_date = new Date(2018, 12, 11);
}
/*function performOps()
{
    //$('<script src="//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js"></'+'script>').appendTo($('head'));
    $('<script>')
    .attr('type', 'text/javascript')
    .attr('src', '//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js')
    .appendTo('head');
    var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe').contentWindow.document).children[0];
    var termsched = window.tbody.firstElementChild.firstElementChild.firstElementChild.innerText
    var tbodymain = window.tbody.children[1].firstElementChild.firstElementChild.firstElementChild
    for (var i=1; i<tbodymain.childElementCount; i++)
    {
        for (var j=0; j<2; j++)
        {
            console.log(tbodymain.children[i].children[j].firstElementChild.innerText);
        }
    }
}
performOps();*/