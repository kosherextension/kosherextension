// Saves options to chrome.storage
function saveOptions() {
    //console.warn("Save");
    var selectedFileTypes = [];
    $.each($("input[name='trustedFiles']:checked"), function () {
        //console.log("adding " + $(this).val());
        selectedFileTypes.push($(this).val());
    });


    console.log("blackListBlock: " + $('#block').val());

    chrome.storage.local.set({
        blackListBlock: $('#block').val(),
        completelyTrust: $('#completelyTrust').val(),
        imagesTrust: $('#imagesTrust').val(),
        videosTrust: $('#videosTrust').val(),
        iframesTrust: $('#iframesTrust').val(),
        downloadsTrust: $('#downloadsTrust').val(),
        fileTypeTrust: selectedFileTypes,
        blockSettings: $("input[name='blockSettings']").prop("checked")
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}


function savePassword() {

    var newPassword = $("#newPassword").val();
    var newPasswordRepeat = $("#newPasswordRepeat").val();

    if (newPassword !== newPasswordRepeat) {
        alert("New passwords do not match");
    }

    chrome.storage.local.get(function (data) {
        //alert(JSON.stringify(data.password));
        var oldPassword = $("#oldPassword").val();
        var actualOldPassword = data.password;
        if (oldPassword !== actualOldPassword && actualOldPassword !== undefined) {
            alert("Incorrect password");
            return;
        }

        chrome.storage.local.set({
            password: $("#newPassword").val()
        }, function () {
            alert("New password has been saved");
        });
    });
}

function init() {

    restoreOptions();
    loadCollapsibles();

    $("#savePassword").click(savePassword);
}

// Restores state using the preferences stored in chrome.storage
function restoreOptions() {
    chrome.storage.local.get(function (data) {
        //console.warn(JSON.stringify(data));
        $('#block').val(data.blackListBlock);
        $('#completelyTrust').val(data.completelyTrust);
        $('#imagesTrust').val(data.imagesTrust);
        $('#videosTrust').val(data.videosTrust);
        $('#iframesTrust').val(data.iframesTrust);
        $('#downloadsTrust').val(data.downloadsTrust);
        //console.log("data.fileTypeTrust: " + data.fileTypeTrust);
        $.each(data.fileTypeTrust, function () {
            //console.log("type: " + this);
            $("input[value='" + this + "']").prop("checked", true);
        });
        $("input[name='blockSettings']").prop("checked", data.blockSettings);
    });

    $('#save').click(saveOptions);
}

function loadCollapsibles() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {

            this.classList.toggle("active");
            var content = this.nextElementSibling.nextElementSibling;
            if (content.style.display === "block") {
                this.value = "+";
                content.style.display = "none";
            } else {
                this.value = "-";
                content.style.display = "block";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);

