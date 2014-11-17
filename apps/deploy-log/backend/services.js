var jive = require('jive-sdk');
var _ = require('underscore');
var url = require('url');
var moment = require('moment-timezone');
var places = require('./places');
var log = require('./deploy-log');

var scheduler = new jive.scheduler.memory();

var updateDeployLog = function(place, installationUrl, type) {
    var credentials = getCredentialsFor(installationUrl);

    if (credentials == null) {
        jive.logger.error('Could not find credentials for installation: '+installationUrl);
        return;
    }

    jive.logger.info('Querying JCA for '+installationUrl);

    var parsedUrl = url.parse(installationUrl, true);

    var apiUrl = credentials.baseUrl + '/api/cloud/v1/users/deployrequests?rows=25&page=0&filter='+JSON.stringify({
        "customerInstallationId": parsedUrl.query.customerInstallationId,
        "onlyShowCompleted":"true"
    });

    jive.util.buildRequest(apiUrl, "GET", null, {
        'Authorization': "Basic " + new Buffer(credentials.username+':'+credentials.password).toString('base64')
    }).then(function(response) {

        var rows = _.filter(response.entity.rows, function(row) {
            return row.description.indexOf('Update Installation') !== -1;
        });

        _.each(rows, function(row) {
            var files = _.map(row.deployFiles, function(file) {
                return file.fileName;
            });

            var entry = {
                tenantID: place.tenantID,
                type: type,
                placeURI: place.id,
                username: row.userName,
                id: row.requestID,
                timestamp: moment.tz(row.requestDate, 'MM/DD/YYYY hh:mm A', "America/Los_Angeles").valueOf(), // We know the TZ for the timestamp is PST
                message: row.deployNotes,
                files: files
            };

            log.addEntry(entry).fail(function() {
                jive.logger.error('Error saving: '+row.requestID, arguments);
            });

        });

    }).fail(function(response) {
        console.log('Error getting deploy for for '+installationUrl, arguments);
    }).done();
};

var getCredentialsFor = function(url) {
    return _.find(jive.service.options['jcaCredentials'], function(creds) {
        return url.indexOf(creds.baseUrl) === 0;
    });
};

var poll = function() {
    places.getPlaces().then(function(places) {
        _.each(places, function(place) {
            try {
                updateDeployLog(place, place.prodUrl, 'prod');
                updateDeployLog(place, place.uatUrl, 'uat');
            } catch (ex) {
                jive.logger.error('Error updating log for place: '+place.id, ex);
            }
        });
    });
};

exports.onBootstrap = function(app) {
    var period = 1800000; // Default to 30 min
    var task = new jive.tasks.build(poll, period, jive.util.guid());
    jive.tasks.schedule(task, scheduler);
};