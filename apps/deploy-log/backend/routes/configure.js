var places = require('../places');

exports.saveConfiguration = {
    'path' : 'configure',
    'jiveLocked': true,
    'verb' : 'post',
    'route': function(req, res) {
        places.configurePlace(req.jive.tenantID, req.body.placeURI, req.body.prodUrl, req.body.uatUrl).then(function(result) {
            res.writeHead(result === false ? 204 : 200, { 'Content-Type': 'application/json' });
            res.end( JSON.stringify( { } ) );
        }, function(err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end( JSON.stringify( err ) );
        });
    }
};

exports.getConfiguration = {
    'path' : 'configure',
    'jiveLocked': true,
    'verb' : 'get',
    'route': function(req, res) {
        places.getPlaceConfiguration(req.jive.tenantID, req.query.placeURI).then(function(result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end( JSON.stringify(result) );
        }, function(err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end( JSON.stringify( err ) );
        });
    }
};