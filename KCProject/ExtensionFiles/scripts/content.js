// This script runs on each individual page/tab

document.documentElement.style.visibility = 'hidden';
document.addEventListener('DOMContentLoaded', function () {
    block();
    document.documentElement.style.visibility = '';
});

var BlockVideoMessage = '<span style="color:red">Video has been blocked by KosherChrome</span>';
var BlockImageMessage = '<span style="color:red"></span>';
var BlockPage = 'views/blocked.html';

var URL = window.location.href;
var Block = false;
var PwEntered = false;
var CompletelyTrust = false;
var TrustForImages = false;
var TrustForVideos = false;
var TrustForIFrame = false;
var TrustForDownloads = false;


chrome.storage.local.get(function (data) {
    //console.warn("local data: " + JSON.stringify(data));
    //console.warn("URL: " + URL);
    //console.warn("Location: " + JSON.stringify(window.location));
    Block = UrlMatchesList(URL, data.blackListBlock);
    CompletelyTrust = UrlMatchesList(URL, data.completelyTrust);
    TrustForImages = CompletelyTrust || UrlMatchesList(URL, data.imagesTrust);
    TrustForVideos = CompletelyTrust || UrlMatchesList(URL, data.videosTrust);
    TrustForIFrame = CompletelyTrust || UrlMatchesList(URL, data.iframesTrust);
    TrustForDownloads = CompletelyTrust || UrlMatchesList(URL, data.downloadsTrust);

    console.log("url: " + URL + ", data.blackListBlock: " + data.blackListBlock + ", Block: " + Block);
});


function block() {

   

    if (Block && !PwEntered) {
        var blockedLocation = chrome.extension.getURL(BlockPage);
        var blockedUrl = blockedLocation + '?url=' + URL;

        console.log("BLOCK " + URL + '; location = ' + blockedLocation + '; URL = ' + blockedUrl);
        window.location.href = blockedUrl;
        
        return;
    }

    if (!TrustForIFrame) {
        $("iframe").replaceWith(BlockImageMessage);
    }

    if (!TrustForImages) {
        $("img").replaceWith(BlockImageMessage);
        $("*").css('background-image', 'none');
        $("*").removeAttr('placeholder');
        $("*").removeAttr('data-sprite');
        $("*").removeAttr('data-previewvideo');
    }

    if (!TrustForVideos) {
        $(".html5-video-player").replaceWith(BlockVideoMessage);
        $("a[href*='amazon.de']").each(function () { $(this).attr("href", $(this).attr("href") + "?&tag=produkt-20-21"); });
        $("a[href*='amazon.com']").each(function () { $(this).attr("href", $(this).attr("href") + "?&tag=amazon-19-20"); });
        $("a[href*='amazon.co.uk']").each(function () { $(this).attr("href", $(this).attr("href") + "?&tag=amazon-22-21"); });
        $("a[href*='youtube']").closest("div[class*='_5cwb']").replaceWith(BlockVideoMessage);
        $("a[href*='youtu.be']").closest("div[class*='_5cwb']").replaceWith(BlockVideoMessage);
        $("div[class*='_5mly']").replaceWith(BlockVideoMessage);
        $("object[type='application/x-shockwave-flash']").replaceWith(BlockVideoMessage);
        $("video").remove();
        $("video-element").replaceWith(BlockVideoMessage);
        $("#player-mole-container").replaceWith(BlockVideoMessage);
        $(".player_container").replaceWith(BlockVideoMessage);
        $("[src*='youtube.com']").replaceWith(BlockVideoMessage);
    }
}


window.setInterval(function(){
	block();
}, 200);


window.addEventListener("load", block, false);
window.addEventListener("DOMContentLoaded", block, false);

