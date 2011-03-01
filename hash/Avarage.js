var Avarage = (function() {
    var i;

    // Range initialization
    Avarage.range = [];
    for (i = 65; i <= 90; i++) {
        Avarage.range.push(String.fromCharCode(i))
    }

    var Constructor = function(positions)
    {
        return {
            range: Avarage.range,
            generate: function(data) {
                var sum = 0, i;
                for (i in positions) {
                    sum += data.charCodeAt(positions[i]);
                }
                return String.fromCharCode(Math.round(sum / positions.length));
            }
        }
    };
})();
