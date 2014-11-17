function getServiceHost() {
    var url = gadgets.util.getUrlParameters()['url'];
    var parts  = url.split("/");

    return parts[0] + "//" + parts[2];
}

