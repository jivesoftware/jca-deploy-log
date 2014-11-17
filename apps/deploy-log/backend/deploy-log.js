var jive = require('jive-sdk');

exports.getLog = function(tenantID, placeURI, type) {
    return jive.context.persistence.find("deployLog", {
        placeURI: placeURI,
        tenantID: tenantID,
        type: type
    });
};

exports.addEntry = function(entry) {
    return jive.context.persistence.save("deployLog", entry.id, entry);
};
