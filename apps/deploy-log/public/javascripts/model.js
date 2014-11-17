var Update = Backbone.Model.extend({

    formattedTime: function() {
        return moment(this.get('published')).fromNow();
    }

});

var Updates = Backbone.Collection.extend({
    model: Update,

    initialize: function(options) {
        this.place = options.place;
        this.baseUrl = options.baseUrl;
    },

    sync: function(method, model, options) {
        var that = this;
        if (method !== "read") {
            return;
        }

        var url = this.baseUrl + '/deploy-log/log?' + $.param({
            placeURI: this.place.content.toURI(),
            type: options.type
        });

        osapi.http.get({
            'href': url,
            'authz': 'signed',
            'format': 'json',
            'noCache': true
        }).execute(function(response) {
            if (response.status == 200) {
                var batch = osapi.newBatch();
                var data = {};

                _.each(response.content, function(item) {
                    batch.add(item.username, osapi.jive.corev3.people.get({email: item.username}));
                    data[item.username] = item;
                });

                batch.execute(function(map) {

                    _.each(map, function(obj, email) {
                        if (obj.hasOwnProperty('displayName')) {
                            data[email].user = {
                                displayName: obj.displayName,
                                link: obj.resources.html.ref
                            }
                        }
                    });

                    options.success({
                        items: response.content
                    });
                });


            } else {
                options.error(response);
            }
        });
    }
});