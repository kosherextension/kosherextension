function UrlMatchesList(url, commaSeparatedList) {
    if (url == null || commaSeparatedList == null) {
        return false;
    }

    var listEntries = commaSeparatedList.split(",");
    listEntries = listEntries.map(s => s.trim());

    listEntries.forEach(listEntry => {
        
        var match = url !== "" && listEntry !== "" && url.includes(listEntry);

        console.warn(url + " contains " + listEntry + "?: " + match);
        if (match == true) {
            console.log("REturning true for match");
            return true;
        }
    });

    return false;
}