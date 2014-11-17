var UpdatesView = Backbone.View.extend({
    el: $("#log"),
    template: Handlebars.compile($('#t-log').html()),

    initialize: function(options) {
        this.place = options.place;

        this.listenTo(this.model, 'sync', this.render);

        var that = this;

        $(".nav li a").click(function() {
            $(".nav li").removeClass('active');
            $(this).parent().addClass('active');

            that.fetch();
        });

        this.fetch();
    },

    fetch: function() {
        var type = $(".nav li.active a").data('type');

        this.model.fetch({
            type: type
        });
    },

    render: function(model, response, opts) {
        console.log('response in view: ', response);

        var autolinker = new Autolinker({
            stripPrefix: false
        });

        _.each(response.items, function(item) {
            item.message = autolinker.link(item.message);
            item.formattedTimestamp = moment(item.timestamp).format('MM/DD/YYYY hh:mm A')
        });

        this.$el.html(this.template({
            entries: response.items
        }));

        this.trigger('viewLoaded');
    }

});

