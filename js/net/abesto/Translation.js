Namespace('net.abesto', {

JsonRemote: (function() {
    var cache = {};

    return function(lang, path, callback) {
        path = path || './translations/';
        lang = lang || net.abesto.GET('lang', 'hu');
        var cacheKey = path + lang;

        if (cache[cacheKey]) {
            if (typeof callback === 'function') callback(cache[cacheKey]);
        } else {
            $.ajax(path + lang + '.json', { dataType: 'json' }).success(
                function(data) {
                    cache[cacheKey] = data;
                    if (typeof callback === 'function') callback(data);
                });
        }
    }
})(),

Translation: (function() {

    function Pair(node, key, data) {
        this._node = $(node);
        this._key = key;
        this._data = data;
        this._parameters = {};
        $(this._node).data('translation', this);
    }

    Pair.prototype.update = function(data, parameters) {
        var split = this._key.split('.'), value;

        if (data) this._data = data;
        if (parameters) this._parameters = parameters;

        value = this._data;
        while (split.length > 0 && value) {
            value = value[split.shift()];
        }
        if (!value) { return false; }

        console.log(this._node, parameters, value);

        for (prop in this._parameters) {
            value = value.replace('{' + prop + '}', this._parameters[prop]);
        }

        this._node.html(value);
        return true;
    };

    function Constructor(data) {
        this._pairs = [];
        this._data = data || {};
    }

    Constructor.prototype.update = function(data) {
        var i;
        
        if (typeof data === 'undefined') { this.loadRemote(); }
        else {
            this._data = data;
            for (i = 0; i < this._pairs.length; i++) {
                this._pairs[i].update(this._data);
            }
        }
    };

    Constructor.prototype.bind = function(node, key, parameters) {
        var pair = new Pair(node, key);
        this._pairs.push(pair);
        return pair.update(this._data, parameters);
    };

    Constructor.prototype.unbind = function(pair) {
        pair._node.data('translation', undefined);
        this._pairs = this._pairs.slice(this._pairs.indexOf(pair), 1);
    };

    return Constructor;
})()

});