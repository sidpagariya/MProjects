//var tbody = document.getElementById('STDNT_WEEK_SCHD$scroll$0').children()[0]
function injectJQ()
{
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
    script.onload = function(){
        $('<script>')
        .attr('type', 'text/javascript')
        .attr('src', '//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js')
        .appendTo('head');
        /*var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = "//github.com/mozilla-comm/ical.js/releases/download/v1.2.2/ical.min.js";
        head.appendChild(script);*/
        //var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children[0];
        var tbody = $('[id="STDNT_WEEK_SCHD$scroll$0"]', $('#ptifrmtgtframe')[0].contentWindow.document).children()[0];
        var termsched = tbody.firstElementChild.firstElementChild.firstElementChild.innerText
        var tbodymain = tbody.children[1].firstElementChild.firstElementChild.firstElementChild
        for (var i=1; i<tbodymain.childElementCount; i++)
        {
            for (var j=0; j<2; j++)
            {
                console.log(tbodymain.children[i].children[j].firstElementChild.innerText);
            }
        }
    }
    head.appendChild(script);
}
injectJQ()

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