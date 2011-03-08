var QuadraticTry = (function() {
    return function(n) {
        var i = 1, k = 0, mod = 0, positive = true;

        while (mod < n) {
            mod = (++k)*4 + 3
        }

        return {
            reset: function(key) {
                i = 0
            },
            hash: function(string) {
                var ret;
                if (positive) {
                    ret = i*i;
                } else {
                    ret = -(i*i);
                    i++;
                }
                positive = !positive;
                return (string.sum() + ret) % mod;
            }
        }
    }
})();

