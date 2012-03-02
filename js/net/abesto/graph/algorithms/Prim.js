net.abesto.includeQueue.require({'net.abesto.graph.algorithms': ['ConnectedSubgraph']}, function(){

Namespace('net.abesto.graph.algorithms', {
Prim: (function() {

    var Prim = function(node)
    {
        var v = net.abesto.graph.algorithms.ConnectedSubgraph.find(node),
            vn = new UIDObjectStore(), en = new UIDObjectStore(), e = new UIDObjectStore(),
            emit = net.abesto.SAS.emitFunction(this);

        this.UID = UID();

        this.init = function() {
            emit('set_status_headers', {headers: ['V', 'E', 'V<sub>new</sub>', 'E<sub>new</sub>']});

            v.each(function(n){
                n.setLabel('V');
                e = UIDObjectStore.union(e, n.edges());
            });
            vn.add(node); node.setLabel('P');
        };

        this.step = function() {
            if (v.length() < vn.length()) return;
            var minimal = null;
            e.each(function(e) {
                var n1 = e.node1(), n2 = e.node2(),
                    hasn1 = vn.has(n1), hasn2 = vn.has(n2);

                // x ? !y : y   <==> x XOR y
                e.weight = n1.distanceFrom(n2);
                if ((hasn1 ? !hasn2 : hasn2) && (minimal === null || e.weight < minimal.weight)) {
                    minimal = e;
                }
            });

            var n1 = minimal.node1(), n2 = minimal.node2(),
                hasn1 = vn.has(n1);

            en.add(minimal);
            emit('highlight_edge', {edge: minimal});

            var newNode = hasn1 ? n2 : n1;
            newNode.setLabel('P');
            vn.add(newNode);

            emit('set_status_data', {columns:[v,e,vn,en]});

            return (v.length() - vn.length());
        };
    };

    return Prim;
})()
});
});