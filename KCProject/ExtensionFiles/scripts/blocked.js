function init() {

    const currentUrl = new URL(location);
    const urlParam = currentUrl.searchParams.get('url') || '';

    console.log("Blocked urlParam: " + urlParam);
    $("#blockedUrl").text(urlParam);

    $("#submit").click(goToUrl);
}

function goToUrl() {
    var blockedUrl = $("#blockedUrl").text();
    var pwEntered = $("#passwordEntered").val();
    alert("Redirecting to url with password: " + blockedUrl + " with password: " + pwEntered);

    var urlWithPw = new URL(blockedUrl);
    urlWithPw.searchParams.set("password", pwEntered);
    alert(urlWithPw.toString());
    window.location.href = urlWithPw.toString();
}

document.addEventListener('DOMContentLoaded', init);