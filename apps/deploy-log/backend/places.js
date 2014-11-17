var jive = require('jive-sdk');

exports.configurePlace = function(tenantID, placeURI, prodUrl, uatUrl) {
    return jive.context.persistence.save("places", placeURI, {
        id: placeURI,
        tenantID: tenantID,
        prodUrl: prodUrl,
        uatUrl: uatUrl
    });
};

exports.getPlaceConfiguration = function(tenantID, placeURI) {
    return jive.context.persistence.find("places", {
        id: placeURI,
        tenantID: tenantID
    }).then(function(items) {
        if (items && items.length == 1) {
            return items[0];
        }
    });
};

exports.getPlaces = function() {
    return jive.context.persistence.find("places");
};