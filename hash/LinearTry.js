var LinearTry = (function() {
    return function(n) {
        var i = 0;
        return {
            reset: function(key) {
                i = 0
            },
            hash: function(string) {
                return (string.sum() + (i--)) % n;
            }
        }
    }
})();
