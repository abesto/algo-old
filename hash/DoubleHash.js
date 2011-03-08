var DoubleHash = (function() {
    return function(n) {
        var i = 0, k = 0, mod = 0, mod1 = 0, positive = true;

        while (mod < n) {
            mod1 = k*4 + 3;
            mod = (++k)*4 + 3
        }

        return {
            reset: function(key) {
                i = 0
            },
            hash: function(string) {
                var sum = string.sum();
                return (sum - (sum % mod1 + 1)*(i++)) % mod;
            }
        }
    }
})();

