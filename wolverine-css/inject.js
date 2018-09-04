$(document).ready(function(){
    var $head = $('html').find("head")
    $head.append($("<link/>", { rel: "shortcut icon", href: "https://csprod.dsc.umich.edu/cs/csprodnonop/cache_PT85519/UM_BLOCKFAVICON_1.PNG", type: "image/x-icon" }));
    $head.append($("<link/>", { rel: "stylesheet", href: "https://rawgit.com/sidpagariya/Wolverine-CSS/master/wolverine.css", type: "text/css" }));
    $('[name*="DERIVED_SSS_SCL_SSS_GO_"] img').each(function() {
	    $(this).attr("src","https://sids-files.github.io/PT_NAV_GO_1.svg");
	    $(this).css("padding-left", "5px");
	    $(this).css("padding-top", "2px");
    });
    $('.PSSTATICIMAGE').each(function(){
        $(this).attr('src', 'https://sidpagariya.ml/files/information.svg');
    });
    $('#processing').each(function(){
        $(this).attr('src', 'https://sids-files.github.io/processing.svg');
    });
});
