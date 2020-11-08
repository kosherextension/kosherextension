const filter = {
    urls: [
        '*://*/*',
    ],
};

const webRequestFlags = [
  'blocking',
];

var CompletelyTrustList;
var TrustForImagesList;
var TrustForVideosList;
var TrustForIFrameList;
var TrustForDownloadsList;
var TrustedFileTypeList;
var BlockSettings;
var BlackListBlock;

function refreshLocalData() {
    chrome.storage.local.get(function (data) {

        CompletelyTrustList = data.completelyTrust;
        TrustForImagesList = data.imagesTrust;
        TrustForVideosList = data.videosTrust;
        TrustForIFrameList = data.iframesTrust;
        TrustForDownloadsList = data.downloadsTrust;
        TrustedFileTypeList = data.fileTypeTrust;
        BlockSettings = data.blockSettings;
        BlackListBlock = data.blackListBlock;
    });
}

function checkForTabBlock(tab) {
    var uri = new URI(tab.url);
    console.log("CheckForTabBlock: " + tab.url);

    // Check additional parameter to see if PW was given along with the blocked URL
    var pwEntered = false;
    var isSettings = uri.protocol().toLowerCase() === "chrome" && tab.url != "chrome://newtab/";
    var isBlockedSettings = isSettings && BlockSettings;
    var isBlackUrl = UrlMatchesList(tab.url, BlackListBlock);
    var isExtension = tab.url.includes("extension"); // FIXME: remove after development

    console.log("url: " + tab.url + ", uri.protocol(): " + uri.protocol() + ", isSettings: " + isSettings + ", blockedSettings: " + isBlockedSettings + ", blackUrl: " + isBlackUrl + ", isExtension: " + isExtension);

    if (isExtension) {
        return false;
    }

    if (isBlackUrl && !pwEntered) {
        console.log("BLOCK " + tab.url);
        chrome.tabs.update(tab.id, { url: chrome.extension.getURL("blocked.html?url=" + tab.url) });
    }
}


chrome.tabs.onUpdated.addListener(
    function (activeInfo, changeinfo, tab) {
        chrome.tabs.get(tab.id, checkForTabBlock);
    }
);


chrome.tabs.onActivated.addListener(
    function (activeInfo) {
        chrome.tabs.get(activeInfo.tabId, checkForTabBlock);
    }
);


window.chrome.webRequest.onBeforeRequest.addListener(
    page => {
        //alert('asdf');
        refreshLocalData();

        //alert("Page = " + JSON.stringify(page));
        //console.log("Web request for a " + page.type);
        //if (page.type != "image" && page.type != "xmlhttprequest" && page.type != "stylesheet" && page.type != "font" && page.type != "script" && page.type != "main_frame" && page.type != "ping") {
        //    //alert(JSON.stringify(page));
        //}
        //if (page.type === 'image') {
        //    //alert("Page = " + JSON.stringify(page));
        //}
        //var bgDomain = window.location.hostname;

        var completelyTrust = UrlMatchesList(page.initiator, CompletelyTrustList) || UrlMatchesList(page.url, CompletelyTrustList);

        var requestingImage = page.type === 'image' || page.type === 'media' || page.type === 'media' || page.type === 'bmp' || page.type === 'gif' || page.type === 'png' || page.type === 'jpeg';
        //console.log("requesting img: " + requestingImage);
        if (requestingImage) {

            var trustForImages = completelyTrust || UrlMatchesList(page.initiator, TrustForImagesList) || UrlMatchesList(page.url, TrustForImagesList);
            console.log("completelyTrust: " + completelyTrust + " trustForImages: " + trustForImages);
            return {
                cancel: !trustForImages
            };
        }
       
        return {
            cancel: false
        };
    },
    filter,
    webRequestFlags
);

window.chrome.downloads.onCreated.addListener(
    function (download) {
        console.log("Attempting to download a " + download.mime);
        refreshLocalData();
        console.log(JSON.stringify(download));
        
        var completelyTrust = UrlMatchesList(download.finalUrl, CompletelyTrustList);
        var trustForDownloads = completelyTrust || UrlMatchesList(download.finalUrl, TrustForDownloadsList);
        var trustedFileType = TrustedFileTypeList?.includes(download.mime);
        console.log("completelyTrust=" + completelyTrust + ", trustForDownloads=" + trustForDownloads + ", trustedFileType=" + trustedFileType);
        if (trustForDownloads || trustedFileType) {
            return;
        }

		if (download.state == "in_progress") {
			chrome.downloads.cancel(download.id);
			alert("Warning! The download has been blocked by the Administrator. (mime is " + download.mime + ")");
		} else if(item.state == "complete"){
			chrome.downloads.removefile(download.id);
			alert("Warning! The download has been blocked by the Administrator. (mime is " + download.mime + ")");
		}
    }
);