Namespace('net.abesto.graph.algorithms', { ConnectedSubgraph: {
    find: function(node) {
        var v = new UIDObjectStore(), queue = [node];

        while (queue.length > 0) {
            var n = queue.pop();
            v.add(n);
            n.neighbors().each(function(x){
                if(!v.has(x))queue.push(x);
            });
        }

        return v;
    }
}});