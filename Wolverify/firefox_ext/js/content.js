$(document).ready(function () {
    var $head = $('html').find("head")
    var CSSpath = chrome.extension.getURL('css/wolverine.css');
    $head.append($('<link>')
        .attr("rel","stylesheet")
        .attr("type","text/css")
        .attr("href", CSSpath));
    $head.append($("<link/>", {
        rel: "shortcut icon",
        href: "https://sids-files.github.io/UM_BLOCKFAVICON_1.png",
        type: "image/x-icon"
    }));
    // $head.append($("<link/>", { rel: "stylesheet", href: "https://rawgit.com/sidpagariya/Wolverine-CSS/master/wolverine.css", type: "text/css" }));
    $('[alt*="Wait Listed"]').each(function() {
        $(this).attr("src", "https://sids-files.github.io/PS_CS_STATUS_WAITLIST_ICN_1.svg");
        $(this).css("margin-right", "2px");
        $(this).css("height", "14px");
    })
    $('[alt*="Wait List"]').each(function() {
        $(this).attr("src", "https://sids-files.github.io/PS_CS_STATUS_WAITLIST_ICN_1.svg");
        $(this).css("margin-right", "2px");
        $(this).css("height", "14px");
    })
    $('[alt*="Open"]').each(function(){
        $(this).attr("src", "https://sids-files.github.io/PS_CS_STATUS_OPEN_ICN_1.svg");
        $(this).css("margin-right", "2px");
        $(this).css("height", "14px");
    })
    $('[alt*="Closed"]').each(function(){
        $(this).attr("src", "https://sids-files.github.io/PS_CS_STATUS_CLOSED_ICN_1.svg");
        $(this).css("margin-right", "2px");
        $(this).css("height", "14px");
    })
    $('[alt*="Enrolled"]').each(function(){
        $(this).attr("src", "https://sids-files.github.io/PS_CS_STATUS_SUCCESS_ICN_1.svg");
        $(this).css("margin-right", "2px");
        $(this).css("height", "14px");
    })
    $('[name*="DERIVED_SSS_SCL_SSS_GO_"] img').each(function () {
        $(this).attr("src", "https://sids-files.github.io/PT_NAV_GO_1.svg");
    });
    $('[alt*="GO!"]').each(function(){
        $(this).attr("src", "https://sids-files.github.io/PT_NAV_GO_1.svg");
    })
    //$('.PSSTATICIMAGE').each(function(){
    //    $(this).attr('src', 'https://sidpagariya.ml/files/information.svg');
    //});
    $('#processing').each(function () {
        $(this).attr('src', 'https://sids-files.github.io/processing.svg');
    });
    $("#saveWait_win0 > img").src = 'https://sids-files.github.io/processing.svg';
    $("#ACE_width > tbody > tr:nth-child(10) > td:nth-child(1)").colSpan = 4;
});