var infinity = '∞';

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

(function() {
    var from = Namespace.from;

    Namespace.baseUri = '../js/';
    Namespace.includeMultiple = function() {
        var args = Array.prototype.slice.call(arguments);
        args.map(Namespace.include);
    };
    Namespace.from = function(prefix) {
        var x = from.call(Namespace);
        x.includeMultiple = function() {
            var args = Array.prototype.slice.call(arguments);
            args.map(function(identifier) { Namespace.include(prefix + '.' + identifier); });
        };
        return x;
    };
})();

Namespace('net.abesto', {
    GET: (function() {
        var i, params = window.location.search.substr(1).split('&').map(
                function(string) {
                    var split = string.split('=');
                    return { key: split[0], value: split[1] };
                });
        for (i = 0; i < params.length; i++) {
            params[params[i].key] = params[params[i]];
        }

        return function(name, def) { return params[name] ? params[name].value : def; }
    })()
});