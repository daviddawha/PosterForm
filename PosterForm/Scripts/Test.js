(function () {
    var AppView = Backbone.View.extend({
        el: '#tester',

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html("This test!");
        }
    });
    var appView = new AppView();


});