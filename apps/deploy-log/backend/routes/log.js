var places = require('../places');
var log = require('../deploy-log');

exports.getConfiguration = {
    'path' : 'log',
    'jiveLocked': true,
    'verb' : 'get',
    'route': function(req, res) {

        log.getLog(req.jive.tenantID, req.query.placeURI, req.query.type).then(function(result) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end( JSON.stringify(result) );
        }, function(err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end( JSON.stringify( err ) );
        });
    }
};