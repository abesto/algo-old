Namespace('net.abesto.graph', {

StatusUI: (function() {
    var Constructor = function($elem) {
        this._setStatusHeaders = function(signal) {
            console.log(signal);
        };
    };

    Constructor.prototype.listenTo = function(sender) {
        net.abesto.SAS.addStrictSlot('set_status_headers', this._setStatusHeaders, sender.UID);
    };

    return Constructor;
})()
});